'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
    StyleSheet,
    View,
    TouchableOpacity,
   
    Image,
    ScrollView,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Alert,
    Modal,
    FlatList,
    ActivityIndicator,
    Keyboard
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
  
} from '../../components';
import {
  AuthAPI
} from '../../utils';
import {VisualModel,CliqueModel,UserModel} from '../../models';


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import _ from 'lodash';
import * as globals from '../../common/Global';
import {  CachedImage } from 'react-native-cached-image';
import update from 'immutability-helper';



class FindFriend extends Component {
    constructor(props) {
        super(props);
        this.state = {      
            loading: false,
            refreshing: false,
            thumbnailSource: Images.contact_icon_50x50,
            sharing: false,
            freindData: [],
            originalFriendData: [],
            inviteFriends: [],
            enableCreate: true,
            uid:this.props.currentUser.uid || '', 
            enalbleLoading : true,
            cliqueId: this.props.currentClique.lastCliqueId,

            showActivityIndicator: false,
            
            
        }
    }
    goBack() {
        const { navigation } = this.props;   
        navigation.goBack();       
    }
    fetchRemoteData() {
        if(!this.state.enalbleLoading){
        this.setState({         
            loading: false,
            refreshing: false,
            noData:false,    
        });
        return;
        }   
        this.setState({ loading: true });   
        let freindData = [] ; 
        let cliqueId = this.state.cliqueId;
        UserModel.getFullFriend(snapshot => {
            if(_.size(snapshot) > 0){
                this.freindData = snapshot;   
                CliqueModel.getInvitedUserIds(cliqueId, snapshot =>{
                    let invitedFriendIds = _.keys(snapshot.val());   
                    this.freindData = _.map(this.freindData, function(friend) {
                        var index = _.findIndex(invitedFriendIds, function(e) {
                            return e == friend.uid;
                        });
                        let inviteStatus = index == -1 ? false: true;
                        return _.extend(friend, {inviteStatus: inviteStatus});
                    });
                    this.setState({
                        freindData: [...this.state.freindData,
                        ...this.freindData] ,
                        originalFriendData: [...this.state.freindData,
                        ...this.freindData] ,
                        loading: false,
                        refreshing: false,
                        noData:false,
                    });
                });
            
            }else{
                this.setState({         
                loading: false,
                refreshing: false,
                noData:false,
                enableCreate:false
                });
            }
        });
    }
    componentDidMount(){
        this.fetchRemoteData();       
    }  
    render() {
        return (
            <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
            <CustomNavigator
                leftButton = {<Image source={Images.BackChevronLeft_Black_9x16}/>}   
                rightButton = {<Image source={Images.More_1125x250} style = {{opacity: 0,width:23,height:5}}/>}      
                onLeftButtonPress = {() =>this.goBack()}        
                >     
            
            </CustomNavigator>
            <View style = {styles.container}>
              <View> 
                <ClqsixTextInput         
                  ref={ref=>this.search=ref} 
                  placeholder='Search friends'
                  placeholderTextColor = {"#acacac"}                  
                  onChangeText={(text) => this.searchText({text}) }
                  needValidation={false}
                  textStyle = {styles.searchText}    
                  style={styles.search}
                  onSubmitEditing={() =>  Keyboard.dismiss()}
                />
              </View>              
                  

               {!this.state.enableCreate ?
                <View style = {styles.nofriendcontent}>
                
                    <Image source={Images.sad_50x52}/>
                    <Text style = {styles.contenttext}>
                              
                    </Text>
                    <Text style = {styles.contenttext}>
                    No friends yet. Add friends                
                    </Text>
                    <Text style = {styles.contenttext}>
                    to create a new clique.
                    </Text>
                </View>
                :
              <View style = {styles.friendcontent}>
                  <FlatList
                    data={this.state.freindData}
                    style={{minHeight: 500}} 
                    renderItem={({ item }) =>this.renderFriendItem(item)}         
                    ListHeaderComponent={this.renderHeader}
                    keyExtractor={item => item.uid}
                    ListFooterComponent={this.renderFooter}
                    ItemSeparatorComponent={this.renderSeparator}  
                    refreshing={this.state.refreshing}
                    
                  />
              </View>
              } 
            </View> 
            <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />
        </FullScreen>
        );
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
              { <ActivityIndicator animating size="large" /> }
          </View>
        );
    };
    renderFriendItem(item) {
        return (        
            
            <View style={styles.itemcontainer}>  
                <TouchableOpacity     onPress={() => {}} style = {styles.infocontent}>  
                  {!item.url ? 
                    <Image source={this.state.thumbnailSource} style = {styles.imagestyle}/>            
                    :
                    <CachedImage
                    source={{ uri:  item.url}}
                    defaultSource =  {{ uri:this.state.thumbnailSource}}
                    fallbackSource = {{ uri:this.state.thumbnailSource}}                    
                    style={styles.imagestyle}
                  />           
                  }
                  <View style = {styles.namecontent}>
                      <Text style = {styles.itemtext}>{item.name || ''}</Text>
                  </View> 
                </TouchableOpacity   >    
                <View style = {styles.invitearea} >
                  {!item.inviteStatus ? 
                    <TouchableOpacity     onPress={() => {this.sendInvite(item.uid) }}>    
                    <View style = {styles.invitecontent} >
                        <Text style = {styles.invitecontenttext}>Invite</Text>
                    </View>          
                    </TouchableOpacity>  :
                    
                      <View style = {styles.invitedcontent} >
                        <Image source={Images.rectangle_15x3}/>            
      
                      </View>   
                    
                  }       
                </View>  
              </View>  
        )
    }
    searchText = (e) => {
        let text =  e.text.toLowerCase()    
        let trucks = this.state.originalFriendData
        let filteredName = trucks.filter((item) => {
          return !!item.name && item.name.toLowerCase().match(text)
        })
        if (!text || text == "") {
          this.setState({
            freindData: this.state.originalFriendData
          })
        } else if (!Array.isArray(filteredName) && !filteredName.length) {
          // set no data flag to true so as to render flatlist conditionally
          this.setState({
            noData: true
          })
        } else if (Array.isArray(filteredName)) {
          this.setState({
            noData: false,
            freindData: filteredName
          });
        }
    }
    changeInvitedStatus(userId){
      var index = _.findIndex( this.state.freindData, function(e) {
        return e.uid == userId;
       });      
       if(index != -1){
        this.setState({
          freindData: update(
              this.state.freindData,
              {
                [index]:{
                  inviteStatus : { $set: true },  
                }
               
              }
            )
            
          });  
       }
    }
    sendInvite(userId){
      let cliqueId = this.state.cliqueId;
      this.changeInvitedStatus(userId);
      // this.setState({
      //   showActivityIndicator: true
      // });
      // CliqueModel.addInvitedUserToClique(cliqueId,userId,res=>{
      //   this.setState({
      //     showActivityIndicator: false
      //   });
      //   if(res == "true"){
      //       this.changeInvitedStatus(userId);
      //   }
      // });
    }

};
const contentPaddingHorizontal = 20;

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        width: '100%' ,
        paddingHorizontal: contentPaddingHorizontal,
        marginTop:30
      
      },
      friendcontent:{
        marginTop:10
      
      },
      searchText:{
        fontWeight: 'bold'
      },
      search: {
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderColor:'#e8e8e8', 
      },
      topcontenttext: {
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
        color: 'black',
        marginTop:30
        
      },
      contenttext: {   
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        color: 'black',
        marginTop:3
        
      },
      footcontent: {
        paddingVertical: 20,
        borderTopWidth: 0,
        borderColor: "#CED0CE"
      },
      headercontent: {
        height: 10,          
        backgroundColor: "#FFFFFF", 
      },
      nofriendcontent: {
        flex:1,
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems : 'center',
        
      },
      itemcontainer: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 5,
      
      },
      infocontent: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
      
      },
      imagestyle:{
        width: 50,
        height: 50
      },
      buttonWrapper: {
          marginTop: 70,
          marginLeft: 20,
          marginRight:20,
          flexDirection: 'column',
          backgroundColor: '#00CCFF',
          borderRadius: 4
      },
      namecontent:{
        marginLeft:20,
      },
      itemtext: {
        fontWeight: 'bold',
      },
      buttonText: {
          justifyContent: 'center',
          alignSelf: 'center',
          marginTop: 10,
          marginBottom: 10,
          marginHorizontal: 20,
          elevation: 1,
          color: '#FFFFFF'
      },
      invitearea: {
       
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        width: 80
      },
      invitecontent: {
        borderColor : "#9D4FFF",
        borderWidth: 1,
        height:25,
        width: 80
        
      },
      invitecontenttext: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 3,
        paddingBottom: 3,
        paddingHorizontal: 10,
        elevation: 1,
        color: '#9D4FFF',
        fontWeight: 'bold',
      },
      invitedcontent: {
        borderColor : "grey",
        borderWidth: 1,
        height:25,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
      },
      invitedcontenttext: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 3,
        paddingBottom: 3,
        paddingHorizontal: 10,
        elevation: 1,
        color: 'grey',
        textDecorationLine : 'line-through',
      },
});
function mapStateToProps(state) {
    return {
      currentUser: state.currentUser,
      currentClique: state.currentClique
    }
}
export default connect(mapStateToProps)(FindFriend)