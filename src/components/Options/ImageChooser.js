'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
} from 'react-native';

import ImagePicker from 'react-native-image-picker';

import Options from './Options';

class ImageChooser extends Component {

  constructor(props) {
    super(props);
  }

  _onImageSelected(response) {
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
      let source = { uri: response.uri };
    // You can also display the image using data:
    // let source = { uri: 'data:image/jpeg;base64,' + response.data };
      if (this.props.onImageSelected) {
        this.props.onImageSelected(source);
      }
    }
    this.hide();
  }

  show() {
    this.refs.options.show();
  }

  hide() {
    this.refs.options.hide();
  }

  launchImageLibrary() {
    ImagePicker.launchImageLibrary(
      {
        quality: 1.0,
        allowsEditing: false,
      },
      (response) => {this._onImageSelected(response);}
    );
  }


  launchCamera() {
    ImagePicker.launchCamera(
      {
        quality: 1.0,
        allowsEditing: false,
      },
      (response) => {this._onImageSelected(response);}
    );
  }
  
  render() {
    var _this = this;
    return(
      <Options ref='options' items={[
        {
          value: 0,
          text: 'Choose from Library',
        },
        {
          value: 1,
          text: 'Take photo',
        }
      ]} onSelectItem={(item) => { item.value == 0 ? _this.launchImageLibrary() : _this.launchCamera(); return false; }} />
    );
  }
}
export default ImageChooser;