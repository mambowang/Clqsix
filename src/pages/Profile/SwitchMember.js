'use strict';

import React, { Component } from 'react';
import PropTypes from 'prop-types'

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
    StatusBar,
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
} from '../../components';
import {
  AuthAPI
} from '../../utils'
import {  CachedImage } from 'react-native-cached-image';

import {VisualModel,CliqueModel,UserModel,CommentModel} from '../../models';
import { connect } from 'react-redux';


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import _ from 'lodash';
import * as globals from '../../common/Global';
import { changeType } from '../../actions/userActions'
import { changeLastClique } from '../../actions/cliqueActions'
class SwitchMember extends Component {

  constructor(props) {
    super(props);
    this.state = {
        thumbnailOfflineSource: Images.contact_icon_50x50,      
        thumbnailSource: globals.thumbnailContactSource,     
        createdCliqueData: [],   
        uid:this.props.currentUser.uid,
        enableLoading: true,
        hasCliques: false,
        loading: false,
    }
  }
  fetchRemoteData() {
    let currentClique = this.props.currentClique;
    let currentUser = this.props.currentUser;
    this.setState({ loading: true });   
    let createdCliqueData = [] ; 
    CliqueModel.getCreatedCliques(this.state.uid,snapshot => {
      if(_.size(snapshot) > 0){
        createdCliqueData = snapshot;             
        createdCliqueData = _.map(createdCliqueData, function(e) {
          let isSelected = false;
          if(currentUser.type == "clique" && currentClique.lastCliqueId == e.key){
            isSelected = true;
          }
          return _.extend(e, {isSelected:isSelected,key: e.key});
        });
        if(!!this.cliqueList){
          this.setState((prevState, props) => {
            return { 
              createdCliqueData: [...prevState.createdCliqueData,
                ...createdCliqueData] ,           
                hasCliques: true,
                loading: false,
             }
          }); 
        }
      }else{
        this.setState({         
          loading: false,             
        });
      }
    });
}
componentDidMount(){   
    this.fetchRemoteData();
} 
changeToSingleUser(){
    let currentUser = this.props.currentUser;
    let currentType = currentUser.type;
    if(currentType == "clique"){
        this.props.changeType("single");
    }
    this.goBack();
    // if (this.props.goProfile) {
    //     this.props.goProfile();
    // }
}
changeActiveClique(cliqueId){
    let currentUser = this.props.currentUser;
    let currentType = currentUser.type;
    let currentClique = this.props.currentClique;
    let currentActiveClique = currentClique.lastCliqueId;
   
    if(currentActiveClique != cliqueId){       
        this.props.changeLastClique(cliqueId);        
    }
    if(currentType == "single"){
      this.props.changeType("clique");
    }
    this.goBack();
    // if (this.props.goProfile) {
    //     this.props.goProfile();
    // }
}
  goBack() {
    const { navigation } = this.props;
    navigation.goBack();       
  }
  render() {
   
    let currentUser = this.props.currentUser;
    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff'}}>
        <CustomNavigator
            leftButton={<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}
            rightButton = {<Image style = {{opacity :0 ,width:24,height:24}}  source={Images.Friends_1200x1200} />}      
            onLeftButtonPress = {() => this.goBack()}  
            onRightButtonPress  = {() =>{}}
          >
         <Text style={{fontFamily:'SF UI Text', fontSize: 17,  fontWeight:'bold'}}>Switch Pages</Text>        
        </CustomNavigator> 
        
        <FullScreen.Row style={styles.topview}>
            <View >
            
            </View>
        </FullScreen.Row>
        <FullScreen.Row style={styles.contentrow} >
          <TouchableOpacity style={styles.content} 
            onPress={() => { this.changeToSingleUser()}}>          
           {!currentUser.photoURL ? 
                    <Image source={this.state.thumbnailOfflineSource} style = {styles.imagestyle}/>            
                    :
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 25,
                        overflow: 'hidden',
                      }}>             
                        <CachedImage
                        source={{ uri:  currentUser.photoURL}}
                        defaultSource =  {{ uri:this.state.thumbnailSource}}
                        fallbackSource = {{ uri:this.state.thumbnailSource}}
                        
                        style={styles.imagestyle}
                        />
                  </View>
                    
            }      
            <View style = {styles.contenttextview} >
                <Text style = {styles.contenttext}>{ currentUser.name } (individual)</Text>
            </View>      
            {currentUser.type == "single" &&    
            <Image source={Images.oval_17x17}/>         
            }
          </TouchableOpacity>          
        </FullScreen.Row> 
        <View style = {{flex:1,width:'100%',marginBottom: 0}}>
         <FlatList
            style={{ marginBottom: 0}} 
            ref={ref => this.cliqueList = ref}
            data={this.state.createdCliqueData}           
            renderItem={({item}) =>this.renderCliqueItem(item)}         
            keyExtractor={item => item.key}   
        /> 
       </View>
      </FullScreen>
    );
  }
  renderCliqueItem(item) {
    let currentClique = this.props.currentClique;
    return (       
        <FullScreen.Row style={[styles.contentrow,]} >
        <TouchableOpacity style={styles.content} 
          onPress={() => { this.changeActiveClique(item.key)}}>          
            {!item.avatar ? 
                <Image source= { this.state.thumbnailOfflineSource} style = {styles.imagestyle}/>            
                :
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
            }
            <View style = {styles.contenttextview}>
                <Text style = {styles.contenttext}>{item.name || ''}</Text>
            </View> 
            {!! item.isSelected &&    
            <Image source={Images.oval_17x17}/>         
            }
          </TouchableOpacity>          
        </FullScreen.Row> 
       
       
       
    )
  }//
};
const styles = StyleSheet.create({  
    topview: {
        alignItems:'center',
        marginHorizontal :25,
        marginTop: 30,
      },
    contentrow: {   
        paddingLeft :25,
        paddingRight: 20,
        paddingVertical:10,
        height: 87,
        borderWidth:1, 
        borderColor:'#EEEEEE', 
    
      },
      content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'flex-start',    
        alignItems:'center',   
        width: '100%'
      },
      contenttextview:{   
        flex: 1,
        flexDirection: 'row',
        justifyContent:'flex-start',    
        marginLeft:15,
      },
      contenttext:{
        fontFamily: 'SF UI Text', 
        fontSize: 13,  
        fontWeight: 'bold',
        paddingLeft: 10,
        textAlign: "left" ,
      },
      imagestyle:{
        width: 50,
        height: 50
      },
});
SwitchMember.propTypes = {
    goProfile: PropTypes.func,
  
  
  }
function mapStateToProps(state) {
    return {
      currentUser: state.currentUser,
      currentClique: state.currentClique,
    }
}
  
export default connect(mapStateToProps,{changeLastClique,changeType})(SwitchMember)
