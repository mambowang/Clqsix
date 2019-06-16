'use strict';

import React, {Component} from 'react';
import {ReactNative, Alert, Platform} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import fb from './FirebaseAPI';

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;
const DEBUG_URL = null;//'http://lorempixel.com/400/200';
const uploadFile = (uri, mime = 'application/octet-stream', fileName = null, storage = 'files') => {
  return new Promise((resolve, reject) => {
    if (fb.fbStorage) {
      const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri;
      const sessionId = new Date().getTime();
      let uploadBlob = null;
      const fileName = !fileName ? `${sessionId}` : fileName;
      const fileRef = fb.firebaseStorage.ref(storage).child(fileName);
      fs.readFile(uploadUri, 'base64')
      .then((data) => {
        return Blob.build(data, { type: `${mime};BASE64` });
      })
      .then((blob) => {
        uploadBlob = blob
        return fileRef.put(blob, { contentType: mime });
      })
      .then(() => {
        uploadBlob.close();
        return fileRef.getDownloadURL();
      })
      .then((url) => {
        resolve(url);
      })
      .catch((error) => {
        reject(error);
      });
    } else {
      resolve(DEBUG_URL || uri);
    }
  });
}
const deleteFile = (fileUrl = null ) => {
  return new Promise((resolve, reject) => {
    if (fb.fbStorage) {
      const fileRef = fb.firebaseStorage.refFromURL(fileUrl);
      // Delete the file
      fileRef.delete().then(function() {
        // File deleted successfully
        resolve();
      }).catch(function(error) {
        // Uh-oh, an error occurred!
        reject(error);
      });
    }
  });
}
const downloadFile = (uri,appendExt = null) => {
  return new Promise((resolve, reject) => {
    if (fb.fbStorage) {

      RNFetchBlob
      .config({
        // add this option that makes response data to be stored as a file, 
        // this is much more performant. 
        fileCache : true,
        appendExt : appendExt
      })
      .fetch('GET', uri, {
        //some headers .. 
      })
      .then((res) => {
        // the temp file path 
        console.log('The file saved to ', res.path())
        resolve(res.path());
      })
      .catch((error) => {
        reject(error);
      });
    } else {
      resolve(DEBUG_URL || uri);
    }
  });
}
const FirebaseStorageAPI = {
  uploadFileOnFirebase(fileUrl) {
    return uploadFile(fileUrl);
  },
  uploadImageOnFirebaseNew(fileUrl,type = null) {
    if(type == null){
      type = "normal"
    }
    return uploadFile(fileUrl, 'image/jpg', '', 'images/' + type);
  },
  uploadImageOnFirebase(fileUrl) {
  
    return uploadFile(fileUrl, 'image/jpg', '', 'images');
  },
  uploadVideoOnFirebase(fileUrl) {
    return uploadFile(fileUrl, 'video/mp4', '', 'videos');
  },
  uploadMoodOnFirebase(fileUrl) {
    return uploadFile(fileUrl, 'video/mp4', '', 'moodes');
  },
  uploadThumbnailOnFirebase(fileUrl) {
    
    return uploadFile(fileUrl, 'image/jpg', '', 'thumbnails');
  },
  downloadFileOnFirebase(fileUrl,type) {
    return downloadFile(fileUrl,type);
  },
  deleteFileOnFirebase(fileUrl) {
    return deleteFile(fileUrl);
  },

}

export default FirebaseStorageAPI;