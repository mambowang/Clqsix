import React from 'react';
import { StackNavigator,StackRouter } from 'react-navigation';
import { withMappedNavigationProps } from 'react-navigation-props-mapper';


import  Notify  from './Notify';
// import  MemberRoot  from './MemberRoot';

// import  VisualRoot  from '../visual';
// import  CliqueRoot  from '../clique';


const NotifyRootNav = StackNavigator({       
        Notify: {
            screen: withMappedNavigationProps(Notify),          
        },
    }
    ,{
        headerMode: 'none',    
        initialRouteName: 'Notify',
        navigationOptions: {
            header: null,

        } 
});
class NotifyRoot extends React.Component {
    constructor(props)  {
        super(props);
    }
    render() {
        return (
            <NotifyRootNav screenProps={{ rootNavigation: this.props.navigation }} />
        );
    }
}
export default NotifyRoot;