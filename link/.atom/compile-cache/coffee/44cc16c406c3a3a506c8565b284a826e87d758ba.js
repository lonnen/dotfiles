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
      lineOverdraw: 10
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBOztBQUFBLEVBQUMsVUFBVyxPQUFBLENBQVEsVUFBUixFQUFYLE9BQUQsQ0FBQTs7QUFBQSxFQUNBLEtBQUEsR0FBUSxPQUFBLENBQVEsUUFBUixDQURSLENBQUE7O0FBQUEsRUFFQSxNQUFBLEdBQVMsT0FBQSxDQUFRLFFBQVIsQ0FGVCxDQUFBOztBQUFBLEVBSUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVIsQ0FKakIsQ0FBQTs7QUFBQSxFQUtBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUxuQixDQUFBOztBQUFBLEVBT0EsT0FBQSxDQUFRLHFCQUFSLENBUEEsQ0FBQTs7QUFBQSxFQTRFTTt5QkFDSjs7QUFBQSxJQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLE9BQXBCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLEtBQUEsQ0FBTSxTQUFOLENBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FEQSxDQUFBOztBQUFBLElBRUEsY0FBYyxDQUFDLFdBQWYsQ0FBMkIsT0FBM0IsQ0FGQSxDQUFBOztBQUFBLElBR0EsZ0JBQWdCLENBQUMsV0FBakIsQ0FBNkIsT0FBN0IsQ0FIQSxDQUFBOztBQUFBLHNCQU1BLE9BQUEsR0FBUyxPQUFBLENBQVEsaUJBQVIsQ0FBMEIsQ0FBQyxPQU5wQyxDQUFBOztBQUFBLHNCQVNBLGNBQUEsR0FDRTtBQUFBLE1BQUEsT0FBQSxFQUFTLEVBQVQ7QUFBQSxNQUNBLFVBQUEsRUFBWSxLQURaO0FBQUEsTUFFQSxvQkFBQSxFQUFzQixLQUZ0QjtBQUFBLE1BR0Esc0JBQUEsRUFBd0IsSUFIeEI7QUFBQSxNQUlBLFlBQUEsRUFBYyxFQUpkO0tBVkYsQ0FBQTs7QUFBQSxzQkFrQkEsTUFBQSxHQUFRLEtBbEJSLENBQUE7O0FBQUEsc0JB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap.coffee