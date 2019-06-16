
import { combineReducers } from 'redux'
import currentUser from './userReducer'
import likeReducer from './likeReducer'
import currentClique from './cliqueReducer'
import currentStatus from './statusReducer'

export default rootReducer = combineReducers({
  currentUser,  
  likeReducer,
  currentClique,
  currentStatus
})