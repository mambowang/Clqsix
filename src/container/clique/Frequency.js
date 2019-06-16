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
import humanFormat from 'human-format'

import { NavigationActions } from 'react-navigation';
let window = {
  width: Dimensions.get('window').width,
  height: Dimensions.get('window').height,
};
const HorizontalPaging = ScrollViewWrapper.HorizontalPaging;
const ImageScrollView = ScrollViewWrapper.ImageScrollView;
class Frequency extends Component {
  constructor(props) {
    super(props);
    const { params } = this.props.navigation.state;
    this.state = {
      cliqueId: params.cliqueId,
      uid:params.uid,
      renderReceived: true,
      fromProfile: params.fromProfile || false,
      
      receivedData: {},
      givenData: {},
      loadingReceived: false,
      loadingGiven: false,
      receivedSum :0,
      givenSum: 0,
    }
  }
  fetchRemoteData(){
    this.setState({  loadingReceived: true,loadingGiven: true,});   
    const cliqueId = this.state.cliqueId; 
    CliqueModel.getFrequency(cliqueId,received => {
        if(received.numChildren() > 0){           
            let receivedData;   
            let receivedSum = 0; 
            received.forEach((element) => {       
                receivedData = element.val();       
            });
            _.forEach(receivedData, function(value, key) {
                if(key == "dislike"){
                    receivedSum -= value;
                }else{
                    receivedSum += value;
                }
                
              });
            
            this.setState({      
                receivedData: receivedData,             
                loadingReceived: false,   
                receivedSum : receivedSum      
            });    
        }else{
            this.setState({   
                loadingReceived: false,         
            });
        }
    });
    // UserModel.getFrequency(given => {
    //     if(given.numChildren() > 0){
    //         let givenData ;
    //         let givenSum = 0;
    //         given.forEach((element) => {       
    //             givenData = element.val();       
    //         });     
    //         _.forEach(givenData, function(value, key) {
    //             givenSum += value;
    //           });       
    //         this.setState({              
    //             givenData: givenData,
    //             loadingGiven: false,
    //             givenSum: givenSum
    //         })
    //     }else{
    //         this.setState({        
    //             loadingGiven: false,                    
    //         }); 
    //     }
    // });
  }
  goBack(){
    !!this.props.navigation && this.props.navigation.goBack();
  }
  componentDidMount(){
    this.fetchRemoteData();    
  } 

  goFollwerUser(){
    !!this.props.navigation && this.props.navigation.navigate('FollwerUser',
    {cliqueId: this.state.cliqueId,
        follwerSum: this.state.receivedData.followers,
        fromProfile:this.state.fromProfile});   
    
  }
  render() {
    let loadingGiven = this.state.loadingGiven;
    let loadingReceived = this.state.loadingReceived;
    return (
        <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
          <CustomNavigator
          leftButton={<Image source={Images.BackChevronLeft_Black_9x16}/>}
          rightButton = {<Image style = {{opacity: 0}} source={Images.BackChevronLeft_Black_9x16}/>}
          onLeftButtonPress = {() =>this.goBack() }  
        >
          <Text style={{fontFamily:'SF UI Text', fontSize: 17,fontWeight:'bold'}}>
          {this.state.receivedSum} Frequency
         
          </Text>
        </CustomNavigator>
        <ScrollView ref="scrollView" style={{width:'100%'}}> 
            <FullScreen.Row style={styles.topview}>
                <View >
                <Text style={styles.topfont}> Clique activity received</Text>
                </View>
            </FullScreen.Row>        
                {this.renderReceivedPart()}
        </ScrollView>
        </FullScreen>
    );
  }
  renderReceivedPart(){
        let receivedData = this.state.receivedData;
      return (           
          <View style = {styles.container}>
          
                {/* <FullScreen.Row style={[styles.titlerow,{backgroundColor: 'white'}]} >
                    <View style={[styles.titlecontent,{backgroundColor: 'white'}]}  
                        onPress={() => { }}>  
                        <View style = {styles.titletextview} >
                            <Text style = {[styles.contentbtntext,{fontSize: 15}]}>Total clique activity{" "}
                                <Text style = {styles.titlebottomtextview}>
                                {" "}received
                                </Text>                            
                             </Text>
                        </View>    
                    </View>                   
                </FullScreen.Row> */}

                {/* content area */}
                <FullScreen.Row style={styles.contentrow} >
                    <View style={styles.content}>          
                        <Image source={Images.LikeActive_850x850} style = {styles.iconSize}/>         
                        <View style = {styles.contenttextview} >
                            <Text style = {styles.contenttext}>Likes ({humanFormat(receivedData.like || 0, { decimals: 1 })})</Text>
                        </View>          
                    </View>          
                </FullScreen.Row>

                <FullScreen.Row style={styles.contentrow} >
                    <View style={styles.content}>          
                        <Image source={Images.DislikeActive_850x850} style = {styles.iconSize}/>         
                        <View style = {styles.contenttextview} >
                            <Text style = {styles.contenttext}>Dislikes (-{humanFormat(receivedData.dislike || 0, { decimals: 1 })})</Text>
                        </View>          
                    </View>          
                </FullScreen.Row>

                <FullScreen.Row style={styles.contentrow} >
                    <View style={styles.content}>          
                        <Image source={Images.Comment_850x850} style = {styles.iconSize}/>         
                        <View style = {styles.contenttextview} >
                            <Text style = {styles.contenttext}>Comments ({humanFormat(receivedData.comment || 0, { decimals: 1 })})</Text>
                        </View>          
                    </View>          
            </FullScreen.Row>

            <FullScreen.Row style={styles.contentrow} >
                 <View style={styles.content} >          
                     <Image source={Images.Share_850x850} style = {styles.iconSize}/>         
                     <View style = {styles.contenttextview} >
                         <Text style = {styles.contenttext}>Shares ({humanFormat(receivedData.share || 0, { decimals: 1 })}) </Text>
                     </View>          
                 </View>          
             </FullScreen.Row>
             <FullScreen.Row style={styles.contentrow} >
                 <View style={styles.content} >          
                     <Image source={Images.Visuals_1500x1500} style = {styles.iconSize}/>         
                     <View style = {styles.contenttextview} >
                         <Text style = {styles.contenttext}>Visuals ({humanFormat(receivedData.visual || 0, { decimals: 1 })}) </Text>
                     </View>          
                 </View>          
             </FullScreen.Row>
             <FullScreen.Row style={[styles.contentrow,{backgroundColor: '#f9f9f9',borderBottomWidth:1, }]} >
                {!! receivedData.followers && receivedData.followers > 0 ?
                 <TouchableOpacity style={styles.content}  
                 onPress={() => { this.goFollwerUser() }}>          
                     <Image source={Images.Followers_500x500} style = {styles.iconSize}/>         
                     <View style = {styles.contenttextview} >
                         <Text style = {styles.contentbtntext}>Followers ({humanFormat(receivedData.followers || 0, { decimals: 1 })})</Text>
                     </View>          
                     <Image source={Images.right_go_6x10}/>         
                 </TouchableOpacity>      
                 :
                 <View style={styles.content} >          
                     <Image source={Images.Followers_500x500} style = {styles.iconSize}/>         
                     <View style = {styles.contenttextview} >
                         <Text style = {styles.contentbtntext}>Followers ({humanFormat(receivedData.followers || 0, { decimals: 1 })})</Text>
                     </View>          
                     {/* <Image source={Images.right_go_6x10}/>          */}
                 </View>      
                 }    
                  {/* <View style={styles.content} >          
                     <Image source={Images.Followers_500x500} style = {styles.iconSize}/>         
                     <View style = {styles.contenttextview} >
                         <Text style = {styles.contentbtntext}>Followers ({humanFormat(receivedData.followers || 0, { decimals: 1 })})</Text>
                     </View>          
                 </View>      */}
             </FullScreen.Row> 
           
          </View>
        
      )
    }

};
const contentPaddingHorizontal = 20;

const styles = StyleSheet.create({  
    container: {
        flex: 1,
        flexDirection: 'column', 
        justifyContent: 'flex-start',
        alignItems : 'center',
        marginTop: 60,
       
      },
    topview: {
        alignItems:'center',
        marginHorizontal :25,
        backgroundColor: '#1d1d1d',
        height: 70,
        marginTop: 30,   
      },

      topfont: {
        fontFamily: 'SF UI Text', 
        fontSize: 13, 
        color: '#ffffff', 
        fontWeight: 'bold',
      },
      titlerow:{
        flexDirection: 'row',
        justifyContent:'space-between',    
        alignItems:'center',   
        paddingLeft :25,
        paddingRight: 20,
        height: 80,
      
      },
      titlecontent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between',    
        alignItems:'center',   
        width: '100%',
        height: 50,
      },
      contentrow: {   
        paddingLeft :25,
        paddingRight: 20,
        paddingVertical:10,
        height: 70,
        borderTopWidth:1, 
        borderColor:'#EEEEEE',     
      },
      content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent:'space-between',    
        alignItems:'center',   
        width: '100%',
      },
      titletextview:{   
        flex: 1,
        flexDirection: 'row',
        justifyContent:'center',    
        
      },
      titlebottomtextview:{
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline',
        textDecorationColor: '#919191'
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
        color: '#919191'
      },
      contentbtntext:{
        fontFamily: 'SF UI Text', 
        fontSize: 13,  
        fontWeight: 'bold',
        paddingLeft: 10,
        textAlign: "left" ,
        color:'#919191'
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
      },
      iconSize:{
          width:25,
          height: 25
      }
});
export default Frequency;