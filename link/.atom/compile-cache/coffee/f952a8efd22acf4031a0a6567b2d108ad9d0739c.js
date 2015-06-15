(function() {
  var $, CompositeDisposable, Emitter, Minimap, MinimapQuickSettingsView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  View = require('atom-space-pen-views').View;

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Emitter = _ref.Emitter;

  $ = View.__super__.constructor;

  Minimap = require('./main');

  module.exports = MinimapQuickSettingsView = (function(_super) {
    __extends(MinimapQuickSettingsView, _super);

    function MinimapQuickSettingsView() {
      this.selectPreviousItem = __bind(this.selectPreviousItem, this);
      this.selectNextItem = __bind(this.selectNextItem, this);
      this.toggleSelectedItem = __bind(this.toggleSelectedItem, this);
      this.destroy = __bind(this.destroy, this);
      return MinimapQuickSettingsView.__super__.constructor.apply(this, arguments);
    }

    MinimapQuickSettingsView.content = function() {
      return this.div({
        "class": 'select-list popover-list minimap-quick-settings'
      }, (function(_this) {
        return function() {
          _this.input({
            type: 'text',
            "class": 'hidden-input',
            outlet: 'hiddenInput'
          });
          return _this.ol({
            "class": 'list-group mark-active',
            outlet: 'list'
          }, function() {
            _this.li({
              "class": 'separator',
              outlet: 'separator'
            });
            return _this.li({
              "class": '',
              outlet: 'codeHighlights'
            }, 'code-highlights');
          });
        };
      })(this));
    };

    MinimapQuickSettingsView.prototype.selectedItem = null;

    MinimapQuickSettingsView.prototype.initialize = function(minimapView) {
      this.minimapView = minimapView;
      this.emitter = new Emitter;
      this.subscriptions = new CompositeDisposable;
      this.plugins = {};
      this.subscriptions.add(Minimap.onDidAddPlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.addItemFor(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Minimap.onDidRemovePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.removeItemFor(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Minimap.onDidActivatePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.activateItem(name, plugin);
        };
      })(this)));
      this.subscriptions.add(Minimap.onDidDeactivatePlugin((function(_this) {
        return function(_arg) {
          var name, plugin;
          name = _arg.name, plugin = _arg.plugin;
          return _this.deactivateItem(name, plugin);
        };
      })(this)));
      this.subscriptions.add(atom.commands.add('.minimap-quick-settings', {
        'core:move-up': (function(_this) {
          return function() {
            return _this.selectPreviousItem();
          };
        })(this),
        'core:move-down': (function(_this) {
          return function() {
            return _this.selectNextItem();
          };
        })(this),
        'core:cancel': (function(_this) {
          return function() {
            return _this.destroy();
          };
        })(this),
        'core:confirm': (function(_this) {
          return function() {
            return _this.toggleSelectedItem();
          };
        })(this)
      }));
      this.codeHighlights.toggleClass('active', this.minimapView.displayCodeHighlights);
      this.codeHighlights.on('mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          _this.minimapView.setDisplayCodeHighlights(!_this.minimapView.displayCodeHighlights);
          return _this.codeHighlights.toggleClass('active', _this.minimapView.displayCodeHighlights);
        };
      })(this));
      this.hiddenInput.on('focusout', this.destroy);
      return this.initList();
    };

    MinimapQuickSettingsView.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    MinimapQuickSettingsView.prototype.attach = function() {
      var workspaceElement;
      workspaceElement = atom.views.getView(atom.workspace);
      workspaceElement.appendChild(this.element);
      return this.hiddenInput.focus();
    };

    MinimapQuickSettingsView.prototype.destroy = function() {
      this.emitter.emit('did-destroy');
      this.off();
      this.hiddenInput.off();
      this.codeHighlights.off();
      this.subscriptions.dispose();
      return this.detach();
    };

    MinimapQuickSettingsView.prototype.initList = function() {
      var name, plugin, _ref1, _results;
      _ref1 = Minimap.plugins;
      _results = [];
      for (name in _ref1) {
        plugin = _ref1[name];
        _results.push(this.addItemFor(name, plugin));
      }
      return _results;
    };

    MinimapQuickSettingsView.prototype.toggleSelectedItem = function() {
      return this.selectedItem.mousedown();
    };

    MinimapQuickSettingsView.prototype.selectNextItem = function() {
      this.selectedItem.removeClass('selected');
      if (this.selectedItem.index() !== this.list.children().length - 1) {
        this.selectedItem = this.selectedItem.next();
        if (this.selectedItem.is('.separator')) {
          this.selectedItem = this.selectedItem.next();
        }
      } else {
        this.selectedItem = this.list.children().first();
      }
      return this.selectedItem.addClass('selected');
    };

    MinimapQuickSettingsView.prototype.selectPreviousItem = function() {
      this.selectedItem.removeClass('selected');
      if (this.selectedItem.index() !== 0) {
        this.selectedItem = this.selectedItem.prev();
        if (this.selectedItem.is('.separator')) {
          this.selectedItem = this.selectedItem.prev();
        }
      } else {
        this.selectedItem = this.list.children().last();
      }
      return this.selectedItem.addClass('selected');
    };

    MinimapQuickSettingsView.prototype.addItemFor = function(name, plugin) {
      var cls, item;
      cls = plugin.isActive() ? 'active' : '';
      item = $("<li class='" + cls + "'>" + name + "</li>");
      item.on('mousedown', (function(_this) {
        return function(e) {
          e.preventDefault();
          return atom.commands.dispatch(item[0], "minimap:toggle-" + name);
        };
      })(this));
      this.plugins[name] = item;
      this.separator.before(item);
      if (this.selectedItem == null) {
        this.selectedItem = item;
        return this.selectedItem.addClass('selected');
      }
    };

    MinimapQuickSettingsView.prototype.removeItemFor = function(name, plugin) {
      try {
        this.list.remove(this.plugins[name]);
      } catch (_error) {}
      return delete this.plugins[name];
    };

    MinimapQuickSettingsView.prototype.activateItem = function(name, plugin) {
      return this.plugins[name].addClass('active');
    };

    MinimapQuickSettingsView.prototype.deactivateItem = function(name, plugin) {
      return this.plugins[name].removeClass('active');
    };

    return MinimapQuickSettingsView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsT0FBUSxPQUFBLENBQVEsc0JBQVIsRUFBUixJQUFELENBQUE7O0FBQUEsRUFDQSxPQUFpQyxPQUFBLENBQVEsV0FBUixDQUFqQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGVBQUEsT0FEdEIsQ0FBQTs7QUFBQSxFQUVBLENBQUEsR0FBSSxJQUFJLENBQUMsU0FBUyxDQUFDLFdBRm5CLENBQUE7O0FBQUEsRUFJQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFFBQVIsQ0FKVixDQUFBOztBQUFBLEVBTUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtDQUFBLENBQUE7Ozs7Ozs7O0tBQUE7O0FBQUEsSUFBQSx3QkFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8saURBQVA7T0FBTCxFQUErRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQzdELFVBQUEsS0FBQyxDQUFBLEtBQUQsQ0FBTztBQUFBLFlBQUEsSUFBQSxFQUFNLE1BQU47QUFBQSxZQUFjLE9BQUEsRUFBTyxjQUFyQjtBQUFBLFlBQXFDLE1BQUEsRUFBUSxhQUE3QztXQUFQLENBQUEsQ0FBQTtpQkFDQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsWUFBQSxPQUFBLEVBQU8sd0JBQVA7QUFBQSxZQUFpQyxNQUFBLEVBQVEsTUFBekM7V0FBSixFQUFxRCxTQUFBLEdBQUE7QUFDbkQsWUFBQSxLQUFDLENBQUEsRUFBRCxDQUFJO0FBQUEsY0FBQSxPQUFBLEVBQU8sV0FBUDtBQUFBLGNBQW9CLE1BQUEsRUFBUSxXQUE1QjthQUFKLENBQUEsQ0FBQTttQkFDQSxLQUFDLENBQUEs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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-quick-settings-view.coffee