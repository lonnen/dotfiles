(function() {
  var CommandRunner, HLint, HLintViolation, Point, Range, Violation, util, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  _ = require('lodash');

  CommandRunner = require('../command-runner');

  Violation = require('../violation');

  util = require('../util');

  module.exports = HLint = (function() {
    HLint.canonicalName = 'HLint';

    function HLint(filePath) {
      this.filePath = filePath;
    }

    HLint.prototype.run = function(callback) {
      return this.runHLint(function(error, violations) {
        if (error != null) {
          return callback(error);
        } else {
          return callback(null, violations);
        }
      });
    };

    HLint.prototype.runHLint = function(callback) {
      var runner;
      runner = new CommandRunner(this.buildCommand());
      return runner.run(function(error, result) {
        var bufferPoint, bufferRange, col, file, item, items, line, msg, pattern, severity, violation, violations, _i, _len, _ref1, _ref2;
        if (error != null) {
          return callback(error);
        }
        if (result.exitCode === 0 || result.exitCode === 1) {
          pattern = /^(.+):(\d+):(\d+):\s*(Warning|Error):\s*([^]+)/;
          violations = [];
          items = result.stdout.split('\n\n');
          _ref1 = items.slice(0, -1);
          for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
            item = _ref1[_i];
            _ref2 = item.match(pattern).slice(1, 6), file = _ref2[0], line = _ref2[1], col = _ref2[2], severity = _ref2[3], msg = _ref2[4];
            bufferPoint = new Point(parseInt(line) - 1, parseInt(col) - 1);
            bufferRange = new Range(bufferPoint, bufferPoint);
            violation = new HLintViolation(severity.toLowerCase(), bufferRange, msg);
            violations.push(violation);
          }
          return callback(null, violations);
        } else {
          return callback(new Error("Process exited with code " + result.exitCode));
        }
      });
    };

    HLint.prototype.buildCommand = function() {
      var command, userHLintPath;
      command = [];
      userHLintPath = atom.config.get('atom-lint.hlint.path');
      if (userHLintPath != null) {
        command.push(userHLintPath);
      } else {
        command.push('hlint');
      }
      command.push(this.filePath);
      return command;
    };

    return HLint;

  })();

  HLintViolation = (function(_super) {
    __extends(HLintViolation, _super);

    function HLintViolation() {
      return HLintViolation.__super__.constructor.apply(this, arguments);
    }

    HLintViolation.MESSAGE_PATTTERN = /^(.+)\nFound:\n(\x20{2}[\S\s]+)Why\x20not:\n(\x20{2}[\S\s]+)/;

    HLintViolation.prototype.getHTML = function() {
      var HTML, alternativeCode, foundCode, match, matches, message;
      matches = this.message.match(HLintViolation.MESSAGE_PATTTERN);
      if (matches == null) {
        return null;
      }
      match = matches[0], message = matches[1], foundCode = matches[2], alternativeCode = matches[3];
      HTML = _.escape(util.punctuate(message));
      HTML += '<div class="attachment">';
      HTML += '<p class="code-label">Found:</p>';
      HTML += this.formatSnippet(foundCode);
      HTML += '<p class="code-label">Why not:</p>';
      HTML += this.formatSnippet(alternativeCode);
      HTML += '</div>';
      return HTML;
    };

    HLintViolation.prototype.formatSnippet = function(snippet) {
      var line, lines, unindentedLines, unindentedSnippet;
      lines = snippet.split('\n');
      unindentedLines = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          line = lines[_i];
          _results.push(line.slice(2));
        }
        return _results;
      })();
      unindentedSnippet = unindentedLines.join('\n');
      return "<pre>" + (_.escape(unindentedSnippet)) + "</pre>";
    };

    return HLintViolation;

  })(Violation);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBREosQ0FBQTs7QUFBQSxFQUVBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRmhCLENBQUE7O0FBQUEsRUFHQSxTQUFBLEdBQVksT0FBQSxDQUFRLGNBQVIsQ0FIWixDQUFBOztBQUFBLEVBSUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBSlAsQ0FBQTs7QUFBQSxFQU1BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLEtBQUMsQ0FBQSxhQUFELEdBQWlCLE9BQWpCLENBQUE7O0FBRWEsSUFBQSxlQUFFLFFBQUYsR0FBQTtBQUFhLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFiO0lBQUEsQ0FGYjs7QUFBQSxvQkFJQSxHQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7YUFDSCxJQUFDLENBQUEsUUFBRCxDQUFVLFNBQUMsS0FBRCxFQUFRLFVBQVIsR0FBQTtBQUNSLFFBQUEsSUFBRyxhQUFIO2lCQUNFLFFBQUEsQ0FBUyxLQUFULEVBREY7U0FBQSxNQUFBO2lCQUdFLFFBQUEsQ0FBUyxJQUFULEVBQWUsVUFBZixFQUhGO1NBRFE7TUFBQSxDQUFWLEVBREc7SUFBQSxDQUpMLENBQUE7O0FBQUEsb0JBV0EsUUFBQSxHQUFVLFNBQUMsUUFBRCxHQUFBO0FBQ1IsVUFBQSxNQUFBO0FBQUEsTUFBQSxNQUFBLEdBQWEsSUFBQSxhQUFBLENBQWMsSUFBQyxDQUFBLFlBQUQsQ0FBQSxDQUFkLENBQWIsQ0FBQTthQUVBLE1BQU0sQ0FBQyxHQUFQ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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/hlint.coffee