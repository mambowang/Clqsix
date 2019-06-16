'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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
    FlatList,
    ActivityIndicator
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
  Alert,
  Loading,
  ModalActivityIndicator
} from '../../components';
import {
  AuthAPI
} from '../../utils'
import {VisualModel,CliqueModel,UserModel,ReactionModel} from '../../models';

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

const AVER = window.width * 0.45
const PHOTOSIZE = window.width * 0.7
const PHOTORADIUS = PHOTOSIZE/ 2
let visualWidth = (window.width - 60) / 5;


class MemberView extends Component {
    onEndReachedCalledDuringMomentum = true;
    reactionData = [] ;
    constructor(props) {
        super(props);
        const { params } = this.props.rootNavigation.state;    
        this.state = {
            memberId:params.memberId,
            title: params.title ||'individual',
            uid:this.props.currentUser.uid,
            cliqueId: this.props.currentClique.lastCliqueId,  
            showActivityIndicator: false,
           
            thumbnailSource:globals.thumbnailSource,     
            thumbnailContactSource: Images.MemberPhoto_2600x2600, 
            hasReactions: false,
      
            reactionData:[],
            memberData: {},
            isLoading: false,
            counter: globals.smallLoadCount,
            lastId: null,
            loading: false,
            refreshing: false,
            enalbleLoading: true,
            //enableInvite: false,
            enableBlocked: false,
            blockedStatus: false,
            invitedStatus:false,
            invitedCliques: 0,
        }
    }
    goBack(){
        !!this.props.rootNavigation &&  this.props.rootNavigation.goBack();
    }
    goVisualDetails(visualId){
        !!this.props.rootNavigation && this.props.rootNavigation.navigate('VisualRoot',
        {visualId: visualId});  
    }
    goFrequency(){
        !!this.props.navigation && this.props.navigation.navigate('UserFrequency',
        {cliqueId: this.state.cliqueId,uid: this.state.memberId});   
      }

      goFollowingCliques(){
        !!this.props.navigation && this.props.navigation.navigate('FollowingClique',
        {uid:this.state.memberId, follwoingSum: this.state.memberData.followingSum});   
      }
      goInCliques(){
        !!this.props.navigation && this.props.navigation.navigate('InClique',
        {uid:this.state.memberId,name:this.state.memberData.name});   
      }
    blockMember(){
        this.setState({
            showActivityIndicator: true

          }); 
        UserModel.blockUser(this.state.memberId,(res)=>{
            if(res == "0"){ 
                this.setState(
                    {  
                        showActivityIndicator:false,      
                        blockedStatus: !this.state.blockedStatus 
                    },
                    () => {
                        this.blockAlert.show();                           
                    }
                  );    
            }else{
                this.setState({
                    showActivityIndicator: false
                }); 
            }
        })
    }
    unblockMember(){
        this.setState({
            showActivityIndicator: true

          }); 
        UserModel.unblockUser(this.state.memberId,(res)=>{
            if(res == "0"){
                this.setState(
                    {  
                        showActivityIndicator: false,      
                        blockedStatus: !this.state.blockedStatus 
                    },
                    () => {
                      this.blockAlert.show();   
                     
                    }
                );           
            }else{
                this.setState({
                    showActivityIndicator: false
                }); 
            }
        })
    }
    performInvite(){
        if(this.props.currentUser.type == "single"){
            this.inviteAlert.show();
            return;

        }else{
            this.confirmAlert.show();
        }
    }
    sendInvite(){
            this.confirmAlert.hide();
        
            this.setState({
                showActivityIndicator: true
              }); 
            CliqueModel.sendInviteRequest(this.state.cliqueId,this.state.memberId,(res)=>{
                if(res == "0"){
                    this.setState({
                        showActivityIndicator: false,
                        invitedStatus: true
                      });                     
                }else{
                    this.setState({
                        showActivityIndicator: false
                      }); 
                }

            })
        
    }
    componentWillMount(){
        this.fetchRemoteMemberData();
        this.fetchRemoteReactionData();
    }
    fetchRemoteMemberData(){
        const memberId = this.state.memberId;   
        const uid = this.state.uid;  
        const cliqueId = this.state.cliqueId;
        let _this = this;
        this.setState({ isLoading: true });  
        var getMemberData = new Promise(function(resolve, reject) { 
            UserModel.getUniqueUser(memberId,snapshot => {                 
                let memberData = snapshot;
                resolve({memberData : snapshot})
            });
        });
        var getDetailMemberData = new Promise(function(resolve, reject) { 
            CliqueModel.getDetailCliqueDataPerUser(memberId,snapshot => {   
                resolve({memberDetailData : snapshot})
            });
        });        
        var getDetailSelfData = new Promise(function(resolve, reject) { 
            CliqueModel.getDetailCliqueDataPerUser(uid,snapshot => {   
                resolve({selfDetailData : snapshot})
            });
        });
        // var getInvitedCliquesIds = new Promise(function(resolve, reject) { 
        //     CliqueModel.getInvitedCliquesIds(uid,(snapshot) => {   
        //         resolve({invitedCliques : _.size(snapshot.val())})
        //     });
        // });
        

        Promise.all([getMemberData,getDetailMemberData,getDetailSelfData]).then(function(value) {
            let detailData = {};
            _.map(value,(element) =>{
                return _.extend(detailData,element);
            })
            let memberData = detailData.memberData;
            //let invitedCliques = detailData.invitedCliques;
            let memberDetailData = detailData.memberDetailData || [] ;
            let selfDetailData = detailData.selfDetailData || [] ;
                          
            let shareCliques = _.intersectionWith(memberDetailData.inCliques, selfDetailData.inCliques, _.isEqual);
            let enableBlocked = false;
            if(_.size(shareCliques) == 0){
                enableBlocked = true;
            }
            let _created = memberDetailData.inCliques.includes(cliqueId);
            let _invited = memberDetailData.inviteCliques.includes(cliqueId);
            let invitedStatus = !_invited ? !_created  ? false : true: true
            let blocked =  !!memberData.blocked_by ?
                        _.findIndex(Object.keys(memberData.blocked_by),function(element){
                            return element == uid
                        })
                    :
                     -1;   
            let blockedStatus = blocked == -1 ? false : true;
            _this.setState({
                memberData: memberData,  
                isLoading : false,   
                //enableInvite:enableInvite,  
                enableBlocked:enableBlocked,
                blockedStatus: blockedStatus,
                invitedStatus: invitedStatus,    
               // invitedCliques: invitedCliques,  
            }); 
          }, function(reason) {
            _this.setState({        
                isLoading : false,    
                //enableInvite:false,
                enableBlocked:false,
                blockedStatus: false,
                invitedStatus: false,          
            });
          });   
    }
    fetchRemoteReactionData(){
        if(!this.state.enalbleLoading){
          this.setState({         
            loading: false,
            refreshing: false,
            noData:false,
        
          });
          return;
        } 
        const counter = this.state.counter;
        const lastId =this.state.lastId;      
        const memberId = this.state.memberId;   
        this.setState({ loading: true });   
        ReactionModel.getReactionOnUser(memberId,lastId,counter,snapshot => {        
            if(_.size(snapshot) > 0){
                this.reactionData = [] ;
                snapshot.forEach((element) => { 
                    let height = 0;
                    if(element.visualType == 'text'){
                       height = visualWidth  ; 
                    }else if(element.visualType == 'link'){
                        height = visualWidth * 0.55 ; 
                     }else{
                       height = visualWidth * element.ratio ; 
                    }      
                    this.reactionData.unshift({height: height,...element});       
                });
                let lastData = _.last( this.reactionData);
                let enalbleLoading = true;
                if(_.size(snapshot) >= counter){        
                    this.reactionData.pop();
                }else{
                    enalbleLoading = false
                }    
                if(!!this.reactionList){
                    this.setState((prevState, props) => {
                        return { 
                            reactionData: [...this.state.reactionData,
                            ... this.reactionData] ,
                            loading: false,
                            refreshing: false,
                            lastId:lastData.key,
                            hasReactions: true,
                            enalbleLoading:enalbleLoading
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
    handleRefresh = () => {
        if(!!this.state.loading) return;
        this.setState(
        {  
            refreshing: true
        },
          () => {
        
            this.fetchRemoteReactionData();
          }
        );
    }
    shouldComponentUpdate(nextProps, nextState){
        if(!!nextState.loading) return false;
         return true;
    }
    handleLoadMore = () => {        
        if (!this.onEndReachedCalledDuringMomentum  && !this.state.loading) {   
            this.onEndReachedCalledDuringMomentum = true;
            this.fetchRemoteReactionData();
          
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
    showMoreActionSheet(){
        //if(!!this.state.enableBlocked){
            this.moreActionSheet.show();
       //} 
    }
    renderHeader = () =>{
        let memberData = this.state.memberData;
        
        return(
            <View style = {{paddingHorizontal : 20, }}>
                <View style = {styles.userAvatarArea}>
                    <View style={{backgroundColor: '#fff',
                        borderRadius: PHOTORADIUS,overflow: 'hidden',}}>       
                        {!! memberData.photoURL 
                        ? 
                        <CachedImage
                        source={{uri :memberData.photoURL}}
                        defaultSource =  {this.state.thumbnailContactSource}
                        fallbackSource = {this.state.thumbnailContactSource}               
                        style={styles.userAvatar}
                        />   
                        :
                        <CachedImage
                        source={this.state.thumbnailContactSource}
                        defaultSource =  {this.state.thumbnailContactSource}
                        fallbackSource = {this.state.thumbnailContactSource}               
                        style={styles.userAvatar}
                        />   
                        } 
                        
                    </View>  
                        
                    <View style = {styles.userActionContent}>     
                        {! this.state.invitedStatus
                            ? 
                        <TouchableOpacity     onPress={() => { this.performInvite()}}>   
                            <View style = {styles.editcontent}>
                                <Text style = {[styles.editcontenttext,{color: '#8A2BFE'}]}>
                                Invite
                                </Text>
                            </View> 
                        </TouchableOpacity>  
                            :
                        <View >   
                            <View style = {styles.editcontent}>
                                <Text style = {styles.editcontenttext}>
                                Invited
                                </Text>
                            </View> 
                        </View> 
                        }
                    </View> 
                
                </View> 
                <View style = {{marginBottom:10}}>
                    <View style = {styles.itemtextArea}>
                        <View style={styles.itembackdropView}>
                            <Text style={styles.itemNameline}>{memberData.name || ''}</Text>
                        </View>
                        <View style={styles.itemLocationdropView}>
                            <Text style={styles.itemheadline}>{memberData.description || ''}</Text>
                        </View>
                    
                    
                    </View>    
                    <View style = {styles.actionArea}>
                    
                        {/* <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => {}}>
                        <Text style = {styles.sumTextArea }>{this.state.userData.visualSum || 0}</Text>
                        <Text style = {styles.sumTitleTextArea }>{"  "}visuals{"  "}</Text>
                        </TouchableOpacity>       */}
                        {/* <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  
                            onPress={() => { this.inviteNumAlert.show()}}>
                            <Text style = {styles.sumTextArea } >{ (this.state.invitedCliques ||  0 )}</Text>
                            <Text style = {styles.sumTitleTextArea }>invites</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => { this.goFrequency()}}>
                        <Text style = {styles.sumTextArea } >{
                            (memberData.givenFreqSum || 0 )+ 
                            (this.state.invitedCliques ||  0 )}
                            </Text>
                        <Text style = {styles.sumTitleTextArea }>frequency</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => { this.goFrequency()}}>
                            <Text style = {styles.sumTextArea } >
                            {((memberData.givenFreqSum + memberData.followingSum) || 0 )}
                            </Text>
                            <Text style = {styles.sumTitleTextArea }>frequency</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white',marginLeft:20}]}
                          onPress={() => {this.goFollowingCliques()}}>
                        <Text style = {styles.sumTextArea } >{memberData.followingSum || 0}</Text>
                        <Text style = {styles.sumTitleTextArea }>following{" "}</Text>
                        </TouchableOpacity> 
                    </View>  
                    <View  style={{ height: 1,width: "100%",
                    marginTop: 15,backgroundColor: "#DDDDDD",}}/>
                        <Text style = {styles.visualTitleText}>Reactions</Text>
                        {!this.state.hasReactions &&
                            <View style = {styles.visualcontent}>
                                <View style={styles.noreactionArea}>  
                                <Image style = {{width: 138, height: 30}} source = {Images.reaction_696x150}></Image>
                                <Text style={[styles.itemheadline,{marginTop: 10, fontWeight: 'bold'}]}>Reactions to visuals</Text>
                                    <Text style={[styles.itemheadline,{ fontWeight: 'bold'}]}>will appear here.</Text>
                                </View> 
                            </View>
                        }
                </View>
            </View>
        );
    }
    render() {
        let isLoading = this.state.isLoading;
        let memberData = this.state.memberData;
        return (
            <FullScreen 
            style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
              
            <CustomNavigator
                leftButton = {
                    <View style = {{ flexDirection : 'row'}}>
                    <Image source={Images.BackChevronLeft_Black_9x16} style = {{marginLeft:2,marginTop : 4,}}/>
                    <Text style={{ fontFamily:'SF UI Text', fontSize: 17, marginLeft:10, fontWeight:'bold'}}>
                    {this.state.title}
                    </Text>
                    
                  </View>
                
                }   
                rightButton = {<Image source={Images.More_1125x250} 
                 style = {{opacity:  1,width:23,height:5}}/>}      
            onLeftButtonPress = {() =>this.goBack() }  
            onRightButtonPress = {() => this.showMoreActionSheet()}  
            >
           
            </CustomNavigator>
           
            <MasonryList    
              data={this.state.reactionData}  
              ref={ref => this.reactionList = ref}
              renderItem={({ item }) =>this.renderReactionItem(item)}
              horizontal = {false}
              keyExtractor={item => item.key}
              ListHeaderComponent={this.renderHeader}
              onEndReachedThreshold={0}       
              style = {{width:'100%'}}  
              refreshing={this.state.refreshing}
              
              onEndReached={this.handleLoadMore}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator ={false}      
              numColumns={5}
              getHeightForItem={({ item }) => item.height + 2}
              onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}                         
          />  
            <Alert ref={ref=>this.inviteNumAlert=ref} 
             style={{backgroundColor:'#24D770'}}            
             isStatic = {false}
             text={['Total amount of clique invites','this individual has been sent.']}
             closeButtonSource = {Images.check_17x13}
             onRequestClose={() => this.inviteAlert.hide()}/>

          
            <Alert ref={ref=>this.inviteAlert=ref} 
             style={{backgroundColor:'#EF4244'}}            
             isStatic = {false}
             text={['You have to be in a clique', 'to Invite this user.']}
             closeButtonSource = {Images.check_17x13}
             onRequestClose={() => this.inviteAlert.hide()}/>

            <Alert ref={ref=>this.confirmAlert=ref} 
                style={{backgroundColor:'#9E4FFF'}} 
                isStatic = {true}
                text={['Invite this person to join','your clique?']}
                closeButtonSource = {Images.check_17x13}
                cancleButtonSource = {Images.Cancel_White_13x13}
                onRequestCancle ={() => this.confirmAlert.hide()}
                onRequestClose = {() => this.sendInvite()}/>

            <Alert  ref={ref=>this.blockAlert=ref} 
                style={{backgroundColor: !!this.state.blockedStatus ? '#EF4244':'#9E4FFF'}} 
                title = {""}
                text={!!this.state.blockedStatus 
                    ?  ['This individual has been blocked and cannot view your page.']
                    :  ['You unblocked this individual']
                    }
                closeButtonSource = {Images.check_17x13}
                onRequestClose={() => this.blockAlert.hide()}/>   
            <Alert  ref={ref=>this.successAlert=ref} 
                style={{backgroundColor:'#9E4FFF'}} 
                title = {"Sent invite!"}
                text={['Once individual accepts invitation it will be official.']}
                closeButtonSource = {Images.check_17x13}
                onRequestClose={() => this.successAlert.hide()}/>
            <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />
            {/* this.state.enableBlocked */}
                <Options ref={ref=>this.moreActionSheet=ref}   
                    style = {{ paddingBottom: 20}}
                    items={
                        !!this.state.enableBlocked ?
                            !this.state.blockedStatus  ?
                                [  { value: 0, text: 'View cliques'},{ value: 1, text: 'Block'},] 
                            :
                                [ { value: 0, text: 'View cliques'}, { value: 1, text: 'UnBlock'}] 
                        :
                            [ { value: 0, text: 'View cliques'}] 
                        }

                    onSelectItem={(item) => { 
                        if(item.value == 1){
                            this.moreActionSheet.hide(); 
                            if(!this.state.blockedStatus){
                                this.blockMember();
                            }else{
                                this.unblockMember();
                            }
                        
                        }else if(item.value == 0){
                            this.moreActionSheet.hide(); 
                            this.goInCliques();
                        }
                        return false; }} 
                />
        </FullScreen>
        );
    }
    renderReactionItem(item){
        let reactionStyle = { height: item.height, width: visualWidth,};      
        
        return (
          <TouchableOpacity activeOpacity = {1}    onPress={() => {this.goVisualDetails(item.visualId) }}>    
            <View  style={[styles.itemcontainer,reactionStyle]}>
    
            {item.visualType == 'text' ? 
             <View style = {[styles.itemtextcontainer,]}>         
                <Text style = {styles.itemtextcontent}> 
                {item.text.length > 21 ? item.text.substr(0,20) + "..." :item.text }

                </Text>               
            </View>  
            
            : 
                <CachedImage
                source={{ uri: item.photoURL}}
                defaultSource =  {{ uri:this.state.thumbnailSource}}
                fallbackSource = {{ uri:this.state.thumbnailSource}}                
                style={{width:reactionStyle.width,
                    height: reactionStyle.height}}
                />   
            }
               
            </View>
            {/* <View style = {styles.reactionStatus}>
                  {item.type == "liked" && <Image source = {Images.Like_Red_17x17}/>}
                  {item.type == "disliked" && <Image source = {Images.Dislike_Brown_17x17}/>}
                  {item.type == "commented" && <Image source = {Images.Comment_Blue_17x17}/>}
                  {item.type == "shared" && <Image source = {Images.Share_Yellow_17x17}/>}
    
                  <Text style = {{marginLeft: 5 ,fontWeight:'bold'}}>{item.type}  </Text>
                </View> */}
             
          </TouchableOpacity>    
        ); 
        
      }
};
const styles = StyleSheet.create({  
    userAvatarArea:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',   
        marginTop:10,
      
      
      },
      userAvatar: {
        width: PHOTOSIZE ,
        height: PHOTOSIZE ,
      },
      userActionContent: {
        width: '100%' ,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        marginTop: -18,
      },
    
      editcontent: {
        borderColor : "#BBBBBB",
        borderWidth: 1,
        height:35,
        width: 165,
        marginRight: 15,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        
        
      },
      editcontenttext: {
        justifyContent: 'center',
        alignSelf: 'center',    
        elevation: 1,
        fontWeight: 'bold',
        color: '#BBBBBB',
      },
      itemtextArea: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-start',   
        marginTop: 30,
       // paddingLeft : 30,
       // paddingBottom: 20,
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
      cliquefrequenceText:{ 
        textAlign: 'center',
        fontSize: 13,
        fontWeight: 'bold',
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
        textDecorationColor: '#bbbbbb',
        color:'#bbbbbb' 
      
      },
      itembackdropView: {
       
        width: '100%',
        //marginBottom: 4,    
        justifyContent: 'flex-end',
        alignItems: 'flex-start',   
      },
      itemLocationdropView: {
        marginTop: 5,
        width: '100%',
       // marginBottom: 4,    
        justifyContent: 'center',
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
        color: '#000000'
      },
      itemcontainer: {    
        alignItems: 'stretch', 
        margin: 7,
        marginBottom:10,
     },
     actionArea: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 20,
        
      },
      actionItemArea: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        
      },
      sumTextArea:{
        textAlign: 'center',
        fontWeight: 'bold',
      },
      sumTitleTextArea:{
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#bbbbbb',
        marginLeft:5,
        
      },
      itemtextcontainer: {     
        flex: 1,
        justifyContent: 'flex-start',
        paddingHorizontal: 10, 
        paddingTop: 10,
        alignItems: 'flex-start',
        backgroundColor: '#F4F4F4',
      },
      itemtextcontent: {
        fontSize: 10,
        textAlign: 'left',
      },
    itemlinkcontainer: {
    
      justifyContent: 'center',   
      alignItems: 'center',   
      backgroundColor: '#F3F3F3',
      width: visualWidth,
      height: visualWidth * 0.75   
     },
     itemlinkbottom: {
     
     justifyContent: 'center',   
       alignItems: 'flex-end',   
       backgroundColor: '#E8E8E8',
       width: visualWidth,
       height: visualWidth * 0.25     
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
         marginTop:30,
         marginBottom: 15,
     },
     visualcontent: {
       marginTop: 20,
       marginBottom: 10,
     },
     noreactionArea:{
      flex:1,
      flexDirection: 'column', 
      justifyContent: 'center',
      alignItems : 'center',
      marginTop: 30,
     },
     reactionStatus:{
        flex:1,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems : 'center',
        marginLeft: 14,
      
     }
});
function mapStateToProps(state) {
    return {
      currentClique: state.currentClique,
      currentUser: state.currentUser
      
    }
}
  
export default connect(mapStateToProps) (MemberView);
