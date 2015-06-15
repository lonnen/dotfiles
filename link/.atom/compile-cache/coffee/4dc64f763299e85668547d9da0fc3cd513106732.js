(function() {
  var CommandRunner, LinterError, XmlBase, xml2js;

  xml2js = require('xml2js');

  CommandRunner = require('../command-runner');

  LinterError = require('../linter-error');

  module.exports = XmlBase = (function() {
    function XmlBase(filePath) {
      this.filePath = filePath;
    }

    XmlBase.prototype.run = function(callback) {
      var runner;
      runner = new CommandRunner(this.buildCommand());
      return runner.run((function(_this) {
        return function(commandError, result) {
          if (commandError != null) {
            return callback(commandError);
          }
          if (!_this.isValidExitCode(result.exitCode)) {
            return callback(new LinterError("Process exited with code " + result.exitCode, result));
          }
          return xml2js.parseString(result.stdout, function(xmlError, xml) {
            if (xmlError != null) {
              return callback(xmlError);
            }
            return callback(null, _this.createViolationsFromXml(xml));
          });
        };
      })(this));
    };

    XmlBase.prototype.buildCommand = function() {
      throw new Error('::buildCommand must be overridden');
    };

    XmlBase.prototype.isValidExitCode = function(exitCode) {
      throw new Error('::isValidExitCode must be overridden');
    };

    XmlBase.prototype.createViolationsFromXml = function(xml) {
      var element, _i, _len, _ref, _results;
      if (xml.checkstyle.file == null) {
        return [];
      }
      _ref = xml.checkstyle.file[0].error;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        element = _ref[_i];
        _results.push(this.createViolationFromElement(element));
      }
      return _results;
    };

    XmlBase.prototype.createViolationFromElement = function(element) {
      throw new Error('::createViolationFromElement must be overridden');
    };

    return XmlBase;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJDQUFBOztBQUFBLEVBQUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBQVQsQ0FBQTs7QUFBQSxFQUNBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLG1CQUFSLENBRGhCLENBQUE7O0FBQUEsRUFFQSxXQUFBLEdBQWMsT0FBQSxDQUFRLGlCQUFSLENBRmQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLGlCQUFFLFFBQUYsR0FBQTtBQUFhLE1BQVosSUFBQyxDQUFBLFdBQUEsUUFBVyxDQUFiO0lBQUEsQ0FBYjs7QUFBQSxzQkFFQSxHQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7QUFDSCxVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBYSxJQUFBLGFBQUEsQ0FBYyxJQUFDLENBQUEsWUFBRCxDQUFBLENBQWQsQ0FBYixDQUFBO2FBQ0EsTUFBTSxDQUFDLEdBQVAsQ0FBVyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxZQUFELEVBQWUsTUFBZixHQUFBO0FBQ1QsVUFBQSxJQUFpQyxvQkFBakM7QUFBQSxtQkFBTyxRQUFBLENBQVMsWUFBVCxDQUFQLENBQUE7V0FBQTtBQUVBLFVBQUEsSUFBQSxDQUFBLEtBQVEsQ0FBQSxlQUFELENBQWlCLE1BQU0sQ0FBQyxRQUF4QixDQUFQO0FBQ0UsbUJBQU8sUUFBQSxDQUFhLElBQUEsV0FBQSxDQUFhLDJCQUFBLEdBQTBCLE1BQU0sQ0FBQyxRQUE5QyxFQUEyRCxNQUEzRCxDQUFiLENBQVAsQ0FERjtXQUZBO2lCQUtBLE1BQU0sQ0FBQyxXQUFQLENBQW1CLE1BQU0sQ0FBQyxNQUExQixFQUFrQyxTQUFDLFFBQUQsRUFBVyxHQUFYLEdBQUE7QUFDaEMsWUFBQSxJQUE2QixnQkFBN0I7QUFBQSxxQkFBTyxRQUFBLENBQVMsUUFBVCxDQUFQLENBQUE7YUFBQTttQkFDQSxRQUFBLENBQVMsSUFBVCxFQUFlLEtBQUMsQ0FBQSx1QkFBRCxDQUF5QixHQUF6QixDQUFmLEVBRmdDO1VBQUEsQ0FBbEMsRUFOUztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQVgsRUFGRztJQUFBLENBRkwsQ0FBQTs7QUFBQSxzQkFjQSxZQUFBLEdBQWMsU0FBQSxHQUFBO0FBQ1osWUFBVSxJQUFBLEtBQUEsQ0FBTSxtQ0FBTixDQUFWLENBRFk7SUFBQSxDQWRkLENBQUE7O0FBQUEsc0JBaUJBLGVBQUEsR0FBaUIsU0FBQyxRQUFELEdBQUE7QUFDZixZQUFVLElBQUEsS0FBQSxDQUFNLHNDQUFOLENBQVYsQ0FEZTtJQUFBLENBakJqQixDQUFBOztBQUFBLHNCQW9CQSx1QkFBQSxHQUF5QixTQUFDLEdBQUQsR0FBQTtBQUN2QixVQUFBLGlDQUFBO0FBQUEsTUFBQSxJQUFpQiwyQkFBakI7QUFBQSxlQUFPLEVBQVAsQ0FBQTtPQUFBO0FBQ0E7QUFBQTtXQUFBLDJDQUFBOzJCQUFBO0FBQ0Usc0JBQUEsSUFBQyxDQUFBLDBCQUFELENBQTRCLE9BQTVCLEVBQUEsQ0FERjtBQUFBO3NCQUZ1QjtJQUFBLENBcEJ6QixDQUFBOztBQUFBLHNCQXlCQSwwQkFBQSxHQUE0QixTQUFDLE9BQUQsR0FBQTtBQUMxQixZQUFVLElBQUEsS0FBQSxDQUFNLGlEQUFOLENBQVYsQ0FEMEI7SUFBQSxDQXpCNUIsQ0FBQTs7bUJBQUE7O01BTkYsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter/xml-base.coffee