'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Keyboard,
  Alert,
  TextInput,
  Modal
} from 'react-native';

import Images from '../Images';

import DropDownList from './DropDownList';

const ITEMS = [
  {
    colorPrefix: '#ED1F99',
    value: 'Female',
    text: 'Female',
  },
  {
    colorPrefix: '#005D9A',
    value: 'Male',
    text: 'Male',
  },
  {
    colorPrefix: '#1E9B91',
    value: 'Custom',
    text: 'Custom',
    isModal: true,
  }
];

const styles = StyleSheet.create({

  container: {
    position:'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    alignItems: 'center'
  },

  navigationBar: {
    left: 0,
    right: 0,
    height: 64,
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'center',
  },

  title: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'SF UI Text',
    fontSize: 17,
    fontWeight: 'bold',
  },

  inputContainer : {
    paddingHorizontal: 53,
    marginTop: 56,
    flex: 1,
    width: '100%'
  },

  input: {
    height: 40, width: '100%'
  }

});

class GenderDropDownList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCustomGender: false
    };
  }

  _onSelectItem(item) {    
    if (item.isModal === true) {
      this.setState({
        showCustomGender: true
      });
    } else if (this.props.onSelectItem) {
      this.props.onSelectItem(item);
    }
  }
  
  render() {
    let props = {... this.props,
      placeholder : 'Gender',
      items: ITEMS,
      onSelectItem: (item) =>{this._onSelectItem(item);}
    };
    return( 
        <DropDownList ref='inner' {...props}>
          <Modal visible={this.state.showCustomGender} transparent={false} onRequestClose={()=>{}}>
            <View style={styles.container}>
              <View style={styles.navigationBar}>
                <TouchableOpacity onPress={() => {this._customGenderCancel()}}>
                  <Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>
                </TouchableOpacity>
                <Text style={styles.title}>Custom Gender</Text>
                <TouchableOpacity onPress={() => {this._customGenderOk()}}>
                  <Image source={Images.Check_Black_17x13}/>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder='Enter your preferred gender name' onChangeText={(text) => {this.customGender = text}}/>
              </View>
            </View>
          </Modal>
        </DropDownList>
    );
  }

  _customGenderCancel() {
    this.setState({
      showCustomGender: false
    });
  }

  _customGenderOk() {
    var item = {
      value: this.customGender,
      text: this.customGender
    };
    this.setState({
      showCustomGender: false
    });
    this._onSelectItem(item);
  }
}

export default GenderDropDownList;