'use strict';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import CliqueOption from './CliqueOption';
import CreateClique from './CreateClique/CreateClique';
import LocationScreen from './CreateClique/LocationScreen';
import InviteClique from './CreateClique/InviteClique';
import CategoryScreen from './CreateClique/CategoryScreen';


import ViewRequest from './ViewRequest/ViewRequest';

import {ShareRoot} from '../Share';

import {MemberRoot} from '../../container/user';
import {CliqueRoot} from '../../container/clique';
import {VisualRoot}  from '../../container/visual';

import {SettingRoot} from '../Setting';
const OptionRoot =  StackNavigator({    
    CliqueOption: {
        screen:  withMappedNavigationProps(CliqueOption),

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
  
    MemberRoot: {
            screen: withMappedNavigationProps(MemberRoot),   
        },
    CliqueRoot: {
            screen: withMappedNavigationProps(CliqueRoot),   
        },
    VisualRoot: {
            screen: withMappedNavigationProps(VisualRoot),   
        },
    SettingRoot: {
            screen: withMappedNavigationProps(SettingRoot),   
        },
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'CliqueOption',
    navigationOptions: {
        header: null,

    }
  });

export default OptionRoot;