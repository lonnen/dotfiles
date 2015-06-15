(function() {
  var CSSLint, Point, Range, Violation, XmlBase, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  XmlBase = require('./xml-base');

  Violation = require('../violation');

  module.exports = CSSLint = (function(_super) {
    __extends(CSSLint, _super);

    function CSSLint() {
      return CSSLint.__super__.constructor.apply(this, arguments);
    }

    CSSLint.canonicalName = 'CSSLint';

    CSSLint.prototype.buildCommand = function() {
      var command, flag, rules, userCSSLintPath, userCSSLintRules;
      command = [];
      userCSSLintPath = atom.config.get('atom-lint.csslint.path');
      userCSSLintRules = atom.config.get('atom-lint.csslint.rules');
      if (userCSSLintPath != null) {
        command.push(userCSSLintPath);
      } else {
        command.push('csslint');
      }
      if (userCSSLintRules != null) {
        for (flag in userCSSLintRules) {
          rules = userCSSLintRules[flag];
          if (/errors|ignore|warnings/.test(flag) && Array.isArray(rules)) {
            command.push("--" + (flag.toLowerCase()) + "=" + (rules.join(',')));
          }
        }
      }
      command.push('--format=checkstyle-xml');
      command.push(this.filePath);
      return command;
    };

    CSSLint.prototype.isValidExitCode = function(exitCode) {
      return exitCode === 0 || exitCode === 1;
    };

    CSSLint.prototype.createViolationFromElement = function(element) {
      var bufferPoint, bufferRange;
      bufferPoint = new Point(element.$.line - 1, element.$.column - 1);
      bufferRange = new Range(bufferPoint, bufferPoint);
      return new Violation(element.$.severity, bufferRange, element.$.message);
    };

    return CSSLint;

  })(XmlBase);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osOEJBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsT0FBQyxDQUFBLGFBQUQsR0FBaUIsU0FBakIsQ0FBQTs7QUFBQSxzQkFFQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSx1REFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BRUEsZUFBQSxHQUFrQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isd0JBQWhCLENBRmxCLENBQUE7QUFBQSxNQUdBLGdCQUFBLEdBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQix5QkFBaEIsQ0FIbkIsQ0FBQTtBQUtBLE1BQUEsSUFBRyx1QkFBSDtBQUNFLFFBQUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxlQUFiLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsU0FBYixDQUFBLENBSEY7T0FMQTtBQVdBLE1BQUEsSUFBRyx3QkFBSDtBQUNFLGFBQUEsd0JBQUE7eUNBQUE7QUFDRSxVQUFBLElBQUcsd0JBQXdCLENBQUMsSUFBekIsQ0FBOEIsSUFBOUIsQ0FBQSxJQUF3QyxLQUFLLENBQUMsT0FBTixDQUFjLEtBQWQsQ0FBM0M7QUFDRSxZQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWMsSUFBQSxHQUFHLENBQUEsSUFBSSxDQUFDLFdBQUwsQ0FBQSxDQUFBLENBQUgsR0FBdUIsR0FBdkIsR0FBeUIsQ0FBQSxLQUFLLENBQUMsSUFBTixDQUFXLEdBQVgsQ0FBQSxDQUF2QyxDQUFBLENBREY7V0FERjtBQUFBLFNBREY7T0FYQTtBQUFBLE1BZ0JBLE9BQU8sQ0FBQyxJQUFSLENBQWEseUJBQWIsQ0FoQkEsQ0FBQTtBQUFBLE1BaUJBLE9BQU8sQ0FBQyxJQUFSLENBQWEsSUFBQyxDQUFBLFFBQWQsQ0FqQkEsQ0FBQTthQWtCQSxRQW5CWTtJQUFBLENBRmQsQ0FBQTs7QUFBQSxzQkF1QkEsZUFBQSxHQUFpQixTQUFDLFFBQUQsR0FBQTthQUNmLFFBQUEsS0FBWSxDQUFaLElBQWlCLFFBQUEsS0FBWSxFQURkO0lBQUEsQ0F2QmpCLENBQUE7O0FBQUEsc0JBMEJBLDBCQUFBLEdBQTRCLFNBQUMsT0FBRCxHQUFBO0FBQzFCLFVBQUEsd0JBQUE7QUFBQSxNQUFBLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sT0FBTyxDQUFDLENBQUMsQ0FBQyxJQUFWLEdBQWlCLENBQXZCLEVBQTBCLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBVixHQUFtQixDQUE3QyxDQUFsQixDQUFBO0FBQUEsTUFDQSxXQUFBLEdBQWtCLElBQUEsS0FBQSxDQUFNLFdBQU4sRUFBbUIsV0FBbkIsQ0FEbEIsQ0FBQTthQUVJLElBQUEsU0FBQSxDQUFVLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBcEIsRUFBOEIsV0FBOUIsRUFBMkMsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFyRCxFQUhzQjtJQUFBLENBMUI1QixDQUFBOzttQkFBQTs7S0FEb0IsUUFMdEIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/csslint.coffee