import React from 'react';
import { StackNavigator,StackRouter } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';
import  Reaction  from './Reaction';
import  Comment  from './Comment';
import  VisualDetail  from './VisualDetail';


const VisualRootNav = StackNavigator({       
        VisualDetail: {
            screen: withMappedNavigationProps(VisualDetail),          
        },
        Reaction: {
            screen: withMappedNavigationProps(Reaction),         
        },
        Comment: {
            screen: withMappedNavigationProps(Comment),         
        },
       
    }
    ,{
        headerMode: 'none',    
        initialRouteName: 'VisualDetail',
        navigationOptions: {
            header: null,

        } 
});
class VisualRoot extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <VisualRootNav screenProps={{ rootNavigation: this.props.navigation }} />
        );
    }
}
export default VisualRoot;