(function() {
  var CSON, Config, Emitter, LINTER_MAP, LintRunner, Subscriber, path, _ref;

  path = require('path');

  CSON = require('season');

  _ref = require('emissary'), Emitter = _ref.Emitter, Subscriber = _ref.Subscriber;

  Config = require('./config');

  LINTER_MAP = CSON.readFileSync(path.join(__dirname, 'linter-map.cson'));

  module.exports = LintRunner = (function() {
    Emitter.includeInto(LintRunner);

    Subscriber.includeInto(LintRunner);

    function LintRunner(editor) {
      this.editor = editor;
      this.buffer = this.editor.getBuffer();
      this.lastViolations = null;
    }

    LintRunner.prototype.startWatching = function() {
      if (this.isWatching()) {
        return;
      }
      this.switchLinter();
      return this.grammerChangeSubscription = this.subscribe(this.editor, 'grammar-changed', (function(_this) {
        return function() {
          return _this.switchLinter();
        };
      })(this));
    };

    LintRunner.prototype.stopWatching = function() {
      if (this.grammerChangeSubscription != null) {
        this.grammerChangeSubscription.off();
        this.grammerChangeSubscription = null;
      }
      return this.deactivate();
    };

    LintRunner.prototype.refresh = function() {
      if (!this.isWatching()) {
        return;
      }
      return this.switchLinter();
    };

    LintRunner.prototype.isWatching = function() {
      return this.grammerChangeSubscription != null;
    };

    LintRunner.prototype.switchLinter = function() {
      var linterConfig, linterName, scopeName;
      scopeName = this.editor.getGrammar().scopeName;
      linterName = LINTER_MAP[scopeName];
      if (!linterName) {
        return this.deactivate();
      }
      linterConfig = new Config(linterName);
      if (!linterConfig.isFileToLint(this.getFilePath())) {
        return this.deactivate();
      }
      return this.activate(linterName);
    };

    LintRunner.prototype.activate = function(linterName) {
      var linterPath, wasAlreadyActivated;
      wasAlreadyActivated = this.linterConstructor != null;
      linterPath = "./linter/" + linterName;
      this.linterConstructor = require(linterPath);
      if (!wasAlreadyActivated) {
        this.emit('activate');
      }
      this.lint();
      if (this.bufferSubscription == null) {
        return this.bufferSubscription = this.subscribe(this.buffer, 'saved reloaded', (function(_this) {
          return function() {
            return _this.lint();
          };
        })(this));
      }
    };

    LintRunner.prototype.deactivate = function() {
      this.lastViolations = null;
      if (this.bufferSubscription != null) {
        this.bufferSubscription.off();
        this.bufferSubscription = null;
      }
      if (this.linterConstructor != null) {
        this.linterConstructor = null;
        return this.emit('deactivate');
      }
    };

    LintRunner.prototype.lint = function() {
      var linter;
      linter = new this.linterConstructor(this.getFilePath());
      return linter.run((function(_this) {
        return function(error, violations) {
          _this.setLastViolations(violations);
          return _this.emit('lint', error, _this.lastViolations);
        };
      })(this));
    };

    LintRunner.prototype.getFilePath = function() {
      return this.buffer.getUri();
    };

    LintRunner.prototype.getActiveLinter = function() {
      return this.linterConstructor;
    };

    LintRunner.prototype.getLastViolations = function() {
      return this.lastViolations;
    };

    LintRunner.prototype.setLastViolations = function(violations) {
      this.lastViolations = violations;
      if (this.lastViolations == null) {
        return;
      }
      return this.lastViolations = this.lastViolations.sort(function(a, b) {
        return a.bufferRange.compare(b.bufferRange);
      });
    };

    return LintRunner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFFQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFFQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGVBQUEsT0FBRCxFQUFVLGtCQUFBLFVBRlYsQ0FBQTs7QUFBQSxFQUdBLE1BQUEsR0FBUyxPQUFBLENBQVEsVUFBUixDQUhULENBQUE7O0FBQUEsRUFLQSxVQUFBLEdBQWEsSUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBSSxDQUFDLElBQUwsQ0FBVSxTQUFWLEVBQXFCLGlCQUFyQixDQUFsQixDQUxiLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixVQUFwQixDQUFBLENBQUE7O0FBQUEsSUFDQSxVQUFVLENBQUMsV0FBWCxDQUF1QixVQUF2QixDQURBLENBQUE7O0FBR2EsSUFBQSxvQkFBRSxNQUFGLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxTQUFBLE1BQ2IsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBRGxCLENBRFc7SUFBQSxDQUhiOztBQUFBLHlCQU9BLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixNQUFBLElBQVUsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFWO0FBQUEsY0FBQSxDQUFBO09BQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FGQSxDQUFBO2FBSUEsSUFBQyxDQUFBLHlCQUFE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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/lint-runner.coffee