'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'

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
    FlatList,
    ActivityIndicator,
    StatusBar,
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
  Loading,
  Alert,
  
} from '../../components';

import {
  AuthAPI
} from '../../utils'
import fb from '../../utils/FirebaseAPI';

import {VisualModel,CliqueModel,UserModel} from '../../models';

import Hyperlink from 'react-native-hyperlink';
import {  CachedImage } from 'react-native-cached-image';

import _ from 'lodash';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
import MasonryList from '@appandflow/masonry-list';
import VideoPlayer from 'react-native-video-player';
import * as globals from '../../common/Global';

let visualWidth = (window.width - 60) / 2;
class Profile extends Component {
    visualData = [];    
    onEndReachedCalledDuringMomentum = true;
    activeCliqueRef = null;
    constructor(props) {
      super(props);
      this.state = {
        avatarImage : null,
        cliqueData: {},
        visualData: [], 
        memberData:[],    
        isLoading: false,
        counter: globals.smallLoadCount,
        lastId: null,
        loading: false,
        refreshing: false,
        thumbnailSource:globals.thumbnailSource,     
        thumbnailContactSource: Images.contact_icon_50x50,          
        cliqueId: this.props.currentClique.lastCliqueId,      
        enalbleLoading: true,
        uid:this.props.currentUser.uid,        
        isAdmin: false,
        receivedSum: 0,        
      };
      this.onEndReachedCalledDuringMomentum = true;
      this.changeprofileData = this.changeprofileData.bind(this);      
      
    }    
    fetchRemoteData(){   
      const cliqueId = this.state.cliqueId;    
      this.setState({ isLoading: true });  
      CliqueModel.getUniqueClique(cliqueId,snapshot => {    
          if(!!snapshot){
            let cliqueData = snapshot;
            let isAdmin = cliqueData.uid == this.state.uid ? true : false;
            //if(!!this.profileArea){
              CliqueModel.getMembersWithCliqueId(cliqueId,members => { 
                this.setState({
                  cliqueData: cliqueData,  
                  memberData:members,
                  isLoading : false,    
                  isAdmin: isAdmin   
                });  
              });
             
            //}
          }else{
            this.setState({        
              isLoading : false,        
          });
        }
      });
    }    
    fetchRemoteVisualData(){
        if(!this.state.enalbleLoading){
          this.setState({         
            loading: false,
            refreshing: false,
            noData:false,
          });
          return;
        } 
        const cliqueId = this.state.cliqueId; 
        const counter = this.state.counter;
        const lastId =this.state.lastId;      
        this.setState({ loading: true });   
        VisualModel.getVisualDataOnClique(cliqueId,lastId,counter,snapshot => {     
          this.visualData = [] ;   
          if(_.size(snapshot) > 0){          
            snapshot.forEach((element) => { 
              let height = 0;
              if(element.type == 'text'){
                 height = visualWidth ; 
              }else if(element.type == 'link'){
                height = visualWidth * 0.55 ; 
             }else{
                 height = visualWidth * element.ratio ; 
              }
              this.visualData.unshift({height: height,...element});
           
            });
            let lastData = _.last(this.visualData);
            let enalbleLoading = true;
            if(_.size(snapshot) >= counter){        
              this.visualData.pop();
            }else{
              enalbleLoading = false
            }
            //if(!!this.visualList){
              this.setState({
                visualData: [...this.state.visualData,
                            ...this.visualData] ,
                loading: false,
                refreshing: false,
                lastId:lastData.key,
                enalbleLoading: enalbleLoading
              }); 
            //}
          }else{
            this.setState({        
              loading: false,
              refreshing: false,        
          });
        }      
          this.enableDynamicLoading();          
      });
    }
    enableDynamicLoading(){
      if(!!this.activeCliqueRef) {
        this.activeCliqueRef.off();
        this.activeCliqueRef = null;
      }
      this.activeCliqueRef =  fb.ref('/cliques/' + this.state.cliqueId + "/");
      let _this = this;
      this.activeCliqueRef.on('child_changed', function(data) {
        if(data.key == "name" || data.key == "avatar" 
        || data.key == "description" || data.key == "freqSum" || data.key == "category"){
          _this.changeprofileData( data.key,data.val());
        }
        if(data.key == "visualSum"){
          console.log("enableDynamicLoading")
          _this.changeprofileData( data.key,data.val());
          _this.reloadFullVisualData();
          // let currentVisuaSum = _this.state.cliqueData.visualSum;
          // let newVisualSum = data.val();
          // if(newVisualSum < currentVisuaSum){
          //   _this.reloadFullVisualData();
          // }
          
        }
        
      });
    }
    changeprofileData(key, value){
      let changedObj = {
        ...this.state.cliqueData,
        [key]: value
      };
      this.setState({
        cliqueData: changedObj
      });
    }
    componentDidMount(){
      this.reloadFullData(this.props.currentClique.lastCliqueId)
    } 
    componentWillUnmount(){
      if(!!this.activeCliqueRef) {
        this.activeCliqueRef.off();
        this.activeCliqueRef = null;
      }
      this.moreActionSheet.hide();
    }    
    reloadFullData(lastCliqueId){
      this.setState(
        {  
          cliqueId: lastCliqueId,
          lastId: null,
          cliqueData: {},
          visualData: [],   
          isLoading: false,  
          loading: false,
          refreshing: false,  
          enalbleLoading : true,
          
        },
        () => {
          this.fetchRemoteData();   
          this.fetchRemoteVisualData();
          
        }
      );   
    }
    reloadFullVisualData(){
      this.setState(
        {  
          lastId: null,       
          visualData: [],   
          loading: false,
          refreshing: false,  
          enalbleLoading : true,          
        },
        () => {
          this.fetchRemoteVisualData();
        }
      );   
    }
    componentWillReceiveProps(nextProps){  
      
      if (JSON.stringify( this.props.currentClique.lastCliqueId) 
        != JSON.stringify( nextProps.currentClique.lastCliqueId )){
        this.reloadFullData(nextProps.currentClique.lastCliqueId);
      }     
    }
    goSwitchMember(){
      !!this.props.navigation && this.props.navigation.navigate('SwitchMember',
      {cliqueId: this.state.cliqueId});   
    }
    goEditClique(){
      let cliqueData = {
        avatarImage : this.state.cliqueData.avatar,
        cliqueName: this.state.cliqueData.name,
        locationData : this.state.cliqueData.location,
        categoryData:this.state.cliqueData.category,
        cliqueId: this.state.cliqueId,
        description: this.state.cliqueData.description
        
      };   
      !!this.props.navigation && this.props.navigation.navigate('EditClique',
      {cliqueData: cliqueData});   
    }
    goFrequency(){
      !!this.props.navigation && this.props.navigation.navigate('Frequency',
      {cliqueId: this.state.cliqueId,uid: this.state.uid,fromProfile:true});   
    }
    goViewRequest(){
      !!this.props.navigation && this.props.navigation.navigate('ViewRequest',
      {cliqueId: this.state.cliqueId});   
    }
    goSendInvite(){
      !!this.props.navigation && this.props.navigation.navigate('SendInvite',
      {cliqueId: this.state.cliqueId});   
    }
    goRemoveMember(){
      !!this.props.navigation && this.props.navigation.navigate('RemoveMember',
      {cliqueId: this.state.cliqueId,cliquename: this.state.cliqueData.name});   
    }
    leaveClique(){        
      let uid = this.state.uid;
      const cliqueId = this.state.cliqueId;
      CliqueModel.leaveClique(cliqueId,uid,success => {    
        this.confirmAlert.hide();
      });
     
    }
    goCliqueMemberDetail(memberId){
      if(memberId == this.props.currentUser.uid){
        return;
      }
      !!this.props.navigation && this.props.navigation.navigate('MemberRoot',
      {memberId: memberId});  
    }
    goVisualDetails(visualId){
      !!this.props.navigation && this.props.navigation.navigate('VisualRoot',
      {visualId: visualId,fromProfile:true});  
    }
    goCliqueMember(){
      !!this.props.navigation && this.props.navigation.navigate('CliqueMember',
      { cliqueId: this.state.cliqueId ,
        locationData : this.state.cliqueData.location,
        cliquename: this.state.cliqueData.name,fromProfile:true});   
      
    }
    goFollwerUser(){
      !!this.props.navigation && this.props.navigation.navigate('FollwerUser',
      {cliqueId: this.state.cliqueId ,follwerSum: this.state.cliqueData.followerSum,fromProfile:true});   
      
    }
    shouldComponentUpdate(nextProps, nextState){
      if(!!nextState.loading) return false;
       return true;
    }
    handleRefresh = () => {
      if(!!this.state.loading) return;
      
      this.setState(
      {  
          refreshing: true
      },
        () => {
      
          this.fetchRemoteVisualData();
        }
      );
    }
    handleLoadMore = () => {        
      if (!this.onEndReachedCalledDuringMomentum && !this.state.loading) {   
        this.onEndReachedCalledDuringMomentum = true;
        this.fetchRemoteVisualData();
        
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
            borderTopWidth: 1,
            borderColor: "#CED0CE"
          }}
        >
          <ActivityIndicator animating size="large" />
        </View>
      );
    };
    renderHeader = () => {
      return (
        <View> 
          <View style = {styles.cliqueAvatarArea}>
            { !!this.state.cliqueData.avatar ?
              <CachedImage
              source={{   uri:this.state.cliqueData.avatar.uri }}
              defaultSource =  {{ uri:this.state.thumbnailSource}}
              fallbackSource = {{ uri:this.state.thumbnailSource}}                
              style={styles.cliqueAvatar}

              >   
                <View style = {styles.itemtextArea}>
                        <View style={styles.itembackdropView}>
                          <Text style={styles.itemNameline}>{this.state.cliqueData.name || ''}</Text>
                        </View>
                        <View style={styles.itemLocationdropView}>
                          <Text style={styles.itemheadline}>{this.state.cliqueData.category || ''}</Text>
                        </View>
                </View> 
              </CachedImage>
              :
              <CachedImage
              source={{   uri: this.state.thumbnailSource}}
              defaultSource =  {{ uri:this.state.thumbnailSource}}
              fallbackSource = {{ uri:this.state.thumbnailSource}}                
              style={styles.cliqueAvatar}
              >   
                <View style = {styles.itemtextArea}>
                  <View style={styles.itembackdropView}>
                    <Text style={styles.itemNameline}>{this.state.cliqueData.name || ''}</Text>
                  </View>
                  <View style={styles.itemLocationdropView}>
                    <Text style={styles.itemheadline}>{this.state.cliqueData.category || ''}</Text>
                  </View>
                </View> 
              </CachedImage>
            }          
            <View style = {styles.cliqueActionContent}>     
              <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => { this.goFrequency()}}>
                  <Text style = {styles.sumTextArea } >{
                    (this.state.cliqueData.freqSum || 0 )+
                    (this.state.cliqueData.visualSum || 0 )+
                    (this.state.cliqueData.followerSum || 0)
                    }</Text>
                  <Text style = {styles.sumTitleTextArea }>frequency</Text>
              </TouchableOpacity>
                <View style = {styles.cliqueActBtnContent}> 
                  <TouchableOpacity    onPress={() => { this.goEditClique()}}>   
                    <View style = {styles.editcontent}>
                      <Text style = {styles.editcontenttext}>Edit Page </Text>
                    </View> 
                  </TouchableOpacity>  
                </View>  
            </View>
          </View> 
          <View style = {{paddingHorizontal : 20}}>
           
            <View style = {styles.actionArea}>
                <View style={{flexGrow:1}}>
                    <FlatList
                        data={this.state.memberData}  
                        renderItem={({ item }) =>this.renderUseritem(item)}
                        horizontal = {true}
                        keyExtractor={item => item.uid}          
                        showsHorizontalScrollIndicator={false}
                        showsVerticalScrollIndicator ={false}    
                    />
                </View> 
            </View>  
            <View style = {styles.cliqueDescContent}>
                  <Text style =  {styles.cliquedescText}>{this.state.cliqueData.description || ''}</Text>
            </View> 
            <View style = {styles.cliquelocContent}>
                <Image
                  source={Images.LocationIcon_100x150}                            
                  style={{width:10,height:15}}
                  /> 
                  <Text style =  {styles.cliquelocText}>{this.state.cliqueData.location || ''}</Text>
            </View> 
          </View>


          <Text style = {styles.visualTitleText}>Visuals</Text>
          { _.size(this.state.visualData) == 0 && 
                <View >
                  <View style={styles.titleContent}>
                    <Image style = {{width: 138, height: 23}} source = {Images.NoVisualsPosted_8280x1380}></Image>
                  </View>
                  <View style={[styles.novisualcontent,{marginBottom: 50}]}>
                    <Text style = {styles.novisualtext} >Post your first visual</Text> 
                    <Text style = {styles.novisualtext} >and it will appear here.</Text> 
                  </View>
              
                </View>
          }
        </View>   
      );
    };
    render() {
      let isLoading = this.state.isLoading;
      
      return (
        <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
         <StatusBar hidden={false} />
        <CustomNavigator
            leftButton = {
              <View style = {{ flexDirection : 'row'}}>
                <Text style={{ fontFamily:'SF UI Text', fontSize: 17, marginLeft:3, fontWeight:'bold'}}>
                  clique page
                </Text>
                <Image source={Images.Switch_700x450} style = {{marginLeft:7,marginTop : 8,width:16,height:9}}/>
              </View>
            }   
            rightButton = {<Image source={Images.More_1125x250} style = {{opacity: 1,width:23,height:5}}/>}      
            onLeftButtonPress = {() => this.goSwitchMember()}     
            onRightButtonPress = {() => this.moreActionSheet.show()}   
          >
        </CustomNavigator>        
          
          <View  ref={ref => this.profileArea = ref} style={{width:'100%'}} >    
              <MasonryList    
                  data={this.state.visualData}  
                  ref={ref => this.visualList = ref}
                  renderItem={({ item }) =>this.renderVisualItem(item)}
                  horizontal = {false}
                  keyExtractor={item => item.key}
                  ListHeaderComponent={this.renderHeader}
                  onEndReachedThreshold={0.2}       
                  style = {{marginBottom:60}}  
                  refreshing={this.state.refreshing}
                  onEndReached={this.handleLoadMore}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator ={false}      
                  numColumns={2}
                  getHeightForItem={({ item }) => item.height + 2}
                  onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}                         
              />
          </View>
          <Alert ref={ref=>this.confirmAlert=ref} 
                style={{backgroundColor:'#EF4244'}} 
                isStatic = {true}
                text={['Are you sure you want to leave this clique??']}
                closeButtonSource = {Images.check_17x13}
                cancleButtonSource = {Images.Cancel_White_13x13}
                onRequestCancle ={() => this.confirmAlert.hide()}
                onRequestClose = {() => this.leaveClique()}/>
        <Options ref={ref=>this.moreActionSheet=ref}   
          style = {{ paddingBottom: 20}}
          items={!!this.state.isAdmin  ?
              [ { value: 0, text: 'Invite new member'},{ value: 1, text: 'Remove members'}] 
              :
              [ { value: 0, text: 'Invite new member'},{ value: 1, text: 'Leave clique'}] 
            }

          onSelectItem={(item) => { 
            if(item.value == 0){
              this.moreActionSheet.hide(); 
              this.goSendInvite();
            }else if(item.value == 1){
              this.moreActionSheet.hide();
              if(!!this.state.isAdmin ){
                this.goRemoveMember();
              }else{
                this.confirmAlert.show();
              }
            
            }
            return false; }} />

        </FullScreen>
      );
    } 
    renderUseritem(item){
      return (
        <TouchableOpacity activeOpacity = {1}   style={styles.itemusercontainer} 
        onPress = {() => this.goCliqueMemberDetail(item.uid)}>        
             {!item.photoURL ? 
              <Image source={this.state.thumbnailContactSource} style = {styles.imagestyle}/>           
                :
                <View style={{
                  backgroundColor: '#fff',
                  borderRadius: 25,
                  overflow: 'hidden',
                }}>             
                  <CachedImage
                  source={{ uri:  item.photoURL}}
                  style={styles.imagestyle}
                  defaultSource =  {this.state.thumbnailContactSource}
                  fallbackSource = {this.state.thumbnailContactSource}              />
                </View>
            
             }    
             {/* <Text style = {{textAlign: 'center',marginTop: 5,}}>{item.name}</Text>          */}
        </TouchableOpacity>  
      );   
  
    }
    renderVisualItem(item) {
      if (item.type === 'text') {
        let textstyle = {};
        textstyle = {width: visualWidth, height:  item.height};
        return this.renderTextItem(item,textstyle);
      }  
      if (item.type === 'mood') {
        let videostyle = {};
        videostyle = {width: visualWidth, height: item.height};
         return this.renderMoodItem(item,videostyle);
      }  
      if (item.type === 'link') {
        let linkstyle = {};
        linkstyle = {width: visualWidth, height: item.height};
         return this.renderLinkItem(item,linkstyle);
      }
      if (item.type === 'image') { 
        let imagestyle = {};
        imagestyle = {width: visualWidth, height:item.height,alignItems: 'stretch', };    
        return this.renderImageItem(item,imagestyle);
      }  
      if (item.type === 'video') {    
        let videostyle = {};
        videostyle = {width: visualWidth, height: item.height};
        return this.renderVideoItem(item,videostyle);
      }    
      return null;      
    }
    renderTextItem(item,textstyle){
      return (
        <TouchableOpacity activeOpacity = {1}  onPress={() => {this.goVisualDetails(item.key) }}>   
         
         <View style = {[ styles.itemcontainer,textstyle]}>         
            <View style = {styles.itemtextcontainer}>         
              <Text style = {styles.itemtextcontent}> {item.text || ''}</Text>               
            </View>  
         
          </View>  
          
        </TouchableOpacity> 
      );   
  
    }
    renderMoodItem(item,videostyle){
      return (
        <TouchableOpacity   onPress={() => {this.goVisualDetails(item.key) }}>   
          <View  style={[styles.itemcontainer,videostyle]}>
            <VideoPlayer
                endWithThumbnail     
                autoplay = {false}          
                video={{ uri:item.url}}
                thumbnail={{ uri:  item.thumbnail}}
                videoWidth={visualWidth}
                videoHeight={videostyle.height}
                disableFullscreen= {false}
            /> 
        </View>     
        </TouchableOpacity>
      );   
    }
    renderVideoItem(item,videostyle){
      return (     
        <TouchableOpacity  activeOpacity = {1} onPress={() => {this.goVisualDetails(item.key) }}>   
          <View  style={[styles.itemcontainer,videostyle]}>
            <VideoPlayer
                endWithThumbnail     
                autoplay = {false}          
                video={{ uri:item.url}}
                thumbnail={{ uri:  item.thumbnail}}
                videoWidth={visualWidth}
                videoHeight={videostyle.height}
                disableFullscreen= {false}
            /> 
        </View>     
        </TouchableOpacity>
      );
    }
    renderImageItem(item,imagestyle){
      return (
        <TouchableOpacity  activeOpacity = {1}   onPress={() => {this.goVisualDetails(item.key) }}>    
          <View  style={[styles.itemcontainer,imagestyle]}>
          <CachedImage
                source={{ uri: item.url}}
                defaultSource =  {{ uri:this.state.thumbnailSource}}
                fallbackSource = {{ uri:this.state.thumbnailSource}}                
                style={{width:'100%',height: '100%'}}
                />  
          </View>
        </TouchableOpacity>    
      ); 
      
    }
    renderLinkItem(item,linkstyle){
      return(
        <View style = {styles.itemcontainer}>
         <TouchableOpacity activeOpacity = {1} style = {styles.itemlinkcontainer} onPress={() => {this.goVisualDetails(item.key) }}>    
          <CachedImage
                  resizeMode="cover"
                  source={{ uri: item.thumbnail}}
                  defaultSource =  {{ uri:this.state.thumbnailSource}}
                  fallbackSource = {{ uri:this.state.thumbnailSource}}
                  style={{width:'100%',height: '100%'}}
              />         
          </TouchableOpacity>
          <View style = {styles.itemlinkbottom}>
          <Hyperlink
              linkStyle={ { color: '#bbbbbb', fontSize: 12 } }
              linkText={ url => url === item.url ? url: url }
              onPress={ (url) => {Linking.openURL(url)}}
            >
             <Text style = {{fontSize: 12,color:'#777777'}}>
             {item.description.length > 21 ? item.description.substr(0,20) + "..." :item.description }
             </Text>
              <Text style={ { fontSize: 12,color: '#bbbbbb' } }>
               {item.url || ''} 
              </Text>
            </Hyperlink>
          </View>
      </View>
      )
    }
};
Profile.propTypes = {
  currentClique: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired

}
const styles = StyleSheet.create({  
  cliqueAvatarArea:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',   
    marginTop:1,
  
  },
  titleContent: {  
    flex: 1,
    justifyContent:'flex-start', 
    alignItems:'center',
    marginTop: 50,
    marginBottom: 30
    
  },
  novisualcontent: {
    flex: 1,
    justifyContent:'flex-start', 
    alignItems:'center',
  },
  novisualtext:{
    fontFamily: 'SF UI Text',
    fontSize: 16,  
    fontWeight: 'bold',
  },
  cliqueAvatar: {
    width: window.width ,
    height: window.width ,
  },
  itemtextArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',   
    marginBottom: 30,
    marginLeft:20,

  },

  itembackdropView: {
    marginBottom: 6,    
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    paddingHorizontal:10,
    paddingVertical:7,
  },
  itemLocationdropView: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'flex-start', 
    paddingHorizontal:10,
    paddingVertical:5,
    
    
  },
  itemNameline: {
    fontSize: 24,
   // textAlign: 'center',
    fontWeight: 'bold', 
    color:'white'
  },
  itemheadline: {
    fontSize: 18,
   // textAlign: 'center',
    color: '#bbbbbb'
  },
  cliqueDetailContent:{ 
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  cliqueActionContent: {
    width: window.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 15,   
    paddingHorizontal:20,
  },
  actionArea: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 15,
  
  },
  actionItemArea: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  sumTextArea:{
    fontSize:14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sumTitleTextArea:{
    textAlign: 'center',
    fontSize:14,
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#bbbbbb'
  },
  cliqueStateContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //paddingHorizontal : 20,  
    paddingVertical: 15,
    borderTopWidth:0, 
    borderBottomWidth:0, 
    borderColor:'#DDDDDD', 
  },
  cliquedescText:{
    marginTop:10,
    textAlign: 'left',
    fontSize: 15,
  },
  cliquelocText:{
    textAlign: 'left',
    fontSize: 15,
    color:'#bbbbbb',
    marginLeft:5
  },
  cliquefrequenceText:{ 
      textAlign: 'center',
      fontSize: 13,
      fontWeight: 'bold',
      textDecorationStyle: 'solid',
      textDecorationLine: 'underline',
      textDecorationColor: '#bbbbbb',
      color:'#bbbbbb' 
    
  },
  cliqueDescContent: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom:15,    
    backgroundColor: '#FFFFFF',
    
  },
  cliquelocContent:{
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingBottom:15,    
    backgroundColor: '#FFFFFF',
  },
  cliqueActBtnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',   
    alignItems: 'flex-start',
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
    borderColor : "#BBBBBB",
    borderWidth: 1,
    height:35,
    width: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    
    
  },
  editcontenttext: {
    justifyContent: 'center',
    alignSelf: 'center',    
    elevation: 1,
    fontWeight: 'bold',
    //color: '#BBBBBB',
  },
  followingtext: {
    justifyContent: 'center',
    alignSelf: 'center',    
    elevation: 1,
    color: '#BBBBBB',
    fontWeight: 'bold',
  },
  itemusercontainer: {    
     marginRight : 12,
     //height: Math.round(Math.random()*(width * 0.3))  
  },
  itemcontainer: {    
    alignItems: 'stretch', 
    margin: 15,
    marginTop:20,   
    width: visualWidth, 
  },
  itemlinkcontainer: {
    flex: 1,
    justifyContent: 'center',   
    alignItems: 'center',   
    width: visualWidth,
    height: visualWidth * 0.3   
  },
  itemlinkbottom: {
    flex: 1,
    justifyContent: 'center',   
    alignItems: 'flex-start',   
    backgroundColor: '#F4F4F4',
    width: visualWidth,
    padding: 15,
  },
  itemtextcontainer: {     
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal:20, 
    paddingTop:20,
    alignItems: 'flex-start',
    backgroundColor: '#1a1a1a',
    width: visualWidth,  
  },
  itemtextcontent: {
    fontSize: 10,
    textAlign: 'left',
    color:'white'
  },

  itemtexticon: {
    position: 'absolute',   
    bottom: 10,
    right: 10,
  },

  visualTitleText:{
      fontSize: 15,
      textAlign: 'center',
      color: '#bbbbbb',
      fontWeight: 'bold', 
      marginTop:15,
      marginBottom: 15,
  },
  imagestyle:{
    width: 50,
    height: 50
  },
});


function mapStateToProps(state) {
  return {
    currentClique: state.currentClique,
    currentUser: state.currentUser
    
  }
}

export default connect(mapStateToProps)(Profile)