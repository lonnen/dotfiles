(function() {
  var $, CompositeDisposable, Emitter, MinimapFindAndReplaceBinding, MinimapFindResultsView, PLUGIN_NAME, Subscriber, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  $ = require('atom').$;

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
        this.activate();
      }
      return this.pluginActive = true;
    };

    MinimapFindAndReplaceBinding.prototype.deactivatePlugin = function() {
      this.subscriptions.dispose();
      this.deactivate();
      return this.pluginActive = false;
    };

    MinimapFindAndReplaceBinding.prototype.activate = function() {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVIQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLE1BQVIsRUFBTCxDQURELENBQUE7O0FBQUEsRUFFQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxlQUFBLE9BRmIsQ0FBQTs7QUFBQSxFQUdDLHNCQUF1QixPQUFBLENBQVEsV0FBUixFQUF2QixtQkFIRCxDQUFBOztBQUFBLEVBSUEsc0JBQUEsR0FBeUIsSUFKekIsQ0FBQTs7QUFBQSxFQU1BLFdBQUEsR0FBYyxrQkFOZCxDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsNEJBQXBCLENBQUEsQ0FBQTs7QUFBQSwyQ0FFQSxNQUFBLEdBQVEsS0FGUixDQUFBOztBQUFBLDJDQUdBLFlBQUEsR0FBYyxLQUhkLENBQUE7O0FBQUEsMkNBSUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxhQUFKO0lBQUEsQ0FKVixDQUFBOztBQU1hLElBQUEsc0NBQUUsY0FBRixFQUFtQixPQUFuQixHQUFBO0FBQ1gsTUFEWSxJQUFDLENBQUEsaUJBQUEsY0FDYixDQUFBO0FBQUEsTUFENkIsSUFBQyxDQUFBLFVBQUEsT0FDOUIsQ0FBQTtBQUFBLHFEQUFBLENBQUE7QUFBQSxpREFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFPLENBQUMsY0FBVCxDQUF3QixXQUF4QixFQUFxQyxJQUFyQyxDQUZBLENBRFc7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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-and-replace-binding.coffee