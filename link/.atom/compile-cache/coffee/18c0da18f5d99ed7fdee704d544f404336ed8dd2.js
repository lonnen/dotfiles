(function() {
  var CommandRunner, LinterError, Point, Range, ShellCheck, Violation, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  LinterError = require('../linter-error');

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
          return callback(new LinterError("shellcheck exited with code " + result.exitCode, result));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFFQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFDLENBQUEsYUFBRCxHQUFpQixZQUFqQixDQUFBOztBQUVhLElBQUEsb0JBQUUsUUFBRixHQUFBO0FBQWEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQWI7SUFBQSxDQUZiOztBQUFBLHlCQUlBLEdBQUEsR0FBSyxTQUFDLFFBQUQsR0FBQTthQUNILElBQUMsQ0FBQSxhQUFELENBQWUsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLFFBQVIsR0FBQTtBQUNiLGNBQUEsVUFBQTtBQUFBLFVBQUEsSUFBMEIsYUFBMUI7QUFBQSxtQkFBTyxRQUFBLENBQVMsS0FBVCxDQUFQLENBQUE7V0FBQTtBQUFBLFVBQ0EsVUFBQSxHQUFhLFFBQVEsQ0FBQyxHQUFULENBQWEsS0FBQyxDQUFBLDBCQUFkLENBRGIsQ0FBQTtpQkFFQSxRQUFBLENBQVMsSUFBVCxFQUFlLFVBQWYsRUFIYTtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWYsRUFERztJQUFBLENBSkwsQ0FBQTs7QUFBQSx5QkFVQSwwQkFBQSxHQUE0QixTQUFDLE9BQUQsR0FBQTtBQUMxQixVQUFBLGtDQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWtCLElBQUEsS0FBQSxDQUFNLE9BQU8sQ0FBQyxJQUFSLEdBQWUsQ0FBckIsRUFBd0IsT0FBTyxDQUFDLE1BQVIsR0FBaUIsQ0FBekMsQ0FBbEIsQ0FBQTtBQUFBLE1BQ0EsV0FBQSxHQUFrQixJQUFBLEtBQUEsQ0FBTSxXQUFOLEVBQW1CLFdBQW5CLENBRGxCLENBQUE7QUFBQSxNQUdBLFFBQUEsR0FBYyxPQUFPLENBQUMsS0FBUixLQUFpQixPQUFwQixHQUFpQyxPQUFqQyxHQUE4QyxTQUh6RCxDQUFBO2FBSUksSUFBQSxTQUFBLENBQVUsUUFBVixFQUFvQixXQUFwQixFQUFpQyxPQUFPLENBQUMsT0FBekMsRUFMc0I7SUFBQSxDQVY1QixDQUFBOztBQUFBLHlCQWlCQSxhQUFBLEdBQWUsU0FBQyxRQUFELEdBQUE7QUFDYixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxJQUFBLGFBQUEsQ0FBYyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQWQsQ0FBYixDQUFBO2FBRUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDVCxRQUFBLElBQTBCLGFBQTFCO0FBQUEsaUJBQU8sUUFBQSxDQUFTLEtBQVQsQ0FBUCxDQUFBO1NBQUE7QUFHQSxRQUFBLElBQUcsTUFBTSxDQUFDLFFBQVAsS0FBbUIsQ0FBbkIsSUFBd0IsTUFBTSxDQUFDLFFBQVAsS0FBbUIsQ0FBOUM7QUFDRTttQkFDRSxRQUFBLENBQVMsSUFBVCxFQUFlLElBQUksQ0FBQyxLQUFMLENBQVcsTUFBTSxDQUFDLE1BQWxCLENBQWYsRUFERjtXQUFBLGNBQUE7QUFHRSxZQURJLGNBQ0osQ0FBQTttQkFBQSxRQUFBLENBQVMsS0FBVCxFQUhGO1dBREY7U0FBQSxNQUFBO2lCQU1FLFFBQUEsQ0FBYSxJQUFBLFdBQUEsQ0FBYSw4QkFBQSxHQUE2QixNQUFNLENBQUMsUUFBakQsRUFBOEQsTUFBOUQsQ0FBYixFQU5GO1NBSlM7TUFBQSxDQUFYLEVBSGE7SUFBQSxDQWpCZixDQUFBOztBQUFBLHlCQWdDQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSwyQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BRUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixDQUZyQixDQUFBO0FBSUEsTUFBQSxJQUFHLDBCQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLGtCQUFiLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsWUFBYixDQUFBLENBSEY7T0FKQTtBQUFBLE1BU0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxVQUFiLEVBQXlCLE1BQXpCLEVBQWlDLElBQUMsQ0FBQSxRQUFsQyxDQVRBLENBQUE7YUFVQSxRQVhZO0lBQUEsQ0FoQ2QsQ0FBQTs7c0JBQUE7O01BUEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/shellcheck.coffee