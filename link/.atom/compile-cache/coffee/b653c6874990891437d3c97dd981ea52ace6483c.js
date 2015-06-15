(function() {
  var $, Emitter, MinimapFindAndReplaceBinding, MinimapFindResultsView, PLUGIN_NAME, Subscriber, _, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  $ = require('atom').$;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  MinimapFindResultsView = null;

  PLUGIN_NAME = 'find-and-replace';

  module.exports = MinimapFindAndReplaceBinding = (function() {
    Subscriber.includeInto(MinimapFindAndReplaceBinding);

    Emitter.includeInto(MinimapFindAndReplaceBinding);

    MinimapFindAndReplaceBinding.prototype.active = false;

    MinimapFindAndReplaceBinding.prototype.isActive = function() {
      return this.active;
    };

    function MinimapFindAndReplaceBinding(findAndReplacePackage, minimapPackage) {
      this.findAndReplacePackage = findAndReplacePackage;
      this.minimapPackage = minimapPackage;
      this.markersUpdated = __bind(this.markersUpdated, this);
      this.deactivate = __bind(this.deactivate, this);
      this.activate = __bind(this.activate, this);
      this.minimap = require(this.minimapPackage.path);
      this.findAndReplace = require(this.findAndReplacePackage.path);
      MinimapFindResultsView = require('./minimap-find-results-view')();
      this.minimap.registerPlugin(PLUGIN_NAME, this);
    }

    MinimapFindAndReplaceBinding.prototype.activatePlugin = function() {
      $(window).on('find-and-replace:show find-and-replace:toggle find-and-replace:show-replace', this.activate);
      atom.workspaceView.on('core:cancel core:close', this.deactivate);
      this.subscribe(this.minimap, 'activated.minimap', this.activate);
      this.subscribe(this.minimap, 'deactivated.minimap', this.deactivate);
      if (this.findViewIsVisible() && this.minimapIsActive()) {
        return this.activate();
      }
    };

    MinimapFindAndReplaceBinding.prototype.deactivatePlugin = function() {
      $(window).off('find-and-replace:show');
      atom.workspaceView.off('core:cancel core:close');
      this.unsubscribe();
      return this.deactivate();
    };

    MinimapFindAndReplaceBinding.prototype.activate = function() {
      if (!(this.findViewIsVisible() && this.minimapIsActive())) {
        return this.deactivate();
      }
      if (this.active) {
        return;
      }
      this.active = true;
      this.findView = this.findAndReplace.findView;
      this.findModel = this.findView.findModel;
      this.findResultsView = new MinimapFindResultsView(this.findModel);
      this.subscribe(this.findModel, 'updated', this.markersUpdated);
      return setImmediate((function(_this) {
        return function() {
          return _this.findModel.emit('updated', _.clone(_this.findModel.markers));
        };
      })(this));
    };

    MinimapFindAndReplaceBinding.prototype.deactivate = function() {
      if (!this.active) {
        return;
      }
      this.active = false;
      this.findResultsView.detach();
      return this.unsubscribe(this.findModel, 'updated');
    };

    MinimapFindAndReplaceBinding.prototype.destroy = function() {
      this.deactivate();
      this.findAndReplacePackage = null;
      this.findAndReplace = null;
      this.minimapPackage = null;
      return this.minimap = null;
    };

    MinimapFindAndReplaceBinding.prototype.findViewIsVisible = function() {
      return (this.findAndReplace.findView != null) && this.findAndReplace.findView.parent().length === 1;
    };

    MinimapFindAndReplaceBinding.prototype.minimapIsActive = function() {
      return this.minimap.active;
    };

    MinimapFindAndReplaceBinding.prototype.markersUpdated = function() {
      this.findResultsView.detach();
      return this.findResultsView.attach();
    };

    return MinimapFindAndReplaceBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtHQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLGlCQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNDLElBQUssT0FBQSxDQUFRLE1BQVIsRUFBTCxDQURELENBQUE7O0FBQUEsRUFFQSxPQUF3QixPQUFBLENBQVEsVUFBUixDQUF4QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxlQUFBLE9BRmIsQ0FBQTs7QUFBQSxFQUdBLHNCQUFBLEdBQXlCLElBSHpCLENBQUE7O0FBQUEsRUFLQSxXQUFBLEdBQWMsa0JBTGQsQ0FBQTs7QUFBQSxFQU9BLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixJQUFBLFVBQVUsQ0FBQyxXQUFYLENBQXVCLDRCQUF2QixDQUFBLENBQUE7O0FBQUEsSUFDQSxPQUFPLENBQUMsV0FBUixDQUFvQiw0QkFBcEIsQ0FEQSxDQUFBOztBQUFBLDJDQUdBLE1BQUEsR0FBUSxLQUhSLENBQUE7O0FBQUEsMkNBSUEsUUFBQSxHQUFVLFNBQUEsR0FBQTthQUFHLElBQUMsQ0FBQSxPQUFKO0lBQUEsQ0FKVixDQUFBOztBQU1hLElBQUEsc0NBQUUscUJBQUYsRUFBMEIsY0FBMUIsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLHdCQUFBLHFCQUNiLENBQUE7QUFBQSxNQURvQyxJQUFDLENBQUEsaUJBQUEsY0FDckMsQ0FBQTtBQUFBLDZEQUFBLENBQUE7QUFBQSxxREFBQSxDQUFBO0FBQUEsaURBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE9BQUQsR0FBVyxPQUFBLENBQVEsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUF4QixDQUFYLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxjQUFELEdBQWtCLE9BQUEsQ0FBUSxJQUFDLENBQUEscUJBQXFCLENB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-and-replace-binding.coffee