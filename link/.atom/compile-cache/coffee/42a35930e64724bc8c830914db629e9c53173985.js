(function() {
  var CompositeDisposable, MinimapColorHighlight, requirePackages,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  requirePackages = require('atom-utils').requirePackages;

  MinimapColorHighlight = (function() {
    MinimapColorHighlight.prototype.views = {};

    function MinimapColorHighlight() {
      this.destroyViews = __bind(this.destroyViews, this);
      this.createViews = __bind(this.createViews, this);
      this.subscriptions = new CompositeDisposable;
    }

    MinimapColorHighlight.prototype.activate = function(state) {};

    MinimapColorHighlight.prototype.consumeMinimapServiceV1 = function(minimap) {
      this.minimap = minimap;
      return requirePackages('atom-color-highlight').then((function(_this) {
        return function(_arg) {
          _this.colorHighlight = _arg[0];
          _this.MinimapColorHighlightView = require('./minimap-color-highlight-view')(_this.minimap, _this.colorHighlight);
          return _this.minimap.registerPlugin('color-highlight', _this);
        };
      })(this));
    };

    MinimapColorHighlight.prototype.deactivate = function() {
      this.deactivatePlugin();
      this.minimapPackage = null;
      this.colorHighlight = null;
      return this.minimap = null;
    };

    MinimapColorHighlight.prototype.isActive = function() {
      return this.active;
    };

    MinimapColorHighlight.prototype.activatePlugin = function() {
      if (this.active) {
        return;
      }
      this.active = true;
      this.createViews();
      this.subscriptions.add(this.minimap.onDidActivate(this.createViews));
      return this.subscriptions.add(this.minimap.onDidDeactivate(this.destroyViews));
    };

    MinimapColorHighlight.prototype.deactivatePlugin = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.destroyViews();
      return this.subscriptions.dispose();
    };

    MinimapColorHighlight.prototype.createViews = function() {
      if (this.viewsCreated) {
        return;
      }
      this.viewsCreated = true;
      return this.paneSubscription = this.colorHighlight.observeColorHighlightModels((function(_this) {
        return function(model) {
          var editor, subscription, view;
          editor = model.editor;
          view = new _this.MinimapColorHighlightView(model, editor);
          _this.views[editor.id] = view;
          return subscription = editor.onDidDestroy(function() {
            var _ref;
            if ((_ref = _this.views[editor.id]) != null) {
              _ref.destroy();
            }
            delete _this.views[editor.id];
            return subscription.dispose();
          });
        };
      })(this));
    };

    MinimapColorHighlight.prototype.destroyViews = function() {
      var id, view, _ref;
      if (!this.viewsCreated) {
        return;
      }
      this.paneSubscription.dispose();
      this.viewsCreated = false;
      _ref = this.views;
      for (id in _ref) {
        view = _ref[id];
        view.destroy();
      }
      return this.views = {};
    };

    return MinimapColorHighlight;

  })();

  module.exports = new MinimapColorHighlight;

}).call(this);
