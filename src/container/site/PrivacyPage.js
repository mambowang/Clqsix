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
  WebView ,
  Dimensions,
  ActivityIndicator,

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
} from '../../components';
import Modal from 'react-native-modal'
import fb from '../../utils/FirebaseAPI'
import RNFetchBlob from 'react-native-fetch-blob';

class PrivacyPage extends Component {

  keyboardShowListener = null;
  keyboardHideListener = null;

  constructor(props) {
    super(props);
    this.state = {
      privacyTxt: "",
      privacyUrl: null,
      animating: true
     
    };
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack()
  }
  getPrivacyData(url){
    return new Promise((resolve, reject) => {
      RNFetchBlob.fetch('GET', url, {
        Authorization : 'Bearer access-token...',            
      }) 
      .then(response => resolve(response))
      .catch(error => reject(error))    
    });
  }
  componentDidMount() {
    fb.ref("/terms/privacy/").once('value')
    .then(snapshot => {
        //console.log(snapshot.val());
        let url = snapshot.val();
        this.setState({
          privacyUrl: url,
          animating:false
        });  
        // this.getPrivacyData(url)
        // .then((res) => {      
        //   let base64Str = res.base64()         
        //   let text = res.text()
        //   this.setState({
        //     privacyTxt: text
        //   });  
        // })
        // .catch(error => {
        //   if(!!error.message && error.message !== '') alert(error.message);      
        // });     
      });
    
  }


  
  render(route) {
    var _this = this;
    const animating = this.state.animating;    
    return (
      <Page>        
        {/* <Header title='Privacy Policy'/>            */}
        <CustomNavigator
            leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
            rightButton={<Image source={Images.BackChevronLeft_Black_9x16} style ={{opacity:0}} />}
            
          onLeftButtonPress={()=>this.goBack()}>
          <Text style={{fontWeight:'bold'}}>Privacy Policy</Text>
        </CustomNavigator>     
       
        <Content ref="content" style={styles.content}>    
        {  animating === true &&
        <ActivityIndicator
               animating = {animating}
               color = '#bc2b78'
               size = "large"
               style = {styles.activityIndicator}/>
        }
        { this.state.privacyUrl !== null &&
        <WebView
        source={{uri: this.state.privacyUrl}}
        style={styles.webpage}         
        />
        }
        </Content>  
     
      </Page>
    );
  }
}


const contentPaddingHorizontal = 35;
//const contentPaddingTop = 35;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 70
 },
 activityIndicator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80
 },
  content: {
    flex: 1,
    justifyContent:'center',    
    alignItems : 'center',
    paddingHorizontal: contentPaddingHorizontal,
  },
  webpage:{
    flex: 1,
    justifyContent:'center',    
    paddingHorizontal: 15,  
    width: Dimensions.get('window').width - 30
  },
  imageContainer: {
    justifyContent:'flex-start',
    alignItems: 'flex-start',
    marginTop: 47,    
  },

  image: {
    width: 43,
    height: 45
  },

  formContainer: {
    flex: 1,
    marginLeft: 35,
    marginTop: 39,
  },

  inputGroup: {
    flexDirection:'row',
    
  },

  formControl: {
    paddingVertical: 20,
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
    alignItems:'flex-end',
  },

  nextButtonText: {
    fontWeight: 'bold'
  },
  button: {  
   
    // justifyContent: 'center',
    // alignItems: 'flex-end',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    width:'100%',
    alignItems:'flex-end',
  },
  modalContent: {
    backgroundColor: 'rgba(36, 215, 112, 1)',    
    padding: 15,
    margin:50,
    justifyContent: 'center',
    alignItems: 'flex-start',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  baseText: {
  },
  titleText: {   
    fontWeight: 'bold',
  },
});
export default PrivacyPage;