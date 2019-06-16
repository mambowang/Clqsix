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
  
} from '../../../components';

import {
  AuthAPI
} from '../../../utils'
import { StackNavigator } from 'react-navigation';
const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;

class SingleOption extends Component {

  constructor(props) {
    super(props);
    this.state = {
     // interactionsComplete: false
    }
  }
  _onNavigationRightButtonPress() {   
    !!this.props.navigation && this.props.navigation.navigate('ShareRoot');
  }
  _onNavigationLeftButtonPress(){
    !!this.props.navigation && this.props.navigation.navigate('SettingRoot');
  }
  componentDidMount() {
    // InteractionManager.runAfterInteractions(() => {
    //   this.setState({interactionsComplete: true});
    // });
  }
  render() {
    // if (!this.state.interactionsComplete) {
    //   return (<Text></Text>);
    //   }
    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
        <StatusBar hidden={false} />
        <CustomNavigator
          leftButton = {<Image style = {{width:20,height:20}} source={Images.Settings_1000x1000}/>}   
          rightButton = {<Image style = {{width:24,height:24}} source={Images.Friends_1200x1200}/>}      
          onLeftButtonPress = {() => this._onNavigationLeftButtonPress()}        
          
          onRightButtonPress = {() => this._onNavigationRightButtonPress()}   
        >
          <Text style={{ fontFamily:'SF UI Text', fontSize: 17, marginLeft:8, fontWeight:'bold'}}></Text>
        </CustomNavigator>
        <ScrollView ref="scrollView" style={{width:'100%'}}> 

        <FullScreen.Row style={styles.topview}>
        <View >
          <Text style={styles.topfont}>Join the squad</Text>
          <Text style={styles.topfont}>community</Text>
        </View>
    </FullScreen.Row>
    <FullScreen.Row style={styles.topimgview}>
        <View >
        <Image style = {styles.topimg} source={Images.option_1414x410}/> 
        </View>
    </FullScreen.Row>    
       
        <FullScreen.Row style={styles.contentrow} >
          <TouchableOpacity style={styles.content}  
          onPress={() => { this.props.navigation.navigate('InviteClique')}}>          
            <Image style = {{width:14,height:19}} source={Images.Create_clique_700x950}/>         
            <View style = {styles.contenttextview} >
                <Text style = {styles.contenttext}>Create Clique</Text>
            </View>          
            <Image source={Images.right_go_6x10}/>         
          </TouchableOpacity>          
        </FullScreen.Row>

        <FullScreen.Row style={[styles.contentrow,{borderTopWidth: 0}]} >
          <TouchableOpacity style={styles.content}  
          onPress={() => { this.props.navigation.navigate('ViewRequest')}}>          
            <Image source={Images.CliqueInvites_150x150} style = {{width:16,height:16}}/>         
            <View style = {styles.contenttextview} >
                <Text style = {styles.contenttext}>View Clique Invites</Text>
            </View>          
            <Image source={Images.right_go_6x10}/>         
          </TouchableOpacity>          
        </FullScreen.Row> 
        {/* <FullScreen.Row style={styles.bottomview}>
            <View >
              <Text style={styles.topfont}>Get rewarded for inviting</Text>
              <Text style={styles.topfont}>friends to join CLQSIX.</Text>
            </View>
        </FullScreen.Row>
        <FullScreen.Row style={styles.contentrow} >
          <TouchableOpacity style={styles.content}  
          onPress={() => { this.props.navigation.navigate('ViewRequest')}}>          
            <Image source={Images.Gift_14x13}/>         
            <View style = {styles.contenttextview} >
                <Text style = {styles.contenttext}>Check out the rewards</Text>
            </View>          
            <Image source={Images.right_go_6x10}/>         
          </TouchableOpacity>          
        </FullScreen.Row>  */}
        </ScrollView>

      </FullScreen>
    );
  }
};

const styles = StyleSheet.create({
  topview: {
    justifyContent: "center",
    alignItems:'flex-start',
    marginLeft :25,
    paddingHorizontal: 40,
    marginTop:20,
    height: 70,
  },
  topimgview: {
    justifyContent: "center",
    alignItems:'center',
  
    paddingHorizontal: 40,
    marginBottom:50,
    marginTop:30,
  
  },
  topimg: {
    width:283,
    height:82
  
  },
  bottomview: {
    alignItems:'flex-start',
    marginLeft :25,
    paddingLeft: 30,
    marginRight: 90,
    backgroundColor: '#9E4FFF',
    height: 70,
    marginTop: 50,
    marginBottom: 40,   
  },
  topfont: {
    fontFamily: 'SF UI Text', 
    fontSize: 22, 
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

export default SingleOption;