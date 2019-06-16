import firebase from 'firebase';
import uuid from 'uuid';
import config from './FirebaseConfig';

const guid = require('guid');

firebase.initializeApp(config);


const fbAuth = config.fbAuth;
const fbDatabase = config.fbDatabase;
const fbStorage = config.fbStorage;

const firebaseAuth = fbAuth ? firebase.auth() : null;
const firebaseDatabase = fbDatabase ? firebase.database() : null;
const firebaseStorage = fbStorage ? firebase.storage() : null;
//add by rgs on 01_24
const emailAuthProvider = fbAuth ? firebase.auth.EmailAuthProvider : null;

const fb = {
  firebaseAuth: firebaseAuth,
  firebaseDatabase: firebaseDatabase,
  firebaseStorage: firebaseStorage,
  fbCurrentUser: null,
  fbAuth: config.fbAuth,
  fbStorage: config.fbStorage,
  fbDatabase: config.fbDatabase,
  //add by rgs on 01_24
  emailAuthProvider: emailAuthProvider,

  currentUser: function () {
    return config.fbAuth ? firebaseAuth.currentUser : fb.fbCurrentUser;
  },

  timestamp: function () {
    return firebase.database.ServerValue.TIMESTAMP;
  },

  ref: function(refName) {
    return firebaseDatabase.ref(refName);
  },

  push: function(refName, data, fnOnComplete) {
    if(!fnOnComplete){
      return fb.ref(refName).push(data);
    }
    return fb.ref(refName).push(data, fnOnComplete);
  },

  update: function(refName, key, data) {
    if (data === undefined) {
      data = key;
      key = '';
    }
    return fb.ref(refName + key).update(data);
  },

  set: function (refName, key, data) {
    return fb.ref(refName).set({key : data});
  },

  child: function (refName, key) {
    return fb.ref(refName).child(key);
  },

  values: function (refName) {
    var records = [];
    return firebaseDatabase.ref(refName).once('value').then((snapshot) => {
      snapshot.forEach(function(row) {
        if (row.key === undefined || row.key === null) {
          records.push(row.val());
        } else {
          records.push({key: row.key, value: row.val()});
        }
      });
      return records;
    });
  },
}

export default fb