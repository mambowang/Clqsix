
'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux'
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
    Modal,
    StatusBar,
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
  Alert,
  ModalActivityIndicator,
  Loading
} from '../../components';
import {
  AuthAPI
} from '../../utils'


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
import * as globals from '../../common/Global';


class RemoveMember extends Component {

    deleteRequestId = null;
    
    constructor(props) {
        super(props);
        const { params } = this.props.navigation.state;
        
        this.state = {
            cliqueId: params.cliqueId,
            cliquename: params.cliquename,
            uid:this.props.currentUser.uid,
            loading: false,
            thumbnailOfflineSource: Images.contact_icon_50x50,      
            thumbnailSource: globals.thumbnailContactSource,           
            memberUserData: [],     
            hasmember: true,    
            

        }
    }
  
    goBack(){
        !!this.props.navigation && this.props.navigation.goBack();
    }
    fetchRemoteData() {
    
        const cliqueId = this.state.cliqueId;
        const uid = this.state.uid;
        this.setState({ loading: true });   
      
        CliqueModel.getCliqueMembers(cliqueId,snapshot => {
            let memberUserData = [] ; 
            snapshot.forEach((element) => { 
                if(element.uid != uid){
                    element =  _.extend(element, {status: "ready",key: element.uid});
                    
                    memberUserData.unshift({...element});
                }
               
            });
           
            if(_.size(memberUserData) > 0){
                if(!!this.memberList){
                    this.setState({
                        memberUserData: [...this.state.memberUserData,
                        ...memberUserData] ,           
                    loading: false,
                    noData:false,
                    });
                }
                
            }else{
                this.setState({         
                loading: false,
                noData:false,   
                hasmember: false          
                });
            }
        });
    }
    componentDidMount(){
        this.fetchRemoteData();
    } 
    deleteConfirmRequest(slectedUserId){
        this.deleteRequestId = slectedUserId;
        this.deleteAlert.show();
    }
    deleteRequest(){        
        let slectedUserId = this.deleteRequestId;
        const cliqueId = this.state.cliqueId;
        CliqueModel.deleteMemberUser(cliqueId,slectedUserId,success => {
            let memberUserData = this.state.memberUserData;
            var index = _.findIndex(memberUserData, function(e) {
              return e.uid == slectedUserId;
            });
            memberUserData[index].status = 'delete'; 
            if(!!this.memberList){          
                this.setState({         
                memberUserData : memberUserData,
                }); 
            } 
            this.deleteRequestId = null;
            this.deleteAlert.hide();

        });
       
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
            <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
            <CustomNavigator
            leftButton={<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}   
            rightButton = {<Image style = {{opacity: 0}} source={Images.BackChevronLeft_Black_9x16}/>}
            onLeftButtonPress = {() =>this.goBack() }  
        >
            <Text style={{fontFamily:'SF UI Text', fontSize: 17,fontWeight:'bold'}}>
            Remove Members
            </Text>
        </CustomNavigator>    

         <View style = {styles.container}>
                <View style={styles.topview}>                   
                    <Text style={styles.topfont}> @{this.state.cliquename} </Text>
                </View>
                {!this.state.hasmember ? 
                <View style = {styles.norequestcontent}>
                    <Image source={Images.a_71x71}/>
                    <Text style = {styles.contenttext}>
                              
                    </Text>
                    <Text style = {styles.contenttext}>
                    No member          
                    </Text>
                 
                </View>
                :
                <View style = {styles.requestContent}>
                        <FlatList
                            ref={ref => this.memberList = ref}
                                            
                            data={this.state.memberUserData}
                            style={{minHeight: 500}} 
                            renderItem={({item}) =>this.renderItem(item)}         
                            keyExtractor={item => item.uid}
                            ListFooterComponent={this.renderFooter}
                            ItemSeparatorComponent={this.renderSeparator}     
                        />
                </View>
                }

            </View>

            <Alert ref={ref=>this.deleteAlert=ref} 
             style={{backgroundColor:'#EF4244'}}         
             isStatic = {false}
             text={['Are you sure?']}
             closeButtonSource = {Images.check_17x13}
             cancleButtonSource = {Images.Cancel_White_13x13}
             onRequestCancle ={() => this.deleteAlert.hide()}
             onRequestClose = {() => this.deleteRequest()}/> 
        </FullScreen>
        );
    }
    renderItem(item){
        if(item.status == 'ready'){
            return this.renderUserItem(item);
        }
    }
    renderUserItem(item) {
        return (
           
            <View style={styles.itemcontainer}>        
                {!item.photoURL ? 
                    <Image source={this.state.thumbnailOfflineSource} style = {styles.imagestyle}/>            
                    :
                    <CachedImage
                    source={{ uri:  item.photoURL,}}
                    defaultSource =  {{ uri:this.state.thumbnailSource}}
                    fallbackSource = {{ uri:this.state.thumbnailSource}}
                    
                    style={styles.imagestyle}
                  />
                    
                }
                <View style = {styles.namecontent}>
                    <Text style = {styles.itemtext}>{item.name || ''}</Text>
                </View> 
                <View style = {styles.actionarea}>
                   
                    <TouchableOpacity  onPress={() => {this.deleteConfirmRequest(item.uid)}}>    
                        <View style = {styles.deleteLink} >
                            <Text style = {styles.deleteLinkText}>Remove</Text>
                        </View>   
                    </TouchableOpacity>
                </View>
               
            </View>  
           
           
           
        )
    }
};
RemoveMember.propTypes = {
    currentUser: PropTypes.object.isRequired
  
}
const contentPaddingHorizontal = 20;
  
const styles = StyleSheet.create({  
    container: {
        flex: 1,
        width: '100%' ,
        paddingHorizontal: contentPaddingHorizontal,
        marginTop:30      
      },
    topview: {
        justifyContent: "center",
        alignItems:'center',
  
        backgroundColor: '#EF4244',
        height: 70,
      },
    topfont: {
        fontFamily: 'SF UI Text', 
        fontSize: 13, 
        color: '#ffffff', 
        fontWeight: 'bold',
      },
      norequestcontent: {
        flex:1,
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems : 'center',
        
      },
      contenttext: {   
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        color: 'black',
        marginTop:3
        
      },
    requestContent: {
        marginTop:30
    },
    footcontent: {
        paddingVertical: 20,
        borderTopWidth:1,
        borderColor: "#CED0CE"
      },
    headercontent: {
        height: 10,          
        backgroundColor: "#FFFFFF", 
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
    namecontent:{
        marginLeft:20,
      },
    itemtext: {
        fontWeight: 'bold',
      },
    actionarea: {
        flex:1,
        flexDirection: 'row', 
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },
    acceptLink: {
        borderColor : "#24D770",
        backgroundColor: "#24D770",
        borderWidth: 1,
        height:25,     
        width: 60, 
        marginRight:10,
        
      },
    acceptLinkText: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 5,
        paddingBottom: 3,
        elevation: 1,
        color: '#ffffff',
        fontWeight: 'bold',
        fontSize: 11,
      },
      deleteLink: {
        borderColor : "#E72A35",
        backgroundColor: "#FFFFFF",
        borderWidth: 1,
        height:25,     
        width: 60, 
        marginRight:10,
        
      },
      deleteLinkText: {
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 5,
        paddingBottom: 3,
        elevation: 1,
        color: '#E72A35',
        fontSize: 11,
        fontWeight: 'bold',
      },
});
function mapStateToProps(state) {
    return {
      currentUser: state.currentUser
      
    }
  }
  
  export default connect(mapStateToProps)(RemoveMember)
