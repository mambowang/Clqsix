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
} from '../../utils'
import {VisualModel,CliqueModel,UserModel,ReactionModel} from '../../models';
import { connect } from 'react-redux';
const { height, width } = Dimensions.get('window');


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import _ from 'lodash';
import * as globals from '../../common/Global';
import {  CachedImage } from 'react-native-cached-image';

class Reaction extends Component {

  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      counter: globals.largeLoadCount,
      lastId: null,
      loading: false,
      refreshing: false,
      thumbnailSource: Images.contact_icon_50x50,
      sharing: false,
      reactData: [],
     
      invitereacts: [],
      enableCreate: true,
      uid:this.props.currentUser.uid || '',
      enalbleLoading : true,
      visualId: params.visualId,


      reactionSum: params.reactionSum,

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
    const visualId = this.state.visualId;
    this.setState({ loading: true });   
    let reactData = [] ; 
    ReactionModel.getReactionOnVisual(visualId,lastId,counter,snapshot => {
      if(_.size(snapshot) > 0){
        this.reactData = _.reverse(snapshot);             
        let lastData = _.last(this.reactData);
        let enalbleLoading = true
        if(_.size(snapshot) >= counter){        
          this.reactData.pop();  
        }else{
          enalbleLoading = false;
        }        
        if(!!this.reactionList){
          this.setState({
            reactData: [...this.state.reactData,
              ...this.reactData] ,         
            lastId:lastData.key,
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
    if (!this.onEndReachedCalledDuringMomentum  && !this.state.loading) {      
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
    const { navigation } = this.props;
    navigation.goBack();       
  }
  goMemeber(memberId){
    if(memberId == this.props.currentUser.uid){
      return;
    }
    
    if(!!this.props.rootNavigation){
      this.props.rootNavigation.navigate('MemberRoot', {memberId: memberId});   
    }else if(!!this.props.navigation){
      this.props.navigation.navigate('MemberRoot',{memberId: memberId});   
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
        <CustomNavigator
             leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
            rightButton = {<Image source={Images.Friends_1200x1200} style={{width:24,height:24,opacity:0 }}/>}      
            onLeftButtonPress = {() => this.goBack()}  
            onRightButtonPress  = {() =>{}}
          >
         <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:28, fontWeight:'bold'}}>
         {this.state.reactionSum} Reactions
         </Text>
        
        </CustomNavigator>  
        <View style = {styles.container}   ref={ref => this.reactionList = ref}>
               
               {!this.state.enableCreate ?
                <View style = {styles.noreactcontent}>                
                    <Image source={Images.react_55x60}/>
                    <Text style = {styles.contenttext}>
                              
                    </Text>
                    <Text style = {styles.contenttext}>
                    No reactions yet
                    </Text>
                   
                    </View>
                :
              // <View style = {styles.reactcontent}>
                  <FlatList
                  
                                      
                    data={this.state.reactData}
                    style={{height: 300}} 
                    renderItem={({ item }) =>this.renderreactItem(item)}         
                    onEndReachedThreshold={1}   
                    onEndReached={this.handleLoadMore}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator ={false}   
                    ListHeaderComponent={this.renderHeader}
                    keyExtractor={item => item.key}
                    ListFooterComponent={this.renderFooter}
                    onRefresh={this.handleRefresh}
                    refreshing={this.state.refreshing}
                    ItemSeparatorComponent={this.renderSeparator}     
                    onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
                  />
              // </View>
              } 
            </View>     
      </FullScreen>
    );
  }
  renderreactItem(item) {
    return (        
        
        <View style={styles.itemcontainer}>        
          <TouchableOpacity  onPress={() => {this.goMemeber(item.senderUid) }}>    

           {!item.photoURL ? 
            <Image source={this.state.thumbnailSource} style = {styles.imagestyle}/>           
              :
              <View style={{
                backgroundColor: '#fff',
                borderRadius: 25,
                overflow: 'hidden',
              }}>
               
                 <CachedImage
                source={{ uri:  item.photoURL}}
                style={styles.imagestyle}
                defaultSource =  {this.state.thumbnailSource}
                fallbackSource = {this.state.thumbnailSource}     
                            />
              </View>

          
           }
           </TouchableOpacity>
            {/* <View style = {styles.namecontent}>
               <Text style = {styles.itemtext}>
               {this.props.currentUser.uid == item.senderUid? "*You" : "*" + (item.userName|| '')} 
                   <Text style = {{ fontWeight: '500',}}>
                       {" "}{ item.body || ''}
                     </Text>
               </Text>
            </View>    */}
           {item.type == "commented" ?
             <View style = {styles.namecontent}>
               <Text style = {styles.itemtext}>
               {this.props.currentUser.uid == item.senderUid? "*You" : "*" + (item.userName|| '')} 
               <Text style = {{ fontWeight: '500',}}>
                   {" "}{ item.body || ''}
                 </Text>
               </Text>
            </View>   
            :
             <View style = {styles.namecontent}>
                {/* <Text style = {styles.itemtitletext}> 
                {'* '} 
                </Text> */}
                
                <Text style = {styles.itemtext}>
                {this.props.currentUser.uid == item.senderUid? "You" : "" + (item.userName|| '')} 
                <Text style = {{ fontWeight: '500',}}>
                    {" "}{ item.body || ''}
                  </Text>
                </Text>
            </View>     
           }           
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
  reactcontent:{
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
  noreactcontent: {
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
    maxWidth: width - 100,
    
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
  itemtitletext:{
    color: "#919191"
  },
});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps)(Reaction)