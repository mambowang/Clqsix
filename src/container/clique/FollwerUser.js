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
    Modal,
    StatusBar,
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
  Content,
  Alert,
  ModalActivityIndicator,
  Loading
} from '../../components';
import {
  AuthAPI
} from '../../utils';
import firebase from 'firebase';
import {VisualModel,CliqueModel,UserModel} from '../../models';
import _ from 'lodash';

import { NavigationActions } from 'react-navigation';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;
import {  CachedImage } from 'react-native-cached-image';

const { height, width } = Dimensions.get('window');
import * as globals from '../../common/Global';
class FollwerUser extends Component {
    userData = [];  
    onEndReachedCalledDuringMomentum = true;  
    
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      cliqueId: params.cliqueId,
      follwerSum: params.follwerSum,  
      fromProfile: params.fromProfile || false,
      counter: globals.smallLoadCount,
      lastId: null,
      loading: false,
      refreshing: false,
      thumbnailSource: Images.contact_icon_50x50,          
      userData: [],         
      inviteFriends: [],    
      enableLoading: true,
    }
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack();
  }
  goMemberDetail(memberId){
    if(this.props.currentUser.uid == memberId) return;
    if(!!this.state.fromProfile){
      !!this.props.navigation && this.props.navigation.navigate('MemberRoot',
      {memberId: memberId}); 
    }else{
      !!this.props.rootNavigation && this.props.rootNavigation.navigate('MemberRoot',
      {memberId: memberId}); 
    }
  
    
  }
  fetchUserRemoteData(){    
    if(!this.state.enableLoading){
      this.setState({         
        loading: false,
        refreshing: false,
        noData:false,
    
      });
      return;
    } 
    const counter = this.state.counter;
    const lastId =this.state.lastId;
    const cliqueId = this.state.cliqueId;
    
    this.setState({ loading: true });    
    CliqueModel.getFollowerUsers(lastId,cliqueId,counter,snapshot => {
        if(_.size(snapshot) > 0){
            this.userData = _.reverse(snapshot);     
            let lastData = _.last(this.userData);
            _.map(this.userData, function(e) {
                // console.log(e);
               return _.extend(e, {key: e.uid});
             });
             let enableLoading = true
            if(_.size(snapshot) >= counter){
                this.userData.pop();  
            }else{
                enableLoading = false
            }           
           // if(!!this.friendList){
              this.setState({
                userData: [...this.state.userData,
                ...this.userData] ,           
                lastId:lastData.uid,
                loading: false,
                refreshing: false,
                noData:false,
                enableLoading: enableLoading
              });
          //  }
            
      }else{
        this.setState({         
          loading: false,
          refreshing: false,
          noData:false,
        });
      }     
      
    });
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
      //console.log("handleLoadMore"); 
      this.fetchUserRemoteData();
      this.onEndReachedCalledDuringMomentum = true;
    }  
  }
  componentDidMount(){
    this.fetchUserRemoteData();
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
      let loading = this.state.loading;
    return (
        <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
        <CustomNavigator
        leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
        rightButton = {<Image style = {{opacity: 0}} source={Images.BackChevronLeft_Black_9x16}/>}
        onLeftButtonPress = {() =>this.goBack() }  
      >
        <Text style={{fontFamily:'SF UI Text', fontSize: 17,fontWeight:'bold'}}>
          {this.state.follwerSum || ''} Followers
        </Text>
      </CustomNavigator>
    
      <View style = {styles.container}>
      <FlatList
            ref={ref => this.friendList = ref}                          
            data={this.state.userData}
            renderItem={({ item }) =>this.renderUserItem(item)}     
            onEndReachedThreshold={0}    
            keyExtractor={item => item.key}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator ={false} 
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}      
          />
          </View>
      
      </FullScreen>
    );
  }
  renderUserItem(item) {
    return (  
        <View style={styles.itemcontainer}>    
            <TouchableOpacity style={styles.content}  onPress={() => {this.goMemberDetail(item.key)}}>   

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
                <Image source={Images.right_go_6x10}/>
          </TouchableOpacity> 
              
        </View> 
        
    )
  }
};
const contentPaddingHorizontal = 20;

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        width: '100%' ,
        marginTop: 30,
      },
      itemcontainer: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: contentPaddingHorizontal,
        borderWidth:1, 
        borderColor:'#EEEEEE',   
        height:78,
      
      },
      content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between',    
        alignItems:'center',   
        width: '100%'
      },
    imagestyle:{
        width: 50,
        height: 50
      },
    namecontent:{
      flex: 1,
      flexDirection: 'row',
      justifyContent:'flex-start',    
        marginLeft:20,
      },
    itemtext: {
        fontWeight: 'bold',
      },
});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
    
  }
}

export default connect(mapStateToProps)(FollwerUser)
