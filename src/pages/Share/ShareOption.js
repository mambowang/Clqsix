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
    StatusBar,
    Clipboard,
    Linking,
    Platform,
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
  Alert,
} from '../../components';
import {
  AuthAPI
} from '../../utils';
import { StackNavigator } from 'react-navigation';
import * as StoreReview from 'react-native-store-review';
import * as globals from '../../common/Global';

import email from 'react-native-email'

//const APP_STORE_LINK = 'itms://itunes.apple.com/us/app/apple-store/963138929?mt=8';
//const APP_STORE_LINK = 'itms-apps://itunes.apple.com/us/app/id${APP_STORE_LINK_ID}?mt=8';

const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;

class ShareOption extends Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }
  _onNavigationLeftButtonPress(){
    const { rootNavigation } = this.props;
  
    !!rootNavigation && rootNavigation.goBack();
  }
  _setContent() {
    Clipboard.setString(globals.COMPANY_WEBSITE);
    this.copyAlert.show();
  }
  markReviewApp(){
    if(Platform.OS =='ios'){
       // if (StoreReview.isAvailable) {
      //   StoreReview.requestReview();
      // }    
      Linking.canOpenURL(globals.APP_STORE_LINK).then(supported => {
        supported && Linking.openURL(globals.APP_STORE_LINK);
      }, (err) => console.log(err));
    }  
  }
  sendFeedback(){
    const to = [globals.COMPANY_EMAIL] // string or array of email addresses
    email(to, {
        // Optional additional arguments
      //  cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
      //  bcc: 'mee@mee.com', // string or array of email addresses
        subject: 'CLQSIX Feedback',
        body: ''
    }).catch(console.error)
  }
  render() {
    return (
      
        <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
            <StatusBar hidden={false} />
            <CustomNavigator
              leftButton = {<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}   
              rightButton = {<Image style = {{ opacity: 0,width:24,height:24 }} source={Images.Friends_1200x1200}/>}      
              onLeftButtonPress = {() => this._onNavigationLeftButtonPress()}      
            >
              <Text style={{ fontFamily:'SF UI Text', fontSize: 17, marginLeft:8, fontWeight:'bold'}}>
              Share CLQSIX
              </Text>
            </CustomNavigator>
            <ScrollView ref="scrollView" style={{width:'100%'}}> 

            <FullScreen.Row style={styles.topview}>
                <View >
                  <Text style={styles.topfont}>Help spread the word</Text>
                </View>
            </FullScreen.Row>        
            
            <FullScreen.Row style={[styles.contentrow]} >
              <TouchableOpacity style={styles.content}  
              onPress={() => { this.props.navigation.navigate('SearchContact')}}>          
                <Image  style = {{width: 11,height: 19,marginHorizontal:5}} source={Images.group_22x37}/>         
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>Text a friend</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
              </TouchableOpacity>          
            </FullScreen.Row> 
            <FullScreen.Row style={styles.contentrow} >
              <TouchableOpacity style={styles.content}  
              onPress={() => { this.props.navigation.navigate('ShopSite')}}>          
                <Image  style = {{width: 22,height: 18}} source={Images.Shirt_550x450}/>         
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>Get a CLQSIX merch</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
              </TouchableOpacity>          
            </FullScreen.Row> 
            <FullScreen.Row style={styles.contentrow} >
              <TouchableOpacity style={styles.content}  
              onPress={() => { this._setContent()}}>          
                <Image  style = {{width: 19,height: 19,marginHorizontal:2}} source={Images.Link_475x475}/>         
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>Copy app link</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
              </TouchableOpacity>          
            </FullScreen.Row> 
            <FullScreen.Row style={styles.contentrow} >
              <TouchableOpacity style={styles.content}  
              onPress={() => { this.markReviewApp()}}>          
                <Image  style = {{width: 20,height: 19}} source={Images.RateReview_315x300}/>         
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>{'Rate \& Review on App Store'}</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
              </TouchableOpacity>          
            </FullScreen.Row> 
            <FullScreen.Row style={styles.contentrow} >
              <TouchableOpacity style={styles.content}  
              onPress={() => { this.sendFeedback()}}>          
                <Image  style = {{width: 20,height: 19}} source={Images.Feedback_252x228}/>         
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>{'Send us feedback'}</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
              </TouchableOpacity>          
            </FullScreen.Row> 
            </ScrollView>
            <Alert  ref={ref=>this.copyAlert=ref}                 
                style={{backgroundColor:'#9E4FFF'}} 
                closeButtonSource = {Images.check_17x13}
                title = {''}
                text={['CLQSIX link copied to your','clipboard']}               
                onRequestClose={() => this.copyAlert.hide()}/>
        </FullScreen>
       
    );
  }
};
const styles = StyleSheet.create({  
  topview: {
    alignItems:'center',
    marginHorizontal :25,
    backgroundColor: '#D9D10E',
    height: 70,
    marginTop: 30,
    marginBottom: 60,   
  },
  bottomview: {
    alignItems:'center',
    marginHorizontal :25,
    backgroundColor: '#ffffff',
    height: 70,
    marginTop: 50,
  
  },
  topfont: {
    fontFamily: 'SF UI Text', 
    fontSize: 13, 
    color: '#ffffff', 
    fontWeight: 'bold',
  },
  bottomfont: {
    fontFamily: 'SF UI Text', 
    fontSize: 13, 
    color: '#bababa', 
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
export default ShareOption;