(function() {
  var CompositeDisposable, MinimapGitDiffBinding, repositoryForPath,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  repositoryForPath = require('./helpers').repositoryForPath;

  module.exports = MinimapGitDiffBinding = (function() {
    MinimapGitDiffBinding.prototype.active = false;

    function MinimapGitDiffBinding(gitDiff, minimap) {
      var repository;
      this.gitDiff = gitDiff;
      this.minimap = minimap;
      this.updateDiffs = __bind(this.updateDiffs, this);
      this.editor = this.minimap.getTextEditor();
      this.decorations = {};
      this.markers = null;
      this.subscriptions = new CompositeDisposable;
      this.subscriptions.add(this.editor.getBuffer().onDidStopChanging(this.updateDiffs));
      if (repository = this.getRepo()) {
        this.subscriptions.add(repository.onDidChangeStatuses((function(_this) {
          return function() {
            return _this.scheduleUpdate();
          };
        })(this)));
        this.subscriptions.add(repository.onDidChangeStatus((function(_this) {
          return function(changedPath) {
            if (changedPath === _this.editor.getPath()) {
              return _this.scheduleUpdate();
            }
          };
        })(this)));
      }
      this.scheduleUpdate();
    }

    MinimapGitDiffBinding.prototype.cancelUpdate = function() {
      return clearImmediate(this.immediateId);
    };

    MinimapGitDiffBinding.prototype.scheduleUpdate = function() {
      this.cancelUpdate();
      return this.immediateId = setImmediate(this.updateDiffs);
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
      return atom.project.getRepositories().filter(function(repo) {
        return repo != null;
      });
    };

    MinimapGitDiffBinding.prototype.getRepo = function() {
      return this.repository != null ? this.repository : this.repository = repositoryForPath(this.editor.getPath());
    };

    MinimapGitDiffBinding.prototype.getDiffs = function() {
      var _ref;
      return (_ref = this.getRepo()) != null ? _ref.getLineDiffs(this.getPath(), this.editor.getBuffer().getText()) : void 0;
    };

    return MinimapGitDiffBinding;

  })();

}).call(this);
