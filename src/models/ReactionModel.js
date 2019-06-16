'use strict';
import React, {Component} from 'react';
import {ReactNative, Alert} from 'react-native';
import fb from '../utils/FirebaseAPI'
import _ from 'lodash';
import UserModel from './UserModel';
import VisualModel from './VisualModel';

const ReactionModel = {
  push(reaction, fnCallback) {
    let data = {...reaction};
    if (!data.createdAt) {
      data.createdAt = fb.timestamp();
    }
    var reactionRef = fb.push('/reactions/', data);  
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
  getReactionOnVisual(visualID,lastId,counter,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/visuals/').off(); 
    
     if(lastId == null){
       return fb.ref('/visualReactions/' + visualID + "/").orderByKey().limitToLast(counter).once('value',function(snapshot) {
         ReactionModel.getReactionOnList(snapshot.val(),fnCallBack);
       });
     }
     return fb.ref('/visualReactions/' + visualID + "/").orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
      ReactionModel.getReactionOnList(snapshot.val(),fnCallBack);
     });
  },
  getReactionOnList(reactIds,fnCallBack){ 
    if(!reactIds){
      fnCallBack();
      return;
    }
    Promise.all(
       Object.keys(reactIds).map(reactId =>{
        return new Promise(function (resolve, reject) {  
          fb.ref("/reactions/").orderByKey().equalTo(reactId).once('value').then(snapshot => {
              let react = null;
              snapshot.forEach(function(row) {       
                react = row.val();                 
              });  
              UserModel.getUniqueUser(react.senderUid,(userData)=>{                                   
               // resolve ( _.extend(react, {key: reactId,personURL:userData.avatar.uri}));
               resolve ( _.extend(react, {key: reactId,userName: userData.name,
                photoURL: !!userData.photoURL ?userData.photoURL : null}));
              })
            });
         })
      })
    ).then(reactList => {
     // console.log(friendList);
      fnCallBack(reactList);
    });   
  },
  getReactionOnUser(uid,lastId,counter,fnCallBack){
    // let currentUser = fb.currentUser();  
    // let uid = currentUser.uid;
    fb.ref('/userReactions/' + uid + "/").off();     
     if(lastId == null){
       return fb.ref('/userReactions/' + uid + "/").orderByKey().limitToLast(counter).once('value',function(snapshot) {
         ReactionModel.getReactionWithVisualOnList(snapshot.val(),fnCallBack);
       });
     }
     return fb.ref('/userReactions/' + uid + "/").orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
      ReactionModel.getReactionWithVisualOnList(snapshot.val(),fnCallBack);
     });
  },
  getReactionWithVisualOnList(reactIds,fnCallBack){ 
    if(!reactIds){
      fnCallBack();
      return;
    }
    Promise.all(
       Object.keys(reactIds).map(reactId =>{
        return new Promise(function (resolve, reject) {  
          fb.ref("/reactions/").orderByKey().equalTo(reactId).once('value').then(snapshot => {
              let react = null;
              snapshot.forEach(function(row) {       
                react = row.val();                 
              });  
              resolve ( _.extend(react, {key: reactId}));
              
            });
         }).then((react) =>{
          return new Promise(function (resolve, reject) { 
            VisualModel.getUniqueVisual(react.toVisualId,(visualData)=>{     
              let photoUrl = null;
              let text = '';
              let webUrl = null;
              if(visualData.type == 'image'){
                photoUrl = visualData.url
              } else if(visualData.type == 'video' || visualData.type == 'mood'){
                photoUrl = visualData.thumbnail
              } else if(visualData.type == 'text' ){
                text = visualData.text
              } else if(visualData.type == 'link' ){
                webUrl = visualData.url
                photoUrl = visualData.thumbnail
              } 

             resolve ( _.extend(react, {visualId: visualData.key,
              visualType:visualData.type,
              text:text, 
              photoURL:photoUrl || null,
              webUrl:webUrl||null,
              ratio: visualData.ratio}));
            })
          })

         })
      })
    ).then(reactList => {
     // console.log(friendList);
      fnCallBack(reactList);
    });   
  },
}
export default ReactionModel;