(function() {
  var $, CompositeDisposable, Emitter, MinimapFindAndReplaceBinding, MinimapFindResultsView, PLUGIN_NAME, Subscriber, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  $ = require('atom-space-pen-views').$;

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVIQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLHNCQUFSLEVBQUwsQ0FERCxDQUFBOztBQUFBLEVBRUEsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQUZiLENBQUE7O0FBQUEsRUFHQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBSEQsQ0FBQTs7QUFBQSxFQUlBLHNCQUFBLEdBQXlCLElBSnpCLENBQUE7O0FBQUEsRUFNQSxXQUFBLEdBQWMsa0JBTmQsQ0FBQTs7QUFBQSxFQVFBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLDRCQUFwQixDQUFBLENBQUE7O0FBQUEsMkNBRUEsTUFBQSxHQUFRLEtBRlIsQ0FBQTs7QUFBQSwyQ0FHQSxZQUFBLEdBQWMsS0FIZCxDQUFBOztBQUFBLDJDQUlBLFFBQUEsR0FBVSxTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsYUFBSjtJQUFBLENBSlYsQ0FBQTs7QUFNYSxJQUFBLHNDQUFFLGNBQUYsRUFBbUIsT0FBbkIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGlCQUFBLGNBQ2IsQ0FBQTtBQUFBLE1BRDZCLElBQUMsQ0FBQSxVQUFBLE9BQzlCLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBTyxDQUFDLGNBQVQsQ0FBd0IsV0FBeEIsRUFBcUMsSUFBckMsQ0FGQSxDQURX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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-and-replace-binding.coffee