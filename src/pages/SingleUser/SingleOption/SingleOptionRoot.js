'use strict';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import SingleOption from './SingleOption';
import CreateClique from '../../Option/CreateClique/CreateClique';
import LocationScreen from '../../Option/CreateClique/LocationScreen';
import InviteClique from '../../Option/CreateClique/InviteClique';
import CategoryScreen from '../../Option/CreateClique/CategoryScreen';

import ViewRequest from './ViewRequest/ViewRequest';
import {ShareRoot} from '../../Share';

import {VisualRoot} from '../../../container/visual';
import {MemberRoot} from '../../../container/user';
import {CliqueRoot} from '../../../container/clique';
import {SettingRoot} from '../../Setting';

const SingleOptionRoot =  StackNavigator({    
        SingleOption: {
            screen:  withMappedNavigationProps(SingleOption),
           
        },
        CreateClique: {
            screen:  withMappedNavigationProps(CreateClique),
          
        },
        LocationScreen: {
            screen:  withMappedNavigationProps(LocationScreen),
          
        },
        CategoryScreen:{
            screen:  withMappedNavigationProps(CategoryScreen),
    
          },
        InviteClique: {
            screen:  withMappedNavigationProps(InviteClique),
           
        },
        ViewRequest: {
            screen:  withMappedNavigationProps(ViewRequest),
           
        },
        ShareRoot: {
            screen: withMappedNavigationProps(ShareRoot),   
            },
       
        CliqueRoot: {
                screen: withMappedNavigationProps(CliqueRoot),           
            },
    
        VisualRoot: {
                screen: withMappedNavigationProps(VisualRoot),
               
            }, 
        MemberRoot: {
                screen: withMappedNavigationProps(MemberRoot),
               
            },   
            SettingRoot: {
                screen: withMappedNavigationProps(SettingRoot),
               
            },   

     
     
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'SingleOption',
    navigationOptions: {
        header: null,

    }
  });

export default SingleOptionRoot;