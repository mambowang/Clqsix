
//Use firebase database or not
//local - local database
//false - offline
//other - online
const FirebaseDatabaseOnline = 'other';

//Use firebase auth or not
//!Important
//If FirebaseDatabaseOnline is 'local', then this value will be parsed as false
const FirebaseAuthOnline = true;

//Use firebase storage or not
//If FirebaseDatabaseOnline is 'local', then this value will be parsed as false
const FirebaseStorageOnline = true;

// !! Do not modify
const FirebaseConfig = {
  fbAuth: FirebaseDatabaseOnline !== 'local' &&  FirebaseDatabaseOnline !== false && FirebaseAuthOnline !== false,
  fbDatabase: FirebaseDatabaseOnline !== false,
  fbStorage: FirebaseDatabaseOnline !== 'local' &&  FirebaseDatabaseOnline !== false && FirebaseStorageOnline !== false,  

  apiKey: "AIzaSyDqFjPMySs5WFYzPkIYOvFfmbn6f-V3v9k",
	authDomain: "clqsix-9e977.firebaseapp.com",
	databaseURL: FirebaseDatabaseOnline === 'local' ? "ws://localhost.firebaseio.test:5000" : "https://clqsix-9e977.firebaseio.com",
	storageBucket: "clqsix-9e977.appspot.com",
  messagingSenderId: "523390251084",
  fcmKey: "AAAAedx9cEw:APA91bGWAYVSvPUvwDVxOs5XQ4dNhgAflz_9679uORwCSycGlLl6RCXGq8dzh0DYqD7k_zIz_6_00ws4nHXYAOToTGzbjWnsUIiVdiPG_6GkNt4zELpuAaR0GKNoNZ3BbvcHWoaJibbw"
};

//for test

// const FirebaseConfig = {
//   fbAuth: FirebaseDatabaseOnline !== 'local' &&  FirebaseDatabaseOnline !== false && FirebaseAuthOnline !== false,
//   fbDatabase: FirebaseDatabaseOnline !== false,
//   fbStorage: FirebaseDatabaseOnline !== 'local' &&  FirebaseDatabaseOnline !== false && FirebaseStorageOnline !== false,  

//   apiKey: "AIzaSyDd5QAIhTq3IIhX519MkV_DsL5y23B5SNM",
// 	authDomain: "fir-6f788.firebaseapp.com",
// 	databaseURL: FirebaseDatabaseOnline === 'local' ? "ws://localhost.firebaseio.test:5000" : "https://fir-6f788.firebaseio.com",
// 	storageBucket: "fir-6f788.appspot.com",
//   messagingSenderId: "43931174092",
//   fcmKey: "AAAACjqAhMw:APA91bGndxo9LZH-7CS4T-Yl-us0IAkBplS51jsvn_28WgocV3G_oF4329Dtac9h-bCn0cKZoWd9P7Ug_Mr20kS7VB18tv21ngS0D1teWM9MWTf8ZZRDGugbUbgOTR3mgi816BTo1oe1"
// };


export default FirebaseConfig;