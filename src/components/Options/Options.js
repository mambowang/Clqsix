'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
} from 'react-native';

import {
  ActionSheet
 } from '../ActionSheet';
 
import Images from '../Images';
import ImageChooser from './ImageChooser';

const styles = StyleSheet.create({

  item: {
    height: 70,
    marginHorizontal: 25,
   
  },

  itemImportant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },

  itemBorder: {
    borderTopWidth:0,
    borderColor: '#e6e6e6',
  },

  itemBorderBottom: {
    borderBottomWidth: 0,
    borderColor: '#e6e6e6',
  },

  itemColorPrefix: {
    width: 15,
    height: 15,
    marginRight: 10,
  },

  itemImagePrefix: {
    width: 15,
    height: 15,
    marginRight: 10,
  },

  itemText: {
    color: 'black',
    fontSize: 13,
    fontFamily: 'SF UI Text',
    fontWeight: '600'
  },

});

class Options extends Component {

  static ImageChooser = ImageChooser;

  constructor(props) {
    super(props);
  }

  show() {
    this.refs.inner.show();
  }

  hide() {
    this.refs.inner.hide();
  }

  _onRequestClose() {
    if (this.props.onRequestClose) {
      this.props.onRequestClose();
    }
    this.hide();
  }

  _isSelected() {
    
  }

  render() {
    let {title, renderItems, renderItem, children, items, ...props} = this.props;
    props.onRequestClose = () => this._onRequestClose();
    return (
      <ActionSheet {...props} ref="inner">
        <ActionSheet.Titlebar title={title} onRequestClose={() => this._onRequestClose()}/>
        { this.renderChildren() }
        {this.props.children}
      </ActionSheet>
    );
  }

  renderChildren() {
    let $this = this;
    return !this.props.items ? null : ( this.props.renderItems ? this.props.renderItems(this.props.items) : this.props.items.map((item, i) => $this.renderChild(item, i)));
  }

  renderChild(item, i) {
    if (!!item.render) {
      let itemUI = item.render(item, i);
      if (!!itemUI) {
        if (itemUI !== true) {
          return itemUI;
        }
      } else {
        return null;
      }
    }
    if (this.props.renderItem) {
      let itemUI = this.props.renderItem(item, i);
      if (!!itemUI) {
        if (itemUI !== true) {
          return itemUI;
        }
      } else {
        return null;
      }
    }

    let
    itemStyle = i == 0 ? [styles.item, styles.itemImportant] : [styles.item, styles.itemBorder, styles.itemImportant],
    currentItem = this.props.value;
    let
    isSelected = !!currentItem && (
      !!currentItem.value ? currentItem.value === item.value : (
      !!currentItem.text ? currentItem.text === item.text : currentItem === item
      )
    ),
    showCheckIcon = isSelected && ((this.props.checkIcon === true && item.checkIcon !== false) || item.checkIcon === true);
    if (i + 1 === this.props.items.length && !!this.props.children) {
      itemStyle.push(styles.itemBorderBottom);
    }

    return (
      <TouchableOpacity key={i} onPress = {() => this._onSelectItem(item)}>
        <View style={itemStyle}>
          {item.colorPrefix && <View style={[styles.itemColorPrefix, {backgroundColor:item.colorPrefix}]}></View>  }
          {item.imagePrefix && <Image style={[styles.itemImagePrefix]} source={item.imagePrefix}></Image> }
          <View style={{flex: 1}}>
            <Text style={styles.itemText}>{item.text}</Text>
          </View>
          { showCheckIcon && <Image source={Images.Down_Green_17x17}/> }
        </View>
      </TouchableOpacity>
    );
  }

  _onSelectItem(item) {
    var isContinue;
    if (item.onSelectItem) {
      isContinue = item.onSelectItem(item);
    }
    if (isContinue !== false && this.props.onSelectItem) {
      isContinue = this.props.onSelectItem(item);
    }
    if (isContinue !== false) {
      this.hide();
    }
  }
}



export default Options;



        