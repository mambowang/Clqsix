
// - Import react components
import moment from 'moment'
import _ from 'lodash'
import * as types   from '../actions/ActionTypes';
/**
 *  Default state
 */
var defaultState = {
    status: null,
    id: null,
  }

/**
 * Vote actions
 * @param {object} state 
 * @param {object} action 
 */
export default (state = defaultState, action) => {
    var { payload } = action
    switch (action.type) {      
        case types.CLICKCLIQUE:
            return {
                ...state,
                status: 'clique',
                id: payload.cliqueId
            }       
        case types.CLICKVISUAL:
            return {
                ...state,
                status: 'visual',
                id: payload.visualId
            }
        case types.CLICKMEMBER:
            return {
                ...state,
                status: 'member',
                id: payload.memberId
            }
        case types.CLICKPROFILE:
            return {
                ...state,
                status: 'profile',
            }
        case types.BLANK:
            return {
                ...state,
                status: null,
                id: null
            }
        default:
        
        return state;
  
    }
  
  
  }