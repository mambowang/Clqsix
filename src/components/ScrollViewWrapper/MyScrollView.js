'use strict';

import React, { Component } from 'react';
import {
  ScrollView,
  Keyboard,
} from 'react-native';

class MyScrollView extends Component {

  data = {
    scrollX : 0,
    scrollY : 0,
    contentW: -1,
    contentH: -1,

    x: -1,
    y: -1,
    w: -1,
    h: -1,
  };

  keyboardMountListener = null;
  keyboardDismountListener = null;

  constructor(props) {
    super(props);
    this.state={
      scrollEnabled: false
    }
  }

  componentWillMount() {
    if (!this.keyboardMountListener) {
      this.keyboardMountListener = Keyboard.addListener("keyboardWillShow", () => {
        if (this.props.scrollEnabledOnKeyboard === true && this.props.scrollEnabled === false && !!this.refs.inner) {
          this.setState({scrollEnabled: true});
        }
      });
    }
    if (!this.keyboardDismountListener) {
      this.keyboardDismountListener = Keyboard.addListener("keyboardWillHide", () => {
        if (this.props.scrollEnabledOnKeyboard === true && this.state.scrollEnabled === true && this.props.scrollEnabled === false) {
          if (!!this.refs.inner) {
            this.refs.inner.scrollTo({x:0, y:0, animated:true});
            this.setState({scrollEnabled: false});
          }
        }
      });
    }
  }

  componentWillDismount() {
    this.keyboardMountListener && Keyboard.removeListener(this.keyboardMountListener);
    this.keyboardDismountListener && Keyboard.removeListener(this.keyboardDismountListener);
    this.keyboardMountListener = null;
    this.keyboardDismountListener = null;
  }

  scrollView() {
    return this.refs.inner;
  }

  scrollX() {
    return this.data.scrollX;
  }

  scrollY() {
    return this.data.scrollY;
  }

  scrollTo(x, y, animated) {
    let inner = this.refs.inner;
    if (!!inner) {
      if (!!y && typeof(y) == 'number'){
        y = y < 0 ? 0: y;
      }
      if (!!x) {
        if (typeof(x) != 'number') {
          let cloneX = Object.assign({}, x);
          if (cloneX.x < 0) cloneX.x = 0;
          if (cloneX.y < 0) cloneX.y = 0;
          inner.scrollTo(cloneX, y, animated);
          return;
        }
        x = x < 0 ? 0: x;
      }
      inner.scrollTo(x, y, animated);
    }
  }

  scrollToStart(animated) {
    this.scrollTo({x: 0,  y: 0, animated: animated});
  }

  scrollToEnd(animated) {
    this.ref.inner.scrollToEnd(animated);
  }

  scrollToRef(ref) {
    let inner = this.refs.inner, animated = true;
    setTimeout(() => {
      ref.measure((refFrameX, refFrameY, refWidth, refHeight, refPageX, refPageY) => {
        let y, {scrollX, scrollY} = this.data, delta = refHeight / 2;

        if (refPageY < this.data.y) {
          
          y = scrollY + refPageY - this.data.y - delta
          if (y < 0)  y = 0;
          inner.scrollTo({x:0, y: y, animated:animated});
        } else if (this.data.y + this.data.h < refPageY + refHeight) {
          y = scrollY+ refPageY + refHeight - this.data.y - this.data.h + delta;
          if (y < 0)  y = 0;
          let {contentH} = this.data;
          if (contentH > 0) {
            if(contentH - this.data.h < y) inner.scrollToEnd(true);
            else inner.scrollTo({x:0, y: y, animated:animated});
          }
        }
      });
    }, 0);
  }

  render() {
    let { scrollEnabledOnKeyboard, ...props } = this.props;

    props.scrollEnabled = this.props.scrollEnabled!==false || (scrollEnabledOnKeyboard===true && this.state.scrollEnabled);
    props.onScroll = (e) => this._onScroll(e);
    props.onScrollAnimationEnd = (e) => this._onScrollAnimationEnd(e);
    props.onContentSizeChange = (w, h) => this._onContentSizeChange(w, h);
    props.onLayout = (e) => this._onLayout(e);
    props.scrollEventThrottle = !this.props.scrollEventThrottle && this.props.scrollEventThrottle !== 0 ? 100 : this.props.scrollEventThrottle;
    
    return (
      <ScrollView ref="inner" {...props} />
    );
  }

  _onScroll(e) {
    this.data.scrollX = e.nativeEvent.contentOffset.x;
    this.data.scrollY = e.nativeEvent.contentOffset.y;
    this.data.contentW = e.nativeEvent.contentSize.width;
    this.data.contentH = e.nativeEvent.contentSize.height;
    if (!!this.props.onScroll) {
      this.props.onScroll(e);
    }
  }

  _onScrollAnimationEnd(e) {
    
    his.data.scrollX = e.nativeEvent.contentOffset.x;
    this.data.scrollY = e.nativeEvent.contentOffset.y;
    this.data.contentW = e.nativeEvent.contentSize.width;
    this.data.contentH = e.nativeEvent.contentSize.height;
    if (!!this.props.onScrollAnimationEnd) {
      this.props.onScrollAnimationEnd(e);
    }
  }

  _onContentSizeChange(width, height) {
    this.data.contentW = width;
    this.data.contentH = height;
    if (this.props.onContentSizeChange) {
      this.props.onContentSizeChange(width, height);
    }
  }

  _onLayout(e) {
    let {x, y, width, height} = e.nativeEvent.layout;
    this.data.x = x;
    this.data.y = y;
    this.data.w = width;
    this.data.h = height;
    if (!!this.props.onLayout) {
      this.props.onLayout(e);
    }
  }

}

export default MyScrollView;