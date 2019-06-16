'use strict';

import React, { Component } from 'react';
import {
  Keyboard,
    StyleSheet,
    View,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    ScrollView,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    StatusBar,
    Modal,
    KeyboardAvoidingView 
} from 'react-native';

import {
  Button,
  ClqsixTextInput,
  ClqsixText,
  Text,
  CustomNavigator,
  FullScreen,
  ScrollViewWrapper,
  Options,
  Images,
  Content,
  Alert,
  ModalActivityIndicator,
 // KeyboardSpacer,
  
} from '../../components';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import firebase from 'firebase';
import {VisualModel,CliqueModel,UserModel} from '../../models';
import {
  AuthAPI,FirebaseStorageAPI
} from '../../utils'
import { NavigationActions } from 'react-navigation';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
import * as globals from '../../common/Global';

import ImageResizer from 'react-native-image-resizer';
import {  CachedImage } from 'react-native-cached-image';

const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;

class EditClique extends Component {
  keyboardShowListener = null;
  keyboardHideListener = null;
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      cliqueData :params.cliqueData,      
      showActivityIndicator: false,
      thumbnailSource:globals.thumbnailSource,     
      changeAvatar: false,
      originalCliqueData: params.cliqueData,     
    }
   
  }
 
  changeAvatar(source) {  
    this.setState({
      ...this.state,      
      cliqueData:{
        ...this.state.cliqueData,
        avatarImage: source
      },
      changeAvatar: true,    
    });   
  }

  onSetLocation = data =>{
    this.setState({ 
      ...this.state,     
      cliqueData :{
        ...this.state.cliqueData,
        locationData: data.locationValue,
      },      
    });
  }  
  onSetCategory = data => {
    this.setState({  
      ...this.state, 
            cliqueData :{
              ...this.state.cliqueData,
              categoryData: data.categoryValue,
            },
        });
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack()
  }
  createCliqueAction =() =>{
    let name = this.state.cliqueData.cliqueName;
    let location = this.state.cliqueData.locationData;
    let avatar = this.state.cliqueData.avatarImage;
    if(name == null || name == "" || location == null || location == "" || avatar == null){
      this.errorAlert.show();
      return;
    }else{
      Keyboard.dismiss();    
      this.createClique();    
    } 
  } 
  goLocationScreen(){
    this.name.focus();
    this.location.blur();
    Keyboard.dismiss();    
    !!this.props.navigation && this.props.navigation.navigate('LocationScreen',
    {onSetLocation: this.onSetLocation});   
    
    
  }
  goCategoryScreen(){
    this.name.focus();
    this.category.blur();   
    Keyboard.dismiss();
    !!this.props.navigation && this.props.navigation.navigate('CategoryScreen',
    {
      onSetCategory: this.onSetCategory,
      categoryValue:this.state.cliqueData.categoryData
    });  
  }

  render() {
    let avatarImage = this.state.cliqueData.avatarImage || Images.CliqueAvatar_Gray_180x180;
    let editAvatar = !this.state.cliqueData.avatarImage ? 'Add' : 'Edit';        
    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
      <StatusBar hidden={false} />
        <CustomNavigator
          leftButton={<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}
          rightButton = {<Text style={{fontFamily: 'SF UI Text', fontSize: 18, color: 
          '#0F7EF4', fontWeight: '600'}}>Done</Text>}
          onLeftButtonPress = {() =>this.goBack() }  
          onRightButtonPress  = {() =>  this.createCliqueAction()}
        >
          <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:28, fontWeight:'bold'}}>Edit Page</Text>
        </CustomNavigator>
        <KeyboardAwareScrollView
          style={{width:'100%'}}
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={{flex:1}}
          scrollEnabled={false}
        >
        <View  style={{marginLeft:52, marginRight:15, marginTop:10, alignItems:'flex-start'}}>
         {!! this.state.changeAvatar ?
          <Image style={{width:180, height:180, marginBottom: 15}} source={avatarImage} />
          :
          <CachedImage
                source={avatarImage}
                defaultSource =  {{ uri:this.state.thumbnailSource}}
                fallbackSource = {{ uri:this.state.thumbnailSource}}                
                style={{width:180, height:180, marginBottom: 15}}
          />     
         }        

          <TouchableOpacity style={{position:'absolute', bottom: 0, left:136}} 
          onPress={() => this.imageChooser.show()}>
            <View style={{width: 162, height: 35, alignItems: 'center', 
              justifyContent: 'center', 
              borderWidth:1, borderColor:'#cccccc', 
              backgroundColor:'white'}}>
              <Text style={{fontFamily: 'SF UI Text', fontSize: 13, 
              color:!!this.state.cliqueData.avatarImage ?'#bbbbbb':'#000000',
                 fontWeight: '600'}}>{editAvatar} clique photo</Text>              
            </View>
                
          </TouchableOpacity>
        </View>
        <ClqsixTextInput ref={ref=>this.name=ref} 
          prefixIcon={Images.Cliqsix_14x14}        
          placeholder='Clique name (ex. @rockstars)'
          placeholderTextColor = {"#acacac"}                  
          
          style={styles.formTextContent}
          onChangeText={(cliqueName) => this.setState({...this.state,cliqueData:{...this.state.cliqueData,cliqueName: cliqueName} })}
          value={this.state.cliqueData.cliqueName}
          suffixIcon = {false}
          />       
           <ClqsixTextInput         
              ref={ref=>this.category=ref} 
              value = {this.state.cliqueData.categoryData}
              prefixIcon={Images.Category_12x15}    
              placeholderTextColor = {"#acacac"}                  
              onFocus ={this.goCategoryScreen.bind(this)} 
              placeholder={'Category'}
              fixIcon = {Images.BackChevron_Gray_16x9}
              style={styles.formTextContent}
                   
            />   
        <ClqsixTextInput         
          ref={ref=>this.location=ref} 
          value = {this.state.cliqueData.locationData}
          prefixIcon={Images.Location_Green_10x16}    
          placeholderTextColor = {"#acacac"}                 
          placeholder='Location'
          suffixIcon = {false}
          style={styles.formTextContent}
          onFocus ={this.goLocationScreen.bind(this)}        
          />
          <ClqsixTextInput ref={ref=>this.description=ref} 
          prefixIcon={Images.desc_14x14}        
          placeholder='Clique description'
          placeholderTextColor = {"#acacac"}    
          autoCorrect = {true}              
          style={styles.formTextContent}
          onChangeText={(description) => this.setState({...this.state,cliqueData:{...this.state.cliqueData,description: description} })}
          value={this.state.cliqueData.description}
          suffixIcon = {false}
          /> 
          </KeyboardAwareScrollView>   
        <Options.ImageChooser  ref={ref=>this.imageChooser=ref}  
        onImageSelected={(source) => this.changeAvatar(source)} /> 
        <Alert ref={ref=>this.errorAlert=ref} 
          style={{backgroundColor:'#EF4244'}} 
          text={['Enter in all clique info.']}
          onRequestClose={() => this.errorAlert.hide()}/>
           {/* <KeyboardSpacer/> */}
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

        {/* <Alert  ref={ref=>this.successAlert=ref} 
          style={{backgroundColor:'#9E4FFF'}} 
          title = {"Clique Created!"}
          text={['Your friends have 30 hours', 'to accept the invitation.']}
          closeButtonSource = {Images.check_17x13}
          onRequestClose={() => this.goProfile()}/> */}
      </FullScreen>
    );
  }
    ////////////////////////////////////////////////////////////////////
  goProfile(){
  //  this.successAlert.hide();    
    this.goBack();
  }
  uploadCliqueData(cliqueData){
    CliqueModel.edit(
      {
        ...cliqueData,          
      }
    ,res => {
      this.setState({
        showActivityIndicator: false
      }); 
      if(res == "0"){
       // this.successAlert.show();
       this.goBack();
      }
     
    })
  }
  createClique(){    

    let originalData = this.state.originalCliqueData;
    let changedData = this.state.cliqueData;
    //
    if(!this.state.changeAvatar 
      && originalData.cliqueName == changedData.cliqueName 
      && originalData.locationData == changedData.locationData 
      && originalData.description == changedData.description 
      && originalData.categoryData == changedData.categoryData
    ){
      return;
    }


    let cliqueData ={data:{
                        avatar: this.state.cliqueData.avatarImage,
                        location: this.state.cliqueData.locationData,
                        category :this.state.cliqueData.categoryData,
                        name:this.state.cliqueData.cliqueName,
                        description:this.state.cliqueData.description,
                      },
                      cliqueId: this.state.cliqueData.cliqueId
    };     
    this.setState({
      showActivityIndicator: true
    });
    if (!! this.state.changeAvatar) {
      ImageResizer.createResizedImage(cliqueData.data.avatar.uri, window.width, window.height, 'JPEG', 80)
      .then(({uri}) => {
        FirebaseStorageAPI.uploadImageOnFirebase(uri)
        .then(downloadUrl => {
          cliqueData.data.avatar = {uri : downloadUrl};
          this.uploadCliqueData(cliqueData);
        })
        .catch(error => {this.setState({showActivityIndicator: false});});
      })
      .catch(error => {this.setState({showActivityIndicator: false});});
    } else {
      this.uploadCliqueData(cliqueData);
    }
    
  }
};

const styles = StyleSheet.create({
  pageContainer: {
    height:175,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 25,
  },

  page: {
    alignItems:'center',
    justifyContent:'center'
  },
  formTextContent:{
    height:70, 
    marginHorizontal:30, 
    borderBottomWidth: 1,
    borderColor:'#e8e8e8',
  },
  pageText: {
    fontFamily:'SF UI Text',
    fontWeight:'900',
    fontSize:17,
    color:'white'
  }
});
export default EditClique


