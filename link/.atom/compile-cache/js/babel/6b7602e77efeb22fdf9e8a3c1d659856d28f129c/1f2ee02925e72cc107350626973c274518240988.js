/** @preserve
*  Copyright (c) 2014, Facebook, Inc.
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree. An additional grant
*  of patent rights can be found in the PATENTS file in the same directory.
*
*/
'use strict';

/**
* This is a very simple HTML to JSX converter. It turns out that browsers
* have good HTML parsers (who would have thought?) so we utilise this by
* inserting the HTML into a temporary DOM node, and then do a breadth-first
* traversal of the resulting DOM tree.
*/

// https://developer.mozilla.org/en-US/docs/Web/API/Node.nodeType
var NODE_TYPE = {
  ELEMENT: 1,
  TEXT: 3,
  COMMENT: 8
};

var ATTRIBUTE_MAPPING = {
  'for': 'htmlFor',
  'class': 'className'
};

var ELEMENT_ATTRIBUTE_MAPPING = {
  input: {
    checked: 'defaultChecked',
    value: 'defaultValue'
  }
};

/**
* Repeats a string a certain number of times.
* Also: the future is bright and consists of native string repetition:
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/repeat
*
* @param {string} string  String to repeat
* @param {number} times   Number of times to repeat string. Integer.
* @see http://jsperf.com/string-repeater/2
*/
function repeatString(string, times) {
  if (times === 1) {
    return string;
  }
  if (times < 0) {
    throw new Error();
  }
  var repeated = '';
  while (times) {
    if (times & 1) {
      repeated += string;
    }
    if (times >>= 1) {
      string += string;
    }
  }
  return repeated;
}

/**
* Determine if the string ends with the specified substring.
*
* @param {string} haystack String to search in
* @param {string} needle   String to search for
* @return {boolean}
*/
function endsWith(haystack, needle) {
  return haystack.slice(-needle.length) === needle;
}

/**
* Trim the specified substring off the string. If the string does not end
* with the specified substring, this is a no-op.
*
* @param {string} haystack String to search in
* @param {string} needle   String to search for
* @return {string}
*/
function trimEnd(haystack, needle) {
  return endsWith(haystack, needle) ? haystack.slice(0, -needle.length) : haystack;
}

/**
* Convert a hyphenated string to camelCase.
*/
function hyphenToCamelCase(string) {
  return string.replace(/-(.)/g, function (match, chr) {
    return chr.toUpperCase();
  });
}

/**
* Determines if the specified string consists entirely of whitespace.
*/
function isEmpty(string) {
  return !/[^\s]/.test(string);
}

/**
* Determines if the CSS value can be converted from a
* 'px' suffixed string to a numeric value
*
* @param {string} value CSS property value
* @return {boolean}
*/
function isConvertiblePixelValue(value) {
  return /^\d+px$/.test(value);
}

/**
* Determines if the specified string consists entirely of numeric characters.
*/
function isNumeric(input) {
  return input !== undefined && input !== null && (typeof input === 'number' || parseInt(input, 10) == input);
}

var createElement = function createElement(tag) {
  return document.createElement(tag);
};

var tempEl = createElement('div');
/**
* Escapes special characters by converting them to their escaped equivalent
* (eg. "<" to "&lt;"). Only escapes characters that absolutely must be escaped.
*
* @param {string} value
* @return {string}
*/
function escapeSpecialChars(value) {
  // Uses this One Weird Trick to escape text - Raw text inserted as textContent
  // will have its escaped version in innerHTML.
  tempEl.textContent = value;
  return tempEl.innerHTML;
}

var HTMLtoJSX = function HTMLtoJSX(config) {
  this.config = config || {};

  if (this.config.createClass === undefined) {
    this.config.createClass = true;
  }
  if (!this.config.indent) {
    this.config.indent = '  ';
  }
  if (!this.config.outputClassName) {
    this.config.outputClassName = 'NewComponent';
  }
};

HTMLtoJSX.prototype = {
  /**
  * Reset the internal state of the converter
  */
  reset: function reset() {
    this.output = '';
    this.level = 0;
  },
  /**
  * Main entry point to the converter. Given the specified HTML, returns a
  * JSX object representing it.
  * @param {string} html HTML to convert
  * @return {string} JSX
  */
  convert: function convert(html) {
    this.reset();

    var containerEl = createElement('div');
    containerEl.innerHTML = '\n' + this._cleanInput(html) + '\n';

    if (this.config.createClass) {
      if (this.config.outputClassName) {
        this.output = 'var ' + this.config.outputClassName + ' = React.createClass({\n';
      } else {
        this.output = 'React.createClass({\n';
      }
      this.output += this.config.indent + 'render: function() {' + '\n';
      this.output += this.config.indent + this.config.indent + 'return (\n';
    }

    if (this._onlyOneTopLevel(containerEl)) {
      // Only one top-level element, the component can return it directly
      // No need to actually visit the container element
      this._traverse(containerEl);
    } else {
      // More than one top-level element, need to wrap the whole thing in a
      // container.
      this.output += this.config.indent + this.config.indent + this.config.indent;
      this.level++;
      this._visit(containerEl);
    }
    this.output = this.output.trim() + '\n';
    if (this.config.createClass) {
      this.output += this.config.indent + this.config.indent + ');\n';
      this.output += this.config.indent + '}\n';
      this.output += '});';
    }
    return this.output;
  },

  /**
  * Cleans up the specified HTML so it's in a format acceptable for
  * converting.
  *
  * @param {string} html HTML to clean
  * @return {string} Cleaned HTML
  */
  _cleanInput: function _cleanInput(html) {
    // Remove unnecessary whitespace
    html = html.trim();
    // Ugly method to strip script tags. They can wreak havoc on the DOM nodes
    // so let's not even put them in the DOM.
    html = html.replace(/<script([\s\S]*?)<\/script>/g, '');
    return html;
  },

  /**
  * Determines if there's only one top-level node in the DOM tree. That is,
  * all the HTML is wrapped by a single HTML tag.
  *
  * @param {DOMElement} containerEl Container element
  * @return {boolean}
  */
  _onlyOneTopLevel: function _onlyOneTopLevel(containerEl) {
    // Only a single child element
    if (containerEl.childNodes.length === 1 && containerEl.childNodes[0].nodeType === NODE_TYPE.ELEMENT) {
      return true;
    }
    // Only one element, and all other children are whitespace
    var foundElement = false;
    for (var i = 0, count = containerEl.childNodes.length; i < count; i++) {
      var child = containerEl.childNodes[i];
      if (child.nodeType === NODE_TYPE.ELEMENT) {
        if (foundElement) {
          // Encountered an element after already encountering another one
          // Therefore, more than one element at root level
          return false;
        } else {
          foundElement = true;
        }
      } else if (child.nodeType === NODE_TYPE.TEXT && !isEmpty(child.textContent)) {
        // Contains text content
        return false;
      }
    }
    return true;
  },

  /**
  * Gets a newline followed by the correct indentation for the current
  * nesting level
  *
  * @return {string}
  */
  _getIndentedNewline: function _getIndentedNewline() {
    return '\n' + repeatString(this.config.indent, this.level + 2);
  },

  /**
  * Handles processing the specified node
  *
  * @param {Node} node
  */
  _visit: function _visit(node) {
    this._beginVisit(node);
    this._traverse(node);
    this._endVisit(node);
  },

  /**
  * Traverses all the children of the specified node
  *
  * @param {Node} node
  */
  _traverse: function _traverse(node) {
    this.level++;
    for (var i = 0, count = node.childNodes.length; i < count; i++) {
      this._visit(node.childNodes[i]);
    }
    this.level--;
  },

  /**
  * Handle pre-visit behaviour for the specified node.
  *
  * @param {Node} node
  */
  _beginVisit: function _beginVisit(node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this._beginVisitElement(node);
        break;

      case NODE_TYPE.TEXT:
        this._visitText(node);
        break;

      case NODE_TYPE.COMMENT:
        this._visitComment(node);
        break;

      default:
        console.warn('Unrecognised node type: ' + node.nodeType);
    }
  },

  /**
  * Handles post-visit behaviour for the specified node.
  *
  * @param {Node} node
  */
  _endVisit: function _endVisit(node) {
    switch (node.nodeType) {
      case NODE_TYPE.ELEMENT:
        this._endVisitElement(node);
        break;
      // No ending tags required for these types
      case NODE_TYPE.TEXT:
      case NODE_TYPE.COMMENT:
        break;
    }
  },

  /**
  * Handles pre-visit behaviour for the specified element node
  *
  * @param {DOMElement} node
  */
  _beginVisitElement: function _beginVisitElement(node) {
    var tagName = node.tagName.toLowerCase();
    var attributes = [];
    for (var i = 0, count = node.attributes.length; i < count; i++) {
      attributes.push(this._getElementAttribute(node, node.attributes[i]));
    }

    this.output += '<' + tagName;
    if (attributes.length > 0) {
      this.output += ' ' + attributes.join(' ');
    }
    if (node.firstChild) {
      this.output += '>';
    }
  },

  /**
  * Handles post-visit behaviour for the specified element node
  *
  * @param {Node} node
  */
  _endVisitElement: function _endVisitElement(node) {
    // De-indent a bit
    // TODO: It's inefficient to do it this way :/
    this.output = trimEnd(this.output, this.config.indent);
    if (node.firstChild) {
      this.output += '</' + node.tagName.toLowerCase() + '>';
    } else {
      this.output += ' />';
    }
  },

  /**
  * Handles processing of the specified text node
  *
  * @param {TextNode} node
  */
  _visitText: function _visitText(node) {
    var text = node.textContent;
    // If there's a newline in the text, adjust the indent level
    if (text.indexOf('\n') > -1) {
      text = node.textContent.replace(/\n\s*/g, this._getIndentedNewline());
    }
    this.output += escapeSpecialChars(text);
  },

  /**
  * Handles processing of the specified text node
  *
  * @param {Text} node
  */
  _visitComment: function _visitComment(node) {
    // Do not render the comment
    // Since we remove comments, we also need to remove the next line break so we
    // don't end up with extra whitespace after every comment
    //if (node.nextSibling && node.nextSibling.nodeType === NODE_TYPE.TEXT) {
    //  node.nextSibling.textContent = node.nextSibling.textContent.replace(/\n\s*/, '');
    //}
    this.output += '{/*' + node.textContent.replace('*/', '* /') + '*/}';
  },

  /**
  * Gets a JSX formatted version of the specified attribute from the node
  *
  * @param {DOMElement} node
  * @param {object}     attribute
  * @return {string}
  */
  _getElementAttribute: function _getElementAttribute(node, attribute) {
    switch (attribute.name) {
      case 'style':
        return this._getStyleAttribute(attribute.value);
      default:
        var tagName = node.tagName.toLowerCase();
        var name = ELEMENT_ATTRIBUTE_MAPPING[tagName] && ELEMENT_ATTRIBUTE_MAPPING[tagName][attribute.name] || ATTRIBUTE_MAPPING[attribute.name] || attribute.name;
        var result = name;

        // Numeric values should be output as {123} not "123"
        if (isNumeric(attribute.value)) {
          result += '={' + attribute.value + '}';
        } else if (attribute.value.length > 0) {
          result += '="' + attribute.value.replace('"', '&quot;') + '"';
        }
        return result;
    }
  },

  /**
  * Gets a JSX formatted version of the specified element styles
  *
  * @param {string} styles
  * @return {string}
  */
  _getStyleAttribute: function _getStyleAttribute(styles) {
    var jsxStyles = new StyleParser(styles).toJSXString();
    return 'style={{' + jsxStyles + '}}';
  }
};

/**
* Handles parsing of inline styles
*
* @param {string} rawStyle Raw style attribute
* @constructor
*/
var StyleParser = function StyleParser(rawStyle) {
  this.parse(rawStyle);
};
StyleParser.prototype = {
  /**
  * Parse the specified inline style attribute value
  * @param {string} rawStyle Raw style attribute
  */
  parse: function parse(rawStyle) {
    this.styles = {};
    rawStyle.split(';').forEach(function (style) {
      style = style.trim();
      var firstColon = style.indexOf(':');
      var key = style.substr(0, firstColon);
      var value = style.substr(firstColon + 1).trim();
      if (key !== '') {
        this.styles[key] = value;
      }
    }, this);
  },

  /**
  * Convert the style information represented by this parser into a JSX
  * string
  *
  * @return {string}
  */
  toJSXString: function toJSXString() {
    var output = [];
    for (var key in this.styles) {
      if (!this.styles.hasOwnProperty(key)) {
        continue;
      }
      output.push(this.toJSXKey(key) + ': ' + this.toJSXValue(this.styles[key]));
    }
    return output.join(', ');
  },

  /**
  * Convert the CSS style key to a JSX style key
  *
  * @param {string} key CSS style key
  * @return {string} JSX style key
  */
  toJSXKey: function toJSXKey(key) {
    return hyphenToCamelCase(key);
  },

  /**
  * Convert the CSS style value to a JSX style value
  *
  * @param {string} value CSS style value
  * @return {string} JSX style value
  */
  toJSXValue: function toJSXValue(value) {
    if (isNumeric(value)) {
      // If numeric, no quotes
      return value;
    } else if (isConvertiblePixelValue(value)) {
      // "500px" -> 500
      return trimEnd(value, 'px');
    } else {
      // Probably a string, wrap it in quotes
      return '\'' + value.replace(/'/g, '"') + '\'';
    }
  }
};

module.exports = HTMLtoJSX;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9sb25uZW4vLmF0b20vcGFja2FnZXMvcmVhY3QvbGliL2h0bWx0b2pzeC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFTQSxZQUFZLENBQUM7Ozs7Ozs7Ozs7QUFVYixJQUFJLFNBQVMsR0FBRztBQUNkLFNBQU8sRUFBRSxDQUFDO0FBQ1YsTUFBSSxFQUFFLENBQUM7QUFDUCxTQUFPLEVBQUUsQ0FBQztDQUNYLENBQUM7O0FBRUYsSUFBSSxpQkFBaUIsR0FBRztBQUN0QixPQUFLLEVBQUUsU0FBUztBQUNoQixTQUFPLEVBQUUsV0FBVztDQUNyQixDQUFDOztBQUVGLElBQUkseUJBQXlCLEdBQUc7QUFDOUIsU0FBUztBQUNQLGFBQVcsZ0JBQWdCO0FBQzNCLFdBQVMsY0FBYztHQUN4QjtDQUNGLENBQUM7Ozs7Ozs7Ozs7O0FBV0YsU0FBUyxZQUFZLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRTtBQUNuQyxNQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7QUFDZixXQUFPLE1BQU0sQ0FBQztHQUNmO0FBQ0QsTUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO0FBQUUsVUFBTSxJQUFJLEtBQUssRUFBRSxDQUFDO0dBQUU7QUFDckMsTUFBSSxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFNBQU8sS0FBSyxFQUFFO0FBQ1osUUFBSSxLQUFLLEdBQUcsQ0FBQyxFQUFFO0FBQ2IsY0FBUSxJQUFJLE1BQU0sQ0FBQztLQUNwQjtBQUNELFFBQUksS0FBSyxLQUFLLENBQUMsRUFBRTtBQUNmLFlBQU0sSUFBSSxNQUFNLENBQUM7S0FDbEI7R0FDRjtBQUNELFNBQU8sUUFBUSxDQUFDO0NBQ2pCOzs7Ozs7Ozs7QUFTRCxTQUFTLFFBQVEsQ0FBQyxRQUFRLEVBQUUsTUFBTSxFQUFFO0FBQ2xDLFNBQU8sUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxNQUFNLENBQUM7Q0FDbEQ7Ozs7Ozs7Ozs7QUFVRCxT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cEIsYUFBTyxLQUFLLENBQUM7S0FDZCxNQUFNLElBQUksdUJBQXVCLENBQUMsS0FBSyxDQUFDLEVBQUU7O0FBRXpDLGFBQU8sT0FBTyxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM3QixNQUFNOztBQUVMLGFBQU8sSUFBSSxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztLQUMvQztHQUNGO0NBQ0YsQ0FBQzs7QUFFRixNQUFNLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyIsImZpbGUiOiIvVXNlcnMvbG9ubmVuLy5hdG9tL3BhY2thZ2VzL3JlYWN0L2xpYi9odG1sdG9qc3guanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiogQHByZXNlcnZlXG4qICBDb3B5cmlnaHQgKGMpIDIwMTQsIEZhY2Vib29rLCBJbmMuXG4qICBBbGwgcmlnaHRzIHJlc2VydmVkLlxuKlxuKiAgVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4qICBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiogIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuKlxuKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4qIFRoaXMgaXMgYSB2ZXJ5IHNpbXBsZSBIVE1MIHRvIEpTWCBjb252ZXJ0ZXIuIEl0IHR1cm5zIG91dCB0aGF0IGJyb3dzZXJzXG4qIGhhdmUgZ29vZCBIVE1MIHBhcnNlcnMgKHdobyB3b3VsZCBoYXZlIHRob3VnaHQ/KSBzbyB3ZSB1dGlsaXNlIHRoaXMgYnlcbiogaW5zZXJ0aW5nIHRoZSBIVE1MIGludG8gYSB0ZW1wb3JhcnkgRE9NIG5vZGUsIGFuZCB0aGVuIGRvIGEgYnJlYWR0aC1maXJzdFxuKiB0cmF2ZXJzYWwgb2YgdGhlIHJlc3VsdGluZyBET00gdHJlZS5cbiovXG5cbi8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9Ob2RlLm5vZGVUeXBlXG52YXIgTk9ERV9UWVBFID0ge1xuICBFTEVNRU5UOiAxLFxuICBURVhUOiAzLFxuICBDT01NRU5UOiA4XG59O1xuXG52YXIgQVRUUklCVVRFX01BUFBJTkcgPSB7XG4gICdmb3InOiAnaHRtbEZvcicsXG4gICdjbGFzcyc6ICdjbGFzc05hbWUnXG59O1xuXG52YXIgRUxFTUVOVF9BVFRSSUJVVEVfTUFQUElORyA9IHtcbiAgJ2lucHV0Jzoge1xuICAgICdjaGVja2VkJzogJ2RlZmF1bHRDaGVja2VkJyxcbiAgICAndmFsdWUnOiAnZGVmYXVsdFZhbHVlJ1xuICB9XG59O1xuXG4vKipcbiogUmVwZWF0cyBhIHN0cmluZyBhIGNlcnRhaW4gbnVtYmVyIG9mIHRpbWVzLlxuKiBBbHNvOiB0aGUgZnV0dXJlIGlzIGJyaWdodCBhbmQgY29uc2lzdHMgb2YgbmF0aXZlIHN0cmluZyByZXBldGl0aW9uOlxuKiBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9KYXZhU2NyaXB0L1JlZmVyZW5jZS9HbG9iYWxfT2JqZWN0cy9TdHJpbmcvcmVwZWF0XG4qXG4qIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgIFN0cmluZyB0byByZXBlYXRcbiogQHBhcmFtIHtudW1iZXJ9IHRpbWVzICAgTnVtYmVyIG9mIHRpbWVzIHRvIHJlcGVhdCBzdHJpbmcuIEludGVnZXIuXG4qIEBzZWUgaHR0cDovL2pzcGVyZi5jb20vc3RyaW5nLXJlcGVhdGVyLzJcbiovXG5mdW5jdGlvbiByZXBlYXRTdHJpbmcoc3RyaW5nLCB0aW1lcykge1xuICBpZiAodGltZXMgPT09IDEpIHtcbiAgICByZXR1cm4gc3RyaW5nO1xuICB9XG4gIGlmICh0aW1lcyA8IDApIHsgdGhyb3cgbmV3IEVycm9yKCk7IH1cbiAgdmFyIHJlcGVhdGVkID0gJyc7XG4gIHdoaWxlICh0aW1lcykge1xuICAgIGlmICh0aW1lcyAmIDEpIHtcbiAgICAgIHJlcGVhdGVkICs9IHN0cmluZztcbiAgICB9XG4gICAgaWYgKHRpbWVzID4+PSAxKSB7XG4gICAgICBzdHJpbmcgKz0gc3RyaW5nO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVwZWF0ZWQ7XG59XG5cbi8qKlxuKiBEZXRlcm1pbmUgaWYgdGhlIHN0cmluZyBlbmRzIHdpdGggdGhlIHNwZWNpZmllZCBzdWJzdHJpbmcuXG4qXG4qIEBwYXJhbSB7c3RyaW5nfSBoYXlzdGFjayBTdHJpbmcgdG8gc2VhcmNoIGluXG4qIEBwYXJhbSB7c3RyaW5nfSBuZWVkbGUgICBTdHJpbmcgdG8gc2VhcmNoIGZvclxuKiBAcmV0dXJuIHtib29sZWFufVxuKi9cbmZ1bmN0aW9uIGVuZHNXaXRoKGhheXN0YWNrLCBuZWVkbGUpIHtcbiAgcmV0dXJuIGhheXN0YWNrLnNsaWNlKC1uZWVkbGUubGVuZ3RoKSA9PT0gbmVlZGxlO1xufVxuXG4vKipcbiogVHJpbSB0aGUgc3BlY2lmaWVkIHN1YnN0cmluZyBvZmYgdGhlIHN0cmluZy4gSWYgdGhlIHN0cmluZyBkb2VzIG5vdCBlbmRcbiogd2l0aCB0aGUgc3BlY2lmaWVkIHN1YnN0cmluZywgdGhpcyBpcyBhIG5vLW9wLlxuKlxuKiBAcGFyYW0ge3N0cmluZ30gaGF5c3RhY2sgU3RyaW5nIHRvIHNlYXJjaCBpblxuKiBAcGFyYW0ge3N0cmluZ30gbmVlZGxlICAgU3RyaW5nIHRvIHNlYXJjaCBmb3JcbiogQHJldHVybiB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIHRyaW1FbmQoaGF5c3RhY2ssIG5lZWRsZSkge1xuICByZXR1cm4gZW5kc1dpdGgoaGF5c3RhY2ssIG5lZWRsZSlcbiAgPyBoYXlzdGFjay5zbGljZSgwLCAtbmVlZGxlLmxlbmd0aClcbiAgOiBoYXlzdGFjaztcbn1cblxuLyoqXG4qIENvbnZlcnQgYSBoeXBoZW5hdGVkIHN0cmluZyB0byBjYW1lbENhc2UuXG4qL1xuZnVuY3Rpb24gaHlwaGVuVG9DYW1lbENhc2Uoc3RyaW5nKSB7XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZSgvLSguKS9nLCBmdW5jdGlvbihtYXRjaCwgY2hyKSB7XG4gICAgcmV0dXJuIGNoci50b1VwcGVyQ2FzZSgpO1xuICB9KTtcbn1cblxuLyoqXG4qIERldGVybWluZXMgaWYgdGhlIHNwZWNpZmllZCBzdHJpbmcgY29uc2lzdHMgZW50aXJlbHkgb2Ygd2hpdGVzcGFjZS5cbiovXG5mdW5jdGlvbiBpc0VtcHR5KHN0cmluZykge1xuICByZXR1cm4gIS9bXlxcc10vLnRlc3Qoc3RyaW5nKTtcbn1cblxuLyoqXG4qIERldGVybWluZXMgaWYgdGhlIENTUyB2YWx1ZSBjYW4gYmUgY29udmVydGVkIGZyb20gYVxuKiAncHgnIHN1ZmZpeGVkIHN0cmluZyB0byBhIG51bWVyaWMgdmFsdWVcbipcbiogQHBhcmFtIHtzdHJpbmd9IHZhbHVlIENTUyBwcm9wZXJ0eSB2YWx1ZVxuKiBAcmV0dXJuIHtib29sZWFufVxuKi9cbmZ1bmN0aW9uIGlzQ29udmVydGlibGVQaXhlbFZhbHVlKHZhbHVlKSB7XG4gIHJldHVybiAvXlxcZCtweCQvLnRlc3QodmFsdWUpO1xufVxuXG4vKipcbiogRGV0ZXJtaW5lcyBpZiB0aGUgc3BlY2lmaWVkIHN0cmluZyBjb25zaXN0cyBlbnRpcmVseSBvZiBudW1lcmljIGNoYXJhY3RlcnMuXG4qL1xuZnVuY3Rpb24gaXNOdW1lcmljKGlucHV0KSB7XG4gIHJldHVybiBpbnB1dCAhPT0gdW5kZWZpbmVkXG4gICYmIGlucHV0ICE9PSBudWxsXG4gICYmICh0eXBlb2YgaW5wdXQgPT09ICdudW1iZXInIHx8IHBhcnNlSW50KGlucHV0LCAxMCkgPT0gaW5wdXQpO1xufVxuXG52YXIgY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uIGNyZWF0ZUVsZW1lbnQodGFnKSB7XG4gICAgcmV0dXJuIGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQodGFnKTtcbn07XG5cbnZhciB0ZW1wRWwgPSBjcmVhdGVFbGVtZW50KCdkaXYnKTtcbi8qKlxuKiBFc2NhcGVzIHNwZWNpYWwgY2hhcmFjdGVycyBieSBjb252ZXJ0aW5nIHRoZW0gdG8gdGhlaXIgZXNjYXBlZCBlcXVpdmFsZW50XG4qIChlZy4gXCI8XCIgdG8gXCImbHQ7XCIpLiBPbmx5IGVzY2FwZXMgY2hhcmFjdGVycyB0aGF0IGFic29sdXRlbHkgbXVzdCBiZSBlc2NhcGVkLlxuKlxuKiBAcGFyYW0ge3N0cmluZ30gdmFsdWVcbiogQHJldHVybiB7c3RyaW5nfVxuKi9cbmZ1bmN0aW9uIGVzY2FwZVNwZWNpYWxDaGFycyh2YWx1ZSkge1xuICAvLyBVc2VzIHRoaXMgT25lIFdlaXJkIFRyaWNrIHRvIGVzY2FwZSB0ZXh0IC0gUmF3IHRleHQgaW5zZXJ0ZWQgYXMgdGV4dENvbnRlbnRcbiAgLy8gd2lsbCBoYXZlIGl0cyBlc2NhcGVkIHZlcnNpb24gaW4gaW5uZXJIVE1MLlxuICB0ZW1wRWwudGV4dENvbnRlbnQgPSB2YWx1ZTtcbiAgcmV0dXJuIHRlbXBFbC5pbm5lckhUTUw7XG59XG5cbnZhciBIVE1MdG9KU1ggPSBmdW5jdGlvbihjb25maWcpIHtcbiAgdGhpcy5jb25maWcgPSBjb25maWcgfHwge307XG5cbiAgaWYgKHRoaXMuY29uZmlnLmNyZWF0ZUNsYXNzID09PSB1bmRlZmluZWQpIHtcbiAgICB0aGlzLmNvbmZpZy5jcmVhdGVDbGFzcyA9IHRydWU7XG4gIH1cbiAgaWYgKCF0aGlzLmNvbmZpZy5pbmRlbnQpIHtcbiAgICB0aGlzLmNvbmZpZy5pbmRlbnQgPSAnICAnO1xuICB9XG4gIGlmICghdGhpcy5jb25maWcub3V0cHV0Q2xhc3NOYW1lKSB7XG4gICAgdGhpcy5jb25maWcub3V0cHV0Q2xhc3NOYW1lID0gJ05ld0NvbXBvbmVudCc7XG4gIH1cbn07XG5cbkhUTUx0b0pTWC5wcm90b3R5cGUgPSB7XG4gIC8qKlxuICAqIFJlc2V0IHRoZSBpbnRlcm5hbCBzdGF0ZSBvZiB0aGUgY29udmVydGVyXG4gICovXG4gIHJlc2V0OiBmdW5jdGlvbigpIHtcbiAgICB0aGlzLm91dHB1dCA9ICcnO1xuICAgIHRoaXMubGV2ZWwgPSAwO1xuICB9LFxuICAvKipcbiAgKiBNYWluIGVudHJ5IHBvaW50IHRvIHRoZSBjb252ZXJ0ZXIuIEdpdmVuIHRoZSBzcGVjaWZpZWQgSFRNTCwgcmV0dXJucyBhXG4gICogSlNYIG9iamVjdCByZXByZXNlbnRpbmcgaXQuXG4gICogQHBhcmFtIHtzdHJpbmd9IGh0bWwgSFRNTCB0byBjb252ZXJ0XG4gICogQHJldHVybiB7c3RyaW5nfSBKU1hcbiAgKi9cbiAgY29udmVydDogZnVuY3Rpb24oaHRtbCkge1xuICAgIHRoaXMucmVzZXQoKTtcblxuICAgIHZhciBjb250YWluZXJFbCA9IGNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnRhaW5lckVsLmlubmVySFRNTCA9ICdcXG4nICsgdGhpcy5fY2xlYW5JbnB1dChodG1sKSArICdcXG4nO1xuXG4gICAgaWYgKHRoaXMuY29uZmlnLmNyZWF0ZUNsYXNzKSB7XG4gICAgICBpZiAodGhpcy5jb25maWcub3V0cHV0Q2xhc3NOYW1lKSB7XG4gICAgICAgIHRoaXMub3V0cHV0ID0gJ3ZhciAnICsgdGhpcy5jb25maWcub3V0cHV0Q2xhc3NOYW1lICsgJyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcXG4nO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5vdXRwdXQgPSAnUmVhY3QuY3JlYXRlQ2xhc3Moe1xcbic7XG4gICAgICB9XG4gICAgICB0aGlzLm91dHB1dCArPSB0aGlzLmNvbmZpZy5pbmRlbnQgKyAncmVuZGVyOiBmdW5jdGlvbigpIHsnICsgXCJcXG5cIjtcbiAgICAgIHRoaXMub3V0cHV0ICs9IHRoaXMuY29uZmlnLmluZGVudCArIHRoaXMuY29uZmlnLmluZGVudCArICdyZXR1cm4gKFxcbic7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX29ubHlPbmVUb3BMZXZlbChjb250YWluZXJFbCkpIHtcbiAgICAgIC8vIE9ubHkgb25lIHRvcC1sZXZlbCBlbGVtZW50LCB0aGUgY29tcG9uZW50IGNhbiByZXR1cm4gaXQgZGlyZWN0bHlcbiAgICAgIC8vIE5vIG5lZWQgdG8gYWN0dWFsbHkgdmlzaXQgdGhlIGNvbnRhaW5lciBlbGVtZW50XG4gICAgICB0aGlzLl90cmF2ZXJzZShjb250YWluZXJFbCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE1vcmUgdGhhbiBvbmUgdG9wLWxldmVsIGVsZW1lbnQsIG5lZWQgdG8gd3JhcCB0aGUgd2hvbGUgdGhpbmcgaW4gYVxuICAgICAgLy8gY29udGFpbmVyLlxuICAgICAgdGhpcy5vdXRwdXQgKz0gdGhpcy5jb25maWcuaW5kZW50ICsgdGhpcy5jb25maWcuaW5kZW50ICsgdGhpcy5jb25maWcuaW5kZW50O1xuICAgICAgdGhpcy5sZXZlbCsrO1xuICAgICAgdGhpcy5fdmlzaXQoY29udGFpbmVyRWwpO1xuICAgIH1cbiAgICB0aGlzLm91dHB1dCA9IHRoaXMub3V0cHV0LnRyaW0oKSArICdcXG4nO1xuICAgIGlmICh0aGlzLmNvbmZpZy5jcmVhdGVDbGFzcykge1xuICAgICAgdGhpcy5vdXRwdXQgKz0gdGhpcy5jb25maWcuaW5kZW50ICsgdGhpcy5jb25maWcuaW5kZW50ICsgJyk7XFxuJztcbiAgICAgIHRoaXMub3V0cHV0ICs9IHRoaXMuY29uZmlnLmluZGVudCArICd9XFxuJztcbiAgICAgIHRoaXMub3V0cHV0ICs9ICd9KTsnO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5vdXRwdXQ7XG4gIH0sXG5cbiAgLyoqXG4gICogQ2xlYW5zIHVwIHRoZSBzcGVjaWZpZWQgSFRNTCBzbyBpdCdzIGluIGEgZm9ybWF0IGFjY2VwdGFibGUgZm9yXG4gICogY29udmVydGluZy5cbiAgKlxuICAqIEBwYXJhbSB7c3RyaW5nfSBodG1sIEhUTUwgdG8gY2xlYW5cbiAgKiBAcmV0dXJuIHtzdHJpbmd9IENsZWFuZWQgSFRNTFxuICAqL1xuICBfY2xlYW5JbnB1dDogZnVuY3Rpb24oaHRtbCkge1xuICAgIC8vIFJlbW92ZSB1bm5lY2Vzc2FyeSB3aGl0ZXNwYWNlXG4gICAgaHRtbCA9IGh0bWwudHJpbSgpO1xuICAgIC8vIFVnbHkgbWV0aG9kIHRvIHN0cmlwIHNjcmlwdCB0YWdzLiBUaGV5IGNhbiB3cmVhayBoYXZvYyBvbiB0aGUgRE9NIG5vZGVzXG4gICAgLy8gc28gbGV0J3Mgbm90IGV2ZW4gcHV0IHRoZW0gaW4gdGhlIERPTS5cbiAgICBodG1sID0gaHRtbC5yZXBsYWNlKC88c2NyaXB0KFtcXHNcXFNdKj8pPFxcL3NjcmlwdD4vZywgJycpO1xuICAgIHJldHVybiBodG1sO1xuICB9LFxuXG4gIC8qKlxuICAqIERldGVybWluZXMgaWYgdGhlcmUncyBvbmx5IG9uZSB0b3AtbGV2ZWwgbm9kZSBpbiB0aGUgRE9NIHRyZWUuIFRoYXQgaXMsXG4gICogYWxsIHRoZSBIVE1MIGlzIHdyYXBwZWQgYnkgYSBzaW5nbGUgSFRNTCB0YWcuXG4gICpcbiAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IGNvbnRhaW5lckVsIENvbnRhaW5lciBlbGVtZW50XG4gICogQHJldHVybiB7Ym9vbGVhbn1cbiAgKi9cbiAgX29ubHlPbmVUb3BMZXZlbDogZnVuY3Rpb24oY29udGFpbmVyRWwpIHtcbiAgICAvLyBPbmx5IGEgc2luZ2xlIGNoaWxkIGVsZW1lbnRcbiAgICBpZiAoXG4gICAgICBjb250YWluZXJFbC5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMVxuICAgICAgJiYgY29udGFpbmVyRWwuY2hpbGROb2Rlc1swXS5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLkVMRU1FTlRcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBPbmx5IG9uZSBlbGVtZW50LCBhbmQgYWxsIG90aGVyIGNoaWxkcmVuIGFyZSB3aGl0ZXNwYWNlXG4gICAgdmFyIGZvdW5kRWxlbWVudCA9IGZhbHNlO1xuICAgIGZvciAodmFyIGkgPSAwLCBjb3VudCA9IGNvbnRhaW5lckVsLmNoaWxkTm9kZXMubGVuZ3RoOyBpIDwgY291bnQ7IGkrKykge1xuICAgICAgdmFyIGNoaWxkID0gY29udGFpbmVyRWwuY2hpbGROb2Rlc1tpXTtcbiAgICAgIGlmIChjaGlsZC5ub2RlVHlwZSA9PT0gTk9ERV9UWVBFLkVMRU1FTlQpIHtcbiAgICAgICAgaWYgKGZvdW5kRWxlbWVudCkge1xuICAgICAgICAgIC8vIEVuY291bnRlcmVkIGFuIGVsZW1lbnQgYWZ0ZXIgYWxyZWFkeSBlbmNvdW50ZXJpbmcgYW5vdGhlciBvbmVcbiAgICAgICAgICAvLyBUaGVyZWZvcmUsIG1vcmUgdGhhbiBvbmUgZWxlbWVudCBhdCByb290IGxldmVsXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGZvdW5kRWxlbWVudCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoY2hpbGQubm9kZVR5cGUgPT09IE5PREVfVFlQRS5URVhUICYmICFpc0VtcHR5KGNoaWxkLnRleHRDb250ZW50KSkge1xuICAgICAgICAvLyBDb250YWlucyB0ZXh0IGNvbnRlbnRcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSxcblxuICAvKipcbiAgKiBHZXRzIGEgbmV3bGluZSBmb2xsb3dlZCBieSB0aGUgY29ycmVjdCBpbmRlbnRhdGlvbiBmb3IgdGhlIGN1cnJlbnRcbiAgKiBuZXN0aW5nIGxldmVsXG4gICpcbiAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICovXG4gIF9nZXRJbmRlbnRlZE5ld2xpbmU6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiAnXFxuJyArIHJlcGVhdFN0cmluZyh0aGlzLmNvbmZpZy5pbmRlbnQsIHRoaXMubGV2ZWwgKyAyKTtcbiAgfSxcblxuICAvKipcbiAgKiBIYW5kbGVzIHByb2Nlc3NpbmcgdGhlIHNwZWNpZmllZCBub2RlXG4gICpcbiAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgKi9cbiAgX3Zpc2l0OiBmdW5jdGlvbihub2RlKSB7XG4gICAgdGhpcy5fYmVnaW5WaXNpdChub2RlKTtcbiAgICB0aGlzLl90cmF2ZXJzZShub2RlKTtcbiAgICB0aGlzLl9lbmRWaXNpdChub2RlKTtcbiAgfSxcblxuICAvKipcbiAgKiBUcmF2ZXJzZXMgYWxsIHRoZSBjaGlsZHJlbiBvZiB0aGUgc3BlY2lmaWVkIG5vZGVcbiAgKlxuICAqIEBwYXJhbSB7Tm9kZX0gbm9kZVxuICAqL1xuICBfdHJhdmVyc2U6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB0aGlzLmxldmVsKys7XG4gICAgZm9yICh2YXIgaSA9IDAsIGNvdW50ID0gbm9kZS5jaGlsZE5vZGVzLmxlbmd0aDsgaSA8IGNvdW50OyBpKyspIHtcbiAgICAgIHRoaXMuX3Zpc2l0KG5vZGUuY2hpbGROb2Rlc1tpXSk7XG4gICAgfVxuICAgIHRoaXMubGV2ZWwtLTtcbiAgfSxcblxuICAvKipcbiAgKiBIYW5kbGUgcHJlLXZpc2l0IGJlaGF2aW91ciBmb3IgdGhlIHNwZWNpZmllZCBub2RlLlxuICAqXG4gICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICovXG4gIF9iZWdpblZpc2l0OiBmdW5jdGlvbihub2RlKSB7XG4gICAgc3dpdGNoIChub2RlLm5vZGVUeXBlKSB7XG4gICAgICBjYXNlIE5PREVfVFlQRS5FTEVNRU5UOlxuICAgICAgICB0aGlzLl9iZWdpblZpc2l0RWxlbWVudChub2RlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgTk9ERV9UWVBFLlRFWFQ6XG4gICAgICAgIHRoaXMuX3Zpc2l0VGV4dChub2RlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgTk9ERV9UWVBFLkNPTU1FTlQ6XG4gICAgICAgIHRoaXMuX3Zpc2l0Q29tbWVudChub2RlKTtcbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJ1VucmVjb2duaXNlZCBub2RlIHR5cGU6ICcgKyBub2RlLm5vZGVUeXBlKTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICogSGFuZGxlcyBwb3N0LXZpc2l0IGJlaGF2aW91ciBmb3IgdGhlIHNwZWNpZmllZCBub2RlLlxuICAqXG4gICogQHBhcmFtIHtOb2RlfSBub2RlXG4gICovXG4gIF9lbmRWaXNpdDogZnVuY3Rpb24obm9kZSkge1xuICAgIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgICAgY2FzZSBOT0RFX1RZUEUuRUxFTUVOVDpcbiAgICAgICAgdGhpcy5fZW5kVmlzaXRFbGVtZW50KG5vZGUpO1xuICAgICAgICBicmVhaztcbiAgICAgICAgLy8gTm8gZW5kaW5nIHRhZ3MgcmVxdWlyZWQgZm9yIHRoZXNlIHR5cGVzXG4gICAgICAgIGNhc2UgTk9ERV9UWVBFLlRFWFQ6XG4gICAgICAgIGNhc2UgTk9ERV9UWVBFLkNPTU1FTlQ6XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgKiBIYW5kbGVzIHByZS12aXNpdCBiZWhhdmlvdXIgZm9yIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBub2RlXG4gICpcbiAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IG5vZGVcbiAgKi9cbiAgX2JlZ2luVmlzaXRFbGVtZW50OiBmdW5jdGlvbihub2RlKSB7XG4gICAgdmFyIHRhZ05hbWUgPSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICB2YXIgYXR0cmlidXRlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBjb3VudCA9IG5vZGUuYXR0cmlidXRlcy5sZW5ndGg7IGkgPCBjb3VudDsgaSsrKSB7XG4gICAgICBhdHRyaWJ1dGVzLnB1c2godGhpcy5fZ2V0RWxlbWVudEF0dHJpYnV0ZShub2RlLCBub2RlLmF0dHJpYnV0ZXNbaV0pKTtcbiAgICB9XG5cbiAgICB0aGlzLm91dHB1dCArPSAnPCcgKyB0YWdOYW1lO1xuICAgIGlmIChhdHRyaWJ1dGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMub3V0cHV0ICs9ICcgJyArIGF0dHJpYnV0ZXMuam9pbignICcpO1xuICAgIH1cbiAgICBpZiAobm9kZS5maXJzdENoaWxkKSB7XG4gICAgICB0aGlzLm91dHB1dCArPSAnPic7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAqIEhhbmRsZXMgcG9zdC12aXNpdCBiZWhhdmlvdXIgZm9yIHRoZSBzcGVjaWZpZWQgZWxlbWVudCBub2RlXG4gICpcbiAgKiBAcGFyYW0ge05vZGV9IG5vZGVcbiAgKi9cbiAgX2VuZFZpc2l0RWxlbWVudDogZnVuY3Rpb24obm9kZSkge1xuICAgIC8vIERlLWluZGVudCBhIGJpdFxuICAgIC8vIFRPRE86IEl0J3MgaW5lZmZpY2llbnQgdG8gZG8gaXQgdGhpcyB3YXkgOi9cbiAgICB0aGlzLm91dHB1dCA9IHRyaW1FbmQodGhpcy5vdXRwdXQsIHRoaXMuY29uZmlnLmluZGVudCk7XG4gICAgaWYgKG5vZGUuZmlyc3RDaGlsZCkge1xuICAgICAgdGhpcy5vdXRwdXQgKz0gJzwvJyArIG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpICsgJz4nO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm91dHB1dCArPSAnIC8+JztcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICogSGFuZGxlcyBwcm9jZXNzaW5nIG9mIHRoZSBzcGVjaWZpZWQgdGV4dCBub2RlXG4gICpcbiAgKiBAcGFyYW0ge1RleHROb2RlfSBub2RlXG4gICovXG4gIF92aXNpdFRleHQ6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICB2YXIgdGV4dCA9IG5vZGUudGV4dENvbnRlbnQ7XG4gICAgLy8gSWYgdGhlcmUncyBhIG5ld2xpbmUgaW4gdGhlIHRleHQsIGFkanVzdCB0aGUgaW5kZW50IGxldmVsXG4gICAgaWYgKHRleHQuaW5kZXhPZignXFxuJykgPiAtMSkge1xuICAgICAgdGV4dCA9IG5vZGUudGV4dENvbnRlbnQucmVwbGFjZSgvXFxuXFxzKi9nLCB0aGlzLl9nZXRJbmRlbnRlZE5ld2xpbmUoKSk7XG4gICAgfVxuICAgIHRoaXMub3V0cHV0ICs9IGVzY2FwZVNwZWNpYWxDaGFycyh0ZXh0KTtcbiAgfSxcblxuICAvKipcbiAgKiBIYW5kbGVzIHByb2Nlc3Npbmcgb2YgdGhlIHNwZWNpZmllZCB0ZXh0IG5vZGVcbiAgKlxuICAqIEBwYXJhbSB7VGV4dH0gbm9kZVxuICAqL1xuICBfdmlzaXRDb21tZW50OiBmdW5jdGlvbihub2RlKSB7XG4gICAgLy8gRG8gbm90IHJlbmRlciB0aGUgY29tbWVudFxuICAgIC8vIFNpbmNlIHdlIHJlbW92ZSBjb21tZW50cywgd2UgYWxzbyBuZWVkIHRvIHJlbW92ZSB0aGUgbmV4dCBsaW5lIGJyZWFrIHNvIHdlXG4gICAgLy8gZG9uJ3QgZW5kIHVwIHdpdGggZXh0cmEgd2hpdGVzcGFjZSBhZnRlciBldmVyeSBjb21tZW50XG4gICAgLy9pZiAobm9kZS5uZXh0U2libGluZyAmJiBub2RlLm5leHRTaWJsaW5nLm5vZGVUeXBlID09PSBOT0RFX1RZUEUuVEVYVCkge1xuICAgIC8vICBub2RlLm5leHRTaWJsaW5nLnRleHRDb250ZW50ID0gbm9kZS5uZXh0U2libGluZy50ZXh0Q29udGVudC5yZXBsYWNlKC9cXG5cXHMqLywgJycpO1xuICAgIC8vfVxuICAgIHRoaXMub3V0cHV0ICs9ICd7LyonICsgbm9kZS50ZXh0Q29udGVudC5yZXBsYWNlKCcqLycsICcqIC8nKSArICcqL30nO1xuICB9LFxuXG4gIC8qKlxuICAqIEdldHMgYSBKU1ggZm9ybWF0dGVkIHZlcnNpb24gb2YgdGhlIHNwZWNpZmllZCBhdHRyaWJ1dGUgZnJvbSB0aGUgbm9kZVxuICAqXG4gICogQHBhcmFtIHtET01FbGVtZW50fSBub2RlXG4gICogQHBhcmFtIHtvYmplY3R9ICAgICBhdHRyaWJ1dGVcbiAgKiBAcmV0dXJuIHtzdHJpbmd9XG4gICovXG4gIF9nZXRFbGVtZW50QXR0cmlidXRlOiBmdW5jdGlvbihub2RlLCBhdHRyaWJ1dGUpIHtcbiAgICBzd2l0Y2ggKGF0dHJpYnV0ZS5uYW1lKSB7XG4gICAgICBjYXNlICdzdHlsZSc6XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRTdHlsZUF0dHJpYnV0ZShhdHRyaWJ1dGUudmFsdWUpO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdmFyIHRhZ05hbWUgPSBub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKTtcbiAgICAgICAgdmFyIG5hbWUgPVxuICAgICAgICAoRUxFTUVOVF9BVFRSSUJVVEVfTUFQUElOR1t0YWdOYW1lXSAmJlxuICAgICAgICAgIEVMRU1FTlRfQVRUUklCVVRFX01BUFBJTkdbdGFnTmFtZV1bYXR0cmlidXRlLm5hbWVdKSB8fFxuICAgICAgICAgIEFUVFJJQlVURV9NQVBQSU5HW2F0dHJpYnV0ZS5uYW1lXSB8fFxuICAgICAgICBhdHRyaWJ1dGUubmFtZTtcbiAgICAgICAgdmFyIHJlc3VsdCA9IG5hbWU7XG5cbiAgICAgICAgLy8gTnVtZXJpYyB2YWx1ZXMgc2hvdWxkIGJlIG91dHB1dCBhcyB7MTIzfSBub3QgXCIxMjNcIlxuICAgICAgICBpZiAoaXNOdW1lcmljKGF0dHJpYnV0ZS52YWx1ZSkpIHtcbiAgICAgICAgICByZXN1bHQgKz0gJz17JyArIGF0dHJpYnV0ZS52YWx1ZSArICd9JztcbiAgICAgICAgfSBlbHNlIGlmIChhdHRyaWJ1dGUudmFsdWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHJlc3VsdCArPSAnPVwiJyArIGF0dHJpYnV0ZS52YWx1ZS5yZXBsYWNlKCdcIicsICcmcXVvdDsnKSArICdcIic7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICogR2V0cyBhIEpTWCBmb3JtYXR0ZWQgdmVyc2lvbiBvZiB0aGUgc3BlY2lmaWVkIGVsZW1lbnQgc3R5bGVzXG4gICpcbiAgKiBAcGFyYW0ge3N0cmluZ30gc3R5bGVzXG4gICogQHJldHVybiB7c3RyaW5nfVxuICAqL1xuICBfZ2V0U3R5bGVBdHRyaWJ1dGU6IGZ1bmN0aW9uKHN0eWxlcykge1xuICAgIHZhciBqc3hTdHlsZXMgPSBuZXcgU3R5bGVQYXJzZXIoc3R5bGVzKS50b0pTWFN0cmluZygpO1xuICAgIHJldHVybiAnc3R5bGU9e3snICsganN4U3R5bGVzICsgJ319JztcbiAgfVxufTtcblxuLyoqXG4qIEhhbmRsZXMgcGFyc2luZyBvZiBpbmxpbmUgc3R5bGVzXG4qXG4qIEBwYXJhbSB7c3RyaW5nfSByYXdTdHlsZSBSYXcgc3R5bGUgYXR0cmlidXRlXG4qIEBjb25zdHJ1Y3RvclxuKi9cbnZhciBTdHlsZVBhcnNlciA9IGZ1bmN0aW9uKHJhd1N0eWxlKSB7XG4gIHRoaXMucGFyc2UocmF3U3R5bGUpO1xufTtcblN0eWxlUGFyc2VyLnByb3RvdHlwZSA9IHtcbiAgLyoqXG4gICogUGFyc2UgdGhlIHNwZWNpZmllZCBpbmxpbmUgc3R5bGUgYXR0cmlidXRlIHZhbHVlXG4gICogQHBhcmFtIHtzdHJpbmd9IHJhd1N0eWxlIFJhdyBzdHlsZSBhdHRyaWJ1dGVcbiAgKi9cbiAgcGFyc2U6IGZ1bmN0aW9uKHJhd1N0eWxlKSB7XG4gICAgdGhpcy5zdHlsZXMgPSB7fTtcbiAgICByYXdTdHlsZS5zcGxpdCgnOycpLmZvckVhY2goZnVuY3Rpb24oc3R5bGUpIHtcbiAgICAgIHN0eWxlID0gc3R5bGUudHJpbSgpO1xuICAgICAgdmFyIGZpcnN0Q29sb24gPSBzdHlsZS5pbmRleE9mKCc6Jyk7XG4gICAgICB2YXIga2V5ID0gc3R5bGUuc3Vic3RyKDAsIGZpcnN0Q29sb24pO1xuICAgICAgdmFyIHZhbHVlID0gc3R5bGUuc3Vic3RyKGZpcnN0Q29sb24gKyAxKS50cmltKCk7XG4gICAgICBpZiAoa2V5ICE9PSAnJykge1xuICAgICAgICB0aGlzLnN0eWxlc1trZXldID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSwgdGhpcyk7XG4gIH0sXG5cbiAgLyoqXG4gICogQ29udmVydCB0aGUgc3R5bGUgaW5mb3JtYXRpb24gcmVwcmVzZW50ZWQgYnkgdGhpcyBwYXJzZXIgaW50byBhIEpTWFxuICAqIHN0cmluZ1xuICAqXG4gICogQHJldHVybiB7c3RyaW5nfVxuICAqL1xuICB0b0pTWFN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgdmFyIG91dHB1dCA9IFtdO1xuICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnN0eWxlcykge1xuICAgICAgaWYgKCF0aGlzLnN0eWxlcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgb3V0cHV0LnB1c2godGhpcy50b0pTWEtleShrZXkpICsgJzogJyArIHRoaXMudG9KU1hWYWx1ZSh0aGlzLnN0eWxlc1trZXldKSk7XG4gICAgfVxuICAgIHJldHVybiBvdXRwdXQuam9pbignLCAnKTtcbiAgfSxcblxuICAvKipcbiAgKiBDb252ZXJ0IHRoZSBDU1Mgc3R5bGUga2V5IHRvIGEgSlNYIHN0eWxlIGtleVxuICAqXG4gICogQHBhcmFtIHtzdHJpbmd9IGtleSBDU1Mgc3R5bGUga2V5XG4gICogQHJldHVybiB7c3RyaW5nfSBKU1ggc3R5bGUga2V5XG4gICovXG4gIHRvSlNYS2V5OiBmdW5jdGlvbihrZXkpIHtcbiAgICByZXR1cm4gaHlwaGVuVG9DYW1lbENhc2Uoa2V5KTtcbiAgfSxcblxuICAvKipcbiAgKiBDb252ZXJ0IHRoZSBDU1Mgc3R5bGUgdmFsdWUgdG8gYSBKU1ggc3R5bGUgdmFsdWVcbiAgKlxuICAqIEBwYXJhbSB7c3RyaW5nfSB2YWx1ZSBDU1Mgc3R5bGUgdmFsdWVcbiAgKiBAcmV0dXJuIHtzdHJpbmd9IEpTWCBzdHlsZSB2YWx1ZVxuICAqL1xuICB0b0pTWFZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgIGlmIChpc051bWVyaWModmFsdWUpKSB7XG4gICAgICAvLyBJZiBudW1lcmljLCBubyBxdW90ZXNcbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9IGVsc2UgaWYgKGlzQ29udmVydGlibGVQaXhlbFZhbHVlKHZhbHVlKSkge1xuICAgICAgLy8gXCI1MDBweFwiIC0+IDUwMFxuICAgICAgcmV0dXJuIHRyaW1FbmQodmFsdWUsICdweCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBQcm9iYWJseSBhIHN0cmluZywgd3JhcCBpdCBpbiBxdW90ZXNcbiAgICAgIHJldHVybiAnXFwnJyArIHZhbHVlLnJlcGxhY2UoLycvZywgJ1wiJykgKyAnXFwnJztcbiAgICB9XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gSFRNTHRvSlNYO1xuIl19