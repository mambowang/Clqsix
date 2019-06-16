
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
  Alert,  
  Images,
  KeyboardSpacer,
  
} from '../../../../components';
import {  CachedImage } from 'react-native-cached-image';

import { connect } from 'react-redux';
import {VisualModel,CliqueModel,UserModel} from '../../../../models';


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import * as globals from '../../../../common/Global';

import _ from 'lodash';

class ViewRequest extends Component {
    onEndReachedCalledDuringMomentum = true;
    deleteInviteId = null;
    constructor(props) {
        super(props);
        this.state = {
            counter: globals.smallLoadCount,
            lastId: null,
            loading: false,
            refreshing: false,
            thumbnailOfflineSource: Images.contact_icon_50x50,      
            thumbnailSource: globals.thumbnailContactSource,     
            inviteCliqueData: [],         
            inviteFriends: [],          
            uid:this.props.currentUser.uid,
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
        this.setState({ loading: true });   
        let inviteCliqueData = [] ; 
        CliqueModel.getInvitedCliques(lastId,counter,snapshot => {
          if(_.size(snapshot) > 0){
            inviteCliqueData = _.reverse(snapshot);     
            let lastData = _.last(inviteCliqueData);
            let enableLoading = true;
            if(_.size(snapshot) >= counter){
                inviteCliqueData.pop();  
            }else{
                enableLoading = false
            }            
            inviteCliqueData = _.map(inviteCliqueData, function(e) {
               // console.log(e);
              return _.extend(e, {status: "ready",key: e.key});
            });
            if(!!this.inviteList){
                this.setState({
                    inviteCliqueData: [...this.state.inviteCliqueData,
                    ...inviteCliqueData] ,           
                  lastId:lastData.key,
                  loading: false,
                  refreshing: false,
                  noData:false,
                  enableLoading: enableLoading,
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
    goClique(cliqueId){
        !!this.props.navigation && this.props.navigation.navigate('CliqueRoot',
        {cliqueId: cliqueId});  
    }
    acceptRequest(slectedCliqueId){
        
         const cliqueId = slectedCliqueId;
         CliqueModel.acceptInviteClique(cliqueId,success => {
            let inviteCliqueData = this.state.inviteCliqueData;
            var index = _.findIndex(inviteCliqueData, function(e) {
              return e.key == slectedCliqueId;
            });
            inviteCliqueData[index].status = 'accept';         
            if(!!this.inviteList){  
                this.setState({         
                inviteCliqueData : inviteCliqueData,
                }); 
            } 
            this.acceptAlert.show();

         });
       
    }
    deleteConfirmRequest(slectedCliqueId){
        this.deleteInviteId = slectedCliqueId;
        this.deleteAlert.show();
    }
    deleteRequest(){        
        const cliqueId = this.deleteInviteId;
        CliqueModel.deleteInviteClique(cliqueId,success => {
            let inviteCliqueData = this.state.inviteCliqueData;
            var index = _.findIndex(inviteCliqueData, function(e) {
              return e.key == cliqueId;
            });
            inviteCliqueData[index].status = 'delete';        
            if(!!this.inviteList){   
                this.setState({         
                inviteCliqueData : inviteCliqueData,
                });  
            }
            this.deleteInviteId = null;
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
             <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:8, fontWeight:'bold'}}>Invites</Text>
             </CustomNavigator>   
             <View style = {styles.container}>
                <View style={styles.topview}>                   
                    <Text style={styles.topfont}>People who want you to </Text>
                    <Text style={styles.topfont}>join their clique</Text>                    
                </View>
                {!this.state.hasRequest ? 
                <View style = {styles.norequestcontent}>
                    <Image source={Images.blank_250x250} style = {{width:50,height:50}}/>
                    <Text style = {styles.contenttext}>
                              
                    </Text>
                    <Text style = {styles.contenttext}>
                    No invites yet              
                    </Text>
                 
                </View>
                :
               
                        <FlatList
                            ref={ref => this.inviteList = ref}
                            data={this.state.inviteCliqueData}
                            style={{height: 400, marginTop:50,   }}                             
                            renderItem={({item}) =>this.renderItem(item)}         
                            onEndReachedThreshold={1}    
                            keyExtractor={item => item.key}
                            ItemSeparatorComponent={this.renderSeparator}
                            
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
             title = {"CONGRATULATIONS!!!"}
             isStatic = {false}
             text={['You’re in a clique now. Have fun and achieve those squad goals.']}
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
        if(item.status == 'ready'){
            return this.renderCliqueItem(item);
        }
    }
    renderCliqueItem(item) {
        return (
           
            <View style={styles.itemcontainer}>      
                <TouchableOpacity style = {styles.memberviewArea}  onPress={() => {this.goClique(item.key)}}>  
                    {!item.avatar ? 
                        <Image source= { this.state.thumbnailOfflineSource} style = {styles.imagestyle}/>            
                        :
                        <View style={{
                            backgroundColor: '#fff',
                            borderRadius: 25,
                            overflow: 'hidden',
                        }}>
                            <CachedImage
                                source={{ uri: item.avatar.uri}}
                                style={styles.imagestyle}
                                defaultSource =  {{ uri:this.state.thumbnailSource}}
                                fallbackSource = {{ uri:this.state.thumbnailSource}}
                                />
                        
                        </View>

                    
                    }

                    <View style = {styles.namecontent}>
                        <Text style = {styles.itemtext}>{item.name  || ''}</Text>
                    </View> 
                </TouchableOpacity>
                <View style = {styles.actionarea}>
                    <TouchableOpacity  onPress={() => {this.acceptRequest(item.key)}}>    
                        <View style = {styles.acceptLink} >
                            <Text style = {styles.acceptLinkText}>Join</Text>
                        </View>   
                    </TouchableOpacity>
                    <TouchableOpacity  onPress={() => {this.deleteConfirmRequest(item.key)}}>    
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
        height: 1,
        width: "100%",
        backgroundColor: "#EEEEEE",
       
      },
    itemcontainer: {
        flex: 1,
        flexDirection: 'row', 
        paddingHorizontal: 20,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 12,
        // borderBottomWidth:1, 
        // borderColor:'#EEEEEE', 
     
      
      
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

