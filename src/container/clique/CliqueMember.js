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
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
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
class CliqueMember extends Component {
  userData = [];  
    
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      cliqueId: params.cliqueId,
      cliquename: params.cliquename,     
      fromProfile: params.fromProfile || false,
      locationData:params.locationData,
      loading: false,
      refreshing: false,
      thumbnailSource: Images.contact_icon_50x50,          
      userData: [],    
    }
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack();
  }
  fetchUserRemoteData(){      
    const cliqueId = this.state.cliqueId;    
    this.setState({ loading: true });    
    CliqueModel.getCliqueMembers(cliqueId,snapshot => {
        if(_.size(snapshot) > 0){
            this.userData = snapshot;     
            _.map(this.userData, function(e) {
               return _.extend(e, {key: e.uid});
             });
            if(!!this.friendList){
              this.setState({
                userData: [...this.state.userData,
                ...this.userData] ,           
                loading: false,
                refreshing: false,
              });
            }
            
      }else{
        this.setState({         
          loading: false,
          refreshing: false,
        });
      }  
    });
  }
  componentDidMount(){
    this.fetchUserRemoteData();
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
  goCliqueMemberDetail(memberId){
    if(memberId == this.props.currentUser.uid){
      return;
    }
    if(!!this.state.fromProfile){
      !!this.props.navigation && this.props.navigation.navigate('MemberRoot',
      {memberId: memberId});   
    }else{
      !!this.props.rootNavigation && this.props.rootNavigation.navigate('MemberRoot',
      {memberId: memberId});   
    }
    
  }
  render() {
      let loading = this.state.loading;
    return (
        <FullScreen ref={ref => this.friendList = ref}  style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
        <CustomNavigator
        leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
        rightButton = {<Image style = {{opacity: 0}} source={Images.BackChevronLeft_Black_9x16}/>}
        onLeftButtonPress = {() =>this.goBack() }  
      >
        <Text style={{fontFamily:'SF UI Text', fontSize: 17,fontWeight:'bold'}}>
            Clique Members
        </Text>
      </CustomNavigator>
      <FullScreen.Row style={styles.topview}>
            <View >
              <Text style={styles.topfont}> @{this.state.cliquename}</Text>
            </View>
        </FullScreen.Row>
        <FullScreen.Row style={styles.localtionview}>
            <View >
              <Text style={styles.locationfont}> {this.state.locationData}</Text>
            </View>
        </FullScreen.Row>
      {!!loading ?  <Loading/>:
      <View style = {styles.container}>
      <FlatList
                                     
            data={this.state.userData}
            renderItem={({ item }) =>this.renderUserItem(item)}     
            style={{minHeight: 500 }}            
            keyExtractor={item => item.key}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator ={false} 
            ListFooterComponent={this.renderFooter}
   
          />
          </View>
      }
      </FullScreen>
    );
  }
  renderUserItem(item) {
    
      return (  
        <View style={styles.itemcontainer}>    
          <TouchableOpacity style={styles.content}  onPress={() => {this.goCliqueMemberDetail(item.key)}}>   
                {!item.photoURL ? 
                    <Image source={this.state.thumbnailSource} style = {styles.imagestyle}/>            
                    :
                    <View style={{
                        backgroundColor: '#fff',
                        borderRadius: 25,
                        overflow: 'hidden',
                      }}>       
                    <CachedImage
                    source={{ uri:  item.photoURL,}}
                    defaultSource =  {this.state.thumbnailSource}
                    fallbackSource = {this.state.thumbnailSource}                  
                    style={styles.imagestyle}
                  />
                  </View>
                    
                }
                <View style = {styles.namecontent}>
                    <Text style = {styles.itemtext}>{ (item.name  || '' ) }
                    {(item.key == this.props.currentUser.uid) && " (me)" }</Text>
                </View> 
                {item.key != this.props.currentUser.uid &&<Image source={Images.right_go_6x10}/>}
          </TouchableOpacity>
        </View>         
      )
      
  }
};

CliqueMember.propTypes = {
  currentClique: PropTypes.object.isRequired,
  currentUser: PropTypes.object.isRequired

}
const contentPaddingHorizontal = 20;

const styles = StyleSheet.create({  
    topview: {
        alignItems:'center',
        marginHorizontal: contentPaddingHorizontal,
        backgroundColor: '#0095F7',
        height: 70,
        marginTop: 30,       
      },
      topfont: {
        fontFamily: 'SF UI Text', 
        fontSize: 13, 
        color: '#ffffff', 
        fontWeight: 'bold',
      },
      localtionview: {
        alignItems:'flex-start',
        marginHorizontal: contentPaddingHorizontal,
        height: 40,
        marginTop: 20,
        marginBottom: 10,   
      },
      locationfont: {
        fontFamily: 'SF UI Text', 
        fontSize: 13, 
        textAlign: 'left',
        
        fontWeight: 'bold',
        color: '#acacac'
      },
    container: {
        flex: 1,
        width: '100%' ,
        marginTop: 10,
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

function mapStateToProps(state) {
  return {
    currentClique: state.currentClique,
    currentUser: state.currentUser
    
  }
}

export default connect(mapStateToProps)(CliqueMember)
