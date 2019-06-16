'use strict';

import React, { Component } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  StatusBar,
  ImageBackground
} from 'react-native';

import {
  Button,
  Content,
  Footer,
  FullScreen,
  Header,
  Page,
  Images,
  Alert
} from '../../components'
var screen = require('Dimensions').get('window');
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
import PageControl from 'react-native-page-control'
import { NavigationActions } from 'react-navigation'
import {
  AuthAPI,
} from '../../utils'
class Start extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      currentPage : 0,
   
    };
  }
  onScroll(event){
    var offsetX = event.nativeEvent.contentOffset.x,
        pageWidth = screen.width - 10;
    this.setState({
      currentPage: Math.floor((offsetX - pageWidth / 2) / pageWidth) + 1
    });
  }
  onItemTap(index) {
    //console.log(index);
  }
  render() {
    return (
      <Page>
         <StatusBar hidden={true} />
        <Content style={styles.content}>
          <View style={styles.scrollcontent}>
              <ScrollView
                ref="ad"
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                onScroll={this.onScroll.bind(this)}
                scrollEventThrottle={16}
              >
                <View style={styles.viewcontent}>                
                    <ImageBackground source={Images.Start1} style={styles.image}>
                      <View style={styles.textcontent}>   
                        <Text style={styles.comment}>Create a page</Text>     
                        <Text style={styles.comment}>for your crew.</Text>      
                      </View>   
                    </ImageBackground>                  
                </View>
                <View style={styles.viewcontent}>                
                    <ImageBackground source={Images.Start2} style={styles.image}>
                      <View style={styles.textcontent}>   
                        <Text style={styles.comment}>Share content</Text>   
                        <Text style={styles.comment}>as a clique.</Text>   
                      </View>   
                    </ImageBackground>
                </View>
                <View style={styles.viewcontent}>                 
                  <ImageBackground source={Images.Start3} style={styles.image}>
                    <View style={styles.textcontent}>   
                        <Text style={styles.comment}>People follow your</Text>      
                        <Text style={styles.comment}>squad, not just you.</Text>
                    </View>   
                  </ImageBackground>
                </View>
                <View style={styles.viewcontent}>                 
                  <ImageBackground source={Images.Start4} style={styles.image}>
                    <View style={styles.textcontent}>   
                      <Text style={styles.comment}>Don't have a crew?</Text>      
                      <Text style={styles.comment}>Discover squads to join.</Text>
                    </View>   
                  </ImageBackground>                  
                </View>

                <View style={styles.viewcontent}>                  
                  <ImageBackground source={Images.Start5} style={styles.image}>
                    <View style={styles.textcontent}>   
                        <Text style={styles.comment}>Welcome to CLQSIX!</Text>      
                        <Text style={styles.comment}>Let's have some fun.</Text> 
                    </View>   
                  </ImageBackground>                 
                </View>
               
              </ScrollView>
              <PageControl
                style={{ position:'absolute', left:0, right:0, bottom:25 }}
                numberOfPages={5} currentPage={this.state.currentPage}
                hidesForSinglePage
                pageIndicatorTintColor='#DDDDDD'
                indicatorSize={{ width:7, height:7 }}
                currentPageIndicatorTintColor='#9E4FFF'
                onPageIndicatorPress={this.onItemTap}
              />
              
          </View>
          <Button.Simple style={{height: 50,alignItems: 'flex-end'}} 
          textStyle = {{ fontSize: 16,color:"#ffffff", fontWeight: 'bold'}} 
          text='Start' onPress={()=>{this._onStart()}}/>
          {/* <Button.Simple style={{height: 50,alignItems: 'flex-end'}} 
          textStyle = {{ fontSize: 16,color:"#ffffff", fontWeight: 'bold'}} 
          text='Start' onPress={()=>{}}/> */}
      </Content>
    </Page>

    );
  }
  _onStart() {
    const resetAction = NavigationActions.reset({
      index: 0,
      key:null,
      actions: [
        NavigationActions.navigate({ routeName: 'Main'})
      ]
    });
    this.props.navigation.dispatch(resetAction)           
    // let _this = this;
    // this.unsubscribe = AuthAPI.onAuthStateChanged(user => {
    //   if (user) {   
    //       if(!user.emailVerified){
    //         AuthAPI.sendEmailVerification(user.email)
    //         .then(() => {           
             
    //         })
    //         .catch(() => {       
    //         })
    //       }else{
    //         const resetAction = NavigationActions.reset({
    //           index: 0,
    //           key:null,
    //           actions: [
    //             NavigationActions.navigate({ routeName: 'Main'})
    //           ]
    //         });
    //         this.props.navigation.dispatch(resetAction)           
    //       }
    //   }
    // });  


  }

}

const styles = StyleSheet.create({

  content: {
    justifyContent:'center',
    //justifyContent: 'flex-start',
  },
  scrollcontent: {      
    width:screen.width ,    
    height: screen.height - 50,
  },
  viewcontent: {
    width:screen.width,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems : 'center',
    
  },


  image: {
     flex: 1,
     width:screen.width,
    // resizeMode: 'cover', // or 'stretch'
     flexDirection: 'column', 
     justifyContent: 'center',
     alignItems : 'center',
  },
  textcontent: {
    paddingHorizontal: 20, 
    marginTop:50,
    alignItems:'center',
    justifyContent:'center',
    backgroundColor: "#00000000"
  }, 
  comment: {
    fontFamily: 'SF UI Text',
    fontSize: 24,
    color:'#FFFFFF',
    fontWeight: '900'
  }
  
});

export default Start;