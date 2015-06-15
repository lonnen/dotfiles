(function() {
  var CompositeDisposable, MinimapColorHighlight,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  MinimapColorHighlight = (function() {
    MinimapColorHighlight.prototype.views = {};

    function MinimapColorHighlight() {
      this.destroyViews = __bind(this.destroyViews, this);
      this.createViews = __bind(this.createViews, this);
      this.subscriptions = new CompositeDisposable;
    }

    MinimapColorHighlight.prototype.activate = function(state) {
      this.colorHighlightPackage = atom.packages.getLoadedPackage('atom-color-highlight');
      this.minimapPackage = atom.packages.getLoadedPackage('minimap');
      if (!((this.colorHighlightPackage != null) && (this.minimapPackage != null))) {
        return this.deactivate();
      }
      this.MinimapColorHighlightView = require('./minimap-color-highlight-view')();
      this.minimap = require(this.minimapPackage.path);
      if (!this.minimap.versionMatch('3.x')) {
        return this.deactivate();
      }
      this.colorHighlight = require(this.colorHighlightPackage.path);
      return this.minimap.registerPlugin('color-highlight', this);
    };

    MinimapColorHighlight.prototype.deactivate = function() {
      this.deactivatePlugin();
      this.minimapPackage = null;
      this.colorHighlightPackage = null;
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
      if (this.minimap.active) {
        this.createViews();
      }
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
      return this.paneSubscription = this.colorHighlight.eachColorHighlightEditor((function(_this) {
        return function(color) {
          var editor, pane, subscription, view;
          editor = color.editorView.getEditor();
          pane = color.editorView.getPaneView();
          if (pane == null) {
            return;
          }
          view = new _this.MinimapColorHighlightView(color.getActiveModel(), color.editorView);
          _this.views[editor.id] = view;
          return subscription = editor.getBuffer().onDidDestroy(function() {
            _this.views[editor.id].destroy();
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVNO0FBRUosb0NBQUEsS0FBQSxHQUFPLEVBQVAsQ0FBQTs7QUFDYSxJQUFBLCtCQUFBLEdBQUE7QUFDWCx5REFBQSxDQUFBO0FBQUEsdURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQURXO0lBQUEsQ0FEYjs7QUFBQSxvQ0FJQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLHNCQUEvQixDQUF6QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFNBQS9CLENBRGxCLENBQUE7QUFHQSxNQUFBLElBQUEsQ0FBQSxDQUE0QixvQ0FBQSxJQUE0Qiw2QkFBeEQsQ0FBQTtBQUFBLGVBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFQLENBQUE7T0FIQTtBQUFBLE1BS0EsSUFBQyxDQUFBLHlCQUFELEdBQTZCLE9BQUEsQ0FBUSxnQ0FBUixDQUFBLENBQUEsQ0FMN0IsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLENBQVEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUF4QixDQVBYLENBQUE7QUFRQSxNQUFBLElBQUEsQ0FBQSxJQUE2QixDQUFBLE9BQU8sQ0FBQyxZQUFULENBQXNCLEtBQXRCLENBQTVCO0FBQUEsZUFBTyxJQUFDLENBQUEsVUFBRCxDQUFBLENBQVAsQ0FBQTtPQVJBO0FB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-color-highlight/lib/minimap-color-highlight.coffee