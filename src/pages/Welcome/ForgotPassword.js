'use strict';

import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  Image,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar
} from 'react-native';

import {
  Button,
  Content,
  Footer,
  Header,
  Page,
  ClqsixTextInput,
  Images,
  CustomNavigator,
  KeyboardSpacer,
  ModalActivityIndicator
} from '../../components';

import {
  AuthAPI
} from '../../utils';
class ForgotPassword extends Component {
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
    this.state = {
      showActivityIndicator:false
    };
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack()
  }
  render() {
    return (
      <Page ref={ref => this.children.page = ref}>
        {/* <Header title='Forgot Password' /> */}
        <StatusBar hidden={false} />
        <CustomNavigator
            leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
            rightButton={<Image source={Images.BackChevronLeft_Black_9x16} style = {{opacity:0}}/>}
            
          onLeftButtonPress={()=>this.goBack()}>
          <Text style={{fontWeight:'bold',fontSize:18}}>Forgot Password</Text>
        </CustomNavigator>
        <Content style={styles.content} scrollable={true} scrollEnabled={false}>
          <View style={styles.formContainer}>            
            <View style={{marginTop: 53}}>
              <Text style={styles.h4}>We'll send you a link</Text>
              <Text style={styles.h4}>to reset your password.</Text>
            </View>
            <ClqsixTextInput ref={ref => this.children.username = ref} 
              placeholder='Enter Email' 
              placeholderTextColor = {"#bbbbbb"}
              
              style={{marginTop:62, paddingTop:0, paddingBottom:20, flex:0,justifyContent: 'flex-start'}} 
              isRequired={true} 
              dataType='email' 
              keyboardType='email-address' 
              onChangeText={(text) => this.model.email = text} 
              errorMessages={{email:'Email is invalid or not in our system'}} />            
            {/* <Button.Simple text='Reset Password' style={styles.resetButton} 
            extStyle={styles.resetButtonText} onPress={() => this.resetPassword()} />             */}
                     <KeyboardSpacer/>

          </View>
        </Content>      
        <TouchableOpacity  style={styles.resetButton} onPress={() => this.resetPassword()}>
         
            <Text style={styles.resetButtonText}>Reset Password</Text>
         
        </TouchableOpacity>  
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

      </Page>
    );
  } 


    resetPassword() {
     
      this.children.username.runValidation();
      if (!this.children.username.isValid()) {
        this.children.username.focus();
        return;
      }      
      Keyboard.dismiss();
      this.setState({
        showActivityIndicator: true
      });
      AuthAPI.sendPasswordResetEmail(this.model.email)
      .then(() => {    
       this.setState({
        showActivityIndicator: false
      });
        this.props.navigation.navigate('VerifyCode')
      })
      .catch(() => {    
        this.setState({
          showActivityIndicator: false
        });
        alert("Please use correct email.")
      })
    }
}
const styles = StyleSheet.create({
  
  content: {
    flexDirection: 'row', 
    justifyContent : 'flex-start',
    paddingHorizontal: 25,
  },

  h4: {
    fontFamily: 'SF UI Text',
    fontSize: 15,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#BBBBBB'
  },

  formContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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

export default ForgotPassword;