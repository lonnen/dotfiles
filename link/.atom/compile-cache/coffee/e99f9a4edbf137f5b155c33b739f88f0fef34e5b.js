(function() {
  var CommandRunner, Flake8, LinterError, Point, Range, Violation, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  LinterError = require('../linter-error');

  module.exports = Flake8 = (function() {
    Flake8.canonicalName = 'flake8';

    function Flake8(filePath) {
      this.filePath = filePath;
    }

    Flake8.prototype.run = function(callback) {
      return this.runFlake8(function(error, violations) {
        if (error != null) {
          return callback(error);
        } else {
          return callback(null, violations);
        }
      });
    };

    Flake8.prototype.runFlake8 = function(callback) {
      var runner;
      runner = new CommandRunner(this.buildCommand());
      return runner.run(function(error, result) {
        var bufferPoint, bufferRange, col, file, item, line, msg, severity, violations, x, _i, _len, _ref1, _ref2;
        if (error != null) {
          return callback(error);
        }
        if (result.exitCode === 0 || result.exitCode === 1) {
          violations = [];
          _ref1 = result.stdout.split('\n');
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            if (!item) {
              continue;
            }
            _ref2 = (function() {
              var _j, _len1, _ref2, _results;
              _ref2 = item.split(':');
              _results = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                x = _ref2[_j];
                _results.push(x.trim());
              }
              return _results;
            })(), file = _ref2[0], line = _ref2[1], col = _ref2[2], msg = _ref2[3];
            bufferPoint = new Point(parseInt(line) - 1, parseInt(col) - 1);
            bufferRange = new Range(bufferPoint, bufferPoint);
            severity = (function() {
              switch (msg.slice(0, 4)) {
                case 'F821':
                case 'F822':
                case 'F823':
                case 'F831':
                  return 'error';
                default:
                  if (msg[0] === 'E') {
                    return 'error';
                  } else {
                    return 'warning';
                  }
              }
            })();
            violations.push(new Violation(severity, bufferRange, msg));
          }
          return callback(null, violations);
        } else {
          return callback(new LinterError("flake8 exited with code " + result.exitCode, result));
        }
      });
    };

    Flake8.prototype.buildCommand = function() {
      var command, userFlake8Path;
      command = [];
      userFlake8Path = atom.config.get('atom-lint.flake8.path');
      if (userFlake8Path != null) {
        command.push(userFlake8Path);
      } else {
        command.push('flake8');
      }
      command.push(this.filePath);
      return command;
    };

    return Flake8;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxNQUFDLENBQUEsYUFBRCxHQUFpQixRQUFqQixDQUFBOztBQUVhLElBQUEsZ0JBQUUsUUFBRixHQUFBO0FBQWEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQWI7SUFBQSxDQUZiOztBQUFBLHFCQUlBLEdBQUEsR0FBSyxTQUFDLFFBQUQsR0FBQTthQUNILElBQUMsQ0FBQSxTQUFELENBQVcsU0FBQyxLQUFELEVBQVEsVUFBUixHQUFBO0FBQ1QsUUFBQSxJQUFHLGFBQUg7aUJBQ0UsUUFBQSxDQUFTLEtBQVQsRUFERjtTQUFBLE1BQUE7aUJBR0UsUUFBQSxDQUFTLElBQVQsRUFBZSxVQUFmLEVBSEY7U0FEUztNQUFBLENBQVgsRUFERztJQUFBLENBSkwsQ0FBQTs7QUFBQSxxQkFXQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxJQUFBLGFBQUEsQ0FBYyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQWQsQ0FBYixDQUFBO2FBRUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDVCxZQUFBLHFHQUFBO0FBQUEsUUFBQSxJQUEwQixhQUExQjtBQUFBLGlCQUFPLFFBQUEsQ0FBUyxLQUFULENBQVAsQ0FBQTtTQUFBO0FBRUEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxRQUFQLEtBQW1CLENBQW5CLElBQXdCLE1BQU0sQ0FBQyxRQUFQLEtBQW1CLENBQTlDO0FBR0UsVUFBQSxVQUFBLEdBQWEsRUFBYixDQUFBO0FBQ0E7QUFBQSxlQUFBLDRDQUFBOzZCQUFBO0FBQ0UsWUFBQSxJQUFHLENBQUEsSUFBSDtBQUFpQix1QkFBakI7YUFBQTtBQUFBLFlBRUE7O0FBQTBCO0FBQUE7bUJBQUEsOENBQUE7OEJBQUE7QUFBQSw4QkFBQSxDQUFDLENBQUMsSUFBRixDQUFBLEVBQUEsQ0FBQTtBQUFBOztnQkFBMUIsRUFBQyxlQUFELEVBQU8sZUFBUCxFQUFhLGNBQWIsRUFBa0IsY0FGbEIsQ0FBQTtBQUFBLFlBSUEsV0FBQSxHQUFrQixJQUFBLEtBQUEsQ0FBTSxRQUFBLENBQVMsSUFBVCxDQUFBLEdBQWlCLENBQXZCLEVBQTBCLFFBQUEsQ0FBUyxHQUFULENBQUEsR0FBZ0IsQ0FBMUMsQ0FKbEIsQ0FBQTtBQUFBLFlBS0EsV0FBQSxHQUFrQixJQUFBLEtBQUEsQ0FBTSxXQUFOLEVBQW1CLFdBQW5CLENBTGxCLENBQUE7QUFBQSxZQVVBLFFBQUE7QUFBVyxzQkFBTyxHQUFJLFlBQVg7QUFBQSxxQkFDSixNQURJO0FBQUEscUJBQ0ksTUFESjtBQUFBLHFCQUNZLE1BRFo7QUFBQSxxQkFDb0IsTUFEcEI7eUJBQ2dDLFFBRGhDO0FBQUE7QUFHUCxrQkFBQSxJQUFHLEdBQUksQ0FBQSxDQUFBLENBQUosS0FBVSxHQUFiOzJCQUFzQixRQUF0QjttQkFBQSxNQUFBOzJCQUFtQyxVQUFuQzttQkFITztBQUFBO2dCQVZYLENBQUE7QUFBQSxZQWVBLFVBQVUsQ0FBQyxJQUFYLENBQW9CLElBQUEsU0FBQSxDQUFVLFFBQVYsRUFBb0IsV0FBcEIsRUFBaUMsR0FBakMsQ0FBcEIsQ0FmQSxDQURGO0FBQUEsV0FEQTtpQkFtQkEsUUFBQSxDQUFTLElBQVQsRUFBZSxVQUFmLEVBdEJGO1NBQUEsTUFBQTtpQkF3QkUsUUFBQSxDQUFhLElBQUEsV0FBQSxDQUFhLDBCQUFBLEdBQXlCLE1BQU0sQ0FBQyxRQUE3QyxFQUEwRCxNQUExRCxDQUFiLEVBeEJGO1NBSFM7TUFBQSxDQUFYLEVBSFM7SUFBQSxDQVhYLENBQUE7O0FBQUEscUJBMkNBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLHVCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsTUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FGakIsQ0FBQTtBQUlBLE1BQUEsSUFBRyxzQkFBSDtBQUNFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxjQUFiLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsUUFBYixDQUFBLENBSEY7T0FKQTtBQUFBLE1BU0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsUUFBZCxDQVRBLENBQUE7YUFVQSxRQVhZO0lBQUEsQ0EzQ2QsQ0FBQTs7a0JBQUE7O01BUEYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/flake8.coffee