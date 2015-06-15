(function() {
  var MinimapGitDiff, MinimapGitDiffBinding, Subscriber,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Subscriber = require('emissary').Subscriber;

  MinimapGitDiffBinding = require('./minimap-git-diff-binding');

  MinimapGitDiff = (function() {
    function MinimapGitDiff() {
      this.destroyBindings = __bind(this.destroyBindings, this);
      this.createBindings = __bind(this.createBindings, this);
    }

    Subscriber.includeInto(MinimapGitDiff);

    MinimapGitDiff.prototype.bindings = {};

    MinimapGitDiff.prototype.pluginActive = false;

    MinimapGitDiff.prototype.isActive = function() {
      return this.pluginActive;
    };

    MinimapGitDiff.prototype.activate = function(state) {
      this.gitDiff = atom.packages.getLoadedPackage('git-diff');
      this.minimap = atom.packages.getLoadedPackage('minimap');
      if (!((this.gitDiff != null) && (this.minimap != null))) {
        return this.deactivate();
      }
      if (atom.project.getRepo() == null) {
        return this.deactivate();
      }
      this.minimapModule = require(this.minimap.path);
      if (!this.minimapModule.versionMatch('1.x')) {
        return this.deactivate();
      }
      return this.minimapModule.registerPlugin('git-diff', this);
    };

    MinimapGitDiff.prototype.deactivate = function() {
      var binding, id, _ref;
      _ref = this.bindings;
      for (id in _ref) {
        binding = _ref[id];
        binding.destroy();
      }
      this.bindings = {};
      this.gitDiff = null;
      this.minimap = null;
      return this.minimapModule = null;
    };

    MinimapGitDiff.prototype.activatePlugin = function() {
      if (this.pluginActive) {
        return;
      }
      this.createBindings();
      this.pluginActive = true;
      this.subscribe(this.minimapModule, 'activated', this.createBindings);
      return this.subscribe(this.minimapModule, 'deactivated', this.destroyBindings);
    };

    MinimapGitDiff.prototype.deactivatePlugin = function() {
      if (!this.pluginActive) {
        return;
      }
      this.pluginActive = false;
      this.unsubscribe();
      return this.destroyBindings();
    };

    MinimapGitDiff.prototype.createBindings = function() {
      return this.minimapModule.eachMinimapView((function(_this) {
        return function(_arg) {
          var binding, editor, editorView, id, view;
          view = _arg.view;
          editorView = view.editorView;
          editor = view.editor;
          if (editor == null) {
            return;
          }
          id = editor.id;
          binding = new MinimapGitDiffBinding(editorView, _this.gitDiff, view);
          _this.bindings[id] = binding;
          return binding.activate();
        };
      })(this));
    };

    MinimapGitDiff.prototype.destroyBindings = function() {
      var binding, id, _ref;
      _ref = this.bindings;
      for (id in _ref) {
        binding = _ref[id];
        binding.destroy();
      }
      return this.bindings = {};
    };

    return MinimapGitDiff;

  })();

  module.exports = new MinimapGitDiff;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxhQUFjLE9BQUEsQ0FBUSxVQUFSLEVBQWQsVUFBRCxDQUFBOztBQUFBLEVBQ0EscUJBQUEsR0FBd0IsT0FBQSxDQUFRLDRCQUFSLENBRHhCLENBQUE7O0FBQUEsRUFHTTs7OztLQUNKOztBQUFBLElBQUEsVUFBVSxDQUFDLFdBQVgsQ0FBdUIsY0FBdkIsQ0FBQSxDQUFBOztBQUFBLDZCQUVBLFFBQUEsR0FBVSxFQUZWLENBQUE7O0FBQUEsNkJBR0EsWUFBQSxHQUFjLEtBSGQsQ0FBQTs7QUFBQSw2QkFJQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLGFBQUo7SUFBQSxDQUpWLENBQUE7O0FBQUEsNkJBS0EsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsVUFBL0IsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsU0FBL0IsQ0FEWCxDQUFBO0FBR0EsTUFBQSxJQUFBLENBQUEsQ0FBNEIsc0JBQUEsSUFBYyxzQkFBMUMsQ0FBQTtBQUFBLGVBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFQLENBQUE7T0FIQTtBQUlBLE1BQUEsSUFBNEIsOEJBQTVCO0FBQUEsZUFBTyxJQUFDLENBQUEsVUFBRCxDQUFBLENBQVAsQ0FBQTtPQUpBO0FBQUEsTUFNQSxJQUFDLENBQUEsYUFBRCxHQUFpQixPQUFBLENBQVEsSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFqQixDQU5qQixDQUFBO0FBUUEsTUFBQSxJQUFBLENBQUEsSUFBNkIsQ0FBQSxh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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-git-diff/lib/minimap-git-diff.coffee