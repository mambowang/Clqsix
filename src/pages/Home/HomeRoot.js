import React from 'react';
import { StackNavigator,StackRouter } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import Home from './Home';
import {VisualRoot} from '../../container/visual';
import {CliqueRoot} from '../../container/clique';
import {MemberRoot} from '../../container/user';

import  {NotifyRoot}   from '../../container/user';
import  VisualDetail from '../../container/visual/VisualDetail';
import  Reaction from '../../container/visual/Reaction';
import  Comment from '../../container/visual/Comment';

import FindCliques from '../../container/clique/FindCliques';

const HomeRoot = StackNavigator({
        Home: {
            screen: withMappedNavigationProps(Home),          
        },
        NotifyRoot: {
            screen: withMappedNavigationProps(NotifyRoot),         
        },
        VisualRoot: {
            screen: withMappedNavigationProps(VisualRoot),         
        },
        MemberRoot: {
            screen: withMappedNavigationProps(MemberRoot),         
        },
        VisualDetail: {
            screen: withMappedNavigationProps(VisualDetail),          
        },
        Reaction: {
            screen: withMappedNavigationProps(Reaction),         
        },
        Comment: {
            screen: withMappedNavigationProps(Comment),         
        },
        FindCliques: {
            screen: withMappedNavigationProps(FindCliques),          
        },

        CliqueRoot: {
            screen: withMappedNavigationProps(CliqueRoot),
       
        },
        
    }
    ,{
        headerMode: 'none',    
        initialRouteName: 'Home',
        navigationOptions: {
            header: null,

        } 
});

export default HomeRoot;