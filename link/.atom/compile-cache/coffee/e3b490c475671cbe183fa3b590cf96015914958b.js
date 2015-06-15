(function() {
  var CommandRunner, ERROR_PATTERN, Erlc, LinterError, Point, Range, Violation, path, _ref;

  path = require('path');

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  LinterError = require('../linter-error');

  ERROR_PATTERN = /^(.+):(\d+):\s*([^]+)/;

  module.exports = Erlc = (function() {
    Erlc.canonicalName = 'erlc';

    function Erlc(filePath) {
      this.filePath = filePath;
    }

    Erlc.prototype.run = function(callback) {
      return this.runErlc(function(error, violations) {
        if (error != null) {
          return callback(error);
        } else {
          return callback(null, violations);
        }
      });
    };

    Erlc.prototype.runErlc = function(callback) {
      var runner;
      runner = new CommandRunner(this.buildCommand());
      return runner.run((function(_this) {
        return function(error, result) {
          var violations;
          if (error != null) {
            return callback(error);
          }
          if (result.exitCode === 0 || result.exitCode === 1) {
            violations = _this.parseLog(result.stdout);
            return callback(null, violations);
          } else {
            return callback(new LinterError("erlc exited with code " + result.exitCode, result));
          }
        };
      })(this));
    };

    Erlc.prototype.parseLog = function(log) {
      var bufferPoint, bufferRange, filePath, line, lineNumber, lines, matches, message, severity, _, _i, _len, _results;
      lines = log.split('\n');
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (!line) {
          continue;
        }
        matches = line.match(ERROR_PATTERN);
        if (!matches) {
          continue;
        }
        _ = matches[0], filePath = matches[1], lineNumber = matches[2], message = matches[3];
        severity = 'error';
        if (message.startsWith('Warning: ')) {
          severity = 'warning';
        }
        bufferPoint = new Point(parseInt(lineNumber) - 1, 0);
        bufferRange = new Range(bufferPoint, bufferPoint);
        _results.push(new Violation(severity, bufferRange, message));
      }
      return _results;
    };

    Erlc.prototype.buildCommand = function() {
      var command, directoryPath, projectRoot, userErlcPath;
      command = [];
      userErlcPath = atom.config.get('atom-lint.erlc.path');
      if (userErlcPath != null) {
        command.push(userErlcPath);
      } else {
        command.push('erlc');
      }
      directoryPath = path.dirname(this.filePath);
      if (directoryPath.endsWith('/src')) {
        projectRoot = path.dirname(directoryPath);
        command.push('-I', path.join(projectRoot, 'include'));
        command.push('-I', path.join(projectRoot, 'deps'));
        command.push('-pa', path.join(projectRoot, 'ebin'));
      }
      command.push('-Wall');
      command.push('+warn_obsolete_guard');
      command.push('+warn_unused_import');
      command.push('+warn_shadow_vars');
      command.push('+warn_export_vars');
      command.push('+strong_validation');
      command.push('+report');
      command.push(this.filePath);
      return command;
    };

    return Erlc;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9GQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLE9BQWlCLE9BQUEsQ0FBUSxNQUFSLENBQWpCLEVBQUMsYUFBQSxLQUFELEVBQVEsYUFBQSxLQURSLENBQUE7O0FBQUEsRUFFQSxhQUFBLEdBQWdCLE9BQUEsQ0FBUSxtQkFBUixDQUZoQixDQUFBOztBQUFBLEVBR0EsU0FBQSxHQUFZLE9BQUEsQ0FBUSxjQUFSLENBSFosQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FKZCxDQUFBOztBQUFBLEVBTUEsYUFBQSxHQUFnQix1QkFOaEIsQ0FBQTs7QUFBQSxFQVdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLE1BQWpCLENBQUE7O0FBRWEsSUFBQSxjQUFFLFFBQUYsR0FBQTtBQUFhLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFiO0lBQUEsQ0FGYjs7QUFBQSxtQkFJQSxHQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7YUFDSCxJQUFDLENBQUEsT0FBRCxDQUFTLFNBQUMsS0FBRCxFQUFRLFVBQVIsR0FBQTtBQUNQLFFBQUEsSUFBRyxhQUFIO2lCQUNFLFFBQUEsQ0FBUyxLQUFULEVBREY7U0FBQSxNQUFBO2lCQUdFLFFBQUEsQ0FBUyxJQUFULEVBQWUsVUFBZixFQUhGO1NBRE87TUFBQSxDQUFULEVBREc7SUFBQSxDQUpMLENBQUE7O0FBQUEsbUJBV0EsT0FBQSxHQUFTLFNBQUMsUUFBRCxHQUFBO0FBQ1AsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxhQUFBLENBQWMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFkLENBQWIs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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/erlc.coffee