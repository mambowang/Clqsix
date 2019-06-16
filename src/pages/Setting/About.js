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
    Modal,
    InteractionManager,
    StatusBar
} from 'react-native';

import {
  Button,
  ClqsixTextInput,
  Text,
  CustomNavigator,
  FullScreen,
  ScrollViewWrapper,
  Options,
  Images,
  KeyboardSpacer,
  Alert,
  ModalActivityIndicator
} from '../../components';

import {
  AuthAPI
} from '../../utils';
import * as Storage from '../../common/Storage';
import { StackNavigator } from 'react-navigation';
const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;

class About extends Component {

  constructor(props) {
    super(props);
    this.state = {
        showActivityIndicator: false,
    }
  }
  _onNavigationRightButtonPress() {   
   
  }
  _onNavigationLeftButtonPress(){
    const { rootNavigation } = this.props;
  
    !!rootNavigation && rootNavigation.goBack();
  }

  componentDidMount() {
   
  }
  render() {
 
    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
              <StatusBar hidden={false} />

        <CustomNavigator
          leftButton = {<Image source={Images.BackChevronLeft_Black_9x16}/>}   
          rightButton = {<Image source={Images.Friends_1200x1200} style = {{width:24,height:24,opacity:0}}/>}      
          onLeftButtonPress = {() => this._onNavigationLeftButtonPress()}        
          onRightButtonPress = {() => this._onNavigationRightButtonPress()}
        >
          <Text style={{ fontFamily:'SF UI Text', fontSize: 17, marginLeft:8, fontWeight:'bold'}}>About</Text>
        </CustomNavigator>
        <ScrollView ref="scrollView" style={{width:'100%'}}> 
        
            <FullScreen.Row style={styles.contentrow} >
            <TouchableOpacity style={styles.content}  
            onPress={() => { this.props.navigation.navigate('ServicePage')}}>          
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>Terms of service</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
            </TouchableOpacity>          
            </FullScreen.Row>

            <FullScreen.Row style={[styles.contentrow,{borderTopWidth: 0}]} >
            <TouchableOpacity style={styles.content}  
            onPress={() => { this.props.navigation.navigate('PrivacyPage')}}>          
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>Privacy policy</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
            </TouchableOpacity>          
            </FullScreen.Row> 

            <FullScreen.Row style={[styles.contentrow,{borderTopWidth: 0}]} >
            <TouchableOpacity style={styles.content}  
            onPress={() => { this.props.navigation.navigate('ClqsixSite')}}>          
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>Visit CLQSIX.com</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
            </TouchableOpacity>          
            </FullScreen.Row> 

            
        </ScrollView>

       
      </FullScreen>
    );
  }
};

const styles = StyleSheet.create({
  topview: {
    alignItems:'center',
    marginHorizontal :25,
    backgroundColor: '#FFFFFF',
    height: 54,
  
  },
 
  topfont: {
    fontFamily: 'SF UI Text', 
    fontSize: 13, 
    color: 'black', 
    fontWeight: 'bold',
  },

  contentrow: {   
    paddingLeft :25,
    paddingRight: 20,
    paddingVertical:10,
    height: 70,
    borderWidth:1, 
    borderColor:'#EEEEEE', 

  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',    
    alignItems:'center',   
    width: '100%'
  },
  contenttextview:{   
    flex: 1,
    flexDirection: 'row',
    justifyContent:'flex-start',    
    marginLeft:15,
  },
  contenttext:{
    fontFamily: 'SF UI Text', 
    fontSize: 13,  
    fontWeight: 'bold',
    paddingLeft: 10,
    textAlign: "left" ,
  },
  pageContainer: {
    height:175,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 25,
  },
  page: {
    alignItems:'center',
    justifyContent:'center'
  },
  pageText: {
    fontFamily:'SF UI Text',
    fontWeight:'900',
    fontSize:17,
    color:'white'
  }
});

  
export default About
