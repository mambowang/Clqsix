'use strict';

import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  Button,
  Content,
  Footer,
  Header,
  Page,
  ClqsixTextInput,
  Text,
  Images,
  CustomNavigator
} from '../../components';

import {
  AuthAPI
} from '../../utils';
import { NavigationActions } from 'react-navigation'


class VerifyCode extends Component {

  children = {
    page: null,
    username: null,
    password: null,
    scrollEnabled: false,
  }

  model = {
    email : null
  }

  constructor(props) {
    super(props);
  }
  goBack(){
    // const backAction = NavigationActions.back()
    // this.props.navigation.dispatch(backAction)   
    const resetAction = NavigationActions.reset({
      index: 0,
      key:null,
      actions: [
        NavigationActions.navigate({ routeName: 'WelcomeNavigate'})
      ]
    });
    this.props.navigation.dispatch(resetAction)
     
  }
  render() {
    return (
      <Page ref={ref => this.children.page = ref}>
      <CustomNavigator
            leftButton={<Image source={Images.BackChevronLeft_Black_9x16} style = {{opacity:0}}/>}
            rightButton={<Image source={Images.BackChevronLeft_Black_9x16} style = {{opacity:0}}/>}
      >
          <Text style={{fontWeight:'bold',fontSize:18}}>Forgot Password</Text>
        </CustomNavigator>
      <Content style={styles.content}>
        <View style={styles.formContainer}>
            <Text style={styles.h4}>Reset password link sent!</Text>
        </View>
      </Content>    
      <TouchableOpacity  style={styles.resetButton} onPress={() => this.goBack()}>
         
            <Text style={styles.resetButtonText}>Done</Text>
         
        </TouchableOpacity>    
    </Page>
    );
  }
  
  

 
}

const styles = StyleSheet.create({
  
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 25,
  },

  h4: {
    fontFamily: 'SF UI Text',
    fontSize: 15,
    fontWeight: 'bold',
  },

  formContainer: {
    
  },
  resetButton: {
    flexDirection:'row',
    height:50, 
    width:'100%',
    backgroundColor:'#0095F7', 
    alignItems:'center', 
    justifyContent:'flex-end',
    paddingRight:16, 
  },

  resetButtonText: {
    fontSize:15, fontWeight:'bold',color:'white'
  }
  
});

export default VerifyCode;