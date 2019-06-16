'use strict';

import React, { Component } from 'react';

import {
  Dimensions,
  Image,
  Keyboard, 
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  StatusBar,
} from 'react-native';
import _ from 'lodash';

import ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-datepicker'
import moment from 'moment';
import { NavigationActions } from 'react-navigation'
import { signUp } from '../../../actions/userActions'
import { connect } from 'react-redux'
import {
  Button,
  ClqsixTextInput,
  Content,
  DropDownList,
  Footer,
  Header,
  Options,
  Page,
  Alert,
  Images,
  CustomNavigator,
} from '../../../components'

import {
  AuthAPI,
  FirebaseStorageAPI,
} from '../../../utils';
import Modal from 'react-native-modal'
import Terms from './Terms';
const ScreenSize  = Dimensions.get('window');
const ScreenWidth = ScreenSize.width < ScreenSize.height ? ScreenSize.width : ScreenSize.height;

const ContentPaddingHorizontal = 24;
const ContentPaddingTop = 20;
const ContentPaddingLeft = 30;
const dateFormat = "MMMM DD, YYYY";
class SecondPage extends Component {

  content = null;
  customGender = null;
  model = {};
  constructor(props) {
    super(props);
    this.state = {
      avatarSource: null,
      gender: null,
      birthday: null,
      type: 'single',
      code: ""
    };
    const {navigate,state} = this.props.navigation;

    this.model = state.params.model;
    // this.model = {
    //   name: "1",
    //   email: "1@mail.com",
    //   password: "12345678",
    //   birthday: "December 09, 1991",
    // }
  }
  goBack(){
    
    !!this.props.navigation && this.props.navigation.goBack()
  }

  componentDidUpdate() {
    if(this.props.currentUser.signInStatus){
      this.onSignupSuccess();
    }
  }
  async componentWillMount() {
    this.keyboardShowListener = Keyboard.addListener("keyboardWillShow", function(){
      if (!!this.content) {
        this.content.setScrollEnabled(true);
      }
    }, this);

    this.keyboardHideListener = Keyboard.addListener("keyboardWillHide", function(){
      if(!!this.content) {
        this.content.scrollTo({x:0, y:0, animated:true});
        this.content.setScrollEnabled(false);
      }
    }, this);
  }

  async componentWillDismount() {
    if (this.keyboardShowListener) {
      Keyboard.removeListener(this.keyboardShowListener);
      this.keyboardShowListener = null;
    }

    if (this.keyboardHideListener) {
      Keyboard.removeListener(this.keyboardHideListener);
      this.keyboardHideListener = null;
    }
  }

  onSignupSuccess(){
    const resetAction = NavigationActions.reset({
      index: 0,
      key:null,
      actions: [
        NavigationActions.navigate({ routeName: 'Start'})
      ]
    });
    this.props.navigation.dispatch(resetAction)
  }
  _setGender(item) {    
      this.setState({
        gender: item
      });

    
  }
  _setBirthday(value) {   
  
      this.setState({
        birthday: value
      });
    
  }   
  _setCode(value) {   
 
    this.setState({
      code: value
    });
    
  }
  render() {   
    var _this = this;
    return (
      <Page ref={(ref) => this.page = ref}>
      <StatusBar hidden={false} />
        {/* <Header title='Sign Up' /> */}
        <CustomNavigator
            leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
            rightButton={<Image style = {{opacity :0}} source={Images.BackChevronLeft_Black_9x16}/>}
          onLeftButtonPress={()=>this.goBack()}>
         <Text style={{fontWeight:'bold',fontSize:17,color: '#020202'}}>Sign Up</Text>
        </CustomNavigator>   


        <Content ref={(ref) => this.content = ref} style={styles.content} scrollable={true} 
          scrollEnabled={this.props.scrollEnabled === true}>     
          <View style={[styles.imageContainer,  {justifyContent:'center', alignItems:'center'}]}>
            <Image source={Images.Cliqsix_59x60} style={styles.image}/>
          </View>           
          <View style={styles.formContainerWrapper}>
            <View style={styles.formContainer}>
              <DatePicker
                style={styles.birthdayInput}
                date={this.state.birthday}
                mode="date"
                placeholder="Birthday"
                format={dateFormat}              
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                  dateInput:{
                    justifyContent:'center', 
                    alignItems:'flex-start',
                    paddingVertical: 25,
                    borderBottomWidth: 1,
                    borderWidth:0,
                    borderColor:'#e8e8e8', 
                  },
                  placeholderText: {
                   color: '#acacac',
                   fontSize: 15,
                  },
                  dateText:{
                    fontSize: 15,
                    textAlign: 'left'
                  },
                  btnTextCancel: {
                    fontWeight:'bold'                
                  },
                  btnTextConfirm:{
                    fontWeight:'bold'
                  },                 
                }}
                onDateChange={(date) => {
                  this._setBirthday(date)
                  }}
              />    
              <DropDownList.Gender  
               style = {styles.genderListContent}            
               onSelectItem={(item) => this._setGender(item)} 
               value = {this.state.gender}/>  
              <ClqsixTextInput style={styles.referralCodeContent} 
                placeholder='Referral code? (optional)' 
                suffixIcon = {false}
                placeholderTextColor = {"#acacac"}
                textStyle = {styles.formControlText}      
                onChangeText={(text) => this._setCode(text)} 
                onSubmitEditing={() => Keyboard.dismiss()} 
                value = {this.state.code}
              />
            </View>
          </View>
        
        </Content>
        
        <Footer>
            <Terms onGotoPage={(id) =>{this.props.navigation.navigate(id)}}></Terms>
          <Button.Simple text='Done' style={styles.startButton} textStyle={styles.startButtonText} 
          onPress={() => {this.signup()}} />
        </Footer>
        <Alert 
          ref={ref=>this.alert=ref} 
          style={{backgroundColor:'#24d770'}} 
          text={['You must be 13 or older', 'to use CLQSIX.']}
          onRequestClose={() => this.alert.hide()}/>
      </Page>
    );
  }
  signup() {
    var birthday = moment(this.state.birthday,"MMMM DD, YYYY");
    var age = moment().diff(birthday, 'years');
    if (birthday.isValid() != true || age < 13) {
      this.alert.show();
      return;
    }  
    Keyboard.dismiss();
    this.page.showActivityIndicator();
    let _this = this,
    _model = _.extend( this.model,
       {birthday: this.state.birthday,code: this.state.code,gener: this.state.gender.value});

    AuthAPI.createUserWithEmailAndPassword( _model)
    .then((userData) => {
      if (!!_this.page)
        _this.page.hideActivityIndicator();
        const email = userData.email
        const name = userData.name
        const uid = userData.uid 
        const type = "single";   
        const password = this.model.password    ;
        const photoURL = userData.photoURL|| '';        
        const description = userData.description || '';
        this.props.signUp(email, name,password, uid,type,photoURL,description)
    })
    .catch(error => {
      if (_this.page)
        _this.page.hideActivityIndicator();
      alert(error.message);
    });
  }

}
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}
const styles = StyleSheet.create({  
  content: {
    flexDirection: 'row', 
    alignItems : 'flex-start',
    paddingHorizontal: ContentPaddingHorizontal,
    paddingLeft: ContentPaddingLeft,
  },
  imageContainer: {
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    marginTop: 45,    
  },
  image: {
    width: 43,
    height: 45
  },
  formContainerWrapper: {
    flex:1,
    flexDirection: 'column',
    marginTop: 37.5
  },
  formContainer: {
    flex: 1,
    flexDirection:'column',
    marginLeft:35,
  },
  startButton: {
    width:'100%',
    backgroundColor: '#0095f7',
    alignItems:'flex-end'
  },
  startButtonText: {
    fontWeight: 'bold'
  },

  birthdayInput: {
    width: "100%",

  },
  genderListContent: {
    justifyContent:'center', 
    alignItems:'flex-start',
    width: '100%',  
    paddingBottom: 30,
    paddingTop: 35,
    height:70,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor:'#e8e8e8', 
  },
  referralCodeContent:{
    justifyContent:'center', 
    alignItems:'flex-start',
    width: '100%',  
  
    paddingVertical: 25,
    borderBottomWidth: 1,
    borderColor:'#e8e8e8', 
  },

  formControlText:{
    fontSize: 15,  
    fontWeight: '500'
  },
});
export default connect(mapStateToProps,{signUp})(SecondPage)