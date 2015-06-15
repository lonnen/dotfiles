(function() {
  var CoffeeLint, Point, Range, Violation, XmlBase, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), Range = _ref.Range, Point = _ref.Point;

  XmlBase = require('./xml-base');

  Violation = require('../violation');

  module.exports = CoffeeLint = (function(_super) {
    __extends(CoffeeLint, _super);

    function CoffeeLint() {
      return CoffeeLint.__super__.constructor.apply(this, arguments);
    }

    CoffeeLint.canonicalName = 'CoffeeLint';

    CoffeeLint.prototype.buildCommand = function() {
      var command, userCoffeeLintPath;
      command = [];
      userCoffeeLintPath = atom.config.get('atom-lint.coffeelint.path');
      if (userCoffeeLintPath != null) {
        command.push(userCoffeeLintPath);
      } else {
        command.push('coffeelint');
      }
      command.push('--reporter');
      command.push('checkstyle');
      command.push(this.filePath);
      return command;
    };

    CoffeeLint.prototype.isValidExitCode = function(exitCode) {
      return (0 <= exitCode && exitCode <= 2);
    };

    CoffeeLint.prototype.createViolationFromElement = function(element) {
      var bufferPoint, bufferRange, column, message;
      column = element.$.column;
      if (column == null) {
        column = 1;
      }
      bufferPoint = new Point(element.$.line - 1, column - 1);
      bufferRange = new Range(bufferPoint, bufferPoint);
      message = element.$.message.replace(/; context: .*?$/, '');
      return new Violation(element.$.severity, bufferRange, message);
    };

    return CoffeeLint;

  })(XmlBase);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFpQixPQUFBLENBQVEsTUFBUixDQUFqQixFQUFDLGFBQUEsS0FBRCxFQUFRLGFBQUEsS0FBUixDQUFBOztBQUFBLEVBQ0EsT0FBQSxHQUFVLE9BQUEsQ0FBUSxZQUFSLENBRFYsQ0FBQTs7QUFBQSxFQUVBLFNBQUEsR0FBWSxPQUFBLENBQVEsY0FBUixDQUZaLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osaUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsVUFBQyxDQUFBLGFBQUQsR0FBaUIsWUFBakIsQ0FBQTs7QUFBQSx5QkFFQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osVUFBQSwyQkFBQTtBQUFBLE1BQUEsT0FBQSxHQUFVLEVBQVYsQ0FBQTtBQUFBLE1BRUEsa0JBQUEsR0FBcUIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLDJCQUFoQixDQUZyQixDQUFBO0FBSUEsTUFBQSxJQUFHLDBCQUFIO0FBQ0UsUUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLGtCQUFiLENBQUEsQ0FERjtPQUFBLE1BQUE7QUFHRSxRQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWEsWUFBYixDQUFBLENBSEY7T0FKQTtBQUFBLE1BU0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxZQUFiLENBVEEsQ0FBQTtBQUFBLE1BVUEsT0FBTyxDQUFDLElBQVIsQ0FBYSxZQUFiLENBVkEsQ0FBQTtBQUFBLE1BV0EsT0FBTyxDQUFDLElBQVIsQ0FBYSxJQUFDLENBQUEsUUFBZCxDQVhBLENBQUE7YUFZQSxRQWJZO0lBQUEsQ0FGZCxDQUFBOztBQUFBLHlCQWlCQSxlQUFBLEdBQWlCLFNBQUMsUUFBRCxHQUFBO2FBR2YsQ0FBQSxDQUFBLElBQUssUUFBTCxJQUFLLFFBQUwsSUFBaUIsQ0FBakIsRUFIZTtJQUFBLENBakJqQixDQUFBOztBQUFBLHlCQXNCQSwwQkFBQSxHQUE0QixTQUFDLE9BQUQsR0FBQTtBQUMxQixVQUFBLHlDQUFBO0FBQUEsTUFBQSxNQUFBLEdBQVMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFuQixDQUFBOztRQUNBLFNBQVU7T0FEVjtBQUFBLE1BRUEsV0FBQSxHQUFrQixJQUFBLEtBQUEsQ0FBTSxPQUFPLENBQUMsQ0FBQyxDQUFDLElBQVYsR0FBaUIsQ0FBdkIsRUFBMEIsTUFBQSxHQUFTLENBQW5DLENBRmxCLENBQUE7QUFBQSxNQUdBLFdBQUEsR0FBa0IsSUFBQSxLQUFBLENBQU0sV0FBTixFQUFtQixXQUFuQixDQUhsQixDQUFBO0FBQUEsTUFNQSxPQUFBLEdBQVUsT0FBTyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBbEIsQ0FBMEIsaUJBQTFCLEVBQTZDLEVBQTdDLENBTlYsQ0FBQTthQVFJLElBQUEsU0FBQSxDQUFVLE9BQU8sQ0FBQyxDQUFDLENBQUMsUUFBcEIsRUFBOEIsV0FBOUIsRUFBMkMsT0FBM0MsRUFUc0I7SUFBQSxDQXRCNUIsQ0FBQTs7c0JBQUE7O0tBRHVCLFFBTHpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/coffeelint.coffee