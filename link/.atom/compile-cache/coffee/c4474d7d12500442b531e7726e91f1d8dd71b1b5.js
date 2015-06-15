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
        var bufferPoint, bufferRange, col, elements, file, item, line, msg, severity, violations, x, _i, _len, _ref1;
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
            elements = (function() {
              var _j, _len1, _ref2, _results;
              _ref2 = item.split(':');
              _results = [];
              for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                x = _ref2[_j];
                _results.push(x.trim());
              }
              return _results;
            })();
            if (elements.length !== 4) {
              continue;
            }
            file = elements[0], line = elements[1], col = elements[2], msg = elements[3];
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
      var command, userFlake8Config, userFlake8Path;
      command = [];
      userFlake8Path = atom.config.get('atom-lint.flake8.path');
      userFlake8Config = atom.config.get('atom-lint.flake8.configPath');
      if (userFlake8Path != null) {
        command.push(userFlake8Path);
      } else {
        command.push('flake8');
      }
      if (userFlake8Config != null) {
        command.push("--config=" + userFlake8Config);
      }
      command.push(this.filePath);
      return command;
    };

    return Flake8;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUhkLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxNQUFDLENBQUEsYUFBRCxHQUFpQixRQUFqQixDQUFBOztBQUVhLElBQUEsZ0JBQUUsUUFBRixHQUFBO0FBQWEsTUFBWixJQUFDLENBQUEsV0FBQSxRQUFXLENBQWI7SUFBQSxDQUZiOztBQUFBLHFCQUlBLEdBQUEsR0FBSyxTQUFDLFFBQUQsR0FBQTthQUNILElBQUMsQ0FBQSxTQUFELENBQVcsU0FBQyxLQUFELEVBQVEsVUFBUixHQUFBO0FBQ1QsUUFBQSxJQUFHLGFBQUg7aUJBQ0UsUUFBQSxDQUFTLEtBQVQsRUFERjtTQUFBLE1BQUE7aUJBR0UsUUFBQSxDQUFTLElBQVQsRUFBZSxVQUFmLEVBSEY7U0FEUztNQUFBLENBQVgsRUFERztJQUFBLENBSkwsQ0FBQTs7QUFBQSxxQkFXQSxTQUFBLEdBQVcsU0FBQyxRQUFELEdBQUE7QUFDVCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxJQUFBLGFBQUEsQ0FBYyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQWQsQ0FBYixDQUFBO2FBRUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxTQUFDLEtBQUQsRUFBUSxNQUFSLEdBQUE7QUFDVCxZQUFBLHdHQUFBO0FBQUEsUUFBQSxJQUEwQixhQUExQjtBQUFBLGlCQUFPLFFBQUEsQ0FBUyxLQUFULENBQVAsQ0FBQTtTQUFBO0FBRUEsUUFBQSxJQUFHLE1BQU0sQ0FBQyxRQUFQLEtBQW1CLENBQW5CLElBQXdCLE1BQU0sQ0FBQyxRQUFQLEtBQW1CLENBQTlDO0FBR0UsVUFBQSxVQUFBLEdBQWEsRUFBYixDQUFBO0FBQ0E7QUFBQSxlQUFBLDRDQUFBOzZCQUFBO0FBQ0UsWUFBQSxJQUFHLENBQUEsSUFBSDtBQUFpQix1QkFBakI7YUFBQTtBQUFBLFlBRUEsUUFBQTs7QUFBWTtBQUFBO21CQUFBLDhDQUFBOzhCQUFBO0FBQUEsOEJBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBQSxFQUFBLENBQUE7QUFBQTs7Z0JBRlosQ0FBQTtBQUdBLFlBQUEsSUFBZ0IsUUFBUSxDQUFDLE1BQVQsS0FBbUIsQ0FBbkM7QUFBQSx1QkFBQTthQUhBO0FBQUEsWUFJQyxrQkFBRCxFQUFPLGtCQUFQLEVBQWEsaUJBQWIsRUFBa0IsaUJBSmxCLENBQUE7QUFBQSxZQU1BLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sUUFBQSxDQUFTLElBQVQsQ0FBQSxHQUFpQixDQUF2QixFQUEwQixRQUFBLENBQVMsR0FBVCxDQUFBLEdBQWdCLENBQTFDLENBTmxCLENBQUE7QUFBQSxZQU9BLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sV0FBTixFQUFtQixXQUFuQixDQVBsQixDQUFBO0FBQUEsWUFZQSxRQUFBO0FBQVcsc0JBQU8sR0FBSSxZQUFYO0FBQUEscUJBQ0osTUFESTtBQUFBLHFCQUNJLE1BREo7QUFBQSxxQkFDWSxNQURaO0FBQUEscUJBQ29CLE1BRHBCO3lCQUNnQyxRQURoQztBQUFBO0FBR1Asa0JBQUEsSUFBRyxHQUFJLENBQUEsQ0FBQSxDQUFKLEtBQVUsR0FBYjsyQkFBc0IsUUFBdEI7bUJBQUEsTUFBQTsyQkFBbUMsVUFBbkM7bUJBSE87QUFBQTtnQkFaWCxDQUFBO0FBQUEsWUFpQkEsVUFBVSxDQUFDLElBQVgsQ0FBb0IsSUFBQSxTQUFBLENBQVUsUUFBVixFQUFvQixXQUFwQixFQUFpQyxHQUFqQyxDQUFwQixDQWpCQSxDQURGO0FBQUEsV0FEQTtpQkFxQkEsUUFBQSxDQUFTLElBQVQsRUFBZSxVQUFmLEVBeEJGO1NBQUEsTUFBQTtpQkEwQkUsUUFBQSxDQUFhLElBQUEsV0FBQSxDQUFhLDBCQUFBLEdBQTBCLE1BQU0sQ0FBQyxRQUE5QyxFQUEwRCxNQUExRCxDQUFiLEVBMUJGO1NBSFM7TUFBQSxDQUFYLEVBSFM7SUFBQSxDQVhYLENBQUE7O0FBQUEscUJBNkNBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLHlDQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsTUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix1QkFBaEIsQ0FGakIsQ0FBQTtBQUFBLE1BR0EsZ0JBQUEsR0FBbUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDZCQUFoQixDQUhuQixDQUFBO0FBS0EsTUFBQSxJQUFHLHNCQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLGNBQWIsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxRQUFiLENBQUEsQ0FIRjtPQUxBO0FBVUEsTUFBQSxJQUFHLHdCQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFjLFdBQUEsR0FBVyxnQkFBekIsQ0FBQSxDQURGO09BVkE7QUFBQSxNQWFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBQyxDQUFBLFFBQWQsQ0FiQSxDQUFBO2FBY0EsUUFmWTtJQUFBLENBN0NkLENBQUE7O2tCQUFBOztNQVBGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/flake8.coffee