'use strict';

import React, { Component } from 'react';
import {
  Keyboard,
  Image,
 
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
  ClqsixTextInput,
  ClqsixText,
  Content,
  Footer,
  Header,
  Page,
  Images,
  CustomNavigator,
  KeyboardSpacer
} from '../../../components';
import Modal from 'react-native-modal'
import Terms from './Terms';
import { NavigationActions } from 'react-navigation';

class FirstPage extends Component {

  keyboardShowListener = null;
  keyboardHideListener = null;
  model = {};

  constructor(props) {
    super(props);
    this.state = {
      userModel : {name: null,email:null,password: null},
    };
  }

  goBack(){
   // !!this.props.navigation && this.props.navigation.goBack()
   const resetAction = NavigationActions.reset({
    index: 0,
    key:null,
    actions: [
      NavigationActions.navigate({ routeName: 'WelcomeNavigate'})
    ]
  });
  this.props.navigation.dispatch(resetAction)
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
  componentDidMount() {
    StatusBar.setHidden(false);
 }
  gotoNextPage() {
    
    if (!this.name.runValidation()) {
      this.name.focus();
      return;
    }
    if (!this.email.runValidation()) {
      this.email.focus();
      return;
    }
    if (!this.password.runValidation()){
      this.password.focus();
      return;
    }
    // if (!this.name.isValid()) {
    //   this.name.focus();
    //   return;
    // }
    // if (!this.email.isValid()) {
    //   this.email.focus();
    //   return;
    // }
    // if (!this.password.isValid()){
    //   this.password.focus();
    //   return;
    // }
    Keyboard.dismiss();    
    const {navigate} = this.props.navigation;
    navigate('SecondPage', {model: this.state.userModel})
  }
  scrollToRef(component) {
    this.content.scrollToRef(component);
  }
  _setName(value) {  
      let changed = {
        ...this.state.userModel,
        name:value
      };
      this.setState({
        userModel :changed   
      });
  }
  _setEmail(value) {   
    let changed = {
      ...this.state.userModel,
      email:value
    };
    this.setState({
      userModel :changed   
    });
  }
  _setPassword(value) {  
    let changed = {
      ...this.state.userModel,
      password:value
    };
    this.setState({
      userModel :changed   
    });
  }  
  render(route) {
    var _this = this;
    return (
      <Page>    
         <CustomNavigator
            leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
            rightButton={<Image   style = {{opacity :0}}  source={Images.BackChevronLeft_Black_9x16}/>}
          
            onLeftButtonPress={()=>this.goBack()}>
          <Text style={{fontWeight:'bold',fontSize:17,color: '#020202'}}>Sign Up</Text>
        </CustomNavigator>    
        {/* <Header title='Sign Up'/> */}
        <Content ref={ref=>this.content=ref}  
          style={styles.content} 
          scrollable={true} 
          scrollEnabled={this.props.scrollEnabled === true}>
          <View style={[styles.imageContainer,  {justifyContent:'center', alignItems:'center'}]}>
             <Image source={Images.CLQSIX_symbol_1300x1300} style={styles.image}/> 
          </View>
          <View style={[styles.formContainer]}>      
          <ClqsixTextInput               
              ref={ref=>this.name=ref} 
              placeholder='Full name'
              placeholderTextColor = {"#acacac"}
              autoCapitalize="words"
              textStyle = {styles.formControlText}
              style={styles.formControl} 
              needValidation={true}
              isRequired={true}
              suffixIcon = {false}
              value = {this.state.userModel.name}
              onChangeText={(text) => this._setName(text)}
              onSubmitEditing={() => this.email.focus()}
              onFocus={() => this.scrollToRef(this.name)}/>             
            <ClqsixTextInput 
              ref={ref=>this.email=ref} 
              style={styles.formControl} 
              placeholder='Email' 
              suffixIcon = {false}
              placeholderTextColor = {"#acacac"}
              textStyle = {styles.formControlText}              
              isRequired={true} 
              dataType='email' 
              keyboardType='email-address' 
              needValidation={true}
              value = {this.state.userModel.email}
              onChangeText={(text) => this._setEmail(text)} 
              onSubmitEditing={() => this.password.focus()} 
              onFocus={() => this.scrollToRef(this.email)}/>          
            <ClqsixTextInput style={styles.formControl} 
             ref={ref=>this.password=ref} 
              placeholder='Password' 
              suffixIcon = {false}
              placeholderTextColor = {"#acacac"}
              textStyle = {styles.formControlText}              
              isRequired={true} 
              minLength={6} 
              value = {this.state.userModel.password}
              onChangeText={(text) => this._setPassword(text)} 
              secureTextEntry={true} 
              needValidation={true}
              onSubmitEditing={() => Keyboard.dismiss()} 
             />            
          </View>        
        </Content>

        <Footer>
          <Button.Simple text='Next' style={styles.nextButton} 
          textStyle={styles.nextButtonText} 
          onPress={() => this.gotoNextPage()} />
        </Footer>
       
      </Page>
    );
  }
}


const contentPaddingHorizontal = 35;
//const contentPaddingTop = 35;

const styles = StyleSheet.create({
  
  content: {
    flex: 1,
    flexDirection: 'row', 
    alignItems : 'flex-start',
    paddingHorizontal: contentPaddingHorizontal,
  },

  imageContainer: {
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    marginTop: 60,
    
  },

  image: {
    width: 43,
    height: 45
  },

  formContainer: {
    flex: 1,
    marginTop: 39,
  },

  inputGroup: {
    flexDirection:'row',
    
  },

  formControl: {
    paddingVertical: 25,
    marginLeft:35,
    borderBottomWidth: 1,
    borderColor:'#e8e8e8', 
  },
  formControlText:{
    fontSize: 15,  
    fontWeight: '500'
  },

  footerContainer: {
    
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderColor: '#f4f4f4',
  },

  footer: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  passwordForgetLink: {
  },

  passwordForgetLinkText: {
    color:'gray',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: 'gray'
  },

  nextButton: {
    width:'100%',
    backgroundColor: '#0095F7',
    alignItems:'flex-end',
  },

  nextButtonText: {
    fontWeight: 'bold'
  },
  
});
export default FirstPage;