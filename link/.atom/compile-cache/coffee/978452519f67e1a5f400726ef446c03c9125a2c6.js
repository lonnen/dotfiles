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
      this.plugins[name] = plugin;
      this.emit('plugin:added', {
        name: name,
        plugin: plugin
      });
      if (atom.config.get('minimap.displayPluginsControls')) {
        this.registerPluginControls(name, plugin);
      }
      return this.updatesPluginActivationState(name);
    };

    PluginManagement.prototype.unregisterPlugin = function(name) {
      var plugin;
      plugin = this.plugins[name];
      if (atom.config.get('minimap.displayPluginsControls')) {
        this.unregisterPluginControls(name);
      }
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

    PluginManagement.prototype.registerPluginControls = function(name, plugin) {
      var settingsKey;
      settingsKey = "minimap.plugins." + name;
      this.configDefaults.plugins[name] = true;
      if (atom.config.get(settingsKey) == null) {
        atom.config.set(settingsKey, true);
      }
      atom.config.observe(settingsKey, (function(_this) {
        return function() {
          return _this.updatesPluginActivationState(name);
        };
      })(this));
      return atom.workspaceView.command("minimap:toggle-" + name, (function(_this) {
        return function() {
          atom.config.set(settingsKey, !atom.config.get(settingsKey));
          return _this.updatesPluginActivationState(name);
        };
      })(this));
    };

    PluginManagement.prototype.unregisterPluginControls = function(name) {
      atom.config.unobserve("minimap.plugins." + name);
      atom.workspaceView.off("minimap:toggle-" + name);
      return delete this.configDefaults.plugins[name];
    };

    return PluginManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVCQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBYUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUVKLHVDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSwrQkFBQSxPQUFBLEdBQVMsRUFBVCxDQUFBOztBQUFBLCtCQU9BLGNBQUEsR0FBZ0IsU0FBQyxJQUFELEVBQU8sTUFBUCxHQUFBO0FBQ2QsTUFBQSxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FBVCxHQUFpQixNQUFqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsSUFBRCxDQUFNLGNBQU4sRUFBc0I7QUFBQSxRQUFDLE1BQUEsSUFBRDtBQUFBLFFBQU8sUUFBQSxNQUFQO09BQXRCLENBRkEsQ0FBQTtBQUlBLE1BQUEsSUFBeUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUF6QztBQUFBLFFBQUEsSUFBQyxDQUFBLHNCQUFELENBQXdCLElBQXhCLEVBQThCLE1BQTlCLENBQUEsQ0FBQTtPQUpBO2FBTUEsSUFBQyxDQUFBLDRCQUFELENBQThCLElBQTlCLEVBUGM7SUFBQSxDQVBoQixDQUFBOztBQUFBLCtCQW1CQSxnQkFBQSxHQUFrQixTQUFDLElBQUQsR0FBQTtBQUNoQixVQUFBLE1BQUE7QUFBQSxNQUFBLE1BQUEsR0FBUyxJQUFDLENBQUEsT0FBUSxDQUFBLElBQUEsQ0FBbEIsQ0FBQTtBQUNBLE1BQUEsSUFBbUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGdDQUFoQixDQUFuQztBQUFBLFFBQUEsSUFBQyxDQUFBLHdCQUFELENBQTBCLElBQTFCLENBQUEsQ0FBQTtPQURBO0FBQUEsTUFFQSxNQUFBLENBQUEs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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/mixins/plugin-management.coffee