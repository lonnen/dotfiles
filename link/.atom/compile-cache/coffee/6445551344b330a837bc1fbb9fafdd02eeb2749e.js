(function() {
  var Q, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  _ = require('underscore-plus');

  Q = require('q');

  module.exports = function(minimapPkg, colorHighlight) {
    var MinimapColorHighlighView;
    return MinimapColorHighlighView = (function() {
      function MinimapColorHighlighView(model, editor) {
        this.model = model;
        this.editor = editor;
        this.rebuildDecorations = __bind(this.rebuildDecorations, this);
        this.markersUpdated = __bind(this.markersUpdated, this);
        this.updateMarkers = __bind(this.updateMarkers, this);
        this.requestMarkersUpdate = __bind(this.requestMarkersUpdate, this);
        this.decorationsByMarkerId = {};
        this.subscription = this.model.onDidUpdateMarkers(this.requestMarkersUpdate);
        if (this.model != null) {
          this.requestMarkersUpdate();
        }
        this.observeConfig();
      }

      MinimapColorHighlighView.prototype.destroy = function() {
        var _ref;
        this.subscription.dispose();
        this.destroyDecorations();
        return (_ref = this.minimapView) != null ? _ref.find('.atom-color-highlight').remove() : void 0;
      };

      MinimapColorHighlighView.prototype.observeConfig = function() {
        atom.config.observe('atom-color-highlight.hideMarkersInComments', this.rebuildDecorations);
        atom.config.observe('atom-color-highlight.hideMarkersInStrings', this.rebuildDecorations);
        atom.config.observe('atom-color-highlight.markersAtEndOfLine', this.rebuildDecorations);
        atom.config.observe('atom-color-highlight.dotMarkersSize', this.rebuildDecorations);
        return atom.config.observe('atom-color-highlight.dotMarkersSpading', this.rebuildDecorations);
      };

      MinimapColorHighlighView.prototype.destroyDecorations = function() {
        var decoration, id, _ref, _results;
        _ref = this.decorationsByMarkerId;
        _results = [];
        for (id in _ref) {
          decoration = _ref[id];
          _results.push(decoration.destroy());
        }
        return _results;
      };

      MinimapColorHighlighView.prototype.getMinimap = function() {
        return minimapPkg.minimapForEditor(this.editor);
      };

      MinimapColorHighlighView.prototype.updateSelections = function() {};

      MinimapColorHighlighView.prototype.requestMarkersUpdate = function() {
        if (this.frameRequested) {
          return;
        }
        this.frameRequested = true;
        return requestAnimationFrame((function(_this) {
          return function() {
            _this.updateMarkers();
            return _this.frameRequested = false;
          };
        })(this));
      };

      MinimapColorHighlighView.prototype.updateMarkers = function() {
        return this.markersUpdated(this.model.markers);
      };

      MinimapColorHighlighView.prototype.markersUpdated = function(markers) {
        var decoration, decorationsToRemove, id, marker, minimap, _i, _len, _results;
        markers || (markers = []);
        minimap = this.getMinimap();
        decorationsToRemove = _.clone(this.decorationsByMarkerId);
        for (_i = 0, _len = markers.length; _i < _len; _i++) {
          marker = markers[_i];
          if (this.markerHidden(marker)) {
            continue;
          }
          if (this.decorationsByMarkerId[marker.id] != null) {
            delete decorationsToRemove[marker.id];
          } else {
            decoration = minimap.decorateMarker(marker, {
              type: 'highlight',
              color: marker.bufferMarker.properties.cssColor
            });
            this.decorationsByMarkerId[marker.id] = decoration;
          }
        }
        this.markers = markers;
        _results = [];
        for (id in decorationsToRemove) {
          decoration = decorationsToRemove[id];
          decoration.destroy();
          _results.push(delete this.decorationsByMarkerId[id]);
        }
        return _results;
      };

      MinimapColorHighlighView.prototype.rebuildDecorations = function() {
        this.destroyDecorations();
        return this.markersUpdated(this.markers);
      };

      MinimapColorHighlighView.prototype.markerHidden = function(marker) {
        return this.markerHiddenDueToComment(marker) || this.markerHiddenDueToString(marker);
      };

      MinimapColorHighlighView.prototype.getScope = function(bufferRange) {
        var descriptor;
        if (this.editor.displayBuffer.scopesForBufferPosition != null) {
          return this.editor.displayBuffer.scopesForBufferPosition(bufferRange.start).join(';');
        } else {
          descriptor = this.editor.displayBuffer.scopeDescriptorForBufferPosition(bufferRange.start);
          if (descriptor.join != null) {
            return descriptor.join(';');
          } else {
            return descriptor.scopes.join(';');
          }
        }
      };

      MinimapColorHighlighView.prototype.markerHiddenDueToComment = function(marker) {
        var bufferRange, scope;
        bufferRange = marker.getBufferRange();
        scope = this.getScope(bufferRange);
        return atom.config.get('atom-color-highlight.hideMarkersInComments') && (scope.match(/comment/) != null);
      };

      MinimapColorHighlighView.prototype.markerHiddenDueToString = function(marker) {
        var bufferRange, scope;
        bufferRange = marker.getBufferRange();
        scope = this.getScope(bufferRange);
        return atom.config.get('atom-color-highlight.hideMarkersInStrings') && (scope.match(/string/) != null);
      };

      return MinimapColorHighlighView;

    })();
  };

}).call(this);
