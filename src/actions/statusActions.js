import * as types from './ActionTypes';


export function clickClique(cliqueId) {
    return {
      type: types.CLICKCLIQUE,
      payload: {
        cliqueId,
      }
    }
  }  
  export function clickVisual(visualId) {
    return {
      type: types.CLICKVISUAL,
      payload: {
        visualId,
      }
    }
    
  }
  export function clickMember(memberId) {
    return {
      type: types.CLICKMEMBER,
      payload: {
        memberId,
      }
    }
    
  }
  export function clickProfile() {
    return {
      type: types.CLICKPROFILE,        
    }    
  }
  export function blank(visualId) {
    return {
      type: types.BLANK,        
    }    
  }