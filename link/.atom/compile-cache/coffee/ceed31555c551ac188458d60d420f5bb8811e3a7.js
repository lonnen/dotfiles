(function() {
  var LinterError, indent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  indent = function(string, width) {
    var indentation;
    indentation = ' '.repeat(width);
    return indentation + string.split("\n").join("\n" + indentation);
  };

  module.exports = LinterError = (function(_super) {
    __extends(LinterError, _super);

    function LinterError(message, commandResult) {
      if (message == null) {
        message = void 0;
      }
      if (commandResult == null) {
        commandResult = void 0;
      }
      if (message != null) {
        this.message = message.toString();
      }
      this.commandResult = commandResult;
      Error.captureStackTrace(this, this.constructor);
    }

    LinterError.prototype.name = LinterError.name;

    LinterError.prototype.toString = function() {
      var string;
      string = this.name;
      if (this.message) {
        string += ": " + this.message;
      }
      if (this.commandResult != null) {
        string += '\n';
        string += "    command: " + (JSON.stringify(this.commandResult.command)) + "\n";
        string += "    PATH: " + this.commandResult.env.PATH + "\n";
        string += "    exit code: " + this.commandResult.exitCode + "\n";
        string += '    stdout:\n';
        string += indent(this.commandResult.stdout, 8) + '\n';
        string += '    stderr:\n';
        string += indent(this.commandResult.stderr, 8);
      }
      return string;
    };

    return LinterError;

  })(Error);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxNQUFBLEdBQVMsU0FBQyxNQUFELEVBQVMsS0FBVCxHQUFBO0FBQ1AsUUFBQSxXQUFBO0FBQUEsSUFBQSxXQUFBLEdBQWMsR0FBRyxDQUFDLE1BQUosQ0FBVyxLQUFYLENBQWQsQ0FBQTtXQUNBLFdBQUEsR0FBYyxNQUFNLENBQUMsS0FBUCxDQUFhLElBQWIsQ0FBa0IsQ0FBQyxJQUFuQixDQUF3QixJQUFBLEdBQU8sV0FBL0IsRUFGUDtFQUFBLENBQVQsQ0FBQTs7QUFBQSxFQUlBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOztBQUFhLElBQUEscUJBQUMsT0FBRCxFQUFzQixhQUF0QixHQUFBOztRQUFDLFVBQVU7T0FDdEI7O1FBRGlDLGdCQUFnQjtPQUNqRDtBQUFBLE1BQUEsSUFBaUMsZUFBakM7QUFBQSxRQUFBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBTyxDQUFDLFFBQVIsQ0FBQSxDQUFYLENBQUE7T0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsYUFEakIsQ0FBQTtBQUFBLE1BRUEsS0FBSyxDQUFDLGlCQUFOLENBQXdCLElBQXhCLEVBQThCLElBQUMsQ0FBQSxXQUEvQixDQUZBLENBRFc7SUFBQSxDQUFiOztBQUFBLDBCQUtBLElBQUEsR0FBTSxXQUFDLENBQUEsSUFMUCxDQUFBOztBQUFBLDBCQU9BLFFBQUEsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsSUFBVixDQUFBO0FBQ0EsTUFBQSxJQUE2QixJQUFDLENBQUEsT0FBOUI7QUFBQSxRQUFBLE1BQUEsSUFBVyxJQUFBLEdBQUcsSUFBQyxDQUFBLE9BQWYsQ0FBQTtPQURBO0FBR0EsTUFBQSxJQUFHLDBCQUFIO0FBQ0UsUUFBQSxNQUFBLElBQVUsSUFBVixDQUFBO0FBQUEsUUFDQSxNQUFBLElBQVcsZUFBQSxHQUFjLENBQUEsSUFBSSxDQUFDLFNBQUwsQ0FBZSxJQUFDLENBQUEsYUFBYSxDQUFDLE9BQTlCLENBQUEsQ0FBZCxHQUFzRCxJQURqRSxDQUFBO0FBQUEsUUFFQSxNQUFBLElBQVcsWUFBQSxHQUFXLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBRyxDQUFDLElBQTlCLEdBQW9DLElBRi9DLENBQUE7QUFBQSxRQUdBLE1BQUEsSUFBVyxpQkFBQSxHQUFnQixJQUFDLENBQUEsYUFBYSxDQUFDLFFBQS9CLEdBQXlDLElBSHBELENBQUE7QUFBQSxRQUlBLE1BQUEsSUFBVSxlQUpWLENBQUE7QUFBQSxRQUtBLE1BQUEsSUFBVSxNQUFBLENBQU8sSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUF0QixFQUE4QixDQUE5QixDQUFBLEdBQW1DLElBTDdDLENBQUE7QUFBQSxRQU1BLE1BQUEsSUFBVSxlQU5WLENBQUE7QUFBQSxRQU9BLE1BQUEsSUFBVSxNQUFBLENBQU8sSUFBQyxDQUFBLGFBQWEsQ0FBQyxNQUF0QixFQUE4QixDQUE5QixDQVBWLENBREY7T0FIQTthQWFBLE9BZFE7SUFBQSxDQVBWLENBQUE7O3VCQUFBOztLQUR3QixNQUwxQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/linter-error.coffee