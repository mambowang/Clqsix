'use strict';

import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Naigator,
    Image,
    ScrollView,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Modal,
    //Share,
    CameraRoll,
    Linking
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
  ModalActivityIndicator,
  Loading,
  Alert
} from '../../components';
import {VisualModel,visualModel,UserModel} from '../../models';
import VisualDetailReactionToolbar from './VisualDetailReactionToolbar';
import { connect } from 'react-redux'
import { clickProfile,blank } from '../../actions/statusActions'
import {
  AuthAPI,FirebaseStorageAPI
} from '../../utils'
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'
import { NavigationActions } from 'react-navigation';

import Hyperlink from 'react-native-hyperlink';
import moment from 'moment'
import {  CachedImage } from 'react-native-cached-image';
import Video from 'react-native-video';

import VideoPlayer from 'react-native-video-player';

import _ from 'lodash';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const AVER = window.width * 0.3
const VIDEOSIZE = AVER
const MIN = AVER * 0.75
const MAX = AVER * 1.25
const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;
import * as globals from '../../common/Global';

class VisualDetail extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.rootNavigation.state;    
    this.state = {
        avatarImage : null,
        visualData: {},     
        isLoading: false,
        counter: globals.smallLoadCount,
        lastId: null,
        loading: false,
        refreshing: false,
        thumbnailSource: globals.thumbnailSource,     
        visualId: params.visualId,      
        uid:this.props.currentUser.uid || '',
        changeState: false,
        likeStatus : null,
        reactionSum: 0,
        showActivityIndicator: false  ,
        fromProfile: params.fromProfile || false,
        
    };
    this.changeReactionSum = this.changeReactionSum.bind(this)
  }
  _likeVisualData(visualID,fnCallBack){
    this.changeVisual('like')
    VisualModel.likeVisualData(visualID,res => {
       fnCallBack(res);      
    });
  }
  _DislikeVisualData(visualID,fnCallBack){
    this.changeVisual('dislike')
    VisualModel.dislikeVisualData(visualID,res => {
      fnCallBack(res);      
    });
  }  
  goCommentDetails(visualId,posterUid){
    !!this.props.navigation && this.props.navigation.navigate('Comment',
    {visualId: visualId,posterUid:posterUid, changeReactionSum: this.changeReactionSum});  
  }
  _shareVisualData (item) {
    let shareOptions = {};  
    let _this = this;
    if(item.type == 'text'){
      shareOptions = {
        title:  "Clqsix",
        message: item.text || "",       
        subject: "Share Text" //  for email
      };
      Share.open(shareOptions)
      .then((res:any) =>  {_this._showShareResult(item.key);})
      .catch((err:any) => console.log('err', err));
    }else if(item.type == 'link'){
      shareOptions = {
        title:  "Clqsix",
        message: item.url || "",       
        subject: "Share Text" //  for email
      };
      Share.open(shareOptions)
      .then((res:any) =>  {_this._showShareResult(item.key);})
      .catch((err:any) => console.log('err', err));
    }else if(item.type == 'image'){
      this.setState({showActivityIndicator: true});
      let mediaPath = null
      RNFetchBlob
      .config({ 
            fileCache : true 
      })
      .fetch('GET', item.url)
      .then((resp) => {
          mediaPath = resp.path()
          return resp.readFile('base64')
      })
      .then((base64Data) => {
        _this.setState({showActivityIndicator: false});
          let base64FullData = "data:image/png;base64," + base64Data;          
          let shareMediaBase64 = {
            title:  "Clqsix",
            message: "Exclusively on CLQSIX",
            url:base64FullData,
            subject: "Share Link" //  for email
          };
          Share.open(shareMediaBase64)
          .then((res:any) =>  {_this._showShareResult(item.key);})
          .catch((err:any) => console.log('err', err))
          // remove the file from storage
          return fs.unlink(mediaPath)
      })
    }else{
      this.setState({showActivityIndicator: true});
      RNFetchBlob.config({
        fileCache : true,
        appendExt : 'mp4'
      }).fetch('GET', item.url, {})
      .then((res:any) => {
        _this.setState({showActivityIndicator: false});
        let shareOptions = {
          title:  "Clqsix",
          message: "Exclusively on CLQSIX",
          url: 'file://' + res.path(),
          type: 'video/mp4',        
        }
        Share.open(shareOptions)
          .then((res:any) =>  {_this._showShareResult(item.key);})
          .catch((err:any) => console.log('err', err))
        });
    }   
    
   
  }
  _showShareResult (visualId) {
    
       VisualModel.shareVisualData(visualId, (res) =>{
         if(res == "0"){
           this.shareSuccess.show();
         }
       })     
       
  }
  reportVisual(){        
    let uid = this.state.uid;
    let visualid = this.state.visualId;
    this.setState({showActivityIndicator: true});
    VisualModel.reportVisual(visualid,uid,success => {   
      this.setState({showActivityIndicator: false}); 
      this.reportSuccess.show();
    });
   
  }
  deleteVisual(){
    let visualid = this.state.visualId;
    let uid = this.state.uid;
    this.deleteAlert.hide();
    this.setState({showActivityIndicator: true});
    VisualModel.deleteVisual(visualid,uid,success => {   
      this.setState({showActivityIndicator: false});
      this.goBack();    
    });
  }
  downloadVisual(){   
    if(this.state.visualData.type == "text" 
      || !this.state.visualData.type == "link" 
      || !this.state.visualData.url)return;
    this.setState({
      showActivityIndicator: true
    });
    let _this = this;
    let url = this.state.visualData.url;
   
    if(this.state.visualData.type == "image" ){
      var promise = CameraRoll.saveToCameraRoll(url);
      promise.then(function(result) {
        _this.setState({
          showActivityIndicator: false
        });
        _this.downSuccess.show();
        console.log('save succeeded ' + result);
      }).catch(function(error) {
        _this.setState({
          showActivityIndicator: false
        });
        console.log('save failed ' + error);
      });
    }else if(this.state.visualData.type == "video" ){
      var downloadToDevice = FirebaseStorageAPI.downloadFileOnFirebase(url,'mp4');
      downloadToDevice.then(savedUrl =>{
        var downloadToRoll = CameraRoll.saveToCameraRoll(savedUrl,'video');        
        downloadToRoll.then(function(result) {
          _this.setState({
            showActivityIndicator: false
          });
          _this.downSuccess.show();
        }).catch(function(error) {
          _this.setState({
            showActivityIndicator: false
          });
        });
      }).catch(function(error) {
        _this.setState({
          showActivityIndicator: false
        });
      });      
    }
  }
  changeReactionSum(sum){
    this.setState((prevState, props) => {
      return { 
        reactionSum: prevState.reactionSum + sum,   
       }
    });
  }
  fetchRemoteData() {   
    const visualId = this.state.visualId;   
  
    VisualModel.getUniqueVisual (visualId,snapshot => {  
       let reactionSum = 0;
       if(snapshot.reactionSum){
         reactionSum = snapshot.reactionSum;
       } 
       VisualModel.getVisualLikeStatusPerUid(visualId,likeData =>{   
          let likeStatus = null;
          if(likeData){likeStatus = likeData.type}  
          let visualData = _.extend(snapshot,{likeData:likeData})
          this.setState({
            visualData: visualData,  
            isLoading : true,  
            reactionSum: reactionSum,
            likeStatus:likeStatus
          });  
       })    
   });
  }
  changeVisual=(type) => {      
    let changedData = {type: type}
    this.setState((prevState, props) => {
        return { 
          reactionSum: prevState.reactionSum + 1,
          changeState: !prevState.changeState,
          likeStatus: type,
          visualData : {...prevState.visualData,
            likeData:changedData,
           
            },
         }
    });    
  }
  componentDidMount(){
      this.fetchRemoteData();    
  }  
  componentWillUnmount(){
  
    this.moreActionSheet.hide();
  }  
  goBack() {
    const { rootNavigation } = this.props;
    if(!!rootNavigation.state.params){
      !!rootNavigation.state.params.getFetchChangeVisual && !! this.state.changeState &&
      rootNavigation.state.params.getFetchChangeVisual(this.state.visualId ,this.state.likeStatus );
    }
    !!this.props.rootNavigation &&  this.props.rootNavigation.goBack();
  }
  goClique(cliqueId){
   
    !!this.props.rootNavigation && this.props.rootNavigation.navigate('CliqueRoot',
    {cliqueId: cliqueId});  
  }
  goReaction(){
    !!this.props.navigation && this.props.navigation.navigate('Reaction',
    {visualId:this.state.visualId, reactionSum: this.state.reactionSum});
  }
  render() {  
    let isLoading = this.state.isLoading;
    let photoUrl = this.state.visualData.type == "image" ?this.state.visualData.url
    :this.state.visualData.thumbnail ;
    let visualData = this.state.visualData;
    let reactionSum = this.state.reactionSum;
    return (
       <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
        <CustomNavigator
            leftButton = {<Image source={Images.BackChevronLeft_Black_9x16}/>}   
            rightButton = {<Image source={Images.More_1125x250} style = {{opacity: 1,width:23,height:5}} />}      
            onLeftButtonPress = {() =>this.goBack()}       
            onRightButtonPress = {() => this.moreActionSheet.show() }
            >        
        </CustomNavigator>
        {!isLoading ?<Loading /> :
          <ScrollView ref="scrollView" style={{width:'100%',paddingHorizontal : 20, }}>  
            <View style = {styles.visualAvatarArea}>
                {visualData.type == "link" &&
                  <View>
                      <View style = {styles.itemlinkcontainer}>    
                        <CachedImage
                                resizeMode="cover"
                                source={{ uri:  visualData.thumbnail}}
                                defaultSource =  { this.state.thumbnailOfflineSource}
                                fallbackSource = { this.state.thumbnailOfflineSource}    
                                style={{width: window.width, height :window.width * 0.4}}    
                                
                            />         
                        </View>
                       <View style = {styles.itemlinkbottom}>
                        <Hyperlink                          
                            linkText={ url => url === visualData.url ? url: url }
                            onPress={ (url) => {Linking.openURL(url)}}
                          >
                          <Text style = {{fontSize: 14,color: '#777777'}}>
                          {visualData.description }
                          </Text>
                            <Text style={ {marginTop: 5, fontSize: 14 ,color: '#bbbbbb'} }>
                            {visualData.url || ''} 
                            </Text>
                          </Hyperlink>
                        </View>
                  </View>
                }
                {visualData.type == "image" &&
                  <CachedImage
                    source={{ uri: photoUrl}}
                    defaultSource =  {{ uri:this.state.thumbnailSource}}
                    fallbackSource = {{ uri:this.state.thumbnailSource}}                
                    style={{width: window.width, height :window.width * visualData.ratio}}
                  />
                }
                {visualData.type == "video" &&
                  <View style = {{width:  window.width,height:window.width * visualData.ratio}}>
                    <VideoPlayer
                              endWithThumbnail     
                              autoplay = {false}    
                              thumbnail={{ uri:  visualData.thumbnail}}
                              video={{ uri:visualData.url}}
                              videoWidth={window.width}
                              videoHeight={window.width * visualData.ratio}
                              disableFullscreen= {false}
                        />
                  </View>
                }
                {visualData.type == "text" &&
                  <View style = {{width:  window.width,height:  window.width}}>
                    <View style = {styles.itemtextcontainer}>         
                      <Text style = {styles.itemtextcontent}>{visualData.text || ''}</Text>               
                    </View>  
                  </View>
                }
                {visualData.type == "mood" &&
                  <View style = {{width:  window.width,height:window.width * visualData.ratio}}>
                    <VideoPlayer
                               autoplay = {true}   
                               muted = {true}
                               disableSeek = {true}                    
                               loop = {true}     
                               hideControlsOnStart = {true}
                               disableFullscreen= {true}
                               customStyles = {{
                                seekBar:{opacity:0},
                                controls:{opacity:0},
                               }}  
                              thumbnail={{ uri:  visualData.thumbnail}}
                              video={{ uri:visualData.url}}
                              videoWidth={window.width}
                              videoHeight={window.width * visualData.ratio}
                             
                        />
                  </View>
                }
            </View>                
            <View style = {[styles.itemtextArea,{}]}>
                    <View style={[styles.itembackdropView,{}]}>
                    <TouchableOpacity  style = {{flexDirection:'row',paddingVertical:20,}} 
                      onPress={() => {this.goClique(visualData.cliqueID) }}>   
                      <CachedImage
                          source={{ uri: visualData.cliqueUrl}}
                          defaultSource =  { this.state.thumbnailOfflineSource}
                          fallbackSource = { this.state.thumbnailOfflineSource}                
                          style={{width:20, height:20}}
                      />         
                      <Text style = {[styles.itemNameline,{fontWeight:'bold'}]}>{'   ' + visualData.cliqueName || ''}
                      </Text>
                    </TouchableOpacity>
                    <Text style = {[styles.itemCaptionline,{fontWeight:'400'}]}>{''}{visualData.caption || ''}
                    </Text>
                    
                     
                    </View>                   
            </View>
            <View style = {styles.visualStateContent}>
            { this.renderReactionToolbar(visualData) }   
            <TouchableOpacity     onPress={() => {this.goReaction()}}>      
                    <View style = {styles.editcontent}>
                      <Text style = {styles.editcontenttext}>
                      {reactionSum} reactions
                      </Text>
                    </View> 
                  </TouchableOpacity>  
            </View>    
            <Text style={[styles.itemheadline,{marginTop : 30,}]}>
            {moment(visualData.createdAt).format("MMM DD, YYYY - h:mm A") }   
            </Text>
           
            
         
          </ScrollView>
        }
        {/* <Alert ref={ref=>this.reportAlert=ref} 
                style={{backgroundColor:'#9E4FFF'}} 
                isStatic = {true}
                text={['Invite this person to join','your clique?']}
                closeButtonSource = {Images.check_17x13}
                cancleButtonSource = {Images.Cancel_White_13x13}
                onRequestCancle ={() => this.reportAlert.hide()}
                onRequestClose = {() => this.sendInvite()}/> */}
        <Alert ref={ref=>this.deleteAlert=ref} 
                style={{backgroundColor:'#EF4244'}} 
                isStatic = {true}
                text={['Are you sure want to delete this visual?']}
                closeButtonSource = {Images.check_17x13}
                cancleButtonSource = {Images.Cancel_White_13x13}
                onRequestCancle ={() => this.deleteAlert.hide()}
                onRequestClose = {() => this.deleteVisual()}/>
        <Alert ref={(c) => this.shareSuccess = c}
              title = {""}
              style={{backgroundColor:'#24D770'}} 
              text={['Sharing is successful!']}
              closeButtonSource = {Images.check_17x13}              
              onRequestClose={() => this.shareSuccess.hide()}/>

        <Alert ref={(c) => this.shareError = c}
          style={{backgroundColor:'#141414'}}  
          title = {""}
          text={['Sharing is error!']}
          onRequestClose={() => this.shareError.hide()}/>    
          
        <Alert ref={(c) => this.downSuccess = c}
          style={{backgroundColor:'#9D4FFF'}}  
          title = {""}
          text={['Download successful.']}
          closeButtonSource = {Images.check_17x13}      
          onRequestClose={() => this.downSuccess.hide()}/> 
        <Alert ref={(c) => this.reportSuccess = c}
          style={{backgroundColor:'#EF4244'}}  
          title = {""}
          text={['Report successful.']}
          closeButtonSource = {Images.check_17x13}      
          onRequestClose={() => this.reportSuccess.hide()}/> 
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />
         <Options ref={ref=>this.moreActionSheet=ref}   
          style = {{ paddingBottom: 20}}
          items={visualData.uid == this.state.uid ?
            [ { value: 0, text: 'Delete visual'},{ value: 1, text: 'Download visual'}] 
            :
            [ { value: 0, text: 'Report visual'},{ value: 1, text: 'Download visual'}] 
          }      
          onSelectItem={(item) => { 
            if(item.value == 0){
              this.moreActionSheet.hide(); 
              if(visualData.uid != this.state.uid){
                this.reportVisual();
              }else{
                this.deleteAlert.show();
              }
            }else if(item.value == 1){
              this.moreActionSheet.hide();
              this.downloadVisual();
            }
            return false; }} />
      </FullScreen>
    );
  }
  renderReactionToolbar(item) {
    let uid = this.state.uid;
    let likeState = ""
    if(!!item.likeData){
      if(item.likeData.type == 'like'){   
        likeState = "like"
      }else if(item.likeData.type == 'dislike'){   
        likeState = "dislike"
      }
    }
    return (
       <VisualDetailReactionToolbar 
          style={styles.itemactioncontainer}
          likeState = {likeState}
          onLike = {(fnCallBack) => {this._likeVisualData(item.key,fnCallBack)}}
          onDislike = {(fnCallBack) => {this._DislikeVisualData(item.key,fnCallBack)}}
          onShare = {() => {this._shareVisualData(item)}}
          onComment = {() => {this.goCommentDetails(item.key,item.uid)}}
        />
    )
  }
};
const styles = StyleSheet.create({  
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  visualAvatarArea:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',   
    //marginTop:10,
  
  },
  // visualAvatar: {
  //   width: window.width ,
  //   height: window.width ,
  // },
  itemtextArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',   
    marginTop:10,
   // paddingLeft : 30,
   // paddingBottom: 20,
  },

  itembackdropView: {
   paddingVertical:5,
    width: '100%',
    flexDirection:'column',    
    justifyContent: 'flex-start',
    alignItems: 'flex-start',   
  },
 
  itemNameline: {
    fontSize: 16,
   // textAlign: 'center',
    fontWeight: 'bold', 
  },
  itemCaptionline:{
    fontSize: 16,
    marginTop: 15,
  },
  itemheadline: {
    fontSize: 15,
   // textAlign: 'center',
    color: '#BBBBBB'
  },
  visualDetailContent:{ 
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },

  visualStateContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    //paddingHorizontal : 20,  
    marginTop: 30,
    height:30,
    borderTopWidth:0, 
    borderBottomWidth:0, 
    borderColor:'#DDDDDD', 
  },
  visualfrequenceText:{ 
      textAlign: 'center',
      fontWeight: 'bold',
      
      marginLeft: 5,
      fontSize: 13,
    },
  visualDescContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginVertical: 5,
    height:30,
    backgroundColor: '#FFFFFF',
  },
  visualActBtnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',   
    alignItems: 'flex-start',
  },
  itemlinkcontainer: {
    flex: 1,
    justifyContent: 'center',   
    alignItems: 'center',   
   
  },
  itemlinkbottom: {
    flex: 1,
    paddingHorizontal:20,
    paddingVertical:8,
    justifyContent: 'center',   
    alignItems: 'flex-start',   
    backgroundColor: '#F3F3F3',
  },
  requestcontent: {
    borderColor : "#BBBBBB",
    borderWidth: 1,
    height:35,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight : 10,
    backgroundColor: '#FFFFFF',
    
  },
  editcontent: {
    // borderColor : "#BBBBBB",
    // borderWidth: 1,
    height:35,
    width: 100,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    
    
  },
  editcontenttext: {
    justifyContent: 'center',
    alignSelf: 'flex-end',    
    elevation: 1,
    fontWeight: 'bold',
    color: '#ACACAC',
    fontSize: 15,
  },
  followingtext: {
    justifyContent: 'center',
    alignSelf: 'center',    
    elevation: 1,
    color: '#BBBBBB',
    fontWeight: 'bold',
  },
  itemcontainer: {    
    marginHorizontal : 6,
     //height: Math.round(Math.random()*(width * 0.3))  
  },
  itemtextcontainer: {     
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
    paddingHorizontal:50,
    alignItems: 'flex-start',   
    backgroundColor: '#1a1a1a',
  },
  itemtextcontent: {
    fontSize: 22,
    textAlign: 'left',
    color:'white'
  },
 

});
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps,{clickProfile,blank})(VisualDetail)