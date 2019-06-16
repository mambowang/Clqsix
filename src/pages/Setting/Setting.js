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
    InteractionManager,
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
  KeyboardSpacer,
  Alert,
  ModalActivityIndicator
} from '../../components';

import {
  AuthAPI
} from '../../utils';
import * as Storage from '../../common/Storage';
import { signedOut } from '../../actions/userActions'
import { reset } from '../../actions/cliqueActions'
import { connect } from 'react-redux'
import { StackNavigator } from 'react-navigation';
const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;

class Setting extends Component {

  constructor(props) {
    super(props);
    this.state = {
        showActivityIndicator: false,
    }
  }
  _onNavigationRightButtonPress() {   
   
  }
  _onNavigationLeftButtonPress(){
    const { rootNavigation } = this.props;
  
    !!rootNavigation && rootNavigation.goBack();
  }
  signOut(){

    this.setState({
        showActivityIndicator: true
      });
      AuthAPI.signOut()
      .then(() =>{
            this.setState({
                showActivityIndicator: false
            });
            // let user = {};
            // Storage.setUser(user);
            this.props.signedOut();
            this.props.reset();           
      })
  }
  componentDidMount() {
   
  }
  render() {
 
    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
              <StatusBar hidden={false} />

        <CustomNavigator
          leftButton = {<Image source={Images.BackChevronLeft_Black_9x16}/>}   
          rightButton = {<Image source={Images.Friends_1200x1200} style = {{width:24,height:24,opacity:0}}/>}      
          onLeftButtonPress = {() => this._onNavigationLeftButtonPress()}        
          onRightButtonPress = {() => this._onNavigationRightButtonPress()}
        >
          <Text style={{ fontFamily:'SF UI Text', fontSize: 17, marginLeft:8, fontWeight:'bold'}}>Settings</Text>
        </CustomNavigator>
        <ScrollView ref="scrollView" style={{width:'100%'}}> 
            <FullScreen.Row style={styles.topview}>
                
            </FullScreen.Row>
       
            <FullScreen.Row style={styles.contentrow} >
            <TouchableOpacity style={styles.content}  
            onPress={() => { this.props.navigation.navigate('About')}}>          
                <Image style = {{width:16,height:16}} source={Images.About_400x400}/>         
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>About CLQSIX</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
            </TouchableOpacity>          
            </FullScreen.Row>

            <FullScreen.Row style={[styles.contentrow,{borderTopWidth: 0}]} >
            <TouchableOpacity style={styles.content}  
            onPress={() => { this.props.navigation.navigate('ChangePassword')}}>          
                <Image style = {{width:14,height:18}} source={Images.ChangePassword_350x450}/>         
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>Change Password</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
            </TouchableOpacity>          
            </FullScreen.Row> 

            <FullScreen.Row style={[styles.contentrow,{borderTopWidth: 0}]} >
            <TouchableOpacity style={styles.content}  
            onPress={() => { this.props.navigation.navigate('BlockedUsers')}}>          
               <Image style = {{width:16,height:16}} source={Images.BlockedUsers_400x400}/>            
                <View style = {styles.contenttextview} >
                    <Text style = {styles.contenttext}>Blocked users</Text>
                </View>          
                <Image source={Images.right_go_6x10}/>         
            </TouchableOpacity>          
            </FullScreen.Row> 

            <FullScreen.Row style={styles.bottomview}>
            <TouchableOpacity style={styles.bottomcontent}  
                    onPress={() => this.confirmAlert.show()}>     
                    <Text style = {styles.bottomfont}>Log Out</Text>
            </TouchableOpacity>          
        </FullScreen.Row>
        </ScrollView>
        <ModalActivityIndicator visible={this.state.showActivityIndicator} modal={false} />

        <Alert ref={ref=>this.confirmAlert=ref} 
                style={{backgroundColor:'#EF4244'}} 
                isStatic = {true}
                text={['Are you sure you want to ','log out of CLQSIX?']}
                closeButtonSource = {Images.check_17x13}
                cancleButtonSource = {Images.Cancel_White_13x13}
                onRequestCancle ={() => this.confirmAlert.hide()}
                onRequestClose = {() => this.signOut()}/>
      </FullScreen>
    );
  }
};

const styles = StyleSheet.create({
  topview: {
    alignItems:'center',
    marginHorizontal :25,
    backgroundColor: '#FFFFFF',
    height: 54,
  
  },
  bottomview: {   
    alignItems:'center',   
    height: 35,
    marginTop: 50,
  },
  bottomcontent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'center',    
    alignItems:'center',   
    borderColor:'#EEEEEE',
    width: 80,
    borderWidth:1, 
  },
  topfont: {
    fontFamily: 'SF UI Text', 
    fontSize: 13, 
    color: 'black', 
    fontWeight: 'bold',
  },
  bottomfont: {
    fontFamily: 'SF UI Text', 
    fontSize: 13, 
    color: '#ACACAC', 
    fontWeight: 'bold',
  },
  contentrow: {   
    paddingLeft :25,
    paddingRight: 20,
    paddingVertical:10,
    height: 70,
    borderWidth:1, 
    borderColor:'#EEEEEE', 

  },
  content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent:'space-between',    
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
  pageContainer: {
    height:175,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 25,
  },
  page: {
    alignItems:'center',
    justifyContent:'center'
  },
  pageText: {
    fontFamily:'SF UI Text',
    fontWeight:'900',
    fontSize:17,
    color:'white'
  }
});
function mapStateToProps(state) {
    return {
      currentClique: state.currentClique,
      currentUser: state.currentUser
      
    }
  }
  
export default connect(mapStateToProps,{reset,signedOut})(Setting)
