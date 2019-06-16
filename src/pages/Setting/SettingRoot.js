'use strict';
import React from 'react';
import { StackNavigator,StackRouter } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import Setting from './Setting';
import About from './About';
import BlockedUsers from './BlockedUsers'
import ServicePage from '../../container/site/ServicePage'
import PrivacyPage from '../../container/site/PrivacyPage'
import ClqsixSite from '../../container/site/ClqsixSite'
import ChangePassword from './ChangePassword'
import { MemberRoot } from '../../container/user'
const SettingRootNav =  StackNavigator({
        Setting: {
            screen:  withMappedNavigationProps(Setting),         
        },
        About: {
            screen:  withMappedNavigationProps(About),         
        },
        ServicePage: {
            screen:  withMappedNavigationProps(ServicePage),         
        },
        PrivacyPage: {
            screen:  withMappedNavigationProps(PrivacyPage),         
        },
        ClqsixSite: {
            screen:  withMappedNavigationProps(ClqsixSite),         
        },
        BlockedUsers: {
            screen:  withMappedNavigationProps(BlockedUsers),         
        },
        MemberRoot: {
            screen:  withMappedNavigationProps(MemberRoot),         
        },
        ChangePassword: {
            screen:  withMappedNavigationProps(ChangePassword),         
        },
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'Setting',
    navigationOptions: {
        header: null,

    }
  });
  class SettingRoot extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <SettingRootNav screenProps={{ rootNavigation: this.props.navigation }} />
        );
    }
}
export default SettingRoot;
