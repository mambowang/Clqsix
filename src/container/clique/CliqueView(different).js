
'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
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
  ModalActivityIndicator,
  Alert
} from '../../components';
import PropTypes from 'prop-types'

import {
  AuthAPI
} from '../../utils'
import {VisualModel,CliqueModel,UserModel} from '../../models';

import Hyperlink from 'react-native-hyperlink';
import _ from 'lodash';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
import {  CachedImage } from 'react-native-cached-image';

import MasonryList from '@appandflow/masonry-list';
import VideoPlayer from 'react-native-video-player';
import * as globals from '../../common/Global';
import { followingClique ,followingOneClique ,unfollowingOneClique} from '../../actions/userActions'

let visualWidth = (window.width - 60) / 2;

class CliqueView extends Component {
    visualData = [];    
    onEndReachedCalledDuringMomentum = true;
    constructor(props) {
        super(props);
        const { params } = this.props.rootNavigation.state;
        this.state = {       
            avatarImage : null,
            cliqueData: {},
            visualData: [],     
            
            counter: globals.smallLoadCount,
            lastId: null,
            loading: false,
            refreshing: false,
            thumbnailSource:globals.thumbnailSource,     
            thumbnailContactSource: Images.contact_icon_50x50,            
            cliqueId : params.cliqueId,    
         
            enalbleLoading : true,
            isLoading: false,
            uid: this.props.currentUser.uid,
            showActivityIndicator: false,
            receivedSum: 0,
            
            
        }   
        this.onEndReachedCalledDuringMomentum = true;    
    } 
    fetchRemoteData() {   
        const cliqueId = this.state.cliqueId;     
        this.setState({isLoading : true})    
        CliqueModel.getUniqueClique(cliqueId,snapshot => {     
            let clique = snapshot;
            let following = clique.isFollower;
            let request = clique.hasRequest;
            let checkMember = clique.isMember;
            clique = _.extend(clique, {key: clique.key,following: following,
                request: request, checkMember : checkMember})
            if(!!this.profileArea){
                this.setState({
                    cliqueData: clique,  
                    isLoading : false,  
                    originFollowing: clique.following, 
                    originRequest: clique.request,      
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
            
            if(_.size(snapshot) > 0){
                this.visualData = [] ;
                snapshot.forEach((element) => { 
                    let height = 0;
                    if(element.type == 'text'){
                       height = visualWidth  ; 
                    }
                    else if(element.type == 'link'){
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
                    enalbleLoading = false;
                }  
                if(!!this.visualList){
                    this.setState({
                        visualData: [...this.state.visualData,
                                    ...this.visualData],
                        loading: false,
                        refreshing: false,
                        lastId:lastData.key,
                        enalbleLoading: enalbleLoading
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
    

    goVisualDetails(visualId){
        !!this.props.rootNavigation && this.props.rootNavigation.navigate('VisualRoot',
        {visualId: visualId});  
      }
      goFrequency(){
        !!this.props.navigation && this.props.navigation.navigate('Frequency',
        {cliqueId: this.state.cliqueId,uid:this.state.uid});   
      }
      goCliqueMember(){
        !!this.props.navigation && this.props.navigation.navigate('CliqueMember',
        {cliqueId: this.state.cliqueId ,
            locationData : this.state.cliqueData.location,
            cliquename: this.state.cliqueData.name});   
        
      }
      goFollwerUser(){
        !!this.props.navigation && this.props.navigation.navigate('FollwerUser',
        {cliqueId: this.state.cliqueId ,follwerSum: this.state.cliqueData.followerSum});   
        
      }
    componentWillMount(){    
        this.fetchRemoteData();   
        this.fetchRemoteVisualData();
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
        // console.log("onEndReachedCalledDuringMomentum:  " + this.onEndReachedCalledDuringMomentum 
        // + "  loading:  " + this.state.loading )
        if (!this.onEndReachedCalledDuringMomentum  && !this.state.loading) {    
            //console.log("fetchRemoteVisualData");
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
    renderNavigationBar() {
        return (
            <CustomNavigator
                leftButton = {
                    <View style = {{ flexDirection : 'row'}}>
                    <Image source={Images.BackChevronLeft_Black_9x16} style = {{marginLeft:2,marginTop : 4,}}/>
                    <Text style={{ fontFamily:'SF UI Text', fontSize: 17, marginLeft:10, fontWeight:'bold'}}>
                      clique page
                    </Text>
                    
                  </View>
              
                }     
                rightButton = {<Image  source={Images.More_1125x250} style = {{opacity: 0,width:23,height:5}}/>}      
                onLeftButtonPress = {() => this.goBack() }>            
               
            </CustomNavigator>
        );
    }
    renderHeader = () => {
        return(
        <View>               
            <View style = {styles.cliqueAvatarArea}>
                { !!this.state.cliqueData.avatar ?
                    <CachedImage
                    source={{   uri:this.state.cliqueData.avatar.uri }}
                    defaultSource =  {{ uri:this.state.thumbnailSource}}
                    fallbackSource = {{ uri:this.state.thumbnailSource}}                
                    style={styles.cliqueAvatar}
                    />   
                    :
                    <CachedImage
                    source={{   uri: this.state.thumbnailSource}}
                    defaultSource =  {{ uri:this.state.thumbnailSource}}
                    fallbackSource = {{ uri:this.state.thumbnailSource}}                
                    style={styles.cliqueAvatar}
                    />   
                }            
                <View style = {[styles.cliqueActionContent]}>     
                    <View style = {styles.cliqueActBtnContent}>     
                        {(!!this.state.cliqueData.request || !!this.state.cliqueData.checkMember)?    
                        
                        <View style = {styles.requestcontent}>
                            <Image source={Images.Requests_Sent_750x525} 
                            style = {{width: '100%',height:'100%',}}/>   
                        </View>                             
                        :
                        <TouchableOpacity     onPress={() => {this.requestAlert.show()}}>      
                        <View style = {styles.requestcontent}>
                            <Image source={Images.Requests_750x525} 
                            style = {{width: '100%',height:'100%'}}/>   
                        </View> 
                        </TouchableOpacity>   
                        }
                        {!!this.state.cliqueData.following ? 
                        !!this.state.cliqueData.checkMember?                                
                        <View style = {styles.editcontent}>
                            <Text style = {styles.followingtext}>
                        Following
                            </Text>
                        </View> 
                    
                        :
                        <TouchableOpacity     onPress={() => {this.unfollowing()}}>      
                        <View style = {styles.editcontent}>
                            <Text style = {styles.followingtext}>
                        Following
                            </Text>
                        </View> 
                        </TouchableOpacity>  
                        :
                        <TouchableOpacity     onPress={() => {this.following()}}>      
                        <View style = {styles.editcontent}>
                            <Text style = {styles.editcontenttext}>
                        Follow
                            </Text>
                        </View> 
                        </TouchableOpacity>  
                        }
                    </View>  
                </View>
            </View>     
            <View style = {{paddingHorizontal : 20, }}>           
            <View style = {styles.itemtextArea}>
                    <View style={styles.itembackdropView}>
                    <Text style={styles.itemNameline}>{this.state.cliqueData.name || ''}</Text>
                    </View>
                    <View style={styles.itemLocationdropView}>
                    <Text style={styles.itemheadline}>{this.state.cliqueData.category || ''}</Text>
                    </View>
            </View>
            <View style = {styles.actionArea}>
              <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]} onPress={() => {this.goCliqueMember()}}>
                <Image source={Images.Members_420x420} 
                    style = {styles.imagestyle}/>  
              </TouchableOpacity>
              <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => {}}>
                <Text style = {styles.sumTextArea }>{this.state.cliqueData.visualSum || 0}</Text>
                <Text style = {styles.sumTitleTextArea }>{"  "}visuals{"  "}</Text>
              </TouchableOpacity>      
              <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => { this.goFrequency()}}>
                <Text style = {styles.sumTextArea } >{
                    (this.state.cliqueData.freqSum || 0 )+
                    (this.state.cliqueData.visualSum || 0 ) +
                    (this.state.cliqueData.followerSum || 0 )
                    }
                    </Text>
                <Text style = {styles.sumTitleTextArea }>frequency</Text>
              </TouchableOpacity>
              <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => {this.goFollwerUser()}}>
                <Text style = {styles.sumTextArea } >{this.state.cliqueData.followerSum || 0}</Text>
                <Text style = {styles.sumTitleTextArea }>{" "}followers{" "}</Text>
              </TouchableOpacity> 
            </View>  
             <View style = {styles.cliqueDescContent}>
                <Text  style = {styles.cliquedescText}>{this.state.cliqueData.description || ''}</Text>
            </View>
            </View>
            <Text style = {styles.visualTitleText}>Visuals</Text>
                { _.size(this.state.visualData) == 0 && 
                    <View >
                    <View style={styles.titleContent}>
                    <Image style = {{width: 138, height: 23}} source = {Images.NoVisualsPosted_8280x1380}></Image>
                    </View>
                    <View style={[styles.novisualcontent,{marginBottom: 50}]}>                   
                   
                        <Text style = {styles.novisualtext} >Visuals will appear here.</Text> 
                        {/* <Text style = {styles.novisualtext} >Post your first visual</Text> 
                        <Text style = {styles.novisualtext} >and it will appear here.</Text>  */}
                    </View>
                
                    </View>
                }
        </View>
        )
    }
    render() {      
        let loading = this.state.loading;
        
        return (
            <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff'}}>
                {this.renderNavigationBar()}
            
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
            <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />
            <Alert ref={ref=>this.requestAlert=ref} 
             style={{backgroundColor:'#24D770'}}         
             isStatic = {true}
             text={['Send a request to be in ', 'this clique?']}
             closeButtonSource = {Images.check_17x13}
             cancleButtonSource = {Images.Cancel_White_13x13}
             onRequestCancle ={() => this.requestAlert.hide()}
             onRequestClose = {() => this.request()}/> 
            </FullScreen>
        );
    }

    renderVisualItem(item) {
        if (item.type === 'text') {
          return this.renderTextItem(item);
        }  
        if (item.type === 'mood') {
          return this.renderMoodItem(item);
        }  
        if (item.type === 'link') {
          
             return this.renderLinkItem(item);
          }
        if (item.type === 'image') {
        
      
          return this.renderImageItem(item);
        }  
        if (item.type === 'video') {        
          
          
            return this.renderVideoItem(item);
        }    
        return null;      
      }
      renderTextItem(item){
        return (
            <TouchableOpacity  activeOpacity = {1} onPress={() => {this.goVisualDetails(item.key) }}>   
           {/* <View style = {[ styles.itemcontainer,styles.itemtextcontainer]}>         
                <Text style = {styles.itemtextcontent}> {item.text || ''}</Text>      
                <Image style= {styles.itemtexticon} source={Images.Cliqsix_26x26}/>
           
            </View>  */}

            <View style = {[ styles.itemcontainer,{ height: item.height }]}>         
                <View style = {styles.itemtextcontainer}>         
                <Text style = {styles.itemtextcontent}> {item.text || ''}</Text>               
                </View>  
         
            </View>  
          </TouchableOpacity> 
        );   
    
      }
      renderLinkItem(item){
        return (
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
                    <Text style = {{fontSize: 12,color:'#a3a3a3'}}>
                    {item.description.length > 21 ? item.description.substr(0,20) + "..." :item.description }
                    </Text>
                    <Text style={ { fontSize: 12,color: '#bbbbbb' } }>
                    {item.url || ''} 
                    </Text>
                    </Hyperlink>
                </View>
            </View>
        );   
      }
      renderMoodItem(item){
        return (
            <TouchableOpacity   onPress={() => {this.goVisualDetails(item.key) }}>   
                <View  style={[styles.itemcontainer,{ height: item.height }]}>
                    <VideoPlayer
                        endWithThumbnail     
                        autoplay = {false}          
                        video={{ uri:item.url}}
                        thumbnail={{ uri:  item.thumbnail}}
                        videoWidth={visualWidth}
                        videoHeight={item.height}
                        disableFullscreen= {false}
                    /> 
                </View>     
            </TouchableOpacity>
        );   
      }
      renderVideoItem(item){
        return (     
            <TouchableOpacity activeOpacity = {1}  onPress={() => {this.goVisualDetails(item.key) }}>   
                <View  style={[styles.itemcontainer,{ height: item.height }]}>
                    <VideoPlayer
                        endWithThumbnail     
                        autoplay = {false}          
                        video={{ uri:item.url}}
                        thumbnail={{ uri:  item.thumbnail}}
                        videoWidth={visualWidth}
                        videoHeight={item.height}
                        disableFullscreen= {false}
                    /> 
                </View>     
            </TouchableOpacity>
        );
      }
      renderImageItem(item){
        return (
            <TouchableOpacity  activeOpacity = {1}   onPress={() => {this.goVisualDetails(item.key) }}>    
            <View  style={[styles.itemcontainer,{ height: item.height }]}>
            <CachedImage
                  source={{ uri: item.url}}
                  defaultSource =  {{ uri:this.state.thumbnailSource}}
                  fallbackSource = {{ uri:this.state.thumbnailSource}}                
                  style={{width:'100%',height: '100%'}}
                  />  
            </View>
          </TouchableOpacity>    
        //     <TouchableOpacity     onPress={() => {this.goVisualDetails(item.key) }}>       
        //     <View style={[styles.itemcontainer,{  backgroundColor:'#fff'}]}>   

        //     <CachedImage
        //         source={{ uri: item.url}}
        //         defaultSource =  {{ uri:this.state.thumbnailSource}}
        //         fallbackSource = {{ uri:this.state.thumbnailSource}}                
        //         style={ imagestyle}
        //     />               
        //     </View>
        //   <View style={[styles.itemcontainer,{paddingLeft: 15}]}>
        //       <Text style = {{marginTop: 5,fontSize: 12,fontWeight: 'bold'}}>
        //         {item.caption.length > 10 ? item.caption.substr(0,9) + "..." :item.caption }
        //       </Text>         
        //      </View> 
        //   </TouchableOpacity>    
        ); 
        
      }
    goBack() {
        const { rootNavigation } = this.props;    
        let following = false;
        if(!!rootNavigation.state.params){
            if(!!rootNavigation.state.params.onChangeState){
                if(this.state.originFollowing != this.state.cliqueData.following){
                               
                    rootNavigation.state.params.onChangeState(  this.state.cliqueId,true );
                }          
            }
        }   
        !!this.props.rootNavigation &&  this.props.rootNavigation.goBack();
    }

    request(){
        this.requestAlert.hide();
        this.setState({
            showActivityIndicator: true
          });
        CliqueModel.requestClique(this.state.cliqueId,(result)=>{
            this.setState({
                showActivityIndicator: false
              });

            if(result == "0"){
                let changed = this.state.cliqueData;
                changed.request = true;
                this.setState({cliqueData: changed});
            }
        });
    }
    following(){
        this.setState({
            showActivityIndicator: true
          });
        CliqueModel.followingClique(this.state.cliqueId,(result)=>{
            this.setState({
                showActivityIndicator: false
              });
            if(result == "0"){
                let changed = this.state.cliqueData;
                changed.following = true;
                this.setState({cliqueData: changed});
                this.props.followingOneClique(this.state.cliqueId)
                //this.props.followingClique(this.state.uid)
            }
        });
    }
    unfollowing(){
        this.setState({
            showActivityIndicator: true
          });
        CliqueModel.unfollowingClique(this.state.cliqueId,(result)=>{
            this.setState({
                showActivityIndicator: false
              });
            if(result == "0"){
                let changed = this.state.cliqueData;
                changed.following = false;
                this.setState({cliqueData: changed});
                this.props.unfollowingOneClique(this.state.cliqueId)
               // this.props.followingClique(this.state.uid)
            }
        });
    }
    
};
CliqueView.CliqueView = {
    unfollowingOneClique: PropTypes.func,
    followingOneClique: PropTypes.func,
    followingClique: PropTypes.func,
    currentUser: PropTypes.object.isRequired,  
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
        marginTop: 13,
        
      },
    
      itembackdropView: {
        width: '100%',
        marginBottom: 4,    
       // justifyContent: 'flex-end',
        alignItems: 'flex-start',   
      },
      itemLocationdropView: {
        width: '100%',
        // marginBottom: 4,    
       // justifyContent: 'center',
        alignItems: 'flex-start',   
      },
      itemNameline: {
        fontSize: 23,
       // textAlign: 'center',
        fontWeight: 'bold', 
      },
      itemheadline: {
        fontSize: 15,
       // textAlign: 'center',
        color: '#bbbbbb'
      },
      cliqueDetailContent:{ 
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
      cliqueActionContent: {
        width: window.width * 0.7,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginLeft : 70,
        marginTop: -20,   
        height:40,
      },
      actionArea: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 15,
      
      },
      actionItemArea: {
        flexDirection: 'column',
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
        fontSize:13,
        fontWeight: 'bold',
        color: '#bbbbbb'
      },
      cliqueStateContent: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        //paddingHorizontal : 20,  
        
        paddingVertical:15,
        borderTopWidth:0, 
        borderBottomWidth:0, 
        borderColor:'#DDDDDD', 
      },
      cliquedescText:{
        marginTop:10,
        textAlign: 'left',
        fontSize: 15,
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
        marginVertical: 5,
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
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        
        
      },
      editcontenttext: {
        justifyContent: 'center',
        alignSelf: 'center',    
        elevation: 1,
        fontWeight: 'bold',
        color: '#0095F7',
      },
      followingtext: {
        justifyContent: 'center',
        alignSelf: 'center',    
        elevation: 1,
        color: '#BBBBBB',
        fontWeight: 'bold',
      },
      itemcontainer: {    
        alignItems: 'stretch', 
        margin: 14,
        marginTop:20,   
        width: visualWidth, 
      },
      imagestyle:{
        width: 80,
        height: 80
      },
      itemtextcontainer: {     
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal:20, 
        paddingTop:20,
        alignItems: 'flex-start',
        backgroundColor: '#F4F4F4',
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
        paddingLeft: 10,
        paddingVertical:5,
      },
      itemtextcontent: {
        fontSize: 10,
        textAlign: 'left',
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
});

function mapStateToProps(state) {
    return {
      currentUser: state.currentUser
    }
}
  
export default connect(mapStateToProps,{followingClique,
    followingOneClique ,unfollowingOneClique})(CliqueView)