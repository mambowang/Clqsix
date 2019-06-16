'use strict';
import React, { Component } from 'react';
import { TabNavigator } from 'react-navigation';
import { connect } from 'react-redux'
import _ from 'lodash';
import {
  Alert,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
 } from 'react-native';
 import {
  Content,
  Footer,
  FullScreen,
  Header,
  Page,
  TabBar,
  Images,
} from '../components';
import { NavigationActions } from 'react-navigation';
import { changeType } from '../actions/userActions';
import { changeLastClique } from '../actions/cliqueActions';
import { VisualModel,CliqueModel,UserModel} from '../models';
import { AuthAPI,} from '../utils';
import fb from '../utils/FirebaseAPI';

import {  SingleDiscoverRoot} from './SingleUser/SingleDiscover';
import {  SingleHomeRoot} from './SingleUser/SingleHome';
import {  SingleProfileRoot} from './SingleUser/SingleProfile';
import {  SingleOptionRoot} from './SingleUser/SingleOption';
import {  SingleUploadRoot } from './SingleUser/SingleUpload';
import {  SingleNotify } from './SingleUser/SingleNotify';
import {  Home } from './Home';
import {  ProfileRoot } from './Profile';
import {  UploadRoot } from './Upload';
import {  OptionRoot } from './Option';
let mainNavOption =   {
  navigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ focused }) => {
      const { routeName } = navigation.state;
      let iconName;
      let color; //init color variable
      switch (routeName) {
        case 'Home':
          color = "white"; //set color variable here
          iconName = Images.Home_Inactive_1575x1575
          break;
        case 'SingleDiscoverRoot':
          color = "white"; //set color variable here
          iconName = Images.Search_Inactive_1500x1500
          break;
        case 'UploadRoot':
          color = "white"; //set color variable here
          iconName = Images.Upload_1500x1500
          break;
        case 'OptionRoot':
          color = "white"; //set color variable here
          iconName = Images.Options_Inactive_1500x1500
          break;
        case 'ProfileRoot':
          color = "red"; //set color variable here
          iconName = Images.CliquePage_Inactive_1575x1650
          break;
      }
      return (
        <Image
          source={iconName}          
          style={[styles.image, {tintColor: focused ? color : 'grey'}]}
        />
      );
    },
  }),
  tabBarPosition: 'bottom',
  animationEnabled: false,
  tabBarOptions: {
    activeTintColor: 'white',
    inactiveTintColor:'grey',
    showLabel:false,
    style: {
      backgroundColor: 'black',
      height:60
    },
  },
}
let cliqueMain = {
  Home: {
    screen: Home,    
  },  
  SingleDiscoverRoot: {
    screen: SingleDiscoverRoot,     
  },
  UploadRoot: {
    screen: UploadRoot,     
  },
  OptionRoot: {
    screen: OptionRoot,    
  },
  ProfileRoot: {
    screen: ProfileRoot,     
  },
}
let singleMain = {
  Home: {
    screen: Home,    
  },  
  SingleDiscoverRoot: {
    screen: SingleDiscoverRoot,     
  },
  UploadRoot: {
    screen: SingleUploadRoot,     
  },
  OptionRoot: {
    screen: SingleOptionRoot,    
  },
  ProfileRoot: {
    screen: SingleProfileRoot,     
  },
}
let blankCliqueMain = {
  Home: {
    screen: SingleHomeRoot,    
  },  
  SingleDiscoverRoot: {
    screen: SingleDiscoverRoot,     
  },
  UploadRoot: {
    screen: UploadRoot,     
  },
  OptionRoot: {
    screen: OptionRoot,    
  },
  ProfileRoot: {
    screen: ProfileRoot,     
  },
}
let blankSingleMain = {
  Home: {
    screen: SingleHomeRoot,    
  },  
  SingleDiscoverRoot: {
    screen: SingleDiscoverRoot,     
  },
  UploadRoot: {
    screen: SingleUploadRoot,     
  },
  OptionRoot: {
    screen: SingleOptionRoot,    
  },
  ProfileRoot: {
    screen: SingleProfileRoot,     
  },
}
const MainNav = TabNavigator(cliqueMain,mainNavOption);
const SingleNav = TabNavigator(singleMain,mainNavOption);
const BlankMainNav = TabNavigator(blankCliqueMain,mainNavOption);
const BlankSingleNav = TabNavigator(blankSingleMain,mainNavOption);
const styles = StyleSheet.create({
  image: {
    width: 21,
    height: 21,
  }, 
});
const Center = ({ children }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>{children}</View>
);
class Main extends Component {
  constructor() {
    super();
    this.state = {};
  }
  componentWillReceiveProps(nextProps){      
    let currentFollowingIds = this.props.currentUser.followingCliqueIds;
    let newFollowingIds = nextProps.currentUser.followingCliqueIds;  

    let currentuserType =    this.props.currentUser.type;   
    let newType = nextProps.currentUser.type;   

    let currentLastCliqueId =    this.props.currentClique.lastCliqueId;   
    let newLastCliqueId = nextProps.currentClique.lastCliqueId;  
    let changedData = {}; 
    //following ids is changed
    if( JSON.stringify(currentFollowingIds) != JSON.stringify(newFollowingIds)){
      changedData = {
        ...this.state.currentUser,
        followingCliqueIds: newFollowingIds
      }      
    } 
    //user type is changed
    if( JSON.stringify(currentuserType) != JSON.stringify(newType)){
      changedData = {
        ...this.state.currentUser,
        type: newType
      }     
    } 

    let tab = null;
    if(_.size(newFollowingIds) > 0){
      if(newType == 'single'){
        tab = SingleNav;
      }else{
        tab = MainNav;
      }
    }else{
      if(newType == 'single'){
        tab = BlankSingleNav;
      }else{
        tab = BlankMainNav;
      }
    }
   
    
    this.setState({
      currentUser: changedData,
      tabs: tab
    })   
    
    
  }
  componentDidMount(){
    this.enableDynamicWatching();
    let currentFollowingIds = this.props.currentUser.followingCliqueIds;
    let currentuserType =    this.props.currentUser.type;   
    let tab = null;
    if(_.size(currentFollowingIds) > 0){
      if(currentuserType == 'single'){
        tab = SingleNav;
      }else{
        tab = MainNav;
      }
    }else{
      if(currentuserType == 'single'){
        tab = BlankSingleNav;
      }else{
        tab = BlankMainNav;
      }
    }
    this.setState({ tabs: tab });
    //console.log("componentDidMount");
  }
  componentWillUnmount(){
    //console.log("componentWillUnmount");    
  }
  enableDynamicWatching(){
    if(!!this.currentTypeRef) {
      this.currentTypeRef.off();
      this.currentTypeRef = null;
    }
    this.currentTypeRef =  fb.ref('/inCliques/' + this.state.uid + "/");
    let _this = this;
    this.currentTypeRef.on('child_removed', function(data) {
      if(data.key != _this.props.currentClique.lastCliqueId){
        return;
      }else{
        UserModel.findLastCreatedClique(_this.state.uid).then(lastCliqueId =>{
          if(lastCliqueId){           
              _this.props.changeLastClique(lastCliqueId);           
          }else{
            _this.props.changeType("single");
            _this.props.changeLastClique(null);
            
          }
        });
      }      
    });   
  }
  render() {
    if (this.state.tabs) {
      return <this.state.tabs />;
    }
    return <Center><Text>Loading...</Text></Center>;
  }
}
function mapStateToProps(state) {
  return {
    currentClique: state.currentClique,
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps,{changeLastClique,changeType})(Main)