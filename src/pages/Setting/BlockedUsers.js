
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
ModalActivityIndicator,
Alert

} from '../../components';
import {VisualModel,CliqueModel,UserModel} from '../../models';


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import _ from 'lodash';
import * as globals from '../../common/Global';
import {  CachedImage } from 'react-native-cached-image';
import update from 'immutability-helper';

class BlockedUsers extends Component {  
   constructor(props) {
     super(props);
     this.state = {
       counter: globals.middleLoadCount,
       lastId: null,
       loading: false,
       refreshing: false,
       thumbnailSource: Images.contact_icon_50x50,
       sharing: false,
       blockedUsersData: [],
       enableCreate: true,
       uid:this.props.currentUser.uid || '',
       showActivityIndicator: false,
       
     }      
   }

   fetchRemoteData() {
    
    const counter = this.state.counter;
    this.setState({ loading: true });   
    let blockedUsersData = [] ; 
    UserModel.getFullBlockUsers(snapshot => {
      if(_.size(snapshot) > 0){
        this.blockedUsersData = snapshot;     
        
       
        if(!!this.friendList){
          this.setState({
            blockedUsersData: [...this.state.blockedUsersData,
              ...this.blockedUsersData] ,         
            loading: false,
            refreshing: false,
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
 
  shouldComponentUpdate(nextProps, nextState){
    if(!!nextState.loading) return false;
     return true;
    }
  componentDidMount(){
   // console.log("componentDidMount");
    this.fetchRemoteData();
  }  
  goBack() {
    const { navigation } = this.props;
    navigation.goBack();       
  }

  goMemberView(memberId){
    !!this.props.navigation && this.props.navigation.navigate('MemberRoot',
    {memberId: memberId});  
  }
    unblockMember(selectedId){
        this.setState({
            showActivityIndicator: true

        }); 
        UserModel.unblockUser(selectedId,(res)=>{
            if(res == "0"){
                var index = _.findIndex( this.state.blockedUsersData, function(e) {return e.uid == selectedId;}); 
                if(index != -1 ){
                    this.setState(
                        {  
                            showActivityIndicator: false,  
                            blockedUsersData: update(
                                this.state.blockedUsersData,
                                {
                                $splice: [[index, 1]]
                                }
                            )  
                        }); 
                    // this.setState(
                    //     {  
                    //         showActivityIndicator: false,  
                    //         blockedUsersData: update(
                    //             this.state.blockedUsersData,
                    //             {
                    //             $splice: [[index, 1]]
                    //             }
                    //         )  
                    //     },
                    //     () => {
                    //     this.blockAlert.show();                           
                    //     }
                    // ); 
                }else{
                    this.setState({showActivityIndicator: false}); 
                }
            }else{
                this.setState({showActivityIndicator: false}); 
            }
        })
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
          leftButton = {<Image source={Images.BackChevronLeft_Black_9x16}/>}   
          rightButton = {<Image source={Images.Friends_1200x1200} style = {{width:24,height:24,opacity:0}}/>}      
          onLeftButtonPress = {() => this.goBack()}  
        
        >
         <Text style={{fontFamily:'SF UI Text', fontSize: 17, fontWeight:'bold'}}>
         Blocked Users
         </Text>
        
        </CustomNavigator>          
            <View style = {styles.container} ref={ref => this.friendList = ref}>
                  <FlatList                    
                    data={this.state.blockedUsersData}
                    renderItem={({ item }) =>this.renderUserItem(item)}    
                    ListHeaderComponent={this.renderHeader}
                    keyExtractor={item => item.uid}
                    ListFooterComponent={this.renderFooter}                   
                    refreshing={this.state.refreshing}
                    ItemSeparatorComponent={this.renderSeparator}     
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator ={false}   
                  />
            </View>
            <Alert  ref={ref=>this.blockAlert=ref} 
                style={{backgroundColor: '#EF4244'}} 
                title = {""}
                text={ ['You unblocked this member']}
                closeButtonSource = {Images.check_17x13}
                onRequestClose={() => this.blockAlert.hide()}/>   
            <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

            
       </FullScreen>
     );
   }
  renderUserItem(item) {
   
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
                <TouchableOpacity     onPress={() => {this.unblockMember(item.uid) }}>    
                <View style = {styles.invitecontent} >
                    <Text style = {styles.invitecontenttext}>Unblock</Text>
                </View>          
                </TouchableOpacity>  
              </View>  
            </View>  
      )
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
    borderColor : "#EF4244",
    borderWidth: 1,
    height:25,
    width: 80
    
  },
  invitecontenttext: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 3,
    paddingBottom: 3,
    fontSize: 13,
    color: '#EF4244',
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
export default connect(mapStateToProps)(BlockedUsers)
