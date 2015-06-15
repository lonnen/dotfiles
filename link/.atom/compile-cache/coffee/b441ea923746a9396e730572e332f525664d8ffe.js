(function() {
  var CompositeDisposable,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  CompositeDisposable = require('event-kit').CompositeDisposable;

  module.exports = function(findAndReplace, minimapPackage) {
    var MinimapFindResultsView;
    return MinimapFindResultsView = (function() {
      function MinimapFindResultsView(model) {
        this.model = model;
        this.markersUpdated = __bind(this.markersUpdated, this);
        this.subscriptions = new CompositeDisposable;
        this.subscriptions.add(this.model.onDidUpdate(this.markersUpdated));
        this.decorationsByMarkerId = {};
      }

      MinimapFindResultsView.prototype.destroy = function() {
        this.subscriptions.dispose();
        this.destroyDecorations();
        this.decorationsByMarkerId = {};
        return this.markers = null;
      };

      MinimapFindResultsView.prototype.destroyDecorations = function() {
        var decoration, id, _ref, _results;
        _ref = this.decorationsByMarkerId;
        _results = [];
        for (id in _ref) {
          decoration = _ref[id];
          _results.push(decoration.destroy());
        }
        return _results;
      };

      MinimapFindResultsView.prototype.getMinimap = function() {
        return minimapPackage.getActiveMinimap();
      };

      MinimapFindResultsView.prototype.markersUpdated = function(markers) {
        var decoration, marker, minimap, _i, _len, _results;
        minimap = this.getMinimap();
        if (minimap == null) {
          return;
        }
        _results = [];
        for (_i = 0, _len = markers.length; _i < _len; _i++) {
          marker = markers[_i];
          decoration = minimap.decorateMarker(marker, {
            type: 'highlight',
            scope: '.minimap .search-result'
          });
          _results.push(this.decorationsByMarkerId[marker.id] = decoration);
        }
        return _results;
      };

      MinimapFindResultsView.prototype.activePaneItemChanged = function() {
        this.destroyDecorations();
        return setImmediate((function(_this) {
          return function() {
            if (_this.markers != null) {
              return _this.markersUpdated(_this.model.markers);
            }
          };
        })(this));
      };

      return MinimapFindResultsView;

    })();
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLG1CQUFBO0lBQUEsa0ZBQUE7O0FBQUEsRUFBQyxzQkFBdUIsT0FBQSxDQUFRLFdBQVIsRUFBdkIsbUJBQUQsQ0FBQTs7QUFBQSxFQUVBLE1BQU0sQ0FBQyxPQUFQLEdBQWlCLFNBQUMsY0FBRCxFQUFpQixjQUFqQixHQUFBO0FBRWYsUUFBQSxzQkFBQTtXQUFNO0FBRVMsTUFBQSxnQ0FBRSxLQUFGLEdBQUE7QUFDWCxRQURZLElBQUMsQ0FBQSxRQUFBLEtBQ2IsQ0FBQTtBQUFBLCtEQUFBLENBQUE7QUFBQSxRQUFBLElBQUMsQ0FBQSxhQUFELEdBQWlCLEdBQUEsQ0FBQSxtQkFBakIsQ0FBQTtBQUFBLFFBQ0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUMsQ0FBQSxLQUFLLENBQUMsV0FBUCxDQUFtQixJQUFDLENBQUEsY0FBcEIsQ0FBbkIsQ0FEQSxDQUFBO0FBQUEsUUFFQSxJQUFDLENBQUEscUJBQUQsR0FBeUIsRUFGekIsQ0FEVztNQUFBLENBQWI7O0FBQUEsdUNBS0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLFFBQUEsSUFBQyxDQUFBLGFBQWEsQ0FBQyxPQUFmLENBQUEsQ0FBQSxDQUFBO0FBQUEsUUFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxRQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixFQUZ6QixDQUFBO2VBR0EsSUFBQyxDQUFBLE9BQUQsR0FBVyxLQUpKO01BQUEsQ0FMVCxDQUFBOztBQUFBLHVDQVdBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTtBQUNsQixZQUFBLDhCQUFBO0FBQUE7QUFBQTthQUFBLFVBQUE7Z0NBQUE7QUFBQSx3QkFBQSxVQUFVLENBQUMsT0FBWCxDQUFBLEVBQUEsQ0FBQTtBQUFBO3dCQURrQjtNQUFBLENBWHBCLENBQUE7O0FBQUEsdUNBY0EsVUFBQSxHQUFZLFNBQUEsR0FBQTtlQUFHLGNBQWMsQ0FBQyxnQkFBZixDQUFBLEVBQUg7TUFBQSxDQWRaLENBQUE7O0FBQUEsdUNBZ0JBLGNBQUEsR0FBZ0IsU0FBQyxPQUFELEdBQUE7QUFDZCxZQUFBLCtDQUFBO0FBQUEsUUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFWLENBQUE7QUFDQSxRQUFBLElBQWMsZUFBZDtBQUFBLGdCQUFBLENBQUE7U0FEQTtBQUdBO2FBQUEsOENBQUE7K0JBQUE7QUFDRSxVQUFBLFVBQUEsR0FBYSxPQUFPLENBQUMsY0FBUixDQUF1QixNQUF2QixFQUErQjtBQUFBLFlBQUEsSUFBQSxFQUFNLFdBQU47QUFBQSxZQUFtQixLQUFBLEVBQU8seUJBQTFCO1dBQS9CLENBQWIsQ0FBQTtBQUFBLHdCQUNBLElBQUMsQ0FBQSxxQkFBc0IsQ0FBQSxNQUFNLENBQUMsRUFBUCxDQUF2QixHQUFvQyxXQURwQyxDQURGO0FBQUE7d0JBSmM7TUFBQSxDQWhCaEIsQ0FBQTs7QUFBQSx1Q0F3QkEscUJBQUEsR0FBdUIsU0FBQSxHQUFBO0FBQ3JCLFFBQUEsSUFBQyxDQUFBLGtCQUFELENBQUEsQ0FBQSxDQUFBO2VBQ0EsWUFBQSxDQUFhLENBQUEsU0FBQSxLQUFBLEdBQUE7aUJBQUEsU0FBQSxHQUFBO0FBQUcsWUFBQSxJQUFtQyxxQkFBbkM7cUJBQUEsS0FBQyxDQUFBLGNBQUQsQ0FBZ0IsS0FBQyxDQUFBLEtBQUssQ0FBQyxPQUF2QixFQUFBO2FBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFiLEVBRnFCO01BQUEsQ0F4QnZCLENBQUE7O29DQUFBOztTQUphO0VBQUEsQ0FGakIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-results-view.coffee