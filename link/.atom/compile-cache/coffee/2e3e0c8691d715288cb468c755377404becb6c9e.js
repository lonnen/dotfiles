(function() {
  var Config, minimatch,
    __slice = [].slice;

  minimatch = require('minimatch');

  module.exports = Config = (function() {
    Config.ROOT_KEY = 'atom-lint';

    Config.getAbsoluteKeyPath = function() {
      var keys;
      keys = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      keys.unshift(this.ROOT_KEY);
      return keys.join('.');
    };

    Config.get = function(keyPath) {
      var absoluteKeyPath;
      absoluteKeyPath = this.getAbsoluteKeyPath(keyPath);
      return atom.config.get(absoluteKeyPath);
    };

    Config.set = function(keyPath, value) {
      var absoluteKeyPath;
      absoluteKeyPath = this.getAbsoluteKeyPath(keyPath);
      return atom.config.set(absoluteKeyPath, value);
    };

    Config.onDidChange = function() {
      var absoluteKeyPath, args, callback, keyPath;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      callback = args.pop();
      keyPath = args;
      absoluteKeyPath = this.getAbsoluteKeyPath.apply(this, keyPath);
      return atom.config.onDidChange(absoluteKeyPath, callback);
    };

    function Config(subKey) {
      this.subKey = subKey;
    }

    Config.prototype.get = function(keyPath) {
      var absoluteKeyPath;
      absoluteKeyPath = Config.getAbsoluteKeyPath(this.subKey, keyPath);
      return atom.config.get(absoluteKeyPath);
    };

    Config.prototype.isFileToLint = function(absolutePath) {
      var globalIgnoredNames, ignoredNames, linterIgnoredNames, relativePath;
      linterIgnoredNames = this.get('ignoredNames') || [];
      globalIgnoredNames = Config.get('ignoredNames') || [];
      ignoredNames = linterIgnoredNames.concat(globalIgnoredNames);
      relativePath = atom.project.relativize(absolutePath);
      return ignoredNames.every(function(ignoredName) {
        return !minimatch(relativePath, ignoredName);
      });
    };

    return Config;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsTUFBQyxDQUFBLFFBQUQsR0FBVyxXQUFYLENBQUE7O0FBQUEsSUFFQSxNQUFDLENBQUEsa0JBQUQsR0FBcUIsU0FBQSxHQUFBO0FBQ25CLFVBQUEsSUFBQTtBQUFBLE1BRG9CLDhEQUNwQixDQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxRQUFkLENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUZtQjtJQUFBLENBRnJCLENBQUE7O0FBQUEsSUFNQSxNQUFDLENBQUEsR0FBRCxHQUFNLFNBQUMsT0FBRCxHQUFBO0FBQ0osVUFBQSxlQUFBO0FBQUEsTUFBQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixPQUFwQixDQUFsQixDQUFBO2FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGVBQWhCLEVBRkk7SUFBQSxDQU5OLENBQUE7O0FBQUEsSUFVQSxNQUFDLENBQUEsR0FBRCxHQUFNLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUNKLFVBQUEsZUFBQTtBQUFBLE1BQUEsZUFBQSxHQUFrQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsT0FBcEIsQ0FBbEIsQ0FBQTthQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixlQUFoQixFQUFpQyxLQUFqQyxFQUZJO0lBQUEsQ0FWTixDQUFBOztBQUFBLElBY0EsTUFBQyxDQUFBLFdBQUQsR0FBYyxTQUFBLEdBQUE7QUFDWixVQUFBLHdDQUFBO0FBQUEsTUFEYSw4REFDYixDQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEdBQUwsQ0FBQSxDQUFYLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7QUFBQSxNQUdBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGtCQUFELGFBQW9CLE9BQXBCLENBSGxCLENBQUE7YUFJQSxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVosQ0FBd0IsZUFBeEIsRUFBeUMsUUFBekMsRUFMWTtJQUFBLENBZGQsQ0FBQTs7QUFxQmEsSUFBQSxnQkFBRSxNQUFGLEdBQUE7QUFBVyxNQUFWLElBQUMsQ0FBQSxTQUFBLE1BQVMsQ0FBWDtJQUFBLENBckJiOztBQUFBLHFCQXVCQSxHQUFBLEdBQUssU0FBQyxPQUFELEdBQUE7QUFDSCxVQUFBLGVBQUE7QUFBQSxNQUFBLGVBQUEsR0FBa0IsTUFBTSxDQUFDLGtCQUFQLENBQTBCLElBQUMsQ0FBQSxNQUEzQixFQUFtQyxPQUFuQyxDQUFsQixDQUFBO2FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGVBQWhCLEVBRkc7SUFBQSxDQXZCTCxDQUFBOztBQUFBLHFCQTJCQSxZQUFBLEdBQWMsU0FBQyxZQUFELEdBQUE7QUFDWixVQUFBLGtFQUFBO0FBQUEsTUFBQSxrQkFBQSxHQUFxQixJQUFDLENBQUEsR0FBRCxDQUFLLGNBQUwsQ0FBQSxJQUF3QixFQUE3QyxDQUFBO0FBQUEsTUFDQSxrQkFBQSxHQUFxQixNQUFNLENBQUMsR0FBUCxDQUFXLGNBQVgsQ0FBQSxJQUE4QixFQURuRCxDQUFBO0FBQUEsTUFFQSxZQUFBLEdBQWUsa0JBQWtCLENBQUMsTUFBbkIsQ0FBMEIsa0JBQTFCLENBRmYsQ0FBQTtBQUFBLE1BSUEsWUFBQSxHQUFlLElBQUksQ0FBQyxPQUFPLENBQUMsVUFBYixDQUF3QixZQUF4QixDQUpmLENBQUE7YUFNQSxZQUFZLENBQUMsS0FBYixDQUFtQixTQUFDLFdBQUQsR0FBQTtlQUNqQixDQUFBLFNBQUMsQ0FBVSxZQUFWLEVBQXdCLFdBQXhCLEVBRGdCO01BQUEsQ0FBbkIsRUFQWTtJQUFBLENBM0JkLENBQUE7O2tCQUFBOztNQUpGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/config.coffee