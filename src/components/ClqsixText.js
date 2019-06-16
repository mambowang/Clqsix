'use strict';

import React, { Component } from 'react';
import {
  Text,
  StyleSheet,
} from 'react-native';

class ClqsixText extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    var props = {...this.props};
    props.style=[styles.text, this.props.style];
    return (
      <Text {...this.props} />
    )
  }
}
const styles = StyleSheet.create({
  text : {
    fontFamily: 'SF UI Text',
    fontSize: 15,
  },
});

export default ClqsixText;



        