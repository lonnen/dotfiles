(function() {
  var CompositeDisposable, MinimapView, Mixin, TextEditor, ViewManagement, deprecate,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Mixin = require('mixto');

  TextEditor = require('atom').TextEditor;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  deprecate = require('grim').deprecate;

  MinimapView = null;

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

    ViewManagement.prototype.getActiveMinimap = function() {
      return this.minimapForEditor(atom.workspace.getActiveEditor());
    };

    ViewManagement.prototype.observeMinimaps = function(iterator) {
      var createdCallback, disposable, id, minimapView, _ref;
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
      disposable = this.onDidCreateMinimap(createdCallback);
      disposable.off = function() {
        deprecate('Use Disposable::dispose instead');
        return disposable.dispose();
      };
      return disposable;
    };

    ViewManagement.prototype.eachMinimapView = function(iterator) {
      deprecate('Use Minimap::observeMinimaps instead');
      return this.observeMinimaps(iterator);
    };

    ViewManagement.prototype.destroyViews = function() {
      var id, view, _ref, _ref1;
      _ref = this.minimapViews;
      for (id in _ref) {
        view = _ref[id];
        view.destroy();
      }
      if ((_ref1 = this.observePaneSubscription) != null) {
        _ref1.dispose();
      }
      return this.minimapViews = {};
    };

    ViewManagement.prototype.createViews = function() {
      return this.observePaneSubscription = atom.workspace.observePanes((function(_this) {
        return function(pane) {
          var paneSubscriptions;
          paneSubscriptions = new CompositeDisposable;
          paneSubscriptions.add(pane.onDidDestroy(function() {
            paneSubscriptions.dispose();
            return requestAnimationFrame(function() {
              return _this.updateAllViews();
            });
          }));
          paneSubscriptions.add(pane.observeItems(function(item) {
            if (item instanceof TextEditor) {
              return requestAnimationFrame(function() {
                return _this.onEditorAdded(item, pane);
              });
            }
          }));
          return _this.updateAllViews();
        };
      })(this));
    };

    ViewManagement.prototype.onEditorAdded = function(editor, pane) {
      var editorId, editorView, event, paneView, subscriptions, view;
      editorView = atom.views.getView(editor);
      MinimapView || (MinimapView = require('../minimap-view'));
      editorId = editor.id;
      paneView = atom.views.getView(pane);
      if (paneView == null) {
        return;
      }
      if ((view = this.minimapViews[editorId]) != null) {
        view.setEditorView(editorView);
        view.detachFromPaneView();
        view.attachToPaneView();
        return;
      }
      view = new MinimapView(editorView);
      this.minimapViews[editorId] = view;
      event = {
        view: view
      };
      this.emitter.emit('did-create-minimap', event);
      view.updateMinimapRenderView();
      subscriptions = new CompositeDisposable;
      return subscriptions.add(editor.onDidDestroy((function(_this) {
        return function() {
          var _ref;
          view = _this.minimapViews[editorId];
          event = {
            view: view
          };
          if (view != null) {
            _this.emitter.emit('will-destroy-minimap', event);
            view.destroy();
            delete _this.minimapViews[editorId];
            _this.emitter.emit('did-destroy-minimap', event);
            if ((_ref = paneView.getActiveView()) != null ? _ref.classList.contains('editor') : void 0) {
              return paneView.classList.add('with-minimap');
            }
          }
        };
      })(this)));
    };

    return ViewManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0MsYUFBYyxPQUFBLENBQVEsTUFBUixFQUFkLFVBREQsQ0FBQTs7QUFBQSxFQUVDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFGRCxDQUFBOztBQUFBLEVBR0MsWUFBYSxPQUFBLENBQVEsTUFBUixFQUFiLFNBSEQsQ0FBQTs7QUFBQSxFQUlBLFdBQUEsR0FBYyxJQUpkLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUoscUNBQUEsQ0FBQTs7OztLQUFBOztBQUFBLDZCQUFBLFlBQUEsR0FBYyxFQUFkLENBQUE7O0FBQUEsNkJBR0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLHdCQUFBO0FBQUE7QUFBQTtXQUFBLFVBQUE7d0JBQUE7QUFBQSxzQkFBQSxJQUFJLENBQUMsbUJBQUwsQ0FBQSxFQUFBLENBQUE7QUFBQTtzQkFEYztJQUFBLENBSGhCLENBQUE7O0FBQUEsNkJBWUEsb0JBQUEsR0FBc0IsU0FBQyxVQUFELEdBQUE7YUFDcEIsSUFBQyxDQUFBLGdCQUFELHNCQUFrQixVQUFVLENBQUUsU0FBWixDQUFBLFVBQWxCLEVBRG9CO0lBQUEsQ0FadEIsQ0FBQTs7QUFBQSw2QkFxQkEsZ0JBQUEsR0FBa0IsU0FBQyxNQUFELEdBQUE7QUFDaEIsTUFBQSxJQUE0QixjQUE1QjtlQUFBLElBQUMsQ0FBQSxZQUFhLENBQUEsTUFBTSxDQUFDLEVBQVAsRUFBZDtPQURnQjtJQUFBLENBckJsQixDQUFBOztBQUFBLDZCQTJCQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsZ0JBQUQsQ0FBa0Is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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/mixins/view-management.coffee