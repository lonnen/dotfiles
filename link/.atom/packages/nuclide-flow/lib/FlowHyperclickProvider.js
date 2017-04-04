var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

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

var _nuclideClient = require('nuclide-client');

var _nuclideAtomHelpers = require('nuclide-atom-helpers');

var _constantsJs = require('./constants.js');

'use babel';

var JS_GRAMMARS_SET = new Set(_constantsJs.JS_GRAMMARS);

var FlowHyperclickProvider = (function () {
  function FlowHyperclickProvider() {
    _classCallCheck(this, FlowHyperclickProvider);
  }

  _createClass(FlowHyperclickProvider, [{
    key: 'getSuggestionForWord',
    value: _asyncToGenerator(function* (textEditor, text, range) {
      if (!JS_GRAMMARS_SET.has(textEditor.getGrammar().scopeName)) {
        return null;
      }

      var file = textEditor.getPath();
      var position = range.start;

      var flowService = (0, _nuclideClient.getServiceByNuclideUri)('FlowService', file);
      (0, _assert2['default'])(flowService);
      var location = yield flowService.flowFindDefinition(file, textEditor.getText(), position.row + 1, position.column + 1);
      if (location) {
        return {
          range: range,
          callback: function callback() {
            (0, _nuclideAtomHelpers.goToLocation)(location.file, location.line, location.column);
          }
        };
      } else {
        return null;
      }
    })
  }]);

  return FlowHyperclickProvider;
})();

module.exports = FlowHyperclickProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWZsb3cvbGliL0Zsb3dIeXBlcmNsaWNrUHJvdmlkZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7OztzQkFXc0IsUUFBUTs7Ozs2QkFFTyxnQkFBZ0I7O2tDQUMxQixzQkFBc0I7OzJCQUV2QixnQkFBZ0I7O0FBaEIxQyxXQUFXLENBQUM7O0FBaUJaLElBQU0sZUFBZSxHQUFHLElBQUksR0FBRyxjQUR2QixXQUFXLENBQ3lCLENBQUM7O0lBRXZDLHNCQUFzQjtXQUF0QixzQkFBc0I7MEJBQXRCLHNCQUFzQjs7O2VBQXRCLHNCQUFzQjs7NkJBQ0EsV0FBQyxVQUFzQixFQUFFLElBQVksRUFBRSxLQUFpQixFQUMvQztBQUNqQyxVQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLENBQUMsU0FBUyxDQUFDLEVBQUU7QUFDM0QsZUFBTyxJQUFJLENBQUM7T0FDYjs7QUFFRCxVQUFNLElBQUksR0FBRyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7VUFDcEIsUUFBUSxHQUFJLEtBQUssQ0FBeEIsS0FBSzs7QUFDWixVQUFNLFdBQVcsR0FBRyxtQkFmaEIsc0JBQXNCLEVBZWlCLGFBQWEsRUFBRSxJQUFJLENBQUMsQ0FBQztBQUNoRSwrQkFBVSxXQUFXLENBQUMsQ0FBQztBQUN2QixVQUFNLFFBQVEsR0FBRyxNQUFNLFdBQVcsQ0FDN0Isa0JBQWtCLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQyxPQUFPLEVBQUUsRUFBRSxRQUFRLENBQUMsR0FBRyxHQUFHLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQzNGLFVBQUksUUFBUSxFQUFFO0FBQ1osZUFBTztBQUNMLGVBQUssRUFBTCxLQUFLO0FBQ0wsa0JBQVEsRUFBQSxvQkFBRztBQUNULG9DQXRCRixZQUFZLEVBc0JHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7V0FDN0Q7U0FDRixDQUFDO09BQ0gsTUFBTTtBQUNMLGVBQU8sSUFBSSxDQUFDO09BQ2I7S0FDRjs7O1NBdkJHLHNCQUFzQjs7O0FBMEI1QixNQUFNLENBQUMsT0FBTyxHQUFHLHNCQUFzQixDQUFDIiwiZmlsZSI6Ii92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWZsb3cvbGliL0Zsb3dIeXBlcmNsaWNrUHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgaW52YXJpYW50IGZyb20gJ2Fzc2VydCc7XG5cbmltcG9ydCB7Z2V0U2VydmljZUJ5TnVjbGlkZVVyaX0gZnJvbSAnbnVjbGlkZS1jbGllbnQnO1xuaW1wb3J0IHtnb1RvTG9jYXRpb259IGZyb20gJ251Y2xpZGUtYXRvbS1oZWxwZXJzJztcblxuaW1wb3J0IHtKU19HUkFNTUFSU30gZnJvbSAnLi9jb25zdGFudHMuanMnO1xuY29uc3QgSlNfR1JBTU1BUlNfU0VUID0gbmV3IFNldChKU19HUkFNTUFSUyk7XG5cbmNsYXNzIEZsb3dIeXBlcmNsaWNrUHJvdmlkZXIge1xuICBhc3luYyBnZXRTdWdnZXN0aW9uRm9yV29yZCh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yLCB0ZXh0OiBzdHJpbmcsIHJhbmdlOiBhdG9tJFJhbmdlKTpcbiAgICAgIFByb21pc2U8P0h5cGVyY2xpY2tTdWdnZXN0aW9uPiB7XG4gICAgaWYgKCFKU19HUkFNTUFSU19TRVQuaGFzKHRleHRFZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGZpbGUgPSB0ZXh0RWRpdG9yLmdldFBhdGgoKTtcbiAgICBjb25zdCB7c3RhcnQ6IHBvc2l0aW9ufSA9IHJhbmdlO1xuICAgIGNvbnN0IGZsb3dTZXJ2aWNlID0gZ2V0U2VydmljZUJ5TnVjbGlkZVVyaSgnRmxvd1NlcnZpY2UnLCBmaWxlKTtcbiAgICBpbnZhcmlhbnQoZmxvd1NlcnZpY2UpO1xuICAgIGNvbnN0IGxvY2F0aW9uID0gYXdhaXQgZmxvd1NlcnZpY2VcbiAgICAgICAgLmZsb3dGaW5kRGVmaW5pdGlvbihmaWxlLCB0ZXh0RWRpdG9yLmdldFRleHQoKSwgcG9zaXRpb24ucm93ICsgMSwgcG9zaXRpb24uY29sdW1uICsgMSk7XG4gICAgaWYgKGxvY2F0aW9uKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICByYW5nZSxcbiAgICAgICAgY2FsbGJhY2soKSB7XG4gICAgICAgICAgZ29Ub0xvY2F0aW9uKGxvY2F0aW9uLmZpbGUsIGxvY2F0aW9uLmxpbmUsIGxvY2F0aW9uLmNvbHVtbik7XG4gICAgICAgIH0sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBGbG93SHlwZXJjbGlja1Byb3ZpZGVyO1xuIl19
