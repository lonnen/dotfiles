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
            _this.pendingViolations = null;
          }
          return _this.updateGutterMarkers();
        };
      })(this));
    };

    LintView.prototype.onLinterDeactivation = function() {
      var _ref;
      if ((_ref = this.editorDisplayUpdateSubscription) != null) {
        _ref.off();
      }
      this.removeViolationViews();
      return this.updateGutterMarkers();
    };

    LintView.prototype.onLint = function(error, violations) {
      this.removeViolationViews();
      if (error != null) {
        console.log(error.toString());
        console.log(error.stack);
      } else if (this.editorView.active) {
        this.addViolationViews(violations);
      } else {
        this.pendingViolations = violations;
      }
      return this.updateGutterMarkers();
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

    LintView.prototype.updateGutterMarkers = function() {
      var gutterView, klass, line, severity, violationView, _i, _j, _len, _len1, _ref, _ref1, _results;
      gutterView = this.editorView.gutter;
      if (gutterView.length === 0) {
        return;
      }
      if (!gutterView.isVisible()) {
        return;
      }
      _ref = Violation.SEVERITIES;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        severity = _ref[_i];
        gutterView.removeClassFromAllLines("lint-" + severity);
      }
      if (this.violationViews.length === 0) {
        return;
      }
      _ref1 = this.getValidViolationViews();
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        violationView = _ref1[_j];
        line = violationView.getCurrentBufferStartPosition().row;
        klass = "lint-" + violationView.violation.severity;
        _results.push(gutterView.addClassToLine(line, klass));
      }
      return _results;
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