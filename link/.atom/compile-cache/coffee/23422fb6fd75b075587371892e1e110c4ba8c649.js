(function() {
  var CompositeDisposable, Emitter, Minimap, MinimapPluginGeneratorView, PluginManagement, ViewManagement, deprecate, semver, _ref, _ref1;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  ViewManagement = require('./mixins/view-management');

  PluginManagement = require('./mixins/plugin-management');

  _ref1 = [], MinimapPluginGeneratorView = _ref1[0], deprecate = _ref1[1], semver = _ref1[2];

  require('../vendor/resizeend');

  Minimap = (function() {
    ViewManagement.includeInto(Minimap);

    PluginManagement.includeInto(Minimap);


    /* Public */

    Minimap.prototype.version = require('../package.json').version;

    Minimap.prototype.config = {
      plugins: {
        type: 'object',
        properties: {}
      },
      autoToggle: {
        type: 'boolean',
        "default": true
      },
      displayMinimapOnLeft: {
        type: 'boolean',
        "default": false
      },
      displayCodeHighlights: {
        type: 'boolean',
        "default": true,
        description: 'Toggles the render of the buffer tokens in the minimap.'
      },
      displayPluginsControls: {
        type: 'boolean',
        "default": true,
        description: 'You need to restart Atom for this setting to be effective.'
      },
      minimapScrollIndicator: {
        type: 'boolean',
        "default": true,
        description: 'Toggles the display of a side line showing which part of the buffer is currently displayed by the minimap. This side line will only appear if the minimap is taller than the editor view height.'
      },
      useHardwareAcceleration: {
        type: 'boolean',
        "default": true
      },
      adjustMinimapWidthToSoftWrap: {
        type: 'boolean',
        "default": true,
        description: 'If this option is enabled and Soft Wrap is checked then the Minimap max width is set to the Preferred Line Length value.'
      },
      charWidth: {
        type: 'integer',
        "default": 1,
        minimum: 1
      },
      charHeight: {
        type: 'integer',
        "default": 2,
        minimum: 1
      },
      interline: {
        type: 'integer',
        "default": 1,
        minimum: 1,
        description: 'The space between lines in the minimap in pixels.'
      },
      textOpacity: {
        type: 'number',
        "default": 0.6,
        minimum: 0,
        maximum: 1,
        description: "The opacity used to render the line's text in the minimap."
      }
    };

    Minimap.prototype.active = false;

    function Minimap() {
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
    }

    Minimap.prototype.activate = function() {
      var workspaceElement;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'minimap:toggle': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this),
        'minimap:generate-plugin': (function(_this) {
          return function() {
            return _this.generatePlugin();
          };
        })(this)
      }));
      workspaceElement = atom.views.getView(atom.workspace);
      if (atom.config.get('minimap.displayPluginsControls')) {
        this.subscriptions.add(atom.commands.add('atom-workspace', {
          'minimap:open-quick-settings': function() {
            var editor;
            editor = atom.workspace.getActiveEditor();
            return this.minimapForEditor(editor).openQuickSettings.mousedown();
          }
        }));
      }
      this.subscriptions.add(atom.config.observe('minimap.displayMinimapOnLeft', function(value) {
        return workspaceElement.classList.toggle('minimap-on-left', value);
      }));
      if (atom.config.get('minimap.autoToggle')) {
        return this.toggle();
      }
    };

    Minimap.prototype.deactivate = function() {
      this.active = false;
      this.destroyViews();
      return this.emitter.emit('did-deactivate');
    };

    Minimap.prototype.versionMatch = function(expectedVersion) {
      if (semver == null) {
        semver = require('semver');
      }
      return semver.satisfies(this.version, expectedVersion);
    };

    Minimap.prototype.toggle = function() {
      if (this.active) {
        this.active = false;
        return this.deactivate();
      } else {
        this.createViews();
        this.active = true;
        return this.emitter.emit('did-activate');
      }
    };

    Minimap.prototype.generatePlugin = function() {
      var view;
      if (MinimapPluginGeneratorView == null) {
        MinimapPluginGeneratorView = require('./minimap-plugin-generator-view');
      }
      return view = new MinimapPluginGeneratorView();
    };

    Minimap.prototype.onDidActivate = function(callback) {
      return this.emitter.on('did-activate', callback);
    };

    Minimap.prototype.onDidDeactivate = function(callback) {
      return this.emitter.on('did-deactivate', callback);
    };

    Minimap.prototype.onDidCreateMinimap = function(callback) {
      return this.emitter.on('did-create-minimap', callback);
    };

    Minimap.prototype.onWillDestroyMinimap = function(callback) {
      return this.emitter.on('will-destroy-minimap', callback);
    };

    Minimap.prototype.onDidDestroyMinimap = function(callback) {
      return this.emitter.on('did-destroy-minimap', callback);
    };

    Minimap.prototype.onDidAddPlugin = function(callback) {
      return this.emitter.on('did-add-plugin', callback);
    };

    Minimap.prototype.onDidRemovePlugin = function(callback) {
      return this.emitter.on('did-remove-plugin', callback);
    };

    Minimap.prototype.onDidActivatePlugin = function(callback) {
      return this.emitter.on('did-activate-plugin', callback);
    };

    Minimap.prototype.onDidDeactivatePlugin = function(callback) {
      return this.emitter.on('did-deactivate-plugin', callback);
    };

    return Minimap;

  })();

  module.exports = new Minimap();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1JQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBRUEsY0FBQSxHQUFpQixPQUFBLENBQVEsMEJBQVIsQ0FGakIsQ0FBQTs7QUFBQSxFQUdBLGdCQUFBLEdBQW1CLE9BQUEsQ0FBUSw0QkFBUixDQUhuQixDQUFBOztBQUFBLEVBS0EsUUFBa0QsRUFBbEQsRUFBQyxxQ0FBRCxFQUE2QixvQkFBN0IsRUFBd0MsaUJBTHhDLENBQUE7O0FBQUEsRUFPQSxPQUFBLENBQVEscUJBQVIsQ0FQQSxDQUFBOztBQUFBLEVBd0JNO0FBQ0osSUFBQSxjQUFjLENBQUMsV0FBZixDQUEyQixPQUEzQixDQUFBLENBQUE7O0FBQUEsSUFDQSxnQkFBZ0IsQ0FBQyxXQUFqQixDQUE2QixPQUE3QixDQURBLENBQUE7O0FBR0E7QUFBQSxnQkFIQTs7QUFBQSxzQkFNQSxPQUFBLEdBQVMsT0FBQSxDQUFRLGlCQUFSLENBQTBCLENBQUMsT0FOcEMsQ0FBQTs7QUFBQSxzQkFTQSxNQUFBLEdBQ0U7QUFBQSxNQUFBLE9BQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFFBQU47QUFBQSxRQUNBLFVBQUEsRUFBWSxFQURaO09BREY7QUFBQSxNQUdBLFVBQUEsRUFDRTtBQUFBLFFBQUEsSUFBQSxFQUFNLFNBQU47QUFBQSxRQUNBLFNBQUEsRUFBUyxJQURUO09BSkY7QUFBQSxNQU1BLG9CQUFBLEVBQ0U7QUFBQSxRQUFBLElBQUEsRUFBTSxTQUFOO0FBQUEsUUFDQSxTQUFBLEVBQVMsS0FEVDtPQVBGO0FBQUEsTUFTQSxxQkFBQSxFQUNFO0FBQUEsUUFBQSxJQUFBLEVBQU0sU0FBTjtBQUFBLFFBQ0EsU0FB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap.coffee