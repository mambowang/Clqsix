'use strict';

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Keyboard,
  Image,
  Alert,
  Modal,
  StatusBar
} from 'react-native';
import { signedIn } from '../../actions/userActions'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import _ from 'lodash';

import {
  Button,
  ClqsixTextInput,
  Content,
  Footer,
  Header,
  Page,
  ScrollView,
  Text,
  KeyboardSpacer,
  CustomNavigator,
  ModalActivityIndicator,
  Images,
} from '../../components';

import {
  AuthAPI
} from '../../utils';
import UserModel from '../../models/UserModel';

// import {
//   AuthAPI
// } from '../../api';

class Login extends Component {

  children = {
    page: null,
    username: null,
    password: null,
    scrollEnabled: false,
  };
  username = '';
  password = '';
  didDismount = false;
  fnComponentDidUpdate = null;

  constructor(props) {
    super(props);
    this.state = {
      borderColor: 'gray',
      showActivityIndicator: false,
      emailVerified:true
    }
  }  
  componentWillUpdate(nextProps, nextState) {  }

  componentWillUnmount() {
      // Don't forget to unsubscribe when the component unmounts
      
  }
  componentDidUpdate() {
    if(this.props.currentUser.signInStatus){
      this.goEngine("Main");
      // if(!!this.unsubscribe){
      //   this.unsubscribe();
      // }
      
      // let route ;
      // if(!!this.state.emailVerified){
      //     route = "Main"     
      // }else{
      //     route = "Start" 
      // }
      // this.setState({
      //   showActivityIndicator: false,          
      // });         
      // this.goEngine(route);
    }
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack()
  }
  goEngine(route){
    const resetAction = NavigationActions.reset({
      index: 0,
      key:null,
      actions: [
        NavigationActions.navigate({ routeName: route})
      ]
    });
    this.props.navigation.dispatch(resetAction)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={false} />
        <CustomNavigator
            leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
            rightButton={<Image style = {{opacity :0}} source={Images.BackChevronLeft_Black_9x16}/>}
            
          onLeftButtonPress={()=>this.goBack()}>
          <Text  style={{fontWeight:'bold',fontSize:17,color: '#020202'}}>Log In</Text>
        </CustomNavigator>
        <ScrollView
        ref={ref => this.children.scrollView = ref} scrollEnabled={false}
        scrollEnabledOnKeyboard={true}>
          <View style={{flexDirection:'row'}}>
            <View>
              <Image  source={Images.CLQSIX_symbol_1300x1300}  style={styles.loginIcon} 
              resizeMode='contain' resizeMethod='scale' />
            </View>
            <View style={styles.loginInputGroup}>
              <ClqsixTextInput 
                ref={ref => this.children.username = ref}
                style={styles.input}
                placeholderTextColor = {"#acacac"}
                
                styleWithMessage={styles.inputWithMessage}
                errorMessageStyle={styles.errorMessage}
                suffixIcon={false}
                isRequired={true}
                needValidation={true}
                textStyle = {styles.formControlText}              
                
                placeholder='Email'
                dataType='email'
                keyboardType='email-address'
                onChangeText={(text) => this.username = text}
                onSubmitEditing={() => this.children.password.focus()} />
              <ClqsixTextInput ref={ref => this.children.password = ref}
                placeholderTextColor = {"#acacac"}
                textStyle = {styles.formControlText}              
                
                style={styles.input}
                styleWithMessage={styles.inputWithMessage}
                suffixIcon={false}
                isRequired={true}
                needValidation={true}
                placeholder='Password'
                onSubmitEditing={() =>Keyboard.dismiss()}
                onChangeText={(text) => this.password = text}
                secureTextEntry={true}
                errorMessages={{required:"Please enter your password!"}} />
            </View>
          </View>
        </ScrollView>
        <View style={styles.footerContainer}>        
          <View style={{alignItems: 'center', justifyContent:'center'}}>
           <Button.Simple text='Forgot Password?'
            textStyle={styles.forgotPasswordLinkText} 
            style={styles.forgotPasswordLink} 
            onPress={() => this.gotoForgotPassword()}/>
          </View>         
        </View>
        <TouchableOpacity onPress={() => this.login()}>
          <View style={styles.startButton}>
            <Text style={styles.startButtonText}>Start</Text>
          </View>
        </TouchableOpacity>
        <KeyboardSpacer/>
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />
      </View>
    )
  }

  gotoForgotPassword() {
    this.props.navigation.navigate('ForgotPassword')  
  }
  login(){    
    // this.children.username.runValidation();
    // this.children.password.runValidation();
    //if (this.children.username.isValid() && this.children.password.isValid()) {

      if (!this.children.username.runValidation()) {
        this.children.username.focus();
        return;
      }
      if (!this.children.password.runValidation()) {
        this.children.password.focus();
        return;
      } 
      Keyboard.dismiss();
      this.setState({
        showActivityIndicator: true
      });
      AuthAPI.signInWithEmailAndPassword(this.username,this.password)
      .then((user) => {       
        UserModel.findwithUID(user.uid)
        .then(user => {  
        
            const email = user.email
            const name = user.name|| '';    
            const uid = user.uid 
            const password =  this.password;
            const photoURL = user.photoURL|| '';        
            const description = user.description || '';
            this.props.signedIn(email, name,password, uid,photoURL,description);
            // let _this = this;
            // this.unsubscribe = AuthAPI.onAuthStateChanged(user => {
            //   if (user) {   
            //       if(!user.emailVerified){
            //         _this.setState({ emailVerified: !this.state.emailVerified}, () => {
            //           _this.props.signedIn(email, name,password, uid,type,photoURL,description)
            //           });   
            //       }else{
            //         _this.props.signedIn(email, name,password, uid,type,photoURL,description)
            //       }
            //   }
            // });        
          
        })  

      })
      .catch(error => {
        if(!!error.message && error.message !== '') alert("Please enter correct user information to log in.");
        this.setState({
          showActivityIndicator: false
        });  
      });
    }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'white',

    alignItems:'stretch'
  },

  loginIcon: {
    width:43,height:45,marginLeft:31,marginRight:35, marginTop:48
  },

  loginInputGroup: {
    flex:1,paddingRight:25,paddingTop:31.5
  },

  input: {
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderColor:'#e8e8e8', 
  },

  inputWithMessage: {
    height:87,
  },

  // forgotPasswordLink: {
  //   alignItems:'center'
  // },

  // forgotPasswordLinkText: {
  //   textDecorationLine:'underline', textDecorationStyle:'solid', textDecorationColor:'#a3a3a3', fontSize:15, color:'#a3a3a3'
  // },
  formControlText:{
    fontSize: 15,  
    fontWeight: '500'
  },
  startButton: {
    flexDirection:'row', height:50, backgroundColor:'#0095F7', alignItems:'center', 
    justifyContent:'flex-end',paddingRight:16, marginTop:19
  
  },

  startButtonText: {
    fontSize:15, fontWeight:'bold',color:'white'
  },

  forgotPasswordLink: {
    borderWidth:1, 
    borderColor:'#BBBBBB', 
    backgroundColor:'white',   
    height: 35,
  },
  forgotPasswordLinkText: {
    color:'#ACACAC',
    fontSize: 11
    
  },
  footerContainer: {    
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom : 20,
  },
});
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps,{signedIn})(Login)

