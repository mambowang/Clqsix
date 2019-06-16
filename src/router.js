'use strict';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import  {Start,WelcomeNavigate} from './pages/Welcome';
import Main from './pages/Main';
import Splash from './pages/Splash';
import { UploadRoot } from './pages/Upload';
export  const  RootNav =  StackNavigator({
    Splash: {
        screen: Splash,
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
    },
    WelcomeNavigate: {
        screen: withMappedNavigationProps(WelcomeNavigate),
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      }, 
      Main: {
        screen: withMappedNavigationProps(Main),
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      }, 
      Start: {
        screen: withMappedNavigationProps(Start),
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      }, 
  
    }
    ,{
    headerMode: 'none',    
    //initialRouteName: 'Splash',
    navigationOptions: {
        header: null,
    }
  })