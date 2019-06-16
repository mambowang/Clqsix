'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    StyleSheet,
    View,
    Keyboard,
    TouchableOpacity,
    Image,
    TabBarIOS,
    TabBarItemIOS,
    Dimensions,
    Alert,
    Modal,
    FlatList,
    ActivityIndicator,
    StatusBar,
    TextInput,
    TouchableWithoutFeedback
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
  ModalActivityIndicator,
  Content,
  ScrollView,
  KeyboardSpacer
} from '../../components';
import {
  AuthAPI
} from '../../utils'
import fb from '../../utils/FirebaseAPI'
import {VisualModel,CliqueModel,UserModel,CommentModel} from '../../models';
import * as globals from '../../common/Global';
import {  CachedImage } from 'react-native-cached-image';
const { height, width } = Dimensions.get('window');

import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import Swipeout from 'react-native-swipeout';

import _ from 'lodash';
import update from 'immutability-helper';

class Comment extends Component {
    keyboardShowListener = null;
    keyboardHideListener = null;
    commentsRef = null;
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;    
    this.fetchLastRemoteData = this.fetchLastRemoteData.bind(this);
    this.state = {     
      loading: false,
      refreshing: false,
      thumbnailSource: Images.contact_icon_50x50,
      sharing: false,
      commentData: [],     
      enableDraw: true,
      uid:this.props.currentUser.uid || '',
      visualId: params.visualId,
      posterUid:params.posterUid,
      showActivityIndicator: false,
      postStatus: null,
      postCount: 0,
      sectionID: null,
      rowID: null,
    }
  }
  fetchLastRemoteData(lastCommentId) {   
    var index = _.findIndex(this.state.commentData, function(e) {
      return e.key == lastCommentId;
    });
    if(index != -1){
      return;
    }
    var _this = this;
    CommentModel.getUniqueCommentData(lastCommentId,snapshot => {
      if(_.size(snapshot) > 0){
        let commentData =  _.concat(snapshot,...this.state.commentData);      
        if(!!this.commentList){
          this.setState((prevState, props) => {
            return { 
              commentData:commentData,
              enableDraw: true   
             }
          });
        }
      }
    });
  }
  deleteComment(commentId,visualId,cliqueId,senderUid){
    this.setState({
      showActivityIndicator: true
    });
    CommentModel.deleteComment(commentId,visualId,cliqueId,senderUid,snapshot => {
      if(snapshot == "0"){
        var index = _.findIndex( this.state.commentData, function(e) {
          return e.key == commentId;
        }); 
        if(index != -1 ){
          this.setState({
            commentData: update(
                this.state.commentData,
                {
                  $splice: [[index, 1]]
                }
              )
          }); 
        }
      }
      this.setState({
        showActivityIndicator: false
      });
    });
  }
  shouldComponentUpdate(nextProps, nextState){
    if(!!nextState.loading) return false;
     return true;
  }
  fetchRemoteData() {
    this.setState({ loading: true });   
    let commentData = [] ; 
    const visualId = this.state.visualId;    
    CommentModel.getAllCommentOnVisual(visualId,snapshot => {
      if(_.size(snapshot) > 0){
        this.commentData = _.reverse(snapshot);    
        if(!!this.commentList){
          this.setState({
            commentData: [...this.commentData ],         
            loading: false,
            refreshing: false,
            noData:false,
          });
        }  
      }else{
        this.setState({         
          loading: false,
          refreshing: false,
          noData:false,
          enableDraw:false
        });
      }     
    });
   }
  // shouldComponentUpdate(nextProps, nextState){
  //   return JSON.stringify(nextState) != JSON.stringify(this.state)
  // }
  componentDidMount(){
   // console.log("componentDidMount");
   const visualId = this.state.visualId;
    if(!!this.commentsRef ){
      this.commentsRef.off();
      this.commentsRef = null;
    }
    this.commentsRef = fb.ref('visualComments/' + visualId + '/');
    var _this = this;
    this.commentsRef.limitToLast(1).on('child_added', function(data) {

      _this.fetchLastRemoteData(data.key);
    });
    this.fetchRemoteData();
  }  
  componentWillDismount() {
    if(!!this.commentsRef) {
      this.commentsRef.off();
      this.commentsRef = null;
    }
   
  }
  goBack() {
    const { navigation } = this.props;
    if(!!navigation.state.params){
      !!navigation.state.params.changeReactionSum && 
      navigation.state.params.changeReactionSum(this.state.postCount);
    }   
    navigation.goBack();       
    
  }
  goMemeber(memberId){    
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
      <Modal   transparent={true}>
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff'}}>
        <CustomNavigator
             leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
            rightButton = {<Image style = {{opacity :0 ,width:24,height:24}}  source={Images.Friends_1200x1200} />}      
            onLeftButtonPress = {() => this.goBack()}  
            onRightButtonPress  = {() =>{}}
          >
         <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:28, fontWeight:'bold'}}>Comments</Text>
        
        </CustomNavigator>  
          <ScrollView        
          ref={ref => this.commentList = ref} 
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
          scrollEnabledOnKeyboard={true}      
          style={{flex: 1, width: '100%'}} 
          contentContainerStyle={styles.content}
         >  
                   
                {!this.state.enableDraw ?
                    <View style = {styles.nocommentcontent}>                
                        <Image source={Images.comment_55x60}/>
                          <Text style = {styles.contenttext}>                                
                          </Text>
                        <Text style = {styles.contenttext}>
                        Comments will appear here   
                        </Text>                    
                        </View>
                    :
                       <FlatList     
                            data={this.state.commentData}
                            style={[styles.commentcontent,{height: 300}]} 
                            renderItem={({ item }) =>this.rendercommentItem(item)}         
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator ={false}   
                            keyExtractor={item => item.key}    
                            ItemSeparatorComponent={this.renderSeparator}     
                            ListFooterComponent={this.renderFooter}
                            refreshing={this.state.refreshing}
                        /> 
                } 
         </ScrollView> 
        <View style = {styles.postContent}>
                    <TextInput
                        multiline={true}
                        style={styles.inputField}
                        underlineColorAndroid='transparent'
                        placeholder='Add a comment'
                        value={this.state.postText}
                        onChangeText={(text) => this.setState({ postText: text })}
                        placeholderTextColor='#BBBBBB'
                    />
                    <TouchableOpacity style={styles.btnContainer} onPress={this._handleNewPost.bind(this)}>
                        <Text style={styles.btnPostText}>Post</Text>
                        </TouchableOpacity>     
                </View>
                <KeyboardSpacer />
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />    
      </FullScreen>
      </Modal>
    );
  }
  rendercommentItem(item){
    if(this.state.posterUid == this.state.uid){
      return this.renderSwapItem(item);
    }else{
      if(this.state.uid == item.senderUid){
        return this.renderSwapItem(item);
      }else{
        return this.renderNormalItme(item);
      }
    }
  }
  renderNormalItme(item){
    return(
    <View style={styles.itemcontainer}>    
      <View   >    
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
      </View>
        <View style = {styles.namecontent}>
        <Text style = {styles.itemtext}>
            {this.props.currentUser.uid == item.senderUid? "You" : item.userName|| ''} 
                <Text style = {{ fontWeight: '500',}}>
                    {" "}{ item.body || ''}
                  </Text>
            </Text>
        </View>             
    </View>  
    );
  }
  renderSwapItem(item, sectionID: number, rowID: number) {
    var _this = this;
    var swipeoutBtns = [
      {
        text: 'Delete',
        onPress: function(){_this.deleteComment(item.key,item.toVisualId,item.toCliqueId,item.senderUid) },
        type: 'primary',
        backgroundColor: 'red'
      }
    ]
    return (   
      <Swipeout
      right={swipeoutBtns}
      rowID={rowID}
      sectionID={sectionID}
      autoClose={false}
      onOpen={(sectionID, rowID) => {
        this.setState({
          sectionID,
          rowID,
        })
      }}
      style ={{ backgroundColor: 'white'  }}
      onClose={() => console.log('===close') }
      scroll={event => console.log('scroll event') }
    >
        <View style={styles.itemcontainer}>    
          <TouchableOpacity    onPress={() => {this.goMemeber(item.senderUid)}}>    
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
            <View style = {styles.namecontent}>
            <Text style = {styles.itemtext}>
                {this.props.currentUser.uid == item.senderUid? "You" : item.userName|| ''} 
                    <Text style = {{ fontWeight: '500',}}>
                        {" "}{ item.body || ''}
                      </Text>
                </Text>
            </View>             
        </View>  
          </Swipeout>

    )
  }
  _handleNewPost() {
    let postText = this.state.postText;
    let visualId = this.state.visualId;
    if (postText && postText != '') {
      this.setState({
        showActivityIndicator: true
      });
      VisualModel.postCommentToVisual(visualId,postText,(res) =>{
        if(res == "0"){
          Keyboard.dismiss();
          this.setState((prevState, props) => {
            return { 
              postCount: prevState.postCount + 1,
              showActivityIndicator: false,
              postText: ""
             }
          });
          // this.setState({
          //   showActivityIndicator: false,
          //   postText: ""
          // });
        }
      })
    }
   
  }
};
const contentPaddingHorizontal = 20;

const styles = StyleSheet.create({  
  content: {
    flex: 1,
    flexDirection: 'column', 
    justifyContent: 'flex-start',
    alignItems : 'center',
    paddingHorizontal: contentPaddingHorizontal,
  },

  commentcontent:{
    marginTop: 15,
    width: '100%' ,
  
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
  nocommentcontent: {
    flex:1,
    flexDirection: 'column', 
    justifyContent: 'center',
    alignItems : 'center',
    width: '100%' ,
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
  itemtitletext:{
    color: "#919191"
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
  postContent:{
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    borderWidth: 1,
    borderColor: "#CED0CE",
    paddingLeft: 25,
    width:'100%'
  },
  inputField: {
    fontSize: 15,
    width: 250,
  },
  btnContainer:{
    justifyContent: 'center',
    alignItems: 'center',
    paddingRight: 25,
  },
  btnPostText:{
    color:"#0F7EF4",
    fontWeight:'bold',
    fontSize: 15
  }
});

function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}
export default connect(mapStateToProps)(Comment)
