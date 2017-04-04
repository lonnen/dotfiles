Object.defineProperty(exports, '__esModule', {
  value: true
});

/*
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createDecoratedClass = (function () { function defineProperties(target, descriptors, initializers) { for (var i = 0; i < descriptors.length; i++) { var descriptor = descriptors[i]; var decorators = descriptor.decorators; var key = descriptor.key; delete descriptor.key; delete descriptor.decorators; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor || descriptor.initializer) descriptor.writable = true; if (decorators) { for (var f = 0; f < decorators.length; f++) { var decorator = decorators[f]; if (typeof decorator === 'function') { descriptor = decorator(target, key, descriptor) || descriptor; } else { throw new TypeError('The decorator for method ' + descriptor.key + ' is of the invalid type ' + typeof decorator); } } if (descriptor.initializer !== undefined) { initializers[key] = descriptor; continue; } } Object.defineProperty(target, key, descriptor); } } return function (Constructor, protoProps, staticProps, protoInitializers, staticInitializers) { if (protoProps) defineProperties(Constructor.prototype, protoProps, protoInitializers); if (staticProps) defineProperties(Constructor, staticProps, staticInitializers); return Constructor; }; })();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _nuclideAnalytics = require('nuclide-analytics');

'use babel';

var _require = require('nuclide-client');

var getServiceByNuclideUri = _require.getServiceByNuclideUri;

var _require2 = require('nuclide-commons');

var promises = _require2.promises;
var array = _require2.array;
var RequestSerializer = promises.RequestSerializer;

var _require3 = require('nuclide-diagnostics-provider-base');

var DiagnosticsProviderBase = _require3.DiagnosticsProviderBase;

var _require4 = require('atom');

var Range = _require4.Range;

var invariant = require('assert');

var _require5 = require('./constants.js');

var JS_GRAMMARS = _require5.JS_GRAMMARS;

/* TODO remove these duplicate definitions once we figure out importing types
 * through symlinks. */

/**
 * Currently, a diagnostic from Flow is an object with a "message" property.
 * Each item in the "message" array is an object with the following fields:
 *     - path (string) File that contains the error.
 *     - descr (string) Description of the error.
 *     - line (number) Start line.
 *     - endline (number) End line.
 *     - start (number) Start column.
 *     - end (number) End column.
 *     - code (number) Presumably an error code.
 * The message array may have more than one item. For example, if there is a
 * type incompatibility error, the first item in the message array blames the
 * usage of the wrong type and the second blames the declaration of the type
 * with which the usage disagrees. Note that these could occur in different
 * files.
 */
function extractRange(message) {
  // It's unclear why the 1-based to 0-based indexing works the way that it
  // does, but this has the desired effect in the UI, in practice.
  return new Range([message['line'] - 1, message['start'] - 1], [message['endline'] - 1, message['end']]);
}

// A trace object is very similar to an error object.
function flowMessageToTrace(message) {
  return {
    type: 'Trace',
    text: message['descr'],
    filePath: message['path'],
    range: extractRange(message)
  };
}

function flowMessageToDiagnosticMessage(flowMessages) {
  var flowMessage = flowMessages[0];

  var diagnosticMessage = {
    scope: 'file',
    providerName: 'Flow',
    type: flowMessage['level'] === 'error' ? 'Error' : 'Warning',
    text: flowMessage['descr'],
    filePath: flowMessage['path'],
    range: extractRange(flowMessage)
  };

  // When the message is an array with multiple elements, the second element
  // onwards comprise the trace for the error.
  if (flowMessages.length > 1) {
    diagnosticMessage.trace = flowMessages.slice(1).map(flowMessageToTrace);
  }

  return diagnosticMessage;
}

var FlowDiagnosticsProvider = (function () {
  function FlowDiagnosticsProvider(shouldRunOnTheFly, busySignalProvider) {
    var _this = this;

    var ProviderBase = arguments.length <= 2 || arguments[2] === undefined ? DiagnosticsProviderBase : arguments[2];

    _classCallCheck(this, FlowDiagnosticsProvider);

    this._busySignalProvider = busySignalProvider;
    var utilsOptions = {
      grammarScopes: new Set(JS_GRAMMARS),
      shouldRunOnTheFly: shouldRunOnTheFly,
      onTextEditorEvent: function onTextEditorEvent(editor) {
        return _this._runDiagnostics(editor);
      },
      onNewUpdateSubscriber: function onNewUpdateSubscriber(callback) {
        return _this._receivedNewUpdateSubscriber(callback);
      }
    };
    this._providerBase = new ProviderBase(utilsOptions);
    this._requestSerializer = new RequestSerializer();
    this._flowRootToFilePaths = new Map();
  }

  _createDecoratedClass(FlowDiagnosticsProvider, [{
    key: '_runDiagnostics',
    value: function _runDiagnostics(textEditor) {
      var _this2 = this;

      this._busySignalProvider.reportBusy('Flow: Waiting for diagnostics', function () {
        return _this2._runDiagnosticsImpl(textEditor);
      });
    }
  }, {
    key: '_runDiagnosticsImpl',
    decorators: [(0, _nuclideAnalytics.trackTiming)('flow.run-diagnostics')],
    value: _asyncToGenerator(function* (textEditor) {
      var file = textEditor.getPath();
      if (!file) {
        return;
      }

      var currentContents = textEditor.isModified() ? textEditor.getText() : null;

      var flowService = getServiceByNuclideUri('FlowService', file);
      invariant(flowService);
      var result = yield this._requestSerializer.run(flowService.flowFindDiagnostics(file, currentContents));
      if (result.status === 'outdated') {
        return;
      }
      var diagnostics = result.result;
      if (!diagnostics) {
        return;
      }
      var flowRoot = diagnostics.flowRoot;
      var messages = diagnostics.messages;

      var pathsToInvalidate = this._getPathsToInvalidate(flowRoot);
      /* TODO Consider optimizing for the common case of only a single flow root
       * by invalidating all instead of enumerating the files. */
      this._providerBase.publishMessageInvalidation({ scope: 'file', filePaths: pathsToInvalidate });

      var pathsForRoot = new Set();
      this._flowRootToFilePaths.set(flowRoot, pathsForRoot);
      for (var message of messages) {
        /* Each message consists of several different components, each with its
         * own text and path. */
        for (var messageComponent of message) {
          pathsForRoot.add(messageComponent.path);
        }
      }

      this._providerBase.publishMessageUpdate(this._processDiagnostics(messages, file));
    })
  }, {
    key: '_getPathsToInvalidate',
    value: function _getPathsToInvalidate(flowRoot) {
      var filePaths = this._flowRootToFilePaths.get(flowRoot);
      if (!filePaths) {
        return [];
      }
      return array.from(filePaths);
    }
  }, {
    key: '_receivedNewUpdateSubscriber',
    value: function _receivedNewUpdateSubscriber(callback) {
      // Every time we get a new subscriber, we need to push results to them. This
      // logic is common to all providers and should be abstracted out (t7813069)
      //
      // Once we provide all diagnostics, instead of just the current file, we can
      // probably remove the activeTextEditor parameter.
      var activeTextEditor = atom.workspace.getActiveTextEditor();
      if (activeTextEditor) {
        var matchesGrammar = JS_GRAMMARS.indexOf(activeTextEditor.getGrammar().scopeName) !== -1;
        if (matchesGrammar) {
          this._runDiagnostics(activeTextEditor);
        }
      }
    }
  }, {
    key: 'setRunOnTheFly',
    value: function setRunOnTheFly(runOnTheFly) {
      this._providerBase.setRunOnTheFly(runOnTheFly);
    }
  }, {
    key: 'onMessageUpdate',
    value: function onMessageUpdate(callback) {
      return this._providerBase.onMessageUpdate(callback);
    }
  }, {
    key: 'onMessageInvalidation',
    value: function onMessageInvalidation(callback) {
      return this._providerBase.onMessageInvalidation(callback);
    }
  }, {
    key: 'dispose',
    value: function dispose() {
      this._providerBase.dispose();
    }
  }, {
    key: '_processDiagnostics',
    value: function _processDiagnostics(diagnostics, currentFile) {

      // convert array messages to Error Objects with Traces
      var fileDiagnostics = diagnostics.map(flowMessageToDiagnosticMessage);

      var filePathToMessages = new Map();

      // This invalidates the errors in the current file. If Flow, when running in this root, has
      // reported errors for this file, this invalidation is not necessary because the path will be
      // explicitly invalidated. However, if Flow has reported an error in this root from another root
      // (as sometimes happens when Flow roots contain symlinks to other Flow roots), and it also does
      // not report that same error when running in this Flow root, then we want the error to
      // disappear when this file is opened.
      //
      // This isn't a perfect solution, since it can still leave diagnostics up in other files, but
      // this is a corner case and doing this is still better than doing nothing.
      //
      // I think that whenever this happens, it's a bug in Flow. It seems strange for Flow to report
      // errors in one place when run from one root, and not report errors in that same place when run
      // from another root. But such is life.
      filePathToMessages.set(currentFile, []);

      for (var diagnostic of fileDiagnostics) {
        var _path = diagnostic['filePath'];
        var diagnosticArray = filePathToMessages.get(_path);
        if (!diagnosticArray) {
          diagnosticArray = [];
          filePathToMessages.set(_path, diagnosticArray);
        }
        diagnosticArray.push(diagnostic);
      }

      return { filePathToMessages: filePathToMessages };
    }
  }, {
    key: 'invalidateProjectPath',
    value: function invalidateProjectPath(projectPath) {
      var pathsToInvalidate = new Set();
      for (var flowRootEntry of this._flowRootToFilePaths) {
        var _flowRootEntry = _slicedToArray(flowRootEntry, 2);

        var _flowRoot = _flowRootEntry[0];
        var filePaths = _flowRootEntry[1];

        if (!_flowRoot.startsWith(projectPath)) {
          continue;
        }
        for (var filePath of filePaths) {
          pathsToInvalidate.add(filePath);
        }
        this._flowRootToFilePaths['delete'](_flowRoot);
      }
      this._providerBase.publishMessageInvalidation({
        scope: 'file',
        filePaths: array.from(pathsToInvalidate)
      });
    }
  }]);

  return FlowDiagnosticsProvider;
})();

module.exports = FlowDiagnosticsProvider;

/** Maps flow root to the set of file paths under that root for which we have
  * ever reported diagnostics. */
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi92YXIvZm9sZGVycy94Zi9yc3BoNF9jNTczMTVyczU3eHhzZHNrcnhudjM2dDAvVC90bXBwZmw1Mm5wdWJsaXNoX3BhY2thZ2VzL2FwbS9udWNsaWRlLWZsb3cvbGliL0Zsb3dEaWFnbm9zdGljc1Byb3ZpZGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2dDQWEwQixtQkFBbUI7O0FBYjdDLFdBQVcsQ0FBQzs7ZUFlcUIsT0FBTyxDQUFDLGdCQUFnQixDQUFDOztJQUFuRCxzQkFBc0IsWUFBdEIsc0JBQXNCOztnQkFDSCxPQUFPLENBQUMsaUJBQWlCLENBQUM7O0lBQTdDLFFBQVEsYUFBUixRQUFRO0lBQUUsS0FBSyxhQUFMLEtBQUs7SUFDZixpQkFBaUIsR0FBSSxRQUFRLENBQTdCLGlCQUFpQjs7Z0JBQ1UsT0FBTyxDQUFDLG1DQUFtQyxDQUFDOztJQUF2RSx1QkFBdUIsYUFBdkIsdUJBQXVCOztnQkFDZCxPQUFPLENBQUMsTUFBTSxDQUFDOztJQUF4QixLQUFLLGFBQUwsS0FBSzs7QUFDWixJQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7O2dCQUVkLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQzs7SUFBeEMsV0FBVyxhQUFYLFdBQVc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9DbEIsU0FBUyxZQUFZLENBQUMsT0FBTyxFQUFFOzs7QUFHN0IsU0FBTyxJQUFJLEtBQUssQ0FDZCxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUMzQyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLEVBQUUsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQ3pDLENBQUM7Q0FDSDs7O0FBR0QsU0FBUyxrQkFBa0IsQ0FBQyxPQUFPLEVBQUU7QUFDbkMsU0FBTztBQUNMLFFBQUksRUFBRSxPQUFPO0FBQ2Is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QWUsRUFBRTtBQUNwQix5QkFBZSxHQUFHLEVBQUUsQ0FBQztBQUNyQiw0QkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1NBQy9DO0FBQ0QsdUJBQWUsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDbEM7O0FBRUQsYUFBTyxFQUFFLGtCQUFrQixFQUFsQixrQkFBa0IsRUFBRSxDQUFDO0tBQy9COzs7V0FFb0IsK0JBQUMsV0FBbUIsRUFBUTtBQUMvQyxVQUFNLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7QUFDcEMsV0FBSyxJQUFNLGFBQWEsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7NENBQ3ZCLGFBQWE7O1lBQXBDLFNBQVE7WUFBRSxTQUFTOztBQUMxQixZQUFJLENBQUMsU0FBUSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRTtBQUNyQyxtQkFBUztTQUNWO0FBQ0QsYUFBSyxJQUFNLFFBQVEsSUFBSSxTQUFTLEVBQUU7QUFDaEMsMkJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ2pDO0FBQ0QsWUFBSSxDQUFDLG9CQUFvQixVQUFPLENBQUMsU0FBUSxDQUFDLENBQUM7T0FDNUM7QUFDRCxVQUFJLENBQUMsYUFBYSxDQUFDLDBCQUEwQixDQUFDO0FBQzVDLGFBQUssRUFBRSxNQUFNO0FBQ2IsaUJBQVMsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDO09BQ3pDLENBQUMsQ0FBQztLQUNKOzs7U0F2S0csdUJBQXVCOzs7QUEwSzdCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsdUJBQXVCLENBQUMiLCJmaWxlIjoiL3Zhci9mb2xkZXJzL3hmL3JzcGg0X2M1NzMxNXJzNTd4eHNkc2tyeG52MzZ0MC9UL3RtcHBmbDUybnB1Ymxpc2hfcGFja2FnZXMvYXBtL251Y2xpZGUtZmxvdy9saWIvRmxvd0RpYWdub3N0aWNzUHJvdmlkZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJztcbi8qIEBmbG93ICovXG5cbi8qXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTUtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgbGljZW5zZSBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGluXG4gKiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS5cbiAqL1xuXG5pbXBvcnQgdHlwZSB7QnVzeVNpZ25hbFByb3ZpZGVyQmFzZX0gZnJvbSAnbnVjbGlkZS1idXN5LXNpZ25hbC1wcm92aWRlci1iYXNlJztcblxuaW1wb3J0IHt0cmFja1RpbWluZ30gZnJvbSAnbnVjbGlkZS1hbmFseXRpY3MnO1xuXG5jb25zdCB7Z2V0U2VydmljZUJ5TnVjbGlkZVVyaX0gPSByZXF1aXJlKCdudWNsaWRlLWNsaWVudCcpO1xuY29uc3Qge3Byb21pc2VzLCBhcnJheX0gPSByZXF1aXJlKCdudWNsaWRlLWNvbW1vbnMnKTtcbmNvbnN0IHtSZXF1ZXN0U2VyaWFsaXplcn0gPSBwcm9taXNlcztcbmNvbnN0IHtEaWFnbm9zdGljc1Byb3ZpZGVyQmFzZX0gPSByZXF1aXJlKCdudWNsaWRlLWRpYWdub3N0aWNzLXByb3ZpZGVyLWJhc2UnKTtcbmNvbnN0IHtSYW5nZX0gPSByZXF1aXJlKCdhdG9tJyk7XG5jb25zdCBpbnZhcmlhbnQgPSByZXF1aXJlKCdhc3NlcnQnKTtcblxuY29uc3Qge0pTX0dSQU1NQVJTfSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzLmpzJyk7XG5cbi8qIFRPRE8gcmVtb3ZlIHRoZXNlIGR1cGxpY2F0ZSBkZWZpbml0aW9ucyBvbmNlIHdlIGZpZ3VyZSBvdXQgaW1wb3J0aW5nIHR5cGVzXG4gKiB0aHJvdWdoIHN5bWxpbmtzLiAqL1xuZXhwb3J0IHR5cGUgRGlhZ25vc3RpY3MgPSB7XG4gIGZsb3dSb290OiBOdWNsaWRlVXJpLFxuICBtZXNzYWdlczogQXJyYXk8Rmxvd0RpYWdub3N0aWNJdGVtPlxufTtcbnR5cGUgRmxvd0Vycm9yID0ge1xuICBsZXZlbDogc3RyaW5nLFxuICBkZXNjcjogc3RyaW5nLFxuICBwYXRoOiBzdHJpbmcsXG4gIGxpbmU6IG51bWJlcixcbiAgc3RhcnQ6IG51bWJlcixcbiAgZW5kbGluZTogbnVtYmVyLFxuICBlbmQ6IG51bWJlcixcbn1cblxudHlwZSBGbG93RGlhZ25vc3RpY0l0ZW0gPSBBcnJheTxGbG93RXJyb3I+O1xuXG4vKipcbiAqIEN1cnJlbnRseSwgYSBkaWFnbm9zdGljIGZyb20gRmxvdyBpcyBhbiBvYmplY3Qgd2l0aCBhIFwibWVzc2FnZVwiIHByb3BlcnR5LlxuICogRWFjaCBpdGVtIGluIHRoZSBcIm1lc3NhZ2VcIiBhcnJheSBpcyBhbiBvYmplY3Qgd2l0aCB0aGUgZm9sbG93aW5nIGZpZWxkczpcbiAqICAgICAtIHBhdGggKHN0cmluZykgRmlsZSB0aGF0IGNvbnRhaW5zIHRoZSBlcnJvci5cbiAqICAgICAtIGRlc2NyIChzdHJpbmcpIERlc2NyaXB0aW9uIG9mIHRoZSBlcnJvci5cbiAqICAgICAtIGxpbmUgKG51bWJlcikgU3RhcnQgbGluZS5cbiAqICAgICAtIGVuZGxpbmUgKG51bWJlcikgRW5kIGxpbmUuXG4gKiAgICAgLSBzdGFydCAobnVtYmVyKSBTdGFydCBjb2x1bW4uXG4gKiAgICAgLSBlbmQgKG51bWJlcikgRW5kIGNvbHVtbi5cbiAqICAgICAtIGNvZGUgKG51bWJlcikgUHJlc3VtYWJseSBhbiBlcnJvciBjb2RlLlxuICogVGhlIG1lc3NhZ2UgYXJyYXkgbWF5IGhhdmUgbW9yZSB0aGFuIG9uZSBpdGVtLiBGb3IgZXhhbXBsZSwgaWYgdGhlcmUgaXMgYVxuICogdHlwZSBpbmNvbXBhdGliaWxpdHkgZXJyb3IsIHRoZSBmaXJzdCBpdGVtIGluIHRoZSBtZXNzYWdlIGFycmF5IGJsYW1lcyB0aGVcbiAqIHVzYWdlIG9mIHRoZSB3cm9uZyB0eXBlIGFuZCB0aGUgc2Vjb25kIGJsYW1lcyB0aGUgZGVjbGFyYXRpb24gb2YgdGhlIHR5cGVcbiAqIHdpdGggd2hpY2ggdGhlIHVzYWdlIGRpc2FncmVlcy4gTm90ZSB0aGF0IHRoZXNlIGNvdWxkIG9jY3VyIGluIGRpZmZlcmVudFxuICogZmlsZXMuXG4gKi9cbmZ1bmN0aW9uIGV4dHJhY3RSYW5nZShtZXNzYWdlKSB7XG4gIC8vIEl0J3MgdW5jbGVhciB3aHkgdGhlIDEtYmFzZWQgdG8gMC1iYXNlZCBpbmRleGluZyB3b3JrcyB0aGUgd2F5IHRoYXQgaXRcbiAgLy8gZG9lcywgYnV0IHRoaXMgaGFzIHRoZSBkZXNpcmVkIGVmZmVjdCBpbiB0aGUgVUksIGluIHByYWN0aWNlLlxuICByZXR1cm4gbmV3IFJhbmdlKFxuICAgIFttZXNzYWdlWydsaW5lJ10gLSAxLCBtZXNzYWdlWydzdGFydCddIC0gMV0sXG4gICAgW21lc3NhZ2VbJ2VuZGxpbmUnXSAtIDEsIG1lc3NhZ2VbJ2VuZCddXVxuICApO1xufVxuXG4vLyBBIHRyYWNlIG9iamVjdCBpcyB2ZXJ5IHNpbWlsYXIgdG8gYW4gZXJyb3Igb2JqZWN0LlxuZnVuY3Rpb24gZmxvd01lc3NhZ2VUb1RyYWNlKG1lc3NhZ2UpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnVHJhY2UnLFxuICAgIHRleHQ6IG1lc3NhZ2VbJ2Rlc2NyJ10sXG4gICAgZmlsZVBhdGg6IG1lc3NhZ2VbJ3BhdGgnXSxcbiAgICByYW5nZTogZXh0cmFjdFJhbmdlKG1lc3NhZ2UpLFxuICB9O1xufVxuXG5mdW5jdGlvbiBmbG93TWVzc2FnZVRvRGlhZ25vc3RpY01lc3NhZ2UoZmxvd01lc3NhZ2VzKSB7XG4gIGNvbnN0IGZsb3dNZXNzYWdlID0gZmxvd01lc3NhZ2VzWzBdO1xuXG4gIGNvbnN0IGRpYWdub3N0aWNNZXNzYWdlOiBGaWxlRGlhZ25vc3RpY01lc3NhZ2UgPSB7XG4gICAgc2NvcGU6ICdmaWxlJyxcbiAgICBwcm92aWRlck5hbWU6ICdGbG93JyxcbiAgICB0eXBlOiBmbG93TWVzc2FnZVsnbGV2ZWwnXSA9PT0gJ2Vycm9yJyA/ICdFcnJvcicgOiAnV2FybmluZycsXG4gICAgdGV4dDogZmxvd01lc3NhZ2VbJ2Rlc2NyJ10sXG4gICAgZmlsZVBhdGg6IGZsb3dNZXNzYWdlWydwYXRoJ10sXG4gICAgcmFuZ2U6IGV4dHJhY3RSYW5nZShmbG93TWVzc2FnZSksXG4gIH07XG5cbiAgLy8gV2hlbiB0aGUgbWVzc2FnZSBpcyBhbiBhcnJheSB3aXRoIG11bHRpcGxlIGVsZW1lbnRzLCB0aGUgc2Vjb25kIGVsZW1lbnRcbiAgLy8gb253YXJkcyBjb21wcmlzZSB0aGUgdHJhY2UgZm9yIHRoZSBlcnJvci5cbiAgaWYgKGZsb3dNZXNzYWdlcy5sZW5ndGggPiAxKSB7XG4gICAgZGlhZ25vc3RpY01lc3NhZ2UudHJhY2UgPSBmbG93TWVzc2FnZXMuc2xpY2UoMSkubWFwKGZsb3dNZXNzYWdlVG9UcmFjZSk7XG4gIH1cblxuICByZXR1cm4gZGlhZ25vc3RpY01lc3NhZ2U7XG59XG5cbmNsYXNzIEZsb3dEaWFnbm9zdGljc1Byb3ZpZGVyIHtcbiAgX3Byb3ZpZGVyQmFzZTogRGlhZ25vc3RpY3NQcm92aWRlckJhc2U7XG4gIF9idXN5U2lnbmFsUHJvdmlkZXI6IEJ1c3lTaWduYWxQcm92aWRlckJhc2U7XG4gIF9yZXF1ZXN0U2VyaWFsaXplcjogUmVxdWVzdFNlcmlhbGl6ZXI7XG5cbiAgLyoqIE1hcHMgZmxvdyByb290IHRvIHRoZSBzZXQgb2YgZmlsZSBwYXRocyB1bmRlciB0aGF0IHJvb3QgZm9yIHdoaWNoIHdlIGhhdmVcbiAgICAqIGV2ZXIgcmVwb3J0ZWQgZGlhZ25vc3RpY3MuICovXG4gIF9mbG93Um9vdFRvRmlsZVBhdGhzOiBNYXA8TnVjbGlkZVVyaSwgU2V0PE51Y2xpZGVVcmk+PjtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBzaG91bGRSdW5PblRoZUZseTogYm9vbGVhbixcbiAgICBidXN5U2lnbmFsUHJvdmlkZXI6IEJ1c3lTaWduYWxQcm92aWRlckJhc2UsXG4gICAgUHJvdmlkZXJCYXNlPzogdHlwZW9mIERpYWdub3N0aWNzUHJvdmlkZXJCYXNlID0gRGlhZ25vc3RpY3NQcm92aWRlckJhc2UsXG4gICkge1xuICAgIHRoaXMuX2J1c3lTaWduYWxQcm92aWRlciA9IGJ1c3lTaWduYWxQcm92aWRlcjtcbiAgICBjb25zdCB1dGlsc09wdGlvbnMgPSB7XG4gICAgICBncmFtbWFyU2NvcGVzOiBuZXcgU2V0KEpTX0dSQU1NQVJTKSxcbiAgICAgIHNob3VsZFJ1bk9uVGhlRmx5LFxuICAgICAgb25UZXh0RWRpdG9yRXZlbnQ6IGVkaXRvciA9PiB0aGlzLl9ydW5EaWFnbm9zdGljcyhlZGl0b3IpLFxuICAgICAgb25OZXdVcGRhdGVTdWJzY3JpYmVyOiBjYWxsYmFjayA9PiB0aGlzLl9yZWNlaXZlZE5ld1VwZGF0ZVN1YnNjcmliZXIoY2FsbGJhY2spLFxuICAgIH07XG4gICAgdGhpcy5fcHJvdmlkZXJCYXNlID0gbmV3IFByb3ZpZGVyQmFzZSh1dGlsc09wdGlvbnMpO1xuICAgIHRoaXMuX3JlcXVlc3RTZXJpYWxpemVyID0gbmV3IFJlcXVlc3RTZXJpYWxpemVyKCk7XG4gICAgdGhpcy5fZmxvd1Jvb3RUb0ZpbGVQYXRocyA9IG5ldyBNYXAoKTtcbiAgfVxuXG4gIF9ydW5EaWFnbm9zdGljcyh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogdm9pZCB7XG4gICAgdGhpcy5fYnVzeVNpZ25hbFByb3ZpZGVyLnJlcG9ydEJ1c3koXG4gICAgICAnRmxvdzogV2FpdGluZyBmb3IgZGlhZ25vc3RpY3MnLFxuICAgICAgKCkgPT4gdGhpcy5fcnVuRGlhZ25vc3RpY3NJbXBsKHRleHRFZGl0b3IpLFxuICAgICk7XG4gIH1cblxuICBAdHJhY2tUaW1pbmcoJ2Zsb3cucnVuLWRpYWdub3N0aWNzJylcbiAgYXN5bmMgX3J1bkRpYWdub3N0aWNzSW1wbCh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgY29uc3QgZmlsZSA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgIGlmICghZmlsZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IGN1cnJlbnRDb250ZW50cyA9IHRleHRFZGl0b3IuaXNNb2RpZmllZCgpID8gdGV4dEVkaXRvci5nZXRUZXh0KCkgOiBudWxsO1xuXG4gICAgY29uc3QgZmxvd1NlcnZpY2UgPSBnZXRTZXJ2aWNlQnlOdWNsaWRlVXJpKCdGbG93U2VydmljZScsIGZpbGUpO1xuICAgIGludmFyaWFudChmbG93U2VydmljZSk7XG4gICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5fcmVxdWVzdFNlcmlhbGl6ZXIucnVuKFxuICAgICAgZmxvd1NlcnZpY2UuZmxvd0ZpbmREaWFnbm9zdGljcyhmaWxlLCBjdXJyZW50Q29udGVudHMpXG4gICAgKTtcbiAgICBpZiAocmVzdWx0LnN0YXR1cyA9PT0gJ291dGRhdGVkJykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBkaWFnbm9zdGljczogP0RpYWdub3N0aWNzID0gcmVzdWx0LnJlc3VsdDtcbiAgICBpZiAoIWRpYWdub3N0aWNzKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHtmbG93Um9vdCwgbWVzc2FnZXN9ID0gZGlhZ25vc3RpY3M7XG5cbiAgICBjb25zdCBwYXRoc1RvSW52YWxpZGF0ZSA9IHRoaXMuX2dldFBhdGhzVG9JbnZhbGlkYXRlKGZsb3dSb290KTtcbiAgICAvKiBUT0RPIENvbnNpZGVyIG9wdGltaXppbmcgZm9yIHRoZSBjb21tb24gY2FzZSBvZiBvbmx5IGEgc2luZ2xlIGZsb3cgcm9vdFxuICAgICAqIGJ5IGludmFsaWRhdGluZyBhbGwgaW5zdGVhZCBvZiBlbnVtZXJhdGluZyB0aGUgZmlsZXMuICovXG4gICAgdGhpcy5fcHJvdmlkZXJCYXNlLnB1Ymxpc2hNZXNzYWdlSW52YWxpZGF0aW9uKHtzY29wZTogJ2ZpbGUnLCBmaWxlUGF0aHM6IHBhdGhzVG9JbnZhbGlkYXRlfSk7XG5cbiAgICBjb25zdCBwYXRoc0ZvclJvb3QgPSBuZXcgU2V0KCk7XG4gICAgdGhpcy5fZmxvd1Jvb3RUb0ZpbGVQYXRocy5zZXQoZmxvd1Jvb3QsIHBhdGhzRm9yUm9vdCk7XG4gICAgZm9yIChjb25zdCBtZXNzYWdlIG9mIG1lc3NhZ2VzKSB7XG4gICAgICAvKiBFYWNoIG1lc3NhZ2UgY29uc2lzdHMgb2Ygc2V2ZXJhbCBkaWZmZXJlbnQgY29tcG9uZW50cywgZWFjaCB3aXRoIGl0c1xuICAgICAgICogb3duIHRleHQgYW5kIHBhdGguICovXG4gICAgICBmb3IgKGNvbnN0IG1lc3NhZ2VDb21wb25lbnQgb2YgbWVzc2FnZSkge1xuICAgICAgICBwYXRoc0ZvclJvb3QuYWRkKG1lc3NhZ2VDb21wb25lbnQucGF0aCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5fcHJvdmlkZXJCYXNlLnB1Ymxpc2hNZXNzYWdlVXBkYXRlKHRoaXMuX3Byb2Nlc3NEaWFnbm9zdGljcyhtZXNzYWdlcywgZmlsZSkpO1xuICB9XG5cbiAgX2dldFBhdGhzVG9JbnZhbGlkYXRlKGZsb3dSb290OiBOdWNsaWRlVXJpKTogQXJyYXk8TnVjbGlkZVVyaT4ge1xuICAgIGNvbnN0IGZpbGVQYXRocyA9IHRoaXMuX2Zsb3dSb290VG9GaWxlUGF0aHMuZ2V0KGZsb3dSb290KTtcbiAgICBpZiAoIWZpbGVQYXRocykge1xuICAgICAgcmV0dXJuIFtdO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXkuZnJvbShmaWxlUGF0aHMpO1xuICB9XG5cbiAgX3JlY2VpdmVkTmV3VXBkYXRlU3Vic2NyaWJlcihjYWxsYmFjazogTWVzc2FnZVVwZGF0ZUNhbGxiYWNrKTogdm9pZCB7XG4gICAgLy8gRXZlcnkgdGltZSB3ZSBnZXQgYSBuZXcgc3Vic2NyaWJlciwgd2UgbmVlZCB0byBwdXNoIHJlc3VsdHMgdG8gdGhlbS4gVGhpc1xuICAgIC8vIGxvZ2ljIGlzIGNvbW1vbiB0byBhbGwgcHJvdmlkZXJzIGFuZCBzaG91bGQgYmUgYWJzdHJhY3RlZCBvdXQgKHQ3ODEzMDY5KVxuICAgIC8vXG4gICAgLy8gT25jZSB3ZSBwcm92aWRlIGFsbCBkaWFnbm9zdGljcywgaW5zdGVhZCBvZiBqdXN0IHRoZSBjdXJyZW50IGZpbGUsIHdlIGNhblxuICAgIC8vIHByb2JhYmx5IHJlbW92ZSB0aGUgYWN0aXZlVGV4dEVkaXRvciBwYXJhbWV0ZXIuXG4gICAgY29uc3QgYWN0aXZlVGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBpZiAoYWN0aXZlVGV4dEVkaXRvcikge1xuICAgICAgY29uc3QgbWF0Y2hlc0dyYW1tYXIgPSBKU19HUkFNTUFSUy5pbmRleE9mKGFjdGl2ZVRleHRFZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZSkgIT09IC0xO1xuICAgICAgaWYgKG1hdGNoZXNHcmFtbWFyKSB7XG4gICAgICAgIHRoaXMuX3J1bkRpYWdub3N0aWNzKGFjdGl2ZVRleHRFZGl0b3IpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldFJ1bk9uVGhlRmx5KHJ1bk9uVGhlRmx5OiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5fcHJvdmlkZXJCYXNlLnNldFJ1bk9uVGhlRmx5KHJ1bk9uVGhlRmx5KTtcbiAgfVxuXG4gIG9uTWVzc2FnZVVwZGF0ZShjYWxsYmFjazogTWVzc2FnZVVwZGF0ZUNhbGxiYWNrKTogYXRvbSREaXNwb3NhYmxlIHtcbiAgICByZXR1cm4gdGhpcy5fcHJvdmlkZXJCYXNlLm9uTWVzc2FnZVVwZGF0ZShjYWxsYmFjayk7XG4gIH1cblxuICBvbk1lc3NhZ2VJbnZhbGlkYXRpb24oY2FsbGJhY2s6IE1lc3NhZ2VJbnZhbGlkYXRpb25DYWxsYmFjayk6IGF0b20kRGlzcG9zYWJsZSB7XG4gICAgcmV0dXJuIHRoaXMuX3Byb3ZpZGVyQmFzZS5vbk1lc3NhZ2VJbnZhbGlkYXRpb24oY2FsbGJhY2spO1xuICB9XG5cbiAgZGlzcG9zZSgpIHtcbiAgICB0aGlzLl9wcm92aWRlckJhc2UuZGlzcG9zZSgpO1xuICB9XG5cbiAgX3Byb2Nlc3NEaWFnbm9zdGljcyhcbiAgICBkaWFnbm9zdGljczogQXJyYXk8Rmxvd0RpYWdub3N0aWNJdGVtPixcbiAgICBjdXJyZW50RmlsZTogc3RyaW5nXG4gICk6IERpYWdub3N0aWNQcm92aWRlclVwZGF0ZSB7XG5cbiAgICAvLyBjb252ZXJ0IGFycmF5IG1lc3NhZ2VzIHRvIEVycm9yIE9iamVjdHMgd2l0aCBUcmFjZXNcbiAgICBjb25zdCBmaWxlRGlhZ25vc3RpY3MgPSBkaWFnbm9zdGljcy5tYXAoZmxvd01lc3NhZ2VUb0RpYWdub3N0aWNNZXNzYWdlKTtcblxuICAgIGNvbnN0IGZpbGVQYXRoVG9NZXNzYWdlcyA9IG5ldyBNYXAoKTtcblxuICAgIC8vIFRoaXMgaW52YWxpZGF0ZXMgdGhlIGVycm9ycyBpbiB0aGUgY3VycmVudCBmaWxlLiBJZiBGbG93LCB3aGVuIHJ1bm5pbmcgaW4gdGhpcyByb290LCBoYXNcbiAgICAvLyByZXBvcnRlZCBlcnJvcnMgZm9yIHRoaXMgZmlsZSwgdGhpcyBpbnZhbGlkYXRpb24gaXMgbm90IG5lY2Vzc2FyeSBiZWNhdXNlIHRoZSBwYXRoIHdpbGwgYmVcbiAgICAvLyBleHBsaWNpdGx5IGludmFsaWRhdGVkLiBIb3dldmVyLCBpZiBGbG93IGhhcyByZXBvcnRlZCBhbiBlcnJvciBpbiB0aGlzIHJvb3QgZnJvbSBhbm90aGVyIHJvb3RcbiAgICAvLyAoYXMgc29tZXRpbWVzIGhhcHBlbnMgd2hlbiBGbG93IHJvb3RzIGNvbnRhaW4gc3ltbGlua3MgdG8gb3RoZXIgRmxvdyByb290cyksIGFuZCBpdCBhbHNvIGRvZXNcbiAgICAvLyBub3QgcmVwb3J0IHRoYXQgc2FtZSBlcnJvciB3aGVuIHJ1bm5pbmcgaW4gdGhpcyBGbG93IHJvb3QsIHRoZW4gd2Ugd2FudCB0aGUgZXJyb3IgdG9cbiAgICAvLyBkaXNhcHBlYXIgd2hlbiB0aGlzIGZpbGUgaXMgb3BlbmVkLlxuICAgIC8vXG4gICAgLy8gVGhpcyBpc24ndCBhIHBlcmZlY3Qgc29sdXRpb24sIHNpbmNlIGl0IGNhbiBzdGlsbCBsZWF2ZSBkaWFnbm9zdGljcyB1cCBpbiBvdGhlciBmaWxlcywgYnV0XG4gICAgLy8gdGhpcyBpcyBhIGNvcm5lciBjYXNlIGFuZCBkb2luZyB0aGlzIGlzIHN0aWxsIGJldHRlciB0aGFuIGRvaW5nIG5vdGhpbmcuXG4gICAgLy9cbiAgICAvLyBJIHRoaW5rIHRoYXQgd2hlbmV2ZXIgdGhpcyBoYXBwZW5zLCBpdCdzIGEgYnVnIGluIEZsb3cuIEl0IHNlZW1zIHN0cmFuZ2UgZm9yIEZsb3cgdG8gcmVwb3J0XG4gICAgLy8gZXJyb3JzIGluIG9uZSBwbGFjZSB3aGVuIHJ1biBmcm9tIG9uZSByb290LCBhbmQgbm90IHJlcG9ydCBlcnJvcnMgaW4gdGhhdCBzYW1lIHBsYWNlIHdoZW4gcnVuXG4gICAgLy8gZnJvbSBhbm90aGVyIHJvb3QuIEJ1dCBzdWNoIGlzIGxpZmUuXG4gICAgZmlsZVBhdGhUb01lc3NhZ2VzLnNldChjdXJyZW50RmlsZSwgW10pO1xuXG4gICAgZm9yIChjb25zdCBkaWFnbm9zdGljIG9mIGZpbGVEaWFnbm9zdGljcykge1xuICAgICAgY29uc3QgcGF0aCA9IGRpYWdub3N0aWNbJ2ZpbGVQYXRoJ107XG4gICAgICBsZXQgZGlhZ25vc3RpY0FycmF5ID0gZmlsZVBhdGhUb01lc3NhZ2VzLmdldChwYXRoKTtcbiAgICAgIGlmICghZGlhZ25vc3RpY0FycmF5KSB7XG4gICAgICAgIGRpYWdub3N0aWNBcnJheSA9IFtdO1xuICAgICAgICBmaWxlUGF0aFRvTWVzc2FnZXMuc2V0KHBhdGgsIGRpYWdub3N0aWNBcnJheSk7XG4gICAgICB9XG4gICAgICBkaWFnbm9zdGljQXJyYXkucHVzaChkaWFnbm9zdGljKTtcbiAgICB9XG5cbiAgICByZXR1cm4geyBmaWxlUGF0aFRvTWVzc2FnZXMgfTtcbiAgfVxuXG4gIGludmFsaWRhdGVQcm9qZWN0UGF0aChwcm9qZWN0UGF0aDogc3RyaW5nKTogdm9pZCB7XG4gICAgY29uc3QgcGF0aHNUb0ludmFsaWRhdGUgPSBuZXcgU2V0KCk7XG4gICAgZm9yIChjb25zdCBmbG93Um9vdEVudHJ5IG9mIHRoaXMuX2Zsb3dSb290VG9GaWxlUGF0aHMpIHtcbiAgICAgIGNvbnN0IFtmbG93Um9vdCwgZmlsZVBhdGhzXSA9IGZsb3dSb290RW50cnk7XG4gICAgICBpZiAoIWZsb3dSb290LnN0YXJ0c1dpdGgocHJvamVjdFBhdGgpKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgZm9yIChjb25zdCBmaWxlUGF0aCBvZiBmaWxlUGF0aHMpIHtcbiAgICAgICAgcGF0aHNUb0ludmFsaWRhdGUuYWRkKGZpbGVQYXRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX2Zsb3dSb290VG9GaWxlUGF0aHMuZGVsZXRlKGZsb3dSb290KTtcbiAgICB9XG4gICAgdGhpcy5fcHJvdmlkZXJCYXNlLnB1Ymxpc2hNZXNzYWdlSW52YWxpZGF0aW9uKHtcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBmaWxlUGF0aHM6IGFycmF5LmZyb20ocGF0aHNUb0ludmFsaWRhdGUpLFxuICAgIH0pO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gRmxvd0RpYWdub3N0aWNzUHJvdmlkZXI7XG4iXX0=
