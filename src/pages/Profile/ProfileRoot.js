'use strict';
import React from 'react';

import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import Profile from './Profile';
import EditClique from './EditClique';
import LocationScreen from '../Option/CreateClique/LocationScreen';
import CategoryScreen from '../Option/CreateClique/CategoryScreen';

import ViewRequest from '../Option/ViewRequest/ViewRequest';

import Frequency from '../../container/clique/Frequency';
import FollwerUser from '../../container/clique/FollwerUser';
import FollowingClique from '../../container/user/FollowingClique';
import RemoveMember from './RemoveMember';
import SwitchMember from './SwitchMember';
import CliqueMember from '../../container/clique/CliqueMember';
import SendInvite from './SendInvite';

import {MemberRoot} from '../../container/user';
import {CliqueRoot} from '../../container/clique';
import {VisualRoot}  from '../../container/visual';

const ProfileRootNav =  StackNavigator({    
        Profile: {
            screen:  withMappedNavigationProps(Profile),
        },
        ViewRequest: {
            screen:  withMappedNavigationProps(ViewRequest),
        },
        LocationScreen: {
            screen:  withMappedNavigationProps(LocationScreen),
        },
        CategoryScreen: {
            screen:  withMappedNavigationProps(CategoryScreen),
        },
        EditClique: {
            screen:  withMappedNavigationProps(EditClique),
        },
        Frequency: {
            screen:  withMappedNavigationProps(Frequency),
        },
        FollowingClique: {
            screen:  withMappedNavigationProps(FollowingClique),
        },
        FollwerUser: {
            screen:  withMappedNavigationProps(FollwerUser),
        },
        RemoveMember: {
            screen:  withMappedNavigationProps(RemoveMember),
        },
        VisualRoot: {
            screen:  withMappedNavigationProps(VisualRoot),
        },       
        SwitchMember: {
            screen: withMappedNavigationProps(SwitchMember),
        },
        CliqueMember: {
            screen: withMappedNavigationProps(CliqueMember),
        },
        MemberRoot: {
            screen: withMappedNavigationProps(MemberRoot),          
        },     
        CliqueRoot: {
            screen: withMappedNavigationProps(CliqueRoot),            
        },
        SendInvite: {
            screen: withMappedNavigationProps(SendInvite),            
        },
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'Profile',
    navigationOptions: {
        header: null,

    }
  });
  class ProfileRoot extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <ProfileRootNav screenProps={{ rootNavigation: this.props.navigation }} />
        );
    }
}
export default ProfileRoot;