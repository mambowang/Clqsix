'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux'
import _ from 'lodash';
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
    TextInput,
    Keyboard
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
  Content,
  Alert,
  ModalActivityIndicator,
  KeyboardSpacer
} from '../../../components';
import { changeUserData } from '../../../actions/userActions'

import {
  AuthAPI
} from '../../../utils'
import firebase from 'firebase';
import {VisualModel,CliqueModel,UserModel} from '../../../models';
import {
  FirebaseStorageAPI
} from '../../../utils'
import { NavigationActions } from 'react-navigation';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
import * as globals from '../../../common/Global';
import ImageResizer from 'react-native-image-resizer';
import {  CachedImage } from 'react-native-cached-image';

const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;
class EditSingleProfile extends Component {
    keyboardShowListener = null;
    keyboardHideListener = null;

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    
    this.state = {
      thumbnailContactSource: Images.MemberPhoto_2600x2600, 
      memberData :params.memberData,      
      showActivityIndicator: false,
      locationFocus : false,
      thumbnailSource:globals.thumbnailSource,     
      changeAvatar: false,
      originalmemberData: params.memberData,    
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
  scrollToRef(component) {
    this.content.scrollToRef(component);
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack()
  }
  changeAvatar(source) {  
    this.setState({
      ...this.state,      
      memberData:{
        ...this.state.memberData,
        avatarImage: source
      },
      changeAvatar: true,    
    });   
  }
  editUserAction(){
    Keyboard.dismiss();   
    
    let originalData = this.state.originalmemberData;
    let changedData = this.state.memberData;
    if(!this.state.changeAvatar 
      && originalData.name == changedData.name 
      && originalData.description == changedData.description 
    ){
      return;
    }
    let memberData ={data:{                     
                        name:changedData.name,
                        description:changedData.description,
                      },
                    uid: changedData.uid
    }; 


    let fnPush = () => {
      UserModel.edit(
        {
          ...memberData,          
        }
      ,res => {
        this.setState({
          showActivityIndicator: false
        }); 
        if(res == "0"){
         // this.successAlert.show();
         if (!! this.state.changeAvatar){
            this.props.changeUserData({name:  memberData.data.name,
                photoURL: memberData.data.photoURL,
                description: memberData.data.description});
         }else{
            this.props.changeUserData({name:  memberData.data.name,    
                photoURL: originalData.avatarImage,            
                description: memberData.data.description});
         }
       
        
         this.goBack();
        }
       
      })
    };
    this.setState({
      showActivityIndicator: true
    });
    if (!! this.state.changeAvatar) {
      ImageResizer.createResizedImage(changedData.avatarImage.uri, window.width, window.height, 'JPEG', 80)
      .then(({uri}) => {
        FirebaseStorageAPI.uploadImageOnFirebase(uri)
        .then(downloadUrl => {
            memberData.data.photoURL = downloadUrl;
          fnPush();
        })
        .catch(error => {
          this.setState({
            showActivityIndicator: false
          });      
        
        });

      }).catch((err) => {
        //console.log(err);       
      });
    } else {
      fnPush();
    } 
  }
  render() {
    let memberData = this.state.memberData;
    let avatarImage = this.state.memberData.avatarImage || this.state.thumbnailContactSource;
    let editAvatar = !this.state.memberData.avatarImage ? 'Add' : 'Edit';        
    
    return (
        <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
          <CustomNavigator
            leftButton={<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}
            rightButton = {<Image source={Images.Check_Black_17x13}/>}
            onLeftButtonPress = {() =>this.goBack() }  
            onRightButtonPress  = {() =>  {this.editUserAction()}}
          >
            <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:28, fontWeight:'bold'}}>
            Edit Your Info
            </Text>
          </CustomNavigator>
          <Content      
          ref={ref=>this.content=ref} 
          scrollable={true} 
          scrollEnabled={false}>
        <FullScreen.Row style={{marginLeft:52, marginRight:15, marginBottom: 30, marginTop:30, alignItems:'flex-start'}}>
         {!! this.state.changeAvatar ?
          <Image style={{width:220, height:220, marginBottom: 10}} 
            source={avatarImage} />
          :
          <CachedImage
                source={{uri: avatarImage}}
                defaultSource =  {this.state.thumbnailContactSource}
                fallbackSource = {this.state.thumbnailContactSource}              
                style={{width:220, height:220, marginBottom: 10}}
          />     
         }        

          <TouchableOpacity style={{position:'absolute', bottom: 0, left:136}} 
          onPress={() => this.imageChooser.show()}>
            <View style={{width: 180, height: 40, alignItems: 'center', 
              justifyContent: 'center', 
              borderWidth:1, borderColor:'#cccccc', 
              backgroundColor:'white'}}>
              <Text style={{fontFamily: 'SF UI Text', fontSize: 15, 
                 fontWeight: '600'}}>{editAvatar}  photo</Text>              
            </View>
                
          </TouchableOpacity>
        </FullScreen.Row>
               
        <ClqsixTextInput ref={ref=>this.name=ref} 
          prefixIcon={Images.member_name_15x15}        
          placeholder='First name'
          placeholderTextColor = {"#acacac"}                  
          autoCapitalize="words"
          style={styles.formTextContent}
          onChangeText={(name) => this.setState({...this.state,memberData:{...this.state.memberData,name: name} })}
          value={this.state.memberData.name}
          onFocus={() => this.scrollToRef(this.name)}
          suffixIcon = {false}
          onSubmitEditing={() =>  Keyboard.dismiss()} 
          />        
        <ClqsixTextInput 
          ref={ref=>this.description=ref} 
          prefixIcon={Images.member_desc_14x14}        
          placeholder='Bio'
          placeholderTextColor = {"#acacac"}                  
          autoCorrect = {true}
          style={styles.formTextContent}
          onChangeText={(description) => this.setState({...this.state,memberData:{...this.state.memberData,description: description} })}
          value={this.state.memberData.description}
          onFocus={() => this.scrollToRef(this.description)}
          suffixIcon = {false}
          onSubmitEditing={() =>  Keyboard.dismiss()} 
          /> 
          </Content>   
          <Options.ImageChooser  ref={ref=>this.imageChooser=ref}  
        onImageSelected={(source) => this.changeAvatar(source)} /> 
                   <KeyboardSpacer/>

        <ModalActivityIndicator visible={this.state.showActivityIndicator} 
        modal={false} />

      </FullScreen>
    );
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
export default connect(null,{changeUserData})(EditSingleProfile)