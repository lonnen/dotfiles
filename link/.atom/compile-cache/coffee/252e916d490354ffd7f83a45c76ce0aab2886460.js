(function() {
  var CommandRunner, LinterError, Point, Range, Rubocop, Violation, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  LinterError = require('../linter-error');

  module.exports = Rubocop = (function() {
    Rubocop.canonicalName = 'RuboCop';

    function Rubocop(filePath) {
      this.filePath = filePath;
    }

    Rubocop.prototype.run = function(callback) {
      return this.runRubocop((function(_this) {
        return function(error, result) {
          var file, offenses, violations;
          if (error != null) {
            return callback(error);
          } else {
            file = result.files[0];
            offenses = file.offenses || file.offences;
            violations = offenses.map(_this.createViolationFromOffense);
            return callback(null, violations);
          }
        };
      })(this));
    };

    Rubocop.prototype.createViolationFromOffense = function(offense) {
      var bufferRange, location, severity, startPoint;
      location = offense.location;
      startPoint = new Point(location.line - 1, location.column - 1);
      bufferRange = location.length != null ? Range.fromPointWithDelta(startPoint, 0, location.length) : new Range(startPoint, startPoint);
      severity = (function() {
        switch (offense.severity) {
          case 'error':
          case 'fatal':
            return 'error';
          default:
            return 'warning';
        }
      })();
      return new Violation(severity, bufferRange, offense.message);
    };

    Rubocop.prototype.runRubocop = function(callback) {
      var runner;
      runner = new CommandRunner(this.buildCommand());
      return runner.run(function(error, result) {
        var escapedStdout;
        if (error != null) {
          return callback(error);
        }
        if (result.exitCode === 0 || result.exitCode === 1) {
          try {
            return callback(null, JSON.parse(result.stdout));
          } catch (_error) {
            error = _error;
            escapedStdout = JSON.stringify(result.stdout);
            return callback(new LinterError("Failed parsing RuboCop's JSON output " + escapedStdout, result));
          }
        } else {
          return callback(new LinterError("rubocop exited with code " + result.exitCode, result));
        }
      });
    };

    Rubocop.prototype.buildCommand = function() {
      var command, userRubocopPath;
      command = [];
      userRubocopPath = atom.config.get('atom-lint.rubocop.path');
      if (userRubocopPath != null) {
        command.push(userRubocopPath);
      } else {
        command.push('rubocop');
      }
      command.push('--format', 'json', this.filePath);
      return command;
    };

    return Rubocop;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxPQUFDLENBQUEsYUFBRCxHQUFpQixTQUFqQixDQUFBOztBQUVhLElBQUEsaUJBQUUsUUFBRixHQUFBO0FBQWEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQWI7SUFBQSxDQUZiOztBQUFBLHNCQUlBLEdBQUEsR0FBSyxTQUFDLFFBQUQsR0FBQTthQUNILElBQUMsQ0FBQSxVQUFELENBQVksQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNWLGNBQUEsMEJBQUE7QUFBQSxVQUFBLElBQUcsYUFBSDttQkFDRSxRQUFBLENBQVMsS0FBVCxFQURGO1dBQUEsTUFBQTtBQUdFLFlBQUEsSUFBQSxHQUFPLE1BQU0sQ0FBQyxLQUFNLENBQUEsQ0FBQSxDQUFwQixDQUFBO0FBQUEsWUFDQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFFBQUwsSUFBaUIsSUFBSSxDQUFDLFFBRGpDLENBQUE7QUFBQSxZQUVBLFVBQUEsR0FBYSxRQUFRLENBQUMsR0FBVCxDQUFhLEtBQUMsQ0FBQSwwQkFBZCxDQUZiLENBQUE7bUJBR0EsUUFBQSxDQUFTLElBQVQsRUFBZSxVQUFmLEVBTkY7V0FEVTtR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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/rubocop.coffee