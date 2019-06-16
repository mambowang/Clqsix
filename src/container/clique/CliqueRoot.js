import React from 'react';
import { StackNavigator,StackRouter } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import  CliqueView  from './CliqueView';
import  CliqueMember  from './CliqueMember';
import  Frequency  from './Frequency';
import  FollwerUser from './FollwerUser';
//import {MemberRoot} from '../user';
//import {VisualRoot} from '../visual';

const CliqueRootNav = StackNavigator({       
        CliqueView: {
            screen: withMappedNavigationProps(CliqueView),          
        },
        CliqueMember: {
            screen: withMappedNavigationProps(CliqueMember),         
        },
        Frequency: {
            screen: withMappedNavigationProps(Frequency),         
        },
        FollwerUser: {
            screen: withMappedNavigationProps(FollwerUser),         
        },
        // MemberRoot: {
        //     screen: withMappedNavigationProps(MemberRoot),         
        // },
        // VisualRoot: {
        //     screen: withMappedNavigationProps(VisualRoot),         
        // },
    }
    ,{
        headerMode: 'none',    
        initialRouteName: 'CliqueView',
        navigationOptions: {
            header: null,

        } 
});
class CliqueRoot extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <CliqueRootNav screenProps={{ rootNavigation: this.props.navigation }} />
        );
    }
}
export default CliqueRoot;