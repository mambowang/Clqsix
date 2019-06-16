'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux'

import {
    StyleSheet,
    Text,
    View,    
    TouchableOpacity,
    Image,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Modal,
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
  Alert,
  PhotoCamera,
  VideoCamera,

  ModalActivityIndicator
} from '../../components';
import { NavigationActions } from 'react-navigation';
import {VisualModel,CliqueModel,UserModel} from '../../models';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
class Upload extends Component {
  navigator = null;
  constructor(props) {
    super(props);
    this.state={
      modal: null,
      showActivityIndicator: false,
      videoData: null
      
    };
   
  } 
  

  _onUploadText() {   
    this.props.navigation && this.props.navigation.navigate('TextUpload'); 
  }

  _onUploadImage() {  
    this.setState({
      modal: 'PhotoCamera',
    })
  }
  _onUploadLibrary() {    
    
  }
  _onUploadVideo() {    
    this.setState({
      modal: 'VideoCamera',
    })
  }
  _onUploadLink(){
    this.props.navigation && this.props.navigation.navigate('LinkUpload'); 
    
  }
  _onUploadGIF(){
    
  }
  _onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    return (
      // <Modal   transparent={true}>
        <FullScreen style={styles.container}>
          <CustomNavigator style={styles.navigator} 
          leftButton = {<Image style= {{width:13,height:13,opacity:1}} source={Images.Cancel_650x650}/>} 
          onLeftButtonPress={() => this._onClose()} />
          <View style={{flex: 1, width: '100%', justifyContent:'center'}}>
            <FullScreen.Row style={{paddingHorizontal: 82, flexDirection:'row'}}>
              <View style={{flex: 1, alignItems: 'flex-start'}}>
                <View style={{alignItems:'center'}}>
                  <TouchableOpacity onPress={() => this._onUploadImage()}>
                    <Image source={Images.Photo_Icon_1050x1050} style = {{width:70,height:70}}/>
                  </TouchableOpacity>
                  <Text style={{marginTop:8, fontWeight:'bold'}}>Photo</Text>
                </View>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <View style={{alignItems:'center'}}>
                  <TouchableOpacity onPress={() => this._onUploadVideo()}>
                    <Image source={Images.Video_Icon_1170x1170} style = {{width:78,height:78}}/>
                  </TouchableOpacity>
                  <Text style={{marginTop:8, fontWeight:'bold'}}>Video</Text>
                </View>
              </View>
          
            </FullScreen.Row>

            <FullScreen.Row style={{marginTop:2, paddingLeft:50, paddingRight:36, flexDirection:'row'}}>
              {/* <View style={{flex: 1, alignItems: 'flex-start'}}>
                <View style={{alignItems:'center'}}>
                  <TouchableOpacity onPress={() => this._onUploadLink()}>
                    <Image source={Images.UploadLink} />
                  </TouchableOpacity>
                  <Text style={{marginTop:8}}>Link</Text>
                </View>
              </View> */}
              {/* <View style={{flex: 1, alignItems: 'center'}}>
                <TouchableOpacity onPress={() => this._onUploadLibrary()}>
                  <Image source={Images.UploadLibrary} />
                </TouchableOpacity>
                <Text style={{marginTop:8}}>Library</Text>
              </View> */}
              <View style={{flex: 1, alignItems: 'center'}}>
                <View style={{alignItems:'center'}}>
                  <TouchableOpacity onPress={() => this._onUploadText()}>
                    <Image source={Images.Text_Icon_1845x1845} style = {{width: 123, height: 99}} />
                  </TouchableOpacity>
                  <Text style={{marginTop:8, fontWeight:'bold'}}>Text</Text>
                </View>
              </View>
            </FullScreen.Row>
            {/* <FullScreen.Row style={{marginTop:26}}>
              <TouchableOpacity onPress={() => this._onUploadGIF()}>
                <Image source={Images.Mood_Icon_3705x825} style = {{width: 247, height: 55}} />
              </TouchableOpacity>            
            </FullScreen.Row> */}
            <FullScreen.Row style={{marginTop:26}}>
              <TouchableOpacity onPress={() => this._onUploadLink()}>
                <Image source={Images.Link_2470x550} style = {{width: 247, height: 55}} />
              </TouchableOpacity>            
            </FullScreen.Row>
          </View>
          <Text style={{marginBottom: 23, fontFamily:'SF UI Text', fontSize: 17, fontWeight:'bold', 
          textAlign:'center', color:'#a3a3a3'}}>Post to CLQSIX</Text>
        
          {this.state.modal && <FullScreen style={{backgroundColor:'#000'}} />}
          <PhotoCamera 
            visible = {this.state.modal === 'PhotoCamera'}      
            onCaptured={(photo) => this._onTakenPhoto(photo)} 
            onRequestClose={() => this.setState({modal:null})}/>
            
          <VideoCamera 
            visible = {this.state.modal === 'VideoCamera'} 
            captureAudio = {true}
            onCaptured={(video) => this._onTakenVideo(video)} 
            onRequestClose={() => this.setState({modal:null})}/>
       
          <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />
          {/* <Text>{this.state.videoData} : videoData</Text> */}
        </FullScreen>
        // </Modal>
    );
  }
  _onTakenPhoto(photo) {
    this.imageSource = photo;
    Image.getSize(this.imageSource, (width, height) => {      
      let changeWidth,changeHeight;

      if(width <= height){
        changeHeight = window.height;
        changeWidth = width *(window.height/height)
      }else{
        changeWidth =  window.width
        changeHeight = height *(window.width/width)
      }
      this.setState(
        {  
          modal: null,
        },
        () => {  
          !!this.props.navigation && this.props.navigation.navigate('ImageUpload',
          {imageSource: this.imageSource,imageSize: {width: changeWidth, height: changeHeight}});   
        
        }
      );
     
    }, (error) => {
      console.error(`Couldn't get the image size: ${error.message}`);
    });  

  }
  _onTakenVideo(video) {  
    this.videoSource = video;    
    this.setState({ modal: null,},
      () => {   
            !!this.props.navigation && this.props.navigation.navigate('VideoUpload',
            {videoSource: this.videoSource}); 
      }
    );
  }

  
};

const styles = StyleSheet.create({
  container: {
    justifyContent : 'center',
    backgroundColor: '#fff'
    //justifyContent: 'flex-end',
    //flex: 1,
  },
  navigator: {
    marginBottom: 0,
  }
});
function mapStateToProps(state) {
  return {
    currentClique: state.currentClique
  }
}

export default connect(mapStateToProps)(Upload)
