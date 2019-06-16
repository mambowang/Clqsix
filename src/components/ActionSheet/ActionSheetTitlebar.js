'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import Images from '../Images';

const styles = StyleSheet.create({

  fullscreen: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
  },

  container: {
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
      fontFamily: 'SF UI Text',
      fontWeight: 'bold',
      fontSize: 15,
  },

  closeButtonContainerDefault: {
    paddingHorizontal: 20
  },

  closeButtonContainer: {
    flexDirection:'row',
    alignItems: 'center',
    justifyContent: 'flex-start', 
  }

});

class ActionSheetTitlebar extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    let {title, style, children, titleStyle, closeButtonStyle, ...props} = this.props;
    
    props.style=[styles.container, style];
    
    titleStyle = titleStyle ? [styles.title, titleStyle] : styles.title;
    
    closeButtonStyle = closeButtonStyle 
      ? [styles.closeButtonContainerDefault, this.props.closeButtonStyle, styles.closeButtonContainer] 
      : [styles.closeButtonContainerDefault, styles.closeButtonContainer];
    
    return (
      <View {...props}>

        <Text style={titleStyle}>{title ? title : ''}</Text>
        
        <View style={[styles.fullscreen, closeButtonStyle]}>
          <TouchableOpacity onPress={() => this._onRequestClose()}>
            <Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>
          </TouchableOpacity>
        </View>

      </View>
    );
  }

  _onRequestClose() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
  }
}



export default ActionSheetTitlebar;



        