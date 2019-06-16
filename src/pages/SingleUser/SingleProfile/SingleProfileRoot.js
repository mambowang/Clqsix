'use strict';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import SingleProfile from './SingleProfile';
import EditSingleProfile from './EditSingleProfile'
import SwitchMember from '../../Profile/SwitchMember';
import {VisualRoot} from '../../../container/visual';
import {CliqueRoot} from '../../../container/clique';




import CreateClique from '../../Option/CreateClique/CreateClique';
import LocationScreen from '../../Option/CreateClique/LocationScreen';
import InviteClique from '../../Option/CreateClique/InviteClique';

import ViewRequest from '../SingleOption/ViewRequest/ViewRequest';


import UserFrequency from '../../../container/user/UserFrequency';
import FollowingClique from '../../../container/user/FollowingClique';

const SingleProfileRoot =  StackNavigator({    
        SingleProfile: {
            screen:  withMappedNavigationProps(SingleProfile),
            
        },      
        SwitchMember: {
            screen: withMappedNavigationProps(SwitchMember),
           
        },
        EditSingleProfile: {
            screen: withMappedNavigationProps(EditSingleProfile),
          
        },
        VisualRoot: {
            screen: withMappedNavigationProps(VisualRoot),
           
        },
        CreateClique: {
            screen: withMappedNavigationProps(CreateClique),
           
        },
        InviteClique: {
            screen: withMappedNavigationProps(InviteClique),
           
        },
        LocationScreen: {
            screen: withMappedNavigationProps(LocationScreen),
          
        },
        ViewRequest: {
            screen: withMappedNavigationProps(ViewRequest),
          
        },
        UserFrequency: {
            screen: withMappedNavigationProps(UserFrequency),
          
        },
        FollowingClique: {
            screen: withMappedNavigationProps(FollowingClique),
           
        },
        CliqueRoot: {
            screen: withMappedNavigationProps(CliqueRoot),         
        },
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'SingleProfile',
    navigationOptions: {
        header: null,

    }
  });

export default SingleProfileRoot;