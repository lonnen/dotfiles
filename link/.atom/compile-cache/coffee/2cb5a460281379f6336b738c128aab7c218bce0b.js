(function() {
  var LintStatusView, View,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom').View;

  module.exports = LintStatusView = (function(_super) {
    __extends(LintStatusView, _super);

    function LintStatusView() {
      return LintStatusView.__super__.constructor.apply(this, arguments);
    }

    LintStatusView.content = function() {
      return this.div({
        "class": 'lint-status inline-block'
      }, (function(_this) {
        return function() {
          _this.span({
            "class": 'linter-name'
          });
          return _this.span({
            "class": 'lint-summary'
          });
        };
      })(this));
    };

    LintStatusView.prototype.initialize = function(statusBarView) {
      this.statusBarView = statusBarView;
      this.subscribeToLintRunner();
      this.update();
      return this.subscribe(this.statusBarView, 'active-buffer-changed', (function(_this) {
        return function() {
          return process.nextTick(function() {
            _this.unsubscribeFromLintRunner();
            _this.subscribeToLintRunner();
            return _this.update();
          });
        };
      })(this));
    };

    LintStatusView.prototype.getActiveLintRunner = function() {
      var editorView, _ref;
      editorView = atom.workspaceView.getActiveView();
      return editorView != null ? (_ref = editorView.lintView) != null ? _ref.lintRunner : void 0 : void 0;
    };

    LintStatusView.prototype.subscribeToLintRunner = function() {
      var activeLintRunner;
      activeLintRunner = this.getActiveLintRunner();
      if (activeLintRunner == null) {
        return;
      }
      return this.subscription = activeLintRunner.on('activate deactivate lint', (function(_this) {
        return function(error) {
          return _this.update(error);
        };
      })(this));
    };

    LintStatusView.prototype.unsubscribeFromLintRunner = function() {
      var _ref;
      if ((_ref = this.subscription) != null) {
        _ref.off();
      }
      return this.subscription = null;
    };

    LintStatusView.prototype.update = function(error) {
      var activeLinter, violations, _ref;
      activeLinter = (_ref = this.getActiveLintRunner()) != null ? _ref.getActiveLinter() : void 0;
      if (activeLinter != null) {
        if ((error != null) && error.code === 'ENOENT') {
          this.displayLinterName("" + activeLinter.canonicalName + " is not installed");
          return this.displaySummary(violations);
        } else {
          this.displayLinterName(activeLinter.canonicalName);
          violations = this.getActiveLintRunner().getLastViolations();
          return this.displaySummary(violations);
        }
      } else {
        this.displayLinterName();
        return this.displaySummary();
      }
    };

    LintStatusView.prototype.displayLinterName = function(text) {
      return this.find('.linter-name').text(text || '');
    };

    LintStatusView.prototype.displaySummary = function(violations) {
      var errorCount, html, warningCount;
      html = '';
      if (violations != null) {
        if (violations.length === 0) {
          html += '<span class="icon icon-check lint-clean"></span>';
        } else {
          errorCount = this.countViolationsOfSeverity(violations, 'error');
          if (errorCount > 0) {
            html += "<span class=\"icon icon-alert lint-error\">" + errorCount + "</span>";
          }
          warningCount = this.countViolationsOfSeverity(violations, 'warning');
          if (warningCount > 0) {
            html += "<span class=\"icon icon-alert lint-warning\">" + warningCount + "</span>";
          }
        }
      }
      return this.find('.lint-summary').html(html);
    };

    LintStatusView.prototype.countViolationsOfSeverity = function(violations, severity) {
      if (violations == null) {
        return 0;
      }
      return violations.filter(function(violation) {
        return violation.severity === severity;
      }).length;
    };

    return LintStatusView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxPQUFRLE9BQUEsQ0FBUSxNQUFSLEVBQVIsSUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHFDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLGNBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDBCQUFQO09BQUwsRUFBd0MsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUN0QyxVQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxhQUFQO1dBQU4sQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxZQUFBLE9BQUEsRUFBTyxjQUFQO1dBQU4sRUFGc0M7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF4QyxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDZCQUtBLFVBQUEsR0FBWSxTQUFFLGFBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLGdCQUFBLGFBQ1osQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLHFCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsTUFBRCxDQUFBLENBREEsQ0FBQTthQUdBLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLGFBQVosRUFBMkIsdUJBQTNCLEVBQW9ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBT2xELE9BQU8sQ0FBQyxRQUFSLENBQWlCLFNBQUEsR0FBQTtBQUNmLFlBQUEsS0FBQyxDQUFBLHlCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsWUFDQSxLQUFDLENBQUEscUJBQUQsQ0FBQSxDQURBLENBQUE7bUJBRUEsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUhlO1VBQUEsQ0FBakIsRUFQa0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRCxFQUpVO0lBQUEsQ0FMWixDQUFBOztBQUFBLDZCQXFCQSxtQkFBQSxHQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxnQkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxhQUFhLENBQUMsYUFBbkIsQ0FBQSxDQUFiLENBQUE7NkVBQ29CLENBQUUsNkJBRkg7SUFBQSxDQXJCckIsQ0FBQTs7QUFBQSw2QkF5QkEscUJBQUEsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLFVBQUEsZ0JBQUE7QUFBQSxNQUFBLGdCQUFBLEdBQW1CLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBQW5CLENBQUE7QUFDQSxNQUFBLElBQWMsd0JBQWQ7QUFBQSxjQUFBLENBQUE7T0FEQTthQUVBLElBQUMsQ0FBQSxZQUFELEdBQWdCLGdCQUFnQixDQUFDLEVBQWpCLENBQW9CLDBCQUFwQixFQUFnRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEdBQUE7aUJBQzlELEtBQUMsQ0FBQSxNQUFELENBQVEsS0FBUixFQUQ4RDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWhELEVBSEs7SUFBQSxDQXpCdkIsQ0FBQTs7QUFBQSw2QkErQkEseUJBQUEsR0FBMkIsU0FBQSxHQUFBO0FBQ3pCLFVBQUEsSUFBQTs7WUFBYSxDQUFFLEdBQWYsQ0FBQTtPQUFBO2FBQ0EsSUFBQyxDQUFBLFlBQUQsR0FBZ0IsS0FGUztJQUFBLENBL0IzQixDQUFBOztBQUFBLDZCQW1DQSxNQUFBLEdBQVEsU0FBQyxLQUFELEdBQUE7QUFDTixVQUFBLDhCQUFBO0FBQUEsTUFBQSxZQUFBLHFEQUFxQyxDQUFFLGVBQXhCLENBQUEsVUFBZixDQUFBO0FBRUEsTUFBQSxJQUFHLG9CQUFIO0FBQ0UsUUFBQSxJQUFHLGVBQUEsSUFBVSxLQUFLLENBQUMsSUFBTixLQUFjLFFBQTNCO0FBQ0UsVUFBQSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsRUFBQSxHQUFFLFlBQVksQ0FBQyxhQUFmLEdBQThCLG1CQUFqRCxDQUFBLENBQUE7aUJBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsVUFBaEIsRUFGRjtTQUFBLE1BQUE7QUFJRSxVQUFBLElBQUMsQ0FBQSxpQkFBRCxDQUFtQixZQUFZLENBQUMsYUFBaEMsQ0FBQSxDQUFBO0FBQUEsVUFDQSxVQUFBLEdBQWEsSUFBQyxDQUFBLG1CQUFELENBQUEsQ0FBc0IsQ0FBQyxpQkFBdkIsQ0FBQSxDQURiLENBQUE7aUJBRUEsSUFBQyxDQUFBLGNBQUQsQ0FBZ0IsVUFBaEIsRUFORjtTQURGO09BQUEsTUFBQTtBQVNFLFFBQUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLGNBQUQsQ0FBQSxFQVZGO09BSE07SUFBQSxDQW5DUixDQUFBOztBQUFBLDZCQWtEQSxpQkFBQSxHQUFtQixTQUFDLElBQUQsR0FBQTthQUNqQixJQUFDLENBQUEsSUFBRCxDQUFNLGNBQU4sQ0FBcUIsQ0FBQyxJQUF0QixDQUEyQixJQUFBLElBQVEsRUFBbkMsRUFEaUI7SUFBQSxDQWxEbkIsQ0FBQTs7QUFBQSw2QkFxREEsY0FBQSxHQUFnQixTQUFDLFVBQUQsR0FBQTtBQUNkLFVBQUEsOEJBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxFQUFQLENBQUE7QUFFQSxNQUFBLElBQUcsa0JBQUg7QUFDRSxRQUFBLElBQUcsVUFBVSxDQUFDLE1BQVgsS0FBcUIsQ0FBeEI7QUFDRSxVQUFBLElBQUEsSUFBUSxrREFBUixDQURGO1NBQUEsTUFBQTtBQUdFLFVBQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSx5QkFBRCxDQUEyQixVQUEzQixFQUF1QyxPQUF2QyxDQUFiLENBQUE7QUFDQSxVQUFBLElBQUcsVUFBQSxHQUFhLENBQWhCO0FBQ0UsWUFBQSxJQUFBLElBQVMsNkNBQUEsR0FBNEMsVUFBNUMsR0FBd0QsU0FBakUsQ0FERjtXQURBO0FBQUEsVUFHQSxZQUFBLEdBQWUsSUFBQyxDQUFBLHlCQUFELENBQTJCLFVBQTNCLEVBQXVDLFNBQXZDLENBSGYsQ0FBQTtBQUlBLFVBQUEsSUFBRyxZQUFBLEdBQWUsQ0FBbEI7QUFDRSxZQUFBLElBQUEsSUFBUywrQ0FBQSxHQUE4QyxZQUE5QyxHQUE0RCxTQUFyRSxDQURGO1dBUEY7U0FERjtPQUZBO2FBYUEsSUFBQyxDQUFBLElBQUQsQ0FBTSxlQUFOLENBQXNCLENBQUMsSUFBdkIsQ0FBNEIsSUFBNUIsRUFkYztJQUFBLENBckRoQixDQUFBOztBQUFBLDZCQXFFQSx5QkFBQSxHQUEyQixTQUFDLFVBQUQsRUFBYSxRQUFiLEdBQUE7QUFDekIsTUFBQSxJQUFnQixrQkFBaEI7QUFBQSxlQUFPLENBQVAsQ0FBQTtPQUFBO2FBQ0EsVUFBVSxDQUFDLE1BQVgsQ0FBa0IsU0FBQyxTQUFELEdBQUE7ZUFDaEIsU0FBUyxDQUFDLFFBQVYsS0FBc0IsU0FETjtNQUFBLENBQWxCLENBRUEsQ0FBQyxPQUp3QjtJQUFBLENBckUzQixDQUFBOzswQkFBQTs7S0FEMkIsS0FIN0IsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/lint-status-view.coffee