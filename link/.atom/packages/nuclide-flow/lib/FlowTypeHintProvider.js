Object.defineProperty(exports, '__esModule', {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

exports.getTypeHintTree = getTypeHintTree;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _constants = require('./constants');

'use babel';

var _require = require('nuclide-atom-helpers');

var extractWordAtPosition = _require.extractWordAtPosition;

var _require2 = require('nuclide-client');

var getServiceByNuclideUri = _require2.getServiceByNuclideUri;

var _require3 = require('atom');

var Range = _require3.Range;

var FlowTypeHintProvider = (function () {
  function FlowTypeHintProvider() {
    _classCallCheck(this, FlowTypeHintProvider);
  }

  // TODO Import from type-hints package once it exposes it.

  _createClass(FlowTypeHintProvider, [{
    key: 'typeHint',
    value: _asyncToGenerator(function* (editor, position) {
      var enabled = atom.config.get('nuclide-flow.enableTypeHints');
      if (!enabled) {
        return null;
      }
      var filePath = editor.getPath();
      var contents = editor.getText();
      var flowService = yield getServiceByNuclideUri('FlowService', filePath);
      (0, _assert2['default'])(flowService);

      var enableStructuredTypeHints = atom.config.get('nuclide-flow.enableStructuredTypeHints');
      var getTypeResult = yield flowService.flowGetType(filePath, contents, position.row, position.column, enableStructuredTypeHints);
      if (getTypeResult == null) {
        return null;
      }
      var type = getTypeResult.type;
      var rawType = getTypeResult.rawType;

      // TODO(nmote) refine this regex to better capture JavaScript expressions.
      // Having this regex be not quite right is just a display issue, though --
      // it only affects the location of the tooltip.
      var word = extractWordAtPosition(editor, position, _constants.JAVASCRIPT_WORD_REGEX);
      var range = undefined;
      if (word) {
        range = word.range;
      } else {
        range = new Range(position, position);
      }
      var result = {
        hint: type,
        range: range
      };
      var hintTree = getTypeHintTree(rawType);
      if (hintTree) {
        return _extends({}, result, {
          hintTree: hintTree
        });
      } else {
        return result;
      }
    })
  }]);

  return FlowTypeHintProvider;
})();

exports.FlowTypeHintProvider = FlowTypeHintProvider;

function getTypeHintTree(typeHint) {
  if (!typeHint) {
    return null;
  }
  try {
    var json = JSON.parse(typeHint);
    return jsonToTree(json);
  } catch (e) {
    var logger = require('nuclide-logging').getLogger();
    logger.error('Problem parsing type hint: ' + e.message);
    // If there is any problem parsing just fall back on the original string
    return null;
  }
}

var OBJECT = 'ObjT';
var NUMBER = 'NumT';
var STRING = 'StrT';
var BOOLEAN = 'BoolT';
var MAYBE = 'MaybeT';
var ANYOBJECT = 'AnyObjT';
var ARRAY = 'ArrT';
var FUNCTION = 'FunT';

function jsonToTree(json) {
  var kind = json['kind'];
  switch (kind) {
    case OBJECT:
      var propTypes = json['type']['propTypes'];
      var children = [];
      for (var prop of propTypes) {
        var propName = prop['name'];
        var _childTree = jsonToTree(prop['type']);
        // Instead of making single child node just for the type name, we'll graft the type onto the
        // end of the property name.
        children.push({
          value: propName + ': ' + _childTree.value,
          children: _childTree.children
        });
      }
      return {
        value: 'Object',
        children: children
      };
    case NUMBER:
      return {
        value: 'number'
      };
    case STRING:
      return {
        value: 'string'
      };
    case BOOLEAN:
      return {
        value: 'boolean'
      };
    case MAYBE:
      var childTree = jsonToTree(json['type']);
      return {
        value: '?' + childTree.value,
        children: childTree.children
      };
    case ANYOBJECT:
      return {
        value: 'Object'
      };
    case ARRAY:
      var elemType = jsonToTree(json['elemType']);
      return {
        value: 'Array<' + elemType.value + '>',
        children: elemType.children
      };
    case FUNCTION:
      var paramNames = json['funType']['paramNames'];
      var paramTypes = json['funType']['paramTypes'];
      (0, _assert2['default'])(Array.isArray(paramNames));
      var parameters = paramNames.map(function (name, i) {
        var type = jsonToTree(paramTypes[i]);
        return {
          value: name + ': ' + type.value,
          children: type.children
        };
      });
      var returnType = jsonToTree(json['funType']['returnType']);
      return {
        value: 'Function',
        children: [{
          value: 'Parameters',
          children: parameters
        }, {
          value: 'Return Type: ' + returnType.value,
          children: returnType.children
        }]
      };
    default:
      throw new Error('Kind ' + kind + ' not supported');
  }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWZsb3cvbGliL0Zsb3dUeXBlSGludFByb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztzQkFXc0IsUUFBUTs7Ozt5QkFNTSxhQUFhOztBQWpCakQsV0FBVyxDQUFDOztlQWFvQixPQUFPLENBQUMsc0JBQXNCLENBQUM7O0lBQXhELHFCQUFxQixZQUFyQixxQkFBcUI7O2dCQUNLLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzs7SUFBbkQsc0JBQXNCLGFBQXRCLHNCQUFzQjs7Z0JBQ2IsT0FBTyxDQUFDLE1BQU0sQ0FBQzs7SUFBeEIsS0FBSyxhQUFMLEtBQUs7O0lBSUMsb0JBQW9CO1dBQXBCLG9CQUFvQjswQkFBcEIsb0JBQW9COzs7OztlQUFwQixvQkFBb0I7OzZCQUNqQixXQUFDLE1BQWtCLEVBQUUsUUFBb0IsRUFBc0I7QUFDM0UsVUFBTSxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsOEJBQThCLENBQUMsQ0FBQztBQUNoRSxVQUFJLENBQUMsT0FBTyxFQUFFO0FBQ1osZUFBTyxJQUFJLENBQUM7T0FDYjtBQUNELFVBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsQyxVQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUM7QUFDbEMsVUFBTSxXQUFXLEdBQUcsTUFBTSxzQkFBc0IsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDMUUsK0JBQVUsV0FBVyxDQUFDLENBQUM7O0FBRXZCLFVBQU0seUJBQXlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsd0NBQXdDLENBQUMsQ0FBQztBQUM1RixVQUFNLGFBQWEsR0FBRyxNQUFNLFdBQVcsQ0FBQyxX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QUMsQ0FBQyxDQUFDO0FBQ3ZDLGVBQU87QUFDTCxlQUFLLEVBQUssSUFBSSxVQUFLLElBQUksQ0FBQyxLQUFLLEFBQUU7QUFDL0Isa0JBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtTQUN4QixDQUFDO09BQ0gsQ0FBQyxDQUFDO0FBQ0gsVUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0FBQzdELGFBQU87QUFDTCxhQUFLLEVBQUUsVUFBVTtBQUNqQixnQkFBUSxFQUFFLENBQ1I7QUFDRSxlQUFLLEVBQUUsWUFBWTtBQUNuQixrQkFBUSxFQUFFLFVBQVU7U0FDckIsRUFDRDtBQUNFLGVBQUssb0JBQWtCLFVBQVUsQ0FBQyxLQUFLLEFBQUU7QUFDekMsa0JBQVEsRUFBRSxVQUFVLENBQUMsUUFBUTtTQUM5QixDQUNGO09BQ0YsQ0FBQztBQUFBLEFBQ0o7QUFDRSxZQUFNLElBQUksS0FBSyxXQUFTLElBQUksb0JBQWlCLENBQUM7QUFBQSxHQUNqRDtDQUNGIiwiZmlsZSI6Ii92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWZsb3cvbGliL0Zsb3dUeXBlSGludFByb3ZpZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBiYWJlbCc7XG4vKiBAZmxvdyAqL1xuXG4vKlxuICogQ29weXJpZ2h0IChjKSAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIGxpY2Vuc2UgZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBpblxuICogdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuXG4gKi9cblxuaW1wb3J0IGludmFyaWFudCBmcm9tICdhc3NlcnQnO1xuXG5jb25zdCB7ZXh0cmFjdFdvcmRBdFBvc2l0aW9ufSA9IHJlcXVpcmUoJ251Y2xpZGUtYXRvbS1oZWxwZXJzJyk7XG5jb25zdCB7Z2V0U2VydmljZUJ5TnVjbGlkZVVyaX0gPSByZXF1aXJlKCdudWNsaWRlLWNsaWVudCcpO1xuY29uc3Qge1JhbmdlfSA9IHJlcXVpcmUoJ2F0b20nKTtcblxuaW1wb3J0IHtKQVZBU0NSSVBUX1dPUkRfUkVHRVh9IGZyb20gJy4vY29uc3RhbnRzJztcblxuZXhwb3J0IGNsYXNzIEZsb3dUeXBlSGludFByb3ZpZGVyIHtcbiAgYXN5bmMgdHlwZUhpbnQoZWRpdG9yOiBUZXh0RWRpdG9yLCBwb3NpdGlvbjogYXRvbSRQb2ludCk6IFByb21pc2U8P1R5cGVIaW50PiB7XG4gICAgY29uc3QgZW5hYmxlZCA9IGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mbG93LmVuYWJsZVR5cGVIaW50cycpO1xuICAgIGlmICghZW5hYmxlZCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnN0IGZpbGVQYXRoID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICBjb25zdCBjb250ZW50cyA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgY29uc3QgZmxvd1NlcnZpY2UgPSBhd2FpdCBnZXRTZXJ2aWNlQnlOdWNsaWRlVXJpKCdGbG93U2VydmljZScsIGZpbGVQYXRoKTtcbiAgICBpbnZhcmlhbnQoZmxvd1NlcnZpY2UpO1xuXG4gICAgY29uc3QgZW5hYmxlU3RydWN0dXJlZFR5cGVIaW50cyA9IGF0b20uY29uZmlnLmdldCgnbnVjbGlkZS1mbG93LmVuYWJsZVN0cnVjdHVyZWRUeXBlSGludHMnKTtcbiAgICBjb25zdCBnZXRUeXBlUmVzdWx0ID0gYXdhaXQgZmxvd1NlcnZpY2UuZmxvd0dldFR5cGUoXG4gICAgICBmaWxlUGF0aCxcbiAgICAgIGNvbnRlbnRzLFxuICAgICAgcG9zaXRpb24ucm93LFxuICAgICAgcG9zaXRpb24uY29sdW1uLFxuICAgICAgZW5hYmxlU3RydWN0dXJlZFR5cGVIaW50cyxcbiAgICApO1xuICAgIGlmIChnZXRUeXBlUmVzdWx0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICBjb25zdCB7dHlwZSwgcmF3VHlwZX0gPSBnZXRUeXBlUmVzdWx0O1xuXG4gICAgLy8gVE9ETyhubW90ZSkgcmVmaW5lIHRoaXMgcmVnZXggdG8gYmV0dGVyIGNhcHR1cmUgSmF2YVNjcmlwdCBleHByZXNzaW9ucy5cbiAgICAvLyBIYXZpbmcgdGhpcyByZWdleCBiZSBub3QgcXVpdGUgcmlnaHQgaXMganVzdCBhIGRpc3BsYXkgaXNzdWUsIHRob3VnaCAtLVxuICAgIC8vIGl0IG9ubHkgYWZmZWN0cyB0aGUgbG9jYXRpb24gb2YgdGhlIHRvb2x0aXAuXG4gICAgY29uc3Qgd29yZCA9IGV4dHJhY3RXb3JkQXRQb3NpdGlvbihlZGl0b3IsIHBvc2l0aW9uLCBKQVZBU0NSSVBUX1dPUkRfUkVHRVgpO1xuICAgIGxldCByYW5nZTtcbiAgICBpZiAod29yZCkge1xuICAgICAgcmFuZ2UgPSB3b3JkLnJhbmdlO1xuICAgIH0gZWxzZSB7XG4gICAgICByYW5nZSA9IG5ldyBSYW5nZShwb3NpdGlvbiwgcG9zaXRpb24pO1xuICAgIH1cbiAgICBjb25zdCByZXN1bHQgPSB7XG4gICAgICBoaW50OiB0eXBlLFxuICAgICAgcmFuZ2UsXG4gICAgfTtcbiAgICBjb25zdCBoaW50VHJlZSA9IGdldFR5cGVIaW50VHJlZShyYXdUeXBlKTtcbiAgICBpZiAoaGludFRyZWUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLnJlc3VsdCxcbiAgICAgICAgaGludFRyZWUsXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgfVxufVxuXG4vLyBUT0RPIEltcG9ydCBmcm9tIHR5cGUtaGludHMgcGFja2FnZSBvbmNlIGl0IGV4cG9zZXMgaXQuXG50eXBlIEhpbnRUcmVlID0ge1xuICB2YWx1ZTogc3RyaW5nO1xuICBjaGlsZHJlbj86IEFycmF5PEhpbnRUcmVlPjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFR5cGVIaW50VHJlZSh0eXBlSGludDogP3N0cmluZyk6ID9IaW50VHJlZSB7XG4gIGlmICghdHlwZUhpbnQpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICB0cnkge1xuICAgIGNvbnN0IGpzb24gPSBKU09OLnBhcnNlKHR5cGVIaW50KTtcbiAgICByZXR1cm4ganNvblRvVHJlZShqc29uKTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNvbnN0IGxvZ2dlciA9IHJlcXVpcmUoJ251Y2xpZGUtbG9nZ2luZycpLmdldExvZ2dlcigpO1xuICAgIGxvZ2dlci5lcnJvcihgUHJvYmxlbSBwYXJzaW5nIHR5cGUgaGludDogJHtlLm1lc3NhZ2V9YCk7XG4gICAgLy8gSWYgdGhlcmUgaXMgYW55IHByb2JsZW0gcGFyc2luZyBqdXN0IGZhbGwgYmFjayBvbiB0aGUgb3JpZ2luYWwgc3RyaW5nXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuY29uc3QgT0JKRUNUID0gJ09ialQnO1xuY29uc3QgTlVNQkVSID0gJ051bVQnO1xuY29uc3QgU1RSSU5HID0gJ1N0clQnO1xuY29uc3QgQk9PTEVBTiA9ICdCb29sVCc7XG5jb25zdCBNQVlCRSA9ICdNYXliZVQnO1xuY29uc3QgQU5ZT0JKRUNUID0gJ0FueU9ialQnO1xuY29uc3QgQVJSQVkgPSAnQXJyVCc7XG5jb25zdCBGVU5DVElPTiA9ICdGdW5UJztcblxuZnVuY3Rpb24ganNvblRvVHJlZShqc29uOiBPYmplY3QpOiBIaW50VHJlZSB7XG4gIGNvbnN0IGtpbmQgPSBqc29uWydraW5kJ107XG4gIHN3aXRjaCAoa2luZCkge1xuICAgIGNhc2UgT0JKRUNUOlxuICAgICAgY29uc3QgcHJvcFR5cGVzID0ganNvblsndHlwZSddWydwcm9wVHlwZXMnXTtcbiAgICAgIGNvbnN0IGNoaWxkcmVuID0gW107XG4gICAgICBmb3IgKGNvbnN0IHByb3Agb2YgcHJvcFR5cGVzKSB7XG4gICAgICAgIGNvbnN0IHByb3BOYW1lID0gcHJvcFsnbmFtZSddO1xuICAgICAgICBjb25zdCBjaGlsZFRyZWUgPSBqc29uVG9UcmVlKHByb3BbJ3R5cGUnXSk7XG4gICAgICAgIC8vIEluc3RlYWQgb2YgbWFraW5nIHNpbmdsZSBjaGlsZCBub2RlIGp1c3QgZm9yIHRoZSB0eXBlIG5hbWUsIHdlJ2xsIGdyYWZ0IHRoZSB0eXBlIG9udG8gdGhlXG4gICAgICAgIC8vIGVuZCBvZiB0aGUgcHJvcGVydHkgbmFtZS5cbiAgICAgICAgY2hpbGRyZW4ucHVzaCh7XG4gICAgICAgICAgdmFsdWU6IGAke3Byb3BOYW1lfTogJHtjaGlsZFRyZWUudmFsdWV9YCxcbiAgICAgICAgICBjaGlsZHJlbjogY2hpbGRUcmVlLmNoaWxkcmVuLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiAnT2JqZWN0JyxcbiAgICAgICAgY2hpbGRyZW4sXG4gICAgICB9O1xuICAgIGNhc2UgTlVNQkVSOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6ICdudW1iZXInLFxuICAgICAgfTtcbiAgICBjYXNlIFNUUklORzpcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiAnc3RyaW5nJyxcbiAgICAgIH07XG4gICAgY2FzZSBCT09MRUFOOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6ICdib29sZWFuJyxcbiAgICAgIH07XG4gICAgY2FzZSBNQVlCRTpcbiAgICAgIGNvbnN0IGNoaWxkVHJlZSA9IGpzb25Ub1RyZWUoanNvblsndHlwZSddKTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIHZhbHVlOiBgPyR7Y2hpbGRUcmVlLnZhbHVlfWAsXG4gICAgICAgIGNoaWxkcmVuOiBjaGlsZFRyZWUuY2hpbGRyZW4sXG4gICAgICB9O1xuICAgIGNhc2UgQU5ZT0JKRUNUOlxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6ICdPYmplY3QnLFxuICAgICAgfTtcbiAgICBjYXNlIEFSUkFZOlxuICAgICAgY29uc3QgZWxlbVR5cGUgPSBqc29uVG9UcmVlKGpzb25bJ2VsZW1UeXBlJ10pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6IGBBcnJheTwke2VsZW1UeXBlLnZhbHVlfT5gLFxuICAgICAgICBjaGlsZHJlbjogZWxlbVR5cGUuY2hpbGRyZW4sXG4gICAgICB9O1xuICAgIGNhc2UgRlVOQ1RJT046XG4gICAgICBjb25zdCBwYXJhbU5hbWVzID0ganNvblsnZnVuVHlwZSddWydwYXJhbU5hbWVzJ107XG4gICAgICBjb25zdCBwYXJhbVR5cGVzID0ganNvblsnZnVuVHlwZSddWydwYXJhbVR5cGVzJ107XG4gICAgICBpbnZhcmlhbnQoQXJyYXkuaXNBcnJheShwYXJhbU5hbWVzKSk7XG4gICAgICBjb25zdCBwYXJhbWV0ZXJzID0gcGFyYW1OYW1lcy5tYXAoKG5hbWUsIGkpID0+IHtcbiAgICAgICAgY29uc3QgdHlwZSA9IGpzb25Ub1RyZWUocGFyYW1UeXBlc1tpXSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgdmFsdWU6IGAke25hbWV9OiAke3R5cGUudmFsdWV9YCxcbiAgICAgICAgICBjaGlsZHJlbjogdHlwZS5jaGlsZHJlbixcbiAgICAgICAgfTtcbiAgICAgIH0pO1xuICAgICAgY29uc3QgcmV0dXJuVHlwZSA9IGpzb25Ub1RyZWUoanNvblsnZnVuVHlwZSddWydyZXR1cm5UeXBlJ10pO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgdmFsdWU6ICdGdW5jdGlvbicsXG4gICAgICAgIGNoaWxkcmVuOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6ICdQYXJhbWV0ZXJzJyxcbiAgICAgICAgICAgIGNoaWxkcmVuOiBwYXJhbWV0ZXJzLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgdmFsdWU6IGBSZXR1cm4gVHlwZTogJHtyZXR1cm5UeXBlLnZhbHVlfWAsXG4gICAgICAgICAgICBjaGlsZHJlbjogcmV0dXJuVHlwZS5jaGlsZHJlbixcbiAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgICAgfTtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBLaW5kICR7a2luZH0gbm90IHN1cHBvcnRlZGApO1xuICB9XG59XG4iXX0=
