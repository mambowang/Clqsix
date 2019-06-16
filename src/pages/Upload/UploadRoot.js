'use strict';
import { StackNavigator } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';

import Upload from './Upload';
import ImageUpload from './ImageUpload';
import VideoUpload from './VideoUpload';
import TextUpload from './TextUpload';
import LinkUpload from './LinkUpload';

const UploadRoot =  StackNavigator({
        Upload: {
            screen:  withMappedNavigationProps(Upload),         
        },
     
        ImageUpload: {
            screen:  withMappedNavigationProps(ImageUpload),          
        },      
        VideoUpload: {
            screen:  withMappedNavigationProps(VideoUpload),            
        },
        TextUpload: {
            screen:  withMappedNavigationProps(TextUpload),            
        },
        LinkUpload: {
            screen:  withMappedNavigationProps(LinkUpload),            
        },
    }
    ,{
    headerMode: 'none',    
    initialRouteName: 'Upload',
    navigationOptions: {
        header: null,

    }
  });

export default UploadRoot;