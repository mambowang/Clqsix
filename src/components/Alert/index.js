'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from 'react-native';

import {
  ActionSheet,
} from '../ActionSheet'

import {
  StyleAPI
} from '../../utils';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const styles = StyleSheet.create({

});

class Alert extends Component {

  constructor(props) {
    super(props);
  }

  
  show () {
    this.refs.inner.show();
  }

  hide () {
    this.refs.inner.hide();
    this._onHide();
  }
  

  render() {
    let {title,text, style, onHide,closeButtonSource,cancleButtonSource, ...props} = this.props;
    let texts = !!text ? (texts = !!text.push ? text : [text]) : undefined;
    props.style= [{justifyContent:'center', alignItems: 'center'}];

    if (text) {
      texts = !!text.push ? text : [text];
    }
    let mergedStyle = StyleAPI.mergeStyle(style);
    let {padding, paddingTop, paddingRight, paddingBottom, paddingLeft, paddingHorizontal, paddingVertical, ...otherStyle} = mergedStyle;
    let contentStyle = {};
    padding && (contentStyle.padding=padding);
    paddingTop && (contentStyle.paddingTop=paddingTop);
    paddingRight && (contentStyle.paddingRight=paddingRight);
    paddingLeft && (contentStyle.paddingLeft=paddingLeft);
    paddingBottom && (contentStyle.paddingBottom=paddingBottom);
    paddingVertical && (contentStyle.paddingVertical=paddingVertical);
    paddingHorizontal && (contentStyle.paddingHoroizontal=paddingHoroizontal);

    props.animationType = 'none';

    return (
      <ActionSheet.Container ref="inner" {...props}>
        <View style={[{paddingHorizontal: 22, paddingVertical: 30,justifyContent: 'space-between',
        backgroundColor: '#24d770', width: window.width * 0.8, minHeight: 100},  
        otherStyle, {flexDirection: 'column'}]}>
         
          <View style={[{}, contentStyle, { flexDirection:'column',}]}>
             {/* add title by rgs */}
              {!!title &&
                <Text  style={{fontFamily: 'SF UI Text', fontWeight: 'bold', fontSize: 18, color: 'white',paddingBottom:20}}>
                    {title}
                </Text>
              }
              {props.children}
              {texts && texts.map((item, i) => 
                <Text key={i} style={{fontFamily: 'SF UI Text', fontWeight: 'bold', fontSize: 15, color: 'white'}}>
                  {item}
                </Text>
              )}          
          </View>
          
          <View style={[contentStyle, {flexDirection:'row',justifyContent: 'flex-end'}]}>
             
             
              <View style = {{width: '50%',paddingTop: 30}}>
                {!!cancleButtonSource &&
                  <TouchableOpacity onPress={() => this._onRequestCancle()}
                  style={{justifyContent: 'flex-start',alignItems: 'flex-start'}} >
                    <View style={[ contentStyle, 
                      { flexDirection:'column',justifyContent: 'flex-end',alignItems: 'flex-end'}]}>
                        <Image source= {cancleButtonSource}/>
                    </View>
                  </TouchableOpacity>}
              </View>
              <View style = {{width: '50%',paddingTop: 30}}>
                  {!!closeButtonSource &&
                  <TouchableOpacity onPress={() => this._onRequestClose()} 
                  style={{justifyContent: 'flex-end',alignItems: 'flex-end'}}>
                    <View style={[ contentStyle,]}>
                      <Image source= {closeButtonSource}/>
                    </View>
                  </TouchableOpacity>
                  }
              </View>
            </View>
        </View>
      </ActionSheet.Container>
    );
  }
  _onRequestClose() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
    this._onHide();
  }
  _onRequestCancle() {
    if (this.props.onRequestCancle) {
      this.props.onRequestCancle();
    }
    this._onHide();
  }
  _onHide() {
    if (this.props.onHide) {
      this.props.onHide();
    }
  }
}

export default Alert;



        