import * as types   from '../actions/ActionTypes';
import _ from 'lodash';

const defaultUser = {
    email  : null,
    name: null,
    description: "",
    password: null,
    uid: null,
    type:null,
    signInStatus: false,
    photoURL: null,    
    followingCliqueIds: null,
  }
  let followingCliqueIds;
  export default (state = defaultUser, action) => {
    switch (action.type) {
      case types.SIGNEDIN:
        let {
          email, name,password,  uid,type,followingCliqueIds,photoURL,description
        } = action.payload
        const signInState = {
          email,
          name,
          uid,
          type,
          password,
          signInStatus: true,
          photoURL, 
          description,
          followingCliqueIds ,
        }

        return signInState;
      break;
      case types.FOLLOWINGCLIQUE:
        return {
          ...state,
          followingCliqueIds: action.payload.followingCliqueIds
        }
        break;
      case types.CHANGEPASSWORD:
        return {
          ...state,
          password: action.payload.password
        }
        break;
      case types.FOLLOWINGONECLIQUE:
        let {
          followingId
        } = action.payload

        return {
          ...state,
          followingCliqueIds: _.compact(_.concat(state.followingCliqueIds,followingId))
        }
        break;
      case types.UNFOLLOWINGONECLIQUE:
        let {
          unfollowingId
        } = action.payload
        return {
          ...state,
         followingCliqueIds: _.compact(_.without(state.followingCliqueIds, unfollowingId))
        }
        break;
      case types.CHANGETYPE:
        return {
          ...state,
          type: action.payload
        }
        break;
      case types.CHANGEUSERDATA:
       let payload = action.payload;
        return {
          ...state,
         name: payload.name || '',
         description: payload.description || '',
         photoURL: payload.photoURL || ''
        }
        break;
      case types.SIGNEDOUT:
        const signOutState = {
          email: null,
          name: null,
          uid: null,
          type:null,
          password: null,
          photoURL: null,
          signInStatus: false,
          description:"",
          followingCliqueIds: null
        }
        return signOutState
        break;
      default:
        return state
        break;
    }
  }
  