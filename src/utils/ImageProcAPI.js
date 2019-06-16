'use strict';

import React, {Component} from 'react';
import {ReactNative, Alert, Platform,Dimensions,Image} from 'react-native';
import RNFetchBlob from 'react-native-fetch-blob';
import fb from './FirebaseAPI';
import FirebaseStorageAPI from './FirebaseStorageAPI';
import ImageResizer from 'react-native-image-resizer';
import * as globals from '../common/Global';
import _ from 'lodash';

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
};

const ImageProcAPI = {
    getChangedImageSize(fileUrl) {
        return new Promise(function(resolve, reject) {             
            Image.getSize(fileUrl
                , (width, height) => {               
                    let changeWidth,changeHeight;
                    
                    if(width <= height){
                    changeHeight = window.height;
                    changeWidth = width *(window.height/height)
                    }else{
                    changeWidth =  window.width
                    changeHeight = height *(window.width/width)
                    }
                    resolve({width : changeWidth,height: changeHeight})
                },(error) =>{
                    reject(error);
                }
            );
        });
    },   
    resizeImage (imageUrl,size,quality){
        let _this = this;
        return new Promise(function(resolve, reject) {
          ImageResizer.createResizedImage(imageUrl, 
            size.width,
            size.height, 'JPEG', quality)
          .then(({uri}) =>resolve(uri))
          .catch(error => reject(error))
         });
    },
    uploadWithResizeImage(imageUrl,type,size){ 
        return new Promise(function(resolve, reject) {
            ImageProcAPI.resizeImage(imageUrl,size,100)
            .then(resizeUrl =>{
                FirebaseStorageAPI.uploadImageOnFirebase(resizeUrl,type)
                .then(downloadUrl =>resolve(downloadUrl))
                .catch(error => reject(error))
            })
            .catch(error => reject(error))
        });
    },
    uploadFullSize(imageUrl,size){
        let ratio = size.height/size.width;
        let iconSize = {
            width: globals.iconSize,
            height: globals.iconSize
        }
        let smallSize = {
          width: globals.smallSize,
          height: globals.smallSize * ratio
        }
        let middleSize = {
          width: globals.middleSize,
          height: globals.middleSize * ratio
        }
        let normalSize = {
          width: globals.normalSize,
          height: globals.normalSize * ratio
        }

        return new Promise(function(resolve, reject) { 
           return Promise.all([
               ImageProcAPI.uploadIcon(imageUrl,iconSize),
               ImageProcAPI.uploadNormal(imageUrl,normalSize),
               ImageProcAPI.uploadSmall(imageUrl,smallSize),
               ImageProcAPI.uploadMiddle(imageUrl,middleSize),
               ImageProcAPI.uploadStandard(imageUrl,size),
               ])
           .then(function(value) {
                let detailData = {};
                _.map(value,(element) =>{
                    return _.extend(detailData,element);
                })
               resolve(detailData);
            })
            .catch(error => reject(error))
        });
    }, 

    uploadIcon(imageUrl,iconSize){
        return new Promise(function(resolve, reject) { 
            ImageProcAPI.uploadWithResizeImage(imageUrl,globals.ICON,iconSize)
            .then(url =>{
                 resolve({iconUrl:url})
                }
            )
            .catch(error => reject(error))
          });
    }, 
    uploadNormal(imageUrl,normalSize){
        return new Promise(function(resolve, reject) { 
            ImageProcAPI.uploadWithResizeImage(imageUrl,globals.NORMAL,normalSize)
            .then(url =>resolve({normalUrl:url}))
            .catch(error => reject(error))
          });
    },
    uploadSmall(imageUrl,smallSize){
        return new Promise(function(resolve, reject) { 
            ImageProcAPI.uploadWithResizeImage(imageUrl,globals.SMALL,smallSize)
            .then(url =>resolve({smallUrl:url}))
            .catch(error => reject(error))
          });
    },
    uploadMiddle(imageUrl,middleSize){
        return new Promise(function(resolve, reject) { 
            ImageProcAPI.uploadWithResizeImage(imageUrl,globals.MIDDLE,middleSize)
            .then(url =>resolve({middleUrl:url}))
            .catch(error => reject(error))
          });
    },
    uploadStandard(imageUrl,standardSize){
        return new Promise(function(resolve, reject) { 
            ImageProcAPI.uploadWithResizeImage(imageUrl,globals.STANDARD,standardSize)
            .then(url =>resolve({standardUrl:url}))
            .catch(error => reject(error))
          });
    },
   

}

export default ImageProcAPI;