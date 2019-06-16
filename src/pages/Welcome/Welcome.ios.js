'use strict';

import React, { Component } from 'react';
import {
  Image,
  Modal,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  StatusBar
} from 'react-native';
import {
  Button,
  Content,
  Footer,
  FullScreen,
  Header,
  Page,
  Images,
} from '../../components'
import {  CachedImage } from 'react-native-cached-image';

let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
class Welcome extends Component {

  gotoLogin() {
    this.props.navigation.navigate('Login')
  }
  gotoSignup(){
    this.props.navigation.navigate('Signup')
  }
  componentWillMount() {
    StatusBar.setHidden(true);
 }
 render() {
    return (
      <Page>
        <Content style={styles.content}>    
          <View style={[styles.titleContent,  {}]}>
            <View style={{}}>
              <Image source={Images.CLQSIX_symbol_1300x1300} style={styles.image} />
              {/* <CachedImage
                    source={Images.CLQSIX_symbol_1300x1300}
                    defaultSource =  { Images.thumbnailSource_50x50}
                    fallbackSource = { Images.thumbnailSource_50x50}                
                    style={styles.image}
              />          */}
            </View>
            <View style={{backgroundColor:"#FF000000",marginLeft:18}}>            
              <Text style={styles.text}>CLQSIX</Text>             
            </View>
          </View>
          <View style={styles.subTitleContent}>            
            <Text style={styles.comment}>cliques have more fun!</Text>      
          </View>
         
          <View style = {styles.splashcontent}>
             <Image source={Images.welcome_562x616} style={styles.welcomeImg}/>  
             {/* <CachedImage
                    source={{uri: Images.Welcome_1080x1080}}
                    defaultSource =  { Images.thumbnailSource_50x50}
                    fallbackSource = { Images.thumbnailSource_50x50}                
                    style={styles.welcomeImg}
                />          */}
          </View>
            
        </Content>
        <Footer style = {styles.footerArea}>
          <View  style={styles.loginButtonArea} >
            <Button.Simple text='Log In' style={styles.loginButton} 
            textStyle={styles.loginButtonText} 
            onPress= {() => {this.gotoLogin()}}
            />
          </View>
          <Text style={{color: '#FFFFFF',backgroundColor: '#0095F7',fontSize:20}}>|</Text>
          <View  style={styles.signupButtonArea} >
            <Button.Simple text='Sign Up' style={styles.signupButton} 
            textStyle={styles.signupButtonText} 
            onPress= {() => {this.gotoSignup()}}
            />
          </View>
        </Footer>
      </Page>
    );
  }

  _onStart() {
    // if (!!this.props.onStart) {
    //   this.props.onStart();
    // }
  }
}

const styles = StyleSheet.create({  
  content: { 
    paddingHorizontal: 25,
    justifyContent: 'space-between',

  },
  titleContent: {   
    flexDirection: 'row',     
    justifyContent:'center', 
    alignItems:'center',
    marginTop:window.width * 0.2,
  },
  image: {
    width: 74,
    height:74
  },
  splashcontent :{
    flex: 1,
    flexDirection: 'column',     
    justifyContent:'center', 
    alignItems:'center',
  },
  welcomeImg:{
    //width: 260,
    //height: 260,
     width: window.width * 0.75,
     height: window.width * 0.75,
  },
  text: {
    fontFamily: 'AlegreSans',
    fontWeight: 'bold',
    fontSize: 88,
    color: '#1D1D1D',
    letterSpacing: 2.33
  },
  titletext :{
    fontFamily: 'AlegreSans',
    fontSize: 13,
    color:'#ffffff',
  },
  subTitleContent: {  
    justifyContent:'flex-start', 
    alignItems:'center',
  
  },
  comment: {
    fontFamily: 'SF UI Text',
    fontWeight: 'bold',
    fontSize: 18.8,
    color:'#A3A3A3',
    letterSpacing: 2.38
  },
  bottomcomment: {
    marginTop: 10,
    fontFamily: 'SF UI Text',
   // fontWeight: 'bold',
    fontSize: 14,
    color:'black',
  },
  bottomcommentline:{
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: 'black'
  },
  footerArea: {
    flex:1,
    flexDirection: 'row',
    justifyContent:'center', 
    alignItems:'center',
    height: 60,
    backgroundColor: '#0095F7',
  },
  loginButtonArea: {
    flex:1,
  },
  loginButton: {    
    width: '100%',
    backgroundColor: '#0095F7',
  },

  loginButtonText: {

    fontWeight: 'bold'
  },
  signupButtonArea: {
    flex:1,
  },
  signupButton: {
    width: '100%',
    backgroundColor: '#0095F7',
  },

  signupButtonText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
});

export default Welcome;