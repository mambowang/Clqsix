'use strict';
import React, {Component} from 'react';
import {ReactNative, Alert} from 'react-native';
import fb from '../utils/FirebaseAPI';
import _ from 'lodash';
import   { FirebaseClient } from '../utils'
import UserModel from './UserModel';
const CliqueModel = {
  push(clique, fnCallback) {
    let {data,inviteFreinds}= {...clique};
    if (!data.createdAt) {
      data.createdAt = fb.timestamp();
    }
    data.updatedAt = data.createdAt;
    let currentUser = fb.currentUser();
    let uid = currentUser.uid;
    data['uid'] = uid;
    data['memberSum'] = 1;



    var cliqueRef = fb.push('/cliques/', data);

    let updates = {}    
    let inviteFriendArr = [];
    inviteFreinds.forEach((element,i) => {
      inviteFriendArr = _.compact(_.concat(inviteFriendArr,element));
      updates['/invitedUsers/' + cliqueRef.key + '/' + element + '/' ] = 'true';  
      updates['/inviteCliques/' + element + '/' + cliqueRef.key + '/' ] = 'true';  
    });
    updates['/hasUsers/' + cliqueRef.key + '/' + uid + '/' ] = 'true';  
    updates['/inCliques/' + uid + '/' + cliqueRef.key + '/' ] = 'true';  
    //=======notification 
     let sendText = "sent you a clique invite"
     CliqueModel.actNotificationToUsers(cliqueRef.key,inviteFriendArr,sendText);
    //=======end     
    fb.ref().update(updates).then(() => {
        fnCallback(cliqueRef.key);
    })
  },
  edit(clique, fnCallback) {
    let {data,cliqueId}= {...clique};    
    data.updatedAt = fb.timestamp();
    fb.ref('/cliques/' + cliqueId ).once('value', function(snapshot) {     
      if(snapshot.val() != null){   
        let updates = {}
        updates['/cliques/' + cliqueId + '/description/'  ] = data.description;
        updates['/cliques/' + cliqueId + '/location/'  ] = data.location;
        updates['/cliques/' + cliqueId + '/name/'  ] = data.name;
        updates['/cliques/' + cliqueId + '/category/'  ] = data.category;
        updates['/cliques/' + cliqueId + '/updatedAt/'  ] = data.updatedAt;
        if(!!data.avatar.uri){
          updates['/cliques/' + cliqueId + '/avatar/'  ] = data.avatar;
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
  once(event, fnCallback) {
    if (!fnCallback) {
      fnCallback = event;
      event = 'value';
    } 
    return fb.ref('/cliques/').orderByChild("createdAt").once(event, fnCallback);
  },
  on(event, fnCallback) {
    if (!fnCallback) {
      fnCallback = event;
      event = 'value';
    } 
    fb.ref('/cliques/').on(event, fnCallback);
  },
  on_child_added(fnCallback) {
    CliqueModel.on('child_added', fnCallback);
  },
  off(event) {
    fb.ref('/cliques/').off(event);
  },
  off_child_added() {
    CliqueModel.off('child_added')
  },
  sendInviteRequest(cliqueID,toUserId,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        var cliqueData = snapshot.val();      
        let updates = {}
    
        //=======notification 
        let sendText = "sent you a clique invite"
        CliqueModel.actNotificationToUsers(cliqueID,toUserId,sendText)
        //=======end
        updates['/invitedUsers/' + cliqueID + '/' + toUserId ] = "true";
        updates['/inviteCliques/' + toUserId + '/' + cliqueID ] = "true"; 
        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })               
      }else{
        fnCallBack("1");//error
      }  
    })
  },
  getFollowCliques(uid,lastId,counter,fnCallBack){

    fb.ref('/followingCliques/').off();     
     if(lastId == null){
       return fb.ref('/followingCliques/' + uid + "/").orderByKey().limitToLast(counter).once('value',function(snapshot) {
         CliqueModel.getCliqueDataOnList(snapshot.val(),fnCallBack);
       });
     }
     return fb.ref('/followingCliques/' + uid + "/").orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
       CliqueModel.getCliqueDataOnList(snapshot.val(),fnCallBack);
     });    
  },
  getFollowerUsers(lastId,cliqueId,counter,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/followerUsers/').off();    
    if(lastId == null){
      return fb.ref('/followerUsers/' + cliqueId + "/").orderByKey().limitToLast(counter).once('value',function(snapshot) {
        UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
      });
    }
    return fb.ref('/followerUsers/' + cliqueId + "/").orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
      UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
    });
  },
  getFeaturedCliques(lastId,counter,fnCallBack){
   
    //fb.ref('/cliques/').off();
    if(lastId == null){
      return fb.ref('/cliques/').orderByKey().limitToLast(counter).once('value',fnCallBack);
    }
    return fb.ref('/cliques/').orderByKey().endAt(lastId).limitToLast(counter).once('value',fnCallBack);
  },
  getAllCliques(lastId,counter,fnCallBack){
    fb.ref('/cliques/').off('value',fnCallBack);
    if(lastId == null){
      return fb.ref('/cliques/').orderByKey().limitToLast(counter).once('value',fnCallBack);
    }
    return fb.ref('/cliques/').orderByKey().endAt(lastId).limitToLast(counter).once('value',fnCallBack);
  },
  getInvitedUserIds(cliqueId,fnCallBack){
    return fb.ref('/invitedUsers/' + cliqueId + '/').orderByKey().once('value',fnCallBack);
  },
  getInvitedCliquesIds(uid,fnCallBack){
    return fb.ref('/inviteCliques/' + uid + '/').orderByKey().once('value',fnCallBack);
  },
  getVisualIdsWithClique(fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
    fb.ref('/followingCliques/' + uid + '/').once('value', function(snapshot) {
      snapshot.forEach(function(childSnapshot) {
        if(childSnapshot.val() != null){
          var key = childSnapshot.key;
          fb.ref('/cliqueVisuals/').child(key).child('visuals').once(fnCallBack);
        }        
      });
    })
  },  
  getDetailCliqueDataPerUser(uid,fnCallBack){
    var getMemberData = new Promise(function(resolve, reject) { 
      return fb.ref('/inCliques/' + uid + "/").orderByKey().once('value',function(snapshot) {
        let memberIds = [];
        snapshot.forEach(function(member) {
          if(member != null){
            memberIds = _.concat(memberIds,member.key)          
          }        
        });
        resolve({inCliques : _.compact(memberIds)})
      });
    }); 
    var getFollwerData = new Promise(function(resolve, reject) { 
      return fb.ref('/followingCliques/' + uid + "/").orderByKey().once('value',function(snapshot) {
        let memberIds = [];
        snapshot.forEach(function(member) {
          if(member != null){
            memberIds = _.concat(memberIds,member.key)          
          }        
        });
        resolve({followingCliques : _.compact(memberIds)})
       
      });
    }); 
    var getRequestData = new Promise(function(resolve, reject) { 
      return fb.ref('/requestedCliques/' + uid + "/").orderByKey().once('value',function(snapshot) {
        let memberIds = [];
        snapshot.forEach(function(member) {
          if(member != null){
            memberIds = _.concat(memberIds,member.key)          
          }        
        });
        resolve({requestedCliques : memberIds})
      });
    }); 
    var getInvitedData = new Promise(function(resolve, reject) { 
      return fb.ref('/inviteCliques/' + uid + "/").orderByKey().once('value',function(snapshot) {
        let memberIds = [];
        snapshot.forEach(function(member) {
          if(member != null){
            memberIds = _.concat(memberIds,member.key)          
          }        
        });
        resolve({inviteCliques : memberIds})
      });
    }); 
    Promise.all([getMemberData,getFollwerData,getRequestData,getInvitedData]).then(function(value) { 
        let detailData = {};
        _.map(value,(element) =>{
          return _.extend(detailData,element);
        })
        fnCallBack(detailData);
      }, function(reason) {
        fnCallBack(null);
    });   
  },
  getDetailPerCliqueAndUser(cliqueId,uid,fnCallBack){
    var getMemberData = new Promise(function(resolve, reject) { 
      return fb.ref('/hasUsers/' + cliqueId + "/" + uid +  "/").orderByKey().once('value',function(snapshot) {
        var isMember = snapshot.val() != null ? true : false 

        resolve({isMember : isMember})
      });
    }); 
    var getFollwerData = new Promise(function(resolve, reject) { 
      return fb.ref('/followerUsers/' + cliqueId + "/" + uid +  "/").orderByKey().once('value',function(snapshot) {
        var isFollower = snapshot.val() != null ? true : false 
        
        resolve({isFollower : isFollower})
      });
    }); 
    var getRequestData = new Promise(function(resolve, reject) { 
      return fb.ref('/requestUsers/' + cliqueId + "/" + uid +  "/").orderByKey().once('value',function(snapshot) {
        var hasRequest = snapshot.val() != null ? true : false 
        
        resolve({hasRequest : hasRequest})
      });
    }); 
    var getInvitedData = new Promise(function(resolve, reject) { 
      return fb.ref('/invitedUsers/' + cliqueId + "/" + uid +  "/").orderByKey().once('value',function(snapshot) {
        var isInvited = snapshot.val() != null ? true : false 
        
        resolve({isInvited : isInvited})
      });
    }); 
    Promise.all([getMemberData,getFollwerData,getRequestData,getInvitedData]).then(function(value) { 
      let detailData = {};
       _.map(value,(element) =>{
        return _.extend(detailData,element);
      })

      fnCallBack(detailData);
    }, function(reason) {
      fnCallBack(null);
    });   
  },
  getUniqueClique(cliqueID,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          var cliqueData = snapshot.val();    
          CliqueModel.getDetailPerCliqueAndUser(cliqueID,uid,(detailData) => {
            fnCallBack(_.extend(cliqueData,detailData));  
          })     
            
        }  
    })
  },
  followingClique(cliqueID,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          let updates = {}
          updates['/followerUsers/' + cliqueID + '/' + uid ] = 'true';
          updates['/followingCliques/' + uid + '/' + cliqueID ] = 'true'; 
          fb.ref().update(updates).then(() => {
            fnCallBack("0");//success
          }).catch((error) => {
            console.log(JSON.stringify(error))
            fnCallBack("1");//error
          }) 
          //=======notification 
          fb.ref('/hasUsers/' + cliqueID ).once('value', function(snapshot) {    
            let memberIds =  snapshot.val();
            if(memberIds != null){
                
                CliqueModel.actNotification(cliqueID,memberIds,"started following");
                
            }
          })
          //=======end
          //=====frequency
          var receivedRef = fb.ref('/receivedfrequency/' + cliqueID + '/followers');
          receivedRef.transaction(function(data) {          
            return (data || 0) + 1;
          });
          var givenRef = fb.ref('/givenfrequency/' + uid + '/following')
          givenRef.transaction(function(data) {          
            return (data || 0) + 1;
          });
          //================
          //followerSum
          var cliqueRef = fb.ref('/cliques/' + cliqueID + '/followerSum')
          cliqueRef.transaction(function(data) {          
            return (data || 0) + 1;
          }); 
          //end     
          //user given followingSum
          var userRef = fb.ref('/users/' + uid + '/followingSum')
          userRef.transaction(function(data) {          
            return (data || 0) + 1;
          });     
          //end                       
        }  
    })
  },
  unfollowingClique(cliqueID,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    //let uid = 'he2UXFJW56SqjiFTkyqKsBaNPds2'
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          
          let updates = {}
          updates['/followerUsers/' + cliqueID + '/' + uid ] = null;
          updates['/followingCliques/' + uid + '/' + cliqueID ] = null; 
          fb.ref().update(updates).then(() => {
            fnCallBack("0");//success
          }).catch(() => {
            fnCallBack("1");//error
          })   
          //=======notification 
          fb.ref('/hasUsers/' + cliqueID ).once('value', function(snapshot) {    
            let memberIds =  snapshot.val();
            if(memberIds != null){
                CliqueModel.actNotification(cliqueID,memberIds,"unfollowed");
            }
          })
          //=======end
          //=====frequency
          var receivedRef = fb.ref('/receivedfrequency/' + cliqueID + '/followers')
          receivedRef.transaction(function(data) {          
            return (data || 1) - 1;
          });
          var givenRef = fb.ref('/givenfrequency/' + uid + '/following')
          givenRef.transaction(function(data) {          
            return (data || 1) - 1;
          });
          //================
          //followerSum
          var cliqueRef = fb.ref('/cliques/' + cliqueID + '/followerSum')
          cliqueRef.transaction(function(data) {          
            return (data || 1) -1;
          });     
          //end           
          //user given followingSum
            var userRef = fb.ref('/users/' + uid + '/followingSum')
            userRef.transaction(function(data) {          
              return (data || 1) -1;
            });     
          //end              
        }  
    })
  },
  acceptRequestUser(cliqueID,requestUserid,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
      if(snapshot.val() != null){

        //=======notification 
        let sendText = "accepted your member request"
        CliqueModel.actNotificationToUsers(cliqueID,requestUserid,sendText)
        //=======end
        var cliqueData = snapshot.val();      
        let updates = {}
        updates['/requestUsers/' + cliqueID + '/' + requestUserid ] = null;
        updates['/requestedCliques/' + requestUserid + '/' + cliqueID ] = null; 
        updates['/hasUsers/' + cliqueID + '/' + requestUserid ] = "true";       
        updates['/inCliques/' + requestUserid + '/' + cliqueID ] = "true"; 


        //membersum
        var cliqueRef = fb.ref('/cliques/' + cliqueID + '/memberSum')
        cliqueRef.transaction(function(data) {          
          return (data || 0) + 1;
        });   
        //end
        
        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })               
      }  
    })
  },
  deleteRequestUser(cliqueID,requestUserid,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        var cliqueData = snapshot.val();      
        let updates = {}
        updates['/requestUsers/' + cliqueID + '/' + requestUserid ] = null;
        updates['/requestedCliques/' + requestUserid + '/' + cliqueID ] = null; 
       //=======notification 
       let sendText = "rejected your member request"
       CliqueModel.actNotificationToUsers(cliqueID,requestUserid,sendText)
       //=======end
        
        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })               
      }  
    })
  },
  deleteMemberUser(cliqueID,requestUserid,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        var cliqueData = snapshot.val();      
        let updates = {}
        updates['/hasUsers/' + cliqueID + '/' + requestUserid ] = null;
        updates['/inCliques/' + requestUserid + '/' + cliqueID ] = null; 
       //=======notification 
       let sendText = "just removed you from a clique"
       CliqueModel.actNotificationToUsers(cliqueID,requestUserid,sendText)
       //=======end
        //membersum
        var cliqueRef = fb.ref('/cliques/' + cliqueID + '/memberSum')
        cliqueRef.transaction(function(data) {          
          return (data || 1) - 1;
        });   
        //end
        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })               
      }  
    })
  },
  leaveClique(cliqueID,requestUserid,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        var cliqueData = snapshot.val();      
        let updates = {}
        updates['/hasUsers/' + cliqueID + '/' + requestUserid ] = null;
        updates['/inCliques/' + requestUserid + '/' + cliqueID ] = null; 
       //=======notification 
     
       CliqueModel.getCliqueMembersKey(cliqueID,memberids =>{
        let sendText = "just left your clique"
        CliqueModel.actNotificationToUsers(cliqueID,memberids,sendText)
      })
      
       //=======end
        //membersum
        var cliqueRef = fb.ref('/cliques/' + cliqueID + '/memberSum')
        cliqueRef.transaction(function(data) {          
          return (data || 1) - 1;
        });   
        //end
        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })               
      }  
    })
  },
  acceptInviteClique(cliqueID,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;

    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
      if(snapshot.val() != null){

      //=======notification 

        CliqueModel.getCliqueMembersKey(cliqueID,memberids =>{
        let sendText = "accepted your clique invite";
        CliqueModel.actNotificationToUsers(cliqueID,memberids,sendText)
      })
      
      //=======end
        var cliqueData = snapshot.val();      
        let updates = {}
        updates['/invitedUsers/' + cliqueID + '/' + uid ] = null; 
        updates['/inviteCliques/' + uid + '/' + cliqueID ] = null; 
        
        updates['/hasUsers/' + cliqueID + '/' + uid ] = "true"; 
        updates['/inCliques/' + uid + '/' + cliqueID ] = "true"; 

        //membersum
        var cliqueRef = fb.ref('/cliques/' + cliqueID + '/memberSum')
        cliqueRef.transaction(function(data) {          
          return (data || 0) + 1;
        });   
        //end

        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })               
      }  
    })
  },
  deleteInviteClique(cliqueID,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
      if(snapshot.val() != null){
        var cliqueData = snapshot.val();      
        let updates = {}
        updates['/invitedUsers/' + cliqueID + '/' + uid ] = null; 
        updates['/inviteCliques/' + uid + '/' + cliqueID ] = null; 
        //=======notification 
        CliqueModel.getCliqueMembersKey(cliqueID,memberids =>{
          let sendText = "rejected your clique invite"
          CliqueModel.actNotificationToUsers(cliqueID,memberids,sendText)
        })
        
        //=======end
         
        //updates['/users/' + uid + '/delete_cliques/' + cliqueID ] = "true"; 
        fb.ref().update(updates).then(() => {
          fnCallBack("0");//success
        }).catch(() => {
          fnCallBack("1");//error
        })               
      }  
    })
  },
  requestClique(cliqueID,fnCallBack){
    let currentUser = fb.currentUser();
    let index = 0;
    let uid = currentUser.uid;
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          var cliqueData = snapshot.val();
          //if(uid == cliqueData.uid){
          //  fnCallBack(cliqueData);
          //}   
            //=======notification 
        //
        CliqueModel.getCliqueMembersKey(cliqueID,memberids =>{
          let sendText = "sent you a clique request"
          CliqueModel.actNotificationToUsers(cliqueID,memberids,sendText)
        })
        //=======end
          let updates = {}
          updates['/requestUsers/' + cliqueID + '/' + uid ] = 'true';
          updates['/requestedCliques/' + uid + '/' + cliqueID ] = 'true'; 
          fb.ref().update(updates).then(() => {
            fnCallBack("0");//success
          }).catch(() => {
            fnCallBack("1");//error
          })               
        }  
    })
  },
  getCliqueMembers(cliqueId,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/hasUsers/').off();       
    return fb.ref('/hasUsers/' + cliqueId + "/").orderByKey().once('value',function(snapshot) {
      UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
    });
  }, 
  getCliqueMembersKey(cliqueId,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/hasUsers/').off();       
    return fb.ref('/hasUsers/' + cliqueId + "/").orderByKey().once('value',function(snapshot) {
      let memberkeys = [];
      snapshot.forEach(function(member) {
        if(member != null){
         memberkeys = _.concat(memberkeys,member.key)          
        }        
      });
      fnCallBack(memberkeys);

    });
  },   
  getCliqueCandidatesKey(cliqueId,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/hasUsers/').off();       
    return fb.ref('/hasUsers/' + cliqueId + "/").orderByKey().once('value',function(snapshot) {
      let memberkeys = [];
      snapshot.forEach(function(member) {
        if(member != null){
         memberkeys = _.concat(memberkeys,member.key)          
        }        
      });
      return fb.ref('/invitedUsers/' + cliqueId + "/").orderByKey().once('value',function(snapshot) {
        let invitekeys = [];
        snapshot.forEach(function(member) {
          if(member != null){
            invitekeys = _.concat(invitekeys,member.key)          
          }        
        });
        
        fnCallBack(_.concat(memberkeys,invitekeys));
  
      });
     

    });
  },
  /*  get freind data for loading last count */
  getRequestUsers(lastId,cliqueId,counter,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/requestUsers/').off();    
    if(lastId == null){
      return fb.ref('/requestUsers/' + cliqueId + "/").orderByKey().limitToLast(counter).once('value',function(snapshot) {
        UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
      });
    }
    return fb.ref('/requestUsers/' + cliqueId + "/").orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
      UserModel.getUserListOnIds(snapshot.val(),fnCallBack);
    });
  },
  getInvitedCliques(lastId,counter,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;
    fb.ref('/inviteCliques/').off(); 
    
     if(lastId == null){
       return fb.ref('/inviteCliques/' + uid + "/").orderByKey().limitToLast(counter).once('value',function(snapshot) {
         CliqueModel.getCliqueDataOnList(snapshot.val(),fnCallBack);
       });
     }
     return fb.ref('/inviteCliques/' + uid + "/").orderByKey().endAt(lastId).limitToLast(counter).once('value',function(snapshot) {
       CliqueModel.getCliqueDataOnList(snapshot.val(),fnCallBack);
     });
  },
  getCreatedCliques(uid,fnCallBack){   
    fb.ref('/inCliques/').off();     
    return fb.ref('/inCliques/' + uid + "/").orderByKey().once('value',function(snapshot) {
      CliqueModel.getCliqueDataOnList(snapshot.val(),fnCallBack);
    });  
   
  },
  getCliqueDataOnList(cliqueIds,fnCallBack){ 
    if(!cliqueIds){
      fnCallBack();
      return;
    }
   CliqueModel.getCliqueDataOnArray(Object.keys(cliqueIds), fnCallBack);
 
  },
  getCliqueDataOnArray(cliqueIds,fnCallBack){ 

    if(!cliqueIds){
      fnCallBack();
      return;
    }
    Promise.all(
      cliqueIds.map(cliqueId =>{
       return new Promise(function (resolve, reject) {  
          fb.ref("/cliques/" + cliqueId + "/").once('value').then(snapshot => {
            let clique = snapshot.val();            
            resolve(_.extend(clique, {key: cliqueId}));
          
          })
        })
     })
   ).then(cliqueList => {
     fnCallBack(cliqueList);
   });  
  },
  getCliqueVisualIdsOnArray(cliqueIds,fnCallBack){ 
    if(!cliqueIds){
      fnCallBack();
      return;
    }
    Promise.all(
      cliqueIds.map(cliqueId =>{
       return new Promise(function (resolve, reject) {  
        fb.ref("/cliqueVisuals/" + cliqueId + "/").once('value').then(snapshot => {
            let visual = snapshot.val();          
            resolve(_.extend(visual));
          })
        })
     })
   ).then(visualList => {
     fnCallBack(visualList);
   });  
  },
  getMembersWithCliqueId(cliqueID,fnCallBack){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid; 
    fb.ref('/hasUsers/' + cliqueID ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          var userIds = snapshot.val();
          return UserModel.getUserListOnIds(userIds,fnCallBack);
        }  
    })
  },  
  actNotification(cliqueID,toUserIds,type){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;     
    let bodyText =  ' ' + type + ' your clique.'; 
    let sendText = '' + currentUser.displayName + bodyText;
    let data = {
      senderUid: uid, toCliqueId: cliqueID,type: "clique",
      body: bodyText ,createdAt: fb.timestamp()
    }
    let updates = {}
    const newNotifiKey = fb.ref('notifications/').push().getKey();       
    updates['/notifications/' + newNotifiKey ] = data; 
    fb.ref().update(updates);
    UserModel.getUserListOnIds(toUserIds,(memberUsers)=>{
      if(memberUsers){
        let updates = {}
        let tokenList = []
        let members  = _.remove(memberUsers,function(member){
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
        fb.ref().update(updates);
        if(tokenList.length > 0){
          FirebaseClient.sendRemoteMultiNotification(_.uniq(tokenList),sendText);  
        }
             
      }
    });
  },  
  actNotificationToUsers(cliqueID,userIds,bodyText){
    let currentUser = fb.currentUser();  
    let uid = currentUser.uid;         
    const sendText = '' + currentUser.displayName + ' ' + bodyText;
    let data = {
      senderUid: uid, toCliqueId: cliqueID,
      body: bodyText ,createdAt: fb.timestamp(),type: "clique"
    }
    let updates = {}
    const newNotifiKey = fb.ref('notifications/').push().getKey();       
    updates['/notifications/' + newNotifiKey ] = data; 
    fb.ref().update(updates);
    let userIdList = _.without(_.concat([],userIds),uid);    
    UserModel.getUserListOnIdArr(userIdList,(memberUsers)=>{
      if(memberUsers){
        let updates = {}
        let tokenList = []
        memberUsers.forEach(function(member) {
          if(member != null){
            if(member.token){
              tokenList = _.concat(tokenList,member.token)
            }                
            updates['/userNotifys/' + member.uid + '/' + newNotifiKey + '/' ] = 'true';      
          }        
        });   
        updates['/cliqueNotifys/' + cliqueID + '/' + newNotifiKey + '/' ] = 'true';    
        fb.ref().update(updates);
        if(tokenList.length > 0){
          FirebaseClient.sendRemoteMultiNotification(_.uniq(tokenList),sendText);    
        }
            
      }
    });
  },
  addInvitedUserToClique(cliqueID,userId,fnCallback){  
    let inviteFriendArr = [];
    fb.ref('/cliques/' + cliqueID ).once('value', function(snapshot) {     
        if(snapshot.val() != null){
          let updates = {}   
          updates['/invitedUsers/' + cliqueID + '/' + userId + '/' ] = 'true';  
          updates['/inviteCliques/' + userId + '/' + cliqueID + '/' ] = 'true';
          inviteFriendArr = _.concat(inviteFriendArr,userId)         
          fb.ref().update(updates).then(() => {
              fnCallback("true");           
          }) 
          let sendText = "sent invited to his clique";
          CliqueModel.actNotificationToUsers(cliqueID,userId,sendText);
        }else{
          fnCallback("error");       
        } 
    })
  },
  getFrequency(cliqueID,fnCallBack){
    fb.ref('/receivedfrequency/').off();   
    return fb.ref('/receivedfrequency/').orderByKey().equalTo(cliqueID).once('value',fnCallBack);
  }
}
export default CliqueModel;