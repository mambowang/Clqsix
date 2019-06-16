'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Navigator,
    Image,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Alert,
    Keyboard,
    TextInput,
} from 'react-native';

import {
  ClqsixTextInput,
  CustomNavigator,
  FullScreen,
  KeyboardSpacer,
  ScrollViewWrapper,
  Images,
  ModalActivityIndicator
} from '../../components';
import {
    FirebaseStorageAPI,
  } from '../../utils';
  import { connect } from 'react-redux';
  import { NavigationActions } from 'react-navigation';
  import {VisualModel,CliqueModel,UserModel} from '../../models';
  import { postVisual } from '../../actions/cliqueActions'
  import { clickProfile } from '../../actions/statusActions'
  
  
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor:'#fff'
  },

  input: {
    fontFamily :'SF UI Text',
    fontSize: 17,
   
    marginLeft: 41,
    marginRight: 41,
    marginTop: 60,
    flex:1,
    width:'80%',
   
  },

  len: {
    fontFamily: 'SF UI Text',
    fontSize: 15,
    marginRight: 42,
    color: '#A3A3A3',
  }
});

const TEXT_MAX_LEN = 160;
class TextUpload extends Component {

  text = '';

 
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      availableLen : TEXT_MAX_LEN,
      showActivityIndicator: false ,
    };
  }
  goBack() {
    const { navigation } = this.props;    
    navigation.goBack();       
  }
  gotoTop(){
    // !!this.props.navigation && this.props.navigation.goBack()
    const resetAction = NavigationActions.reset({
      index: 0,
      key:null,
      actions: [
        NavigationActions.navigate({ routeName: 'Upload'})
      ]
    });
    this.props.navigation.dispatch(resetAction);    
   // if (this.props.goProfile) {//call screenpos
    //   this.props.goProfile();
    // }
    this.props.clickProfile();
  }
  componentWillReceiveProps(nextProps){    
   // console.log("componentWillReceiveProps");
    if(this.props.currentClique.lastVisualId != nextProps.currentClique.lastVisualId){
      this.gotoTop();
    }
  
  }
  render() {
    return (
      <FullScreen style={styles.container}>
        
        <View style={{flex: 1, width: '100%', justifyContent: 'flex-start', alignItems: 'flex-start'}}>

          {/* <Image style={{marginLeft: 42, marginTop: 54, width: 61, height: 61,}} source={Images.Cliqsix_59x60} /> */}
          
          <TextInput
            style={styles.input}
            underlineColorAndroid = 'transparent'
            placeholder="Express yourself"
            multiline = {true}
            maxLength = {TEXT_MAX_LEN}
            onChangeText={(text) => {
              this.text = text;
              this.setState({
                availableLen : 160 - text.length
              })
            }}
            onSubmitEditing={() =>  Keyboard.dismiss()}                   
            
            />
        </View>

        <View style={{width: '100%', height: 45,paddingHorizontal: 40, flexDirection:'row'}}>
        
          <View style={{flex: 1, alignItems: 'flex-start', justifyContent: 'center'}}>
            <Text style={styles.len}>{this.state.availableLen}</Text>
          </View>
        </View>

        <View style={{width: '100%', height:50, flexDirection: 'row', backgroundColor: '#24D770', paddingHorizontal: 20,}}>
          <View style={{flex: 1, alignItems:'flex-start', justifyContent:'center'}}>
            <TouchableOpacity onPress={() => this.goBack()}>
            <View  style={{paddingHorizontal: 10,}} >            
                <Image source={Images.BackChevronLeft_White_9x16} />           
            </View>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, alignItems:'flex-end', justifyContent: 'center'}}>
            <TouchableOpacity onPress={() => this._onPost()}>
              <View  style={{paddingHorizontal: 10,}}>    
                <Text style={{color:'#fff', fontFamily: 'SF UI Text', fontSize: 15, fontWeight:'bold'}}>Post</Text>
              </View>
            </TouchableOpacity>
           
          </View>
        </View>
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

        <KeyboardSpacer/>
      </FullScreen>
    );
  }

  _onPost() {
    if(this.text == ""){
      alert("Please entry post text");
      return;
    }
    let post = {
        type: 'text',
        text:this.text,
        caption: "",
        cliqueID: this.props.currentClique.lastCliqueId
      }
      this.postVisual(post);
  
  }

  postVisual(visual) {      
    let _this = this;
    VisualModel.push(visual,(visualKey) => {
      _this.props.postVisual(visualKey); 
     
    });    
  }
};
function mapStateToProps(state) {
    return {
      currentClique: state.currentClique
    }
  }
export default connect(mapStateToProps,{postVisual,clickProfile})(TextUpload)


