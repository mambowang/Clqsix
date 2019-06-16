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
    StatusBar,
    Keyboard,
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
import { changePassword } from '../../actions/userActions'
import { connect } from 'react-redux'
import { StackNavigator } from 'react-navigation';
const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;

class ChangePassword extends Component {

  ConfirmPasswordTxt = '';
  NewPasswordTxt = '';
  OldPasswordTxt = '';
  constructor(props) {
    super(props);
    this.state = {
        showActivityIndicator: false,
        ConfirmPasswordTxt: '',
        NewPasswordTxt: '',
        OldPasswordTxt: ''
    }
  }
  _onNavigationRightButtonPress() {   
    this.changePassword();
  }
  _onNavigationLeftButtonPress(){
    const { navigation } = this.props;
  
    !!navigation && navigation.goBack();
  }
  changePassword(){
    Keyboard.dismiss();
  
    if (!this.OldPassword.runValidation()) {
      this.setState({OldPasswordTxt:""})
      this.OldPassword.focus();
      return;
    }
    if (!this.NewPassword.runValidation()) {
      this.setState({NewPasswordTxt:""})
      this.NewPassword.focus();
      return;
    }
    if (!this.ConfirmPassword.runValidation()) {
      this.setState({ConfirmPasswordTxt:""})
      this.ConfirmPassword.focus();
      return;
    }
    if(this.state.OldPasswordTxt != this.props.currentUser.password){
      alert("Please use correct password!!!")
      this.setState({OldPasswordTxt:""})
      this.OldPassword.focus();
      return;
    }
    if(this.state.NewPasswordTxt != this.state.ConfirmPasswordTxt){
      alert("Please use correct new password!!!")
      this.setState({NewPasswordTxt:"",ConfirmPasswordTxt:""})
      this.NewPassword.focus();
      return;
    }
    this.setState({showActivityIndicator:true});
    let _this = this;
    AuthAPI.changePassword(this.props.currentUser.password,this.state.NewPasswordTxt)
    .then(user => {
      _this.setState({
        showActivityIndicator:false,
        NewPasswordTxt:"",
        ConfirmPasswordTxt:"",
        OldPasswordTxt:""
      });
      _this.successAlert.show();

    })
    .catch(error =>{
      _this.setState({
        showActivityIndicator:false,
        NewPasswordTxt:"",
        ConfirmPasswordTxt:"",
        OldPasswordTxt:""
      });
      alert(error)
    });


  }
  componentDidMount() {
   
  }
  goBack(){
    this.successAlert.hide();
    const { navigation } = this.props;
    navigation.goBack();       
  }
  render() {
 
    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
              <StatusBar hidden={false} />
        <CustomNavigator
          leftButton = {<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}
          rightButton = {<Text style={{fontFamily: 'SF UI Text', fontSize: 18, color: 
          '#0F7EF4', fontWeight: '600'}}>Done</Text>}
          onLeftButtonPress = {() => this._onNavigationLeftButtonPress()}        
          onRightButtonPress = {() => this._onNavigationRightButtonPress()}
        >
          <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:28, fontWeight:'bold'}}>
           Change Password
          </Text>
        </CustomNavigator>


        <ScrollView ref="scrollView" style={{width:'100%'}}> 
            <FullScreen.Row style={styles.topview}>
                <View >
                <Text style={styles.topfont}> atLea$t6ChaRacTersLonG!</Text>
                </View>
            </FullScreen.Row>
           
            <View style={styles.content}>          
                <ClqsixTextInput ref={ref => this.OldPassword = ref}
                    placeholderTextColor = {"#acacac"}
                    textStyle = {styles.formControlText} 
                    value = {this.state.OldPasswordTxt}             
                    isRequired={true} 
                    minLength={6} 
                    style={styles.input}
                    styleWithMessage={styles.inputWithMessage}
                    suffixIcon={false}
                    needValidation={true}
                    placeholder='Current password'
                    onSubmitEditing={() => this.NewPassword.focus()}
                    onChangeText={(text) => this.setState({OldPasswordTxt:text})}
                    secureTextEntry={true}
                    />
            </View>
            <View style={[styles.content,{borderTopWidth: 0}]}>          
                <ClqsixTextInput ref={ref => this.NewPassword = ref}
                    placeholderTextColor = {"#acacac"}
                    textStyle = {styles.formControlText}    
                    value = {this.state.NewPasswordTxt}     
                    style={styles.input}
                    styleWithMessage={styles.inputWithMessage}
                    suffixIcon={false}
                    isRequired={true}
                    needValidation={true}
                    placeholder='Enter new password'
                    onSubmitEditing={() => this.ConfirmPassword.focus()}
                    onChangeText={(text) => this.setState({NewPasswordTxt:text})}
                    secureTextEntry={true}
                    />
            </View>
            <View style={[styles.content,{borderTopWidth: 0}]}>          
                <ClqsixTextInput ref={ref => this.ConfirmPassword = ref}
                    placeholderTextColor = {"#acacac"}
                    textStyle = {styles.formControlText}
                    value = {this.state.ConfirmPasswordTxt}     
                    style={styles.input}
                    styleWithMessage={styles.inputWithMessage}
                    suffixIcon={false}
                    isRequired={true}
                    needValidation={true}
                    placeholder='Re-enter new password'
                    onSubmitEditing={() =>Keyboard.dismiss()}
                    onChangeText={(text) => this.setState({ConfirmPasswordTxt:text})}
                    secureTextEntry={true}

                    />
            </View>


        </ScrollView>
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

          <Alert  ref={ref=>this.successAlert=ref}                 
                style={{backgroundColor:'#0095F7'}} 
                closeButtonSource = {Images.check_17x13}
                text={['Your password has been','changed.']}               
                onRequestClose={() => this.goBack()}/>
      </FullScreen>
    );
  }
};

const styles = StyleSheet.create({
  topview: {
    alignItems:'center',
    marginHorizontal :25,
    backgroundColor: '#A3A3A3',
    height: 60,
    marginVertical: 30,
  
  },  
  topfont: {
    fontFamily: 'SF UI Text', 
    fontSize: 13, 
    color: 'white', 
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal :25,

   borderWidth:1, 
   borderColor:'#EEEEEE', 

  },
  formControlText:{
    fontSize: 15,  
    fontWeight: '500'
  },

  input: {
    paddingVertical: 25,
    // height: 70,
  },

  inputWithMessage: {
    //  height:50,
  },

});
function mapStateToProps(state) {
    return {
      currentClique: state.currentClique,
      currentUser: state.currentUser
      
    }
  }
  
export default connect(mapStateToProps,{changePassword})(ChangePassword)
