var _jsxFileName = "/Users/tejeong/Desktop/deloitte-projects/schematik-forms/src/renderTextNode.js";
import React from 'react';
import { getIn } from 'formik';
var types = {
  TEXT: 'text',
  RICH_TEXT: 'richtext'
};

var renderTextNode = function renderTextNode(node) {
  var WrappingTag = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
  var context = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof node === 'string') {
    return node;
  }

  var content;

  if (node && node.content) {
    content = node.content;
  }

  if (node && node.contentPath) {
    content = getIn(context, node.contentPath);
  }

  if (node && node.type === types.TEXT) {
    return content;
  }

  if (node && node.type === types.RICH_TEXT) {
    return React.createElement(WrappingTag, {
      dangerouslySetInnerHTML: {
        __html: content
      },
      __source: {
        fileName: _jsxFileName,
        lineNumber: 29
      },
      __self: this
    });
  }

  return undefined;
};

export default renderTextNode;
//# sourceMappingURL=renderTextNode.js.map