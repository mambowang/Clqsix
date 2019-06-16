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



class FollowingClique extends Component {
    cliqueData = [];  
    onEndReachedCalledDuringMomentum = true;  
    
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      uid: params.uid,
      follwoingSum: params.follwoingSum,  
      fromProfile: params.fromProfile || false,
      cliqueData: [],   
      counter: globals.smallLoadCount,
      lastId: null,      
      loading: false,
      refreshing: false,
      noData:false,
      thumbnailSource: globals.thumbnailSource,
      enalbleLoading : true,
    }
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack();
  }
  goCliqueView(cliqueId){  
    if(!!this.state.fromProfile){
      !!this.props.navigation && 
      this.props.navigation.navigate('CliqueRoot',{ 
        cliqueId: cliqueId,
      });   
    }else{
      !!this.props.rootNavigation && 
      this.props.rootNavigation.navigate('CliqueRoot',{ 
        cliqueId: cliqueId,
      });   
    }
   
    
  }
  fetchCliqueRemoteData(){    
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
    const uid = this.state.uid;
    this.setState({ loading: true });    
    CliqueModel.getFollowCliques(uid,lastId,counter,snapshot => {
      if(_.size(snapshot) > 0){
        this.cliqueData = [] ;
        snapshot.forEach((element) => {       
          this.cliqueData.unshift({key: element.key, ...element});        
        });
        let lastData = _.last(this.cliqueData);
        let enalbleLoading = true
        if(_.size(snapshot) >=  counter){     
          this.cliqueData.pop();
        }else{
          enalbleLoading = false
        }    
        //if(!!this.cliqueList){
          this.setState({
            cliqueData: [...this.state.cliqueData,
              ...this.cliqueData] ,        
            lastId:lastData.key,
            loading: false,
            refreshing: false,
            noData:false,
            enalbleLoading: enalbleLoading
          });
        //}
        
        //console.log("cliqueData:  " + this.state.cliqueData);     
      }else{
        this.setState({         
          loading: false,
          refreshing: false,
          noData:false,
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
        this.fetchCliqueRemoteData();
      }
    );
  }
  handleLoadMore = () => {
    if (!this.onEndReachedCalledDuringMomentum && !this.state.loading) {  
      
      
      //console.log("handleLoadMore"); 
      this.fetchCliqueRemoteData();
      this.onEndReachedCalledDuringMomentum = true;
    }  
  }
  componentDidMount(){
    this.fetchCliqueRemoteData();
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
           Following {this.state.follwoingSum || ''}
        </Text>
      </CustomNavigator>
      <View style = {styles.container}>
      <FlatList
            ref={ref => this.cliqueList = ref}
                          
            data={this.state.cliqueData}
            renderItem={({ item }) =>this.renderCliqueItem(item)}     
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
  renderCliqueItem(item) {
    return (  
      <View style={styles.itemcontainer}>   
          <TouchableOpacity style ={[styles.content,{backgroundColor: 'white'}]}  onPress={() => {this.goCliqueView(item.key)}}>
      
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
export default FollowingClique;