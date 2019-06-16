'use strict';

import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation';

import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import PrivacyPage from '../../../container/site/PrivacyPage';
import ServicePage from '../../../container/site/ServicePage';

const Signup =  StackNavigator({
    FirstPage: {
      screen: FirstPage,
      headerMode: 'none',
      navigationOptions: {
          header: null,
      }
    },
    SecondPage: {
      screen: SecondPage,
      headerMode: 'none',
      navigationOptions: {
          header: null,
      }
    },
    PrivacyPage:  {
      screen: PrivacyPage,
      headerMode: 'none',
      navigationOptions: {
          header: null,
      }
    },
    
    ServicePage:  {
      screen: ServicePage,
      headerMode: 'none',
      navigationOptions: {
          header: null,
      }
    },
  }
  ,{
  headerMode: 'none',    
  initialRouteName: 'FirstPage',
  navigationOptions: {
      header: null,

  }
});

export default Signup;
