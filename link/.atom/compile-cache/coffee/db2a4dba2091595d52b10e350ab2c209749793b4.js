(function() {
  var AtomReact, Subscriber, contentCheckRegex, defaultDetectReactFilePattern;

  Subscriber = require('emissary').Subscriber;

  contentCheckRegex = null;

  defaultDetectReactFilePattern = '/((require\\([\'"]react(?:-native)?[\'"]\\)))|(import\\s+\\w+\\s+from\\s+[\'"]react(?:-native)?[\'"])/';

  AtomReact = (function() {
    Subscriber.includeInto(AtomReact);

    AtomReact.prototype.config = {
      detectReactFilePattern: {
        type: 'string',
        "default": defaultDetectReactFilePattern
      },
      jsxTagStartPattern: {
        type: 'string',
        "default": '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))'
      },
      jsxComplexAttributePattern: {
        type: 'string',
        "default": '(?x)\\{ [^}"\']* $|\\( [^)"\']* $'
      },
      decreaseIndentForNextLinePattern: {
        type: 'string',
        "default": '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$'
      }
    };

    function AtomReact() {}

    AtomReact.prototype.patchEditorLangModeAutoDecreaseIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.autoDecreaseIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.autoDecreaseIndentForBufferRow = function(bufferRow, options) {
        var currentIndentLevel, decreaseIndentRegex, decreaseNextLineIndentRegex, desiredIndentLevel, increaseIndentRegex, line, precedingLine, precedingRow, scopeDescriptor;
        if (editor.getGrammar().scopeName !== "source.js.jsx") {
          return fn.call(editor.languageMode, bufferRow, options);
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        line = this.buffer.lineForRow(bufferRow);
        if (precedingLine && decreaseNextLineIndentRegex.testSync(precedingLine) && !(increaseIndentRegex && increaseIndentRegex.testSync(precedingLine)) && !this.editor.isBufferRowCommented(precedingRow)) {
          currentIndentLevel = this.editor.indentationForBufferRow(precedingRow);
          if (decreaseIndentRegex && decreaseIndentRegex.testSync(line)) {
            currentIndentLevel -= 1;
          }
          desiredIndentLevel = currentIndentLevel - 1;
          if (desiredIndentLevel >= 0 && desiredIndentLevel < currentIndentLevel) {
            return this.editor.setIndentationForBufferRow(bufferRow, desiredIndentLevel);
          }
        } else if (!this.editor.isBufferRowCommented(bufferRow)) {
          return fn.call(editor.languageMode, bufferRow, options);
        }
      };
    };

    AtomReact.prototype.patchEditorLangModeSuggestedIndentForBufferRow = function(editor) {
      var fn, self;
      self = this;
      fn = editor.languageMode.suggestedIndentForBufferRow;
      if (fn.jsxPatch) {
        return;
      }
      return editor.languageMode.suggestedIndentForBufferRow = function(bufferRow, options) {
        var complexAttributeRegex, decreaseIndentRegex, decreaseIndentTest, decreaseNextLineIndentRegex, increaseIndentRegex, indent, precedingLine, precedingRow, scopeDescriptor, tagStartRegex, tagStartTest;
        indent = fn.call(editor.languageMode, bufferRow, options);
        if (!(editor.getGrammar().scopeName === "source.js.jsx" && bufferRow > 1)) {
          return indent;
        }
        scopeDescriptor = this.editor.scopeDescriptorForBufferPosition([bufferRow, 0]);
        decreaseNextLineIndentRegex = this.getRegexForProperty(scopeDescriptor, 'react.decreaseIndentForNextLinePattern');
        increaseIndentRegex = this.increaseIndentRegexForScopeDescriptor(scopeDescriptor);
        decreaseIndentRegex = this.decreaseIndentRegexForScopeDescriptor(scopeDescriptor);
        tagStartRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxTagStartPattern');
        complexAttributeRegex = this.getRegexForProperty(scopeDescriptor, 'react.jsxComplexAttributePattern');
        precedingRow = this.buffer.previousNonBlankRow(bufferRow);
        if (precedingRow < 0) {
          return indent;
        }
        precedingLine = this.buffer.lineForRow(precedingRow);
        if (precedingLine == null) {
          return indent;
        }
        if (this.editor.isBufferRowCommented(bufferRow) && this.editor.isBufferRowCommented(precedingRow)) {
          return this.editor.indentationForBufferRow(precedingRow);
        }
        tagStartTest = tagStartRegex.testSync(precedingLine);
        decreaseIndentTest = decreaseIndentRegex.testSync(precedingLine);
        if (tagStartTest && complexAttributeRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent += 1;
        }
        if (precedingLine && !decreaseIndentTest && decreaseNextLineIndentRegex.testSync(precedingLine) && !this.editor.isBufferRowCommented(precedingRow)) {
          indent -= 1;
        }
        return Math.max(indent, 0);
      };
    };

    AtomReact.prototype.patchEditorLangMode = function(editor) {
      var _ref, _ref1;
      if ((_ref = this.patchEditorLangModeSuggestedIndentForBufferRow(editor)) != null) {
        _ref.jsxPatch = true;
      }
      return (_ref1 = this.patchEditorLangModeAutoDecreaseIndentForBufferRow(editor)) != null ? _ref1.jsxPatch = true : void 0;
    };

    AtomReact.prototype.isReact = function(text) {
      var match;
      if (contentCheckRegex == null) {
        match = (atom.config.get('react.detectReactFilePattern') || defaultDetectReactFilePattern).match(new RegExp('^/(.*?)/([gimy]*)$'));
        contentCheckRegex = new RegExp(match[1], match[2]);
      }
      return text.match(contentCheckRegex) != null;
    };

    AtomReact.prototype.isReactEnabledForEditor = function(editor) {
      return (editor != null) && editor.getGrammar().scopeName === "source.js.jsx";
    };

    AtomReact.prototype.autoSetGrammar = function(editor) {
      var extName, jsxGrammar, path;
      if (this.isReactEnabledForEditor(editor)) {
        return;
      }
      path = require('path');
      extName = path.extname(editor.getPath());
      if (extName === ".jsx" || (extName === ".js" && this.isReact(editor.getText()))) {
        jsxGrammar = atom.grammars.grammarsByScopeName["source.js.jsx"];
        if (jsxGrammar) {
          return editor.setGrammar(jsxGrammar);
        }
      }
    };

    AtomReact.prototype.onHTMLToJSX = function() {
      var HTMLtoJSX, converter, editor, jsxformat, selections;
      jsxformat = require('jsxformat');
      HTMLtoJSX = require('./htmltojsx');
      converter = new HTMLtoJSX({
        createClass: false
      });
      editor = atom.workspace.getActiveEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var jsxOutput, selection, selectionText, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              selectionText = selection.getText();
              jsxOutput = converter.convert(selectionText);
              try {
                jsxformat.setOptions({});
                jsxOutput = jsxformat.format(jsxOutput);
              } catch (_error) {}
              _results.push(selection.insertText(jsxOutput, {
                autoIndent: true
              }));
            } catch (_error) {}
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.onReformat = function() {
      var editor, jsxformat, selections, _;
      jsxformat = require('jsxformat');
      _ = require('lodash');
      editor = atom.workspace.getActiveEditor();
      if (!this.isReactEnabledForEditor(editor)) {
        return;
      }
      selections = editor.getSelections();
      return editor.transact((function(_this) {
        return function() {
          var bufStart, err, firstChangedLine, lastChangedLine, newLineCount, original, originalLineCount, range, result, selection, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = selections.length; _i < _len; _i++) {
            selection = selections[_i];
            try {
              bufStart = selection.getBufferRange().serialize()[0];
              jsxformat.setOptions({});
              result = jsxformat.format(selection.getText());
              selection.insertText(result, {
                autoIndent: true
              });
              _results.push(editor.setCursorBufferPosition(bufStart));
            } catch (_error) {
              err = _error;
              range = selection.getBufferRange().serialize();
              range[0][0]++;
              range[1][0]++;
              jsxformat.setOptions({
                range: range
              });
              original = editor.getText();
              try {
                result = jsxformat.format(original);
                selection.clear();
                originalLineCount = editor.getLineCount();
                editor.setText(result);
                newLineCount = editor.getLineCount();
                firstChangedLine = range[0][0] - 1;
                lastChangedLine = range[1][0] - 1 + (newLineCount - originalLineCount);
                editor.autoIndentBufferRows(firstChangedLine, lastChangedLine);
                _results.push(editor.setCursorBufferPosition([firstChangedLine, range[0][1]]));
              } catch (_error) {}
            }
          }
          return _results;
        };
      })(this));
    };

    AtomReact.prototype.processEditor = function(editor) {
      this.patchEditorLangMode(editor);
      return this.autoSetGrammar(editor);
    };

    AtomReact.prototype.deactivate = function() {
      this.disposableReformat.dispose();
      this.disposableHTMLTOJSX.dispose();
      this.disposableProcessEditor.dispose();
      return this.disposableConfigListener.dispose();
    };

    AtomReact.prototype.activate = function() {
      var decreaseIndentForNextLinePattern, jsxComplexAttributePattern, jsxTagStartPattern;
      jsxTagStartPattern = '(?x)((^|=|return)\\s*<([^!/?](?!.+?(</.+?>))))';
      jsxComplexAttributePattern = '(?x)\\{ [^}"\']* $|\\( [^)"\']* $';
      decreaseIndentForNextLinePattern = '(?x) />\\s*(,|;)?\\s*$ | ^\\s*\\S+.*</[-_\\.A-Za-z0-9]+>$';
      atom.config.set("react.jsxTagStartPattern", jsxTagStartPattern);
      atom.config.set("react.jsxComplexAttributePattern", jsxComplexAttributePattern);
      atom.config.set("react.decreaseIndentForNextLinePattern", decreaseIndentForNextLinePattern);
      this.disposableConfigListener = atom.config.observe('react.detectReactFilePattern', function(newValue) {
        return contentCheckRegex = null;
      });
      this.disposableReformat = atom.commands.add('atom-workspace', 'react:reformat-JSX', (function(_this) {
        return function() {
          return _this.onReformat();
        };
      })(this));
      this.disposableHTMLTOJSX = atom.commands.add('atom-workspace', 'react:HTML-to-JSX', (function(_this) {
        return function() {
          return _this.onHTMLToJSX();
        };
      })(this));
      return this.disposableProcessEditor = atom.workspace.observeTextEditors(this.processEditor.bind(this));
    };

    return AtomReact;

  })();

  module.exports = AtomReact;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVFQUFBOztBQUFBLEVBQUMsYUFBYyxPQUFBLENBQVEsVUFBUixFQUFkLFVBQUQsQ0FBQTs7QUFBQSxFQUNBLGlCQUFBLEdBQW9CLElBRHBCLENBQUE7O0FBQUEsRUFFQSw2QkFBQSxHQUFnQyx3R0FGaEMsQ0FBQTs7QUFBQSxFQUlNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixTQUF2QixDQUFBLENBQUE7O0FBQUEsd0JBRUEsTUFBQSxHQUNFO0FBQUEsTUFBQSxzQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLDZCQURUO09BREY7QUFBQSxNQUdBLGtCQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxRQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsZ0RBRFQ7T0FKRjtBQUFBLE1BTUEsMEJBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxtQ0FEVDtPQVBGO0FBQUEsTUFTQSxnQ0FBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sUUFBTjtBQUFBLFFBQ0EsU0FBQSxFQUFTLDJEQURUO09BVkY7S0FIRixDQUFBOztBQWtCYSxJQUFBLG1CQUFBLEdBQUEsQ0FsQmI7O0FBQUEsd0JBbUJBLGlEQUFBLEdBQW1ELFNBQUMsTUFBRCxHQUFBO0FBQ2pELFVBQUEsUUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQVAsQ0FBQTtBQUFBLE1BQ0EsRUFBQSxHQUFLLE1BQU0sQ0FBQyxZQUFZLENBQUMsOEJBRHpCLENBQUE7QUFFQSxNQUFBLElBQVUsRUFBRSxDQUFDLFFBQWI7QUFBQSxjQUFBLENBQUE7T0FGQTthQUlBLE1BQU0sQ0FBQyxZQUFZLENBQUMsOEJBQXBCLEdBQXFELFNB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
//# sourceURL=/Users/lonnen/.atom/packages/react/lib/atom-react.coffee