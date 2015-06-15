(function() {
  var CommandRunner, Flake8, Point, Range, Violation, _ref;

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

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
          return callback(new Error("Process exited with code " + result.exitCode));
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9EQUFBOztBQUFBLEVBQUEsT0FBaUIsT0FBQSxDQUFRLE1BQVIsQ0FBakIsRUFBQyxhQUFBLEtBQUQsRUFBUSxhQUFBLEtBQVIsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FGWixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsTUFBQyxDQUFBLGFBQUQsR0FBaUIsUUFBakIsQ0FBQTs7QUFFYSxJQUFBLGdCQUFFLFFBQUYsR0FBQTtBQUFhLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFiO0lBQUEsQ0FGYjs7QUFBQSxxQkFJQSxHQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7YUFDSCxJQUFDLENBQUEsU0FBRCxDQUFXLFNBQUMsS0FBRCxFQUFRLFVBQVIsR0FBQTtBQUNULFFBQUEsSUFBRyxhQUFIO2lCQUNFLFFBQUEsQ0FBUyxLQUFULEVBREY7U0FBQSxNQUFBO2lCQUdFLFFBQUEsQ0FBUyxJQUFULEVBQWUsVUFBZixFQUhGO1NBRFM7TUFBQSxDQUFYLEVBREc7SUFBQSxDQUpMLENBQUE7O0FBQUEscUJBV0EsU0FBQSxHQUFXLFNBQUMsUUFBRCxHQUFBO0FBQ1QsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxhQUFBLENBQWMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFkLENBQWIsQ0FBQTthQUVBLE1BQU0sQ0FBQyxHQUFQLENBQVcsU0FBQyxLQUFELEVBQVEsTUFBUixHQUFBO0FBQ1QsWUFBQSxxR0FBQTtBQUFBLFFBQUEsSUFBMEIsYUFBMUI7QUFBQSxpQkFBTyxRQUFBLENBQVMsS0FBVCxDQUFQLENBQUE7U0FBQTtBQUVBLFFBQUEsSUFBRyxNQUFNLENBQUMsUUFBUCxLQUFtQixDQUFuQixJQUF3QixNQUFNLENBQUMsUUFBUCxLQUFtQixDQUE5QztBQUdFLFVBQUEsVUFBQSxHQUFhLEVBQWIsQ0FBQTtBQUNBO0FBQUEsZUFBQSw0Q0FBQTs2QkFBQTtBQUNFLFlBQUEsSUFBRyxDQUFBLElBQUg7QUFBaUIsdUJBQWpCO2FBQUE7QUFBQSxZQUVBOztBQUEwQjtBQUFBO21CQUFBLDhDQUFBOzhCQUFBO0FBQUEsOEJBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBQSxFQUFBLENBQUE7QUFBQTs7Z0JBQTFCLEVBQUMsZUFBRCxFQUFPLGVBQVAsRUFBYSxjQUFiLEVBQWtCLGNBRmxCLENBQUE7QUFBQSxZQUlBLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sUUFBQSxDQUFTLElBQVQsQ0FBQSxHQUFpQixDQUF2QixFQUEwQixRQUFBLENBQVMsR0FBVCxDQUFBLEdBQWdCLENBQTFDLENBSmxCLENBQUE7QUFBQSxZQUtBLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sV0FBTixFQUFtQixXQUFuQixDQUxsQixDQUFBO0FBQUEsWUFVQSxRQUFBO0FBQVcsc0JBQU8sR0FBSSxZQUFYO0FBQUEscUJBQ0osTUFESTtBQUFBLHFCQUNJLE1BREo7QUFBQSxxQkFDWSxNQURaO0FBQUEscUJBQ29CLE1BRHBCO3lCQUNnQyxRQURoQztBQUFBO0FBR1Asa0JBQUEsSUFBRyxHQUFJLENBQUEsQ0FBQSxDQUFKLEtBQVUsR0FBYjsyQkFBc0IsUUFBdEI7bUJBQUEsTUFBQTsyQkFBbUMsVUFBbkM7bUJBSE87QUFBQTtnQkFWWCxDQUFBO0FBQUEsWUFlQSxVQUFVLENBQUMsSUFBWCxDQUFvQixJQUFBLFNBQUEsQ0FBVSxRQUFWLEVBQW9CLFdBQXBCLEVBQWlDLEdBQWpDLENBQXBCLENBZkEsQ0FERjtBQUFBLFdBREE7aUJBbUJBLFFBQUEsQ0FBUyxJQUFULEVBQWUsVUFBZixFQXRCRjtTQUFBLE1BQUE7aUJBd0JFLFFBQUEsQ0FBYSxJQUFBLEtBQUEsQ0FBTywyQkFBQSxHQUEwQixNQUFNLENBQUMsUUFBeEMsQ0FBYixFQXhCRjtTQUhTO01BQUEsQ0FBWCxFQUhTO0lBQUEsQ0FYWCxDQUFBOztBQUFBLHFCQTJDQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSx1QkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BRUEsY0FBQSxHQUFpQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsdUJBQWhCLENBRmpCLENBQUE7QUFJQSxNQUFBLElBQUcsc0JBQUg7QUFDRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsY0FBYixDQUFBLENBREY7T0FBQSxNQUFBO0FBR0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLFFBQWIsQ0FBQSxDQUhGO09BSkE7QUFBQSxNQVNBLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBQyxDQUFBLFFBQWQsQ0FUQSxDQUFBO2FBVUEsUUFYWTtJQUFBLENBM0NkLENBQUE7O2tCQUFBOztNQU5GLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/flake8.coffee