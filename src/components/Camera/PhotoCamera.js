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
import Images from '../Images'
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
class PhotoCamera extends Component {

  photo = null;

  constructor(props) {
    super(props);
    this.state={
      cameraFront: false,
      cameraFlash: true,
    };
  }

  capture() {
    this.refs.camera.capture();
  }

  _onCaptured(source) {
    if (this.props.onCaptured) {
      this.props.onCaptured(source);
    }
  }

  _onRequestClose() {
  
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
    props.video = false;
    return (
      <Modal visible={visible === true} transaprent={transaprent===true} 
        animationType={animationType || 'none'}
      
       onRequestClose={() => this._onRequestClose()}>      
         <ClqsixCamera ref="camera" {...props} 
           _onCaptured= {(source) => this._onCaptured(source)}
         onRequestClose={() => this._onRequestClose()}> 
          <View style={styles.control}>
            <TouchableOpacity onPress={() => this.capture()}>
              <Image source={Images.Camera.TakePhoto_228x228} style = {{width: 74, height: 74}}/>
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
  top:{
    flex:1,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#000'
  },
  control: {
  
    alignItems:'center',
    justifyContent:'flex-end',
    height:70,
    marginTop: window.height - 150,
  
  }
});

export default PhotoCamera;