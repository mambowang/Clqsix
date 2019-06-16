// - Import react components
import {createAction as action} from 'redux-actions'
import moment from 'moment'
import fb from '../utils/FirebaseAPI'

// - Import action types
import * as types from './ActionTypes';



/* _____________ CRUD DB _____________ */

/**
 *  Add vote to database
 * @param  {string} visualId is the identifier of the post which user vote
 */
// export const dbLike = (visualId) => {
//   return (dispatch, getState) => {

//     var uid = getState().authorize.uid
//     var vote = {
//         visualId: visualId,
//       creationDate: moment().unix(),
//       userDisplayName: getState().user.fullName,
//       userAvatar: getState().user.avatar,
//       userId: uid
//     }
//     var voteRef = firebaseRef.child(`postVotes/${postId}`).push(vote)
//     return voteRef.then(() => {
//       dispatch(action(types.ADD_VOTE)(
//         {
//           vote,
//           postId: postId,
//           id: voteRef.key
//         }))
  

     
//     }, (error) =>  dispatch(action(types.SHOW_ERROR_MESSAGE_GLOBAL)(error.message)))

//   }
// }

/**
 * Get all votes from database
 */
export const dbGetLikes = () => {
  return (dispatch, getState) => {   
    let currentUser = fb.currentUser();
    var uid = currentUser.uid;
    if (uid) {
      var likesRef = fb.ref('/visualLikes/');

      return likesRef.once('value').then((snapshot) => {
        var likes = snapshot.val() || {};
        dispatch(action(types.GET_LIKE_LIST)(likes))
      }, error => {});
      
    }
  }
}


/**
 * Delete a vote from database
 * @param  {string} id of vote
 * @param {string} postId is the identifier of the post which vote belong to
 */
// export const dbDeleteVote = (postId) => {
//   return (dispatch, getState) => {

//     // Get current user id
//     var uid = getState().authorize.uid

//     // Write the new data simultaneously in the list
//     var updates = {};
//     let votes = getState().vote.postVotes[postId]
//     let id = Object.keys(votes).filter((key)=> votes[key].userId === uid)[0]
//     console.log(' Id :  ',id)
  
//     updates[`postVotes/${postId}/${id}`] = null;

//     return firebaseRef.update(updates).then((result) => {
//       dispatch(action(types.DELETE_VOTE)({id, postId}))
//     }, (error) => {
//       dispatch(action(types.SHOW_ERROR_MESSAGE_GLOBAL)(error.message))
//     });
//   }

// }