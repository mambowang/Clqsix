'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ViewPropTypes
} from 'react-native';

class Content extends Component {

  scrollView = null;
  _scrollX = 0;
  _scrollY = 0;
  _scrollContentW = -1;
  _scrollContentH = -1;

  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: this.props.scrollEnabled === undefined ? this.props.scrollable : this.props.scrollEnabled
    }
  }

  setScrollEnabled(value) {
    this.setState({
      scrollEnabled: value
    });
  }

  scrollX() {
    return this._scrollX;
  }

  scrollY() {
    return this._scrollY;
  }

  scrollTo(x, y, animated) {
    if (this.scrollView != null) {
      if (y !== undefined && y !== null && typeof(y) == 'number'){
        y = y < 0 ? 0: y;
      }
      if (x != undefined && x !== null) {
        if (typeof(x) == 'number') {
          x = x < 0 ? 0: x;
        } else {
          var _x = Object.assign({}, x);
          if (_x.x < 0) {
            _x.x = 0;
          }
          if (_x.y < 0) {
            _x.y = 0;
          }
          this.scrollView.scrollTo(_x, y, animated);
          return;
        }
      }
      this.scrollView.scrollTo(x, y, animated);
    }
  }

  scrollToStart(animated) {
    this.scrollTo({x: 0,  y: 0, animated: animated});
  }

  scrollToEnd(animated) {
    this.scrollView.scrollToEnd(animated);
  }

  scrollToRef(ref, delta) {
    var _this = this;
    if (delta === undefined || delta === null) {
      delta = 50;
    }
    setTimeout(() => {
      ref.measure(function(ox, oy, w, h, px, py){
        _this.measure(function(ox1, oy1, w1, h1, px1, py1){
          var y;
          if (py - delta < py1) {
            y = _this._scrollY + py  - py1 - delta;
            _this.scrollTo({x:0, y: y, animated:true});
          } else if (py1 + h1 < py + h + delta) {
            y = _this._scrollY + py + h +delta - py1 - h1;
            
            if (_this._scrollContentH > 0 && (_this._scrollContentH - h1) < y) {
              _this.scrollToEnd(true);
            } else {
              _this.scrollTo({x:0, y: y, animated:true});
            }
          }
        });
      });
    }, 0);
  }

  measure(fnCallback) {
    if (this.refs.inner) {
      this.refs.inner.measure(fnCallback);
    }
  }

  render() {
    var props = Object.assign({}, this.props);
    props.style=[styles.content, this.props.style, styles.contentImportant];

    var content;

    if (this.props.scrollable && this.props.scrollable===true) {
      content =
        <ScrollView ref={(ref) => this.scrollView = ref} showsVerticalScrollIndicator={false} scrollEnabled={this.state.scrollEnabled} onScroll={(e) => this._onScroll(e)} style={{height:'100%'}}>
          <View {...props}>
            {this.props.children}
          </View>
        </ScrollView>;
    } else {
      content = <View {...props} />;
    }

    return (
      <View ref="inner" style={[styles.container, this.props.style, styles.containerImportant]}>
        { content }
      </View>
    );
  }

  _onScroll(e) {
    this._scrollX = e.nativeEvent.contentOffset.x;
    this._scrollY = e.nativeEvent.contentOffset.y;
    this._scrollContentW = e.nativeEvent.contentSize.width;
    this._scrollContentH = e.nativeEvent.contentSize.height;
    if (this.props.onScroll) {
      this.props.onScroll(e);
    }
  }
}

Content.propTypes = {
  style: ViewPropTypes.style,
}

const styles = StyleSheet.create({
  
  container: {
    flex: 1,
  },

  containerImportant: {
    flexDirection: 'row',
    paddingVertical: 0,
    paddingHorizontal: 0,
    paddingTop: 0,
    paddingRight: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    
  },

  content: {
    
  },

  contentImportant: {
    flex: 1,
    borderWidth: 0,
    borderTopWidth: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderLeftWidth:0,
    marginVertical: 0,
    marginHorizontal: 0,
    marginTop: 0,
    marginRight: 0,
    marginBottom: 0,
    marginLeft: 0,
  }

});

export default Content;