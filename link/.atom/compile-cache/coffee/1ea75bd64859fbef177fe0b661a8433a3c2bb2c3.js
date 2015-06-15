(function() {
  var MinimapColorHighlight, Subscriber,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Subscriber = require('emissary').Subscriber;

  MinimapColorHighlight = (function() {
    function MinimapColorHighlight() {
      this.destroyViews = __bind(this.destroyViews, this);
      this.createViews = __bind(this.createViews, this);
    }

    Subscriber.includeInto(MinimapColorHighlight);

    MinimapColorHighlight.prototype.views = {};

    MinimapColorHighlight.prototype.activate = function(state) {
      this.colorHighlightPackage = atom.packages.getLoadedPackage('atom-color-highlight');
      this.minimapPackage = atom.packages.getLoadedPackage('minimap');
      if (!((this.colorHighlightPackage != null) && (this.minimapPackage != null))) {
        return this.deactivate();
      }
      this.MinimapColorHighlightView = require('./minimap-color-highlight-view')();
      this.minimap = require(this.minimapPackage.path);
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
      this.subscribe(this.minimap, 'activated', this.createViews);
      return this.subscribe(this.minimap, 'deactivated', this.destroyViews);
    };

    MinimapColorHighlight.prototype.deactivatePlugin = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.destroyViews();
      return this.unsubscribe();
    };

    MinimapColorHighlight.prototype.createViews = function() {
      if (this.viewsCreated) {
        return;
      }
      this.viewsCreated = true;
      return this.paneSubscription = this.colorHighlight.eachColorHighlightEditor((function(_this) {
        return function(editor) {
          var pane, view;
          pane = editor.editorView.getPane();
          if (pane == null) {
            return;
          }
          view = new _this.MinimapColorHighlightView(pane);
          return _this.views[pane.model.id] = view;
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBRU07Ozs7S0FDSjs7QUFBQSxJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLHFCQUF2QixDQUFBLENBQUE7O0FBQUEsb0NBRUEsS0FBQSxHQUFPLEVBRlAsQ0FBQTs7QUFBQSxvQ0FHQSxRQUFBLEdBQVUsU0FBQyxLQUFELEdBQUE7QUFDUixNQUFBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLHNCQUEvQixDQUF6QixDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFNBQS9CLENBRGxCLENBQUE7QUFHQSxNQUFBLElBQUEsQ0FBQSxDQUE0QixvQ0FBQSxJQUE0Qiw2QkFBeEQsQ0FBQTtBQUFBLGVBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFQLENBQUE7T0FIQTtBQUFBLE1BS0EsSUFBQyxDQUFBLHlCQUFELEdBQTZCLE9BQUEsQ0FBUSxnQ0FBUixDQUFBLENBQUEsQ0FMN0IsQ0FBQTtBQUFBLE1BT0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLENBQVEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUF4QixDQVBYLENBQUE7QUFBQSxNQVFBLElBQUMsQ0FBQSxjQUFELEdBQWtCLE9BQUEsQ0FBUSxJQUFDLENBQUEscUJBQXFCLENBQUMsSUFBL0IsQ0FSbEIsQ0FBQTthQVVBLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUF3QixpQkFBeEIsRUFBMkMsSUFBM0MsRUFYUTtJQUFBLENBSFYsQ0FBQTs7QUFBQSxvQ0FnQkEsVUFBQSxH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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-color-highlight/lib/minimap-color-highlight.coffee