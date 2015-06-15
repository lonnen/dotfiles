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

    MinimapColorHighlight.prototype.activate = function(state) {
      return requirePackages('minimap', 'atom-color-highlight').then((function(_this) {
        return function(_arg) {
          _this.minimap = _arg[0], _this.colorHighlight = _arg[1];
          if (!_this.minimap.versionMatch('4.x')) {
            return _this.deactivate();
          }
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
      this.paneSubscription.off();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDJEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUNDLGtCQUFtQixPQUFBLENBQVEsWUFBUixFQUFuQixlQURELENBQUE7O0FBQUEsRUFHTTtBQUVKLG9DQUFBLEtBQUEsR0FBTyxFQUFQLENBQUE7O0FBQ2EsSUFBQSwrQkFBQSxHQUFBO0FBQ1gseURBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FEVztJQUFBLENBRGI7O0FBQUEsb0NBSUEsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsZUFBQSxDQUFnQixTQUFoQixFQUEyQixzQkFBM0IsQ0FDQSxDQUFDLElBREQsQ0FDTSxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxJQUFELEdBQUE7QUFDSixVQURNLEtBQUMsQ0FBQSxtQkFBUyxLQUFDLENBQUEsd0JBQ2pCLENBQUE7QUFBQSxVQUFBLElBQUEsQ0FBQSxLQUE2QixDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLEtBQXRCLENBQTVCO0FBQUEsbUJBQU8sS0FBQyxDQUFBLFVBQUQsQ0FBQSxDQUFQLENBQUE7V0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLHlCQUFELEdBQTZCLE9BQUEsQ0FBUSxnQ0FBUixDQUFBLENBQTBDLEtBQUMsQ0FBQSxPQUEzQyxFQUFvRCxLQUFDLENBQUEsY0FBckQsQ0FGN0IsQ0FBQTtpQkFJQSxLQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0IsaUJBQXhCLEVBQTJDLEtBQTNDLEVBTEk7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUROLEVB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-color-highlight/lib/minimap-color-highlight.coffee