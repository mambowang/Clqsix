import React, { Component  } from 'react';
import { Animated,View, Text,StyleSheet,Dimensions } from 'react-native';
import { TabViewAnimated, TabBar ,SceneMap } from 'react-native-tab-view';
import  CliqueList from './CliqueList';
import  MemberList from './MemberList';

import  VisualList from './VisualList';
const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabbar: {
    backgroundColor: '#ffffff',
  },
  page: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   
  },
  label: {   
    fontWeight: 'bold',
  },
  tabBarLabel: {
    fontWeight: 'bold',
    fontSize : 15,
    paddingVertical: 10,
    color:'#BBBBBB',
  },

});
const visuals = () => <VisualList /> ;
const cliques = () => <CliqueList /> ;
const individuals = () => <MemberList /> ;


export default class DiscoverTabView extends Component  {
  
  state = {
    index: 0,
    routes: [
       { key: '0', title: 'visuals' },
       { key: '1', title: 'cliques' },
       { key: '2', title: 'individuals' }
    ],
  };
 
  //props.navigationState.index
  _renderLabel = props => ({ route, index }) => {
    const selectIndex = props.navigationState.index;
    return (
      <Text style={[styles.tabBarLabel, { color:selectIndex === index ? '#000000' : '#BBBBBB' }]}>
        {route.title}
      </Text>
    );
  };
  _renderLabelOld = props => ({ route, index }) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const outputRange = inputRange.map(
      inputIndex => (inputIndex === index ? '#000000' : '#BBBBBB')
    );
    const color = props.position.interpolate({
      inputRange,
      outputRange,
    });

    return (
      <Animated.Text style={[styles.tabBarLabel, { color }]}>
        {route.title}
      </Animated.Text>
    );
  };
  // _renderLabel=({route,index}) => {
  //   return (<Text style={styles.tabBarLabel}>{route.title}</Text>);
  // };
  _handleChangeTab = (index) => {
    this.setState({ index });
  };

  _renderHeader = (props) => {
    return <TabBar 
    {...props} 
    pressColor='#000000'    
    renderLabel={this._renderLabel(props)}
    style={styles.tabbar}
    labelStyle={styles.label}
    scrollEnabled = {false}
    indicatorStyle  = {{backgroundColor: '#000000'}}
    
    />;
  };

  _renderScene = SceneMap({
    0: visuals,
    1: cliques,
    2:individuals
  });
  // _renderScene = ({ route }) => {
  //   if (Math.abs(this.state.index - this.state.routes.indexOf(route)) > 2) {
  //     return null;
  //   }
  //   switch (route.key) {
  //     case '0':
  //       return <VisualList />;
  //     case '1':
  //       return <CliqueList />;
  //     case '2':
  //       return <MemberList />;
  //     default:
  //       return null;
  //   }
  // };
  render() {
    return (
      <TabViewAnimated
        style={styles.container}
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleChangeTab}
        initialLayout={initialLayout}
        
      />
    );
  }
}