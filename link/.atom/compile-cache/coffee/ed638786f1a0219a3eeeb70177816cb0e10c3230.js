(function() {
  var fs, path;

  fs = require('fs-plus');

  path = require('path');

  module.exports = {
    get: function() {
      var persistentCache;
      if (this.ephemeralCache != null) {
        return this.ephemeralCache;
      }
      persistentCache = this.loadPersistentCache();
      this.ephemeralCache = this.selectRicherEnv(persistentCache);
      this.savePersistentCache(this.ephemeralCache);
      return this.ephemeralCache;
    },
    clear: function() {
      this.clearEphemeralCache();
      return this.clearPersistentCache();
    },
    clearEphemeralCache: function() {
      return this.ephemeralCache = null;
    },
    clearPersistentCache: function() {
      var cacheFilePath;
      cacheFilePath = this.getPersistentCacheFilePath();
      if (fs.existsSync(cacheFilePath)) {
        return fs.unlinkSync(cacheFilePath);
      }
    },
    selectRicherEnv: function(cached) {
      var current, _ref, _ref1;
      current = process.env;
      if (current.SHLVL != null) {
        return current;
      }
      if (cached.SHLVL != null) {
        return cached;
      }
      if (this.getKeyCount(current) === this.getKeyCount(cached)) {
        if (((_ref = current.PATH) != null ? _ref.length : void 0) >= ((_ref1 = cached.PATH) != null ? _ref1.length : void 0)) {
          return current;
        } else {
          return cached;
        }
      } else if (this.getKeyCount(current) > this.getKeyCount(cached)) {
        return current;
      } else {
        return cached;
      }
    },
    loadPersistentCache: function() {
      var cacheFilePath, json;
      cacheFilePath = this.getPersistentCacheFilePath();
      if (fs.existsSync(cacheFilePath)) {
        json = fs.readFileSync(cacheFilePath);
        return JSON.parse(json);
      } else {
        return {};
      }
    },
    savePersistentCache: function(env) {
      var json;
      json = JSON.stringify(env);
      return fs.writeFileSync(this.getPersistentCacheFilePath(), json);
    },
    getPersistentCacheFilePath: function() {
      var dotAtomPath;
      dotAtomPath = fs.absolute('~/.atom');
      return path.join(dotAtomPath, 'storage', 'atom-lint-env.json');
    },
    getKeyCount: function(object) {
      return Object.keys(object).length;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFFBQUE7O0FBQUEsRUFBQSxFQUFBLEdBQUssT0FBQSxDQUFRLFNBQVIsQ0FBTCxDQUFBOztBQUFBLEVBQ0EsSUFBQSxHQUFPLE9BQUEsQ0FBUSxNQUFSLENBRFAsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0U7QUFBQSxJQUFBLEdBQUEsRUFBSyxTQUFBLEdBQUE7QUFDSCxVQUFBLGVBQUE7QUFBQSxNQUFBLElBQTBCLDJCQUExQjtBQUFBLGVBQU8sSUFBQyxDQUFBLGNBQVIsQ0FBQTtPQUFBO0FBQUEsTUFFQSxlQUFBLEdBQWtCLElBQUMsQ0FBQSxtQkFBRCxDQUFBLENBRmxCLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxjQUFELEdBQWtCLElBQUMsQ0FBQSxlQUFELENBQWlCLGVBQWpCLENBSGxCLENBQUE7QUFBQSxNQUlBLElBQUMsQ0FBQSxtQkFBRCxDQUFxQixJQUFDLENBQUEsY0FBdEIsQ0FKQSxDQUFBO2FBS0EsSUFBQyxDQUFBLGVBTkU7SUFBQSxDQUFMO0FBQUEsSUFRQSxLQUFBLEVBQU8sU0FBQSxHQUFBO0FBQ0wsTUFBQSxJQUFDLENBQUEsbUJBQUQsQ0FBQSxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsb0JBQUQsQ0FBQSxFQUZLO0lBQUEsQ0FSUDtBQUFBLElBWUEsbUJBQUEsRUFBcUIsU0FBQSxHQUFBO2FBQ25CLElBQUMsQ0FBQSxjQUFELEdBQWtCLEtBREM7SUFBQSxDQVpyQjtBQUFBLElBZUEsb0JBQUEsRUFBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsYUFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsMEJBQUQsQ0FBQSxDQUFoQixDQUFBO0FBRUEsTUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsYUFBZCxDQUFIO2VBQ0UsRUFBRSxDQUFDLFVBQUgsQ0FBYyxhQUFkLEVBREY7T0FIb0I7SUFBQSxDQWZ0QjtBQUFBLElBcUJBLGVBQUEsRUFBaUIsU0FBQyxNQUFELEdBQUE7QUFDZixVQUFBLG9CQUFBO0FBQUEsTUFBQSxPQUFBLEdBQVUsT0FBTyxDQUFDLEdBQWxCLENBQUE7QUFFQSxNQUFBLElBQWtCLHFCQUFsQjtBQUFBLGVBQU8sT0FBUCxDQUFBO09BRkE7QUFHQSxNQUFBLElBQWlCLG9CQUFqQjtBQUFBLGVBQU8sTUFBUCxDQUFBO09BSEE7QUFLQSxNQUFBLElBQUcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxPQUFiLENBQUEsS0FBeUIsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLENBQTVCO0FBQ0UsUUFBQSx5Q0FBZSxDQUFFLGdCQUFkLDBDQUFtQyxDQUFFLGdCQUF4QztpQkFDRSxRQURGO1NBQUEsTUFBQTtpQkFHRSxPQUhGO1NBREY7T0FBQSxNQUtLLElBQUcsSUFBQyxDQUFBLFdBQUQsQ0FBYSxPQUFiLENBQUEsR0FBd0IsSUFBQyxDQUFBLFdBQUQsQ0FBYSxNQUFiLENBQTNCO2VBQ0gsUUFERztPQUFBLE1BQUE7ZUFHSCxPQUhHO09BWFU7SUFBQSxDQXJCakI7QUFBQSxJQXFDQSxtQkFBQSxFQUFxQixTQUFBLEdBQUE7QUFDbkIsVUFBQSxtQkFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixJQUFDLENBQUEsMEJBQUQsQ0FBQSxDQUFoQixDQUFBO0FBRUEsTUFBQSxJQUFHLEVBQUUsQ0FBQyxVQUFILENBQWMsYUFBZCxDQUFIO0FBQ0UsUUFBQSxJQUFBLEdBQU8sRUFBRSxDQUFDLFlBQUgsQ0FBZ0IsYUFBaEIsQ0FBUCxDQUFBO2VBQ0EsSUFBSSxDQUFDLEtBQUwsQ0FBVyxJQUFYLEVBRkY7T0FBQSxNQUFBO2VBSUUsR0FKRjtPQUhtQjtJQUFBLENBckNyQjtBQUFBLElBOENBLG1CQUFBLEVBQXFCLFNBQUMsR0FBRCxHQUFBO0FBQ25CLFVBQUEsSUFBQTtBQUFBLE1BQUEsSUFBQSxHQUFPLElBQUksQ0FBQyxTQUFMLENBQWUsR0FBZixDQUFQLENBQUE7YUFDQSxFQUFFLENBQUMsYUFBSCxDQUFpQixJQUFDLENBQUEsMEJBQUQsQ0FBQSxDQUFqQixFQUFnRCxJQUFoRCxFQUZtQjtJQUFBLENBOUNyQjtBQUFBLElBa0RBLDBCQUFBLEVBQTRCLFNBQUEsR0FBQTtBQUMxQixVQUFBLFdBQUE7QUFBQSxNQUFBLFdBQUEsR0FBYyxFQUFFLENBQUMsUUFBSCxDQUFZLFNBQVosQ0FBZCxDQUFBO2FBQ0EsSUFBSSxDQUFDLElBQUwsQ0FBVSxXQUFWLEVBQXVCLFNBQXZCLEVBQWtDLG9CQUFsQyxFQUYwQjtJQUFBLENBbEQ1QjtBQUFBLElBc0RBLFdBQUEsRUFBYSxTQUFDLE1BQUQsR0FBQTthQUNYLE1BQU0sQ0FBQyxJQUFQLENBQVksTUFBWixDQUFtQixDQUFDLE9BRFQ7SUFBQSxDQXREYjtHQUpGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/env-store.coffee