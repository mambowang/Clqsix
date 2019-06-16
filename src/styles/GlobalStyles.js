'use strict';

import {
  StyleSheet,
  Dimensions,
} from 'react-native';

export const Size  = Dimensions.get('window');

export const BoardWidth = Size.width;

export const BoardHeight = Size.height;

export const BoardMin = BoardWidth < BoardHeight ? BoardWidth : BoardHeight;

export const FooterHeight = 50;

export const SeparatorLineColor = '#e6e6e6';

export const DefaultBackgroundColor = 'white';

export const DefaultNavigatorHeight = 50;

export const DefaultTitleFontSize = 30;

export const WindowMarginTop = DefaultNavigatorHeight;

export const WindowMarginLeft = 50;

export const WindowMarginRight = 30;


export const GlobalStyles = StyleSheet.create({
  container: {
    flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: DefaultBackgroundColor,
  },

  row: {
    flexDirection: 'row'
  },

  col: {
    flex: 1
  },

  titleText: {
    color: 'black',
    fontWeight: '500',
    fontSize: 16,
  }
});

export const ButtonStyles = StyleSheet.create({
  largeWidth: {
    width: BoardWidth - 32,
  },
  
});


