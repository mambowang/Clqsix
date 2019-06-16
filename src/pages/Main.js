'use strict';

import React, { Component } from 'react';
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
import { changeType } from '../actions/userActions'
import { changeLastClique } from '../actions/cliqueActions'
import { blank } from '../actions/statusActions'

import {VisualModel,CliqueModel,UserModel} from '../models';

import {
  AuthAPI,
} from '../utils'
import fb from '../utils/FirebaseAPI';

import {
  SingleDiscoverRoot
} from './SingleUser/SingleDiscover';

import {
  SingleHomeRoot
} from './SingleUser/SingleHome';

import {
  SingleProfileRoot
} from './SingleUser/SingleProfile';
import {
  SingleOptionRoot
} from './SingleUser/SingleOption';
import {
  SingleUploadRoot, 
} from './SingleUser/SingleUpload';
import {
  HomeRoot
} from './Home';
import {
  ProfileRoot
} from './Profile';
import {
  UploadRoot, 
} from './Upload';

import {
  Notify
} from './Notify';
import {
  OptionRoot
} from './Option';
import { NavigationActions } from 'react-navigation';
import FCM from "react-native-fcm";
import {registerKilledListener, registerAppListener} from "../utils/FirebaseListeners";

class Main extends Component {

  lastTab = null;
  currentTypeRef = null;
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: 'home',
      openUpload: false,
      currentUser: this.props.currentUser,     
      uid: this.props.currentUser.uid,   
      lastCliqueId: this.props.currentClique.lastCliqueId,

    }
    this.lastTab = this.state.selectedTab;
  }

  changeTab(tab) {    
    if (tab === 'upload') {
      this.setState({
        openUpload: true,  
        selectedTab:  null,      
      });
      return;
    }
    this.lastTab = tab;
    this.setState({
      openUpload: false,
      selectedTab: tab,
    });
  }
  // shouldComponentUpdate(nextProps, nextState){
  //  if( JSON.stringify(this.props.currentUser.followingCliqueIds) 
  //   != JSON.stringify(nextProps.currentUser.followingCliqueIds)){
  //     return false 
  //   }
  //   return true;
   
  // }

  componentWillReceiveProps(nextProps){      
    if(nextProps.currentStatus.status == 'profile'){      
      this.changeTab('profile')  
      this.props.blank();
      
    }
    let currentFollowingIds = this.props.currentUser.followingCliqueIds;
    let newFollowingIds = nextProps.currentUser.followingCliqueIds;  

    let currentuserType =    this.props.currentUser.type;   
    let newType = nextProps.currentUser.type;   

    let currentLastCliqueId =    this.props.currentClique.lastCliqueId;   
    let newLastCliqueId = nextProps.currentClique.lastCliqueId;   
    //logout
    if(nextProps.currentUser.uid == null){
          let routeName;
          routeName = "WelcomeNavigate";
          this.props.navigation.dispatch({
              type: 'Navigation/RESET',
              index: 0,
              actions: [{ type: 'Navigation/NAVIGATE', routeName: routeName }]
          });
          return;
    }
    //following ids is changed
    if( JSON.stringify(currentFollowingIds) != JSON.stringify(newFollowingIds)){
      console.log("componentWillReceiveProps");
      
      let changedData = {
        ...this.state.currentUser,
        followingCliqueIds: newFollowingIds
      }
      this.setState({
        currentUser: changedData
      })    
    } 
    //user type is changed
    if( JSON.stringify(currentuserType) != JSON.stringify(newType)){
      let changedData = {
        ...this.state.currentUser,
        type: newType
      }
      this.setState({
        currentUser: changedData
      })      
    } 
  }

   componentDidMount(){
    
    this.enableDynamicWatching();
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
    // this.currentTypeRef.on('child_added', function(data) {
    //   console.log("child_added:  " +  data.key + ":  " +  data.val());   
    //     if(_this.state.currentUser.type == "single" && data.val() == "true"){     // to avoid first directly creating     
    //         _this.props.changeLastClique(data.key);       
    //         _this.props.changeType("clique");
        
    //     }
    //   });
  }
  render() {
    return (
      <FullScreen>
        <TabBar barTintColor='#000000' tintColor='white' style={{height:60}}>
          <TabBar.Item
            icon={Images.Home_Gray_21x21}
            selectedIcon={Images.Home_White_21x21}
          
            selected={this.state.selectedTab === 'home'} 
            onPress={() => this.changeTab('home')}>
            {this.renderHome()}
            {/* {this.state.selectedTab === 'home' &&this.renderHome()} */}
          </TabBar.Item> 
          <TabBar.Item
            icon={Images.Discover_Gray_20x20}
            selectedIcon={Images.Discover_White_20x20}
            selected={this.state.selectedTab === 'search'}
            
            onPress={() => this.changeTab('search')}>
             
             {this.renderSearch()}
           {/* {this.state.selectedTab === 'search' && this.renderSearch()} */}
          </TabBar.Item>
          <TabBar.Item 
            icon={Images.Upload_Gray_20x20}            
            selectedIcon={Images.Upload_White_20x20} 
            selected={this.state.selectedTab === 'upload'} onPress={() => this.changeTab('upload')}
          >
            {/* {this.state.selectedTab === 'upload' &&  this.renderUpload() } */}
          </TabBar.Item>
          <TabBar.Item 
            icon={Images.clique_grey_20x21}
            selectedIcon={Images.clique_white_20x20}
            selected={this.state.selectedTab === 'option'} onPress={() => this.changeTab('option')}>
            {/* { this.state.selectedTab === 'option' && this.renderOption()} */}
            { this.renderOption()}
          </TabBar.Item>     
          <TabBar.Item 
              icon={Images.Profile_Gray_21x22}
              selectedIcon={Images.Profile_Red_21x22}
              selected={this.state.selectedTab === 'profile'} onPress={() => this.changeTab('profile')}>
               {/* {this.renderProfile()}  */}
              {this.state.selectedTab === 'profile' && this.renderProfile()}
          </TabBar.Item>
                    
        </TabBar> 
        <Modal visible = {this.state.openUpload  === true} onRequestClose={() => {}} transparent={false}>
           { this.renderUpload() } 
          {/* { this.state.openUpload  === true && this.renderUpload() }  */}
        </Modal>
      </FullScreen>
    );
  }

  renderSearch() {
      return (
        <SingleDiscoverRoot />
     );
  
    
  }

  renderHome() {
    let followingIds = _.size(this.state.currentUser.followingCliqueIds)
    if(followingIds > 0){
      return (<HomeRoot  /> )
    }else{
      return (<SingleHomeRoot  /> )    
    }
   
  }

  renderUpload() {
    let type = this.state.currentUser.type
    if(type == "clique"){
      return <UploadRoot   screenProps={{
        onClose : ()=>{ this.changeTab(this.lastTab);},
        goProfile : ()=>{ this.changeTab('profile');},
  
      }}>Upload</UploadRoot>
    }else{
      return <SingleUploadRoot
          screenProps={{
            onClose : ()=>{ this.changeTab(this.lastTab);},
          }}
          >Upload</SingleUploadRoot>  
    }
    
   
  }  
  renderProfile() {
    let type = this.state.currentUser.type
    if(type == "clique"){
      return (<ProfileRoot  screenProps={{
        goProfile : ()=>{ this.changeTab('profile');},
  
      }}  /> )
    }else{
      return (<SingleProfileRoot  screenProps={{
        goProfile : ()=>{ this.changeTab('profile');},
  
      }} /> )    
    }    
  }
  
  renderOption() {
    let type = this.state.currentUser.type
    if(type == "clique"){
      return (
        <OptionRoot
        screenProps={{
          goClique : ()=>{ this.changeTab('profile');},
        }}/>
      );
    }else{
      return (
        <SingleOptionRoot 
          screenProps={{
          goClique : ()=>{ this.changeTab('profile');},
          }}/>
      );
    }    
    
  }
  renderNotify() {
    // return (
    //   <Notify onClose={() => this.changeTab('upload')}/>
    // );
  }

  _onStart() {
    if (this.props.onStart) {
      this.props.onStart();
    }
  }
  goToClique(){
    let routeName;
    routeName = "Main";
    this.props.navigation.dispatch({
        type: 'Navigation/RESET',
        index: 0,
        actions: [{ type: 'Navigation/NAVIGATE', routeName: routeName }]
    });

  }
}

const styles = StyleSheet.create({
  
  content: {
    justifyContent:'center',
    paddingHorizontal: 25,
    //justifyContent: 'flex-start',
  },

  image: {
    width: 70,
    height: 73.26,
  },

  text: {
    fontFamily: 'SF UI Text',
    fontWeight: 'bold',
    fontSize: 22,
  },

  comment: {
    fontFamily: 'SF UI Text',
    fontSize: 13,
    color:'#A3A3A3',
  },
  smallIcon:{
    width:20,
    height:20
  },
  middleicon:{
    width:21,
    height:21,
  },
  bigIcon:{
    width:22,
    height:22
  }

  
});


function mapStateToProps(state) {
  return {
    currentClique: state.currentClique,
    currentUser: state.currentUser,
    currentStatus: state.currentStatus
    
  }
}

export default connect(mapStateToProps,{changeLastClique,changeType,blank})(Main)