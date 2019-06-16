'use strict';

let ReactNativePropRegistry = require('ReactNativePropRegistry');
let Common = require('autoresponsive-common');
let {
  Util
} = Common;

function getStyleByID(id) {
  let style = id;
  while((typeof style) === 'number') {
    style = ReactNativePropRegistry.getByID(style);
  }
  return style;
}

var StyleAPI = {
  mergeStyle (style, styles) {

    if (!style) {
      return styles || {};
    }

    if ((typeof style) === 'number') {
      style = getStyleByID(style);
    }

    if (!(style instanceof Array)) {
      if (!styles) {
        return style;
      }
      Util.merge(styles, style);
      return styles;
    } else if (!styles) {
      styles = {};
    }

    style.forEach((item) => {
      let _item = item;      
      if ((typeof _item) === 'number') {
        _item = getStyleByID(_item);
      }

      if (_item instanceof Array) {
        StyleAPI.mergeStyle(_item, styles);
      } else {
        Util.merge(styles, _item);
      }
    });
    return styles;
  }
}
export default StyleAPI;