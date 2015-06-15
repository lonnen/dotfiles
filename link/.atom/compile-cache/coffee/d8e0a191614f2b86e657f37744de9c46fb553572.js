(function() {
  var CompositeDisposable, MinimapGitDiffBinding,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = MinimapGitDiffBinding = (function() {
    MinimapGitDiffBinding.prototype.active = false;

    function MinimapGitDiffBinding(gitDiff, minimap) {
      var repository;
      this.gitDiff = gitDiff;
      this.minimap = minimap;
      this.updateDiffs = __bind(this.updateDiffs, this);
      this.scheduleUpdate = __bind(this.scheduleUpdate, this);
      this.editor = this.minimap.getTextEditor();
      this.decorations = {};
      this.markers = null;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.onDidChange(this.updateDiffs));
      this.subscriptions.add(this.editor.getBuffer().onDidStopChanging(this.updateDiffs));
      repository = this.getRepo();
      this.subscriptions.add(repository.onDidChangeStatuses(this.scheduleUpdate));
      this.subscriptions.add(repository.onDidChangeStatus(this.scheduleUpdate));
      this.scheduleUpdate();
    }

    MinimapGitDiffBinding.prototype.scheduleUpdate = function() {
      return setImmediate(this.updateDiffs);
    };

    MinimapGitDiffBinding.prototype.updateDiffs = function() {
      this.removeDecorations();
      if (this.getPath() && (this.diffs = this.getDiffs())) {
        return this.addDecorations(this.diffs);
      }
    };

    MinimapGitDiffBinding.prototype.addDecorations = function(diffs) {
      var endRow, newLines, newStart, oldLines, oldStart, startRow, _i, _len, _ref, _results;
      _results = [];
      for (_i = 0, _len = diffs.length; _i < _len; _i++) {
        _ref = diffs[_i], oldStart = _ref.oldStart, newStart = _ref.newStart, oldLines = _ref.oldLines, newLines = _ref.newLines;
        startRow = newStart - 1;
        endRow = newStart + newLines - 2;
        if (oldLines === 0 && newLines > 0) {
          _results.push(this.markRange(startRow, endRow, '.minimap .git-line-added'));
        } else if (newLines === 0 && oldLines > 0) {
          _results.push(this.markRange(startRow, startRow, '.minimap .git-line-removed'));
        } else {
          _results.push(this.markRange(startRow, endRow, '.minimap .git-line-modified'));
        }
      }
      return _results;
    };

    MinimapGitDiffBinding.prototype.removeDecorations = function() {
      var marker, _i, _len, _ref;
      if (this.markers == null) {
        return;
      }
      _ref = this.markers;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        marker.destroy();
      }
      return this.markers = null;
    };

    MinimapGitDiffBinding.prototype.markRange = function(startRow, endRow, scope) {
      var marker;
      if (this.editor.displayBuffer.isDestroyed()) {
        return;
      }
      marker = this.editor.markBufferRange([[startRow, 0], [endRow, Infinity]], {
        invalidate: 'never'
      });
      this.minimap.decorateMarker(marker, {
        type: 'line',
        scope: scope
      });
      if (this.markers == null) {
        this.markers = [];
      }
      return this.markers.push(marker);
    };

    MinimapGitDiffBinding.prototype.destroy = function() {
      this.removeDecorations();
      this.subscriptions.dispose();
      return this.diffs = null;
    };

    MinimapGitDiffBinding.prototype.getPath = function() {
      var _ref;
      return (_ref = this.editor.getBuffer()) != null ? _ref.getPath() : void 0;
    };

    MinimapGitDiffBinding.prototype.getRepositories = function() {
      var _ref;
      return (_ref = atom.project) != null ? _ref.getRepositories() : void 0;
    };

    MinimapGitDiffBinding.prototype.getRepo = function() {
      var _ref;
      return (_ref = this.getRepositories()) != null ? _ref[0] : void 0;
    };

    MinimapGitDiffBinding.prototype.getDiffs = function() {
      var _ref;
      return (_ref = this.getRepo()) != null ? _ref.getLineDiffs(this.getPath(), this.editor.getBuffer().getText()) : void 0;
    };

    return MinimapGitDiffBinding;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDBDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFFSixvQ0FBQSxNQUFBLEdBQVEsS0FBUixDQUFBOztBQUVhLElBQUEsK0JBQUUsT0FBRixFQUFZLE9BQVosR0FBQTtBQUNYLFVBQUEsVUFBQTtBQUFBLE1BRFksSUFBQyxDQUFBLFVBQUEsT0FDYixDQUFBO0FBQUEsTUFEc0IsSUFBQyxDQUFBLFVBQUEsT0FDdkIsQ0FBQTtBQUFBLHVEQUFBLENBQUE7QUFBQSw2REFBQSxDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxPQUFPLENBQUMsYUFBVCxDQUFBLENBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLFdBQUQsR0FBZSxFQURmLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxPQUFELEdBQVcsSUFGWCxDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBSGpCLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFdBQVIsQ0FBb0IsSUFBQyxDQUFBLFdBQXJCLENBQW5CLENBTEEsQ0FBQTtBQUFBLE1BTUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxNQUFNLENBQUMsU0FBUixDQUFBLENBQW1CLENBQUMsaUJBQXBCLENBQXNDLElBQUMsQ0FBQSxXQUF2QyxDQUFuQixDQU5BLENBQUE7QUFBQSxNQVFBLFVBQUEsR0FBYSxJQUFDLENBQUEsT0FBRCxDQUFBLENBUmIsQ0FBQTtBQUFBLE1B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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-git-diff/lib/minimap-git-diff-binding.coffee