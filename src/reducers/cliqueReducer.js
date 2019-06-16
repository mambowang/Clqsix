import * as types   from '../actions/ActionTypes';

const defaultClique = {
      lastCliqueId  : null,
      lastVisualId: null,
  }
  
  export default (state = defaultClique, action) => {
    switch (action.type) {
      case types.CREATECLIQUE:
      const {
        cliqueId
        } = action.payload

        const cliqueState = {
          lastCliqueId: cliqueId,
          lastVisualId: null,
        }
        return cliqueState     

      case types.REGISTCLIQUE:
        const {
              lastCliqueId
          } = action.payload

        const lastCliqueState = {
          lastCliqueId :lastCliqueId,
          lastVisualId: null,
        }
        return lastCliqueState    
        
      case types.CHANGEACTIVECLIQUE:         
        const {
          newActiveCliqueId
        } = action.payload
        return {        
          lastVisualId: state.lastVisualId,
          lastCliqueId: newActiveCliqueId
        }    
      case types.POSTVISUAL:         
        const {
          visualId
        } = action.payload
        return {        
          lastVisualId: visualId,
          lastCliqueId :state.lastCliqueId
        }   
      case types.RESET:         
        const resetState = {
          lastCliqueId  : null,
          lastVisualId: null,
        }
        return resetState
      break;
      default:
        return state
    }
  }
  