'use strict';

import React, {Component} from 'react';
import {ReactNative, Alert} from 'react-native';
import fb from './FirebaseAPI';
import UserModel from '../models/UserModel';

const guid = require('guid');

const AuthAPI = {

  testUser : null,//{email: 'test@gmail.com', password: 'password'},

	onAuthStateChanged(fnCallback) {
    if (fb.fbAuth) {
      return fb.firebaseAuth.onAuthStateChanged(fnCallback);
    }
  },

  currentUser() {
    let user = fb.currentUser();
    if (!user && !!AuthAPI.testUser) {
      user = AuthAPI.testUser;
      AuthAPI.signInWithEmailAndPassword(user.email, user.password)
      .then(() => user = fb.currentUser())
      .catch(error => { alert(!!error ? error.message: 'Error in signin!'); })
    }
    return user;
  },
  changePassword(oldPassword,newPassword,fnCallBack){
    return new Promise((resolve, reject) => {
      if (!!fb.fbAuth) {
        const user = fb.currentUser();
        var credential = fb.emailAuthProvider.credential(user.email, oldPassword);
        user.reauthenticateWithCredential(credential).then(data => {   
          user.updatePassword(newPassword).then(function() {
            UserModel.changePassword(newPassword).then(user => resolve(user)).catch(error => reject(error));
          }).catch(error => reject(error));
         
        }).catch(error => reject(error));
      }
    });
  },

  createUserWithEmailAndPassword(user) {
    return new Promise((resolve, reject) => {
      if (!!fb.fbAuth) {
        fb.firebaseAuth.createUserWithEmailAndPassword(user.email, user.password).then(data => {    
          fb.firebaseAuth.currentUser.updateProfile({
            displayName: user.name,
            photoURL: (!!user.photoURL ? user.photoURL : null)
          });          
          let createdAt = fb.timestamp();          
          return {
            ...user,
            uid: fb.firebaseAuth.currentUser.uid,
            photoURL: fb.firebaseAuth.currentUser.photoURL,
            createdAt: createdAt,
            updatedAt: createdAt
          }
        }).then(userData => {
            AuthAPI.sendEmailVerification();
            UserModel.save(userData).then(savedUserData => resolve(savedUserData)).catch(error => reject(error));
        }).catch(error => reject(error));
      }else {
        resolve(savedUserData);
      }
    });
  },

  signInWithEmailAndPassword(email, password) {
    fb.fbCurrentUser = null;
    return new Promise((resolve, reject) => {
      if (!!fb.fbAuth) {
        fb.firebaseAuth.signInWithEmailAndPassword(email, password)
          .then(user => resolve(user))
          .catch(error => reject(error));
      } else resolve({ email: email, password: password});
    });
  },

  signOut() {
    fb.fbCurrentUser = null;
    return new Promise((resolve, reject) => {
      if (!!fb.fbAuth) {
        fb.firebaseAuth.signOut()
          .then(() => resolve())
          .catch(error => reject(error));
      } else  resolve();
    });
  },

  sendPasswordResetEmail(email) {
    return new Promise((resolve, reject) => {
      if (fb.fbAuth) {
        fb.firebaseAuth.sendPasswordResetEmail(email)
          .then(() => resolve())
          .catch(error => reject(error));
      }
    });
  },
  sendEmailVerification() {
    if (fb.fbAuth) {
      fb.firebaseAuth.currentUser.sendEmailVerification()
        .then()
        .catch(error => console.log(error));
    }
    // return new Promise((resolve, reject) => {
    //   if (fb.fbAuth) {
    //     fb.firebaseAuth.currentUser.sendEmailVerification()
    //       .then(() => resolve())
    //       .catch(error => reject(error));
    //   }
    // });
  },
  //old functions
  sendPasswordResetEmailOld(email) {
    return new Promise((resolve, reject) => {
      if (fb.fbAuth) {
        fb.firebaseAuth.sendPasswordResetEmail(email)
          .then(() => resolve())
          .catch(error => reject(error));
      } else if (fb.fbDatabase) {
        UserModel.findWithEmail(email)
          .then(user => {
            if (!!user) {
              UserModel.setPassword(user.uid, '123456')
                .then(() => resolve('123456'))
                .catch(error => reject(error));
            } else resolve({message:''});
          })
          .catch(error => reject(error));
      }
    });
  },
  createUserWithEmailAndPasswordOld(user) {
    return new Promise((resolve, reject) => {
      if (!!fb.fbAuth) {
        fb.firebaseAuth.createUserWithEmailAndPassword(user.email, user.password).then(data => {    
          fb.firebaseAuth.currentUser.updateProfile({
            displayName: user.name,
            photoURL: (!!user.photoURL ? user.photoURL : null)
          });          
          let createdAt = fb.timestamp();
          
          return {
            ...user,
            uid: fb.firebaseAuth.currentUser.uid,
           // email: fb.firebaseAuth.currentUser.email,
           // name: user.name,
            photoURL: fb.firebaseAuth.currentUser.photoURL,
            createdAt: createdAt,
            updatedAt: createdAt
          }
        }).then(userData => {
          //UserModel.removeAllWithEmail(userData.email).then(() => {            
            UserModel.save(userData).then(savedUserData => resolve(savedUserData)).catch(error => reject(error));
          //}).catch(error => reject(error));
        }).catch(error => reject(error));
      } else if (!!fb.fbDatabase) {
        let createdAt = fb.timestamp();
        UserModel.save({
          ...user,
          uid: guid(),
          createdAt: createdAt,
          updatedAt: createdAt,
        })
        .then(savedUserData => {
          fb.fbCurrentUser = savedUserData;
          resolve(savedUserData);
        })
        .catch(error => reject(error));
      } else {
        resolve(savedUserData);
      }
    });
  },
  signInWithEmailAndPasswordOld(email, password) {
    fb.fbCurrentUser = null;
    return new Promise((resolve, reject) => {
      if (!!fb.fbAuth) {
        fb.firebaseAuth.signInWithEmailAndPassword(email, password)
          .then(user => resolve(user))
          .catch(error => reject(error));
      } else if (!!fb.fbDatabase) {
        UserModel.findWithEmailAndPassword(email, password)
          .then(user => {
            if (!!user) {
              fb.fbCurrentUser = user;
              resolve(user);
            }
            else reject({message:'Wrong username or password.'});
          })
          .catch(error => reject(error));
      } else resolve({ email: email, password: password});
    });
  },
}

// AuthAPI.onAuthStateChanged(user => {
//   if (user) {
//     console.log("api:", user.uid);
//   } else {
//     console.log("No one is logged in");
//   }
// });

export default AuthAPI;