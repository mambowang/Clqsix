import React from 'react';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import SingleDiscover from './SingleDiscover';


import {VisualRoot} from '../../../container/visual';
import {MemberRoot} from '../../../container/user';
import {CliqueRoot} from '../../../container/clique';


import FindCliques from '../../../container/clique/FindCliques';

import {ShareRoot} from '../../Share';





const SingleDiscoverRoot = StackNavigator(
    {
        SingleDiscover: {
            screen: withMappedNavigationProps(SingleDiscover),   
        },       
        VisualRoot: {
            screen: withMappedNavigationProps(VisualRoot),   
        },
        CliqueRoot: {
            screen: withMappedNavigationProps(CliqueRoot),   
        },
        MemberRoot: {
            screen: withMappedNavigationProps(MemberRoot),   
        },    
        ShareRoot: {
            screen: withMappedNavigationProps(ShareRoot),   
        },
        FindCliques: {
            screen: withMappedNavigationProps(FindCliques),   
        },
    }, {
        headerMode: 'none',    
        initialRouteName: 'SingleDiscover',       
    });

export default SingleDiscoverRoot;