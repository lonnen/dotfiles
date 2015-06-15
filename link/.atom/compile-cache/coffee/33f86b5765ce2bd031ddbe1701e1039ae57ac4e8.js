(function() {
  var CompositeDisposable, Disposable, MinimapGitDiff, MinimapGitDiffBinding, requirePackages, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  requirePackages = require('atom-utils').requirePackages;

  MinimapGitDiffBinding = null;

  MinimapGitDiff = (function() {
    MinimapGitDiff.prototype.bindings = {};

    MinimapGitDiff.prototype.pluginActive = false;

    function MinimapGitDiff() {
      this.destroyBindings = __bind(this.destroyBindings, this);
      this.createBindings = __bind(this.createBindings, this);
      this.activateBinding = __bind(this.activateBinding, this);
      this.subscriptions = new CompositeDisposable;
    }

    MinimapGitDiff.prototype.isActive = function() {
      return this.pluginActive;
    };

    MinimapGitDiff.prototype.activate = function(state) {
      return requirePackages('minimap', 'git-diff').then((function(_this) {
        return function(_arg) {
          _this.minimap = _arg[0], _this.gitDiff = _arg[1];
          if (!_this.minimap.versionMatch('>= 3.5.0')) {
            return _this.deactivate();
          }
          return _this.minimap.registerPlugin('git-diff', _this);
        };
      })(this));
    };

    MinimapGitDiff.prototype.deactivate = function() {
      var binding, id, _ref1;
      _ref1 = this.bindings;
      for (id in _ref1) {
        binding = _ref1[id];
        binding.destroy();
      }
      this.bindings = {};
      this.gitDiff = null;
      return this.minimap = null;
    };

    MinimapGitDiff.prototype.activatePlugin = function() {
      var e;
      if (this.pluginActive) {
        return;
      }
      try {
        this.activateBinding();
        this.pluginActive = true;
        this.subscriptions.add(this.minimap.onDidActivate(this.activateBinding));
        return this.subscriptions.add(this.minimap.onDidDeactivate(this.destroyBindings));
      } catch (_error) {
        e = _error;
        return console.log(e);
      }
    };

    MinimapGitDiff.prototype.deactivatePlugin = function() {
      if (!this.pluginActive) {
        return;
      }
      this.pluginActive = false;
      this.subscriptions.dispose();
      return this.destroyBindings();
    };

    MinimapGitDiff.prototype.activateBinding = function() {
      if (this.getRepositories().length > 0) {
        this.createBindings();
      }
      return this.subscriptions.add(atom.project.onDidChangePaths((function(_this) {
        return function() {
          if (_this.getRepositories().length > 0) {
            return _this.createBindings();
          } else {
            return _this.destroyBindings();
          }
        };
      })(this)));
    };

    MinimapGitDiff.prototype.createBindings = function() {
      MinimapGitDiffBinding || (MinimapGitDiffBinding = require('./minimap-git-diff-binding'));
      return this.subscriptions.add(this.minimap.observeMinimaps((function(_this) {
        return function(o) {
          var binding, editor, id, minimap, _ref1;
          minimap = (_ref1 = o.view) != null ? _ref1 : o;
          editor = minimap.getTextEditor();
          if (editor == null) {
            return;
          }
          id = editor.id;
          binding = new MinimapGitDiffBinding(_this.gitDiff, minimap);
          return _this.bindings[id] = binding;
        };
      })(this)));
    };

    MinimapGitDiff.prototype.getRepositories = function() {
      return atom.project.getRepositories().filter(function(repo) {
        return repo != null;
      });
    };

    MinimapGitDiff.prototype.destroyBindings = function() {
      var binding, id, _ref1;
      _ref1 = this.bindings;
      for (id in _ref1) {
        binding = _ref1[id];
        binding.destroy();
      }
      return this.bindings = {};
    };

    MinimapGitDiff.prototype.asDisposable = function(subscription) {
      return new Disposable(function() {
        return subscription.off();
      });
    };

    return MinimapGitDiff;

  })();

  module.exports = new MinimapGitDiff;

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZGQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQSxPQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBQXRCLENBQUE7O0FBQUEsRUFDQyxrQkFBbUIsT0FBQSxDQUFRLFlBQVIsRUFBbkIsZUFERCxDQUFBOztBQUFBLEVBR0EscUJBQUEsR0FBd0IsSUFIeEIsQ0FBQTs7QUFBQSxFQUtNO0FBRUosNkJBQUEsUUFBQSxHQUFVLEVBQVYsQ0FBQTs7QUFBQSw2QkFDQSxZQUFBLEdBQWMsS0FEZCxDQUFBOztBQUVhLElBQUEsd0JBQUEsR0FBQTtBQUNYLCtEQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEsK0RBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUFqQixDQURXO0lBQUEsQ0FGYjs7QUFBQSw2QkFLQSxRQUFBLEdBQVUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLGFBQUo7SUFBQSxDQUxWLENBQUE7O0FBQUEsNkJBTUEsUUFBQSxHQUFVLFNBQUMsS0FBRCxHQUFBO2FBQ1IsZUFBQSxDQUFnQixTQUFoQixFQUEyQixVQUEzQixDQUFzQyxDQUFDLElBQXZDLENBQTRDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUMxQyxVQUQ0QyxLQUFDLENBQUEsbUJBQVMsS0FBQyxDQUFBLGlCQUN2RCxDQUFBO0FBQUEsVUFBQSxJQUFBLENBQUEsS0FBNkIsQ0FBQSxPQUFPLENBQUMsWUFBVCxDQUFzQixVQUF0QixDQUE1QjtBQUFBLG1CQUFPLEtBQUMsQ0FBQSxVQUFELENBQUEsQ0FBUCxDQUFBO1dBQUE7aUJBQ0EsS0FBQyxDQUFBLE9BQU8sQ0FBQyxjQUFU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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-git-diff/lib/minimap-git-diff.coffee