(function() {
  var $, Emitter, MinimapGitDiffBinding, Subscriber, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('atom').$;

  _ref = require('emissary'), Subscriber = _ref.Subscriber, Emitter = _ref.Emitter;

  module.exports = MinimapGitDiffBinding = (function() {
    Subscriber.includeInto(MinimapGitDiffBinding);

    Emitter.includeInto(MinimapGitDiffBinding);

    MinimapGitDiffBinding.prototype.active = false;

    function MinimapGitDiffBinding(editorView, gitDiffPackage, minimapView) {
      this.editorView = editorView;
      this.gitDiffPackage = gitDiffPackage;
      this.minimapView = minimapView;
      this.subscribeToBuffer = __bind(this.subscribeToBuffer, this);
      this.renderDiffs = __bind(this.renderDiffs, this);
      this.updateDiffs = __bind(this.updateDiffs, this);
      this.editor = this.editorView.editor;
      this.gitDiff = require(this.gitDiffPackage.path);
    }

    MinimapGitDiffBinding.prototype.activate = function() {
      this.subscribe(this.editorView, 'editor:path-changed', this.subscribeToBuffer);
      this.subscribe(this.editorView, 'editor:contents-modified', this.renderDiffs);
      this.subscribe(atom.project.getRepo(), 'statuses-changed', (function(_this) {
        return function() {
          return _this.scheduleUpdate();
        };
      })(this));
      this.subscribe(atom.project.getRepo(), 'status-changed', (function(_this) {
        return function(path) {
          return _this.scheduleUpdate();
        };
      })(this));
      this.subscribeToBuffer();
      return this.updateDiffs();
    };

    MinimapGitDiffBinding.prototype.deactivate = function() {
      this.removeDiffs();
      return this.unsubscribe();
    };

    MinimapGitDiffBinding.prototype.scheduleUpdate = function() {
      return setImmediate(this.updateDiffs);
    };

    MinimapGitDiffBinding.prototype.updateDiffs = function() {
      if (this.buffer == null) {
        return;
      }
      return this.renderDiffs();
    };

    MinimapGitDiffBinding.prototype.renderDiffs = function() {
      var diffs, displayBuffer, end, newLines, newStart, oldLines, oldStart, row, start, _i, _len, _ref1, _results;
      this.removeDiffs();
      diffs = this.getDiffs();
      displayBuffer = this.editor.displayBuffer;
      if (diffs == null) {
        return;
      }
      _results = [];
      for (_i = 0, _len = diffs.length; _i < _len; _i++) {
        _ref1 = diffs[_i], newLines = _ref1.newLines, oldLines = _ref1.oldLines, newStart = _ref1.newStart, oldStart = _ref1.oldStart;
        if (oldLines === 0 && newLines > 0) {
          _results.push((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (row = _j = newStart, _ref2 = newStart + newLines; newStart <= _ref2 ? _j < _ref2 : _j > _ref2; row = newStart <= _ref2 ? ++_j : --_j) {
              start = displayBuffer.screenRowForBufferRow(row);
              end = displayBuffer.lastScreenRowForBufferRow(row);
              _results1.push(this.decorateLines(start, end, 'added'));
            }
            return _results1;
          }).call(this));
        } else if (newLines === 0 && oldLines > 0) {
          start = displayBuffer.screenRowForBufferRow(newStart);
          end = displayBuffer.lastScreenRowForBufferRow(newStart);
          if (start === 0 && start === end) {
            start = end = 1;
          }
          _results.push(this.decorateLines(start, end, 'removed'));
        } else {
          _results.push((function() {
            var _j, _ref2, _results1;
            _results1 = [];
            for (row = _j = newStart, _ref2 = newStart + newLines; newStart <= _ref2 ? _j < _ref2 : _j > _ref2; row = newStart <= _ref2 ? ++_j : --_j) {
              start = displayBuffer.screenRowForBufferRow(row);
              end = displayBuffer.lastScreenRowForBufferRow(row);
              _results1.push(this.decorateLines(start, end, 'modified'));
            }
            return _results1;
          }).call(this));
        }
      }
      return _results;
    };

    MinimapGitDiffBinding.prototype.decorateLines = function(start, end, status) {
      var row, _i, _results;
      _results = [];
      for (row = _i = start; start <= end ? _i <= end : _i >= end; row = start <= end ? ++_i : --_i) {
        _results.push(this.minimapView.addLineClass(row, "git-line-" + status));
      }
      return _results;
    };

    MinimapGitDiffBinding.prototype.removeDiffs = function() {
      var _ref1;
      return (_ref1 = this.minimapView) != null ? _ref1.removeAllLineClasses('git-line-added', 'git-line-removed', 'git-line-modified') : void 0;
    };

    MinimapGitDiffBinding.prototype.destroy = function() {
      return this.deactivate();
    };

    MinimapGitDiffBinding.prototype.getPath = function() {
      return this.buffer.getPath();
    };

    MinimapGitDiffBinding.prototype.getRepo = function() {
      return atom.project.getRepo();
    };

    MinimapGitDiffBinding.prototype.getDiffs = function() {
      var _ref1;
      return (_ref1 = this.getRepo()) != null ? _ref1.getLineDiffs(this.getPath(), this.editorView.getText()) : void 0;
    };

    MinimapGitDiffBinding.prototype.unsubscribeFromBuffer = function() {
      if (this.buffer != null) {
        this.removeDiffs();
        return this.buffer = null;
      }
    };

    MinimapGitDiffBinding.prototype.subscribeToBuffer = function() {
      this.unsubscribeFromBuffer();
      if (this.buffer = this.editor.getBuffer()) {
        return this.buffer.on('contents-modified', this.updateDiffs);
      }
    };

    return MinimapGitDiffBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1EQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0EsT0FBd0IsT0FBQSxDQUFRLFVBQVIsQ0FBeEIsRUFBQyxrQkFBQSxVQUFELEVBQWEsZUFBQSxPQURiLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxVQUFVLENBQUMsV0FBWCxDQUF1QixxQkFBdkIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsT0FBTyxDQUFDLFdBQVIsQ0FBb0IscUJBQXBCLENBREEsQ0FBQTs7QUFBQSxvQ0FHQSxNQUFBLEdBQVEsS0FIUixDQUFBOztBQUthLElBQUEsK0JBQUUsVUFBRixFQUFlLGNBQWYsRUFBZ0MsV0FBaEMsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLGFBQUEsVUFDYixDQUFBO0FBQUEsTUFEeUIsSUFBQyxDQUFBLGlCQUFBLGNBQzFCLENBQUE7QUFBQSxNQUQwQyxJQUFDLENBQUEsY0FBQSxXQUMzQyxDQUFBO0FBQUEsbUVBQUEsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEsTUFBQyxJQUFDLENBQUEsU0FBVSxJQUFDLENBQUEsV0FBWCxNQUFGLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxPQUFELEdBQVcsT0FBQSxDQUFRLElBQUMsQ0FBQSxjQUFjLENBQUMsSUFBeEIsQ0FEWCxDQURXO0lBQUEsQ0FMYjs7QUFBQSxvQ0FTQSxRQUFBLEdBQVUsU0FBQSxHQUFBO0FBQ1IsTUFBQSxJQUFDLENBQUEsU0FBRCxDQUFXLElBQUMsQ0FBQSxVQUFaLEVBQXdCLHFCQUF4QixFQUErQyxJQUFDLENBQUEsaUJBQWhELENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-git-diff/lib/minimap-git-diff-binding.coffee