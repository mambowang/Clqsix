import React from 'react';
import { StackNavigator,StackRouter } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import SingleHome from './SingleHome';
import FindCliques from '../../../container/clique/FindCliques';
import { HomeRoot } from '../../Home';

import {VisualRoot} from '../../../container/visual';
import {MemberRoot} from '../../../container/user';
import {CliqueRoot} from '../../../container/clique';

import  {NotifyRoot}  from '../../../container/user';



const SingleHomeRoot = StackNavigator(
    {
        SingleHome: {
            screen: withMappedNavigationProps(SingleHome),    
        },
        FindCliques: {
            screen: withMappedNavigationProps(FindCliques),           
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
        HomeRoot: {
            screen: withMappedNavigationProps(HomeRoot),
           
        },       
        NotifyRoot: {
            screen: withMappedNavigationProps(NotifyRoot),
           
        },
      
    }, {
        headerMode: 'none',    
        initialRouteName: 'SingleHome',       
    });

export default SingleHomeRoot;