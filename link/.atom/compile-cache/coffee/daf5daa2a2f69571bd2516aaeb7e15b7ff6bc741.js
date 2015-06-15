(function() {
  var CommandRunner, Point, Range, Rubocop, Violation, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

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
        if (error != null) {
          return callback(error);
        }
        if (result.exitCode === 0 || result.exitCode === 1) {
          try {
            return callback(null, JSON.parse(result.stdout));
          } catch (_error) {
            error = _error;
            return callback(error);
          }
        } else {
          return callback(new Error("Process exited with code " + result.exitCode));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsT0FBQyxDQUFBLGFBQUQsR0FBaUIsU0FBakIsQ0FBQTs7QUFFYSxJQUFBLGlCQUFFLFFBQUYsR0FBQTtBQUFhLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFiO0lBQUEsQ0FGYjs7QUFBQSxzQkFJQSxHQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7YUFDSCxJQUFDLENBQUEsVUFBRCxDQUFZLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDVixjQUFBLDBCQUFBO0FBQUEsVUFBQSxJQUFHLGFBQUg7bUJBQ0UsUUFBQSxDQUFTLEtBQVQsRUFERjtXQUFBLE1BQUE7QUFHRSxZQUFBLElBQUEsR0FBTyxNQUFNLENBQUMsS0FBTSxDQUFBLENBQUEsQ0FBcEIsQ0FBQTtBQUFBLFlBQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxRQUFMLElBQWlCLElBQUksQ0FBQyxRQURqQyxDQUFBO0FBQUEsWUFFQSxVQUFBLEdBQWEsUUFBUSxDQUFDLEdBQVQsQ0FBYSxLQUFDLENBQUEsMEJBQWQsQ0FGYixDQUFBO21CQUdBLFFBQUEsQ0FBUyxJQUFULEVBQWUsVUFBZixFQU5GO1dBRFU7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFaLEVBREc7SUFB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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/rubocop.coffee