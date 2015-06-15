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

    Config.observe = function() {
      var absoluteKeyPath, args, callback, keyPath, options;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      callback = args.pop();
      keyPath = args;
      absoluteKeyPath = this.getAbsoluteKeyPath.apply(this, keyPath);
      options = {
        callNow: false
      };
      return atom.config.observe(absoluteKeyPath, options, callback);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBO0lBQUEsa0JBQUE7O0FBQUEsRUFBQSxTQUFBLEdBQVksT0FBQSxDQUFRLFdBQVIsQ0FBWixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsTUFBQyxDQUFBLFFBQUQsR0FBVyxXQUFYLENBQUE7O0FBQUEsSUFFQSxNQUFDLENBQUEsa0JBQUQsR0FBcUIsU0FBQSxHQUFBO0FBQ25CLFVBQUEsSUFBQTtBQUFBLE1BRG9CLDhEQUNwQixDQUFBO0FBQUEsTUFBQSxJQUFJLENBQUMsT0FBTCxDQUFhLElBQUMsQ0FBQSxRQUFkLENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxJQUFMLENBQVUsR0FBVixFQUZtQjtJQUFBLENBRnJCLENBQUE7O0FBQUEsSUFNQSxNQUFDLENBQUEsR0FBRCxHQUFNLFNBQUMsT0FBRCxHQUFBO0FBQ0osVUFBQSxlQUFBO0FBQUEsTUFBQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxrQkFBRCxDQUFvQixPQUFwQixDQUFsQixDQUFBO2FBQ0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGVBQWhCLEVBRkk7SUFBQSxDQU5OLENBQUE7O0FBQUEsSUFVQSxNQUFDLENBQUEsR0FBRCxHQUFNLFNBQUMsT0FBRCxFQUFVLEtBQVYsR0FBQTtBQUNKLFVBQUEsZUFBQTtBQUFBLE1BQUEsZUFBQSxHQUFrQixJQUFDLENBQUEsa0JBQUQsQ0FBb0IsT0FBcEIsQ0FBbEIsQ0FBQTthQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixlQUFoQixFQUFpQyxLQUFqQyxFQUZJO0lBQUEsQ0FWTixDQUFBOztBQUFBLElBY0EsTUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7QUFDUixVQUFBLGlEQUFBO0FBQUEsTUFEUyw4REFDVCxDQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLEdBQUwsQ0FBQSxDQUFYLENBQUE7QUFBQSxNQUNBLE9BQUEsR0FBVSxJQURWLENBQUE7QUFBQSxNQUdBLGVBQUEsR0FBa0IsSUFBQyxDQUFBLGtCQUFELGFBQW9CLE9BQXBCLENBSGxCLENBQUE7QUFBQSxNQUlBLE9BQUEsR0FBVTtBQUFBLFFBQUUsT0FBQSxFQUFTLEtBQVg7T0FKVixDQUFBO2FBS0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGVBQXBCLEVBQXFDLE9BQXJDLEVBQThDLFFBQTlDLEVBTlE7SUFBQSxDQWRWLENBQUE7O0FBc0JhLElBQUEsZ0JBQUUsTUFBRixHQUFBO0FBQVcsTUFBVixJQUFDLENBQUEsU0FBQSxNQUFTLENBQVg7SUFBQSxDQXRCYjs7QUFBQSxxQkF3QkEsR0FBQSxHQUFLLFNBQUMsT0FBRCxHQUFBO0FBQ0gsVUFBQSxlQUFBO0FBQUEsTUFBQSxlQUFBLEdBQWtCLE1BQU0sQ0FBQyxrQkFBUCxDQUEwQixJQUFDLENBQUEsTUFBM0IsRUFBbUMsT0FBbkMsQ0FBbEIsQ0FBQTthQUNBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixlQUFoQixFQUZHO0lBQUEsQ0F4QkwsQ0FBQTs7QUFBQSxxQkE0QkEsWUFBQSxHQUFjLFNBQUMsWUFBRCxHQUFBO0FBQ1osVUFBQSxrRUFBQTtBQUFBLE1BQUEsa0JBQUEsR0FBcUIsSUFBQyxDQUFBLEdBQUQsQ0FBSyxjQUFMLENBQUEsSUFBd0IsRUFBN0MsQ0FBQTtBQUFBLE1BQ0Esa0JBQUEsR0FBcUIsTUFBTSxDQUFDLEdBQVAsQ0FBVyxjQUFYLENBQUEsSUFBOEIsRUFEbkQsQ0FBQTtBQUFBLE1BRUEsWUFBQSxHQUFlLGtCQUFrQixDQUFDLE1BQW5CLENBQTBCLGtCQUExQixDQUZmLENBQUE7QUFBQSxNQUlBLFlBQUEsR0FBZSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQWIsQ0FBd0IsWUFBeEIsQ0FKZixDQUFBO2FBTUEsWUFBWSxDQUFDLEtBQWIsQ0FBbUIsU0FBQyxXQUFELEdBQUE7ZUFDakIsQ0FBQSxTQUFDLENBQVUsWUFBVixFQUF3QixXQUF4QixFQURnQjtNQUFBLENBQW5CLEVBUFk7SUFBQSxDQTVCZCxDQUFBOztrQkFBQTs7TUFKRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/config.coffee