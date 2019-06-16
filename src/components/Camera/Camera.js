'use strict';
import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';

import Camera from 'react-native-camera';

import ImagePicker from 'react-native-image-picker';

import PhotoCamera from './PhotoCamera';

import VideoCamera from './VideoCamera';

import Images from '../Images'


const styles = StyleSheet.create({
  fullscreen: {
    position:'absolute',
    left:0,
    top:0,
    right:0,
    bottom:0
  },
  container: {
    flex: 1,
    flexDirection:'row',
    paddingHorizontal:20,
    paddingBottom:25,
    paddingTop:15,
  },
  leftPanel: {
    flexDirection:'column',
    justifyContent:'space-between',
    alignItems:'flex-end'
  },
  centerPanel: {
    flex:1,
    justifyContent:'flex-end',
    alignItems:'center',
    backgroundColor: '#00000000',
  
    
    
  },
  rightPanel: {
  
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'flex-end'
  }
})

export default class ClqsixCamera extends Component {

  static Photo = PhotoCamera;
  static Video = VideoCamera;
  camera = null;
  videoUri = null;
  recordingTimer = null;
  constructor(props) {
    super(props);
    this.state = {
      capturing : false,
      recordTime: 0,
    }
  }

  _onRequestFlash() {
    if (!this.state.capturing && this.props.onRequestFlash) {
      this.props.onRequestFlash();
    }
  }

  _onRequestSelf() {
    if (!this.state.capturing && this.props.onRequestSelf) {
      this.props.onRequestSelf();
    }
  }
  _onRequestClose() {
    
      if (this.props.onRequestClose && !this.state.capturing) {
        this.props.onRequestClose();
      }
    }
  render() {
    let {onCaptured, children,onRequestClose, ...props} = this.props;
    if (this.props.video === true ) {
      props.captureMode = Camera.constants.CaptureMode.video;
    }
    if (this.props.flash === true) {
      props.flashMode = Camera.constants.FlashMode.on;
    } else {
      props.flashMode = Camera.constants.FlashMode.off; //auto
    }
    
    
    props.aspect = Camera.constants.Aspect.fill;
      
   
   
    if (this.props.front === true) {
      props.type = Camera.constants.Type.front;
    } else {
      props.type = Camera.constants.Type.back;
    }
    return (
      <Camera ref={ref=>this.camera=ref} {...props} captureTarget = {
        !!this.props.video ? Camera.constants.CaptureTarget.disk: Camera.constants.CaptureTarget.cameraRoll }>
        <View style={styles.fullscreen}>
          <View style={styles.container}>
            <View style={styles.leftPanel}>
              <TouchableOpacity 
                onPress={() => this._onRequestClose()}              
                accessible={!this.isCapturing()}>
                <Image source={Images.Camera.Cancel_51x51}   style = {{marginTop: 20,width:20,height:20}}/>
              </TouchableOpacity>            
              <TouchableOpacity onPress={() => {this.launchLibrary()}} accessible={!this.isCapturing()}>
              <Image source={Images.Camera.ChooseLibrary} />
              </TouchableOpacity>               
              {/* <TouchableOpacity 
                onPress={() => this._onRequestFlash()}
                accessible={!this.isCapturing()}>
                <Image source={Images.Camera.FlashIcon_42x66} style = {{width:20,height:30}} />
              </TouchableOpacity> */}            
            </View>            
              <View style={styles.centerPanel}>   
                {!!this.state.capturing &&
                <Text style = {{color: 'white',fontWeight: 'bold',fontSize: 18}}>00:
                {this.state.recordTime < 10 ? "0" + this.state.recordTime : this.state.recordTime}
                
                </Text> }
              </View>
            
        
              <View style={styles.rightPanel}>             
                <TouchableOpacity onPress={() => this._onRequestSelf()} accessible={!this.isCapturing()}>
                  <Image source={Images.Camera.Self_69x60} style = {{width:25,height:25}} />
                </TouchableOpacity>
              </View>
          </View>
        </View>
        { children }
      </Camera>
    );
  }
  isCapturing() {
    return this.state.capturing === true;
  }

  launchImageLibrary() {
    ImagePicker.launchImageLibrary(
      {
        quality: 1.0,
        allowsEditing: false,
        title: 'Photos', 
        mediaType: 'photo'
      },
      (response) => {this._onPickImage(response);}
    );
  }

  launchVideoLibrary() {
    ImagePicker.launchImageLibrary(
      {
        quality: 1.0,
        title: 'Videos', 
        allowsEditing: false,   
        mediaType: 'video',
      },
      (response) => {this._onPickImage(response);}
    );
  }

  launchLibrary() {
    if (!this.caputring) {
      if (this.props.video === true) {
        this.launchVideoLibrary();
      } else{
        this.launchImageLibrary();
      }
    }
  }

  capture() {
    var options = (this.props.video === true)?
                {mode: Camera.constants.CaptureMode.video,totalSeconds: 10,jpegQuality:100}              
                :{mode: Camera.constants.still}
    this.videoUri = null;
    if (this.props.video === true ) {
      this.setState({
        capturing: true,
        recordTime: 0,
      });
    }
    //this.camera.capture({metadata: options})
    this.camera.capture( options)
    .then((data) => {  
      if (this.props.video === true) {     
         this.videoUri = data.path;
        // alert("videoUri:  " + JSON.stringify(this.videoUri))
        !!this.recordingTimer && clearInterval(this.recordingTimer);
         this._onCaptured(data.path);
      } else {
        this._onCaptured(data.mediaUri);
      }
    })
    .catch(err => {
      if (this.state.capturing) {
        this.setState({
          capturing: false
        });
      }
      console.error(err);      
    });
    if (this.props.video  === true) {
      this.recordingTimer =   setInterval(() => {
      
        this.setState((prevState) => {
          return {
            recordTime: prevState.recordTime + 1 || 10
          };
        });
      }, 1000);
    }   
  }

  _stopCapture() {
    this.camera.stopCapture();    
  }

  stopCapture() {
    this._stopCapture();
    if (this.props.onCaptured && this.videoUri) {
     // this._onCaptured(this.videoUri);
      this.videoUri = null;
    }
  }

  killCapture() {
    this._stopCapture();
    this.videoUri = null;
  }

  toggleCapture() {
    if (!this.state.capturing) {
      this.capture();
    } else {
      this.stopCapture();
    }
  }

  _onPickImage(response) {    
    if (response.didCancel) {
      //console.log('User cancelled photo picker');
    }
    else if (response.error) {
      //console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
     // console.log('User tapped custom button: ', response.customButton);
    }
    else {
      this._onCaptured(response.uri);
    }
  }

  _onCaptured(uri) {    
    if (this.state.capturing) {
      this.setState({
        capturing: false,
        recordTime:  0,
      });
      
    }
    if (this.props._onCaptured) {
      this.props._onCaptured({
        uri: uri
      });
    }
  }
}
