'use strict';

import React, {Component} from 'react';
import {ReactNative, Alert} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob'
import * as API from './config';

const guid = require('guid');
const Fetch = RNFetchBlob.polyfill.Fetch;
window.fetch = new Fetch({  
  auto : true,  
  binaryContentTypes : [
      'image/',
      'video/',
      'audio/',
      'foo/',
  ]
}).build();
const AuthAPI = {
  testUser : null,//{email: 'test@gmail.com', password: 'password'}, 
  signInWithEmailAndPassword(email, password) {   
 
    return new Promise((resolve, reject) => {       
      const formdata = new FormData();
      formdata.append('email', email);
      formdata.append('password', password);
      formdata.append('os', 'ios');    
      fetch(API.WEBAPI_SIGNIN, {
        method: 'POST',
        body: formdata
      })
      .then(response => response.json())
      .then(response => resolve(response))
      .catch(error => reject(error))    
    });
  }, 
  checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  },
  parseJSON(response) {
    return response.text().then(function(text) {
      return text ? JSON.parse(text) : {}
    })
  },
}
export default AuthAPI;
