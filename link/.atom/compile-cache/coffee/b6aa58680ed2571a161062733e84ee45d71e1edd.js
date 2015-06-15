(function() {
  var CommandRunner, Point, Range, ShellCheck, Violation, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  module.exports = ShellCheck = (function() {
    ShellCheck.canonicalName = 'ShellCheck';

    function ShellCheck(filePath) {
      this.filePath = filePath;
    }

    ShellCheck.prototype.run = function(callback) {
      return this.runShellCheck((function(_this) {
        return function(error, comments) {
          var violations;
          if (error != null) {
            return callback(error);
          }
          violations = comments.map(_this.createViolationFromComment);
          return callback(null, violations);
        };
      })(this));
    };

    ShellCheck.prototype.createViolationFromComment = function(comment) {
      var bufferPoint, bufferRange, severity;
      bufferPoint = new Point(comment.line - 1, comment.column - 1);
      bufferRange = new Range(bufferPoint, bufferPoint);
      severity = comment.level === 'error' ? 'error' : 'warning';
      return new Violation(severity, bufferRange, comment.message);
    };

    ShellCheck.prototype.runShellCheck = function(callback) {
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

    ShellCheck.prototype.buildCommand = function() {
      var command, userShellCheckPath;
      command = [];
      userShellCheckPath = atom.config.get('atom-lint.shellcheck.path');
      if (userShellCheckPath != null) {
        command.push(userShellCheckPath);
      } else {
        command.push('shellcheck');
      }
      command.push('--format', 'json', this.filePath);
      return command;
    };

    return ShellCheck;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdEQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBQyxDQUFBLGFBQUQsR0FBaUIsWUFBakIsQ0FBQTs7QUFFYSxJQUFBLG9CQUFFLFFBQUYsR0FBQTtBQUFhLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFiO0lBQUEsQ0FGYjs7QUFBQSx5QkFJQSxHQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7YUFDSCxJQUFDLENBQUEsYUFBRCxDQUFlLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsRUFBUSxRQUFSLEdBQUE7QUFDYixjQUFBLFVBQUE7QUFBQSxVQUFBLElBQTBCLGFBQTFCO0FBQUEsbUJBQU8sUUFBQSxDQUFTLEtBQVQsQ0FBUCxDQUFBO1dBQUE7QUFBQSxVQUNBLFVBQUEsR0FBYSxRQUFRLENBQUMsR0FBVCxDQUFhLEtBQUMsQ0FBQSwwQkFBZCxDQURiLENBQUE7aUJBRUEsUUFBQSxDQUFTLElBQVQsRUFBZSxVQUFmLEVBSGE7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFmLEVBREc7SUFBQSxDQUpMLENBQUE7O0FBQUEseUJBVUEsMEJBQUEsR0FBNEIsU0FBQyxPQUFELEdBQUE7QUFDMUIsVUFBQSxrQ0FBQTtBQUFBLE1BQUEsV0FBQSxHQUFrQixJQUFBLEtBQUEsQ0FBTSxPQUFPLENBQUMsSUFBUixHQUFlLENBQXJCLEVBQXdCLE9BQU8sQ0FBQyxNQUFSLEdBQWlCLENBQXpDLENBQWxCLENBQUE7QUFBQSxNQUNBLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sV0FBTixFQUFtQixXQUFuQixDQURsQixDQUFBO0FBQUEsTUFHQSxRQUFBLEdBQWMsT0FBTyxDQUFDLEtBQVIsS0FBaUIsT0FBcEIsR0FBaUMsT0FBakMsR0FBOEMsU0FIekQsQ0FBQTthQUlJLElBQUEsU0FBQSxDQUFVLFFBQVYsRUFBb0IsV0FBcEIsRUFBaUMsT0FBTyxDQUFDLE9BQXpDLEVBTHNCO0lBQUEsQ0FWNUIsQ0FBQTs7QUFBQSx5QkFpQkEsYUFBQSxHQUFlLFNBQUMsUUFBRCxHQUFBO0FBQ2IsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxhQUFBLENBQWMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFkLENBQWIsQ0FBQTthQUVBLE1BQU0sQ0FBQyxHQUFQLENBQVcsU0FBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ1QsUUFBQSxJQUEwQixhQUExQjtBQUFBLGlCQUFPLFFBQUEsQ0FBUyxLQUFULENBQVAsQ0FBQTtTQUFBO0FBR0EsUUFBQSxJQUFHLE1BQU0sQ0FBQyxRQUFQLEtBQW1CLENBQW5CLElBQXdCLE1BQU0sQ0FBQyxRQUFQLEtBQW1CLENBQTlDO0FBQ0U7bUJBQ0UsUUFBQSxDQUFTLElBQVQsRUFBZSxJQUFJLENBQUMsS0FBTCxDQUFXLE1BQU0sQ0FBQyxNQUFsQixDQUFmLEVBREY7V0FBQSxjQUFBO0FBR0UsWUFESSxjQUNKLENBQUE7bUJBQUEsUUFBQSxDQUFTLEtBQVQsRUFIRjtXQURGO1NBQUEsTUFBQTtpQkFNRSxRQUFBLENBQWEsSUFBQSxLQUFBLENBQU8sMkJBQUEsR0FBMEIsTUFBTSxDQUFDLFFBQXhDLENBQWIsRUFORjtTQUpTO01BQUEsQ0FBWCxFQUhhO0lBQUEsQ0FqQmYsQ0FBQTs7QUFBQSx5QkFnQ0EsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNaLFVBQUEsMkJBQUE7QUFBQSxNQUFBLE9BQUEsR0FBVSxFQUFWLENBQUE7QUFBQSxNQUVBLGtCQUFBLEdBQXFCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQiwyQkFBaEIsQ0FGckIsQ0FBQTtBQUlBLE1BQUEsSUFBRywwQkFBSDtBQUNFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxrQkFBYixDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFlBQWIsQ0FBQSxDQUhGO09BSkE7QUFBQSxNQVNBLE9BQU8sQ0FBQyxJQUFSLENBQWEsVUFBYixFQUF5QixNQUF6QixFQUFpQyxJQUFDLENBQUEsUUFBbEMsQ0FUQSxDQUFBO2FBVUEsUUFYWTtJQUFBLENBaENkLENBQUE7O3NCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/shellcheck.coffee