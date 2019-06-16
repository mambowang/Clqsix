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
import {CliqueModel} from '../../../models'

import _ from 'lodash';
import {  CachedImage } from 'react-native-cached-image';
import fb from '../../../utils/FirebaseAPI'
import update from 'immutability-helper';

const { height, width } = Dimensions.get('window');
import * as globals from '../../../common/Global';
import { connect } from 'react-redux'
import { clickClique,blank } from '../../../actions/statusActions'
class CliqueList extends Component {
  cliqueData = [];  
  delta = 3;
  onEndReachedCalledDuringMomentum = true;  
  activeCliqueRef = null;
  
  constructor(props) {
    super(props);
    this.state = {
      cliqueData: [],
      originalCliqueData: [],
      lastId: null,      
      loading: false,
      refreshing: false,
      noData:false,
      enalbleLoading : true,
      counter: globals.middleLoadCount,
      thumbnailSource: globals.thumbnailSource,
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
    
    this.setState({ loading: true });    
    CliqueModel.getAllCliques(lastId,counter,snapshot => {
      if(snapshot.numChildren() > 0){
        this.cliqueData = [] ;
        snapshot.forEach((element) => {       
          this.cliqueData.unshift({key: element.key, ...element.val()});        
        });
        let lastData = _.last(this.cliqueData);
        let enalbleLoading = true;
        if(snapshot.numChildren() >=  counter){     
          this.cliqueData.pop();
        }else{
          enalbleLoading = false;
        }    
        if(!!this.cliqueListArea){
          this.setState({
            cliqueData: [...this.state.cliqueData,
              ...this.cliqueData] ,
            originalCliqueData: [...this.state.originalCliqueData,
              ...this.cliqueData] ,
            lastId:lastData.key,
            loading: false,
            refreshing: false,
            noData:false,
            enalbleLoading : enalbleLoading
          });
        }
        
      }else{
        if(!!this.cliqueListArea){
          this.setState({         
            loading: false,
            refreshing: false,
            noData:false,
          });
        }
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
      this.onEndReachedCalledDuringMomentum = true;
      //console.log("handleLoadMore"); 
      this.fetchCliqueRemoteData();
     
    }  
  }
  refreshNewCliqueData(cliqueid,clique){
    if(this.state.originalCliqueData.length == 0 ){
      return;
    }
    var index = _.findIndex(this.state.originalCliqueData, function(e) {
      return e.key == cliqueid;
    });
    if(index != -1){
      return;
    }
    
    var finalData = _.extend(clique,{key:cliqueid})
  
    this.setState({
      cliqueData: update(
        this.state.originalCliqueData,
        {
          $unshift: [finalData]
        }
      ),
      originalCliqueData: update(
        this.state.originalCliqueData,
        {
          $unshift: [finalData]
        }
      )
    })

  }
  enableDynamicLoading(){
    if(!!this.activeCliqueRef) {
      this.activeCliqueRef.off();
      this.activeCliqueRef = null;
    }
    this.activeCliqueRef =  fb.ref('/cliques/');
    let _this = this;
    this.activeCliqueRef.limitToLast(1).on('child_added', function(data) {
      _this.refreshNewCliqueData(data.key,data.val())     
    });
  }
  componentDidMount(){
    this.setState(
      {  
        cliqueData: [],
        originalCliqueData: [],
        lastId: null,      
        loading: false,
        refreshing: false,
        noData:false,
        enalbleLoading : true,      
      },
      () => {
        this.fetchCliqueRemoteData();
        this.enableDynamicLoading();
        
      }
    );   
    
  }  
  componentWillUnmount(){
    if(!!this.activeCliqueRef) {
      this.activeCliqueRef.off();
      this.activeCliqueRef = null;
    }
  }    
  goCliqueDetails =(cliqueId) =>{
    this.props.clickClique(cliqueId);
  }
  searchText = (e) => {
    let text =  e.text.toLowerCase()    
    let trucks = this.state.originalCliqueData
    let filteredName = trucks.filter((item) => {
        return !!item.name && item.name.toLowerCase().match(text)
      
    })
    if (!text || text === '') {
      if(!!this.cliqueListArea){
        this.setState({
          cliqueData: this.state.originalCliqueData
        })
      }
   
    } else if (!Array.isArray(filteredName) && !filteredName.length) {
      // set no data flag to true so as to render flatlist conditionally
      this.setState({
        noData: true
      })
    } else if (Array.isArray(filteredName)) {
      if(!!this.cliqueListArea){
        this.setState({
          noData: false,
          cliqueData: filteredName
        })
      }
    
    }
    //console.log(this.state.cliqueData);
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
  
  // renderItem={({item}) => this.renderCliqueItem(item)}   
  // ItemSeparatorComponent={this.renderSeparator}  
  render() {
    return ( 
      
      <View style={{flexGrow:1, backgroundColor:'white'}}>
        <View> 
          {/* <ClqsixTextInput         
            ref={ref=>this.search=ref} 
            placeholder='SEARCH CLIQUES'
            placeholderTextColor = {"#acacac"}                  
            onChangeText={(text) => this.searchText({text}) }
            needValidation={false}
            textStyle = {styles.searchText}    
            style={styles.search}
            onSubmitEditing={() =>  Keyboard.dismiss()} 
            /> */}
         </View>
         
          <FlatList
            ref={ref => this.cliqueListArea = ref}
                                    
            data={this.state.cliqueData}
            renderItem={({ item }) =>this.renderCliqueItem(item)}     
            style={{height: 300  }} 
            onEndReachedThreshold={0}    
            keyExtractor={item => item.key}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator ={false} 
            ListFooterComponent={this.renderFooter}
            onRefresh={this.handleRefresh}
            refreshing={this.state.refreshing}
            onEndReached={this.handleLoadMore}
            onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}          
            
            numColumns={2}
            
          />
        </View>
     
    )
  }

  renderCliqueItem(item) {
    return (  
          <TouchableOpacity  activeOpacity = {1}  onPress={() =>{this.goCliqueDetails(item.key) }}>
              <CachedImage
                source={{ uri: item.avatar.uri}}
                style={styles.itemcontainer}
                defaultSource =  {{ uri:this.state.thumbnailSource}}
                fallbackSource = {{ uri:this.state.thumbnailSource}}
              >
          
              <View style = {styles.itemtextArea}>
                <View style={styles.itembackdropView}>
                  <Text style={styles.itemheadline}>{item.name || ''}</Text>
                </View>
              </View>
              </CachedImage>
          </TouchableOpacity>     
        
    )
  }
};
const styles = StyleSheet.create({  
  container: {
    flex: 1,
    width: '100%' ,
   
  },
  itemcontainer: {    
    alignItems: 'stretch', 
    margin: 7, 
    width: width * 0.5 - 21, 
    height: width * 0.5 - 21,
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
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },

  itembackdropView: {    
   
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginBottom: 8,
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
    currentStatus: state.currentStatus
  }
}
export default connect(mapStateToProps,{clickClique,blank})(CliqueList)