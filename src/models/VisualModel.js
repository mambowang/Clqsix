'use strict';
import React, {Component} from 'react';
import {ReactNative, Alert} from 'react-native';
import fb from '../utils/FirebaseAPI'
import _ from 'lodash';
import CliqueModel from './CliqueModel';
import   { FirebaseClient ,FirebaseStorageAPI} from '../utils'

const VisualModel = {
  push(visual, fnCallback) {
    let data = {...visual};
    if (!data.createdAt) {
      data.createdAt = fb.timestamp();
    }
    data.updatedAt = data.createdAt;
    let currentUser = fb.currentUser();
    data['uid'] = currentUser.uid;
   // data['posterName'] = currentUser.displayName;
    // if (currentUser.photoURL) {
    //   data['posterImage'] = {uri: currentUser.photoURL};
    // } 
    var cliqueID = data.cliqueID;
    var visualRef = fb.push('/visuals/', data);  
  
    let updates = {}       
    updates['/cliqueVisuals/' + cliqueID + '/'  + visualRef.key + '/' ] = 'true';
   
    fb.ref().update(updates).then(() => {
      fnCallback(visualRef.key);
    })
    //================
     //=====frequency
     var receivedRef = fb.ref('/receivedfrequency/' + cliqueID + '/visual')
     receivedRef.transaction(function(data) {          
       return (data || 0) + 1;
     });
    //  var givenRef = fb.ref('/givenfrequency/' +  currentUser.uid + '/visual')
    //  givenRef.transaction(function(data) {          
    //    return (data || 0) + 1;
    //  });
     var userRef = fb.ref('/users/' + currentUser.uid + '/visualSum')
     userRef.transaction(function(data) {          
       return (data || 0) + 1;
     });     
   //================
    //visualsum
    var cliqueRef = fb.ref('/cliques/' + cliqueID + '/visualSum')
    cliqueRef.transaction(function(data) {          
      return (data || 0) + 1;
    });   
    //end

  },
  once(event, fnCallback) {
    if (!fnCallback) {
      fnCallback = event;
      event = 'value';
    } 
    return fb.ref('/visuals/').orderByChild("createdAt").once(event, fnCallback);
  },
  on(event, fnCallback) {
    if (!fnCallback) {
      fnCallback = event;
      event = 'value';
    } 
    fb.ref('/visuals/').on(event, fnCallback);
  },
  on_child_added(fnCallback) {
    VisualModel.on('child_added', fnCallback);
  },
  off(event) {
    fb.ref('/visuals/').off(event);
  },
  off_child_added() {
    VisualModel.off('child_added')
  },
  getUniqueVisual(visualID,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    fb.ref('/visuals/' + visualID ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          var visualData = snapshot.val();
            CliqueModel.getUniqueClique(visualData.cliqueID,cliqueData => {
              fnCallBack(_.extend(visualData, {key: visualID,
                cliqueUrl: cliqueData.avatar.uri,
                cliqueName: cliqueData.name})); 
            })
                           
        }  
    })
  },
  getVisualLikeStatusPerUid(visualId,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    var likeData = null
    fb.ref('/visualliked/' + visualId + '/' + uid + '/').once('value', function(snapshot) {     
      if(snapshot.val() != null){
        likeData = snapshot.val();                       
      }  
      fnCallBack(likeData);    
  })
  },
  getAllVisuals(lastId,counter,fnCallBack){
    if(lastId == null){
      return fb.ref('/visuals/').orderByKey().limitToLast(counter).once('value',fnCallBack);
    }
    return fb.ref('/visuals/').orderByKey().endAt(lastId).limitToLast(counter).once('value',fnCallBack);
  },
  getVisualIdsWithClique(fnCallBack){
    let currentUser = fb.currentUser();   
    let uid = currentUser.uid;
    let index = 0;
    fb.ref('/followingCliques/' + uid + '/').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val() != null){
          var key = childSnapshot.key;
          fb.ref('/cliqueVisuals/').child(key).child('visuals').once(fnCallBack);
        }        
      });
    })
  },
  likeVisualData(visualKey,fnCallBack){
    let currentUser = fb.currentUser();   
    let uid = currentUser.uid;   
    fb.ref('/visuals/' + visualKey ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        let visualData = snapshot.val();
        const postData = {type : 'like',registedAt:fb.timestamp()}       
        let updates = {}
        updates['/visualliked/' + visualKey + '/' + uid + '/'] = postData
        fb.ref().update(updates).then(() => {         
           fnCallBack("0");//success
         }).catch(() => {
           fnCallBack("1");//error
         })
         {
          //=======notification and reactions
          VisualModel.actNotifiAndReact(visualKey,"liked");
          //=======end
          //=====frequency
            let cliqueID = visualData.cliqueID;
            var receivedRef = fb.ref('/receivedfrequency/' + cliqueID + '/like')
            receivedRef.transaction(function(data) {          
              return (data || 0) + 1;
            });
            var givenRef = fb.ref('/givenfrequency/' + uid + '/like')
            givenRef.transaction(function(data) {          
              return (data || 0) + 1;
            });
          //================
          //reactionsum
            var visualRef = fb.ref('/visuals/' + visualKey + '/reactionSum')
            visualRef.transaction(function(data) {          
              return (data || 0) + 1;
            });         

            //end
          //freqsum
          var cliqueRef = fb.ref('/cliques/' + cliqueID + '/freqSum')
          cliqueRef.transaction(function(data) {          
            return (data || 0) + 1;
          });         

          //end

          //user given freqsum
          var userRef = fb.ref('/users/' + uid + '/givenFreqSum')
          userRef.transaction(function(data) {          
            return (data || 0) + 1;
          });     
          //end 
         }
 
        }else{
          fnCallBack("1");//error
        }  
    })

    
  },
  dislikeVisualData(visualKey,fnCallBack){
    let currentUser = fb.currentUser();   
    let uid = currentUser.uid;
    fb.ref('/visuals/' + visualKey ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        let visualData = snapshot.val();
        const postData = {type : 'dislike',registedAt:fb.timestamp()}   
        let updates = {}
        //updates['/userlike/' + uid + '/'  + visualKey + '/'] = postData
        updates['/visualliked/' + visualKey + '/' + uid + '/'] = postData
        fb.ref().update(updates).then(() => {            
 
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })
        {
          //=======notification and reactions
          VisualModel.actNotifiAndReact(visualKey,"disliked");
          //=======end
          //=====frequency
            let cliqueID = visualData.cliqueID;
            var receivedRef = fb.ref('/receivedfrequency/' + cliqueID + '/dislike')
            receivedRef.transaction(function(data) {          
              return (data || 0) + 1;
            });
            var givenRef = fb.ref('/givenfrequency/' + uid + '/dislike')
            givenRef.transaction(function(data) {          
              return (data || 0) + 1;
            });
          //================reactionsum             
              var visualRef = fb.ref('/visuals/' + visualKey + '/reactionSum')
              visualRef.transaction(function(data) {          
                return (data || 0) + 1;
              });        
              //end
            //freqsum
            var cliqueRef = fb.ref('/cliques/' + cliqueID + '/freqSum')
            cliqueRef.transaction(function(data) {          
              return data  - 1;
            });   
            //end
              //user given freqsum
              var userRef = fb.ref('/users/' + uid + '/givenFreqSum')
              userRef.transaction(function(data) {          
                return data  - 1;
              });     
              //end             
        }            
      }else{
        fnCallBack("1");//error
      } 
    });
  },
  
  shareVisualData(visualKey,fnCallBack){
    let currentUser = fb.currentUser();   
    let uid = currentUser.uid; 
    fb.ref('/visuals/' + visualKey ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        let visualData = snapshot.val();  
   
        const newPostKey = fb.ref('visualShares/' + visualKey ).push().key
        const postData = {uid :uid,visualid: visualKey, registedAt:fb.timestamp()}   
        let updates = {}
        updates['/visualShares/' + newPostKey] = postData
        fb.ref().update(updates).then(() => {        

          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })
        //=======notification and reactions
        VisualModel.actNotifiAndReact(visualKey,"shared");
        //=======end
          //=====frequency
          let cliqueID = visualData.cliqueID;
          var receivedRef = fb.ref('/receivedfrequency/' + cliqueID + '/share')
          receivedRef.transaction(function(data) {          
            return (data || 0) + 1;
          });
          var givenRef = fb.ref('/givenfrequency/' + uid + '/share')
          givenRef.transaction(function(data) {          
            return (data || 0) + 1;
          });
          //================
              //reactionsum
              var visualRef = fb.ref('/visuals/' + visualKey + '/reactionSum')
              visualRef.transaction(function(data) {          
                return (data || 0) + 1;
              });         
   
              //end
              //freqsum
              var cliqueRef = fb.ref('/cliques/' + cliqueID + '/freqSum')
              cliqueRef.transaction(function(data) {          
                return (data || 0) + 1;
              });         

              //end
              //user given freqsum
              var userRef = fb.ref('/users/' + uid + '/givenFreqSum')
              userRef.transaction(function(data) {          
                return (data || 0) + 1;
              });     
              //end 
      }else{
        fnCallBack("1");//error
      } 
    });
  },
  getVisualDataOnIds(visualIds,fnCallBack){ 
    if(!visualIds) {
      fnCallBack();
      return;
    } 

    let currentUser = fb.currentUser();   
    let uid = currentUser.uid;
    VisualModel.getVisualDataOnIdArray(Object.keys(visualIds),fnCallBack);

  },
  getVisualDataOnIdArray(visualIds,fnCallBack){ 
    if(!visualIds) {
      fnCallBack();
      return;
    } 
    let currentUser = fb.currentUser();   
    let uid = currentUser.uid;

    Promise.all(
      visualIds.map(visualId =>{
       return new Promise(function (resolve, reject) {  
            fb.ref("/visuals/" + visualId + "/").once('value').then(snapshot => {
              let visual = snapshot.val();           
              resolve( _.extend(visual, {key: visualId}));
            })
        }).then( (visual) => {
         return new Promise(function (resolve, reject) {  
            fb.ref("/visualliked/" + visual.key + "/").orderByKey().equalTo(uid).once('value').then(snapshot => {
              let likeData = null;
              snapshot.forEach(function(row) {       
                likeData = row.val();                   
              });          
              resolve( _.extend(visual, {likeData: likeData}));
            })
         })
        })
     })
   ).then(visualList => {
    // console.log(friendList);
     fnCallBack(visualList);
   });   
  },
  getVisualDataOnClique(cliqueID,lastId,counter,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    //fb.ref('/cliqueVisuals/').off();  
    if(lastId == null){
      return  fb.ref('/cliqueVisuals/' + cliqueID + '/' ).orderByKey().limitToLast(counter).once('value',function(snapshot) {
        VisualModel.getVisualDataOnIds(snapshot.val(),fnCallBack);
      });
    }
    return fb.ref('/cliqueVisuals/' + cliqueID + '/' ).orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
      VisualModel.getVisualDataOnIds(snapshot.val(),fnCallBack);
    });   
  },
  //used for get cisual datas included selected cliques array
  getVisualDatasOnCliquesIds(visuals,cliques,fnCallBack){
      let resultVisualData = [];
      visuals.forEach((row) =>{
        let visual = row.val();
        cliques.forEach((clique) => {
          if(clique == visual.cliqueID){
            resultVisualData.unshift({key: row.key,  ...visual});
          }
        });        
      });
      fnCallBack(resultVisualData);   
  },
  reportVisual(visualId,userId,fnCallBack){
    fb.ref('/visuals/' + visualId ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        const newReportKey = fb.ref('reportVisuals/').push().key;
        const reportData = {visualId :visualId,reportUid: userId, registedAt:fb.timestamp()}   
        let updates = {}
        updates['/reportVisuals/' + newReportKey] = reportData
        updates['/visualReports/' + visualId + "/" + newReportKey] = "true"
        fb.ref().update(updates).then(() => {  
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })
      }
      
    })
  
  },
  //used for get cisual datas included followed cliques array
  getVisualDataOnFollowing(lastId,counter,followingIds,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    
    //fb.ref('/visuals/').off();
    if(lastId == null){
      return fb.ref('/visuals/').orderByKey().limitToLast(counter).once('value',function(visualSnapshot) {
        VisualModel.getVisualDatasOnCliquesIds(visualSnapshot,followingIds,fnCallBack);
      });
    }
    return fb.ref('/visuals/').orderByKey().endAt(lastId).limitToLast(counter).once('value',function(visualSnapshot) {
      VisualModel.getVisualDatasOnCliquesIds(visualSnapshot,followingIds,fnCallBack);
      });    
   
  },
  getVisualDataOnFollowingOld(lastId,counter,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    return fb.ref('/followingCliques/' + uid + '/').once('value',function(cliqueSnapshot) {
      //fb.ref('/visuals/').off();
      if(lastId == null){
        return fb.ref('/visuals/').orderByKey().limitToLast(counter).once('value',function(visualSnapshot) {
          VisualModel.getVisualDatasOnCliquesIds(visualSnapshot,cliqueSnapshot,fnCallBack);
        });
      }
      return fb.ref('/visuals/').orderByKey().endAt(lastId).limitToLast(counter).once('value',function(visualSnapshot) {
        VisualModel.getVisualDatasOnCliquesIds(visualSnapshot,cliqueSnapshot,fnCallBack);
        });    
    });
  },
  actNotifiAndReact(visualKey,type = "liked"){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/visuals/' + visualKey ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        var visualData = snapshot.val();    
        let bodyText = ' ' + type + ' your visual. ';
        let sendText = '' + currentUser.displayName + bodyText;
       
        let data = {
          senderUid: uid, toCliqueId: visualData.cliqueID,toVisualId: visualKey,
          body: bodyText ,createdAt: fb.timestamp(),type: "visual"
        }
        let reactData = {
          senderUid: uid, toCliqueId: visualData.cliqueID,toVisualId: visualKey,
          body: ' ' + type + ' this visual. ',type: type
           ,createdAt: fb.timestamp(),
        }
        let updates = {}
        const newNotifiKey = fb.ref('notifications/').push().getKey();    
        const newReactionKey = fb.ref('reactions/').push().getKey();
        updates['/notifications/' + newNotifiKey ] = data; 
        updates['/reactions/' + newReactionKey ] = reactData; 
        updates['/visualReactions/' + visualKey + '/' + newReactionKey + '/' ] = 'true'; 
        updates['/userReactions/' + uid + '/' + newReactionKey + '/' ] = 'true';  
        fb.ref().update(updates);
        CliqueModel.getMembersWithCliqueId(visualData.cliqueID,(memberUsers)=>{
          if(memberUsers){
            let updates = {}
            let tokenList = []
            let members = _.remove(memberUsers,function(member){
              return member.uid != uid
            })
            members.forEach(function(member) {
              if(member != null){
                if(member.token){
                  tokenList = _.concat(tokenList,member.token)
                }                
                updates['/userNotifys/' + member.uid + '/' + newNotifiKey + '/' ] = 'true';     
              }        
            });   
            updates['/visualNotifys/' + visualKey + '/' + newNotifiKey + '/' ] = 'true'; 
            
            fb.ref().update(updates);
            if(tokenList.length > 0){
             FirebaseClient.sendRemoteMultiNotification(_.uniq(tokenList),sendText);
            }
           
          }
        });
      }
    });
  },

  postCommentToVisual(visualKey,postData,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    let type = "commented"
    fb.ref('/visuals/' + visualKey ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        var visualData = snapshot.val();           
        let commentData = {
          senderUid: uid, toCliqueId: visualData.cliqueID,toVisualId: visualKey,
          body: postData ,createdAt: fb.timestamp(),type:type
        }
        let updates = {}
        const newCommentKey = fb.ref('reactions/').push().getKey();
        updates['/reactions/' + newCommentKey ] = commentData; 
        updates['/visualComments/' + visualKey + '/' + newCommentKey + '/' ] = 'true'; 
        updates['/visualReactions/' + visualKey + '/' + newCommentKey + '/' ] = 'true'; 
        updates['/userReactions/' + uid + '/' + newCommentKey + '/' ] = 'true';  
        
        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })
        //=======notification and reactions
        VisualModel.actNotifiOnComment(visualKey,visualData.cliqueID,"commented");
        //=======end
        //=====frequency
        let cliqueID = visualData.cliqueID;
        var receivedRef = fb.ref('/receivedfrequency/' + cliqueID + '/comment')
        receivedRef.transaction(function(data) {          
          return (data || 0) + 1;
        });
        var givenRef = fb.ref('/givenfrequency/' + uid + '/comment')
        givenRef.transaction(function(data) {          
          return (data || 0) + 1;
        });
        //================
        //reactionsum
        var visualRef = fb.ref('/visuals/' + visualKey + '/reactionSum')
        visualRef.transaction(function(data) {          
          return (data || 0) + 1;
        });         

        //end
        //freqsum
        var cliqueRef = fb.ref('/cliques/' + cliqueID + '/freqSum')
        cliqueRef.transaction(function(data) {          
          return (data || 0) + 1;
        });         

        //end
        //user given freqsum
        var userRef = fb.ref('/users/' + uid + '/givenFreqSum')
        userRef.transaction(function(data) {          
          return (data || 0) + 1;
        });     
        //end 
      }
    });
  },
  actNotifiOnComment(visualKey,cliqueID,type){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    let bodyText = ' ' + type + ' on your visual. ';
    let sendText = '' + currentUser.displayName + '' + bodyText;
    
    let data = {
      senderUid: uid, toCliqueId: cliqueID,toVisualId: visualKey,
      body: bodyText ,createdAt: fb.timestamp(),type: "visual"
    }    
    
    let updates = {}
    const newNotifiKey = fb.ref('notifications/').push().getKey();           
    updates['/notifications/' + newNotifiKey ] = data;        
    fb.ref().update(updates);
    CliqueModel.getMembersWithCliqueId(cliqueID,(memberUsers)=>{
      if(memberUsers){
        let updates = {}
        let tokenList = []
        let members = _.remove(memberUsers,function(member){
          return member.uid != uid
        })
        members.forEach(function(member) {
          if(member != null){
            if(member.token){
              tokenList = _.concat(tokenList,member.token)
            }                
            updates['/userNotifys/' + member.uid + '/' + newNotifiKey + '/' ] = 'true';      
          }        
        });   
        updates['/visualNotifys/' + visualKey + '/' + newNotifiKey + '/' ] = 'true'; 
        fb.ref().update(updates);
        if(tokenList.length > 0){
          FirebaseClient.sendRemoteMultiNotification(_.uniq(tokenList),sendText);
        }
        
      }
    });
  },
  deleteVisual(visualId,uid,fnCallBack){
    fb.ref('/visuals/' + visualId ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        var visualData = {...snapshot.val()}; 
        var CliqueId =visualData.cliqueID;
        var getVisualNotifyPerIds = new Promise(function(resolve, reject) {         
            VisualModel.getVisualNotifyIds(visualId)
            .then(visualNotifyIds =>{
              VisualModel.getVisualNotifyPerIds(visualNotifyIds,notifiIdList =>{               
                resolve({notifiIdList : notifiIdList})
              })
            })
        });
        var getVisualReactionIds = new Promise(function(resolve, reject) {         
          VisualModel.getVisualReactionIds(visualId)
          .then(visualReactionIds =>{
            VisualModel.getVisualReactionPerIds(visualReactionIds,reactionIdList =>{              
              resolve({reactionIdList : reactionIdList})
            })
          })
        });
        var getVisualReportIds = new Promise(function(resolve, reject) {         
          VisualModel.getVisualReportIds(visualId)
          .then(visualReportIds =>{            
            resolve({visualReportIds : visualReportIds})
          })
        });       
        Promise.all([getVisualNotifyPerIds,getVisualReactionIds,getVisualReportIds])
        .then(function(value) {
          let detailData = {};
          _.map(value,(element) =>{
              return _.extend(detailData,element);
          })
          let visualReportIds = detailData.visualReportIds;
          let reactionIdList = detailData.reactionIdList;
          let notifiIdList = detailData.notifiIdList;          
          let updates = {}
          visualReportIds.forEach(function(visualReportId) {                    
              updates['/reportVisuals/' + visualReportId ] = null;
          });   
          reactionIdList.forEach(function(reactionObj) {                    
            updates['/reactions/' + reactionObj.reactionId ] = null;
            updates['/userReactions/' + reactionObj.uid + '/' +  reactionObj.reactionId] = null;            
          });
          notifiIdList.forEach(function(notifiObj) {                    
            updates['/notifications/' + notifiObj.notifId ] = null;
            updates['/userNotifys/' + notifiObj.uid + '/' +  notifiObj.notifId] = null;            
          });
          updates['/visualComments/' + visualId ] = null;
          updates['/visualNotifys/' + visualId ] = null;
          updates['/visualReactions/' + visualId ] = null;
          updates['/visualReports/' + visualId ] = null;
          updates['/visualShares/' + visualId ] = null;
          updates['/visualliked/' + visualId ] = null;
          updates['/cliqueVisuals/' + CliqueId + '/' +  visualId] = null;
          updates['/visuals/' + visualId ] = null;
          let type = visualData.type;
          if(type == 'image'){
            FirebaseStorageAPI.deleteFileOnFirebase(visualData.url)
            .then(() => {})
            .catch((error) => {});       
          }else if(type == 'video'){
            FirebaseStorageAPI.deleteFileOnFirebase(visualData.url)
            .then(() => {})
            .catch((error) => {});        
            FirebaseStorageAPI.deleteFileOnFirebase(visualData.thumbnail)
            .then(() => {})
            .catch((error) => {});   
          }
          //=====frequency
          var receivedRef = fb.ref('/receivedfrequency/' + CliqueId + '/visual')
          receivedRef.transaction(function(data) { return (data || 1) -1;});
          //==end
          //visualsum
          var userRef = fb.ref('/users/' + uid + '/visualSum')
          userRef.transaction(function(data) {return (data || 1) - 1;});  
          var cliqueRef = fb.ref('/cliques/' + CliqueId + '/visualSum')
          cliqueRef.transaction(function(data) {return (data || 1) - 1;});   
          //end
          fb.ref().update(updates);
            fnCallBack();       
          });
      }
    });
  },
  getVisualNotifyIds (visualId){
    return new Promise(function(resolve, reject) {
      fb.ref('/visualNotifys/' + visualId ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          var visualNotifyIds = snapshot.val(); 
          resolve(Object.keys(visualNotifyIds))
        }else{
          resolve([])
        }
      });
    });
  },
  getVisualNotifyPerIds (notifIds,fnCallBack){
    Promise.all(
      notifIds.map(notifId =>{
       return new Promise(function (resolve, reject) {  
            fb.ref("/notifications/").orderByKey().equalTo(notifId).once('value').then(snapshot => {
              if(snapshot.val() != null){
                let notify = null;
                snapshot.forEach(function(row) {       
                  notify = row.val();                   
                });          
                resolve({notifId:notifId,uid:notify.senderUid});
              }else{
                resolve([])
              }
            })
        })
     })
   ).then(notifiIdList => {
    // console.log(friendList);
     fnCallBack(notifiIdList);
   });   
  },
  getVisualReactionIds (visualId){
    return new Promise(function(resolve, reject) {
      fb.ref('/visualReactions/' + visualId ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          var visualReactionIds = snapshot.val(); 
          resolve(Object.keys(visualReactionIds))
        }else{
          resolve([])
        }
      });
    });
  },
  getVisualReactionPerIds (reactionIds,fnCallBack){
    Promise.all(
      reactionIds.map(reactionId =>{
       return new Promise(function (resolve, reject) {  
            fb.ref("/reactions/").orderByKey().equalTo(reactionId).once('value').then(snapshot => {
              if(snapshot.val() != null){
                let reaction = null;
                snapshot.forEach(function(row) {       
                  reaction = row.val();                   
                });          
                resolve({reactionId:reactionId,uid:reaction.senderUid});
              }else{
                resolve([])
              }
            })
        })
     })
   ).then(reactionIdList => {
    // console.log(friendList);
     fnCallBack(reactionIdList);
   });   
  },
  getVisualReportIds (visualId){
    return new Promise(function(resolve, reject) {
      fb.ref('/visualReports/' + visualId ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          var visualReportIds = snapshot.val(); 
          resolve(Object.keys(visualReportIds))
        }else{
          resolve([])
        }
      });
    });
  },

}
export default VisualModel;