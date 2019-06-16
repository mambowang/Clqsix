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
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import {  CachedImage } from 'react-native-cached-image';
import {
  ClqsixTextInput,
  CustomNavigator,
  FullScreen,
  KeyboardSpacer,
  ScrollView,
  Images,
  ModalActivityIndicator
} from '../../components';

import {VisualModel,CliqueModel,UserModel} from '../../models';
import { postVisual } from '../../actions/cliqueActions';
import { clickProfile } from '../../actions/statusActions';
import {  FirebaseStorageAPI,} from '../../utils';
import ImageResizer from 'react-native-image-resizer';
import * as globals from '../../common/Global';
const RATIO = 0.4;
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
class ImageUpload extends Component {
  caption = '';
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {       
        imageSource: params.imageSource,
        showActivityIndicator: false  ,
        imageSize: params.imageSize,
        thumbnailSource: globals.thumbnailSource,
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
    //console.log("componentWillReceiveProps");
    if(this.props.currentClique.lastVisualId != nextProps.currentClique.lastVisualId){
      this.gotoTop();
    }
  
  }

  render() {
    return (
      <FullScreen style={styles.container}>
        <ScrollView
          ref="scrollView"
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          scrollEnabledOnKeyboard={true}
          style={{flex: 1, width: '100%',    }} 
          contentContainerStyle={{alignItems: 'center',marginHorizontal:15, }}>
          <View style = {styles.postImagContent}>

          {/* <CachedImage
            source={this.state.imageSource}
            defaultSource =  {{ uri:this.state.thumbnailSource}}
            fallbackSource = {{ uri:this.state.thumbnailSource}}            
            style={[styles.image,{width: this.state.imageSize.width * RATIO,height: this.state.imageSize.height * RATIO}]}
          /> */}
          <Image style={[styles.image,
            {width: this.state.imageSize.width * RATIO,height: this.state.imageSize.height * RATIO}]} 
            source={this.state.imageSource || Images.Cliqsix_1932x1952} />
          </View>
          <View style={{height: 1,width: "100%",backgroundColor: "#DDDDDD",}}/>

          <TextInput ref="name"
            style={{ marginHorizontal:40, height: 50,fontSize: 19,    marginVertical: 30,
              borderBottomWidth: 0,width: '100%'}}
            needValidation={false}
            placeholder="Write a caption..."
            onChangeText={(text) => this.caption = text}
            multiline = {true}
            onFocus={() => this.refs.scrollView.scrollToRef(this.refs.name)}
            onSubmitEditing={() =>  Keyboard.dismiss()}                   
            
            />

        
        </ScrollView>
        
        <View style={{width: '100%', height:50, flexDirection: 'row',
          backgroundColor: '#0095F7', paddingHorizontal: 10,}}>
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
  _onPost() {    
      this.setState({
        showActivityIndicator: true
      });
      var resizeImage = () =>{
        let _this = this;
        return new Promise(function(resolve, reject) {
          ImageResizer.createResizedImage(_this.state.imageSource.uri, 
            _this.state.imageSize.width,
            _this.state.imageSize.height, 'JPEG', 100)
          .then(({uri}) =>resolve(uri))
          .catch(error => reject(error))
         });
      }
      var uploadImageOnFirebase = (resizeUrl) =>{
        let _this = this;
        return new Promise(function(resolve, reject) {
          FirebaseStorageAPI.uploadImageOnFirebase(resizeUrl)
          .then(downloadUrl =>resolve(downloadUrl))
          .catch(error => reject(error))
         });
      }
        resizeImage()
        .then((resizeUri) =>uploadImageOnFirebase(resizeUri))      
        .then(downloadUrl => {       
          let post = {
            type: 'image',
            url: downloadUrl,
            caption: this.caption,
            ratio: this.state.imageSize.height/ this.state.imageSize.width,
            cliqueID: this.props.currentClique.lastCliqueId
          }
          this.postVisual(post);
        })
        .catch( err => {this.setState({showActivityIndicator: false})});
        
  }

  postVisual(visual) {   
    let _this = this;
    VisualModel.push(visual,(visualKey) => {
      _this.setState({showActivityIndicator: false});
      _this.props.postVisual(visualKey); 
    });    
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
   
    // width: window.width * 0.3,
    // height: window.width * 0.4,
    backgroundColor:'#fff'
  },
  postImagContent: {
    width: '100%',
    paddingVertical:65, 
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
   // borderBottomWidth:2, 
    borderColor:'#E8E8E8', 
  }
});
function mapStateToProps(state) {
  return {
    currentClique: state.currentClique
  }
}

export default connect(mapStateToProps,{postVisual,clickProfile})(ImageUpload)
