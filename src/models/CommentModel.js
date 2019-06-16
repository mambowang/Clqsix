'use strict';
import React, {Component} from 'react';
import {ReactNative, Alert} from 'react-native';
import fb from '../utils/FirebaseAPI'
import _ from 'lodash';
import UserModel from './UserModel';
import VisualModel from './VisualModel';

const CommentModel = {
  push(comment, fnCallback) {
    let data = {...Comment};
    if (!data.createdAt) {
      data.createdAt = fb.timestamp();
    }
    var commentRef = fb.push('/reactions/', data);  
  },
  once(event, fnCallback) {
    if (!fnCallback) {
      fnCallback = event;
      event = 'value';
    } 
    return fb.ref('/reactions/').orderByChild("createdAt").once(event, fnCallback);
  },
  on(event, fnCallback) {
    if (!fnCallback) {
      fnCallback = event;
      event = 'value';
    } 
    fb.ref('/reactions/').on(event, fnCallback);
  },
  on_child_added(fnCallback) {
    VisualModel.on('child_added', fnCallback);
  },
  off(event) {
    fb.ref('/reactions/').off(event);
  },
  off_child_added() {
    VisualModel.off('child_added')
  },
  getCommentOnVisual(visualID,lastId,counter,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/visualComments/').off(); 
    
     if(lastId == null){
       return fb.ref('/visualComments/' + visualID + "/").orderByKey().limitToLast(counter).once('value',function(snapshot) {
         CommentModel.getCommentOnList(snapshot.val(),fnCallBack);
       });
     }
     return fb.ref('/visualComments/' + visualID + "/").orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
      CommentModel.getCommentOnList(snapshot.val(),fnCallBack);
     });
  },
  getAllCommentOnVisual(visualID,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/visualComments/').off(); 
    
    
    return fb.ref('/visualComments/' + visualID + "/").orderByKey().once('value',function(snapshot) {
      CommentModel.getCommentOnList(snapshot.val(),fnCallBack);
    });
  },
  getUniqueCommentData(commentId,fnCallBack){ 

    fb.ref("/reactions/").orderByKey().equalTo(commentId).once('value').then(snapshot => {
        let comment = null;
        snapshot.forEach(function(row) {       
          comment = row.val();                 
        });  
        UserModel.getUniqueUser(comment.senderUid,(userData)=>{                                   
          // resolve ( _.extend(comment, {key: commentId,personURL:userData.avatar.uri}));
          let finalComment =  ( _.extend(comment, {key: commentId,photoURL:userData.photoURL,userName: userData.name}));
          fnCallBack(finalComment)
        })
      });
      
     
  },
  getCommentOnList(commentIds,fnCallBack){ 
    if(!commentIds){
      fnCallBack();
      return;
    }
    Promise.all(
       Object.keys(commentIds).map(commentId =>{
        return new Promise(function (resolve, reject) {  
          fb.ref("/reactions/" + commentId + "/").once('value').then(snapshot => {
              let comment = snapshot.val();             
              UserModel.getUniqueUser(comment.senderUid,(userData)=>{                                   
               // resolve ( _.extend(comment, {key: commentId,personURL:userData.avatar.uri}));
               resolve ( _.extend(comment, {key: commentId,userName: userData.name,
                photoURL: !!userData.photoURL ?userData.photoURL : null }));
              })
            });
         })
      })
    ).then(commentList => {
     // console.log(friendList);
      fnCallBack(commentList);
    });   
  },


  deleteComment(commentId, visualId, cliqueId,senderUid,fnCallBack){
    fb.ref("/reactions/" + commentId + "/").once('value').then(snapshot => {
      let updates = {};
      if(snapshot.val() != null){      
        updates['/visualComments/' + visualId + '/' + commentId + '/' ] = null; 
        updates['/visualReactions/' + visualId + '/' + commentId + '/' ] = null; 
        updates['/userReactions/' + senderUid + '/' + commentId + '/' ] = null;       
        updates['/reactions/' + commentId ] = null; 
        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })
        //=======notification and reactions
        VisualModel.actNotifiOnComment(visualId,cliqueId,"delete comment");
        //=======end
        //=====frequency
        var receivedRef = fb.ref('/receivedfrequency/' + cliqueId + '/comment')
        receivedRef.transaction(function(data) {          
          return (data || 1) - 1;
        });
        var givenRef = fb.ref('/givenfrequency/' + senderUid + '/comment')
        givenRef.transaction(function(data) {          
          return (data || 1) - 1;
        });
        //================
            //reactionsum
            var visualRef = fb.ref('/visuals/' + visualId + '/reactionSum')
            visualRef.transaction(function(data) {          
              return (data || 1) - 1;
            });         
  
            //end
            //freqsum
            var cliqueRef = fb.ref('/cliques/' + cliqueId + '/freqSum')
            cliqueRef.transaction(function(data) {          
              return (data || 1) - 1;
            });         

            //end
            //user given freqsum
            var userRef = fb.ref('/users/' + senderUid + '/givenFreqSum')
            userRef.transaction(function(data) {          
              return (data || 1) - 1;
            });     
            //end 
      }else{
        fnCallBack("1") //error
      }
       
      
      
    });
  }
}
export default CommentModel;