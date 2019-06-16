'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import {
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import { NavigationActions } from 'react-navigation'
import FCM from "react-native-fcm";

import { signedIn,saveSigned } from '../actions/userActions'
import {
    AuthAPI
  } from '../utils';
  import UserModel from '../models/UserModel';

import {
  Alert,
  FullScreen,
  Images
} from '../components';
import * as Storage from '../common/Storage';
import {registerKilledListener, registerAppListener} from "../utils/FirebaseListeners";

class Splash extends Component {    
        constructor(props) {
            super(props);
            this.state = {
                emailVerified: true,
            }
        }  
        componentDidUpdate(){
           
           this.gotoMainPage();   
            // if(!!this.state.emailVerified){
            //     this.gotoMainPage();       
            // }else{
            //     this.gotoStartPage();
            // }
                
        }
        componentWillUnmount() {
            // Don't forget to unsubscribe when the component unmounts
            if(!!this.unsubscribe)
                this.unsubscribe();
        }
        async componentDidMount() {    
            //this.gotoStartPage();
            //this.gotoWelcomePage();
            registerAppListener();  
            try{
              let result = await FCM.requestPermissions({badge: false, sound: true, alert: true});
            } catch(e){
              console.error(e);
            }   
            this.checkLoggedInit();
        }    
        checkLoggedInit(){ 
            this.unsubscribe = AuthAPI.onAuthStateChanged(user => {
                if (!!user && !!user.uid ) {    
                    let _this = this;                      
                    UserModel.findwithUID(user.uid)
                    .then(user => { 
                        let {email, name,password, uid,photoURL,description} = user;
                        _this.props.saveSigned(email, name,password, uid,photoURL,description);  
                    })
                    .catch(error => {});
                }else{
                    this.gotoWelcomePage();
                }
            });        
  
            
        } 
        checkLoggedIntOld(user){        
            if(!user || user.uid == null){
               this.gotoWelcomePage();
            }else{   
                const uid = user.uid ;    
                this.unsubscribe = AuthAPI.onAuthStateChanged(user => {
                    if (!!user && user.uid == uid) {    
                        let _this = this;                      
                        UserModel.findwithUID(user.uid)
                        .then(user => { 
                            let {email, name,password, uid,photoURL,description} = user;
                            _this.props.saveSigned(email, name,password, uid,photoURL,description);  
                        })
                        .catch(error => {});
                        // if(!user.emailVerified){                            
                        //     this.props.saveSigned(email, name,password, uid,photoURL,description);  
                        //     // this.setState({ emailVerified: !this.state.emailVerified}, () => {
                        //     //     this.props.saveSigned(email, name,password, uid,photoURL,description); 
                        //     // });   
                        // }else{
                        //     this.props.saveSigned(email, name,password, uid,photoURL,description);  
                        // }
                    }else{
                        this.gotoWelcomePage();
                    }
                });        
  
            }
        } 
        gotoStartPage() {
            let routeName;
            routeName = "Start";
            this.props.navigation.dispatch({
                type: 'Navigation/RESET',
                index: 0,
                actions: [{ type: 'Navigation/NAVIGATE', routeName: routeName }]
            });
        }
        gotoMainPage() {
            let routeName;
            routeName = "Main";
            this.props.navigation.dispatch({
                type: 'Navigation/RESET',
                index: 0,
                actions: [{ type: 'Navigation/NAVIGATE', routeName: routeName }]
            });
        } 
        gotoWelcomePage() {
            let routeName;
            routeName = "WelcomeNavigate";
            this.props.navigation.dispatch({
                type: 'Navigation/RESET',
                index: 0,
                actions: [{ type: 'Navigation/NAVIGATE', routeName: routeName }]
            });
        }      
        render() {
            return(
                <FullScreen>
                   <Image source={Images.Loading} style={styles.backgroundImage} />

                </FullScreen>
            );
        }
    }
const styles = StyleSheet.create({
    container: {
        flex: 1,        
    },
    backgroundImage: {
        flex: 1,
        width: null,
        height: null,
        resizeMode: 'cover'
      }
});
      
function mapStateToProps(state) {
    return {
        currentUser: state.currentUser
    }
}
      
export default connect(mapStateToProps,{signedIn,saveSigned})(Splash)    