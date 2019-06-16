import React from 'react';
import { View, Text ,Button} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Welcome from './Welcome';
import Login from './Login';
import { Signup } from './Signup';
import ForgotPassword from './ForgotPassword';
import VerifyCode from './VerifyCode';
import Start from './Start';


const WelcomeNavigate =  StackNavigator({
    Welcome: {
        screen: Welcome,
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      },
      Login: {
        screen: Login,
        key:'Login',
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      },
      Signup: {
        screen: Signup,
        key:'Login',
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      },
      ForgotPassword:  {
        screen: ForgotPassword,
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      },
      VerifyCode:  {
        screen: VerifyCode,
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      },
      Start:  {
        screen: Start,
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      },
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'Welcome',
    navigationOptions: {
        header: null,

    }
  });

export default WelcomeNavigate;