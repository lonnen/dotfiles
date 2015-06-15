(function() {
  var CSON, LintRunner, LintView, View, Violation, ViolationView, path, _,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  path = require('path');

  View = require('atom').View;

  CSON = require('season');

  _ = require('lodash');

  LintRunner = require('./lint-runner');

  ViolationView = require('./violation-view');

  Violation = require('./violation');

  module.exports = LintView = (function(_super) {
    __extends(LintView, _super);

    function LintView() {
      return LintView.__super__.constructor.apply(this, arguments);
    }

    LintView.content = function() {
      return this.div({
        "class": 'lint'
      });
    };

    LintView.prototype.initialize = function(editorView) {
      this.editorView = editorView;
      this.editorView.lintView = this;
      this.editorView.overlayer.append(this);
      this.editor = this.editorView.getEditor();
      this.violationViews = [];
      this.lintRunner = new LintRunner(this.editor);
      this.lintRunner.on('activate', (function(_this) {
        return function() {
          return _this.onLinterActivation();
        };
      })(this));
      this.lintRunner.on('deactivate', (function(_this) {
        return function() {
          return _this.onLinterDeactivation();
        };
      })(this));
      this.lintRunner.on('lint', (function(_this) {
        return function(error, violations) {
          return _this.onLint(error, violations);
        };
      })(this));
      this.lintRunner.startWatching();
      this.editorView.command('lint:move-to-next-violation', (function(_this) {
        return function() {
          return _this.moveToNextViolation();
        };
      })(this));
      return this.editorView.command('lint:move-to-previous-violation', (function(_this) {
        return function() {
          return _this.moveToPreviousViolation();
        };
      })(this));
    };

    LintView.prototype.beforeRemove = function() {
      this.editorView.off('lint:move-to-next-violation lint:move-to-previous-violation');
      this.lintRunner.stopWatching();
      return this.editorView.lintView = void 0;
    };

    LintView.prototype.refresh = function() {
      return this.lintRunner.refresh();
    };

    LintView.prototype.onLinterActivation = function() {
      return this.editorDisplayUpdateSubscription = this.subscribe(this.editorView, 'editor:display-updated', (function(_this) {
        return function() {
          if (_this.pendingViolations != null) {
            _this.addViolationViews(_this.pendingViolations);
            return _this.pendingViolations = null;
          }
        };
      })(this));
    };

    LintView.prototype.onLinterDeactivation = function() {
      var _ref;
      if ((_ref = this.editorDisplayUpdateSubscription) != null) {
        _ref.off();
      }
      return this.removeViolationViews();
    };

    LintView.prototype.onLint = function(error, violations) {
      this.removeViolationViews();
      if (error != null) {
        console.log(error.toString());
        return console.log(error.stack);
      } else if (this.editorView.active) {
        return this.addViolationViews(violations);
      } else {
        return this.pendingViolations = violations;
      }
    };

    LintView.prototype.addViolationViews = function(violations) {
      var violation, violationView, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = violations.length; _i < _len; _i++) {
        violation = violations[_i];
        violationView = new ViolationView(violation, this);
        _results.push(this.violationViews.push(violationView));
      }
      return _results;
    };

    LintView.prototype.removeViolationViews = function() {
      var view, _results;
      _results = [];
      while (view = this.violationViews.shift()) {
        _results.push(view.remove());
      }
      return _results;
    };

    LintView.prototype.getValidViolationViews = function() {
      return this.violationViews.filter(function(violationView) {
        return violationView.isValid;
      });
    };

    LintView.prototype.moveToNextViolation = function() {
      return this.moveToNeighborViolation('next');
    };

    LintView.prototype.moveToPreviousViolation = function() {
      return this.moveToNeighborViolation('previous');
    };

    LintView.prototype.moveToNeighborViolation = function(direction) {
      var comparingMethod, currentCursorPosition, enumerationMethod, neighborViolationView;
      if (this.violationViews.length === 0) {
        atom.beep();
        return;
      }
      if (direction === 'next') {
        enumerationMethod = 'find';
        comparingMethod = 'isGreaterThan';
      } else {
        enumerationMethod = 'findLast';
        comparingMethod = 'isLessThan';
      }
      currentCursorPosition = this.editor.getCursor().getScreenPosition();
      neighborViolationView = _[enumerationMethod](this.getValidViolationViews(), function(violationView) {
        var violationPosition;
        violationPosition = violationView.screenStartPosition;
        return violationPosition[comparingMethod](currentCursorPosition);
      });
      if (neighborViolationView != null) {
        return this.editor.setCursorScreenPosition(neighborViolationView.screenStartPosition);
      } else {
        return atom.beep();
      }
    };

    return LintView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1FQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsTUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FISixDQUFBOztBQUFBLEVBSUEsVUFBQSxHQUFhLE9BQUEsQ0FBUSxlQUFSLENBSmIsQ0FBQTs7QUFBQSxFQUtBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBTGhCLENBQUE7O0FBQUEsRUFNQSxTQUFBLEdBQVksT0FBQSxDQUFRLGFBQVIsQ0FOWixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLE1BQVA7T0FBTCxFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLHVCQUdBLFVBQUEsR0FBWSxTQUFFLFVBQUYsR0FBQTtBQUNWLE1BRFcsSUFBQyxDQUFBLGFBQUEsVUFDWixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsVUFBVSxDQUFDLFFBQVosR0FBdUIsSUFBdkIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFTLENBQUMsTUFBdEIsQ0FBNkIsSUFBN0IsQ0FEQSxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsU0FBWixDQUFBLENBSFYsQ0FBQTtB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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/lint-view.coffee