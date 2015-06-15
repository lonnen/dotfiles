(function() {
  var CommandRunner, LinterError, Point, PuppetLint, Range, Violation, util, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  LinterError = require('../linter-error');

  util = require('../util');

  module.exports = PuppetLint = (function() {
    PuppetLint.canonicalName = 'puppet-lint';

    function PuppetLint(filePath) {
      this.filePath = filePath;
    }

    PuppetLint.prototype.run = function(callback) {
      var runner;
      runner = new CommandRunner(this.buildCommand());
      return runner.run((function(_this) {
        return function(error, result) {
          var violations;
          if (error != null) {
            return callback(error);
          }
          if (result.exitCode !== 0) {
            return callback(new LinterError("puppet-lint exited with code " + result.exitCode, result));
          }
          violations = _this.parseLog(result.stdout);
          return callback(null, violations);
        };
      })(this));
    };

    PuppetLint.prototype.parseLog = function(log) {
      var bufferPoint, bufferRange, column, line, lines, message, severity, _i, _len, _ref1, _results;
      lines = log.split('\n');
      _results = [];
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        if (!line) {
          continue;
        }
        _ref1 = line.split(':'), line = _ref1[0], column = _ref1[1], severity = _ref1[2], message = _ref1[3];
        bufferPoint = new Point(parseInt(line) - 1, parseInt(column) - 1);
        bufferRange = new Range(bufferPoint, bufferPoint);
        _results.push(new Violation(severity, bufferRange, message));
      }
      return _results;
    };

    PuppetLint.prototype.buildCommand = function() {
      var command, userPuppetLintPath;
      command = [];
      userPuppetLintPath = atom.config.get('atom-lint.puppet-lint.path');
      if (userPuppetLintPath != null) {
        command.push(userPuppetLintPath);
      } else {
        command.push('puppet-lint');
      }
      command.push('--log-format', '%{linenumber}:%{column}:%{kind}:%{message}');
      command.push(this.filePath);
      return command;
    };

    return PuppetLint;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJFQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsV0FBQSxHQUFjLE9BQUEsQ0FBUSxpQkFBUixDQUhkLENBQUE7O0FBQUEsRUFJQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FKUCxDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsVUFBQyxDQUFBLGFBQUQsR0FBaUIsYUFBakIsQ0FBQTs7QUFFYSxJQUFBLG9CQUFFLFFBQUYsR0FBQTtBQUFhLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFiO0lBQUEsQ0FGYjs7QUFBQSx5QkFJQSxHQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7QUFDSCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxJQUFBLGFBQUEsQ0FBYyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQWQsQ0FBYixDQUFBO2FBRUEsTUFBTSxDQUFDLEdBQVAsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ1QsY0FBQSxVQUFBO0FBQUEsVUFBQSxJQUEwQixhQUExQjtBQUFBLG1CQUFPLFFBQUEsQ0FBUyxLQUFULENBQVAsQ0FBQTtXQUFBO0FBR0EsVUFBQSxJQUFPLE1BQU0sQ0FBQyxRQUFQLEtBQW1CLENBQTFCO0FBQ0UsbUJBQU8sUUFBQSxDQUFhLElBQUEsV0FBQSxDQUFhLCtCQUFBLEdBQThCLE1BQU0sQ0FBQyxRQUFsRCxFQUErRCxNQUEvRCxDQUFiLENBQVAsQ0FERjtXQUhBO0FBQUEsVUFNQSxVQUFBLEdBQWEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxNQUFNLENBQUMsTUFBakIsQ0FOYixDQUFBO2lCQU9BLFFBQUEsQ0FBUyxJQUFULEVBQWUsVUFBZixFQVJTO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBWCxFQUhHO0lBQUEsQ0FKTCxDQUFBOztBQUFBLHlCQWlCQSxRQUFBLEdBQVUsU0FBQyxHQUFELEdBQUE7QUFDUixVQUFBLDJGQUFBO0FBQUEsTUFBQSxLQUFBLEdBQVEsR0FBRyxDQUFDLEtBQUosQ0FBVSxJQUFWLENBQVIsQ0FBQTtBQUVBO1dBQUEsNENBQUE7eUJBQUE7QUFDRSxRQUFBLElBQUEsQ0FBQSxJQUFBO0FBQUEsbUJBQUE7U0FBQTtBQUFBLFFBRUEsUUFBb0MsSUFBSSxDQUFDLEtBQUwsQ0FBVyxHQUFYLENBQXBDLEVBQUMsZUFBRCxFQUFPLGlCQUFQLEVBQWUsbUJBQWYsRUFBeUIsa0JBRnpCLENBQUE7QUFBQSxRQUdBLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sUUFBQSxDQUFTLElBQVQsQ0FBQSxHQUFpQixDQUF2QixFQUEwQixRQUFBLENBQVMsTUFBVCxDQUFBLEdBQW1CLENBQTdDLENBSGxCLENBQUE7QUFBQSxRQUlBLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sV0FBTixFQUFtQixXQUFuQixDQUpsQixDQUFBO0FBQUEsc0JBTUksSUFBQSxTQUFBLENBQVUsUUFBVixFQUFvQixXQUFwQixFQUFpQyxPQUFqQyxFQU5KLENBREY7QUFBQTtzQkFIUTtJQUFBLENBakJWLENBQUE7O0FBQUEseUJBNkJBLFlBQUEsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLDJCQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsRUFBVixDQUFBO0FBQUEsTUFFQSxrQkFBQSxHQUFxQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsNEJBQWhCLENBRnJCLENBQUE7QUFJQSxNQUFBLElBQUcsMEJBQUg7QUFDRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsa0JBQWIsQ0FBQSxDQURGO09BQUEsTUFBQTtBQUdFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxhQUFiLENBQUEsQ0FIRjtPQUpBO0FBQUEsTUFTQSxPQUFPLENBQUMsSUFBUixDQUFhLGNBQWIsRUFBNkIsNENBQTdCLENBVEEsQ0FBQTtBQUFBLE1BV0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsUUFBZCxDQVhBLENBQUE7YUFZQSxRQWJZO0lBQUEsQ0E3QmQsQ0FBQTs7c0JBQUE7O01BUkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/puppet-lint.coffee