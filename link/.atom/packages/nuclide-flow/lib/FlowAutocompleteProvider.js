var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

var _nuclideAnalytics = require('nuclide-analytics');

'use babel';

var FlowAutocompleteProvider = (function () {
  function FlowAutocompleteProvider() {
    _classCallCheck(this, FlowAutocompleteProvider);
  }

  _createDecoratedClass(FlowAutocompleteProvider, [{
    key: 'getSuggestions',
    decorators: [(0, _nuclideAnalytics.trackTiming)('flow.autocomplete')],
    value: function getSuggestions(request) {
      var editor = request.editor;
      var prefix = request.prefix;
      var activatedManually = request.activatedManually;

      var file = editor.getPath();
      var contents = editor.getText();
      var cursor = editor.getLastCursor();
      var line = cursor.getBufferRow();
      var col = cursor.getBufferColumn();

      var flowService = require('nuclide-client').getServiceByNuclideUri('FlowService', file);
      (0, _assert2['default'])(flowService);
      return flowService.flowGetAutocompleteSuggestions(file, contents, line, col, prefix,
      // Needs to be a boolean, but autocomplete-plus gives us undefined instead of false.
      !!activatedManually);
    }
  }]);

  return FlowAutocompleteProvider;
})();

module.exports = FlowAutocompleteProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWZsb3cvbGliL0Zsb3dBdXRvY29tcGxldGVQcm92aWRlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztzQkFXc0IsUUFBUTs7OztnQ0FFSixtQkFBbUI7O0FBYjdDLFdBQVcsQ0FBQzs7SUFlTix3QkFBd0I7V0FBeEIsd0JBQXdCOzBCQUF4Qix3QkFBd0I7Ozt3QkFBeEIsd0JBQXdCOztpQkFDM0Isc0JBSEssV0FBVyxFQUdKLG1CQUFtQixDQUFDO1dBQ25CLHdCQUFDLE9BQWlDLEVBQWdEO1VBQ3ZGLE1BQU0sR0FBK0IsT0FBTyxDQUE1QyxNQUFNO1VBQUUsTUFBTSxHQUF1QixPQUFPLENBQXBDLE1BQU07VUFBRSxpQkFBaUIsR0FBSSxPQUFPLENBQTVCLGlCQUFpQjs7QUFDeEMsVUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDO0FBQzlCLFVBQU0sUUFBUSxHQUFHLE1BQU0sQ0FBQyxPQUFPLEVBQUUsQ0FBQztBQUNsQyxVQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDdEMsVUFBTSxJQUFJLEdBQUcsTUFBTSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQ25DLFVBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxlQUFlLEVBQUUsQ0FBQzs7QUFFckMsVUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixDQUFDLENBQUMsc0JBQXNCLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzFGLCtCQUFVLFdBQVcsQ0FBQyxDQUFDO0FBQ3ZCLGFBQU8sV0FBVyxDQUFDLDhCQUE4QixDQUMvQyxJQUFJLEVBQ0osUUFBUSxFQUNSLElBQUksRUFDSixHQUFHLEVBQ0gsTUFBTTs7QUFFTixPQUFDLENBQUMsaUJBQWlCLENBQ3BCLENBQUM7S0FDSDs7O1NBckJHLHdCQUF3Qjs7O0FBd0I5QixNQUFNLENBQUMsT0FBTyxHQUFHLHdCQUF3QixDQUFDIiwiZmlsZSI6Ii92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWZsb3cvbGliL0Zsb3dBdXRvY29tcGxldGVQcm92aWRlci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuLyogQGZsb3cgKi9cblxuLypcbiAqIENvcHlyaWdodCAoYykgMjAxNS1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBsaWNlbnNlIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgaW5cbiAqIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLlxuICovXG5cbmltcG9ydCBpbnZhcmlhbnQgZnJvbSAnYXNzZXJ0JztcblxuaW1wb3J0IHt0cmFja1RpbWluZ30gZnJvbSAnbnVjbGlkZS1hbmFseXRpY3MnO1xuXG5jbGFzcyBGbG93QXV0b2NvbXBsZXRlUHJvdmlkZXIge1xuICBAdHJhY2tUaW1pbmcoJ2Zsb3cuYXV0b2NvbXBsZXRlJylcbiAgZ2V0U3VnZ2VzdGlvbnMocmVxdWVzdDogYXRvbSRBdXRvY29tcGxldGVSZXF1ZXN0KTogUHJvbWlzZTw/QXJyYXk8YXRvbSRBdXRvY29tcGxldGVTdWdnZXN0aW9uPj4ge1xuICAgIGNvbnN0IHtlZGl0b3IsIHByZWZpeCwgYWN0aXZhdGVkTWFudWFsbHl9ID0gcmVxdWVzdDtcbiAgICBjb25zdCBmaWxlID0gZWRpdG9yLmdldFBhdGgoKTtcbiAgICBjb25zdCBjb250ZW50cyA9IGVkaXRvci5nZXRUZXh0KCk7XG4gICAgY29uc3QgY3Vyc29yID0gZWRpdG9yLmdldExhc3RDdXJzb3IoKTtcbiAgICBjb25zdCBsaW5lID0gY3Vyc29yLmdldEJ1ZmZlclJvdygpO1xuICAgIGNvbnN0IGNvbCA9IGN1cnNvci5nZXRCdWZmZXJDb2x1bW4oKTtcblxuICAgIGNvbnN0IGZsb3dTZXJ2aWNlID0gcmVxdWlyZSgnbnVjbGlkZS1jbGllbnQnKS5nZXRTZXJ2aWNlQnlOdWNsaWRlVXJpKCdGbG93U2VydmljZScsIGZpbGUpO1xuICAgIGludmFyaWFudChmbG93U2VydmljZSk7XG4gICAgcmV0dXJuIGZsb3dTZXJ2aWNlLmZsb3dHZXRBdXRvY29tcGxldGVTdWdnZXN0aW9ucyhcbiAgICAgIGZpbGUsXG4gICAgICBjb250ZW50cyxcbiAgICAgIGxpbmUsXG4gICAgICBjb2wsXG4gICAgICBwcmVmaXgsXG4gICAgICAvLyBOZWVkcyB0byBiZSBhIGJvb2xlYW4sIGJ1dCBhdXRvY29tcGxldGUtcGx1cyBnaXZlcyB1cyB1bmRlZmluZWQgaW5zdGVhZCBvZiBmYWxzZS5cbiAgICAgICEhYWN0aXZhdGVkTWFudWFsbHksXG4gICAgKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEZsb3dBdXRvY29tcGxldGVQcm92aWRlcjtcbiJdfQ==
