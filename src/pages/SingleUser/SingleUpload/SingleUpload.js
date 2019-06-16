'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    
    TouchableOpacity,
    Image,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    
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
} from '../../../components';


class SingleUpload extends Component {
  navigator = null;
  constructor(props) {
    super(props);
    this.state={
      modal: null
    };
  } 
  _onUploadText() {   
    this.textAlert.show()
  }
  
  _onUploadLink() {    
    this.linkAlert.show()
  }
  _onUploadImage() {  
    this.photoAlert.show()
  }
  _onUploadLibrary() {    
    this.libraryAlert.show()
  }
  _onUploadVideo() {    
    this.videoAlert.show()
  }
  _onUploadGIF(){
    this.gifAlert.show()
  }
  _onClose() {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }
  render() {
    return (
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
          <FullScreen.Row style={{marginTop:26}}>
              <TouchableOpacity onPress={() => this._onUploadLink()}>
                <Image source={Images.Link_2470x550} style = {{width: 247, height: 55}} />
              </TouchableOpacity>            
            </FullScreen.Row>
        </View>
        <Text style={{marginBottom: 23, fontFamily:'SF UI Text', fontSize: 17, fontWeight:'bold', textAlign:'center', color:'#a3a3a3'}}>Post to CLQSIX</Text>
      
        <Alert ref={(c) => this.photoAlert = c}
          style={{backgroundColor:'#0095F7'}} 
          text={['You have to be in a clique', 'to post a Photo.']}
          onRequestClose={() => this.photoAlert.hide()}/>

        <Alert ref={(c) => this.videoAlert = c}
          style={{backgroundColor:'#EF4244'}} 
          text={['You have to be in a clique', 'to post a Video.']}
          onRequestClose={() => this.photoAlert.hide()}/>

        <Alert ref={(c) => this.linkAlert = c}
          style={{backgroundColor:'#D9D10E'}} 
          text={['You have to be in a clique', 'to post a Link.']}
          onRequestClose={() => this.linkAlert.hide()}/>

        <Alert ref={(c) => this.textAlert = c}
          style={{backgroundColor:'#24D770'}} 
          text={['You have to be in a clique', 'to post a Text.']}
          onRequestClose={() => this.textAlert.hide()}/>

        <Alert ref={(c) => this.libraryAlert = c}
          style={{backgroundColor:'#24D770'}} 
          text={['You have to be in a clique', 'to post a Library.']}
          onRequestClose={() => this.libraryAlert.hide()}/>

        <Alert ref={(c) => this.gifAlert = c}
          style={{backgroundColor:'#D9D10E'}} 
          text={['You have to be in a clique', 'to post a GIF.']}
          onRequestClose={() => this.gifAlert.hide()}/>  
      
      </FullScreen>
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

export default SingleUpload;