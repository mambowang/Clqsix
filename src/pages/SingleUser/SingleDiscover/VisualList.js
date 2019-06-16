'use strict';

import React, { Component } from 'react';
import {StyleSheet,View,TouchableOpacity, Image, Dimensions, Alert, Modal,FlatList, 
  ActivityIndicator,Keyboard,Linking
} from 'react-native';

import {  CachedImage } from 'react-native-cached-image';

import { Button, ClqsixTextInput, Text,  FullScreen,  Options, Images
} from '../../../components';
import {
  AuthAPI
} from '../../../utils'
import {VisualModel} from '../../../models'
import MasonryList from '@appandflow/masonry-list';

import _ from 'lodash';
import VideoPlayer from 'react-native-video-player';
import { NavigationActions } from 'react-navigation'
import Hyperlink from 'react-native-hyperlink';
import * as globals from '../../../common/Global';
import fb from '../../../utils/FirebaseAPI'
import update from 'immutability-helper';

import { connect } from 'react-redux'
import { clickVisual,blank } from '../../../actions/statusActions'


let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
let delta = 60;
let visualWidth = (window.width - delta) / 3;

class VisualList extends Component {
  visualData = [];  
  activeVisualRef = null;
  
  constructor(props) {
    super(props);
    this.state = {
      visualData : [],
      originalVisualData: [],
      lastId: null,
      loading: false,
      refreshing: false,
      noData:false,      
      enalbleLoading : true,
      counter: globals.largeLoadCount,    
      thumbnailSource: globals.thumbnailSource,
      onEndReachedCalledDuringMomentum: true,
    }
  }
  goVisualDetails(visualId){
    this.props.clickVisual(visualId);
    // // !!this.props.navigation && this.props.navigation.navigate('VisualDetail',
    // // {visualId: visualId});  
  }

  fetchVisualRemoteData(){
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
    VisualModel.getAllVisuals(lastId,counter,snapshot => {     
      if(snapshot.numChildren() > 0){
        this.visualData = [] ;
        snapshot.forEach((element) => { 
          this.visualData.unshift(this.createFinalVisual(element.val(),element.key));
        });
        let lastData = _.last(this.visualData);
        let enalbleLoading = true;
        if(snapshot.numChildren() >= counter){        
          this.visualData.pop();
        }else{
          enalbleLoading = false;
        } 
       
        if(this.visualList){
          this.setState({
            visualData: [...this.state.visualData,
                        ...this.visualData] ,
            originalVisualData: [...this.state.visualData,
                      ...this.visualData] ,
            loading: false,
            refreshing: false,
            lastId:lastData.key,
            noData:false,
            enalbleLoading: enalbleLoading
          });
        }   
         
      }  else{
        this.setState({        
          loading: false,
          refreshing: false,     
          noData:false,   
        });
      }     
    
    });
  }
  shouldComponentUpdate(nextProps, nextState ){
    if(!!nextState.loading) return false;
     return true;
  }
  createFinalVisual(visual,visualId){
    let height = 0;
    if(visual.type == 'text'){
       height = visualWidth ; 
    }else if(visual.type == 'link'){
      height = visualWidth * 0.55 ; 
   }else{
       height = visualWidth * visual.ratio ; 
    }
    return _.extend(visual,{key:visualId,height: height})
  }
  refreshNewVisualData(visualid,visual){
    if(this.state.originalVisualData.length == 0 ){
      return;
    }

    var index = _.findIndex(this.state.originalVisualData, function(e) {
      return e.key == visualid;
    });
    if(index != -1){
      return;
    }
    var finalData = this.createFinalVisual(visual,visualid);    
    //originalVisualData
    this.setState({
      visualData: update(
        this.state.originalVisualData,
        {
          $unshift: [finalData]
        }
      ),
      originalVisualData: update(
        this.state.originalVisualData,
        {
          $unshift: [finalData]
        }
      )
    })

  }
  refreshDeleteVisualData(visualid){
    
    var index = _.findIndex(this.state.originalVisualData, function(e) {
      return e.key == visualid;
    });
    if(index == -1){
      return;
    }
    var lastId = this.state.lastId;
    if(visualid == lastId){
       if(index == 0) lastId = null;
       else{
          lastId = this.state.originalVisualData[index-1].key;
       }
    }
    this.setState({
      lastId:lastId,
      visualData: update(
        this.state.originalVisualData,
        {
          $splice: [[index,1]]
        }
      ),
      originalVisualData: update(
        this.state.originalVisualData,
        {
          $splice: [[index,1]]
        }
      )
    })

  }
  enableDynamicLoading(){
    if(!!this.activeVisualRef) {
      this.activeVisualRef.off();
      this.activeVisualRef = null;
    }
    this.activeVisualRef =  fb.ref('/visuals/' );
    let _this = this;
    this.activeVisualRef.on('child_removed', function(data) {
      _this.refreshDeleteVisualData(data.key)     
    });
    this.activeVisualRef.limitToLast(1).on('child_added', function(data) {
      _this.refreshNewVisualData(data.key,data.val())     
    });
  }
  searchText = (e) => {
    let text =  e.text.toLowerCase()    
    let trucks = this.state.originalVisualData
    let filteredName = trucks.filter((item) => {
        return  !!item.caption && item.caption.toLowerCase().match(text)
     
    })
    if (!text || text === '') {
      if(!!this.visualList){
        this.setState({
          visualData: this.state.originalVisualData
        })
      }
     
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      // set no data flag to true so as to render flatlist conditionally
      this.setState({
        noData: true
      })
    } else if (Array.isArray(filteredName)) {
      if(!!this.visualList){
        this.setState({
          noData: false,
          visualData: filteredName
        })
      }
      
    }
  }
  handleRefresh = () => {
    if(!!this.state.loading) return;
    this.setState(
      {
        refreshing: true
      },
      () => {
        this.fetchVisualRemoteData();
      }
    );
  }
  handleLoadMore = () => {
    if (!this.state.onEndReachedCalledDuringMomentum && !this.state.loading) {   
      this.setState( {
          onEndReachedCalledDuringMomentum: true
            });
      this.fetchVisualRemoteData();
      // this.setState(
      //   {
      //     onEndReachedCalledDuringMomentum: true
      //   },
      //   () => {
      //     this.fetchVisualRemoteData();
      //   }
      // );
    
   
    }  
  }
  componentDidMount(){
    this.setState(
      {  
        visualData : [],
        originalVisualData: [],
        lastId: null,
        loading: false,
        refreshing: false,
        noData:false,      
        enalbleLoading : true,
      },
      () => {
        this.fetchVisualRemoteData();
        this.enableDynamicLoading();
      }
    );   
  }
  componentWillUnmount(){
    if(!!this.activeVisualRef) {
      this.activeVisualRef.off();
      this.activeVisualRef = null;
    }
  }    

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 2,
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
       <View> 
       {/* <ClqsixTextInput         
         ref={ref=>this.search=ref} 
         placeholder='SEARCH VISUALS'
         placeholderTextColor = {"#acacac"}                  
         onChangeText={(text) => this.searchText({text}) }
         needValidation={false}
         textStyle = {styles.searchText}    
         style={styles.search}
         onSubmitEditing={() =>  Keyboard.dismiss()} 
         
         /> */}
         </View>
             <MasonryList
              ref={ref => this.visualList = ref}
              data={this.state.visualData}  
              initialNumToRender={globals.maxInitRenderCount}              
              renderItem={({ item }) =>this.renderVisualItem(item)}
              ItemSeparatorComponent={this.renderSeparator}
              keyExtractor={item => item.key}
              getHeightForItem={({ item }) => item.height + 2}
              onEndReachedThreshold={0.2}         
              onRefresh={this.handleRefresh}
              refreshing={this.state.refreshing}
              onEndReached={this.handleLoadMore}
              style={{height:300 }} 
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator ={false}      
              onMomentumScrollBegin={() => {  this.setState({onEndReachedCalledDuringMomentum: false}) }}           
              numColumns={3}
            />           
      </View>
    )
  }
  renderVisualItem(item) {
  
      if (item.type === 'text') {
      return this.renderTextItem(item);
    }

    if (item.type === 'mood') {
      return this.renderMoodItem(item);
    }
    if (item.type === 'link') {
      return this.renderLinkItem(item);
    }
    if (item.type === 'image') {
      return this.renderImageItem(item);
    }

    if (item.type === 'video') {
      return this.renderVideoItem(item);
    }
  
    
  }
  renderLinkItem(item){
    return(
      <View style = {styles.itemcontainer}>
         <TouchableOpacity  activeOpacity = {1} style = {styles.itemlinkcontainer} onPress={() => {this.goVisualDetails(item.key) }}>    
          <CachedImage
                  resizeMode="cover"
                  source={{ uri: item.thumbnail}}
                  defaultSource =  {{ uri:this.state.thumbnailSource}}
                  fallbackSource = {{ uri:this.state.thumbnailSource}}
                  style={{width:'100%',height: '100%'}}
              />         
          </TouchableOpacity>
          <View style = {styles.itemlinkbottom}>
          <Hyperlink
              linkStyle={ { color: '#bbbbbb', fontSize: 12 } }
              linkText={ url => url === item.url ? url: url }
              onPress={ (url) => {Linking.openURL(url)}}
            >
             <Text style = {{fontSize: 12,color:'#777777'}}>
             {item.description.length > 21 ? item.description.substr(0,20) + "..." :item.description }
             </Text>
              <Text style={ { fontSize: 11,color: '#bbbbbb' } }>
               {item.url || ''} 

              </Text>
            </Hyperlink>
          </View>
      </View>
    )

  }
  renderTextItem(item){
    return (
      <TouchableOpacity  activeOpacity = {1}  onPress={() => {this.goVisualDetails(item.key) }}>   
        <View  style={[styles.itemcontainer,{ height: item.height }]}>
            <View style = {styles.itemtextcontainer}>         
                    <Text style = {styles.itemtextcontent}>
                  
                     {item.text.length > 51 ? item.text.substr(0,50) + "..." :item.text }

                     </Text>       

        
            </View>  
        </View>
      
         
      </TouchableOpacity>   
    );   

  }
  renderMoodItem(item){
    return (
        <TouchableOpacity  onPress={() => {this.goVisualDetails(item.key) }} > 
          <View  style={[styles.itemcontainer,{ height: item.height }]}>
            <VideoPlayer
              endWithThumbnail
              autoplay = {false}   
              loop = {false}     
              muted = {true}
              disableSeek = {true}  
              hideControlsOnStart = {true}
              disableFullscreen= {true}
              customStyles = {{
                seekBar:{opacity:0},
                controls:{opacity:0},
              }}     
              thumbnail={{ uri:  item.thumbnail}}        
              video={{ uri:item.url}}
              videoWidth={visualWidth}
              videoHeight={item.height}
          
            />

          </View>
      
      </TouchableOpacity>
    );   
  }
  renderVideoItem(item){
    return (
    <TouchableOpacity  activeOpacity = {1}  onPress={() => {this.goVisualDetails(item.key) }} > 
      <View  style={[styles.itemcontainer,{ height: item.height }]}>
        <VideoPlayer
          endWithThumbnail     
          autoplay = {false}         
          thumbnail={{ uri:  item.thumbnail}}        
          video={{ uri:item.url}}
          videoWidth={visualWidth}
          videoHeight={item.height}
          disableFullscreen= {false}
        />

      </View>
   
    </TouchableOpacity>
    );
  }
  renderImageItem(item){
    return (
      <TouchableOpacity  activeOpacity = {1}  onPress={() => {this.goVisualDetails(item.key) }}>   
       <View  style={[styles.itemcontainer,{ height: item.height }]}>
            <CachedImage
                source={{ uri: item.url}}
                style={{width:'100%',height: '100%'}}
                defaultSource =  {{ uri:this.state.thumbnailSource}}
                fallbackSource = {{ uri:this.state.thumbnailSource}}
            />
      </View>
      
         
      </TouchableOpacity>    
    ); 
    
  }
};
const styles = StyleSheet.create({  
  container: {
    flex: 1,
    width: '100%' ,
  },
  itemcontainer: {    
    alignItems: 'stretch', 
     margin: delta/6,
     width: visualWidth, 
  },
  itemtextcontainer: {     
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal:20,
    paddingTop:20,
    alignItems:  'flex-start',
    backgroundColor: '#1a1a1a',
   
 },
 itemlinkcontainer: {
  flex: 1,
  justifyContent: 'center',   
  alignItems: 'center',   
  width: visualWidth,
  height: visualWidth * 0.3   
},
itemlinkbottom: {
  flex: 1,
  justifyContent: 'center',   
  alignItems: 'flex-start',   
  backgroundColor: '#F4F4F4',
  width: visualWidth,
  paddingLeft: 10,
  paddingVertical:5,
},
 itemtextcontent: {
  
   fontSize: 10,
   textAlign: 'left',
   color:'white'
 
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
 
});
function mapStateToProps(state) {
  return {
    currentStatus: state.currentStatus
  }
}
export default connect(mapStateToProps,{clickVisual,blank})(VisualList)
