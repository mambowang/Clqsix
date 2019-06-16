
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
    FlatList,
    ActivityIndicator,
    StatusBar
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
  KeyboardSpacer,  
  Alert,
} from '../../../components';
import { connect } from 'react-redux';
import {VisualModel,CliqueModel,UserModel} from '../../../models';


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import _ from 'lodash';
import * as globals from '../../../common/Global';
import {  CachedImage } from 'react-native-cached-image';
import { style } from 'react-native-google-place-autocomplete/lib/AutocompleteInput';


class ViewRequest extends Component {
    onEndReachedCalledDuringMomentum = true;
    deleteRequestId = null;
    requestUserData = [];
    constructor(props) {
        super(props);
        this.state = {
            counter: globals.smallLoadCount,
            lastId: null,
            loading: false,
            refreshing: false,
            thumbnailOfflineSource: Images.contact_icon_50x50,      
            thumbnailSource: globals.thumbnailContactSource,    
            requestUserData: [],         
            inviteFriends: [],          
            uid:this.props.currentUser.uid,
            cliqueId: this.props.currentClique.lastCliqueId, 

            enableLoading: true,
            hasRequest: true,
        }
    }
    fetchRemoteData() {
        if(!this.state.enableLoading){
            this.setState({         
                loading: false,
                refreshing: false,
                noData:false,             
              });
            return;
        }
        const counter = this.state.counter;
        const lastId = this.state.lastId;
        const cliqueId = this.state.cliqueId;
        const uid = this.state.uid;
        this.setState({ loading: true });   
       
        CliqueModel.getRequestUsers(lastId,cliqueId,counter,snapshot => {
            this.requestUserData = [] ; 
          if(_.size(snapshot) > 0){
            this.requestUserData = _.reverse(snapshot);     
            let lastData = _.last(this.requestUserData);
            let enableLoading = true;
            if(_.size(snapshot) >= counter){
                this.requestUserData.pop();  
            }else{
                enableLoading = false;
            }            
            _.map(this.requestUserData, function(e) {
                let blocked =  !!e.blocked_by ?
                _.findIndex(Object.keys(e.blocked_by),function(blockUsers){
                    return blockUsers == uid
                  })
                  :
                  -1; 
                let blockedBy = blocked == -1 ? false : true;      
                let block =  !!e.block_users ?
                _.findIndex(Object.keys(e.block_users),function(blockUsers){
                    return blockUsers == uid
                  })
                  :
                  -1; 
                let blockMe = block == -1 ? false : true;
              return _.extend(e, {status: "ready",
              blockMe:blockMe,
              blockedBy:blockedBy,
              key: e.uid});
            });
            if(!!this.requestList){
                this.setState({
                    requestUserData: [...this.state.requestUserData,
                    ...this.requestUserData] ,           
                  lastId:lastData.uid,
                  loading: false,
                  refreshing: false,
                  noData:false,
                  enableLoading: enableLoading
                });
            }
            
          }else{
            this.setState({         
              loading: false,
              refreshing: false,
              noData:false,   
              hasRequest: false          
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
            this.fetchRemoteData();
          }
        );
    }    
    handleLoadMore = () => {
        if (!this.onEndReachedCalledDuringMomentum) {       
                this.fetchRemoteData();
            this.onEndReachedCalledDuringMomentum = true;
        }
    }
    componentDidMount(){       
        this.fetchRemoteData();
    } 
    shouldComponentUpdate(nextProps, nextState){
        // if(!!nextState.loading) return false;
          return true;
    }
    
    goBack() {
        const { navigation } = this.props;
        navigation.goBack();       
    }
    goMemberView(memberId){
        !!this.props.navigation && this.props.navigation.navigate('MemberRoot',
        {memberId: memberId});  
    }
    acceptRequest(slectedUserId){
         const cliqueId = this.state.cliqueId;
         CliqueModel.acceptRequestUser(cliqueId,slectedUserId,success => {
            let requestUserData = this.state.requestUserData;
            var index = _.findIndex(requestUserData, function(e) {
              return e.uid == slectedUserId;
            });
            requestUserData[index].status = 'accept';  
            if(!!this.requestList){         
                this.setState({         
                requestUserData : requestUserData,
                }); 
            } 
            this.acceptAlert.show();

         });
       
    }
    deleteConfirmRequest(slectedUserId){
        this.deleteRequestId = slectedUserId;
        this.deleteAlert.show();
    }
    deleteRequest(){        
        let slectedUserId = this.deleteRequestId;
        const cliqueId = this.state.cliqueId;
        CliqueModel.deleteRequestUser(cliqueId,slectedUserId,success => {
            let requestUserData = this.state.requestUserData;
            var index = _.findIndex(requestUserData, function(e) {
              return e.uid == slectedUserId;
            });
            requestUserData[index].status = 'delete';    
            if(!!this.requestList){       
                this.setState({         
                requestUserData : requestUserData,
                });  
            }
            this.deleteRequestId = null;
            this.deleteAlert.hide();

        });
       
    }
    renderSeparator = () => {
        return (
          <View style={styles.headercontent} />
        );
    };
    renderFooter = () => {
        if (!this.state.loading) return null;
        return (
          <View style={styles.footcontent}>
               <ActivityIndicator animating size="large" /> 
          </View>
        );
    };
    render() {
        //console.log("render");
        return (
            <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff'}}>
            <CustomNavigator
                 leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
                 rightButton={<Image   style = {{opacity :0}}  source={Images.BackChevronLeft_Black_9x16}/>}
                    onLeftButtonPress = {() => this.goBack()}
             >
             <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:8, fontWeight:'bold'}}>Requests</Text>
             </CustomNavigator>   
             <View style = {styles.container}>
                <View style={styles.topview}>                   
                    <Text style={styles.topfont}>People who want to be</Text>
                    <Text style={styles.topfont}>in your clique</Text>                    
                </View>
                {!this.state.hasRequest ? 
                <View style = {[styles.norequestcontent,{}]}>
                    <Image source={Images.blank_250x250} style = {{width:50,height:50}}/>
                    <Text style = {styles.contenttext}>
                              
                    </Text>
                    <Text style = {styles.contenttext}>
                    No requests yet              
                    </Text>
                 
                </View>
                :
             
                        <FlatList
                            ref={ref => this.requestList = ref}
                            data={this.state.requestUserData}
                            style={{height: 400, marginTop:50,   borderTopWidth:1, 
                                borderColor:'#EEEEEE', }}   
                            renderItem={({item}) =>this.renderItem(item)}         
                            onEndReachedThreshold={1}    
                            keyExtractor={item => item.uid}
                            ListFooterComponent={this.renderFooter}
                            onRefresh={this.handleRefresh}
                            refreshing={this.state.refreshing}
                            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator ={false}   
                        />
               
                }

            </View>
            <Alert ref={ref=>this.acceptAlert=ref} 
             style={{backgroundColor:'#24D770'}} 
             title = {"HIGH FIVE!"}
             isStatic = {false}
             text={['You have a new clique member.','Have fun and achieve those squad goals.']}
             closeButtonSource = {Images.check_17x13}
             onRequestClose={() => this.acceptAlert.hide()}/>


            <Alert ref={ref=>this.deleteAlert=ref} 
             style={{backgroundColor:'#EF4244'}} 
             isStatic = {true}
             text={['Are you sure?']}
             closeButtonSource = {Images.check_17x13}
             cancleButtonSource = {Images.Cancel_White_13x13}
             onRequestCancle ={() => this.deleteAlert.hide()}
             onRequestClose = {() => this.deleteRequest()}/>
            </FullScreen>
        );
    }
    renderItem(item){
        if(item.status == 'ready' && !item.blockedBy && !item.blockMe ){
            return this.renderUserItem(item);
        }
    }
    renderUserItem(item) {
        return (
           
            <View style={styles.itemcontainer}>  
                <TouchableOpacity style = {styles.memberviewArea}  onPress={() => {this.goMemberView(item.uid)}}>   
                    {!item.photoURL ? 
                        <Image source={this.state.thumbnailOfflineSource} style = {styles.imagestyle}/>            
                        :
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 25,
                            overflow: 'hidden',
                        }}>
                            <CachedImage
                            source={{ uri:  item.photoURL,}}
                            defaultSource =  {{ uri:this.state.thumbnailSource}}
                            fallbackSource = {{ uri:this.state.thumbnailSource}}
                            
                            style={styles.imagestyle}
                            />
                        </View>
                        
                    }
                    <View style = {styles.namecontent}>
                        <Text style = {styles.itemtext}>{item.name || ''}</Text>
                    </View> 
                </TouchableOpacity>
                <View style = {styles.actionarea}>
                    <TouchableOpacity  onPress={() => {this.acceptRequest(item.uid)}}>    
                        <View style = {styles.acceptLink} >
                            <Text style = {styles.acceptLinkText}>Accept</Text>
                        </View>   
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => {this.deleteConfirmRequest(item.uid)}}>    
                        <View style = {styles.deleteLink} >
                            <Text style = {styles.deleteLinkText}>Delete</Text>
                        </View>   
                    </TouchableOpacity>
                </View>
               
            </View>  
           
           
           
        )
    }//
}
const contentPaddingHorizontal = 20;

const styles = StyleSheet.create({   
    container: {
        flex: 1,
        width: '100%' ,
        // paddingHorizontal: contentPaddingHorizontal,
        marginTop:30      
      },
    topview: {
        justifyContent: "center",
        alignItems:'flex-start',
        marginLeft :25,
        paddingHorizontal: 40,
        marginRight: 110,
        backgroundColor: '#1d1d1d',
        height: 70,
      },
    topfont: {
        fontFamily: 'SF UI Text', 
        fontSize: 13, 
        color: '#ffffff', 
        fontWeight: 'bold',
      },
      norequestcontent: {
        flex:1,
        marginTop: -80,
        backgroundColor: '#ffffff00',
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems : 'center',
        
      },
      contenttext: {   
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        color: 'black',
        marginTop:3
        
      },
    requestContent: {
        marginTop:10
    },
    footcontent: {
        paddingVertical: 20,
        borderTopWidth:1,
        borderColor: "#CED0CE"
      },
    headercontent: {
        height: 10,          
        backgroundColor: "#FFFFFF", 
      },
    itemcontainer: {
        flex: 1,
        flexDirection: 'row', 
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth:1, 
        borderColor:'#EEEEEE', 
      
      },
    memberviewArea:{
        flex: 1,
        flexDirection: 'row',      
        justifyContent: 'flex-start',
        alignItems: 'center',
      
    },
    imagestyle:{
        width: 50,
        height: 50
      },
    namecontent:{
        marginLeft:20,
        maxWidth:150,
      },
    itemtext: {
        fontWeight: 'bold',
      },
    actionarea: {
        flex:1,
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },
    acceptLink: {
        borderColor : "#24D770",
        backgroundColor: "#24D770",
        borderWidth: 1,
        height:25,     
        width: 60, 
        marginRight:10,
        
      },
    acceptLinkText: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 5,
        paddingBottom: 3,
        elevation: 1,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 11,
      },
      deleteLink: {
        borderColor : "#E72A35",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        height:25,     
        width: 60, 
        marginRight:10,
        
      },
      deleteLinkText: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 5,
        paddingBottom: 3,
        elevation: 1,
        color: '#E72A35',
        fontSize: 11,
        fontWeight: 'bold',
      },
      
})
function mapStateToProps(state) {
    return {
      currentUser: state.currentUser,
      currentClique: state.currentClique
    }
  }
export default connect(mapStateToProps)(ViewRequest)
