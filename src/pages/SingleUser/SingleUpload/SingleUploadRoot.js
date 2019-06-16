'use strict';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import SingleUpload from './SingleUpload';


const SingleUploadRoot =  StackNavigator({
    SingleUpload: {
        screen:  withMappedNavigationProps(SingleUpload),
        headerMode: 'none',
        navigationOptions: {
            header: null,
        }
      },
     
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'SingleUpload',
    navigationOptions: {
        header: null,

    }
  });

export default SingleUploadRoot;