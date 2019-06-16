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
  
  import LinkPreview from 'react-native-link-preview';
  
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor:'#fff'
  },
  input: {  
    alignItems: 'flex-start',
    justifyContent: 'flex-start',    
    marginVertical: 30,
    width:'100%',
    borderBottomWidth: 0   ,
  },
  inputTxt:{
    fontFamily :'SF UI Text',
    fontSize: 17,
    
  },

});

const TEXT_MAX_LEN = 160;
class LinkUpload extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      urlText : '',
      caption : '',
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
    let _this = this;  
    return (
      <FullScreen style={styles.container}>
        
        <View style={{flex: 1, width: '100%', 
        justifyContent: 'flex-start', marginTop: 60,
        paddingHorizontal:40,
        alignItems: 'flex-start'}}>

          {/* <Image style={{marginLeft: 42, marginTop: 54, width: 61, height: 61,}} source={Images.Cliqsix_59x60} /> */}
          {/* <Text style={{color:'#DDDDDD' ,fontSize:18, marginVertical:20,}}>
            Describe the link
          </Text> */}
          <View  style={styles.input}>
            <TextInput
              multiline = {true}
              style = {{  fontSize: 19,width:'100%'}}                
              underlineColorAndroid='transparent'      
              placeholder="Describe the link"
              value = {this.state.caption}
              onChangeText={(text) => {
                _this.setState({caption: text})          
              }}
              onSubmitEditing={() =>  Keyboard.dismiss()}                   
              
              />
          </View>
          
         
          <View style={{height: 1,width: "100%",backgroundColor: "#DDDDDD",}}/>

          <ClqsixTextInput
            multiline = {true}
            textStyle = {styles.inputTxt}    
            style={styles.input}
            suffixIcon={false}
            prefixIcon={Images.LinkIcon_30x30}    
            placeholder="Type or paste a link here."
            value = {this.state.urlText}
            onSubmitEditing={() =>  Keyboard.dismiss()}                   
            
            onChangeText={(text) => {
              _this.setState({urlText: text})          
            }}
            />
        </View>
        <View style={{width: '100%', height:50, flexDirection: 'row', backgroundColor: '#D9D10E', paddingHorizontal: 20,}}>
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
    if(this.state.urlText == ""){
      alert("Please entry post link");
      return;
    }
    let _this = this;
    this.setState({showActivityIndicator: true})
    LinkPreview.getPreview(this.state.urlText)
    .then(
      data => {
          //console.log(data)
          let thumbnail = null;
          let description = !!data.description ? data.description : !!data.title? data.title:'';
          if(data.images.length > 0){
            if(data.mediaType == "website" && data.images.length > 1){
              thumbnail = data.images[1];
            }             
            else{
              thumbnail = data.images[0];
            }
          }

          let post = {
            type: 'link',
            url: data.url,
            description: description,
            caption: _this.state.caption || '',
            thumbnail:thumbnail,
            cliqueID: _this.props.currentClique.lastCliqueId
          }
          _this.setState({showActivityIndicator: false})
          _this.postVisual(post);
      }

    ).catch(error => {
      _this.setState({showActivityIndicator: false})
      alert("Please enter correct URL or make sure \'https://www.\' is in the link")
      //console.log("Error:  " + JSON.stringify(error))
    });

  
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
export default connect(mapStateToProps,{postVisual,clickProfile})(LinkUpload)


