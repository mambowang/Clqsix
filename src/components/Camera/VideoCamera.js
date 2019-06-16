'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    Modal,
    Dimensions
} from 'react-native';

import ClqsixCamera from './Camera';
import Images from '../Images';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
class VideoCamera extends Component {
  photo = null;
  constructor(props) {
    super(props);
    this.state={
      cameraFront: false,
      cameraFlash: true,
      videoCapturing: false,
    };
  }
  capture() {
    this.refs.camera.capture({mode: Camera.constants.CaptureMode.video});
  }
  stopCapture() {
    this.refs.camera.stopCapture();
  }

  toggleCapture() {
    this.setState({
      videoCapturing: !this.state.videoCapturing
    });
    this.refs.camera.toggleCapture();
  }

  _onCaptured(source) {
    this.setState({
      videoCapturing: false
    });
    if (this.props.onCaptured) {
      this.props.onCaptured(source);
    }
  }

  _onRequestClose() {
    this.setState({
      videoCapturing: false
    });
    this.refs.camera.killCapture();
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  }

  render() {
    let {visible, transaprent, animationType, onRequestClose, ...props} = this.props;
    props.front = this.state.cameraFront;
    props.style = styles.preview;
    props.onRequestSelf = () => this.setState({cameraFront: !this.state.cameraFront});
    props.onRequestFlash = () => this.setState({cameraFlash: !this.state.cameraFlash});
    props.video = true;
    return (
      <Modal visible={visible === true} transaprent={transaprent===true} animationType={animationType || 'none'} onRequestClose={() => this._onRequestClose()}>
        <ClqsixCamera ref="camera" {...props}
         onRequestClose={() => this._onRequestClose()}
         _onCaptured= {(source) => this._onCaptured(source)}
         >
          <View style={styles.control}>
            <TouchableOpacity onPress={() => this.toggleCapture()}>
              {!! this.state.videoCapturing ?
                 <Image source={Images.Camera.stop_228x228} style = {{width: 74, height: 74}}/>
              :
            
                <Image source={Images.Camera.record_228x228} style = {{width: 74, height: 74}}/>
              }
             
            </TouchableOpacity>
          </View>
        </ClqsixCamera>
      </Modal>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor:'#000'
  },

  preview: {
    height:'100%',
    width: '100%',
  },
  control: {
    alignItems:'center',
    justifyContent:'flex-end',
    height:70,
    marginTop: window.height - 150,
  }
});

export default VideoCamera;