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
    Alert,
    Platform
} from 'react-native';

import Images from '../Images';

var guid = require('guid');
const IsIOS = Platform.OS === 'ios';

let Common = require('autoresponsive-common');
let {
  Util
} = Common;

class HorizontalScrollPageViewItem extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return null;
  }

  
}

class HorizontalScrollPageView extends Component {

  static Item = HorizontalScrollPageViewItem;

  _scrollX = 0;
  _scrollY = 0;
  _pagingOnScroll = true;

  constructor(props) {
    super(props);
    this.state = {
      pageNo: 0,
      isShow: true,
      pageWidth: 0,
      contentOffsetX: 0,
    };
  }

  scrollToWithoutPaging(pos) {
    this._pagingOnScroll = false;
    this.refs.scrollView.scrollTo(pos);
  }

  onLayout(e) {
    const {width, height} = e.nativeEvent.layout;
    var contentOffsetX = -1, state = {};
    if (width > 0) {
      if (this.state.pageWidth != width) {
        if (this.state.pageNo > 0) {
          contentOffsetX = (this.state.pageNo-1) * width;
        }
        state.pageWidth = width;
        if (IsIOS || contentOffsetX <= 0) {
          if (contentOffsetX > 0) {
            state.contentOffsetX = contentOffsetX;  
          }
          this.setState(state);
          return;
        }

        var _this = this;
        if (this.state.pageWidth > width) {
          _this.scrollToWithoutPaging({
            x: contentOffsetX,
            y: 0,
            animated: false,
          });
          setTimeout(function() {
            _this.setState(state);
          }, 0);
        } else {
          _this.setState(state);
          setTimeout(function() {
            _this.scrollToWithoutPaging({
              x: contentOffsetX,
              y: 0,
              animated: false,
            });
          }, 0);
        }
      }
    }
  }

  renderPageWithWidth(item, i, width) {
    var style=[{backgroundColor : '#24D770'}, item.props.style, {paddingBottom: 27, width: width}];
    return (
      <View key={i} style={style}>  
        {item.props.children}
      </View>
    );
  }

  render() {
    if (!this.state.isShow) {
      return null;
    }
    var scrollViewProps = {
      automaticallyAdjustContentInsets : false,
      horizontal : true,
      vertical : false,
      showsVerticalScrollIndicator : false,
      showsHorizontalScrollIndicator : false,
      alwaysBounceHorizontal : false,
      directionalLockEnabled : true,
      pagingEnabled: true,
      centerContent: false,
      onScroll : (e) => this._onScroll(e),
      style : {}
    };

    if (IsIOS && this.state.contentOffsetX > 0) {
      scrollViewProps.contentOffset = { x: this.state.contentOffsetX, y: 0};
    }

    let containerStyle = {};

    if (this.props.style instanceof Array) {
      this.props.style.forEach((style) => {
        Util.merge(containerStyle, style);
      });
    } else {
      containerStyle = this.props.style;
    }

    let adjustHeight = containerStyle.height ? {height: containerStyle.height + 14} : {};
    
    return (
      <View ref="inner" style={[this.props.style, styles.container, adjustHeight]} onLayout={(e) => this.onLayout(e)}>
        <View style={[styles.innerContainer]}>
          <ScrollView ref="scrollView" {...scrollViewProps}>
          {
            this.state.pageWidth > 0 && this.props.children && this.props.children.map((item, i) => {
              return this.renderPageWithWidth(item, i, this.state.pageWidth);
            })
          }
          </ScrollView>
          <View style={[styles.control]}>
          {
            this.state.pageWidth > 0 && this.props.children && this.props.children.map((item, i) => {
              if ((this.state.pageNo === 0 && i === 0) || (i+1 === this.state.pageNo)) {
                return (
                  <Image key={i} style={styles.pageIcon} source={Images.PageActive_7x7}/>
                );
              } else {
                return (
                  <Image key={i} style={styles.pageIcon} source={Images.PageInactive_7x7}/>
                );
              }
            })
          }
          </View>
          <TouchableOpacity style={[styles.close]} onPress={() => this.close()}>
            <Image source={Images.CancelCircle_Gray_30x30}/>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  close() {
    this.setState({
      isShow: false
    });
    if (this.props.onHide) {
      this.props.onHide();
    }
  }

  _onScroll(e) {
    if (this._pagingOnScroll && this._scrollX != e.nativeEvent.contentOffset.x) {
      this._scrollX = e.nativeEvent.contentOffset.x;
      this._scrollY = e.nativeEvent.contentOffset.y;
      var pagePos = this._scrollX / this.state.pageWidth + 1;
      var pageNo = parseInt(pagePos);
      if (this.state.pageNo != pageNo) {
        this.setState({
          pageNo: pageNo
        });
        if (!!this.props.onPageChanged) this.props.onPageChanged(pageNo);
      }
    } else {
      this._pagingOnScroll = true;
    }

    if (this.props.onScroll) {
      this.props.onScroll(e);
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
  },

  innerContainer: {
    marginTop: 14,
    flex: 1,
    flexDirection:'row',
  },

  pageIcon: {
    width: 7,
    height: 7,
    marginLeft: 4.5,
    marginRight: 4.5,
  },

  control: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingBottom:20,
    justifyContent :'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  close: {
    position: 'absolute',
    right: -10,
    top: -10,
  }
});

export default HorizontalScrollPageView;