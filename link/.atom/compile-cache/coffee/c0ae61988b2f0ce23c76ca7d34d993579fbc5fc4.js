(function() {
  var CompileStatus, Transform,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Transform = (require('stream')).Transform;

  module.exports = CompileStatus = (function(_super) {
    __extends(CompileStatus, _super);

    function CompileStatus() {
      return CompileStatus.__super__.constructor.apply(this, arguments);
    }

    CompileStatus.prototype.errors = {};

    CompileStatus.prototype.clear = function() {
      this.currentApp = null;
      return this.errors = {};
    };

    CompileStatus.prototype._transform = function(chunk, encoding, done) {
      var line, _i, _len, _ref;
      _ref = chunk.toString().split("\n");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        line = _ref[_i];
        this._parseCompileLine(line);
      }
      return done();
    };

    CompileStatus.prototype._parseCompileLine = function(line) {
      var file, matches, message, warn, _ref;
      if (matches = line.match(/^==> (.+) \(compile\)$/)) {
        this.currentApp = matches[1];
        return this.errors[this.currentApp] = [];
      } else if (matches = line.match(/^(.+):(\d+): (Warning: )?(.+)$/)) {
        _ref = matches.slice(1, 5), file = _ref[0], line = _ref[1], warn = _ref[2], message = _ref[3];
        return this.errors[this.currentApp].push({
          file: file,
          line: line,
          message: message
        });
      }
    };

    return CompileStatus;

  })(Transform);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksQ0FBQyxPQUFBLENBQVEsUUFBUixDQUFELENBQWtCLENBQUMsU0FBL0IsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixvQ0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsNEJBQUEsTUFBQSxHQUFRLEVBQVIsQ0FBQTs7QUFBQSw0QkFFQSxLQUFBLEdBQU8sU0FBQSxHQUFBO0FBQUcsTUFBQSxJQUFDLENBQUEsVUFBRCxHQUFjLElBQWQsQ0FBQTthQUFvQixJQUFDLENBQUEsTUFBRCxHQUFVLEdBQWpDO0lBQUEsQ0FGUCxDQUFBOztBQUFBLDRCQUlBLFVBQUEsR0FBWSxTQUFDLEtBQUQsRUFBUSxRQUFSLEVBQWtCLElBQWxCLEdBQUE7QUFDVixVQUFBLG9CQUFBO0FBQUE7QUFBQSxXQUFBLDJDQUFBO3dCQUFBO0FBQUEsUUFBQSxJQUFDLENBQUEsaUJBQUQsQ0FBbUIsSUFBbkIsQ0FBQSxDQUFBO0FBQUEsT0FBQTthQUNBLElBQUEsQ0FBQSxFQUZVO0lBQUEsQ0FKWixDQUFBOztBQUFBLDRCQVFBLGlCQUFBLEdBQW1CLFNBQUMsSUFBRCxHQUFBO0FBQ2pCLFVBQUEsa0NBQUE7QUFBQSxNQUFBLElBQUcsT0FBQSxHQUFXLElBQUksQ0FBQyxLQUFMLENBQVcsd0JBQVgsQ0FBZDtBQUVFLFFBQUEsSUFBQyxDQUFBLFVBQUQsR0FBYyxPQUFRLENBQUEsQ0FBQSxDQUF0QixDQUFBO2VBRUEsSUFBQyxDQUFBLE1BQVEsQ0FBQSxJQUFDLENBQUEsVUFBRCxDQUFULEdBQXlCLEdBSjNCO09BQUEsTUFNSyxJQUFHLE9BQUEsR0FBVyxJQUFJLENBQUMsS0FBTCxDQUFXLGdDQUFYLENBQWQ7QUFDSCxRQUFBLE9BQWdDLE9BQVMsWUFBekMsRUFBRSxjQUFGLEVBQVEsY0FBUixFQUFjLGNBQWQsRUFBb0IsaUJBQXBCLENBQUE7ZUFFQSxJQUFDLENBQUEsTUFBUSxDQUFBLElBQUMsQ0FBQSxVQUFELENBQWEsQ0FBQyxJQUF2QixDQUE0QjtBQUFBLFVBQUEsSUFBQSxFQUFNLElBQU47QUFBQSxVQUFZLElBQUEsRUFBTSxJQUFsQjtBQUFBLFVBQXdCLE9BQUEsRUFBUyxPQUFqQztTQUE1QixFQUhHO09BUFk7SUFBQSxDQVJuQixDQUFBOzt5QkFBQTs7S0FGMEIsVUFINUIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/erlang-build/lib/compile-status.coffee