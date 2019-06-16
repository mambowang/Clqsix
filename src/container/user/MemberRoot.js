import React from 'react';
import { StackNavigator,StackRouter } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';


import  MemberView  from './MemberView';
import  UserFrequency  from './UserFrequency';
//import  VisualRoot  from '../visual';
//import  CliqueRoot  from '../clique';

import FollowingClique from './FollowingClique';
import InClique from './InClique'
const MemberRootNav = StackNavigator({       
        MemberView: {
            screen: withMappedNavigationProps(MemberView),          
        },
        UserFrequency: {
            screen: withMappedNavigationProps(UserFrequency),         
        },
        // VisualRoot: {
        //     screen: withMappedNavigationProps(VisualRoot),         
        // },
        FollowingClique: {
            screen: withMappedNavigationProps(FollowingClique),         
        },
        InClique: {
            screen: withMappedNavigationProps(InClique),         
        },
        // CliqueRoot: {
        //     screen: withMappedNavigationProps(CliqueRoot),         
        // },
    }
    ,{
        headerMode: 'none',    
        initialRouteName: 'MemberView',
        navigationOptions: {
            header: null,

        } 
});
class MemberRoot extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <MemberRootNav screenProps={{ rootNavigation: this.props.navigation }} />
        );
    }
}
export default MemberRoot;