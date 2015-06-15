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
      minimapScrollIndicator: true,
      lineOverdraw: 10,
      useHardwareAcceleration: true
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
      if (atom.config.get('minimap.autoToggle')) {
        this.toggleNoDebug();
      }
      atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
      return atom.config.observe('minimap.displayMinimapOnLeft', (function(_this) {
        return function() {
          return atom.workspaceView.toggleClass('minimap-on-left', atom.config.get('minimap.displayMinimapOnLeft'));
        };
      })(this));
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

    Minimap.prototype.getCharWidthRatio = function() {
      return 0.72;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsVUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsUUFBUixDQURSLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FGVCxDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUxuQixDQUFBOztBQUFBLEVBT0EsT0FBQSxDQUFRLHFCQUFSLENBUEEsQ0FBQTs7QUFBQSxFQTRFTTt5QkFDSjs7QUFBQSxJQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLEtBQUEsQ0FBTSxTQUFOLENBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FEQSxDQUFBOztBQUFBLElBRUEsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsT0FBM0IsQ0FGQSxDQUFBOztBQUFBLElBR0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FIQSxDQUFBOztBQUFBLHNCQU1BLE9BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxPQU5wQyxDQUFBOztBQUFBLHNCQVNBLGNBQUEsR0FDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLEVBQVQ7QUFBQSxNQUNBLFVBQUEsRUFBWSxLQURaO0FBQUEsTUFFQSxvQkFBQSxFQUFzQixLQUZ0QjtBQUFBLE1BR0Esc0JBQUEsRUFBd0IsSUFIeEI7QUFBQSxNQUlBLFlBQUEsRUFBYyxFQUpkO0FBQUEsTUFLQSx1QkFBQSxFQUF5QixJQUx6QjtLQVZGLENBQUE7O0FBQUEsc0JBbUJBLE1B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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap.coffee