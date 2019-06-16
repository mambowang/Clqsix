// - Import react components
import moment from 'moment'
import _ from 'lodash'
import * as types   from '../actions/ActionTypes';
/**
 *  Default state
 */
var defaultState = {
    visualLikes: {},
    loaded:false
  }

/**
 * Vote actions
 * @param {object} state 
 * @param {object} action 
 */
export default (state = defaultState, action) => {
    var { payload } = action
    switch (action.type) { 
     
      case types.GET_LIKE_LIST:
        return {
          ...state,
          visualLikes: {
            ...state.visualLikes,
            ...payload
          },
          loaded:true
        }       
      
      default:
        return state;
  
    }
  
  
  }