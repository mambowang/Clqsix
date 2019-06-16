'use strict';

import React, { Component } from 'react';
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
    InteractionManager,
    StatusBar,
    FlatList,
    ActivityIndicator,
    Clipboard,
    ToastAndroid,
    AlertIOS,
    Linking
   // Share
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
  Page,
  Content,
  Alert,
  ModalActivityIndicator
} from '../../components';
import {
  AuthAPI
} from '../../utils'
import {VisualModel,CliqueModel,UserModel} from '../../models'
import * as globals from '../../common/Global';

import { connect } from 'react-redux'
import { StackNavigator } from 'react-navigation';
import Share from 'react-native-share';
import RNFetchBlob from 'react-native-fetch-blob'

import {  CachedImage } from 'react-native-cached-image';
//import {CachedImage} from "react-native-img-cache";


import VisualDetailReactionToolbar from '../../container/visual/VisualDetailReactionToolbar';

import Video from 'react-native-video';
import Hyperlink from 'react-native-hyperlink';
import VideoPlayer from 'react-native-video-player';
import _ from 'lodash';
const { height, width } = Dimensions.get('window');
import fb from '../../utils/FirebaseAPI'

import update from 'immutability-helper';
import { followingClique } from '../../actions/index';
import moment from 'moment';

const MIN = 172.25
const MAX = 347.36
const AVER = 260
const VIDEOSIZE = 280
const rating = 0.75
const fs = RNFetchBlob.fs

class Home extends Component { 
  itemPos = 'left';
  visualData = [];  
  delta = 3; 
  onEndReachedCalledDuringMomentum = true;
  index = 0;
  secondIndex = 0;
  activeVisualRef = null;
  constructor(props) {
    super(props);
    this.state = {     

      interactionsComplete: false,
      visualData : [],
      followingCliqueData: [],
      folliwngVisualIds:[],
      counter: globals.largeLoadCount,
      lastId: 0,
      loading: false,
      refreshing: false,
      enalbleLoading : true,

      thumbnailSource: globals.thumbnailSource,
      thumbnailOfflineSource: Images.thumbnailSource_50x50,
      
      uid:this.props.currentUser.uid || '',
      preLoading: false,
      showActivityIndicator: false,
    }
  }
  componentWillReceiveProps(nextProps){    
 
    let currentFollowingIds = this.props.currentUser.followingCliqueIds;
    let newFollowingIds = nextProps.currentUser.followingCliqueIds;    
    //following ids is changed
    if( JSON.stringify(currentFollowingIds) != JSON.stringify(newFollowingIds)){
      this.reloadData();
    } 
  }
  componentDidMount() {
    //console.log("componentWillMount");
      this.onEndReachedCalledDuringMomentum = true;      
      this.fetchFolowingCliquesAndVisualIds(() =>{
          this.fetchRemoteData();  
          this.enableDynamicLoading();
        });
  }
  refreshNewVisualData(visualid,visual){
    if(this.state.folliwngVisualIds.length == 0 ){
      return;
    }
    let followingCliques = this.state.followingCliqueData
    let folliwngVisualIds = this.state.folliwngVisualIds;
    
    let cliqueIndex = _.findIndex(followingCliques, function(c) { 
      return c.key == visual.cliqueID; 
    });
    let visualIndex = _.findIndex(folliwngVisualIds, function(c) { 
      return c == visualid; 
    });
    if(cliqueIndex == -1 || visualIndex != -1){
      return;
    }
    var finalData = this.createFinalVisual(visual);    
    finalData = _.extend(finalData,{key: visualid});
    this.setState({
      folliwngVisualIds: update(
        this.state.folliwngVisualIds,
        {
          $unshift: [visualid]
        }
      ),
      visualData: update(
        this.state.visualData,
        {
          $unshift: [finalData]
        }
      )
    })
  }
  refreshDeleteVisualData(visualid){
    var index = _.findIndex(this.state.folliwngVisualIds, function(e) {
      return e == visualid;
    });   
    if(index == -1){
      return;
    }
    var lastId = this.state.lastId;
    if(index == lastId){
       if(index == 0) lastId = null;
       else{
          lastId = lastId - 1;
       }
    }
    var dataIndex = _.findIndex(this.state.visualData, function(e) {
      return e.key == visualid;
    });  
    if(dataIndex == -1){
      this.setState({
        lastId:lastId,        
        folliwngVisualIds: update(
          this.state.folliwngVisualIds,
          {
            $splice: [[index,1]]
          }
        )
      })
    }else{
      this.setState({
        lastId:lastId,
        visualData: update(
          this.state.visualData,
          {
            $splice: [[dataIndex,1]]
          }
        ),
        folliwngVisualIds: update(
          this.state.folliwngVisualIds,
          {
            $splice: [[index,1]]
          }
        )
      })
    }
  }
  enableDynamicLoading(){
    if(!!this.activeVisualRef) {
      this.activeVisualRef.off();
      this.activeVisualRef = null;
    }
    this.activeVisualRef =  fb.ref('/visuals/' );
    let _this = this;
    this.activeVisualRef.on('child_removed', function(data) {
      _this.refreshDeleteVisualData(data.key)     
    });
    this.activeVisualRef.limitToLast(1).on('child_added', function(data) {
      _this.refreshNewVisualData(data.key,data.val())     
    });
  }
  componentWillUnmount(){
    if(!!this.activeVisualRef) {
      this.activeVisualRef.off();
      this.activeVisualRef = null;
    }
  }  
  reloadData(){
    if( !!this.state.loading || !!this.state.preLoading) return;
    let _this = this;
    this.onEndReachedCalledDuringMomentum = true;
    this.setState(
      {  
        interactionsComplete: false,
        visualData : [],
        followingCliqueData: [],
        folliwngVisualIds:[],      
        lastId: 0,
        loading: false,
        refreshing: false,
        enalbleLoading : true,
        preLoading: false,
      },
        () => {
          _this.fetchFolowingCliquesAndVisualIds(() =>{            
            _this.fetchRemoteData();  
          });
        }
    );   
  }

  _likeVisualData(visualId,fnCallBack){
    this.getFetchChangeVisual(visualId,"like");
    VisualModel.likeVisualData(visualId,res => {
    
      fnCallBack(res);      
    });
  }
  _DislikeVisualData(visualId,fnCallBack){
    this.getFetchChangeVisual(visualId,"dislike");
    VisualModel.dislikeVisualData(visualId,res => {
     
      fnCallBack(res);      
    });
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
  _shareVisualDataOld (item) {

    let shareOptions = {};
    if(item.type == 'text'){
      shareOptions = {
        title: "CLQSIX",
        message: item.text,    
      };
    }else{
      shareOptions = {
        message:"CLQSIX",
        title: item.caption, 
        url: item.url, 
      };
    }   
    var promise = new Promise(
      function (resolve, reject) {        
        Share.share(shareOptions, {
          dialogTitle: 'This is share dialog title',      
          tintColor: 'green'
        })
        .then(result => resolve(result))
        .catch(error => reject(error));       
      });
    promise
    .then(result => this._showShareResult(result,item.key))
    .catch(err => console.log(err));  
  }
   _onNavigationRightButtonPress() {     
    !!this.props.navigation && this.props.navigation.navigate('NotifyRoot');   
  }
  goVisualDetails(visualId){
     !!this.props.navigation && this.props.navigation.navigate('VisualRoot',
     {visualId: visualId, getFetchChangeVisual: this.getFetchChangeVisual});  
  }
  goCommentDetails(visualId,posterUid){
    !!this.props.navigation && this.props.navigation.navigate('Comment',
    {visualId: visualId,posterUid:posterUid});  
  }
  goFindCliques(){   
    //UserModel.addManualUserData();
   // UserModel.clearDb();
    !!this.props.navigation && this.props.navigation.navigate('FindCliques')
  }
  goClique(cliqueId){
    !!this.props.navigation && this.props.navigation.navigate('CliqueRoot',
    {cliqueId: cliqueId});  
  }
  fetchFolowingCliquesAndVisualIds(fnCallBack = null){
    
    this.setState({ preLoading: true });  
    let followingCliqueIds = this.props.currentUser.followingCliqueIds;
    if(_.size(followingCliqueIds) == 0)return;
    CliqueModel.getCliqueDataOnArray(followingCliqueIds,snapshot =>{   
     
        let  followingCliqueData= snapshot;
        CliqueModel.getCliqueVisualIdsOnArray(followingCliqueIds,snapshot =>{                
          let folliwngVisualIds = _.reverse(_.sortBy(_.flattenDeep( _.map(snapshot, function(e, i) {    
            return _.map(e, function(visual, i) {      
              return i
            });   
          }))));
          //if(!!this.visualList){
            this.setState(
              {  
                followingCliqueData: followingCliqueData,  
                folliwngVisualIds: folliwngVisualIds ,
                preLoading:false,   
              },
              () => {
                if(!!fnCallBack)
                fnCallBack();
              }
            );  
          //}
        })
    })
  }
  fetchRemoteData(){
    let folliwngVisualIds = this.state.folliwngVisualIds;
    if(_.size(folliwngVisualIds) == 0)return;
    if(!this.state.enalbleLoading){
      this.setState({         
        loading: false,
        refreshing: false,
        noData:false,    
      });
      return;
    } 
    this.setState({ loading: true });  
    
    const followingCliques = this.state.followingCliqueData
    const counter = this.state.counter;
    const lastId = this.state.lastId;
    let newVisualIds = _.slice(folliwngVisualIds, lastId, lastId + counter);
    let visualData = [];

    let _this = this;
    VisualModel.getVisualDataOnIdArray(newVisualIds,snapshot => {   
      if(_.size(snapshot) > 0){
        visualData = _.map(snapshot, function(e,i) {      
          return _this.createFinalVisual(e);         
        }); 
        let enalbleLoading = true;
        if(_.size(snapshot) < counter){        
          enalbleLoading = false;
        }  
        if(!!this.visualList ){
          this.index ++;
          this.setState((prevState, props) => {
            return { 
              visualData: [...prevState.visualData,
                ...visualData] ,
              loading: false,
              refreshing: false,
              lastId:lastId + counter,
              enalbleLoading: enalbleLoading
             }
          }); 
        }
   
      }else{
        this.setState({           
          loading: false,
          refreshing: false,        
        });
      }  
    });   
  
  }  
  createFinalVisual(visual){
    let followingCliques = this.state.followingCliqueData
    let cliqueIndex = _.findIndex(followingCliques, function(c) { 
      return c.key == visual.cliqueID; 
    });
    return _.extend(visual, {
      cliqueUrl: followingCliques[cliqueIndex].avatar.uri || '',
      cliqueName: followingCliques[cliqueIndex].name || ''});
  }
  getFetchChangeVisual=(visualId,type) => {   
    var index = _.findIndex( this.state.visualData, function(e) {
      return e.key == visualId;
     });
     let changedData = {type: type}
     if(index != -1){
      this.setState({
        visualData: update(
            this.state.visualData,
            {
              [index]: {
                likeData: { $set: changedData }
              },  
            }
          )
        });  
    }    
  }
  onRefresh = () => {
    if(!!this.state.loading) return;
    
    this.setState(
      {       
       // counter: this.state.counter + this.delta,
        refreshing: true
      },
      () => {
        this.fetchRemoteData();
      }
    );
  }
  onEndReached = () => {   
    if (!this.onEndReachedCalledDuringMomentum && !this.state.loading) {   
     // this.secondIndex ++;
      this.onEndReachedCalledDuringMomentum = true;
      this.fetchRemoteData();
      
    }      
   
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: "100%",
          backgroundColor: "#CED0CE",         
        }}
      />
    );
  };  
  renderFooter = () => {
    if (!this.state.loading) return null;
    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 0,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  shouldComponentUpdate(nextProps, nextState){
    //console.log("shouldComponentUpdate");
    if(!!nextState.loading) return false;
     return true;
  }  
  render() {
    const { navigate } = this.props.navigation;
    let visualData = this.state.visualData;   
    return (
      <FullScreen  ref={ref => this.visualList = ref} style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
        <StatusBar hidden={false} />
        <CustomNavigator        
        leftButton = {<Image style = {{width: 16, height: 16, opacity:1}} source={Images.FeaturedCliques_900x900} />}
        rightButton = {<Image style = {{width:21,height:21}}  source={Images.Notifications_300x300}  />}
          onRightButtonPress = {() => this._onNavigationRightButtonPress()}  
          onLeftButtonPress = {() => this.goFindCliques()}  
        >
          <Image style= {{width:26,height:26,marginTop:7,}} source={Images.CLQSIX_symbol_1300x1300} />
          <Text style={{fontFamily:'Alegre Sans', fontSize: 36, marginLeft:8,marginTop:7,}}>CLQSIX</Text>
        </CustomNavigator>


          {_.size(visualData) == 0 ?
            <View style = {{ flexDirection: 'column'}}>
              <View style={styles.titleContent}>
                {/* <Text style={styles.datecomment}>{moment().format("dddd, M/D/YYYY")}</Text>  */}
              </View>
              <View style={[styles.novisualcontent]}>
                <Text style = {styles.novisualtext} >No visuals yet</Text> 
              </View>
            </View>
           :        
            <FlatList   
              ref={(r) => { this.flatList = r; }}            
              style = {[styles.container,{backgroundColor:'white'}]}
              data={visualData}  
              initialNumToRender={globals.minInitRenderCount}
              
              renderItem={({ item }) =>this.renderVisualItem(item)}
              keyExtractor={item => item.key}
              onEndReachedThreshold={0}         
              ListFooterComponent={this.renderFooter}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.refreshing}
              onEndReached={this.onEndReached}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator ={false}   
              onMomentumScrollBegin={() => 
              { this.onEndReachedCalledDuringMomentum = false; }}           
            />
          }
            <Alert ref={(c) => this.shareSuccess = c}
              title = {""}
              style={{backgroundColor:'#24D770'}} 
              text={['Sharing is successful!']}
              closeButtonSource = {Images.check_17x13}              
              onRequestClose={() => this.shareSuccess.hide()}/>

            <Alert ref={(c) => this.shareError = c}
              style={{backgroundColor:'#141414'}} 
              text={['Sharing is error!']}
              onRequestClose={() => this.shareError.hide()}/>
          <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

    
      </FullScreen>
    );
  }
  renderVisualItem(item) {
    let pos;   
    var index = _.findIndex(this.state.visualData, function(e) {
      return e.key == item.key;
    });
    let mod = index % 7;
    switch(mod){
      case 0:
        pos = 'left' 
      break
      case 1:
        pos = 'left' 
      break
      case 2:
        pos = 'right' 
      break
      case 3:
        pos = 'left' 
      break
      case 4:
        pos = 'center' 
      break
      case 5:
        pos = 'right' 
      break  
      case 6:
        pos = 'right' 
      break    
      default:
        pos = 'left' 
      break
    }
    let style = {justifyContent:'flex-start',paddingHorizontal:30 , 
    paddingTop:35,paddingBottom: 15};
    if (pos === 'left') {
      style = {...style, alignItems:'flex-start'};
    } else if (pos === 'right') {
      style = {...style, alignItems:'flex-end',};
    } else if (pos === 'center') {
      style = {...style, alignItems:'center'};
    }
    if (item.type === 'text') {
        let textstyle = {};
        textstyle = {width: AVER, height: AVER};    
        return this.renderTextItem(item,  style,textstyle);
    }
    if (item.type === 'link') {
      let linkstyle = {width: AVER, height: 90,alignItems: 'stretch', };   
       return this.renderLinkItem(item,  style,linkstyle);
    }
    if (item.type === 'image') {
      let imagestyle = {};
      imagestyle = {width: AVER, height: AVER * item.ratio,alignItems: 'stretch', };    
      return this.renderImageItem(item,  style,imagestyle);
    }
    if (item.type === 'video') {
      let videostyle = {};
      videostyle = {width: AVER, height: AVER * item.ratio};
      return this.renderVideoItem(item,  style,videostyle);
    }  
    if (item.type === 'mood') {
      let moodstyle = {};
      moodstyle = {width: AVER, height: AVER * item.ratio};
      return this.renderMoodItem(item,  style,moodstyle);
    }  
    return null;    
  }
  renderTextItem(item,  style,textstyle){
    return (
      <View > 
          <TouchableOpacity activeOpacity = {1}  style={[style,styles.itemcontainer]}   onPress={() => {this.goVisualDetails(item.key) }}>    
            <View style = {[styles.itemtextcontainer,textstyle]}>         
                    <Text style = {styles.itemtextcontent}> {item.text || ''}</Text>               
            </View>  
          </TouchableOpacity>
          <View style={[style,styles.itemcontainer,{marginTop: -30}]} > 
            <View  style = {styles.itemcaptioncontainer}>
            <TouchableOpacity  style = {{flexDirection:'row'}}   onPress={() => {this.goClique(item.cliqueID) }}>   
              <CachedImage
                    source={{ uri: item.cliqueUrl}}
                    defaultSource =  { this.state.thumbnailOfflineSource}
                    fallbackSource = { this.state.thumbnailOfflineSource}                
                    style={{width:20, height:20}}
                />         
                  <Text style = {[styles.itemtext,{fontWeight:'bold'}]}> {' ' + item.cliqueName || ''} </Text>
            </TouchableOpacity>
            <Text style = {[styles.itemcaptiontext]}>{''}{item.caption || ''}</Text>
            
            </View> 
            { this.renderReactionToolbar(item) }   
          </View>
        
      </View>  
        
    );   

  }
  renderLinkItem(item,  style,linkstyle){
    return (
      <View style={[style,styles.itemcontainer]}>   

          <TouchableOpacity activeOpacity = {1} style = {styles.itemlinkcontainer} onPress={() => {this.goVisualDetails(item.key) }}>    
          <CachedImage
                  resizeMode="cover"
                  source={{ uri: item.thumbnail}}
                  defaultSource =  { this.state.thumbnailOfflineSource}
                  fallbackSource = { this.state.thumbnailOfflineSource}    
                  style = {linkstyle}            
                  
              />         
          </TouchableOpacity>
          <View style = {styles.itemlinkbottom}>
          <Hyperlink
              linkStyle={ { color: '#bbbbbb', fontSize: 12 } }
              linkText={ url => url === item.url ? url: url }
              onPress={ (url) => {
                Linking.openURL(url);
                // Linking.canOpenURL(url).then(supported => {
                //   supported && Linking.openURL(url);
                // }, (err) => console.log(err));
              }}
            >
             <Text style = {{fontSize: 12,color:'#777777'}}>
             {item.description.length > 36 ? item.description.substr(0,35) + "..." :item.description }
             </Text>
              <Text style={ { fontSize: 12,color: '#bbbbbb' } }>
               {item.url || ''} 
              </Text>
            </Hyperlink>
          </View>

          <View style = {[styles.itemcaptioncontainer,{marginTop:15}]}>
            <TouchableOpacity  style = {{flexDirection:'row'}}   onPress={() => {this.goClique(item.cliqueID) }}>   
              <CachedImage
                    source={{ uri: item.cliqueUrl}}
                    defaultSource =  { this.state.thumbnailOfflineSource}
                    fallbackSource = { this.state.thumbnailOfflineSource}                
                    style={{width:20, height:20}}
                />         
                  <Text style = {[styles.itemtext,{fontWeight:'bold'}]}> {' ' + item.cliqueName || ''} </Text>
            </TouchableOpacity>
            <Text style = {[styles.itemcaptiontext]}>{''}{item.caption || ''}</Text>
          </View>
          { this.renderReactionToolbar(item) }   
        </View>
    );   
  }
  renderLinkItemOld(item,  style){
    return (
      <View style={[style,styles.itemcontainer]}>       
          <View style = {styles.itemlinkcontainer}>    
          <Hyperlink
              linkStyle={ { color: '#9D4FFF', fontSize: 18 } }
              linkText={ url => url === item.url ? url: url }
            >
              <Text style={ { fontSize: 15 } }>
               {item.url || ''} 
              </Text>
            </Hyperlink>
          </View>
          <View style = {styles.itemlinkbottom}>
              <Text style = {{ color: '#BABABA', fontSize: 12 }}>{'Link'}</Text>
          </View>

          <View style = {styles.itemcaptioncontainer}>
              <Text style = {styles.itemtext}>{item.caption || ''}</Text>
          </View>
          { this.renderReactionToolbar(item) }   
        </View>
    );   
  }
  renderMoodItem(item,  style,videostyle){
    return ( 
       <View>    
         <TouchableOpacity     style={[style,styles.itemcontainer]} onPress={() => {this.goVisualDetails(item.key) }}>    
           <View style = {{width: videostyle.width,height: videostyle.height}}>
             <VideoPlayer
                      endWithThumbnail
                      autoplay = {false}   
                      loop = {false}     
                      muted = {true}
                      disableSeek = {true}  
                      hideControlsOnStart = {true}
                      disableFullscreen= {true}
                      customStyles = {{
                        seekBar:{opacity:0},
                        controls:{opacity:0},
                      }}                      
                       thumbnail={{ uri:  item.thumbnail}}
                       video={{ uri:item.url}}
                       videoWidth={videostyle.width}
                       videoHeight={videostyle.height}
                      
                 />
           </View>
           </TouchableOpacity>   
           <View style={[style,styles.itemcontainer,{marginTop: -30}]} > 
               <View style = {styles.itemcaptioncontainer}>
               <TouchableOpacity  style = {{flexDirection:'row'}}   onPress={() => {this.goClique(item.cliqueID) }}>   
                  <CachedImage
                        source={{ uri: item.cliqueUrl}}
                        defaultSource =  { this.state.thumbnailOfflineSource}
                        fallbackSource = { this.state.thumbnailOfflineSource}                
                        style={{width:20, height:20}}
                    />         
                      <Text style = {[styles.itemtext,{fontWeight:'bold'}]}> {' ' + item.cliqueName || ''} </Text>
                </TouchableOpacity>
                 <Text style = {[styles.itemtext,{fontWeight:'400'}]}>{' '}{item.caption || ''}</Text>
                  
               </View>    
           
             { this.renderReactionToolbar(item) }   
          </View>
         </View>         
       )
  }
  renderVideoItem(item,  style,videostyle){
   return ( 
      <View>    
        <TouchableOpacity   activeOpacity = {1}  style={[style,styles.itemcontainer]} onPress={() => {this.goVisualDetails(item.key) }}>    
          <View style = {{width: videostyle.width,height: videostyle.height}}>
            <VideoPlayer
                      endWithThumbnail     
                      autoplay = {false}    
                      thumbnail={{ uri:  item.thumbnail}}
                      video={{ uri:item.url}}
                      videoWidth={videostyle.width}
                      videoHeight={videostyle.height}
                      disableFullscreen= {false}
                />
          </View>
          </TouchableOpacity>   
          <View style={[style,styles.itemcontainer,{marginTop: -30}]} > 
              <View style = {styles.itemcaptioncontainer}>
                <TouchableOpacity  style = {{flexDirection:'row'}}   
                  onPress={() => {this.goClique(item.cliqueID) }}>   
                    <CachedImage
                        source={{ uri: item.cliqueUrl}}
                        defaultSource =  { this.state.thumbnailOfflineSource}
                        fallbackSource = { this.state.thumbnailOfflineSource}                
                        style={{width:20, height:20}}
                    />         
                      <Text style = {[styles.itemtext,{fontWeight:'bold'}]}> {' ' + item.cliqueName || ''} </Text>
                </TouchableOpacity>
                <Text style = {[styles.itemcaptiontext]}>{''}{item.caption || ''}</Text>
              
              </View>    
          
            { this.renderReactionToolbar(item) }   
            </View>
        </View>         
      )
  }
  renderImageItem(item,  style,imagestyle){
    return (
        <View > 
            <TouchableOpacity activeOpacity = {1} style={[style,styles.itemcontainer]}   onPress={() => {this.goVisualDetails(item.key) }}>    
              <CachedImage
                  source={{ uri: item.url}}
                  defaultSource =  { this.state.thumbnailOfflineSource}
                  fallbackSource = { this.state.thumbnailOfflineSource}                
                  style={imagestyle}
              />         
            </TouchableOpacity>
            <View style={[style,styles.itemcontainer,{marginTop: -30}]} > 
              <View  style = {styles.itemcaptioncontainer}>
              <TouchableOpacity  style = {{flexDirection:'row'}}   onPress={() => {this.goClique(item.cliqueID) }}>   
                <CachedImage
                      source={{ uri: item.cliqueUrl}}
                      defaultSource =  { this.state.thumbnailOfflineSource}
                      fallbackSource = { this.state.thumbnailOfflineSource}                
                      style={{width:20, height:20}}
                  />         
                    <Text style = {[styles.itemtext,{fontWeight:'bold'}]}> {' ' + item.cliqueName || ''} </Text>
              </TouchableOpacity>
              <Text style = {[styles.itemcaptiontext]}>{''}{item.caption || ''}</Text>
              
              </View> 
              { this.renderReactionToolbar(item) }   
            </View>
           
        </View>  

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
    width: '100%',
   
   
  },
  itemcontainer: {    
  },
  titleContent: {  
    flex: 1,
    justifyContent:'flex-start', 
    alignItems:'center',
 
    
  },
  novisualcontent: {
    flex: 1,
    justifyContent:'flex-start', 
    alignItems:'center',
  },
  novisualtext:{
    fontFamily: 'SF UI Text',
    fontSize: 15,
  
    fontWeight: 'bold',
  },

  datecomment: {
    fontFamily: 'SF UI Text',
    fontSize: 12,
    color:'#DDDDDD',
    fontWeight: 'bold',
    
  },
  itemtextcontainer: {     
     flex: 1,
     justifyContent: 'flex-start',
     paddingHorizontal:35,
     paddingTop:25,
     alignItems: 'center',   
     backgroundColor: '#1a1a1a',
    
    
  },
  itemtextcontent: {
   
    fontSize: 14,
    textAlign: 'left',
    color:'white'
    
  },
  itemtexticon: {
    position: 'absolute',   
    bottom: 10,
    right: 10,
  },
  itemlinkcontainer: {
    flex: 1,
    justifyContent: 'center',   
    alignItems: 'center',   
    width: AVER,
    height: 90   
  },
  itemlinkbottom: {
    flex: 1,
    justifyContent: 'center',   
    alignItems: 'flex-start',   
    backgroundColor: '#F4F4F4',
    width: AVER,
    paddingLeft: 15,
    paddingVertical:20,
  },
  itemimagecontainer: {       
       width: AVER, 
       height: 200,  
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  itemcaptioncontainer: {
    flex: 1,  
    width: AVER, 
    flexDirection:'column',    
    justifyContent: 'flex-start', 
    alignItems: 'flex-start',   
  },
  itemactioncontainer: {      
    width: AVER, 
    flexDirection:'row',    
    marginTop:20,
    justifyContent: 'center',
    alignItems: 'flex-start',   
  },
  itemtext: {
   // fontWeight: 'bold', 
    fontSize: 16,    
  },
  itemcaptiontext:{
    marginTop:15,
    fontSize: 16,    
  }
});
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps)(Home)
