'use strict';

import React, { Component, PureComponent } from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
} from 'react-native';
import {
  Images,
  Text,
} from '../../components';

const styles = StyleSheet.create({
  containerDefault: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },

  container: {
    flexDirection: 'row',
  },

  icon: {
    width: 17,
    height: 17,
  }
});

class VisualDetailReactionToolbar extends PureComponent {  
  constructor(props) {
    super(props);
    this.state = {
      likeState : this.props.likeState
    }
  }
  _onLike() {
    if (!!this.props.onLike) {
      // this.setState((prevState, props) => {
      //   return { 
      //     likeState : "like",
      //    }
      // }); 
      this.props.onLike(res => {});
    }
  }
  _onDislike() {
    if (!!this.props.onDislike) {
      // this.setState((prevState, props) => {
      //   return { 
      //     likeState : "dislike",
      //    }
      // }); 
      this.props.onDislike(res => {});
    }
  }
  _onComment() {
    if (!!this.props.onComment) {
      this.props.onComment();
    }
  }  
  _onShare() {
    if (!!this.props.onShare) {
      this.props.onShare();
    }
  }
  componentWillReceiveProps(nextProps){   
    if(nextProps.likeState != this.state.likeState){
      this.setState({
        likeState :nextProps.likeState,
      });
    }    
  }

  // shouldComponentUpdate(nextProps, nextState){
  //   return JSON.stringify(nextState) != JSON.stringify(this.state)
  // }


  getItemMargin(i) {
   // return i===0 ? 0 : (!!this.props.itemMargin ? this.props.itemMargin : 35);
    return (!!this.props.itemMargin ? this.props.itemMargin : 40);
  }

  renderChild(icon, callback, i) {
    let style = {justifyContent:'center', width:21,height: 21,alignItems:'flex-start', marginRight:this.getItemMargin(i)};
    return (
      <TouchableOpacity key={i} onPress={() => callback()}>
       
        <Image style={style} source={icon} />
       
      </TouchableOpacity>
    )
  }

  renderChildren(items) {
    let j = 0;
    return items.map((item, i) => {
      if (item.hide !== true) {
        return this.renderChild(item.icon, item.callback, j++);
      }
    })
  }

  render() {
    let {onComment, onRepost, onAddToComp, onMessage, style, children, ...props} = this.props;
    let likeState = this.state.likeState;
    
    props.style=[
      style,
      {flexShrink:1,flexDirection:'row',justifyContent:'flex-start',alignItems:'center'}
    ]
    let items = [];
    if(likeState == ""){
       items = [
        {        
          icon : Images.Like_850x850,
          callback: () => this._onLike()
        },
        {
          icon: Images.Dislike_850x850,
          callback: () => this._onDislike(),
        },
  
        {
          icon: Images.Comment_850x850,
          callback: () => this._onComment(),
        },
       
        {
          icon: Images.Share_850x850,
          callback: () => this._onShare(),
        }
      ];
    }else if(likeState == "like"){
       items = [
        {        
          icon : Images.LikeActive_850x850,
          callback: () => {},
          
        },
        {
          icon: Images.Dislike_850x850,
          callback: () => this._onDislike(),
        },
  
        {
          icon: Images.Comment_850x850,
          callback: () => this._onComment(),
        },
       
        {
          icon: Images.Share_850x850,
          callback: () => this._onShare(),
        }
      ];
    }else if(likeState == "dislike"){
       items = [
        {        
          icon : Images.Like_850x850,
          callback: () => this._onLike()
        },
        {
          icon: Images.DislikeActive_850x850,  
          callback: () => {},       
        },
  
        {
          icon: Images.Comment_850x850,
          callback: () => this._onComment(),
        },
       
        {
          icon: Images.Share_850x850,
          callback: () => this._onShare(),
        }
      ];
    }
    return (
      <View {...props}>
        {this.renderChildren(items)}        
        
      </View>
    )
  }
};

export default VisualDetailReactionToolbar;