import {
  AsyncStorage,
} from 'react-native'

const SharedManagerKey = { 
}

const SharedManager = {
  
  setItem(key, value) {
    try {
      await AsyncStorage.setItem(key, value);
    }catch(error) {
      console.log(error);
    }
  },

  getItem(key) {
    try {
      const value = await AsyncStorage.getItem(key);
      return value;
    }catch(error) {
      console.log(error);
    }
  },

  removeItem(key) {
    try {
      await AsyncStorage.removeItem(key);
    }catch(error) {
      console.log(error);
    }
  }
}