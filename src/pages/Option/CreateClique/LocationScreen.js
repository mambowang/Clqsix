'use strict';

import  React, { Component }  from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,

  TabBarIOS,
  TabBarItemIOS,
  Dimensions,
  Alert,
  Modal,
} from 'react-native';

import {
Button,
ClqsixTextInput,
Text,
CustomNavigator,
FullScreen,
ScrollViewWrapper,
ScrollView,
Options,
Images,
KeyboardSpacer
} from '../../../components';
import GooglePlaceAutocomplete from 'react-native-google-place-autocomplete';

class LocationScreen extends Component {  
   constructor(props) {
     super(props);
     this.state = {
       locationValue : '',
     }      
   }
   goBack() {
    const { navigation } = this.props;
    if(!!navigation.state.params){
      !!navigation.state.params.onSetLocation && 
      navigation.state.params.onSetLocation({ locationValue: this.state.locationValue });
    }
    navigation.goBack();       
  }
  goBackNormal(){
    const { navigation } = this.props;   
    navigation.goBack();       
  }
  setLocation(location){   
    this.setState({
     locationValue: location
    });  
  }
   render() {
     return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
       <CustomNavigator
          leftButton = {<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}
          rightButton = {<Text style={{fontFamily: 'SF UI Text', fontSize: 18, color: '#0F7EF4', fontWeight: '600'}}>Add</Text>}
          onLeftButtonPress = {() => this.goBackNormal()}  
          onRightButtonPress  = {() =>this.goBack() }
        >
        <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:18, fontWeight:'bold'}}>Location</Text>
        </CustomNavigator>
        <ScrollView
        scrollEnabled={false}
        scrollEnabledOnKeyboard={true}
        style = {{width: '90%',marginTop: 10}}>
          <GooglePlaceAutocomplete
              ref={ref=>this.location=ref} 
              googleAPIKey="AIzaSyBsqrtXUEGj1pjJhiyV5K2I7FSJqDxNzAo"
              onResult={
                result =>{ this.setLocation(result.formatted_address); }
                }
              value = {this.state.locationValue}
              style = {{backgroundColor: 'red'}}
              
              placeholder="Enter location" />
        
              </ScrollView>
              <KeyboardSpacer/>
       </FullScreen>
     );
   }
};
const contentPaddingHorizontal = 35;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'row', 
    alignItems : 'flex-start',
    paddingHorizontal: contentPaddingHorizontal,
  },
});

export default LocationScreen;