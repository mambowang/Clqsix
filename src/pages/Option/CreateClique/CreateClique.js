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
} from 'react-native';
import { connect } from 'react-redux'
import { createClique } from '../../../actions/cliqueActions'
import { changeType ,followingClique} from '../../../actions/userActions'
import { clickProfile } from '../../../actions/statusActions'

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
  KeyboardSpacer,
  ModalActivityIndicator
} from '../../../components';
import firebase from 'firebase';
import {VisualModel,CliqueModel,UserModel} from '../../../models';

import {
  AuthAPI,FirebaseStorageAPI,ImageProcAPI
} from '../../../utils'
import { NavigationActions } from 'react-navigation';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
import ImageResizer from 'react-native-image-resizer';
import * as globals from '../../../common/Global';

const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;

class CreateClique extends Component {
  keyboardShowListener = null;
  keyboardHideListener = null;
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      cliqueData :{
        avatarImage : null,
        cliqueName: null,
        locationData : null,
        categoryData: null,
        inviteQueue : params.inviteQueue,
       
      },      

      createCliqueId: null,
      showActivityIndicator: false
      
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
  componentDidMount(){
    // this.setState((prevState, props) => {
    //   return { 
    //     locationFocus: 0,
        
    //     }
    // });
  }
  scrollToRef(component) {
    this.content.scrollToRef(component);
  }
  changeAvatar(source) {  
    this.setState({
      ...this.state,
      cliqueData:{
        ...this.state.cliqueData,
        avatarImage: source
      }     
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
    let category = this.state.cliqueData.categoryData;
    let avatar = this.state.cliqueData.avatarImage;
    if(name == null || name == "" 
      || location == null || location == "" 
      || category == null || category == "" 
      || avatar == null){
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
    {onSetCategory: this.onSetCategory,categoryValue:this.state.cliqueData.categoryData});  
    
  }
  render() {
    let avatarImage = this.state.cliqueData.avatarImage || Images.CliqueAvatar_Gray_180x180;
    let editAvatar = !this.state.cliqueData.avatarImage ? 'Add' : 'Edit';      
   
    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
      <StatusBar hidden={false} />
        <CustomNavigator
          leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
          rightButton = {<Text style={{fontFamily: 'SF UI Text', fontSize: 18, color: 
          '#0F7EF4', fontWeight: '600'}}>Done</Text>}
          onLeftButtonPress = {() =>this.goBack() }  
          onRightButtonPress  = {() =>  this.createCliqueAction()}
        >
          <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:28, fontWeight:'bold'}}>
           Add Clique Info
          </Text>
        </CustomNavigator>
        <Content      
          ref={ref=>this.content=ref} 
          scrollable={true} 
          scrollEnabled={true}>
        <FullScreen.Row style={{marginLeft:52, marginRight:15, marginBottom: 30, marginTop:30, alignItems:'flex-start'}}>
          <Image style={{width:180, height:180, marginBottom: 15}} source={avatarImage} />
          <TouchableOpacity style={{position:'absolute', bottom: 0, left:136}} onPress={() => this.imageChooser.show()}>
            <View style={{width: 162, height: 35, alignItems: 'center', 
              justifyContent: 'center', 
              borderWidth:1, borderColor:'#cccccc', 
              backgroundColor:'white'}}>
              <Text style={{fontFamily: 'SF UI Text', fontSize: 13, 
                 fontWeight: '600'}}>{editAvatar} clique photo</Text>              
            </View>
                
          </TouchableOpacity>
        </FullScreen.Row>
          <ClqsixTextInput ref={ref=>this.name=ref} 
              prefixIcon={Images.Cliqsix_14x14}        
              placeholder='Clique name (ex. @rockstars)'
              placeholderTextColor = {"#acacac"}                  
              
              style={styles.formTextContent}
              onChangeText={(cliqueName) => 
                this.setState({...this.state,cliqueData:{...this.state.cliqueData,cliqueName: cliqueName} })}
              value={this.state.cliqueData.cliqueName}
              onFocus={() => this.scrollToRef(this.name)}
              onBlur = {() =>  Keyboard.dismiss()}           
              suffixIcon = {false}
              onSubmitEditing={() =>  Keyboard.dismiss()} 
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
              onFocus ={this.goLocationScreen.bind(this)} 
              placeholder='Location'
              fixIcon = {Images.BackChevron_Gray_16x9}
              style={styles.formTextContent}
                   
            />
            
          </Content>   
          <KeyboardSpacer/>
        <Options.ImageChooser  ref={ref=>this.imageChooser=ref}  
          onImageSelected={(source) => this.changeAvatar(source)} /> 
        <Alert ref={ref=>this.errorAlert=ref} 
          style={{backgroundColor:'#EF4244'}} 
          text={['Enter in all clique info.']}
          onRequestClose={() => this.errorAlert.hide()}/>
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

        <Alert  ref={ref=>this.successAlert=ref} 
          style={{backgroundColor:'#9E4FFF'}} 
          title = {"Clique Created!"}
          text={['Tell your friends to accept the invitation so it can be official.']}
          closeButtonSource = {Images.check_17x13}
          onRequestClose={() => this.goProfile()}/>
      </FullScreen>
    );
  }
    ////////////////////////////////////////////////////////////////////
  goProfile(){
    this.successAlert.hide();
    let currentUser = this.props.currentUser;
    if(currentUser.type == "single"){
      this.props.changeType("clique");   
      
      // if (this.props.goClique) {   //screenpos
      //    this.props.goClique();
      // }
      this.props.clickProfile();
      
    }else{
      const resetAction = NavigationActions.reset({
        index: 0,
        key:null,
        actions: [
          NavigationActions.navigate({ routeName: 'CliqueOption'})
        ]
      });
      this.props.navigation.dispatch(resetAction);    
      // if (this.props.goClique) {//screenpos
      //  this.props.goClique();
      // }
      this.props.clickProfile();
      
    }
    
  }


  createCliqueNew(){  
    let cliqueData ={data:{
                        avatar: this.state.cliqueData.avatarImage,
                        location: this.state.cliqueData.locationData,
                        category: this.state.cliqueData.categoryData,
                        name:this.state.cliqueData.cliqueName,
                        description:"",
                        folloer_users:null,
                      },
                      inviteFreinds: this.state.cliqueData.inviteQueue                    

    }; 
  
    let fnPush = () => {
      CliqueModel.push(
        {
          ...cliqueData,          
        }
      ,cliqueId => {
        this.setState({
          showActivityIndicator: false
        }); 
        this.props.createClique(cliqueId);            
        this.successAlert.show();
      })
    };
    
    if (!!cliqueData.data.avatar) {
            this.uploadCliquePhoto(cliqueData.data.avatar.uri);
     
    } else {
      fnPush();
    }
    
  }
  uploadCliquePhoto(imageUrl){
    ImageProcAPI.getChangedImageSize(imageUrl)
    .then((size) =>{
      ImageProcAPI.uploadFullSize(imageUrl,size)
      .then(urls =>{
        console.log(JSON.stringify(urls));
        
      })
      .catch(error =>{
        this.setState({
          showActivityIndicator: false
        });     
      })
      
    })
    .catch(error =>{
      this.setState({
        showActivityIndicator: false
      });  
      console.log(error)
      
    })


  }
  uploadCliqueData(cliqueData){
    CliqueModel.push(
      {
        ...cliqueData,          
      }
    ,cliqueId => {
      this.setState({
        showActivityIndicator: false
      }); 
      this.props.createClique(cliqueId);            
      this.successAlert.show();
    })
  }
  createClique(){  
    let cliqueData ={data:{
                        avatar: this.state.cliqueData.avatarImage,
                        location: this.state.cliqueData.locationData,
                        category: this.state.cliqueData.categoryData,                        
                        name:this.state.cliqueData.cliqueName,
                        description:"",
                        folloer_users:null,
                      },
                      inviteFreinds: this.state.cliqueData.inviteQueue                    

    };     
    let _this = this;
    this.setState({
      showActivityIndicator: true
    });    
      ImageResizer.createResizedImage(cliqueData.data.avatar.uri, window.width, window.height, 'JPEG', 80)
      .then(({uri}) => {
        FirebaseStorageAPI.uploadImageOnFirebase(uri)
        .then(downloadUrl => {
          cliqueData.data.avatar = {uri : downloadUrl};
          _this.uploadCliqueData(cliqueData);
        })
        .catch(error => {
          this.setState({
            showActivityIndicator: false
          });
        });
      }).catch((err) => {
        this.setState({
          showActivityIndicator: false
        });    
      });
     
    
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

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps,{createClique,changeType,clickProfile})(CreateClique)


