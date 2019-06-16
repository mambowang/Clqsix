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
  ScrollView,
  Images,
  ModalActivityIndicator
} from '../../components';
import {
  FirebaseStorageAPI,
} from '../../utils';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {VisualModel,CliqueModel,UserModel} from '../../models';
import { clickProfile } from '../../actions/statusActions'
import { postVisual } from '../../actions/cliqueActions'

import RNThumbnail from 'react-native-thumbnail';
import VideoPlayer from 'react-native-video-player';
import RNCompress from 'react-native-compress';
import ImageResizer from 'react-native-image-resizer';

let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const RATIO = 0.4;

class VideoUpload extends Component {

  caption = '';
  savedVideo = null;
  
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {       
        videoSource: params.videoSource,
        thumbnailSource: null,  
        size: {},   
        showActivityIndicator: false ,
      
      }    
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
  shouldComponentUpdate(nextProps, nextState){
    if(nextState.thumbnailSource == null) return false;
    return true;
  }  
  componentDidMount(){    
    RNCompress.compressVideo(this.state.videoSource.uri, 'medium').then((result) => {
    this.setState({videoSource: {uri: result.path}},() =>{
          RNThumbnail.get(this.state.videoSource.uri).then((result) => {
            let changeWidth,changeHeight;
            
            if(result.width <= result.height){
              changeHeight = window.height;
              changeWidth = result.width *(window.height/result.height)
            }else{
              changeWidth =  window.width
              changeHeight = result.height *(window.width/result.width)
            }
          this.setState({thumbnailSource : result.path,size: {width: changeWidth,height: changeHeight}});
        })
      });
    });

  }
  render() {
    return (
      <FullScreen style={styles.container}>
        <ScrollView
          ref="scrollView"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          scrollEnabledOnKeyboard={true}
          style={{flex: 1, width: '100%',}} 
          contentContainerStyle={{alignItems: 'center',marginHorizontal:15, }}>
          <View style = {styles.postImagContent}>
     
            <View style = {[styles.image,{width: this.state.size.width * RATIO,height: this.state.size.height * RATIO}]}>
              {!! this.state.thumbnailSource && 
              <VideoPlayer
                    endWithThumbnail     
                    autoplay = {false}          
                    thumbnail={{ uri: this.state.thumbnailSource.uri}}
                    video={{ uri: this.state.videoSource.uri }}
                    videoWidth={ this.state.size.width * RATIO}
                    videoHeight={ this.state.size.height * RATIO}
                    disableFullscreen= {true}
              />
              }
            </View> 
          </View>
          <View style={{height: 1,width: "100%",backgroundColor: "#DDDDDD",}}/>

          <TextInput ref="name"
            style={{ marginHorizontal:40, height: 50,fontSize: 19, marginVertical: 30,borderBottomWidth: 0,width: '100%'}}
            needValidation={false}
            multiline = {true}
            placeholder="Write a caption..."
            onChangeText={(text) => this.caption = text}
            onFocus={() => this.refs.scrollView.scrollToRef(this.refs.name)}
            onSubmitEditing={() =>  Keyboard.dismiss()}                   
            
            />
        </ScrollView>
       
        <View style={{width: '100%', height:50, flexDirection: 'row', backgroundColor: '#EF4244'}}>
          <TouchableOpacity style={{flex: 1, alignItems:'flex-start', justifyContent:'center'}} 
          onPress={() => this.goBack()}>
            <View  style={{paddingHorizontal: 10,}} >            
                <Image source={Images.BackChevronLeft_White_9x16} />           
            </View>
          </TouchableOpacity>
          <TouchableOpacity  style={{flex: 1, alignItems:'flex-end', justifyContent: 'center'}} 
          onPress={() => this._onPost()}>
            <View  style={{paddingHorizontal: 10,}}>          
                <Text style={{color:'#fff', fontFamily: 'SF UI Text', fontSize: 15, fontWeight:'bold'}}>Post</Text>          
            </View>
          </TouchableOpacity>
        </View>
        <KeyboardSpacer/>
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

      </FullScreen>
    );
  }
  goBack() {
    const { navigation } = this.props;    
    navigation.goBack();       
  }

  postVisual(visual) {
   
    let _this = this;
    VisualModel.push(visual,(visualKey) => {
      _this.setState({
        showActivityIndicator: false
      });
      _this.props.postVisual(visualKey);     
     
    });
    
  }
  _onPost() {
    if (!this.state.thumbnailSource) return;
    this.setState({
      showActivityIndicator: true
    });

    var uploadVideoOnFirebase = () =>{
      let _this = this;
      return new Promise(function(resolve, reject) {
        //console.log(_this.state.videoSource.uri);
        FirebaseStorageAPI.uploadVideoOnFirebase(_this.state.videoSource.uri)
        .then(downloadUrl =>resolve(downloadUrl))
        .catch(error => reject(error))
       });
    }
    var createResizedImage = (downloadUrl) =>{       
      let _this = this;
      return new Promise(function(resolve, reject) {
        _this.savedVideo = {
          uri: downloadUrl,
        };
        ImageResizer.createResizedImage(_this.state.thumbnailSource, _this.state.size.width, _this.state.size.height, 'JPEG', 40)
        .then(({uri}) =>resolve(uri))
        .catch(error => reject(error))     
       });
    }
    var uploadThumbnailOnFirebase = (uri) =>{
      return new Promise(function(resolve, reject) {         
        FirebaseStorageAPI.uploadThumbnailOnFirebase(uri)
        .then(downloadUrl =>resolve(downloadUrl))
        .catch(error => reject(error))           
       });
    }
    
    uploadVideoOnFirebase()
    .then((downloadUrl) =>createResizedImage(downloadUrl))
    .then((resizeUri) => uploadThumbnailOnFirebase(resizeUri))
    .then(downloadUrl => {
      let post = {
        type: 'video',         
        url:  this.savedVideo.uri,
        thumbnail: downloadUrl,
        caption: this.caption,
        ratio: this.state.size.height/ this.state.size.width,
        cliqueID: this.props.currentClique.lastCliqueId
      }
      this.postVisual(post);

    
  })
  .catch( err => {this.setState({showActivityIndicator: false,})});
  }
  
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    backgroundColor:'#fff'
  },
  image: {
    
     width: window.width * 0.3,
     height: window.height * 0.3,
     backgroundColor:'#fff'
   },
   postImagContent: {
     width: '100%',
     paddingVertical:65, 
     paddingHorizontal: 10,
     flexDirection: 'row',
     justifyContent: 'center',
     alignItems: 'center',
     //borderBottomWidth:2, 
     borderColor:'#E8E8E8', 
   }
});
function mapStateToProps(state) {
  return {
    currentClique: state.currentClique
  }
}
export default connect(mapStateToProps,{postVisual,clickProfile})(VideoUpload)