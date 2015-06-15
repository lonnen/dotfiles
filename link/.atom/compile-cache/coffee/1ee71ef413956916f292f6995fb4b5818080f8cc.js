(function() {
  var CommandRunner, Point, PuppetLint, Range, Violation, util, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

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
            return callback(new Error("Process exited with code " + result.exitCode));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhEQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBR0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBSFAsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFVBQUMsQ0FBQSxhQUFELEdBQWlCLGFBQWpCLENBQUE7O0FBRWEsSUFBQSxvQkFBRSxRQUFGLEdBQUE7QUFBYSxNQUFaLElBQUMsQ0FBQSxXQUFBLFFBQVcsQ0FBYjtJQUFBLENBRmI7O0FBQUEseUJBSUEsR0FBQSxHQUFLLFNBQUMsUUFBRCxHQUFBO0FBQ0gsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxhQUFBLENBQWMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFkLENBQWIsQ0FBQTthQUVBLE1BQU0sQ0FBQyxHQUFQLENBQVcsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUMsS0FBRCxFQUFRLE1BQVIsR0FBQTtBQUNULGNBQUEsVUFBQTtBQUFBLFVBQUEsSUFBMEIsYUFBMUI7QUFBQSxtQkFBTyxRQUFBLENBQVMsS0FBVCxDQUFQLENBQUE7V0FBQTtBQUdBLFVBQUEsSUFBTyxNQUFNLENBQUMsUUFBUCxLQUFtQixDQUExQjtBQUNFLG1CQUFPLFFBQUEsQ0FBYSxJQUFBLEtBQUEsQ0FBTywyQkFBQSxHQUEwQixNQUFNLENBQUMsUUFBeEMsQ0FBYixDQUFQLENBREY7V0FIQTtBQUFBLFVBTUEsVUFBQSxHQUFhLEtBQUMsQ0FBQSxRQUFELENBQVUsTUFBTSxDQUFDLE1BQWpCLENBTmIsQ0FBQTtpQkFPQSxRQUFBLENBQVMsSUFBVCxFQUFlLFVBQWYsRUFSUztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFIRztJQUFBLENBSkwsQ0FBQTs7QUFBQSx5QkFpQkEsUUFBQSxHQUFVLFNBQUMsR0FBRCxHQUFBO0FBQ1IsVUFBQSwyRkFBQTtBQUFBLE1BQUEsS0FBQSxHQUFRLEdBQUcsQ0FBQyxLQUFKLENBQVUsSUFBVixDQUFSLENBQUE7QUFFQTtXQUFBLDRDQUFBO3lCQUFBO0FBQ0UsUUFBQSxJQUFBLENBQUEsSUFBQTtBQUFBLG1CQUFBO1NBQUE7QUFBQSxRQUVBLFFBQW9DLElBQUksQ0FBQyxLQUFMLENBQVcsR0FBWCxDQUFwQyxFQUFDLGVBQUQsRUFBTyxpQkFBUCxFQUFlLG1CQUFmLEVBQXlCLGtCQUZ6QixDQUFBO0FBQUEsUUFHQSxXQUFBLEdBQWtCLElBQUEsS0FBQSxDQUFNLFFBQUEsQ0FBUyxJQUFULENBQUEsR0FBaUIsQ0FBdkIsRUFBMEIsUUFBQSxDQUFTLE1BQVQsQ0FBQSxHQUFtQixDQUE3QyxDQUhsQixDQUFBO0FBQUEsUUFJQSxXQUFBLEdBQWtCLElBQUEsS0FBQSxDQUFNLFdBQU4sRUFBbUIsV0FBbkIsQ0FKbEIsQ0FBQTtBQUFBLHNCQU1JLElBQUEsU0FBQSxDQUFVLFFBQVYsRUFBb0IsV0FBcEIsRUFBaUMsT0FBakMsRUFOSixDQURGO0FBQUE7c0JBSFE7SUFBQSxDQWpCVixDQUFBOztBQUFBLHlCQTZCQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSwyQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BRUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDRCQUFoQixDQUZyQixDQUFBO0FBSUEsTUFBQSxJQUFHLDBCQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLGtCQUFiLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsYUFBYixDQUFBLENBSEY7T0FKQTtBQUFBLE1BU0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxjQUFiLEVBQTZCLDRDQUE3QixDQVRBLENBQUE7QUFBQSxNQVdBLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBQyxDQUFBLFFBQWQsQ0FYQSxDQUFBO2FBWUEsUUFiWTtJQUFBLENBN0JkLENBQUE7O3NCQUFBOztNQVBGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/puppet-lint.coffee