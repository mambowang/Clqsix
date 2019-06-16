'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import {StyleSheet,View,TouchableOpacity,Navigator, Image, ScrollView,TabBarIOS, TabBarItemIOS, Dimensions,
    Alert, Modal,FlatList, ActivityIndicator
} from 'react-native';


import { Button, ClqsixTextInput, Text, CustomNavigator, FullScreen,
   ScrollViewWrapper, Options, Images,ModalActivityIndicator
} from '../../components';
import {
  AuthAPI
} from '../../utils'
import {CliqueModel} from '../../models'

import _ from 'lodash';
import * as globals from '../../common/Global';
import {  CachedImage ,ImageCacheProvider } from 'react-native-cached-image';
import { followingClique ,followingOneClique ,unfollowingOneClique} from '../../actions/userActions'
import update from 'immutability-helper';

let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
class FindCliques extends Component {
  cliquesData = [];  
  delta = 3;
  onEndReachedCalledDuringMomentum = true;
  
  constructor(props) {
    super(props);
    this.state = {
      cliquesData : [],
      counter: globals.smallLoadCount,
      lastId: null,
      loading: false,
      refreshing: false,
      thumbnailSource: globals.thumbnailSource,
      uid: this.props.currentUser.uid,
      showActivityIndicator: false,

      cliqueStatusData : null,


      enalbleLoading : true,
    }
  }
  _onNavigationLeftButtonPress() {

    !!this.props.navigation && this.props.navigation.goBack();
  }
  _onNavigationRightButtonPress() {

  }
  fetchCliqueStatusData(fnCallBack = null){
      let uid = this.state.uid;
      CliqueModel.getDetailCliqueDataPerUser(uid, snapshot=>{
        this.setState(
          {  
            cliqueStatusData: snapshot
          },
          () => {
            if(!!fnCallBack)
            fnCallBack();
          }
        ); 
         
      })
  }
  fetchRemoteData(){
    console.log("window:    " + window.width + "   ,  " + window.height);
    if(!this.state.enalbleLoading){
      this.setState({         
        loading: false,
        refreshing: false,
      });
      return;
    } 
    const counter = this.state.counter;
    const lastId =this.state.lastId;
    const cliqueStatusData = this.state.cliqueStatusData;
    
    this.setState({ loading: true });    
    CliqueModel.getFeaturedCliques(lastId,counter,snapshot => {
      if(snapshot.numChildren() > 0){
        this.cliquesData = [] ;
        snapshot.forEach((element) => {       
          let clique = element.val();
          let following = false;
          let request = false;
          let enableFollowing = true;

          if( !cliqueStatusData.followingCliques 
            ||!(  cliqueStatusData.followingCliques.includes(element.key))){
            following = false;
          }else{
            if(!!cliqueStatusData.inCliques 
              &&cliqueStatusData.inCliques.includes(element.key)){
              enableFollowing = false;
            }
            following = true;
          }
          if( !cliqueStatusData.requestedCliques 
            ||!( cliqueStatusData.requestedCliques.includes(element.key))){
            request = false;
          }else{
            request = true;
          }
          this.cliquesData.unshift({key: element.key,following: following,
            enableFollowing: enableFollowing,request: request, ...clique});
          
        });
        let lastData = _.last(this.cliquesData);
        let enalbleLoading = true
        if(snapshot.numChildren() >= counter){        
          this.cliquesData.pop();
        }else{
          enalbleLoading = false
        }         
        if(!!this.cliqueList){
          this.setState({
            cliquesData: [...this.state.cliquesData,
              ...this.cliquesData] ,
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

  componentWillMount(){
    this.onEndReachedCalledDuringMomentum = true;
    this.fetchCliqueStatusData(() =>{
      this.fetchRemoteData();  
    });
  }
  
  renderNavigationBar() {
    return (
      <CustomNavigator
          leftButton = {<Image source={Images.BackChevronLeft_Black_9x16} />}        
          rightButton = {<Image style = {{opacity :0}} source={Images.BackChevronLeft_Black_9x16} />}        
          
          onLeftButtonPress = {() => this._onNavigationLeftButtonPress()}
      >
      {/* <Text style={{fontFamily:'SF UI Text',fontWeight: 'bold', fontSize: 17}}>Cliques</Text> */}
      </CustomNavigator>
    );
  }
  goCliqueView(cliqueId){  
    !!this.props.navigation && 
    this.props.navigation.navigate('CliqueRoot',{ 
      cliqueId: cliqueId,
      onChangeState:this.onChangeState
    });   
    
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };
  shouldComponentUpdate(nextProps, nextState){
    if(!!nextState.loading) return false;
     return true;
  }
  renderHeader = () =>{
    return (
      <View style={styles.topview}>                   
                    <Text style={styles.topfont}>The latest cliques</Text>
                    <Text style={styles.topfont}>in the community</Text>                    
        </View>
    )
  }
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
  render() {
    return (
      <View style={{flexGrow:1, backgroundColor:'white'}}>
        {this.renderNavigationBar()}
        <FlatList
          ref={ref => this.cliqueList = ref}
          style={{height: 300 ,marginHorizontal:13,marginTop:5}} 
          data={this.state.cliquesData}
          renderItem={({item}) => this.renderCliqueItem(item)}         
          onEndReachedThreshold={1}         
          ListFooterComponent={this.renderFooter}
          ListHeaderComponent={this.renderHeader}
          
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={this.handleLoadMore}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator ={false}      
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}     
        />
      <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />
      </View>
    )
  }
  renderCliqueItem(item) {
    return (
        <View>
            <TouchableOpacity   activeOpacity = {1} 
              style={styles.itemcontainer} onPress={()=>this.goCliqueView(item.key)}>
            <CachedImage
                source={{ uri:  item.avatar.uri}}
                style={styles.itembackdrop}
                defaultSource =  {{ uri:this.state.thumbnailSource}}
                fallbackSource = {{ uri:this.state.thumbnailSource}}            />
          
              </TouchableOpacity>  
              <View style = {styles.itemcontainer}>     
                <View style = {styles.itemtextArea}>             
                      <Text style={styles.itemNameline}>{'@' + item.name || ''}</Text>
                
                    {!!item.following ? !item.enableFollowing ?
                    <Button.Simple text='Following'
                    textStyle={styles.followingLinkText} 
                    style={styles.followingLink} 
                    onPress={() =>{}}/>
                    :
                    <Button.Simple text='Following'
                      textStyle={styles.followingLinkText} 
                      style={styles.followingLink} 
                      onPress={() =>{this.unfollowing(item.key)}}/>
                      :
                    <Button.Simple text='Follow'
                      textStyle={styles.followLinkText} 
                      style={styles.followLink} 
                      onPress={() =>{this.following(item.key)}}/>
                    }
                </View> 
              </View>
      </View>     
    )
  }
  onChangeState = (cliqueId,following) =>{
    var index = _.findIndex( this.state.cliquesData, function(e) {
      return e.key == cliqueId;
    });  
    if(index != -1 && following == true){
      let changedData = ! this.state.cliquesData[index].following;
      this.setState({
        cliquesData: update(
            this.state.cliquesData,
            {
              [index]: {
                following: { $set:  changedData}
              },  
            }
          )
      }); 
    }
  }
  following(cliqueId){
    this.setState({
      showActivityIndicator: true,
      
    });
    CliqueModel.followingClique(cliqueId,(result)=>{
      this.setState({
        showActivityIndicator: false
      });
        if(result == "0"){
           this.onChangeState( cliqueId,true );           
           this.props.followingOneClique(cliqueId);
         
        }
    });
  }
  unfollowing(cliqueId){
    this.setState({
      showActivityIndicator: true
    });
      CliqueModel.unfollowingClique(cliqueId,(result)=>{
        this.setState({
          showActivityIndicator: false
        });
          if(result == "0"){
            this.onChangeState( cliqueId,true );           
            this.props.unfollowingOneClique(cliqueId);
        
          }
      });
  }
};
const styles = StyleSheet.create({  
  itemcontainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  topview: {
      justifyContent: "center",
      alignItems:'flex-start',
      marginLeft :25,
      marginRight: 110,
      height: 70,
      marginBottom:30,
    },
  topfont: {
      fontFamily: 'SF UI Text', 
      fontSize: 22, 
      color: '#000000', 
      fontWeight: 'bold',
    },
  itemtextArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,    
    paddingVertical:10,
    width: window.width * 0.75,
    marginBottom:50,
  },
  itembackdrop: {
    alignItems: 'stretch', 
    width: window.width * 0.75, 
    height: window.width * 0.75, 
  },
  followingLink: {
    borderWidth:1, 
    borderColor:'#bbbbbb', 
    backgroundColor:'white',   
    height: 25,
  },
  followingLinkText: {
    color:'#bbbbbb',
    fontSize: 11,
    fontWeight: 'bold',
    
  },
  followLink: {
    borderWidth:1, 
    borderColor:'#0095F7', 
    backgroundColor:'white',   
    height: 25,
  },
  followLinkText: {
    color:'#0095F7',
    fontSize: 11,
    fontWeight: 'bold',
    
  },
  itemNameline: {
    fontSize: 14,    
    fontWeight: 'bold', 
  },
  itemheadline: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white'
  }
});
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps,
  {followingClique, followingOneClique , unfollowingOneClique})(FindCliques);