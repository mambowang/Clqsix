'use strict';
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Alert,
    Modal,
    StatusBar,
    
} from 'react-native';
import {
  Button,
  ClqsixTextInput,
  CustomNavigator,
  FullScreen,
  ScrollViewWrapper,
  Images,
  TabView,
  Text,
  Page,
  Content,
} from '../../../components';
import { connect } from 'react-redux'
import { clickVisual,blank } from '../../../actions/statusActions'
import DiscoverTabView from './DiscoverTabView'
//import SvgUri from 'react-native-svg-uri';

const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
class SingleDiscover extends Component {
  navigator = null;
  initialDataLoaded = false;
  visuals = [];

  constructor(props) {
    super(props);
    this.state = {
      tab: 'visuals',
      visuals: [],
      comps: this.comps,
    }
  }
   ////////////////////////////////////////////////////////////////////  
   _onNavigationLeftButtonPress() {   
    !!this.props.navigation && this.props.navigation.navigate('FindCliques')
  }
  _onNavigationRightButtonPress() {   
    !!this.props.navigation && this.props.navigation.navigate('ShareRoot');
  }
  componentDidUpdate() {
    
    if(this.props.currentStatus.status == 'visual'){      
      this.goVisualDetails(this.props.currentStatus.id);
      this.props.blank();
      
    }else if(this.props.currentStatus.status == 'clique'){
      this.goCliqueView(this.props.currentStatus.id);
      this.props.blank();
      
    }else if(this.props.currentStatus.status == 'member'){
      this.goMemberView(this.props.currentStatus.id);
      this.props.blank();
      
    }

  }
  goMemberView(memberId){
    !!this.props.navigation && this.props.navigation.navigate('MemberRoot',
    {memberId: memberId});  
  }
  goVisualDetails(visualId){
     !!this.props.navigation && this.props.navigation.navigate('VisualRoot',
     {visualId: visualId});  
  }
  goCliqueView(cliqueId){  
    !!this.props.navigation && 
    this.props.navigation.navigate('CliqueRoot',{ 
      cliqueId: cliqueId,
    });   
    
  }
  render() {
    return (
      <FullScreen style={{alignItems: 'center',backgroundColor:'white'}}>
            <StatusBar hidden={false} />

        {this.renderNavigationBar()}
        {this.renderComponent()}       
      </FullScreen>
    );
  }
 
  renderNavigationBar() {
    return (
      <CustomNavigator
        leftButton = {<Image style = {{width: 16, height: 16, opacity:1}} source={Images.FeaturedCliques_900x900} />}
        rightButton = {<Image  style = {{width: 24, height: 24, opacity:1}} source={Images.Friends_1200x1200} />}
        onLeftButtonPress = {() => this._onNavigationLeftButtonPress()}
        onRightButtonPress = {() => this._onNavigationRightButtonPress()}
      >
        {/* <Image source={Images.Cliqsix_26x26} />
        <Text style={{fontFamily:'Alegre Sans', fontSize: 36, marginLeft:8}}>Discover</Text> */}
      </CustomNavigator>
    );
  }

  renderComponent() {
    return (
         
         <Content style={styles.content}>    
         {this.renderTabView()}
         </Content>     
    
    )
  }

  renderTabView() {
    return (
       <DiscoverTabView/>
    )
  }
};

const styles = StyleSheet.create({
  content: {    
    // paddingHorizontal: 17,
    flexDirection: 'column',  
    justifyContent: 'flex-start',
    
  },

});
function mapStateToProps(state) {
  return {
    currentStatus: state.currentStatus
  }
}
export default connect(mapStateToProps,{blank})(SingleDiscover)
