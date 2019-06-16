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
import * as globals from '../../../common/Global';

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  };
const widthBtn = (155 / 376) * window.width;
class CategoryScreen extends Component {  
   constructor(props) {
     super(props);
     const { params } = this.props.navigation.state;
     this.state = {
       categoryValue : params.categoryValue,
     }      
   }
   goBack() {
    const { navigation } = this.props;
    if(!!navigation.state.params){
      !!navigation.state.params.onSetCategory && 
      navigation.state.params.onSetCategory({ 
          categoryValue: this.state.categoryValue,
         });
    }
    navigation.goBack();       
  }
  goBackNormal(){
    const { navigation } = this.props;
  
    navigation.goBack();       
  }
  setCategory(category){   
    this.setState({
        categoryValue: category
    });  
  }
   render() {
     return (
      <FullScreen style={{alignItems: 'center', backgroundColor: '#ffffff',}}>
            <CustomNavigator
                leftButton = {<Image style= {{width:13,height:13}} source={Images.Cancel_650x650}/>}
                rightButton = {<Text style={{fontFamily: 'SF UI Text', fontSize: 18, color: '#0F7EF4', fontWeight: '600'}}>Done</Text>}
                onLeftButtonPress = {() => this.goBackNormal()}  
                onRightButtonPress  = {() =>this.goBack() }
                >
                <Text style={{fontFamily:'SF UI Text', fontSize: 17, marginLeft:18, fontWeight:'bold'}}>Categories</Text>
            </CustomNavigator>
            <ScrollView
                scrollEnabled={false}
                scrollEnabledOnKeyboard={true}
                style = {styles.content}>

                <FullScreen.Row style={styles.topview}>
                    <View >
                    <Text style={styles.topfont}>Select one</Text>
                    </View>
                </FullScreen.Row>
                <FullScreen.Row style={styles.contentrow} >
                    <Button.Simple
                        text= {globals.Category.Art}
                        onPress={() =>{this.setCategory(globals.Category.Art)}}  
                        style={this.state.categoryValue == globals.Category.Art ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Art ?styles.selectedBtnText: styles.categoryBtnText} />
                    <Button.Simple 
                        text= {globals.Category.Beauty} 
                        onPress={() =>{this.setCategory(globals.Category.Beauty)}}  
                        style={this.state.categoryValue == globals.Category.Beauty ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Beauty ?styles.selectedBtnText: styles.categoryBtnText}  />
                </FullScreen.Row>
                <FullScreen.Row style={styles.contentrow} >
                    <Button.Simple  
                        text= {globals.Category.Comedy}
                        onPress={() =>{this.setCategory(globals.Category.Comedy)}}  
                        style={this.state.categoryValue == globals.Category.Comedy ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Comedy ?styles.selectedBtnText: styles.categoryBtnText} />
                    <Button.Simple 
                        text= {globals.Category.Couple} 
                        onPress={() =>{this.setCategory(globals.Category.Couple)}}  
                        style={this.state.categoryValue == globals.Category.Couple ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Couple ?styles.selectedBtnText: styles.categoryBtnText} />
                </FullScreen.Row>
                <FullScreen.Row style={styles.contentrow} >
                    <Button.Simple   
                        text= {globals.Category.Creative} 
                        onPress={() =>{this.setCategory(globals.Category.Creative)}}  
                        style={this.state.categoryValue == globals.Category.Creative ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Creative ?styles.selectedBtnText: styles.categoryBtnText}  />
                    <Button.Simple 
                        text= {globals.Category.Dance} 
                        onPress={() =>{this.setCategory(globals.Category.Dance)}}  
                        style={this.state.categoryValue == globals.Category.Dance ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Dance ?styles.selectedBtnText: styles.categoryBtnText} />
                </FullScreen.Row>
                <FullScreen.Row style={styles.contentrow} >
                    <Button.Simple
                        text= {globals.Category.Family}
                        onPress={() =>{this.setCategory(globals.Category.Family)}}  
                        style={this.state.categoryValue == globals.Category.Family ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Family ?styles.selectedBtnText: styles.categoryBtnText}  />
                    <Button.Simple 
                        text= {globals.Category.Fashion} 
                        onPress={() =>{this.setCategory(globals.Category.Fashion)}}  
                        style={this.state.categoryValue == globals.Category.Fashion ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Fashion ?styles.selectedBtnText: styles.categoryBtnText}  />
                </FullScreen.Row>
                <FullScreen.Row style={styles.contentrow} >
                    <Button.Simple  
                        text= {globals.Category.Food} 
                        onPress={() =>{this.setCategory(globals.Category.Food)}}  
                        style={this.state.categoryValue == globals.Category.Food ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Food ?styles.selectedBtnText: styles.categoryBtnText} />
                    <Button.Simple 
                        text= {globals.Category.Gaming}
                        onPress={() =>{this.setCategory(globals.Category.Gaming)}}  
                        style={this.state.categoryValue == globals.Category.Gaming ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Gaming ?styles.selectedBtnText: styles.categoryBtnText}  />
                </FullScreen.Row>
                <FullScreen.Row style={styles.contentrow} >
                    <Button.Simple
                        text= {globals.Category.Greek}
                        onPress={() =>{this.setCategory(globals.Category.Greek)}}  
                        style={this.state.categoryValue == globals.Category.Greek ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Greek ?styles.selectedBtnText: styles.categoryBtnText} />
                    <Button.Simple 
                        text= {globals.Category.Lifestyle}
                        onPress={() =>{this.setCategory(globals.Category.Lifestyle)}}  
                        style={this.state.categoryValue == globals.Category.Lifestyle ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Lifestyle ?styles.selectedBtnText: styles.categoryBtnText} />
                </FullScreen.Row>
                <FullScreen.Row style={styles.contentrow} >
                    <Button.Simple
                        text= {globals.Category.Music}
                        onPress={() =>{this.setCategory(globals.Category.Music)}}  
                        style={this.state.categoryValue == globals.Category.Music ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Music ?styles.selectedBtnText: styles.categoryBtnText} />
                    <Button.Simple 
                        text= {globals.Category.Sports}
                        onPress={() =>{this.setCategory(globals.Category.Sports)}}  
                        style={this.state.categoryValue == globals.Category.Sports ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Sports ?styles.selectedBtnText: styles.categoryBtnText}  />
                </FullScreen.Row>
                <FullScreen.Row style={styles.contentrow} >
                    <Button.Simple 
                        text= {globals.Category.Travel}
                        onPress={() =>{this.setCategory(globals.Category.Travel)}}  
                        style={this.state.categoryValue == globals.Category.Travel ?styles.selectedBtn :styles.categoryBtn} 
                        textStyle={this.state.categoryValue == globals.Category.Travel ?styles.selectedBtnText: styles.categoryBtnText}  />
                    <Button.Simple onPress={() =>{}} 
                        activeOpacity = {1} 
                        text='CLQSIX' 
                        style={styles.clqsixBtn} 
                        textStyle={styles.selectedBtnText} />
                </FullScreen.Row>
            </ScrollView>
       </FullScreen>
     );
   }
};
const contentPaddingHorizontal = 25;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection: 'column',    
    width:'100%',
    paddingHorizontal: contentPaddingHorizontal,
  },
  topview: {
    flex: 1,
    justifyContent: "center",
    alignItems:'center',
    backgroundColor:'#9E4FFF',   
    height: 60,
    marginTop:30,
    marginBottom:30,
    
  },
  topfont: {
    fontFamily: 'SF UI Text', 
    fontSize: 13, 
    color:'white',
    fontWeight: 'bold',
  },
  contentrow: {   
    flex: 1,
    flexDirection: 'row',    
    justifyContent: "space-between",
    alignItems:'center',
    height: 40,
    marginTop:15,
  },
  categoryBtnText:{
    color:'black',
    fontWeight: 'bold',
    
  },
  categoryBtn:{
     borderWidth:1, 
     borderColor:'#000000', 
     backgroundColor:'white',
     height:'100%',
     width:widthBtn
    
  },
  clqsixBtn:{
    borderWidth:1, 
    borderColor:'#EF4244', 
    backgroundColor:'#EF4244',
    height:'100%',
    width:widthBtn
  },
  selectedBtnText:{
      color:'white',
      fontWeight: 'bold',
      
  },
  selectedBtn:{
    borderWidth:1, 
    borderColor:'#0095F7', 
    backgroundColor:'#0095F7',
    height:'100%',
    width:widthBtn
}
});

export default CategoryScreen;