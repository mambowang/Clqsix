'use strict';
import React from 'react';
import { StackNavigator,StackRouter } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';


import ShopSite from '../../container/site/ShopSite'
import ShareOption from './ShareOption';
import SearchContact from './SearchContact';

const ShareRootNav =  StackNavigator({
    ShareOption: {
            screen:  withMappedNavigationProps(ShareOption),         
        },
        ShopSite: {
            screen:  withMappedNavigationProps(ShopSite),         
        },
        SearchContact: {
            screen:  withMappedNavigationProps(SearchContact),         
        },
      
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'ShareOption',
    navigationOptions: {
        header: null,

    }
  });
  class ShareRoot extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <ShareRootNav screenProps={{ rootNavigation: this.props.navigation }} />
        );
    }
}
export default ShareRoot;
