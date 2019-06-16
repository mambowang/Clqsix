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
    StatusBar,
} from 'react-native';
import {
  Button,
  ClqsixTextInput,
  CustomNavigator,
  FullScreen,
  ScrollViewWrapper,
  Images,
  Text,
  Page,
  Content
} from '../../../components';
import { connect } from 'react-redux'
import { StackNavigator } from 'react-navigation';
import { NavigationActions } from 'react-navigation';
import {VisualModel,CliqueModel,UserModel} from '../../../models'
import _ from 'lodash';

import moment from 'moment';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
class SingleHome extends Component {
  initialDataLoaded = false;
  navigator = null;
  refVisualPostOptions = null;
  constructor(props) {
    super(props);
    this.state = {
        closeScrollPageView: false,
        showCliques: false,
        visuals: [],
        cliques: this.cliques,
        modal: null,
        showPostOptions: false,
        uid:this.props.currentUser.uid || '',
        
    }
  }
   ////////////////////////////////////////////////////////////////////  
   _onNavigationLeftButtonPress() {   
    this.props.navigation.navigate('FindCliques')   
  }
  _onNavigationRightButtonPress() {   
    this.props.navigation.navigate('NotifyRoot')   
  }
  render() {
    
    const { navigate } = this.props.navigation;
    return this.renderDefault();
  }
  goMainScreen(){
    const resetAction = NavigationActions.reset({
      index: 0,
      key:null,
      actions: [
        NavigationActions.navigate({ routeName: 'HomeRoot'})
      ]
    });
    this.props.navigation.dispatch(resetAction);    
  }

  renderDefault() {
    return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
       <StatusBar hidden={false} />
        {this.renderNavigationBar()}
        {this.renderComponent()}       
      </FullScreen>
    );
  }

  renderNavigationBar() {
    return (
      <CustomNavigator
      leftButton = {<Image style = {{width: 16, height: 16, opacity:1}} source={Images.FeaturedCliques_900x900} />}
      rightButton = {<Image style = {{width:21,height:21}}  source={Images.Notifications_300x300}  />}
      onLeftButtonPress = {() => this._onNavigationLeftButtonPress()}
        onRightButtonPress = {() => this._onNavigationRightButtonPress()}
      >
        <Image style= {{width:26,height:26,marginTop:3,}} source={Images.CLQSIX_symbol_1300x1300} />
        <Text style={{fontFamily:'Alegre Sans', fontSize: 36, marginLeft:8,}}>CLQSIX</Text>
      </CustomNavigator>
    );
  }


  renderComponent() {
    return (
      <Page >       
        <Content style={styles.content}> 
            <View style = {styles.splashcontent}>
              <View style={styles.titleContent}>
                {/* <Text style={styles.datecomment}>{moment().format("dddd, M/D/YYYY")}</Text>  */}
              </View>
              <Image source={Images.singlemain_664x668} style={styles.welcomeImg}/>  
              <View style={styles.pageContent}>
                <Text style={styles.comment}>Your feed is empty...</Text> 
              </View>  
            </View>
        
          <View  style={styles.findButtonArea} >
            <Button.Simple text='Find cliques to follow' style={styles.findButton} 
            textStyle={styles.findButtonText} 
            onPress= {() => {this.showFindCliques()}}
            />
          </View> 
          <View></View>        
        </Content>

      </Page>
    )
  }

  showFindCliques() {
    this.props.navigation.navigate('FindCliques')   
  
  }

};

const styles = StyleSheet.create({
  content: {    
   
    paddingHorizontal: 25,
    justifyContent: 'space-between',
    
  },
  titleContent: {  
     justifyContent:'center', 
     alignItems:'center',
     paddingVertical: 20
  },
  datecomment: {
    fontFamily: 'SF UI Text',
    fontSize: 12,
    color:'#DDDDDD',
    fontWeight: 'bold',
   
  },
  splashcontent :{
    flexDirection: 'column',     
    justifyContent:'center', 
    alignItems:'center',
  },
  welcomeImg:{
    width: window.width * 0.75,
    height: window.width * 0.9,
  },
  pageContent: {
    width: window.width * 0.75,  
    marginVertical: 15,
  }, 
  comment: {
    fontWeight: 'bold',
    fontSize:14,
  },
  findButtonArea: {
    alignItems:'center',
    justifyContent:'center',
    
  },
  findButtonText: {
    fontWeight: 'bold',
    fontSize:13,
 
  },
  findButton: {
    alignItems:'center',
    justifyContent:'center',
    width: window.width * 0.75,
    
  },
  pageText: {
    fontFamily:'SF UI Text',
    fontWeight:'900',
    fontSize:17,
    color:'white'
  },

 
  image: {

  },

  text: {
    fontFamily: 'SF UI Text',
    fontWeight: 'bold',
    fontSize: 22,
  },
  titletext :{
    fontFamily: 'SF UI Text',
    fontSize: 13,
    color:'#ffffff',
  },
 
});
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser
  }
}

export default connect(mapStateToProps,)(SingleHome)
