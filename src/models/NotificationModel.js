'use strict';
import React, {Component} from 'react';
import {ReactNative, Alert} from 'react-native';
import fb from '../utils/FirebaseAPI'
import _ from 'lodash';
import CliqueModel from './CliqueModel';
import VisualModel from './VisualModel';
import UserModel from './UserModel';

const NotificationModel = {
  push(notificaion, fnCallback) {
    let data = {...notificaion};
    if (!data.createdAt) {
      data.createdAt = fb.timestamp();
    }
    data.updatedAt = data.createdAt;
    var notifiRef = fb.push('/notificaions/', data);  
  
  },
  once(event, fnCallback) {
    if (!fnCallback) {
      fnCallback = event;
      event = 'value';
    } 
    return fb.ref('/notificaions/').orderByChild("createdAt").once(event, fnCallback);
  },
  on(event, fnCallback) {
    if (!fnCallback) {
      fnCallback = event;
      event = 'value';
    } 
    fb.ref('/notificaions/').on(event, fnCallback);
  },
  on_child_added(fnCallback) {
    VisualModel.on('child_added', fnCallback);
  },
  off(event) {
    fb.ref('/notificaions/').off(event);
  },
  off_child_added() {
    VisualModel.off('child_added')
  },
  ////////////////////////////////////
  getNotificationOnUser(lastId,counter,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/userNotifys/').off(); 
    
     if(lastId == null){
       return fb.ref('/userNotifys/' + uid + "/").orderByKey().limitToLast(counter).once('value',function(snapshot) {
         NotificationModel.getNotificationOnList(snapshot.val(),fnCallBack);
       });
     }
     return fb.ref('/userNotifys/' + uid + "/").orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
      NotificationModel.getNotificationOnList(snapshot.val(),fnCallBack);
     });
  },
  getNotificationOnList(notifiIds,fnCallBack){ 
    if(!notifiIds){
      fnCallBack();
      return;
    }
    Promise.all(
       Object.keys(notifiIds).map(notifiId =>{
        return new Promise(function (resolve, reject) {  
           fb.ref("/notifications/").orderByKey().equalTo(notifiId).once('value').then(snapshot => {
              let notify = null;
              snapshot.forEach(function(row) {       
                notify = row.val();                 
              });   
              UserModel.getUniqueUser(notify.senderUid,(userData)=>{                                   
                  resolve ( _.extend(notify, {key: notifiId,userName: userData.name,
                  }))
               })             

            });
         }).then( (notify) => {
          return new Promise(function (resolve, reject) {  
            if(notify.type == "clique"){
              CliqueModel.getUniqueClique(notify.toCliqueId,(cliqueData)=>{                   
                resolve ( _.extend(notify, {key: notifiId,photoURL:cliqueData.avatar.uri}));
              })
            }
            else if(notify.type == "visual"){
            
                 VisualModel.getUniqueVisual(notify.toVisualId,(visualData)=>{
                  let photoUrl = null;
                  if(visualData.type == 'image'){
                    photoUrl = visualData.url
                  } else if(visualData.type == 'video' || visualData.type == 'link'){
                    photoUrl = visualData.thumbnail
                  }
                  resolve( _.extend(notify, {key: notifiId,photoURL:photoUrl}));

               
              })
            }
          })
         })
      })
    ).then(notifyList => {
     // console.log(friendList);
      fnCallBack(notifyList);
    });   
  },
}
export default NotificationModel;