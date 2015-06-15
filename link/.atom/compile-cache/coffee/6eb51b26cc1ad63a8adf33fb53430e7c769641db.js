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
      return this.configSubscription = Config.onDidChange((function(_this) {
        return function(event) {
          var lintView, _i, _len, _ref, _results;
          if (!_this.shouldRefleshWithConfigChange(event.oldValue, event.newValue)) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLG1DQUFBOztBQUFBLEVBQUEsUUFBQSxHQUFXLElBQVgsQ0FBQTs7QUFBQSxFQUNBLGNBQUEsR0FBaUIsSUFEakIsQ0FBQTs7QUFBQSxFQUVBLE1BQUEsR0FBUyxJQUZULENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksSUFISixDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxZQUFBLEVBQWMsRUFBZDtBQUFBLE1BQ0EscUJBQUEsRUFBdUIsSUFEdkI7S0FERjtBQUFBLElBSUEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNSLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixhQUEzQixFQUEwQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTFDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixnQ0FBM0IsRUFBNkQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsdUJBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBN0QsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsU0FBRCxHQUFhLEVBSGIsQ0FBQTthQUlBLElBQUMsQ0FBQSxNQUFELENBQUEsRUFMUTtJQUFBLENBSlY7QUFBQSxJQVdBLFVBQUEsRUFBWSxTQUFBLEdBQUE7QUFDVixVQUFBLFdBQUE7O1lBQWtCLENBQUUsR0FBcEIsQ0FBd0IsZ0NBQXhCO09BQUE7O2FBQ2tCLENBQUUsR0FBcEIsQ0FBd0IsYUFBeEI7T0FEQTthQUVBLElBQUMsQ0FBQSxPQUFELENBQUEsRUFIVTtJQUFBLENBWFo7QUFBQSxJQWdCQSxNQUFBLEVBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQVgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLHNCQUFELEdBQTBCLElBQUksQ0FBQyxhQUFhLENBQUMsY0FBbkIsQ0FBa0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsVUFBRCxHQUFBO2lCQUMxRCxLQUFDLENBQUEsNEJBQUQsQ0FBOEIsVUFBOUIsRUFEMEQ7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFsQyxDQUgxQixDQUFBO0FBQUEsTUFNQSxJQUFDLENBQUEsaUNBQUQsQ0FBQSxDQU5BLENBQUE7QUFBQSxNQU9BLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBZCxDQUFtQixXQUFuQixFQUFnQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUM5QixLQUFDLENBQUEsaUNBQUQsQ0FBQSxFQUQ4QjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhDLENBUEEsQ0FBQTs7UUFVQSxTQUFVLE9BQUEsQ0FBUSxVQUFSO09BVlY7YUFXQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxHQUFBO0FBQ3ZDLGNBQUEsa0NBQUE7QUFBQSxVQUFBLElBQUEsQ0FBQSxLQUFlLENBQUEsNkJBQUQsQ0FBK0IsS0FBSyxDQUFDLFFBQXJDLEVBQStDLEtBQUssQ0FBQyxRQUFyRCxDQUFkO0FBQUEsa0JBQUEsQ0FBQTtXQUFBO0FBQ0E7QUFBQTtlQUFBLDJDQUFBO2dDQUFBO0FBQ0UsMEJBQUEsUUFBUSxDQUFDLE9BQVQsQ0FBQSxFQUFBLENBREY7QUFBQTswQkFGdUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFuQixFQVpoQjtJQUFBLENBaEJSO0FBQUEsSUFpQ0EsT0FBQSxFQUFTLFNBQUEsR0FBQTtBQUNQLFVBQUEsd0JBQUE7O1lBQWUsQ0FBRSxNQUFqQixDQUFBO09BQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBRGxCLENBQUE7O2FBR21CLENBQUUsR0FBckIsQ0FBQTtPQUhBOzthQUl1QixDQUFFLEdBQXpCLENBQUE7T0FKQTtBQU1BLGFBQU0sSUFBQSxHQUFPLElBQUMsQ0FBQSxTQUFTLENBQUMsS0FBWCxDQUFBLENBQWIsR0FBQTtBQUNFLFFBQUEsSUFBSSxDQUFDLE1BQUwsQ0FBQSxDQUFBLENBREY7TUFBQSxDQU5BO2FBU0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxNQVZKO0lBQUEsQ0FqQ1Q7QUFBQSxJQTZDQSxNQUFBLEVBQVEsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFHLElBQUMsQ0FBQSxPQUFKO2VBQ0UsSUFBQyxDQUFBLE9BQUQsQ0FBQSxFQURGO09BQUEsTUFBQTtlQUdFLElBQUMsQ0FBQSxNQUFELENBQUEsRUFIRjtPQURNO0lBQUEsQ0E3Q1I7QUFBQSxJQW1EQSx1QkFBQSxFQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSxpQkFBQTtBQUFBLE1BQUEsR0FBQSxHQUFNLHVCQUFOLENBQUE7QUFBQSxNQUNBLFlBQUEsR0FBZSxNQUFNLENBQUMsR0FBUCxDQUFXLEdBQVgsQ0FEZixDQUFBO2FBRUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxHQUFYLEVBQWdCLENBQUEsWUFBaEIsRUFIdUI7SUFBQSxDQW5EekI7QUFBQSxJQXdEQSw0QkFBQSxFQUE4QixTQUFDLFVBQUQsR0FBQTtBQUM1QixVQUFBLFFBQUE7QUFBQSxNQUFBLElBQWMsNEJBQWQ7QUFBQSxjQUFBLENBQUE7T0FBQTtBQUNBLE1BQUEsSUFBQSxDQUFBLFVBQXdCLENBQUMsUUFBekI7QUFBQSxjQUFBLENBQUE7T0FEQTtBQUVBLE1BQUEsSUFBVSwyQkFBVjtBQUFBLGNBQUEsQ0FBQTtPQUZBOztRQUdBLFdBQVksT0FBQSxDQUFRLGFBQVI7T0FIWjtBQUFBLE1BSUEsUUFBQSxHQUFlLElBQUEsUUFBQSxDQUFTLFVBQVQsQ0FKZixDQUFBO2FBS0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxJQUFYLENBQWdCLFFBQWhCLEVBTjRCO0lBQUEsQ0F4RDlCO0FBQUEsSUFnRUEsaUNBQUEsRUFBbUMsU0FBQSxHQUFBO0FBQ2pDLFVBQUEsU0FBQTtBQUFBLE1BQUEsSUFBVSwyQkFBVjtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxTQUFBLEdBQVksSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUQvQixDQUFBO0FBRUEsTUFBQSxJQUFjLGlCQUFkO0FBQUEsY0FBQSxDQUFBO09BRkE7O1FBR0EsaUJBQWtCLE9BQUEsQ0FBUSxvQkFBUjtPQUhsQjtBQUFBLE1BSUEsSUFBQyxDQUFBLGNBQUQsR0FBc0IsSUFBQSxjQUFBLENBQWUsU0FBZixDQUp0QixDQUFBO2FBS0EsU0FBUyxDQUFDLFlBQVYsQ0FBdUIsSUFBQyxDQUFBLGNBQXhCLEVBTmlDO0lBQUEsQ0FoRW5DO0FBQUEsSUF3RUEsNkJBQUEsRUFBK0IsU0FBQyxRQUFELEVBQVcsT0FBWCxHQUFBO0FBQzdCLE1BQUEsUUFBUSxDQUFDLHFCQUFULEdBQWlDLE9BQU8sQ0FBQyxxQkFBUixHQUFnQyxJQUFqRSxDQUFBOztRQUNBLElBQUssT0FBQSxDQUFRLFFBQVI7T0FETDthQUVBLENBQUEsQ0FBRSxDQUFDLE9BQUYsQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBSDRCO0lBQUEsQ0F4RS9CO0dBTkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/atom-lint.coffee