'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
    StyleSheet,
    View,
    TouchableOpacity,
    StatusBar,
    Image,
    ScrollView,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Modal,
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
  Loading,
  Alert
} from '../../../components';
import {
  AuthAPI
} from '../../../utils'
import fb from '../../../utils/FirebaseAPI';
import {VisualModel,CliqueModel,UserModel,ReactionModel} from '../../../models';

import Hyperlink from 'react-native-hyperlink';
import {  CachedImage } from 'react-native-cached-image';
import _ from 'lodash';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
import MasonryList from '@appandflow/masonry-list';
import VideoPlayer from 'react-native-video-player';
import * as globals from '../../../common/Global';

const PHOTOSIZE = window.width * 0.7
const PHOTORADIUS = PHOTOSIZE/ 2
let delta = 60;
let visualWidth = (window.width - delta) / 5;

class SingleProfile extends Component {
   onEndReachedCalledDuringMomentum = true;
   reactionData = [] ;
  constructor(props) {
    super(props);   
    this.state = {
      uid:this.props.currentUser.uid,
      cliqueId: this.props.currentClique.lastCliqueId,  
      currentUser:this.props.currentUser,
      thumbnailSource:globals.thumbnailSource,     
      thumbnailContactSource: Images.MemberPhoto_2600x2600, 
      hasReactions: false,
      userData: {},
      reactionData:[],
      isLoading: false,
      counter: globals.smallLoadCount,
      lastId: null,
      loading: false,
      refreshing: false,
      enalbleLoading: true,
      invitedCliques: 0,      
    }
  }
  shouldComponentUpdate(nextProps, nextState){
    if(!!nextState.loading) return false;
     return true;
  }
  componentWillReceiveProps(nextProps){  
    
    if (JSON.stringify( this.props.currentUser) 
      != JSON.stringify( nextProps.currentUser )){
     this.setState({
       currentUser: nextProps.currentUser
     })
    }     
  }
  goViewRequest(){
    !!this.props.navigation && this.props.navigation.navigate('ViewRequest');   
  }
  goCreateClique(){
    !!this.props.navigation && this.props.navigation.navigate('InviteClique');   
  }
  goVisualDetails(visualId){
    !!this.props.navigation && this.props.navigation.navigate('VisualRoot',
    {visualId: visualId});  
  }
  fetchRemoteUser(){
    const uid = this.state.uid;
    UserModel.getUniqueUser(uid,(userData) => {
      this.setState({
        userData:userData,
       
      })
        // CliqueModel.getInvitedCliquesIds(uid,(snapshot) => {
        //   this.setState({
        //     userData:userData,
        //     invitedCliques:_.size(snapshot.val())
        //   })

        // })
    })
  }
  fetchRemoteReactionData(){
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
    ReactionModel.getReactionOnUser(uid,lastId,counter,snapshot => {        
      if(_.size(snapshot) > 0){
        this.reactionData = [] ;
        snapshot.forEach((element) => { 
          let height = 0;
          if(element.visualType == 'text'){
             height = visualWidth  ; 
          }else if(element.visualType == 'link'){
            height = visualWidth * 0.55 ; 
         }else{
             height = visualWidth * element.ratio ; 
          }      
          this.reactionData.unshift({height: height,...element});       
        
        });
        let lastData = _.last( this.reactionData);
        let enalbleLoading = true;
        if(_.size(snapshot) >= counter){        
          this.reactionData.pop();
        }else{
          enalbleLoading = false;
        }
        if(!!this.reactionList){
          this.setState((prevState, props) => {
            return { 
              reactionData: [...prevState.reactionData,
                ... this.reactionData] ,
              loading: false,
              refreshing: false,
              lastId:lastData.key,
              enalbleLoading: enalbleLoading,
              hasReactions: true,
             }
          });
        }
        
 
      }else{
        if(!!this.reactionList){
          this.setState({        
            loading: false,
            refreshing: false,        
         });
        }
    }                  
  });
}
componentDidMount(){
  this.fetchRemoteUser();
  this.fetchRemoteReactionData();
}
  goSwitchMember(){
    !!this.props.navigation && this.props.navigation.navigate('SwitchMember',
    {cliqueId: this.state.cliqueId});   
  }
  goFrequency(){
    !!this.props.navigation && this.props.navigation.navigate('UserFrequency',
    {cliqueId: this.state.cliqueId,uid: this.state.uid});   
  }
  goFollowingCliques(){
    !!this.props.navigation && this.props.navigation.navigate('FollowingClique',
    {uid:this.state.uid, follwoingSum: this.state.userData.followingSum,fromProfile:true});   
  }
  goEditMember(){
    let currentUser = this.state.currentUser;
    let memberData = {
      name: currentUser.name,
      description : currentUser.description || '',
      uid: currentUser.uid,
      avatarImage: currentUser.photoURL
    };   
    !!this.props.navigation && this.props.navigation.navigate('EditSingleProfile',
    {memberData: memberData});    
  }
  handleRefresh = () => {
    if(!!this.state.loading) return;
    this.setState(
    {  
        refreshing: true
    },
      () => {    
        this.fetchRemoteReactionData();
      }
    );
  }
  handleLoadMore = () => {        
    if (!this.onEndReachedCalledDuringMomentum && !this.state.loading) {   
      this.onEndReachedCalledDuringMomentum = true;
      
      this.fetchRemoteReactionData();
    }  
    
  }
  renderSeparator = () => {
    return (
      <View
        style={{
          height: 0,
          width: "100%",
          backgroundColor: "#CED0CE",
        
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
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };
  renderHeader = () => {
    let currentUser = this.state.currentUser;
    return (
      <View style = {{paddingHorizontal : 20, }}>
        <View style = {styles.userAvatarArea}>
          <View style={{backgroundColor: '#fff',
            borderRadius: PHOTORADIUS,overflow: 'hidden',}}>       
             {!! currentUser.photoURL 
             ? 
             <CachedImage
             source={{uri :currentUser.photoURL}}
             defaultSource =  {this.state.thumbnailContactSource}
             fallbackSource = {this.state.thumbnailContactSource}               
             style={styles.userAvatar}
             />   
             :
             <CachedImage
             source={this.state.thumbnailContactSource}
             defaultSource =  {this.state.thumbnailContactSource}
             fallbackSource = {this.state.thumbnailContactSource}               
             style={styles.userAvatar}
             />   
            } 
              
          </View>          
          <View  style = {styles.userActionContent} >   
            <TouchableOpacity style = {styles.editcontent} onPress={() => this.goEditMember() }>
              <Text style = {styles.editcontenttext}>
              Edit Page
              </Text>
            </TouchableOpacity> 
           
          
          </View>  
        </View> 
        <View style = {{marginBottom:10}}>
          <View style = {[styles.itemtextArea,{}]}>
              <View style={styles.itembackdropView}>
                <Text style={styles.itemNameline}>{currentUser.name || ''}</Text>
              </View>
              <View style={styles.itemLocationdropView}>
                <Text style={styles.itemheadline}>{currentUser.description || ''}</Text>
              </View>
              
          </View>
          <View style = {styles.actionArea}>
            
                {/* <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => {}}>
                  <Text style = {styles.sumTextArea }>{this.state.userData.visualSum || 0}</Text>
                  <Text style = {styles.sumTitleTextArea }>{"  "}visuals{"  "}</Text>
                </TouchableOpacity>       */}
                 {/* <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  
                  onPress={() => { this.inviteAlert.show()}}>
                  <Text style = {styles.sumTextArea } >{ (this.state.invitedCliques ||  0 )}</Text>
                  <Text style = {styles.sumTitleTextArea }>invites</Text>
                </TouchableOpacity> */}
                {/* <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => { this.goFrequency()}}>
                  <Text style = {styles.sumTextArea } >{
                    (this.state.userData.givenFreqSum ||  0 )
                    + (this.state.invitedCliques ||  0 ) }
                    </Text>
                  <Text style = {styles.sumTitleTextArea }>frequency</Text>
                </TouchableOpacity> */}
                 <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white'}]}  onPress={() => { this.goFrequency()}}>
                  <Text style = {styles.sumTextArea } >
                  {((this.state.userData.givenFreqSum + this.state.userData.followingSum) ||  0 )}
                    </Text>
                  <Text style = {styles.sumTitleTextArea }>frequency</Text>
                </TouchableOpacity>
                <TouchableOpacity style ={[styles.actionItemArea,{backgroundColor: 'white',marginLeft:20}]}  
                onPress={() => {this.goFollowingCliques()}}>
                  <Text style = {styles.sumTextArea } >{this.state.userData.followingSum || 0}</Text>
                  <Text style = {styles.sumTitleTextArea }>following{" "}</Text>
                </TouchableOpacity> 
          </View>  
          <View style={{ height: 1, width: "100%", marginTop: 15, backgroundColor: "#DDDDDD",}}/>
            <Text style = {styles.visualTitleText}>Reactions</Text>
            {!this.state.hasReactions &&
              <View style = {styles.visualcontent}>                   
                    <View style={styles.noreactionArea}>  
                    <Image style = {{width: 138, height: 30}} source = {Images.reaction_696x150}></Image>
                    <Text style={[styles.itemheadline,{marginTop: 10,fontWeight: 'bold'}]}>Your reactions to visuals</Text>
                    <Text style={[styles.itemheadline,{fontWeight: 'bold'}]}>will appear here.</Text>
                    </View> 
              </View>
            }
        </View>
      </View>
    );
  };
  render() {
    let currentUser = this.state.currentUser;

    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
       <StatusBar hidden={false} />
      <CustomNavigator
          leftButton = {
            <View style = {{ flexDirection : 'row'}}>
              <Text style={{ fontFamily:'SF UI Text', fontSize: 17, marginLeft:3, fontWeight:'bold'}}>
                individual
              </Text>
              <Image source={Images.Switch_700x450} style = {{marginLeft:7,marginTop : 8,width:16,height:9}}/>
            </View>
          }   
          rightButton = {<Image  source={Images.More_1125x250} style = {{opacity: 1,width:23,height:5}}/>}      
          onLeftButtonPress = {() => this.goSwitchMember()}     
          onRightButtonPress = {() => this.moreActionSheet.show()} 
        >
      </CustomNavigator>
        <MasonryList    
              data={this.state.reactionData}  
              ref={ref => this.reactionList = ref}
              renderItem={({ item }) =>this.renderReactionItem(item)}
              horizontal = {false}
              keyExtractor={item => item.key}
              ListHeaderComponent={this.renderHeader}
              onEndReachedThreshold={0}       
              style = {{width:'100%'}}  
              refreshing={this.state.refreshing}
              
              onEndReached={this.handleLoadMore}
              showsHorizontalScrollIndicator={false}
              showsVerticalScrollIndicator ={false}      
              numColumns={5}
              getHeightForItem={({ item }) => item.height + 2}
              onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}                         
          />  
          <Alert ref={ref=>this.inviteAlert=ref} 
             style={{backgroundColor:'#24D770'}}            
             isStatic = {false}
             text={['Total amount of clique invites',' you\'ve been sent.']}
             closeButtonSource = {Images.check_17x13}
             onRequestClose={() => this.inviteAlert.hide()}/>

      <Options ref={ref=>this.moreActionSheet=ref}   
        style = {{ paddingBottom: 20}}
          items={[ { value: 0, text: 'Create a clique'},{ value: 1, text: 'Join a clique'}] }

          onSelectItem={(item) => { 
            if(item.value == 0){
              this.moreActionSheet.hide(); 
              this.goCreateClique();
            }else if(item.value == 1){
              this.moreActionSheet.hide();
              this.goViewRequest();
            }
            return false; }} />
      </FullScreen>
    );
  }
  renderReactionItem(item){
    let reactionStyle = { height: item.height, width: visualWidth,};      
    
    return (
      <TouchableOpacity  activeOpacity = {1}   onPress={() => {this.goVisualDetails(item.visualId) }}>    
        <View  style={[styles.itemcontainer,reactionStyle]}>
          {item.visualType == 'text' ? 
             <View style = {[styles.itemtextcontainer]}>         
              <Text style = {styles.itemtextcontent}> 
               {item.text.length > 21 ? item.text.substr(0,20) + "..." :item.text }
              </Text>               
            </View>          
          : 
          <CachedImage
          source={{ uri: item.photoURL}}
          defaultSource =  {{ uri:this.state.thumbnailSource}}
          fallbackSource = {{ uri:this.state.thumbnailSource}}                
          style={{width:reactionStyle.width,
            height: reactionStyle.height}}
          />   
          }
         
        </View>
        {/* <View style = {styles.reactionStatus}>
              {item.type == "liked" && <Image source = {Images.Like_Red_17x17}/>}
              {item.type == "disliked" && <Image source = {Images.Dislike_Brown_17x17}/>}
              {item.type == "commented" && <Image source = {Images.Comment_Blue_17x17}/>}
              {item.type == "shared" && <Image source = {Images.Share_Yellow_17x17}/>}

              <Text style = {{marginLeft: 5 ,fontWeight:'bold'}}>{item.type}  </Text>
            </View> */}
         
      </TouchableOpacity>    
    ); 
    
  }
};
SingleProfile.propTypes = {
  currentClique: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired

}
const styles = StyleSheet.create({  
  userAvatarArea:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',   
    marginTop:10,
  
  
  },
  userAvatar: {
    width: PHOTOSIZE ,
    height: PHOTOSIZE ,
  },
  userActionContent: {
    width: '100%' ,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop:-18,
    // position: "absolute" ,
    // bottom: -18,
    
  },

  editcontent: {
    borderColor : "#BBBBBB",
    borderWidth: 1,
    height:35,
    width: 165,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    
    
  },
  editcontenttext: {
    justifyContent: 'center',
    alignSelf: 'center',    
    fontWeight: 'bold',
    //color: '#BBBBBB',
  },
  itemtextArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-start',   
    marginTop: 30,
   // paddingLeft : 30,
   // paddingBottom: 20,
  },
  cliqueStateContent: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    //paddingHorizontal : 20,  
    paddingVertical: 15,
    borderTopWidth:0, 
    borderBottomWidth:0, 
    borderColor:'#DDDDDD', 
  },
  cliquefrequenceText:{ 
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    textDecorationColor: '#bbbbbb',
    color:'#bbbbbb' 
    
  
  },
  itembackdropView: {
 
    width: '100%',
    //marginBottom: 4,    
    justifyContent: 'flex-end',
    alignItems: 'flex-start',  
  },
  itemLocationdropView: {
    marginTop: 5,
    width: '100%',
   // marginBottom: 4,    
    justifyContent: 'center',
    alignItems: 'flex-start',   
  },
  itemNameline: {
    fontSize: 20,
   // textAlign: 'center',
    fontWeight: 'bold', 
  },
  itemheadline: {
    fontSize: 15,
   // textAlign: 'center',
    color: '#000000'
  },
  itemcontainer: {    
    alignItems: 'stretch', 
    margin: 7,
    marginBottom:10,
    
 },
 actionArea: {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  paddingVertical: 20,

},
actionItemArea: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  //padding: 5,
},
sumTextArea:{
  textAlign: 'center',
  fontWeight: 'bold',
},
sumTitleTextArea:{
  textAlign: 'center',
  fontWeight: 'bold',
  color: '#bbbbbb',
  marginLeft:5,
},
itemtextcontainer: {     
  flex: 1,
  justifyContent: 'flex-start',
  paddingHorizontal: 10, 
  paddingTop: 10,
  alignItems: 'flex-start',
  backgroundColor: '#F4F4F4',
},
itemtextcontent: {
  fontSize: 10,
  textAlign: 'left',
},




 visualTitleText:{
     fontSize: 15,
     textAlign: 'center',
     color: '#bbbbbb',
     fontWeight: 'bold', 
     marginTop:30,
     marginBottom: 15,
 },
 visualcontent: {
   marginTop: 20,
   marginBottom: 10,
 },
 noreactionArea:{
  flex:1,
  flexDirection: 'column', 
  justifyContent: 'center',
  alignItems : 'center',
  marginTop: 30,
 },
 reactionStatus:{
  flex:1,
  flexDirection: 'row', 
  justifyContent: 'flex-start',
  alignItems : 'center',
  marginLeft: 14,
  
 }
});
function mapStateToProps(state) {
  return {
    currentClique: state.currentClique,
    currentUser: state.currentUser
    
  }
}

export default connect(mapStateToProps) (SingleProfile);