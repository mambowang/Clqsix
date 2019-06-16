import * as types from './ActionTypes';


export function createClique(cliqueId) {
    return {
      type: types.CREATECLIQUE,
      payload: {
        cliqueId       
       
      }
    }
  }  
  export function registeClique(cliqueId) {
    return {
      type: types.REGISTCLIQUE,
      payload: {
        cliqueId,
      }
    }
    
  }

  
  export function changeLastClique(cliqueId) {
    return {
      type: types.CHANGEACTIVECLIQUE,
      payload: {
        newActiveCliqueId:cliqueId,
      }
    }
    
  }
  export function postVisual(visualId) {
    return {
      type: types.POSTVISUAL,   
      payload: {
        visualId,
       
      }   
    }
    
  }
  export function reset() {
    return {
      type: types.RESET,
      payload: {}
    }
  }