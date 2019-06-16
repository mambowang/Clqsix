'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
    Alert
} from 'react-native';


var guid = require('guid');

class ImageHorizontalScrollView extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var imageItems = this.props.images || [];
    var imageHeight = this.props.imageHeight || 100;
    var imageBetweenSpace = this.props.imageBetweenSpace || 10;
    return (
      <View style={[styles.container, this.props.style, {height: imageHeight}]}>
        <ScrollView
        automaticallyAdjustContentInsets={true} 
        horizontal={true} 
        showsHorizontalScrollIndicator={false} 
        alwaysBounceHorizontal={true} 
        centerContent={true}>
          {
            imageItems.map((item, i) => {
              var imageWidth,ignore=true;
              if (item.source.uri) {
                Image.getSize(item.source.uri, function(width, height) {
                  ignore = false;
                  imageWidth =  imageHeight * width / height
                }, function() {
                });
                if (ignore) {
                  return null;
                }
              } else {
                imageWidth = this.props.imageWidth || imageHeight * 3 / 4;
              }
              
              if (i == 0) {
                return (
                  <Image key={i} source={item.source} style={[styles.image, {width: imageWidth}]}/>
                );
              } else {
                return (
                  <Image key={i} source={item.source} style={[styles.image, {width: imageWidth, marginLeft: imageBetweenSpace}]}/>
                )
              }
            })
          }
        </ScrollView>
      </View>
      );
    }
}
const styles = StyleSheet.create({
  container: {
    flexDirection:'row'
  },

  image: {
    height: '100%',
  }
});

export default ImageHorizontalScrollView;