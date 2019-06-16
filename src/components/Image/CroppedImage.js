import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  Text,
  View,
  LayoutAnimation,
  TouchableOpacity
} from 'react-native';

const styles = StyleSheet.create({

});

export default class DropDownList extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    let {source, resizeMode, children, cropHeight, cropWidth, cropTop, cropLeft, width, height, ...props} = this.props;
    let imageProps = {
      style: {
        position: 'absolute',
        top: cropTop * -1,
        left: cropLeft * -1,
        width: width,
        height: height
      },
      source : source,
      resizeMode: resizeMode,
      children: children,
    };

    props.style = [
      this.props.style,
      {
        overflow: 'hidden',
        height: cropHeight,
        width: cropWidth,
        backgroundColor: 'transparent'
      }
    ];

    return (
      <View {...props}>
        <Image {...imageProps} />
      </View>
    );
  }
}
