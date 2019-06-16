'use strict';

import React, { Component } from 'react';
import {StyleSheet,View,TouchableOpacity, Image, Dimensions, Alert, 
  Modal,FlatList, ActivityIndicator,Keyboard
} from 'react-native';

import { Button, ClqsixTextInput, Text,  FullScreen,  Options, Images,KeyboardSpacer,ScrollView
} from '../../../components';
import {
  AuthAPI
} from '../../../utils'
import {UserModel} from '../../../models'

import _ from 'lodash';
import {  CachedImage } from 'react-native-cached-image';
import fb from '../../../utils/FirebaseAPI'
import update from 'immutability-helper';
const { height, width } = Dimensions.get('window');
import * as globals from '../../../common/Global';
import { connect } from 'react-redux'
import { clickMember,blank } from '../../../actions/statusActions'

const borderSize = (width - 28) / 2 ;
const borderRadius = borderSize/2;
class MemberList extends Component {
    userData = [];  
    onEndReachedCalledDuringMomentum = true;
    activeUserRef = null;
    constructor(props) {
        super(props);
        this.state = {
            userData: [],
            originalUserData: [],          
            lastId: null,            
            loading: false,
            refreshing: false,
            noData:false,
            enalbleLoading : true,
            
            thumbnailSource: globals.thumbnailSource,
            thumbnailOfflineSource: Images.contact_icon_50x50,                  
            counter: globals.middleLoadCount,
            uid: this.props.currentUser.uid
        }
        
        
    }
    fetchUserRemoteData(){    
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
        const uid =this.state.uid;

        this.setState({ loading: true });   

        UserModel.getAllUser(lastId,counter,snapshot => {
            if(_.size(snapshot) > 0){
            this.userData = [] ;
            snapshot.forEach((element) => {     
               
               
              this.userData.push(this.createFinalUser(element));
            });
            let lastData = _.last(this.userData);
            let enalbleLoading = true;
            if(_.size(snapshot) >=  counter){     
              this.userData.pop();
            }else{
              enalbleLoading = false
            }   
            if(!!this.memberDataList) {
              this.setState({
                userData: [...this.state.userData,
                  ...this.userData] ,
                originalUserData: [...this.state.originalUserData,
                  ...this.userData] ,
                lastId:lastData.uid,
                loading: false,
                refreshing: false,
                noData:false,
                enalbleLoading: enalbleLoading
              });
            }
            
          }else{
            this.setState({         
              loading: false,
              refreshing: false,
              noData:false,
            });
          }     
          
        });
    }
    refreshNewUserData(userId,user){
      if(this.state.originalUserData.length == 0 ){
        return;
      }
  
      var index = _.findIndex(this.state.originalUserData, function(e) {
        return e.uid == userId;
      });
      if(index != -1){
        return;
      }
      var finalData = this.createFinalUser(user);    
      this.setState({
        userData: update(
          this.state.originalUserData,
          {
            $unshift: [finalData]
          }
        ),
        originalUserData: update(
          this.state.originalUserData,
          {
            $unshift: [finalData]
          }
        )
      })
    }
    shouldComponentUpdate(nextProps, nextState){
      if(!!nextState.loading) return false;
       return true;
    }
    handleRefresh = () => {
      if(!!this.state.loading) return;
        this.setState(
          {       
           // counter: this.state.counter + this.delta,
            refreshing: true
          },
          () => {
            this.fetchUserRemoteData();
          }
        );
    }
    handleLoadMore = () => {
        if (!this.onEndReachedCalledDuringMomentum && !this.state.loading) {  
          this.onEndReachedCalledDuringMomentum = true;
            //console.log("handleLoadMore"); 
            this.fetchUserRemoteData();
           
        }  
    }
    createFinalUser(element){
      let isHimself = false;
      let uid =this.state.uid;
      if(element.uid == uid){
          isHimself = true;        
      }
      let blocked =  !!element.block_users ?
      _.findIndex(Object.keys(element.block_users),function(blockUsers){
          return blockUsers == uid
        })
        :
        -1; 
      let blockedBy = blocked == -1 ? false : true;                
      let Data = {key: element.key, blockedBy: blockedBy, isHimself: isHimself,
        photoURL: element.photoURL,uid: element.uid,name: element.name}
      return Data;
    }
    enableDynamicLoading(){
      if(!!this.activeUserRef) {
        this.activeUserRef.off();
        this.activeUserRef = null;
      }
      this.activeUserRef =  fb.ref('/users/' );
      let _this = this;
     
      this.activeUserRef.limitToFirst(1).on('child_added', function(data) {
        _this.refreshNewUserData(data.key,data.val())     
      });
    }
    componentWillUnmount(){
      if(!!this.activeUserRef) {
        this.activeUserRef.off();
        this.activeUserRef = null;
      }
    }  
    componentDidMount(){
      this.setState(
        {  
          userData: [],
          originalUserData: [],          
          lastId: null,            
          loading: false,
          refreshing: false,
          noData:false,
          enalbleLoading : true,
        },
        () => {
          this.fetchUserRemoteData();
          this.enableDynamicLoading();
        }
      );         
    }  
    goMemberDetails =(memberId) =>{
        this.props.clickMember(memberId);
    }
    searchText = (e) => {
        let text =  e.text.toLowerCase()    
        let trucks = this.state.originalUserData
        let filteredName = trucks.filter((item) => {
            return !!item.name && item.name.toLowerCase().match(text)
          
        })
        if (!text || text === '') {
          if(!!this.memberDataList){
            this.setState({
              userData: this.state.originalUserData
            })
          }
         
        } else if (!Array.isArray(filteredName) && !filteredName.length) {
          // set no data flag to true so as to render flatlist conditionally
          this.setState({
            noData: true
          })
        } else if (Array.isArray(filteredName)) {
          if(!!this.memberDataList){
            this.setState({
              noData: false,
              userData: filteredName
            })
          }
      
        }
        //console.log(this.state.userData);
    }
    renderSeparator = () => {
        return (
            <View
            style={{
                height: 1,
                width: "86%",
                backgroundColor: "#CED0CE",
                marginLeft: "7%"
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
              borderColor: "#FFFFFF",
              height:30
            }}
          >
            <ActivityIndicator animating size="large" />
          </View>
        );
    };
    render() {
        return (
            <View style = {styles.container}>
            <View> 
             {/* <ClqsixTextInput        
               ref={ref=>this.search=ref} 
               placeholder='SEARCH INDIVIDUALS'
               placeholderTextColor = {"#acacac"}                  
               onChangeText={(text) => this.searchText({text}) }
               needValidation={false}
               textStyle = {styles.searchText}    
               style={styles.search}
               onSubmitEditing={() =>  Keyboard.dismiss()} 
               /> */}
               </View>

                <FlatList
                  ref={ref => this.memberDataList = ref}
                                          
                  data={this.state.userData}
                  renderItem={({ item }) =>this.renderUserItem(item)}     
                  style={{height: 300 , }} 
                  onEndReachedThreshold={0}    
                  keyExtractor={item => item.uid}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator ={false} 
                  ListFooterComponent={this.renderFooter}
                  onRefresh={this.handleRefresh}
                  refreshing={this.state.refreshing}
                  onEndReached={this.handleLoadMore}
                  onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}    
                />
                </View>
              
        );
    }
    renderUserItem(item) {
      let memberId = item.uid;

      if(!!item.isHimself || !!item.blockedBy)
      {
        return (<View></View>)
      }
      else{
        return (  
            <TouchableOpacity activeOpacity = {1} onPress={() =>{this.goMemberDetails(memberId)}}>
               <View style={styles.itemcontainer}>        
                {!item.photoURL ? 
                    <Image source={this.state.thumbnailOfflineSource} style = {styles.imagestyle}/>            
                    :
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 34,
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
             
               
            </View>  
            </TouchableOpacity>     
            
        )
      }
    }

};
const contentPaddingHorizontal = 20;

const styles = StyleSheet.create({  
    container: {
      flex: 1,
      width: '100%' ,
    },
    itemcontainer: {
      flex: 1,
      flexDirection: 'row', 
      justifyContent: 'flex-start',
      alignItems: 'center',
      marginTop: 15,
      marginBottom: 10,
      paddingHorizontal: contentPaddingHorizontal,
    
    },
  imagestyle:{
      width: 68,
      height: 68
    },
  namecontent:{
      marginLeft:20,
      maxWidth:200,
    },
  itemtext: {
      fontWeight: 'bold',
    },
    searchText:{
      fontWeight: 'bold'
    },
    search: {
      paddingVertical:25,
      marginHorizontal: 15,
      borderBottomWidth: 1,
      borderColor:'#e8e8e8', 
    },
    itemtextArea: {
    
      justifyContent: 'flex-end',
      alignItems: 'flex-start',
      // position: "absolute" ,
      // bottom: 0,
      marginBottom: 15,
    },
  
    itembackdropView: {    
     
      backgroundColor: 'rgba(0,0,0,0.6)',
      alignSelf: 'flex-start',
      marginLeft: 20,
      padding: 8,
    },
    itemheadline: {
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
    }
});
function mapStateToProps(state) {
    return {
      currentStatus: state.currentStatus,
      currentUser: state.currentUser
    }
}
export default connect(mapStateToProps,{clickMember,blank})(MemberList)
