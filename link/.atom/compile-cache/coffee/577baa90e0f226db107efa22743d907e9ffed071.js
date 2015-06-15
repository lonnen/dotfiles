(function() {
  var Debug, Emitter, Minimap, PluginManagement, ViewManagement, semver;

  Emitter = require('emissary').Emitter;

  Debug = require('prolix');

  semver = require('semver');

  ViewManagement = require('./mixins/view-management');

  PluginManagement = require('./mixins/plugin-management');

  require('../vendor/resizeend');

  Minimap = (function() {
    function Minimap() {}

    Emitter.includeInto(Minimap);

    Debug('minimap').includeInto(Minimap);

    ViewManagement.includeInto(Minimap);

    PluginManagement.includeInto(Minimap);

    Minimap.prototype.version = require('../package.json').version;

    Minimap.prototype.configDefaults = {
      plugins: {},
      autoToggle: false,
      displayMinimapOnLeft: false,
      displayCodeHighlights: true,
      displayPluginsControls: true,
      minimapScrollIndicator: true,
      lineOverdraw: 10,
      useHardwareAcceleration: true,
      scale: 0.16
    };

    Minimap.prototype.active = false;

    Minimap.prototype.activate = function() {
      atom.workspaceView.command('minimap:toggle', (function(_this) {
        return function() {
          return _this.toggleNoDebug();
        };
      })(this));
      atom.workspaceView.command('minimap:toggle-debug', (function(_this) {
        return function() {
          return _this.toggleDebug();
        };
      })(this));
      if (atom.config.get('minimap.displayPluginsControls')) {
        atom.workspaceView.command('minimap:open-quick-settings', (function(_this) {
          return function() {
            return atom.workspaceView.getActivePaneView().find('.minimap .open-minimap-quick-settings').mousedown();
          };
        })(this));
      }
      atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
      atom.config.observe('minimap.displayMinimapOnLeft', (function(_this) {
        return function() {
          return atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
        };
      })(this));
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggleNoDebug();
      }
    };

    Minimap.prototype.deactivate = function() {
      this.destroyViews();
      return this.emit('deactivated');
    };

    Minimap.prototype.toggleDebug = function() {
      this.getChannel().activate();
      return this.toggle();
    };

    Minimap.prototype.toggleNoDebug = function() {
      this.getChannel().deactivate();
      return this.toggle();
    };

    Minimap.prototype.versionMatch = function(expectedVersion) {
      return semver.satisfies(this.version, expectedVersion);
    };

    Minimap.prototype.toggle = function() {
      if (this.active) {
        this.active = false;
        return this.deactivate();
      } else {
        this.createViews();
        this.active = true;
        return this.emit('activated');
      }
    };

    return Minimap;

  })();

  module.exports = new Minimap();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsVUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsUUFBUixDQURSLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FGVCxDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUxuQixDQUFBOztBQUFBLEVBT0EsT0FBQSxDQUFRLHFCQUFSLENBUEEsQ0FBQTs7QUFBQSxFQTRFTTt5QkFDSjs7QUFBQSxJQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLEtBQUEsQ0FBTSxTQUFOLENBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FEQSxDQUFBOztBQUFBLElBRUEsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsT0FBM0IsQ0FGQSxDQUFBOztBQUFBLElBR0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FIQSxDQUFBOztBQUFBLHNCQU1BLE9BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxPQU5wQyxDQUFBOztBQUFBLHNCQVNBLGNBQUEsR0FDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLEVBQVQ7QUFBQSxNQUNBLFVBQUEsRUFBWSxLQURaO0FBQUEsTUFFQSxvQkFBQSxFQUFzQixLQUZ0QjtBQUFBLE1BR0EscUJBQUEsRUFBdUIsSUFIdkI7QUFBQSxNQUlBLHNCQUFBLEVBQXdCLElBSnhCO0FBQUEsTUFLQSxzQkFBQSxFQUF3QixJQUx4QjtBQUFBLE1BTUEsWUFBQSxFQUFjLEVB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap.coffee