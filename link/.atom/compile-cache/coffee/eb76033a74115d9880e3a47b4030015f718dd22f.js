(function() {
  var CompositeDisposable, Emitter, MinimapFindAndReplaceBinding, MinimapFindResultsView, PLUGIN_NAME, Subscriber, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  CompositeDisposable = require('event-kit').CompositeDisposable;

  MinimapFindResultsView = null;

  PLUGIN_NAME = 'find-and-replace';

  module.exports = MinimapFindAndReplaceBinding = (function() {
    Emitter.includeInto(MinimapFindAndReplaceBinding);

    MinimapFindAndReplaceBinding.prototype.active = false;

    MinimapFindAndReplaceBinding.prototype.pluginActive = false;

    MinimapFindAndReplaceBinding.prototype.isActive = function() {
      return this.pluginActive;
    };

    function MinimapFindAndReplaceBinding(findAndReplace, minimap) {
      this.findAndReplace = findAndReplace;
      this.minimap = minimap;
      this.deactivate = __bind(this.deactivate, this);
      this.activate = __bind(this.activate, this);
      this.subscriptions = new CompositeDisposable;
      this.minimap.registerPlugin(PLUGIN_NAME, this);
    }

    MinimapFindAndReplaceBinding.prototype.activatePlugin = function() {
      this.pluginActive = true;
      this.subscriptions.add(atom.commands.add('atom-workspace', {
        'find-and-replace:show': this.activate,
        'find-and-replace:toggle': this.activate,
        'find-and-replace:show-replace': this.activate,
        'core:cancel': this.deactivate,
        'core:close': this.deactivate
      }));
      this.subscriptions.add(this.minimap.onDidActivate(this.activate));
      this.subscriptions.add(this.minimap.onDidDeactivate(this.deactivate));
      if (this.findViewIsVisible()) {
        return this.activate();
      }
    };

    MinimapFindAndReplaceBinding.prototype.deactivatePlugin = function() {
      this.pluginActive = false;
      this.subscriptions.dispose();
      return this.deactivate();
    };

    MinimapFindAndReplaceBinding.prototype.activate = function() {
      if (!this.pluginActive) {
        return;
      }
      if (!this.findViewIsVisible()) {
        return this.deactivate();
      }
      if (this.active) {
        return;
      }
      MinimapFindResultsView || (MinimapFindResultsView = require('./minimap-find-results-view')(this.findAndReplace, this.minimap));
      this.active = true;
      this.findView = this.findAndReplace.findView;
      this.findModel = this.findView.findModel;
      this.findResultsView = new MinimapFindResultsView(this.findModel);
      return setImmediate((function(_this) {
        return function() {
          return _this.findModel.emitter.emit('did-update', _.clone(_this.findModel.markers));
        };
      })(this));
    };

    MinimapFindAndReplaceBinding.prototype.deactivate = function() {
      var _ref1;
      if (!this.active) {
        return;
      }
      if ((_ref1 = this.findResultsView) != null) {
        _ref1.destroy();
      }
      return this.active = false;
    };

    MinimapFindAndReplaceBinding.prototype.destroy = function() {
      this.deactivate();
      this.findAndReplacePackage = null;
      this.findAndReplace = null;
      this.minimapPackage = null;
      this.findResultsView = null;
      return this.minimap = null;
    };

    MinimapFindAndReplaceBinding.prototype.findViewIsVisible = function() {
      return (this.findAndReplace.findView != null) && this.findAndReplace.findView.parent().length === 1;
    };

    return MinimapFindAndReplaceBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG9IQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLE9BQXdCLE9BQUEsQ0FBUSxVQUFSLENBQXhCLEVBQUMsa0JBQUEsVUFBRCxFQUFhLGVBQUEsT0FEYixDQUFBOztBQUFBLEVBRUMsc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQUZELENBQUE7O0FBQUEsRUFHQSxzQkFBQSxHQUF5QixJQUh6QixDQUFBOztBQUFBLEVBS0EsV0FBQSxHQUFjLGtCQUxkLENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQiw0QkFBcEIsQ0FBQSxDQUFBOztBQUFBLDJDQUVBLE1BQUEsR0FBUSxLQUZSLENBQUE7O0FBQUEsMkNBR0EsWUFBQSxHQUFjLEtBSGQsQ0FBQTs7QUFBQSwyQ0FJQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLGFBQUo7SUFBQSxDQUpWLENBQUE7O0FBTWEsSUFBQSxzQ0FBRSxjQUFGLEVBQW1CLE9BQW5CLEdBQUE7QUFDWCxNQURZLElBQUMsQ0FBQSxpQkFBQSxjQUNiLENBQUE7QUFBQSxNQUQ2QixJQUFDLENBQUEsVUFBQSxPQUM5QixDQUFBO0FBQUEscURBQUEsQ0FBQTtBQUFBLGlEQUFBLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLE1BRUEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxjQUFULENBQXdCLFdBQXhCLEVBQXFDLElBQXJDLENBRkEsQ0FEVztJQUFBLENBTmI7O0FBQUEsMkNBV0EsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFD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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-and-replace-binding.coffee