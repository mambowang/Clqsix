'use strict';

import  React, { Component }  from 'react';
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
  StatusBar,
  Keyboard
} from 'react-native';
import { connect } from 'react-redux';

import {
Button,
ClqsixTextInput,
Text,
CustomNavigator,
FullScreen,
ScrollViewWrapper,
Options,
Images,
PhotoCamera,
Camera,

} from '../../../components';
import {VisualModel,CliqueModel,UserModel} from '../../../models';


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import _ from 'lodash';
import * as globals from '../../../common/Global';
import {  CachedImage } from 'react-native-cached-image';

class InviteClique extends Component {  
  onEndReachedCalledDuringMomentum = true;
  oldSearchTxt = "";
  currentSearchTxt = "";
  searchIntervalFuc = null;
   constructor(props) {
     super(props);
     this.state = {
       counter: globals.middleLoadCount,
       lastId: null,
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

       isHimself: false,

       enableSearch:false,
     }      
     this.oldSearchTxt = "";
     this.currentSearchTxt = "";
   }
   fetchRemoteDataOld() {
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
    this.setState({ loading: true });   
    let freindData = [] ; 
    UserModel.getAllFriend(lastId,counter,snapshot => {
      if(_.size(snapshot) > 0){
        this.freindData = snapshot;     
        let lastData = _.last(this.freindData);
        let enalbleLoading = true
        if(_.size(snapshot) >= counter){        
          this.freindData.pop();  
        }else{
          enalbleLoading = false
        }          
        _.map(this.freindData, function(e) {
          return _.extend(e, {inviteStatus: false});
        });
        this.setState({
          freindData: [...this.state.freindData,
            ...this.freindData] ,
          originalFriendData: [...this.state.freindData,
            ...this.freindData] ,
          lastId:lastData.uid,
          loading: false,
          refreshing: false,
          noData:false,
          enalbleLoading: enalbleLoading
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
   fetchRemoteData() {
    if(!!this.state.enableSearch)return;
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
    let freindData = [] ; 
    UserModel.getAllUser(lastId,counter,snapshot => {
      if(_.size(snapshot) > 0){
        freindData = snapshot;     
        let lastData = _.last(freindData);
        let enalbleLoading = true;
        if(_.size(snapshot) >= counter){        
          freindData.pop();  
        }else{
          enalbleLoading = false;
        }          
        _.map(freindData, function(e) {
          let isHimself = false;
          if(e.uid == uid){
            isHimself = true;

          }
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


          return _.extend(e, {inviteStatus: false,
            blockMe:blockMe,
            blockedBy:blockedBy,
            isHimself : isHimself});
        });
        if(!!this.friendList){
          this.setState({
            freindData: [...this.state.freindData,
              ...freindData] ,
            originalFriendData: [...this.state.freindData,
              ...freindData] ,
            lastId:lastData.uid,
            loading: false,
            refreshing: false,
            noData:false,
            enalbleLoading: enalbleLoading,
            enableCreate:true
            
          });
        }
        
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
   fetchSearchRemoteData(){
    if(!this.state.enableSearch)return;        
    this.setState({ loading: true});   
    let freindData = [] ; 
    const uid =this.state.uid;
    
    UserModel.getSearchUser(this.oldSearchTxt,snapshot => {
      if(_.size(snapshot) > 0){
        freindData = snapshot;
        _.map(freindData, function(e) {
          let isHimself = false;
          if(e.uid == uid){
            isHimself = true;

          }
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


          return _.extend(e, {inviteStatus: false,
            blockMe:blockMe,
            blockedBy:blockedBy,
            isHimself : isHimself});
        });
        if(!!this.friendList){
          this.setState({
            freindData: freindData ,          
            loading: false,
            refreshing: false,
            noData:false,
            enableCreate:true
            
          });
        }
        
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
  handleRefresh = () => {
    if(!!this.state.enableSearch)return;
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

  handleLoadMore = () => {
    if(!!this.state.enableSearch)return;
    if (!this.onEndReachedCalledDuringMomentum && !this.state.loading) {      
      this.onEndReachedCalledDuringMomentum = true;      
      this.fetchRemoteData();        
     
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(!!nextState.loading) return false;
     return true;
}
  componentDidMount(){
   // console.log("componentDidMount");
    this.fetchRemoteData();
    this.searchIntervalFuc = setInterval(() => {this.searchAction()}, 1000);
    
  }  
  componentWillUnmount(){
    if(!!this.searchIntervalFuc){
      clearInterval(this.searchIntervalFuc);
    }
    
    
  }
  goBack() {
    const { navigation } = this.props;
    navigation.goBack();       
  }
  goCreateClique(){
    if(!this.state.enableCreate || this.state.inviteFriends.length == 0){
      return;
    }
    !!this.props.navigation && this.props.navigation.navigate('CreateClique',
    {inviteQueue: this.state.inviteFriends});   
    
  }
  goMemberView(memberId){
    !!this.props.navigation && this.props.navigation.navigate('MemberRoot',
    {memberId: memberId,title: 'People on CLQSIX'});  
  }
  
  searchAction(){
    let text =  this.currentSearchTxt;  
    if(!!this.state.loading || text == this.oldSearchTxt) return;
   
    if (!text || text == "") {   
      let enableCreate = true;
      if(!!this.state.originalFriendData && this.state.originalFriendData.length > 0){
        enableCreate = true;
      }else{
        enableCreate = false;
      }
      this.setState({
        enableSearch: false,          
        freindData: this.state.originalFriendData,
        enableCreate:enableCreate
      })    
      
    } else if (text != this.oldSearchTxt) {
      if(!this.state.enableSearch){       
        this.setState(
          {       
           enableSearch: true,
           freindData : null
          },
          () => {
            this.oldSearchTxt = text;
            this.fetchSearchRemoteData();
          }
        );
      }else{
        this.setState(
          { 
           freindData : null
          },
          () => {
            this.oldSearchTxt = text;
            this.fetchSearchRemoteData();
          }
        );
      }
     
    } 
  }
  searchText = (e) => {
     this.currentSearchTxt  =  e.text.toLowerCase();
     //this.currentSearchTxt  =  e.text;  

  }

  addInviteQueue(selectedId){
    let inviteQueue = this.state.inviteFriends;
    let freindData = this.state.freindData;
    var index = _.findIndex(freindData, function(e) {
      return e.uid == selectedId;
    });
    freindData[index].inviteStatus = true;
    inviteQueue.push(selectedId);
    if(!!this.friendList){
      this.setState({
        inviteFriends: inviteQueue,
        freindData : freindData,
      }); 
    } 
  }
  
  removeInviteQueue(selectedId){
      // this.visualData.unshift({key: element.key,  ...visual})
      let inviteQueue = this.state.inviteFriends;
      let freindData = this.state.freindData;
      var index = _.findIndex(freindData, function(e) {
        return e.uid == selectedId;
      });
      freindData[index].inviteStatus = false;    
      const queIndex = inviteQueue.indexOf(selectedId);
      inviteQueue.splice(queIndex, 1);
      if(!!this.friendList){
        this.setState({
          inviteFriends: inviteQueue,
          freindData : freindData,
        });  
      }
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
     return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff'}}>
      <StatusBar hidden={false} />
       <CustomNavigator
          leftButton = {<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}
          rightButton = {<Text style ={{fontFamily: 'SF UI Text', fontSize: 17, color: '#0F7EF4', fontWeight: '600'}}> Next</Text>}
          onLeftButtonPress = {() => this.goBack()}  
          onRightButtonPress  = {() =>this.goCreateClique()}
        >
         <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:28, fontWeight:'bold'}}>
         Choose Your Clique
         </Text>
        
        </CustomNavigator>          
            <View style = {styles.container} ref={ref => this.friendList = ref}>
               <View> 
                <ClqsixTextInput         
                  ref={ref=>this.search=ref} 
                  placeholder='Search' 
                  placeholderTextColor = {"#acacac"}                  
                  onChangeText={(text) => this.searchText({text}) }
                  needValidation={false}
                  autoCapitalize="words"
                  textStyle = {styles.searchText}    
                  style={styles.search}
                  onSubmitEditing={() =>  Keyboard.dismiss()}                   
                  />
                  </View>
                <Text style = {styles.topcontenttext}>
                People on CLQSIX
                </Text>
               
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
              // <View style = {styles.friendcontent}>
                  <FlatList
                    
                    data={this.state.freindData}
                    style={{marginTop: 15 }} 
                    renderItem={({ item }) =>this.renderUserItem(item)}         
                    onEndReachedThreshold={0}    
                    ListHeaderComponent={this.renderHeader}
                    keyExtractor={item => item.uid}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    onEndReached={this.handleLoadMore}
                    
                    ItemSeparatorComponent={this.renderSeparator}     
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator ={false}   
                  />
              // </View>
              } 
            </View> 
       </FullScreen>
     );
   }
  renderUserItem(item) {
    if(!!item.isHimself || !!item.blockedBy || !!item.blockMe)
    {
        return (<View></View>)
    }else{
      return ( 
                
          
          <View style={styles.itemcontainer}>   
            <TouchableOpacity style = {styles.itemTitleContainer}  onPress={() => {this.goMemberView(item.uid) }}>    
     
            {!item.photoURL ? 
              <Image source={this.state.thumbnailSource} style = {styles.imagestyle}/>            
              :
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 25,
                overflow: 'hidden',
              }}>
              <CachedImage
              source={{ uri:  item.photoURL,}}
              defaultSource =  {this.state.thumbnailSource}
              fallbackSource = {this.state.thumbnailSource}
              
              style={styles.imagestyle}
            />       
            </View>   
            }
              <View style = {styles.namecontent}>
                  <Text style = {styles.itemtext}>{item.name || ''}</Text>
              </View> 
              </TouchableOpacity>
              <View style = {styles.invitearea} >
              {!item.inviteStatus ? 
                <TouchableOpacity     onPress={() => {this.addInviteQueue(item.uid) }}>    
                <View style = {styles.invitecontent} >
                    <Text style = {styles.invitecontenttext}>Invite</Text>
                </View>          
                </TouchableOpacity>  :
                <TouchableOpacity     onPress={() => {this.removeInviteQueue(item.uid) }}> 
                  <View style = {styles.invitedcontent} >
                    {/* <Text style = {styles.invitedcontenttext}>---</Text> */}
                    <Image source={Images.rectangle_15x3}/>            

                  </View>   
                  </TouchableOpacity>
              }       
              </View>  
            </View>  
      )
  }
  }//
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
    marginTop:10,
    marginBottom: 85,
  
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
    fontSize: 15,
    fontWeight: "bold",
    textAlign: "center",
    color: '#bbbbbb',
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
    height: 0,          
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
    paddingVertical:5
  
  },
  itemTitleContainer: {
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
    maxWidth:150,
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
    flex:1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
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
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps)(InviteClique)
