'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
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
    InteractionManager,
    AsyncStorage,
    Keyboard
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
  Loading,
  
} from '../../components';
import {
  AuthAPI
} from '../../utils';
import {VisualModel,CliqueModel,UserModel} from '../../models';


import {OptimizedFlatList} from 'react-native-optimized-flatlist';
import _ from 'lodash';
import * as globals from '../../common/Global';
import {  CachedImage } from 'react-native-cached-image';
import update from 'immutability-helper';
import SendSMS from 'react-native-sms';
var Contacts = require('react-native-contacts')
class SearchContact extends Component {
    constructor(props) {
        super(props);
        this.state = {
            contactData:[],
            originalContactData: [],
            AccessContact: false,
            loading: false,        
            error: null,
            refreshing: false,
            thumbnailSource: Images.contact_icon_50x50,
        }
    }
    goBack() {
        const { navigation } = this.props;   
        navigation.goBack();       
    }
    async componentWillMount () {
        const value = await AsyncStorage.getItem('@AccessContact:key');
        if (value !== null){
          this.getFetchContactData();     
        }
    }    
    componentDidMount(){
        //this.someFunction();
    }
    getAllContactData(){      
        Contacts.checkPermission( (err, permission) => {
            if(permission === 'undefined'){
              Contacts.requestPermission( (err, permission) => {
                 AsyncStorage.setItem('@AccessContact:key', 'true');                
                this.getFetchContactData(); 
              })
            }
            if(permission === 'authorized'){
                 AsyncStorage.setItem('@AccessContact:key', 'true');                
                this.getFetchContactData(); 
            }
            if(permission === 'denied'){
              // x.x
            }
          })
    }
    getFetchContactData(){ 
        this.setState({ loading: true });        
        Contacts.getAll((error, contacts) => {
            if(error && error.type === 'permissionDenied'){
                this.setState({ error, loading: false });
              // x.x
            } else {
               if(!!this.contactList){
                contacts.sort(function(a, b){
                    var nameA=a.givenName.toLowerCase(), nameB=b.givenName.toLowerCase();
                    if (nameA < nameB) //sort string ascending
                     return -1;
                    if (nameA > nameB)
                     return 1;
                    return 0; //default return value (no sorting)
                   });
                this.setState({
                    contactData:contacts,
                    originalContactData:contacts,
                    AccessContact:true,
                    loading: false,
                    refreshing: false
                  });
               }
                
            }
          });
          
    }

    _renderItem (item) {
       // console.log("item: " + JSON.stringify(item));
       // onRequestClose={() => this.shareSuccess.hide()}
        return(
            <MyListItem
             contact={item}
            />);
    }
    searchText = (e) => {
        let text =  e.text.toLowerCase()    
        let trucks = this.state.originalContactData
        let filteredName = trucks.filter((item) => {
            let name = '' + item.givenName || ''  + ' ' + item.familyName || '';
          return !!name && name.toLowerCase().match(text) 
          
        })
        if (!text || text == "") {
            if(!!this.contactList){
                this.setState({
                    contactData: this.state.originalContactData
                  })
            }
         
        } else if (!Array.isArray(filteredName) && !filteredName.length) {
          // set no data flag to true so as to render flatlist conditionally
          this.setState({
            noData: true
          })
        } else if (Array.isArray(filteredName)) {
            if(!!this.contactList){
                this.setState({
                    noData: false,
                    contactData: filteredName
                });
            }
        }
    }
    render() {
        let isLoading = this.state.loading;
        
        return (
            <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
            <CustomNavigator
                leftButton = {<Image source={Images.BackChevronLeft_Black_9x16}/>}   
                rightButton = {<Image source={Images.More_1125x250} style = {{opacity: 0,width:23,height:5}}/>}      
                onLeftButtonPress = {() =>this.goBack()}        
                >     
              <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:18, fontWeight:'bold'}}>
              { !this.state.AccessContact ? "Contacts" : "Address Book"}
              </Text>
            </CustomNavigator>
            <View  style = {styles.container}  ref={ref => this.contactList = ref} >           
                {this.state.AccessContact == false ? 
                <View style={[styles.initcontainer,{}]}>
                    <Image source={Images.ViewCliqueInvites_750x750} style = {{width:50,height:49}}/>  
                    <View style = {{margin:24 }} >
                        <Text style={styles.tabContent} >
                            Sync your contacts
                        </Text>
                        <Text style={styles.tabContent} >
                            to find your friends.
                        </Text>
                    </View>
                    <View style = {{width: '100%' }} >
                        <Button.Simple text='Sync Contacts' style={styles.importButton} 
                        textStyle={styles.importButtonText} 
                        onPress= {() =>this.getAllContactData()}/> 
                    </View>
                </View>
                :
                <View style={[styles.listcontainer,{marginBottom: 0,}]}>
                <View> 
                <ClqsixTextInput         
                  ref={ref=>this.search=ref} 
                  placeholder='Search friends'
                  placeholderTextColor = {"#acacac"}                  
                  onChangeText={(text) => this.searchText({text}) }
                  needValidation={false}
                  textStyle = {styles.searchText}    
                  style={styles.search}
                  />
                </View>     
                {!!isLoading ?<Loading  /> :
                        <OptimizedFlatList
                        style={{ flex:1,width:'100%',marginTop: 20,marginBottom: 0,}} 
                        data={this.state.contactData}
                        keyExtractor={item => item.recordID}
                        renderItem={this._renderItem}
                    
                        />
                }
                </View>
                }
            </View>
        </FullScreen>
        );
    }
};
class MyListItem extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
          
            thumbnailSource: Images.contact_icon_50x50,
        }
    }
    sendSMS(phoneNumber){
       
        let recipients = [phoneNumber]
        SendSMS.send({
            body: 'Check out this new app for squads called CLQSIX. Download it here: appstore.com/CLQSIX',
            recipients: recipients,
            successTypes: ['sent', 'queued']
        }, (completed, cancelled, error) => {    
            //alert('SMS Callback: completed: ' + completed + ' cancelled: ' + cancelled + 'error: ' + error);
        });
        

    }
    render() {
        let {item} = this.props.contact;
        return (            

            <View style={styles.itemcontainer}>  

                <View style = {styles.infocontent}>  
                {!item.hasThumbnail ? 
                    <Image source={this.state.thumbnailSource} style = {styles.imagestyle}/>            
                    :
                    <CachedImage
                    source={{ uri:  item.thumbnailPath}}
                    defaultSource =  {{ uri:this.state.thumbnailSource}}
                    fallbackSource = {{ uri:this.state.thumbnailSource}}                    
                    style={styles.imagestyle}
                />           
                }
                    <View style = {styles.namecontent}>
                        <Text style = {styles.itemtext}>{item.givenName} {item.familyName} </Text>
                        {item.phoneNumbers.length > 0 &&
                            <Text style = {styles.numberText}>{item.phoneNumbers[0].number}</Text>
                        }
                    </View> 
                </View  >    
                <View style = {styles.invitearea} >    
                {item.phoneNumbers.length > 0 &&                            
                    <TouchableOpacity     onPress={() => {this.sendSMS(item.phoneNumbers[0].number) }}>    
                    <View style = {styles.invitecontent} >
                        <Text style = {styles.invitecontenttext}>Text</Text>
                    </View>          
                    </TouchableOpacity>  
                }
                </View>  
            </View>  
        )
    }
}
const contentPaddingHorizontal = 20;

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        width: '100%' ,
       
       
    },
    initcontainer:{
        flex:1,
        flexDirection: 'column', 
        justifyContent: 'center',
        alignItems : 'center',
        paddingHorizontal: contentPaddingHorizontal,
    },
    listcontainer: {
        flex: 1,       
        justifyContent: 'flex-start',
        // alignItems: 'flex-start',
        paddingHorizontal: contentPaddingHorizontal,
    },
    tabContent: {
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
        color: 'black',
        marginTop:3
    },
    importButton: {
       
        width: '100%',
        backgroundColor: '#0095F7',
      },
    
    importButtonText: {

        fontWeight: 'bold'
    },
    searchText:{
        fontWeight: 'bold'
      },
      search: {
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderColor:'#e8e8e8', 
      },
    itemcontainer: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginVertical: 5,
      
      },
      infocontent: {
        flex: 1,
        flexDirection: 'row', 
        justifyContent: 'flex-start',
        alignItems: 'center',
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
        marginHorizontal:20,
      },
      itemtext: {
        fontWeight: 'bold',
        maxWidth:200,
        
      },
      numberText: {
        fontSize: 11,
        color: "#acacac"
      },

      invitearea: {
       
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },
      invitecontent: {
        borderColor : "#9D4FFF",
        borderWidth: 1,
        width: '100%',
      },
      invitecontenttext: {
          marginHorizontal:20,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingTop: 3,
        paddingBottom: 3,
        elevation: 1,
        color: '#9D4FFF',
        fontWeight: 'bold',
      },

});
export default SearchContact;