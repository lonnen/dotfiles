(function() {
  var Config, LintStatusView, LintView, _;

  LintView = null;

  LintStatusView = null;

  Config = null;

  _ = null;

  module.exports = {
    configDefaults: {
      ignoredNames: [],
      showViolationMetadata: true
    },
    activate: function() {
      atom.workspaceView.command('lint:toggle', (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
      atom.workspaceView.command('lint:toggle-violation-metadata', (function(_this) {
        return function() {
          return _this.toggleViolationMetadata();
        };
      })(this));
      this.lintViews = [];
      return this.enable();
    },
    deactivate: function() {
      var _ref, _ref1;
      if ((_ref = atom.workspaceView) != null) {
        _ref.off('lint:toggle-violation-metadata');
      }
      if ((_ref1 = atom.workspaceView) != null) {
        _ref1.off('lint:toggle');
      }
      return this.disable();
    },
    enable: function() {
      this.enabled = true;
      this.editorViewSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          return _this.injectLintViewIntoEditorView(editorView);
        };
      })(this));
      this.injectLintStatusViewIntoStatusBar();
      atom.packages.once('activated', (function(_this) {
        return function() {
          return _this.injectLintStatusViewIntoStatusBar();
        };
      })(this));
      if (Config == null) {
        Config = require('./config');
      }
      return this.configSubscription = Config.observe((function(_this) {
        return function(newValue, options) {
          var lintView, _i, _len, _ref, _results;
          if (!_this.shouldRefleshWithConfigChange(options.previous, newValue)) {
            return;
          }
          _ref = _this.lintViews;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            lintView = _ref[_i];
            _results.push(lintView.refresh());
          }
          return _results;
        };
      })(this));
    },
    disable: function() {
      var view, _ref, _ref1, _ref2;
      if ((_ref = this.lintStatusView) != null) {
        _ref.remove();
      }
      this.lintStatusView = null;
      if ((_ref1 = this.configSubscription) != null) {
        _ref1.off();
      }
      if ((_ref2 = this.editorViewSubscription) != null) {
        _ref2.off();
      }
      while (view = this.lintViews.shift()) {
        view.remove();
      }
      return this.enabled = false;
    },
    toggle: function() {
      if (this.enabled) {
        return this.disable();
      } else {
        return this.enable();
      }
    },
    toggleViolationMetadata: function() {
      var currentValue, key;
      key = 'showViolationMetadata';
      currentValue = Config.get(key);
      return Config.set(key, !currentValue);
    },
    injectLintViewIntoEditorView: function(editorView) {
      var lintView;
      if (editorView.getPane() == null) {
        return;
      }
      if (!editorView.attached) {
        return;
      }
      if (editorView.lintView != null) {
        return;
      }
      if (LintView == null) {
        LintView = require('./lint-view');
      }
      lintView = new LintView(editorView);
      return this.lintViews.push(lintView);
    },
    injectLintStatusViewIntoStatusBar: function() {
      var statusBar;
      if (this.lintStatusView != null) {
        return;
      }
      statusBar = atom.workspaceView.statusBar;
      if (statusBar == null) {
        return;
      }
      if (LintStatusView == null) {
        LintStatusView = require('./lint-status-view');
      }
      this.lintStatusView = new LintStatusView(statusBar);
      return statusBar.prependRight(this.lintStatusView);
    },
    shouldRefleshWithConfigChange: function(previous, current) {
      previous.showViolationMetadata = current.showViolationMetadata = null;
      if (_ == null) {
        _ = require('lodash');
      }
      return !_.isEqual(previous, current);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsSUFEakIsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxJQUZULENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksSUFISixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQWMsRUFBZDtBQUFBLE1BQ0EscUJBQUEsRUFBdUIsSUFEdkI7S0FERjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixhQUEzQixFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixnQ0FBM0IsRUFBNkQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsdUJBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0QsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBSGIsQ0FBQTthQUlBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFMUTtJQUFBLENBSlY7QUFBQSxJQVdBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLFdBQUE7O1lBQWtCLENBQUUsR0FBcEIsQ0FBd0IsZ0NBQXhCO09BQUE7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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/atom-lint.coffee