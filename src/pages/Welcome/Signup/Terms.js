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
} from '../../../components';
import Modal from 'react-native-modal'

class Terms extends Component {

  constructor(props) {
    super(props);
  }
  state = {
    visibleModal: null,
  };
  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style = {styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
  gotoPrivacy(){
    this.setState({ visibleModal: null });
    this.props.onGotoPage("PrivacyPage");
  }
  gotoService(){
    this.setState({ visibleModal: null });
    this.props.onGotoPage("ServicePage");
  }  
  render(route) {
    var _this = this;
    return (
        <View style={{alignItems: 'center', justifyContent:'center',marginBottom: 30}}>
            <View style={styles.modalContent}>
                <Text style={styles.baseText}>By signing up, you agree to CLQSIX's</Text>
                <Text style={styles.baseText}>    
                    <Text style={styles.titleText} onPress={() => {this.gotoPrivacy()}}>
                        Privacy Policy
                    </Text>       
                    {'\u200A'}{'\u200A'} and {'\u200A'}
                    <Text style={styles.titleText} onPress={() => {this.gotoService()}}>
                        Terms of Service
                    </Text>       
                    .           
                </Text>
            </View>
        </View>
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
    justifyContent: 'space-around',
    marginBottom : 20,

  },

  footer: {
    flex: 1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  termLink: {
    // borderBottomWidth:1, 
    // borderColor:'#cccccc', 
    backgroundColor:'white',
    width : 100,
    height: 40,
  },
  referralLink: {
    borderWidth:1, 
    borderColor:'#cccccc', 
    backgroundColor:'white',
    width : 200,
    height: 40,
  },
  termLinkText: {
    color:'#bbbbbb',
   // textDecorationStyle: 'solid',
    textDecorationColor: '#bbbbbb',
    fontWeight: 'bold',
    textDecorationLine :'underline',
  },

  nextButton: {
    width:'100%',
    alignItems:'flex-end',
  },

  nextButtonText: {
    fontWeight: 'bold'
  },
  buttonText:{
    fontSize:24,
    color:'white',
    fontWeight: 'bold',
  },
  button: {      
      justifyContent: 'center',
     paddingTop:50,
     paddingLeft:100,
     borderColor: 'rgba(0, 0, 0, 0.1)',
     width:'100%',
     alignItems:'flex-end',
   },
   modalContent: {
  
     justifyContent: 'center',
     alignItems: 'flex-start',
 
   },
 
   baseText: {
     fontSize:13,
     color:'#bbbbbb',
     fontWeight: 'bold',  
   },
   titleText: {
    fontSize:13,
    fontStyle:"italic",
    color:'#bbbbbb',
    textDecorationLine :'underline',
   
   },
   buttonContent:{
    justifyContent: 'center',
    marginTop:40,
    alignItems: 'flex-end',
    width: '100%'
   },
});
export default Terms;