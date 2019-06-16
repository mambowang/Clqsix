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
    Alert,
    Modal,
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
} from '../../components';
import {
  AuthAPI
} from '../../utils';
import {  CachedImage } from 'react-native-cached-image';

import {VisualModel,CliqueModel,UserModel,NotificationModel} from '../../models';
import { connect } from 'react-redux';


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import _ from 'lodash';
import * as globals from '../../common/Global';
const { height, width } = Dimensions.get('window');

class Notify extends Component {

  constructor(props) {
    super(props);
    this.state = {
      counter:globals.largeLoadCount,
      lastId: null,
      loading: false,
      refreshing: false,
      thumbnailOfflineSource: Images.contact_icon_50x50,
      thumbnailSource: globals.thumbnailSource,
      sharing: false,
      notifyData: [],
     
      invitenotifys: [],
      enableCreate: true,
      uid:this.props.currentUser.uid || '',
      enalbleLoading : true,
    }
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
    const counter = this.state.counter;
    const lastId =this.state.lastId;
    this.setState({ loading: true });   
   
    NotificationModel.getNotificationOnUser(lastId,counter,snapshot => {
      let notifyData = [] ; 
      if(_.size(snapshot) > 0){
        this.notifyData = _.reverse(snapshot);         
        //this.notifyData = snapshot;            
        let lastData = _.last(this.notifyData);
        let enalbleLoading = true;
        if(_.size(snapshot) >= counter){        
          this.notifyData.pop();  
        }else{
          enalbleLoading = false;
        }         
        if(!!this.notifyList){
          this.setState({
            notifyData: [...this.state.notifyData,
              ...this.notifyData] ,         
            lastId:lastData.key,
            loading: false,
            refreshing: false,
            noData:false,
            enalbleLoading: enalbleLoading,
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
  }  
  goBack() {
    !!this.props.rootNavigation &&  this.props.rootNavigation.goBack();
  }
  goMemeber(memberId){
    !!this.props.rootNavigation && this.props.rootNavigation.navigate('MemberRoot',
    {memberId: memberId});   
  }
  goVisualDetails(visualId){
    !!this.props.rootNavigation && this.props.rootNavigation.navigate('VisualRoot',
    {visualId: visualId});  
 }
 goClique(cliqueId){
   !!this.props.rootNavigation && this.props.rootNavigation.navigate('CliqueRoot',
   {cliqueId: cliqueId});  
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
        <CustomNavigator
             leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
            rightButton = {<Image source={Images.Friends_1200x1200} style = {{ opacity:0,width:24,height:24}}/>}      
            onLeftButtonPress = {() => this.goBack()}  
            onRightButtonPress  = {() =>{}}
          >
         <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:28, fontWeight:'bold'}}>Notifications</Text>
        
        </CustomNavigator>  
        <View style = {styles.container}  ref={ref => this.notifyList = ref}>
               
               {!this.state.enableCreate ?
                <View style = {styles.nonotifycontent}>                
                    <Image source={Images.notify_55x60}/>
                    <Text style = {styles.contenttext}>
                              
                    </Text>
                    <Text style = {styles.contenttext}>
                    Your likes, comments, and             
                    </Text>
                    <Text style = {styles.contenttext}>
                    everything else on CLQSIX
                    </Text>
                    </View>
                :
                  <FlatList                
                    data={this.state.notifyData}
                    renderItem={({ item }) =>this.renderNotifyItem(item)}         
                    onEndReachedThreshold={1}   
                    onEndReached={this.handleLoadMore}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator ={false}   
                    ListHeaderComponent={this.renderHeader}
                    keyExtractor={item => item.key}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                  />
              } 
            </View>     
      </FullScreen>
    );
  }
  renderNotifyItem(item) {
    return (      
        <View style={styles.itemcontainer}>        
         <TouchableOpacity    onPress={() => {
           if(item.type == "visual"){this.goVisualDetails(item.toVisualId)}
           else if(item.type == "clique"){this.goClique(item.toCliqueId)}
         }}>
           {!item.photoURL ? 
            <Image source={ this.state.thumbnailOfflineSource} style = {styles.imagestyle}/>            
            :
              item.type == "clique" ? 
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 25,
                overflow: 'hidden',
              }}>
       
                   <CachedImage
                    source={{ uri:  item.photoURL}}
                    style={styles.imagestyle}
                    defaultSource =  {{ uri:this.state.thumbnailSource}}
                    fallbackSource = {{ uri:this.state.thumbnailSource}}
                    />
              </View>
              :
   
              <CachedImage
              source={{ uri:  item.photoURL}}
              style={styles.imagestyle}
              defaultSource =  {{ uri:this.state.thumbnailSource}}
              fallbackSource = {{ uri:this.state.thumbnailSource}}              
               />
          
           }
           </TouchableOpacity>
            <View style = {styles.namecontent}>
            { this.props.currentUser.uid != item.senderUid?
            <TouchableOpacity  onPress={() => {this.goMemeber(item.senderUid) }}>    

                <Text style = {styles.itemtext}>
                {item.userName || '' }
                <Text style = {{ fontWeight: '500',textAlign:'left'}}>
                  {" "}{ item.body || ''}
                </Text>
                  </Text>
              </TouchableOpacity>
              : <Text style = {styles.itemtext}>
               You
               <Text style = {{ fontWeight: '500',textAlign:'left'}}>
                  {" "}{ item.body || ''}
                </Text>
              </Text>
            }
               
                
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
  },
  notifycontent:{
    marginTop:10  
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
  nonotifycontent: {
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
    marginVertical: 15,
  
  },
  imagestyle:{
    width: 50,
    height: 50
  },
  
  namecontent:{
    flexDirection: 'row',
    marginLeft:20,
    maxWidth: width - 100,

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
export default connect(mapStateToProps)(Notify)
