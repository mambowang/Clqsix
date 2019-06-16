'use strict';

import React, {Component} from 'react';
import {ReactNative, Alert} from 'react-native';
import fb from '../utils/FirebaseAPI'
import _ from 'lodash';
//var titleCase = require('title-case');

const UserModel = {  
  save (user) {
    return new Promise((resolve, reject) => {
      UserModel.findWithEmail(user.email)
        .then(function(old){
          if (!old || old.uid == user.uid) {
            user.sortName = user.name.toLowerCase();
            //user.name = titleCase(user.name);
           fb.update('/users/', user.uid, user)
            .then(() =>{
              resolve(user);
            }).catch(error => {
              reject(error);
            });
          } else {
            reject({message: 'Email is duplicated'});
          }
        }
      ).catch(error => reject(error));
    });
  },
  changePassword (newPass) {
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    return new Promise((resolve, reject) => {
      UserModel.findwithUID(uid)
        .then(function(user){
          if (!!user) {
           fb.update('/users/', user.uid, {password:newPass})
            .then(() =>{
              resolve(user);
            }).catch(error => {
              reject(error);
            });
          } else {
            reject({message: 'Changing passowrd is error'});
          }
        }
      ).catch(error => reject(error));
    });
  },
  edit(user, fnCallback) {
    let {data}= {...user};    
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    data.updatedAt = fb.timestamp();
    data.sortName = data.name.toLowerCase();
    //data.name = titleCase(data.name);

    if (!!fb.fbAuth){
      fb.firebaseAuth.currentUser.updateProfile({
        displayName: data.name,
        photoURL: (!!data.photoURL ? data.photoURL : null)
      });     
    }
    fb.ref('/users/' + uid ).once('value', function(snapshot) {     
      if(snapshot.val() != null){   
        let updates = {}
        updates['/users/' + uid + '/description/'  ] = data.description;
        updates['/users/' + uid + '/name/'  ] = data.name;
        updates['/users/' + uid + '/sortName/'  ] = data.sortName;
        updates['/users/' + uid + '/updatedAt/'  ] = data.updatedAt;
        if(!!data.photoURL){
          updates['/users/' + uid + '/photoURL/'  ] = data.photoURL;
        }   
        fb.ref().update(updates).then(() => {
          return fnCallback("0");//success
        }).catch(() => {
          return fnCallback("1");//error
        })               
      }else{
        return fnCallback("1");//error 
      } 
      
  })
},
  findWithEmail (email) {
    let user = null;
    return fb.ref("/users/").orderByChild("email").equalTo(email).limitToFirst(1).once('value').then(snapshot => {
      snapshot.forEach(function(row) {
        user = row.val();
      });
      return user;
    });
  },
  removeAllWithEmail (email, fnOnComplete) {
    return new Promise((resolve, reject) => {
      var error = null;
      fb.ref('/users/').orderByChild('email').equalTo(email).once('value').then(snapshot => {
        if (!!snapshot) {
          snapshot.forEach(row => {
            if (!!row) row.ref.remove().catch(_error => error = !!_error ? _error : true);
            return !error;
          });
          if (!!error) reject(error === true ? null : error); else resolve();
        } else resolve();
      });
    });
  },
  findWithEmailAndPassword(email, password) {
    return fb.ref("/users/").orderByChild('email').equalTo(email).once('value')
    .then(snapshot => {
      let user = null;
      snapshot.forEach(function(row) {
        if (row.val().password === password) {
          user = row.val();
          
        }
      });
      return user;
    });
  },
  findwithUID(UID){
    return fb.ref("/users/").orderByChild('uid').equalTo(UID).once('value')
    .then(snapshot => {
      let user = null;
      snapshot.forEach(function(row) {       
          user = row.val();        
      });
      return user;
    });
  },
  getUniqueUser(uid,fnCallBack){   
    //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
    fb.ref("/users/").orderByKey().equalTo(uid).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          let user = null;
          snapshot.forEach(function(row) {       
              user = row.val();        
          });         
          fnCallBack(user)  
        }  
    })
  },
  getUniqueUserFreqSum(uid,fnCallBack){   
    //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
    fb.ref("/users/" + uid + '/givenFreqSum/').once('value', function(snapshot) {     
          fnCallBack(snapshot.val() || 0);  
    })
  },
  setPassword(uid, password) {
    return fb.ref("/users/" + uid).set({password: password, updatedAt: fb.timestamp()});
  },
  //callback function on get user data
  getUserListOnIds(Ids,fnCallBack){ 
    if(!Ids){
      fnCallBack();
      return;
    }
    Promise.all(
      Object.keys(Ids).map(userId =>{
       return new Promise(function (resolve, reject) {  
        fb.ref("/users/").orderByChild('uid').equalTo(userId).once('value').then(snapshot => {
            let user = null;
            snapshot.forEach(function(row) {       
                user = row.val();  
            });
            resolve( user);
          })
        })
     })
   ).then(userList => {
    // console.log(friendList);
     fnCallBack(userList);
   }); 
 
  },
  getUserListOnIdArr(Ids,fnCallBack){ 
    if(!Ids){
      fnCallBack();
      return;
    }

    Promise.all(
      Ids.map(userId =>{
       return new Promise(function (resolve, reject) {  
        fb.ref("/users/").orderByChild('uid').equalTo(userId).once('value').then(snapshot => {
            let user = null;
            snapshot.forEach(function(row) {       
                user = row.val();  
            });
            resolve(user)
          })
        })
     })
   ).then(userList => {
    // console.log(friendList);
     fnCallBack(userList);
   }); 

  },
  getFullFriend(fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
    fb.ref('/users/').off();     
    return fb.ref('/users/' + uid + "/friends/").orderByKey().once('value',function(snapshot) {
      UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
    });
  },

  //get freind data for loading last count 
  getAllFriend(lastId,counter,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
    fb.ref('/users/').off(); 
    if(lastId == null){
      return fb.ref('/users/' + uid + "/friends/").orderByKey().limitToFirst(counter).once('value',function(snapshot) {
        UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
      });
    }
    return fb.ref('/users/' + uid + "/friends/").orderByKey().startAt(lastId).limitToFirst(counter).once('value',function(snapshot) {
      UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
    });
  },
  getSearchUser(queryText,fnCallBack){
    fb.ref('/users/').off(); 
    
    return fb.ref('/users/' )
    .orderByChild('sortName')
    //.orderByChild('name')
  
    .startAt(queryText)
    .endAt(queryText+"\uf8ff").once('value',function(snapshot) {
      UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
    });
  },
 //get freind data for loading last count 
 getAllUser(lastId,counter,fnCallBack){
  let currentUser = fb.currentUser();  
  let uid = currentUser.uid;
  //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
  fb.ref('/users/').off(); 
  if(lastId == null){
    return fb.ref('/users/').orderByKey().limitToFirst(counter).once('value',function(snapshot) {
      UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
    });
  }
  return fb.ref('/users/' ).orderByKey().startAt(lastId).limitToFirst(counter).once('value',function(snapshot) {
    UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
  });

  
},
  findLastCreatedClique(UID){
    return fb.ref("/inCliques/" + UID + "/").orderByKey().limitToLast(1).once('value')
    .then(snapshot => {
      let cliqueId = null;
      snapshot.forEach(function(row) {       
        cliqueId = row.key;        
      });
      return cliqueId;
    });
  },
  getFollowCliqueIds(UID){  
    let cliqueIds = [];
    return fb.ref('/followingCliques/' + UID + "/").orderByKey().once('value').then(snapshot => {   
        snapshot.forEach(function(row) {       
          let cliqueId = row.key;       
          cliqueIds = _.concat(cliqueIds,cliqueId) 
        });
        return cliqueIds;     
      
    });
  },
  addManualUserData(){
    return fb.ref('/users/').orderByKey().once('value').then(snapshot => {   
      let updates = {}   
      snapshot.forEach(function(row) {       
        let userData = row.val();       
        updates['/' + row.key + '/sortName/' ] = userData.name.toLowerCase();;
      });    
     
      fb.ref('/users').update(updates).then(() => {
        return;
      })    
  });
  },
  clearDb(){   
    let updates = []   
    fb.ref().set(updates).then((data) => {
      alert(JSON.stringify(data));
        return;
      })    
  },
  updateFCMToken(uid,token){
    // let currentUser = fb.currentUser();  
    // let uid = currentUser.uid;
    return fb.ref('/users/').orderByKey().equalTo(uid).once('value').then(snapshot => {   
      if(snapshot.val() != null){
        let updates = {}    
        updates['/' + uid + '/token/' ] = token;
        fb.ref('/users/').update(updates).then(() => {
          return;
        })
      }else{
        return "1";
      }
    
  });
   
  },
  
  getFrequency(uid,fnCallBack){
    fb.ref('/givenfrequency/').off();   
    return fb.ref('/givenfrequency/').orderByKey().equalTo(uid).once('value',fnCallBack);
  },
  blockUser(blockUserId,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    return fb.ref('/users/').orderByKey().equalTo(blockUserId).once('value').then(snapshot => {   
      if(snapshot.val() != null){
        let updates = {}
        updates['/users/' + uid + '/block_users/' + blockUserId + '/'   ] = "true";
        updates['/users/' + blockUserId + '/blocked_by/' + uid + '/'   ] = "true";        
        fb.ref().update(updates).then(() => {
          return fnCallBack("0");//success
        }).catch(() => {
          return fnCallBack("1");//error
        })               
      }else{
        fnCallBack("1")
      }
    });
  },
  getFullBlockUsers(fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
    fb.ref('/users/').off();     
    return fb.ref('/users/' + uid + "/block_users/").orderByKey().once('value',function(snapshot) {
      UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
    });
  },
  unblockUser(blockUserId,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    return fb.ref('/users/').orderByKey().equalTo(blockUserId).once('value').then(snapshot => {   
      if(snapshot.val() != null){
        let updates = {}
        updates['/users/' + uid + '/block_users/' + blockUserId + '/'   ] = null;
        updates['/users/' + blockUserId + '/blocked_by/' + uid + '/'   ] = null;        
        fb.ref().update(updates).then(() => {
          return fnCallBack("0");//success
        }).catch(() => {
          return fnCallBack("1");//error
        })               
      }else{
        fnCallBack("1")
      }
    });
  },

  
}

export default UserModel;