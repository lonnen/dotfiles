(function() {
  var CommandRunner, DIAGNOSTIC_PATTERN, LinterError, Point, Range, Rustc, Violation, util, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  LinterError = require('../linter-error');

  util = require('../util');

  DIAGNOSTIC_PATTERN = /^(.+):(\d+):(\d+):\s*(\d+):(\d+)\s*([^:]+)\s*:\s*([^]+)/;

  module.exports = Rustc = (function() {
    Rustc.canonicalName = 'rustc';

    function Rustc(filePath) {
      this.filePath = filePath;
    }

    Rustc.prototype.run = function(callback) {
      return this.runRustc(function(error, violations) {
        if (error != null) {
          return callback(error);
        } else {
          return callback(null, violations);
        }
      });
    };

    Rustc.prototype.runRustc = function(callback) {
      var runner;
      runner = new CommandRunner(this.buildCommand());
      return runner.run((function(_this) {
        return function(error, result) {
          var violations;
          if (error != null) {
            return callback(error);
          }
          if (result.exitCode === 0 || result.exitCode === 101) {
            violations = _this.parseDiagnostics(result.stderr);
            return callback(null, violations);
          } else {
            return callback(new LinterError("rustc exited with code " + result.exitCode, result));
          }
        };
      })(this));
    };

    Rustc.prototype.parseDiagnostics = function(log) {
      var bufferRange, columnNumber, columnNumber2, endPoint, line, lineNumber, lineNumber2, lines, matches, message, severity, startPoint, _, _i, _len, _results;
      lines = log.split('\n');
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (!(matches = line.match(DIAGNOSTIC_PATTERN))) {
          continue;
        }
        _ = matches[0], _ = matches[1], lineNumber = matches[2], columnNumber = matches[3], lineNumber2 = matches[4], columnNumber2 = matches[5], severity = matches[6], message = matches[7];
        if (severity === 'note') {
          continue;
        }
        startPoint = new Point(parseInt(lineNumber - 1), parseInt(columnNumber - 1));
        endPoint = new Point(parseInt(lineNumber2 - 1), parseInt(columnNumber2 - 1));
        bufferRange = new Range(startPoint, endPoint);
        _results.push(new Violation(severity, bufferRange, message));
      }
      return _results;
    };

    Rustc.prototype.buildCommand = function() {
      var command, userRustcPath;
      command = [];
      userRustcPath = atom.config.get('atom-lint.rustc.path');
      if (userRustcPath != null) {
        command.push(userRustcPath);
      } else {
        command.push('rustc');
      }
      command.push('--parse-only');
      command.push(this.filePath);
      return command;
    };

    return Rustc;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBGQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUhkLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FKUCxDQUFBOztBQUFBLEVBTUEsa0JBQUEsR0FBcUIseURBTnJCLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxLQUFDLENBQUEsYUFBRCxHQUFpQixPQUFqQixDQUFBOztBQUVhLElBQUEsZUFBRSxRQUFGLEdBQUE7QUFBYSxNQUFaLElBQUMsQ0FBQSxXQUFBLFFBQVcsQ0FBYjtJQUFBLENBRmI7O0FBQUEsb0JBSUEsR0FBQSxHQUFLLFNBQUMsUUFBRCxHQUFBO2FBQ0gsSUFBQyxDQUFBLFFBQUQsQ0FBVSxTQUFDLEtBQUQsRUFBUSxVQUFSLEdBQUE7QUFDUixRQUFBLElBQUcsYUFBSDtpQkFDRSxRQUFBLENBQVMsS0FBVCxFQURGO1NBQUEsTUFBQTtpQkFHRSxRQUFBLENBQVMsSUFBVCxFQUFlLFVBQWYsRUFIRjtTQURRO01BQUEsQ0FBVixFQURHO0lBQUEsQ0FKTCxDQUFBOztBQUFBLG9CQVdBLFFBQUEsR0FBVSxTQUFDLFFBQUQsR0FBQTtBQUNSLFVBQUEsTUFBQTtBQUFBLE1BQUEsTUFBQSxHQUFhLElBQUEsYUFBQSxDQUFjLElBQUMsQ0FBQSxZQUFELENBQUEsQ0FBZCxDQUFi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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/rustc.coffee