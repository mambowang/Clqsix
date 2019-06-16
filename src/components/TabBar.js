'use strict';

import React, { Component } from 'react';
import {
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  TabBarIOS,
  Text,
  TouchableOpacity,
  View,
  ViewPropTypes
} from 'react-native';
import PropTypes from 'prop-types';


class DummyTabBarIOS extends Component {

  static propTypes = {
    ...ViewPropTypes ,
    tintColor: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    let barStyle = [{height: 60, flexDirection: 'row', backgroundColor:this.props.barTintColor}];

    return (
      <View style={{flex: 1}}>
        <View style={[this.props.style, styles.tabGroup]}>
          {this.props.children}
        </View>
        <View style={barStyle}>
          {
            this.props.children.map((item, i) => {
              if (!item || !item.props) return null;
              let icon = (item.props.selected === true  && item.props.selectedIcon) ? item.props.selectedIcon: item.props.icon;
       
              
              return (
                <TouchableOpacity key={i} style={{ flex:1, alignItems:'center', justifyContent:'center'}} onPress={() => item.props.onPress && item.props.onPress()}>
                  <Image source={icon}/>
                </TouchableOpacity>
              );
            })
          }
        </View>
      </View>
    );
  }
}


class DummyTab extends React.Component {
  
  constructor(props) {
    super(props);
  }

  setIndex(i) {
    this.index = i;
  }

  setParent(p) {
    this.parent = p;
  }

  render() {
    var style;
    if (this.props.selected === true) {
      style = [this.props.style, styles.tab];
    } else {
      style = [styles.unselectedTab];
    }
    return (
      <View style={style}>
        {this.props.children}
      </View>
    );
  }
}

const IsIOS = false; //Platform.OS !== 'ios';
const SCREEN = Dimensions.get('window');

class TabBar extends Component {

  static Item = IsIOS ? TabBarIOS.Item : DummyTab;

  constructor(props) {
    super(props);
  }

  render() {
    if (IsIOS) {
      return this.renderIOS();
    }
    return this.renderAndroid();
  }

  renderIOS() {
    return (
      <TabBarIOS {... this.props} />
    );
  }

  renderAndroid() {
    return (
      <DummyTabBarIOS {... this.props}/>
    );
  }
};

var styles = StyleSheet.create({
  tabGroup: {
    flex: 1,
  },
  tab: {
    // TODO(5405356): Implement overflow: visible so position: absolute isn't useless
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderWidth: 0,
  },

  unselectedTab: {
    // TODO(5405356): Implement overflow: visible so position: absolute isn't useless
    position: 'absolute',
    top: SCREEN.height,
    left: 0,
    borderWidth: 0,
    height: 0,
    width: 0,
  }
});

export default TabBar;