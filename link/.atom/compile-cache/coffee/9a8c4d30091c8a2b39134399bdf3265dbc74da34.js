(function() {
  var Mixin, PluginManagement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  module.exports = PluginManagement = (function(_super) {
    __extends(PluginManagement, _super);

    function PluginManagement() {
      return PluginManagement.__super__.constructor.apply(this, arguments);
    }

    PluginManagement.prototype.plugins = {};

    PluginManagement.prototype.registerPlugin = function(name, plugin) {
      var settingsKey;
      settingsKey = "minimap.plugins." + name;
      this.configDefaults.plugins[name] = true;
      if (atom.config.get(settingsKey) == null) {
        atom.config.set(settingsKey, true);
      }
      this.plugins[name] = plugin;
      this.emit('plugin:added', {
        name: name,
        plugin: plugin
      });
      atom.config.observe(settingsKey, (function(_this) {
        return function() {
          return _this.updatesPluginActivationState(name);
        };
      })(this));
      atom.workspaceView.command("minimap:toggle-" + name, (function(_this) {
        return function() {
          atom.config.set(settingsKey, !atom.config.get(settingsKey));
          return _this.updatesPluginActivationState(name);
        };
      })(this));
      return this.updatesPluginActivationState(name);
    };

    PluginManagement.prototype.unregisterPlugin = function(name) {
      var plugin;
      atom.config.unobserve("minimap.plugins." + name);
      atom.workspaceView.off("minimap:toggle-" + name);
      plugin = this.plugins[name];
      delete this.configDefaults.plugins[name];
      delete this.plugins[name];
      return this.emit('plugin:removed', {
        name: name,
        plugin: plugin
      });
    };

    PluginManagement.prototype.updatesPluginActivationState = function(name) {
      var plugin, pluginActive, settingActive;
      plugin = this.plugins[name];
      pluginActive = plugin.isActive();
      settingActive = atom.config.get("minimap.plugins." + name);
      if (settingActive && !pluginActive) {
        plugin.activatePlugin();
        return this.emit('plugin:activated', {
          name: name,
          plugin: plugin
        });
      } else if (pluginActive && !settingActive) {
        plugin.deactivatePlugin();
        return this.emit('plugin:deactivated', {
          name: name,
          plugin: plugin
        });
      }
    };

    return PluginManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxPQUFBLEdBQVMsRUFBVCxDQUFBOztBQUFBLCtCQU9BLGNBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sTUFBUCxHQUFBO0FBQ2QsVUFBQSxXQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWUsa0JBQUEsR0FBaUIsSUFBaEMsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxPQUFRLENBQUEsSUFBQSxDQUF4QixHQUFnQyxJQUZoQyxDQUFBO0FBR0EsTUFBQSxJQUEwQyxvQ0FBMUM7QUFBQSxRQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixXQUFoQixFQUE2QixJQUE3QixDQUFBLENBQUE7T0FIQTtBQUFBLE1BS0EsSUFBQyxDQUFBLE9BQVEsQ0FBQSxJQUFBLENBQVQsR0FBaUIsTUFMakIsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxjQUFOLEVBQXNCO0FBQUEsUUFBQyxNQUFBLElBQUQ7QUFBQSxRQUFPLFFBQUEsTUFBUDtPQUF0QixDQVBBLENBQUE7QUFBQSxNQVNBLElBQUksQ0FBQyxNQUFNLENBQUMsT0FBWixDQUFvQixXQUFwQixFQUFpQyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMvQixLQUFDLENBQUEsNEJBQUQsQ0FBOEIsSUFBOUIsRUFEK0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQyxDQVRBLENBQUE7QUFBQSxNQVlBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBNEIsaUJBQUEsR0FBZ0IsSUFBNUMsRUFBcUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNuRCxVQUFBLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixXQUFoQixFQUE2QixDQUFBLElBQVEsQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixXQUFoQixDQUFqQyxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLDRCQUFELENBQThCLElBQTlCLEVBRm1EO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBckQsQ0FaQSxDQUFBO2FBZ0JBLElBQUMsQ0FBQSw0QkFBRCxDQUE4QixJQUE5QixFQWpCYztJQUFBLENBUGhCLENBQUE7O0FBQUEsK0JBNkJBLGdCQUFBLEdBQWtCLFNBQUMsSUFBRCxHQUFBO0FBQ2hCLFVBQUEsTUFBQTtBQUFBLE1BQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFaLENBQXVCLGtCQUFBLEdBQWlCLElBQXhDLENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFuQixDQUF3QixpQkFBQSxHQUFnQixJQUF4QyxDQURBLENBQUE7QUFBQSxNQUVBLE1BQUEsR0FBUyxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FGbEIsQ0FBQTtBQUFBLE1BR0EsTUFBQSxDQUFBLElBQVEsQ0FBQSxjQUFjLENBQUMsT0FBUSxDQUFBLElBQUEsQ0FIL0IsQ0FBQTtBQUFBLE1BSUEsTUFBQSxDQUFBLElBQVEsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUpoQixDQUFBO2FBS0EsSUFBQyxDQUFBLElBQUQsQ0FBTSxnQkFBTixFQUF3QjtBQUFBLFFBQUMsTUFBQSxJQUFEO0FBQUEsUUFBTyxRQUFBLE1BQVA7T0FBeEIsRUFOZ0I7SUFBQSxDQTdCbEIsQ0FBQTs7QUFBQSwrQkF1Q0EsNEJBQUEsR0FBOEIsU0FBQyxJQUFELEdBQUE7QUFDNUIsVUFBQSxtQ0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUMsQ0FBQSxPQUFRLENBQUEsSUFBQSxDQUFsQixDQUFBO0FBQUEsTUFFQSxZQUFBLEdBQWUsTUFBTSxDQUFDLFFBQVAsQ0FBQSxDQUZmLENBQUE7QUFBQSxNQUdBLGFBQUEsR0FBZ0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWlCLGtCQUFBLEdBQWlCLElBQWxDLENBSGhCLENBQUE7QUFLQSxNQUFBLElBQUcsYUFBQSxJQUFrQixDQUFBLFlBQXJCO0FBQ0UsUUFBQSxNQUFNLENBQUMsY0FBUCxDQUFBLENBQUEsQ0FBQTtlQUNBLElBQUMsQ0FBQSxJQUFELENBQU0sa0JBQU4sRUFBMEI7QUFBQSxVQUFDLE1BQUEsSUFBRDtBQUFBLFVBQU8sUUFBQSxNQUFQO1NBQTFCLEVBRkY7T0FBQSxNQUdLLElBQUcsWUFBQSxJQUFpQixDQUFBLGFBQXBCO0FBQ0gsUUFBQSxNQUFNLENBQUMsZ0JBQVAsQ0FBQSxDQUFBLENBQUE7ZUFDQSxJQUFDLENBQUEsSUFBRCxDQUFNLG9CQUFOLEVBQTRCO0FBQUEsVUFBQyxNQUFBLElBQUQ7QUFBQSxVQUFPLFFBQUEsTUFBUDtTQUE1QixFQUZHO09BVHVCO0lBQUEsQ0F2QzlCLENBQUE7OzRCQUFBOztLQUY2QixNQWQvQixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/mixins/plugin-management.coffee