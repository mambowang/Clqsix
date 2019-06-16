'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  StyleAPI
} from '../../utils';

import ReactNativeAutoResponsive from './CustomReactNativeAutoResponsive';

const guid = require('guid');

let styles = StyleSheet.create({
  temp: {
    position:'absolute',
    left:0,
    top:0,
    opacity: 0,
  }
});

class CustomAutoResponsive extends React.Component {

  width = -1;

  constructor(props) {
    super(props);
    this.state = {
      screenWidth: -1,
      itemWidth: 0,
      array: [],
      index: 0,
    }
  }

  _onLayout(e) {
    let {width, height} = e.nativeEvent.layout;
    if (width > 0) {
      let screenWidth = this._caculateScreenWidth(width);
      if (this.state.screenWidth !== screenWidth) {
        this.setState({
          screenWidth: screenWidth,
          itemWidth: this._calculateItemWidth(screenWidth)
        });
      }
    }

    if (!!this.props.onLayout) {
      this.props.onLayout(e);
    }
  }

  getItemMarginHorizontal() {
    if (!!this.props.itemMargin) {
      if ('number' === typeof this.props.itemMargin) {
        return this.props.itemMargin;
      }
      return this.props.itemMargin.horizontal || 0;
    }
    return 0;
  }

  _getChildrenStyle() {
    return {
      width: this.state.itemWidth,
      flexDirection: 'column',
    };
  }

  _getAutoResponsiveProps() {
    let props = {
      itemMargin: this.props.itemMargin || 0,
    }
    if (this.state.screenWidth > 0) props.containerWidth = this.state.screenWidth;
    return props;
  }

  _renderChild(item, i, temp) {

    if (!this.state.screenWidth) {
      return null;
    }

    let props = {}; temp = temp === true;

    let fnUpdateArray = (newItem) => {
      let nextIndex = parseInt(this.state.index) + 1
      if (nextIndex === 1) {
        this.state.array = [];
      }
      setTimeout(() => {
        this.setState({
          array: [...this.state.array, newItem],
          index: nextIndex,
        });
      }, 0);
    };

    if (temp) {
      if (!!item.height) {
        fnUpdateArray(item);
        return null;
      }
      
      props.style = this._getChildrenStyle();
      props.key = guid();
      props.onLayout = async (e) => {
        let {height} = e.nativeEvent.layout;
        fnUpdateArray({...item, height:height});
      };
    } else {
      props.key = !!item.key ? item.key : i;
      props.style = [this._getChildrenStyle(), {height: item.height}];
    }

    return this.props.renderItem ? this.props.renderItem(item, i, props) : null;
  }

  _renderTempChild() {
    if (!this.props.items || this.props.items.length <= 0) {
      if (this.state.index !== 0) {
        this.state.index = 0;
        if (this.state.array.length > 0) { 
          this.state.array = [];
        }
      } else if (this.state.array.length > 0) {
        this.state.array = [];
      }
      return null;
    }

    if (this.state.screenWidth <= 0) {
      return null;
    }

    if (this.state.index < this.props.items.length) {
      return this._renderChild(this.props.items[this.state.index], this.state.index, true);
    }

    this.state.index = 0;
    return null;
  }

  _renderChildren() {
    return this.state.array.map((item, i) => {
      return this._renderChild(item, i);
    }, this);
  }

  _caculateScreenWidth(screenWidth) {
    let style = StyleAPI.mergeStyle(this.props.style);
    let marginLeft = style.marginLeft || style.marginHorizontal || 0;
    let marginRight = style.marginRight || style.marginHorizontal || 0;
    let paddingLeft = style.paddingLeft || style.paddingHorizontal || 0;
    let paddingRight = style.paddingRight || style.paddingHorizontal || 0;
    return screenWidth - marginLeft - marginRight - paddingLeft - paddingRight;
  }

  _calculateItemWidth(screenWidth) {
    return (screenWidth - this.getItemMarginHorizontal()) / 2;
  }

  render() {
    let {itemMargin, children, childrenPos, items, ...props} = this.props;

    let tempStyle= [this._getChildrenStyle(), styles.temp];
    props.style=[this.props.style];
    props.onLayout = (e) => this._onLayout(e);
    return (
      <View {...props}>
        <View style={tempStyle}>{this._renderTempChild()}</View>
        { childrenPos === 'before' && {...children} }
        <ReactNativeAutoResponsive {...this._getAutoResponsiveProps()}>
          {this._renderChildren()}
        </ReactNativeAutoResponsive>
        { childrenPos === 'after' && {...children} }
      </View>
    );
  }
}

module.exports = CustomAutoResponsive;
