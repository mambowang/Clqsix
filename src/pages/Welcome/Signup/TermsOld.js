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
  _renderModalContent = () => (
    <View style={styles.modalContent}>
      <Text style={styles.baseText}>By signing up, you agree to</Text>
      <Text style={styles.baseText}>CLQSIX's 
     
         {'\u200A'}{'\u200A'} {'\u200A'}{'\u200A'}
        <Text style={styles.titleText} onPress={() => {this.gotoPrivacy()}}>
          Privacy Policy
        </Text>       
        {'\u200A'}{'\u200A'} and        
      </Text>
      <Text style={styles.baseText}>
       
        <Text style={styles.titleText} onPress={() => {this.gotoService()}}>
          Terms of Service
        </Text>       
        .      
      </Text>
      <View style={styles.buttonContent}>
        {this._renderButton('×', () => this.setState({ visibleModal: null }))}
      </View>
    </View>
  );
  render(route) {
    var _this = this;
    return (
        <View style={{alignItems: 'center', justifyContent:'center'}}>
        <Modal isVisible={this.state.visibleModal === 1}>     
            {this._renderModalContent()}
        </Modal>
          <Footer style={styles.footerContainer}>
          {/* <View style={{alignItems: 'center', justifyContent:'center'}}>
           <Button.Simple text='Referal Code' textStyle={styles.termLinkText} style={styles.referralLink} 
           onPress={() => { this.setState({ visibleModal: 1 })}}/>
         </View> */}
          <View style={{alignItems: 'center', justifyContent:'center'}}>
           <Button.Simple text='Terms' textStyle={styles.termLinkText} style={styles.termLink} 
           onPress={() => { this.setState({ visibleModal: 1 })}}/>
         </View>
         
       </Footer>
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
     // alignItems: 'flex-end',
     paddingTop:50,
     paddingLeft:100,
    // borderRadius: 4,
     borderColor: 'rgba(0, 0, 0, 0.1)',
     width:'100%',
     alignItems:'flex-end',
   },
   modalContent: {
     backgroundColor: 'rgba(36, 215, 112, 1)',    
     padding: 30,
     margin:20,
     justifyContent: 'center',
     alignItems: 'flex-start',
    // borderRadius: 4,
     borderColor: 'rgba(0, 0, 0, 0.1)',
   },
 
   baseText: {
       fontSize:15,
     color:'white',
     fontWeight: 'bold',
   //  letterSpacing: 1.2
   },
   titleText: {
    fontSize:15,
    fontStyle:"italic",
     color:'white',
     textDecorationLine :'underline',
    // letterSpacing: 1.2
   },
   buttonContent:{
    justifyContent: 'center',
    marginTop:40,
    alignItems: 'flex-end',
    width: '100%'
   },
});
export default Terms;