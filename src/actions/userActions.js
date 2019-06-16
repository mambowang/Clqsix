import * as types from './ActionTypes';
import FCM , {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType}from "react-native-fcm";
import {VisualModel,CliqueModel,UserModel} from '../models';
import * as Storage from '../common/Storage';
  export function signedIn(email, name,password, uid,photoURL,description) {
    return (dispatch) => { 
      FCM.getFCMToken().then(token => {
       UserModel.updateFCMToken(uid,token);
      });
      FCM.on(FCMEvent.RefreshToken, token => {
        UserModel.updateFCMToken(uid,token);
      });
      UserModel.findLastCreatedClique(uid).then(lastCliqueId =>{
        if(lastCliqueId){
          let type = "clique";
         // let user = {email: email, uid: uid ,name:name,password : password,photoURL:photoURL,description:description};
         //let user = { uid: uid };
         // Storage.setUser(user);
          UserModel.getFollowCliqueIds(uid).then(cliqueIds =>{  
            dispatch({type:types.REGISTCLIQUE,payload: {lastCliqueId}});
            dispatch({type: types.SIGNEDIN,payload: { email,  name,password, uid, type,photoURL,description, followingCliqueIds: cliqueIds}  });
          });         
        }else{
          let type = "single";
         // let user = {email: email, uid: uid ,name:name,password : password,photoURL:photoURL,description:description};
        // let user = { uid: uid };
         // Storage.setUser(user);
          UserModel.getFollowCliqueIds(uid).then(cliqueIds =>{  
            dispatch({type: types.SIGNEDIN,payload: { email,  name,password, uid,photoURL,description, type,followingCliqueIds: cliqueIds}  });
          });         
        }
      });     
    }
  }
  export function saveSigned(email, name, password,uid,photoURL,description) {
    return (dispatch) => { 
      FCM.getFCMToken().then(token => {
        UserModel.updateFCMToken(uid,token);
       });
       FCM.on(FCMEvent.RefreshToken, token => {
         UserModel.updateFCMToken(uid,token);
       });
       UserModel.findLastCreatedClique(uid).then(lastCliqueId =>{  
        if(lastCliqueId){
          let type = "clique";
          UserModel.getFollowCliqueIds(uid).then(cliqueIds =>{  
            dispatch({type:types.REGISTCLIQUE,payload: {lastCliqueId}});
            dispatch({type: types.SIGNEDIN,payload: { email,  name,password, uid, type,photoURL,description, followingCliqueIds: cliqueIds}  });
          });
        }else{
          let type = "single";
          UserModel.getFollowCliqueIds(uid).then(cliqueIds =>{  
            dispatch({type: types.SIGNEDIN,payload: { email,  name,password, uid, type,photoURL,description,followingCliqueIds: cliqueIds}  });
          });         
        }
       });
    }
  }
  export function signUp(email, name,password, uid,type,photoURL,description) {
    return (dispatch) => {       
        FCM.getFCMToken().then(token => {
          UserModel.updateFCMToken(uid,token);
        });
        FCM.on(FCMEvent.RefreshToken, token => {
          UserModel.updateFCMToken(uid,token);
        });
       // let user = {email: email,name:name, uid: uid ,password : password,photoURL:photoURL,description:description};
       //let user = { uid: uid };
        //Storage.setUser(user);
        dispatch({type: types.SIGNEDIN,payload: { email, name, password,uid, type,photoURL,description}  });
    }
  }
  export function signedOut() {
    return {
      type: types.SIGNEDOUT,
      payload: {}
    }
  }
  export function changePassword(newpass) {
    return {
      type: types.CHANGEPASSWORD,
      payload: {password:newpass}
    }
  }
  
  export function followingClique(uid) {    
    return (dispatch) => {       
      UserModel.getFollowCliqueIds(uid).then(cliqueIds =>{ 
        dispatch({type: types.FOLLOWINGCLIQUE,payload: { followingCliqueIds: cliqueIds}  });
      });
    }
  }        
  export function changeType(type) {
    return {
      type: types.CHANGETYPE,
      payload: type
    }
  }

  export function followingOneClique(cliqueId) {
    return {
      type: types.FOLLOWINGONECLIQUE,
      payload: {followingId : cliqueId}
    }
  }

  export function unfollowingOneClique(cliqueId) {
    return {
      type: types.UNFOLLOWINGONECLIQUE,
      payload: {unfollowingId : cliqueId}
    }
  }

  export function savePosts(posts) {
    return {
      type: types.SAVEPOSTS,
      payload: posts
    }
  }
  export function changeUserData(data) {
    return (dispatch) => {       
      // Storage.getUser()
      // .then((user)=>{
      //   let newUser = {email: user.email, uid: user.uid , password : user.password,
      //     name:data.name, photoURL:data.photoURL,description:data.description};
      //   Storage.setUser(newUser);
      // });         
      
      dispatch({ type: types.CHANGEUSERDATA,payload:data  });
    }
  }


    
