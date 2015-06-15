(function() {
  var EditorView, MinimapReactView, MinimapView, Mixin, ViewManagement,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EditorView = require('atom').EditorView;

  Mixin = require('mixto');

  MinimapView = require('../minimap-view');

  MinimapReactView = require('../minimap-react-view');

  module.exports = ViewManagement = (function(_super) {
    __extends(ViewManagement, _super);

    function ViewManagement() {
      return ViewManagement.__super__.constructor.apply(this, arguments);
    }

    ViewManagement.prototype.minimapViews = {};

    ViewManagement.prototype.updateAllViews = function() {
      var id, view, _ref, _results;
      _ref = this.minimapViews;
      _results = [];
      for (id in _ref) {
        view = _ref[id];
        _results.push(view.onScrollViewResized());
      }
      return _results;
    };

    ViewManagement.prototype.minimapForEditorView = function(editorView) {
      return this.minimapForEditor(editorView != null ? editorView.getEditor() : void 0);
    };

    ViewManagement.prototype.minimapForEditor = function(editor) {
      if (editor != null) {
        return this.minimapViews[editor.id];
      }
    };

    ViewManagement.prototype.eachMinimapView = function(iterator) {
      var createdCallback, id, minimapView, _ref;
      if (iterator == null) {
        return;
      }
      _ref = this.minimapViews;
      for (id in _ref) {
        minimapView = _ref[id];
        iterator({
          view: minimapView
        });
      }
      createdCallback = function(minimapView) {
        return iterator(minimapView);
      };
      this.on('minimap-view:created', createdCallback);
      return {
        off: (function(_this) {
          return function() {
            return _this.off('minimap-view:created', createdCallback);
          };
        })(this)
      };
    };

    ViewManagement.prototype.destroyViews = function() {
      var id, view, _ref, _ref1;
      _ref = this.minimapViews;
      for (id in _ref) {
        view = _ref[id];
        view.destroy();
      }
      if ((_ref1 = this.eachEditorViewSubscription) != null) {
        _ref1.off();
      }
      return this.minimapViews = {};
    };

    ViewManagement.prototype.createViews = function() {
      return this.eachEditorViewSubscription = atom.workspaceView.eachEditorView((function(_this) {
        return function(editorView) {
          var editorId, paneView, view;
          editorId = editorView.editor.id;
          paneView = editorView.getPane();
          view = new MinimapView(editorView);
          _this.minimapViews[editorId] = view;
          _this.emit('minimap-view:created', {
            view: view
          });
          view.updateMinimapEditorView();
          return editorView.editor.on('destroyed', function() {
            var _ref;
            view = _this.minimapViews[editorId];
            if (view != null) {
              _this.emit('minimap-view:will-be-destroyed', {
                view: view
              });
              view.destroy();
              delete _this.minimapViews[editorId];
              _this.emit('minimap-view:destroyed', {
                view: view
              });
              if ((_ref = paneView.activeView) != null ? _ref.hasClass('editor') : void 0) {
                return paneView.addClass('with-minimap');
              }
            }
          });
        };
      })(this));
    };

    return ViewManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGdFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxNQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EsS0FBQSxHQUFRLE9BQUEsQ0FBUSxPQUFSLENBRFIsQ0FBQTs7QUFBQSxFQUVBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FGZCxDQUFBOztBQUFBLEVBR0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHVCQUFSLENBSG5CLENBQUE7O0FBQUEsRUFNQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUoscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDZCQUFBLFlBQUEsR0FBYyxFQUFkLENBQUE7O0FBQUEsNkJBR0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLHdCQUFBO0FBQUE7QUFBQTtXQUFBLFVBQUE7d0JBQUE7QUFBQSxzQkFBQSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxFQUFBLENBQUE7QUFBQTtzQkFEYztJQUFBLENBSGhCLENBQUE7O0FBQUEsNkJBWUEsb0JBQUEsR0FBc0IsU0FBQyxVQUFELEdBQUE7YUFDcEIsSUFBQyxDQUFBLGdCQUFELHNCQUFrQixVQUFVLENBQUUsU0FBWixDQUFBLFVBQWxCLEVBRG9CO0lBQUEsQ0FadEIsQ0FBQTs7QUFBQSw2QkFxQkEsZ0JBQUEsR0FBa0IsU0FBQyxNQUFELEdBQUE7QUFDaEIsTUFBQSxJQUE0QixjQUE1QjtlQUFBLElBQUMsQ0FBQSxZQUFhLENBQUEsTUFBTSxDQUFDLEVBQVAsRUFBZDtPQURnQjtJQUFBLENBckJsQixDQUFBOztBQUFBLDZCQWdDQSxlQUFBLEdBQWlCLFNBQUMsUUFBRCxHQUFBO0FBQ2YsVUFBQSxzQ0FBQTtBQUFBLE1BQUEsSUFBYyxnQkFBZDtBQUFBLGNBQUEsQ0FBQTtP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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/mixins/view-management.coffee