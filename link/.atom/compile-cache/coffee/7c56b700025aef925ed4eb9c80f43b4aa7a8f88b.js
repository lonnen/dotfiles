(function() {
  var $, CompositeDisposable, MinimapGitDiffBinding,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $ = require('atom').$;

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDZDQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxJQUFLLE9BQUEsQ0FBUSxNQUFSLEVBQUwsQ0FBRCxDQUFBOztBQUFBLEVBQ0Msc0JBQXVCLE9BQUEsQ0FBUSxXQUFSLEVBQXZCLG1CQURELENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBRUosb0NBQUEsTUFBQSxHQUFRLEtBQVIsQ0FBQTs7QUFFYSxJQUFBLCtCQUFFLE9BQUYsRUFBWSxPQUFaLEdBQUE7QUFDWCxVQUFBLFVBQUE7QUFBQSxNQURZLElBQUMsQ0FBQSxVQUFBLE9BQ2IsQ0FBQTtBQUFBLE1BRHNCLElBQUMsQ0FBQSxVQUFBLE9BQ3ZCLENBQUE7QUFBQSx1REFBQSxDQUFBO0FBQUEsNkRBQUEsQ0FBQTtBQUFBLE1BQUEsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsT0FBTyxDQUFDLGFBQVQsQ0FBQSxDQUFWLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFELEdBQWUsRUFEZixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsT0FBRCxHQUFXLElBRlgsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQUQsR0FBaUIsR0FBQSxDQUFBLG1CQUhqQixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsYUFBYSxDQUFDLEdBQWYsQ0FBbUIsSUFBQyxDQUFBLE1BQU0sQ0FBQyxXQUFSLENBQW9CLElBQUMsQ0FBQSxXQUFyQixDQUFuQixDQUxBLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFhLENBQUMsR0FBZixDQUFtQixJQUFDLENBQUEsTUFBTSxDQUFDLFNBQVIsQ0FBQSxDQUFtQixDQUFDLGlCQUFwQixDQUFzQyxJQUFDLENBQUEsV0FBdkMsQ0FBbkIsQ0FOQSxDQUFBO0FBQUEsTUFRQSxV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
//# sourceURL=/Users/lonnen/.atom/packages/minimap-git-diff/lib/minimap-git-diff-binding.coffee