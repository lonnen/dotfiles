(function() {
  var $,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $ = require('atom').$;

  module.exports = function() {
    var FindResultsView, MinimapFindResultsView, findAndReplace, minimap, minimapInstance;
    findAndReplace = atom.packages.getLoadedPackage('find-and-replace');
    minimap = atom.packages.getLoadedPackage('minimap');
    minimapInstance = require(minimap.path);
    FindResultsView = require(findAndReplace.path + '/lib/find-results-view');
    return MinimapFindResultsView = (function(_super) {
      __extends(MinimapFindResultsView, _super);

      function MinimapFindResultsView() {
        return MinimapFindResultsView.__super__.constructor.apply(this, arguments);
      }

      MinimapFindResultsView.prototype.attach = function() {
        minimap = this.getMinimap();
        if (minimap != null) {
          minimap.miniOverlayer.append(this);
          return this.adjustResults();
        }
      };

      MinimapFindResultsView.prototype.adjustResults = function() {
        if (this.adjusted) {
          return;
        }
        this.css('-webkit-transform', "scale3d(" + (minimapInstance.getCharWidthRatio()) + ",1,1)");
        return this.adjusted = true;
      };

      MinimapFindResultsView.prototype.getEditor = function() {
        var activeView;
        activeView = atom.workspaceView.getActiveView();
        if (activeView != null ? activeView.hasClass('editor') : void 0) {
          return activeView;
        } else {
          return null;
        }
      };

      MinimapFindResultsView.prototype.getMinimap = function() {
        var editorView;
        editorView = this.getEditor();
        if (editorView.hasClass('editor')) {
          return minimapInstance.minimapForEditorView(editorView);
        }
      };

      MinimapFindResultsView.prototype.markersUpdated = function(markers) {
        var k, marker, _ref, _results;
        minimap = this.getMinimap();
        MinimapFindResultsView.__super__.markersUpdated.call(this, markers);
        _ref = this.markerViews;
        _results = [];
        for (k in _ref) {
          marker = _ref[k];
          _results.push(marker.intersectsRenderedScreenRows = function(range) {
            if (minimap == null) {
              return false;
            }
            return range.intersectsRowRange(minimap.miniEditorView.firstRenderedScreenRow, minimap.miniEditorView.lastRenderedScreenRow);
          });
        }
        return _results;
      };

      return MinimapFindResultsView;

    })(FindResultsView);
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLENBQUE7SUFBQTttU0FBQTs7QUFBQSxFQUFDLElBQUssT0FBQSxDQUFRLE1BQVIsRUFBTCxDQUFELENBQUE7O0FBQUEsRUFPQSxNQUFNLENBQUMsT0FBUCxHQUFpQixTQUFBLEdBQUE7QUFDZixRQUFBLGlGQUFBO0FBQUEsSUFBQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0Isa0JBQS9CLENBQWpCLENBQUE7QUFBQSxJQUNBLE9BQUEsR0FBVSxJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFNBQS9CLENBRFYsQ0FBQTtBQUFBLElBR0EsZUFBQSxHQUFrQixPQUFBLENBQVMsT0FBTyxDQUFDLElBQWpCLENBSGxCLENBQUE7QUFBQSxJQUlBLGVBQUEsR0FBa0IsT0FBQSxDQUFTLGNBQWMsQ0FBQyxJQUFmLEdBQXNCLHdCQUEvQixDQUpsQixDQUFBO1dBTU07QUFDSiwrQ0FBQSxDQUFBOzs7O09BQUE7O0FBQUEsdUNBQUEsTUFBQSxHQUFRLFNBQUEsR0FBQTtBQUNOLFFBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBVixDQUFBO0FBRUEsUUFBQSxJQUFHLGVBQUg7QUFDRSxVQUFBLE9BQU8sQ0FBQyxhQUFhLENBQUMsTUFBdEIsQ0FBNkIsSUFBN0IsQ0FBQSxDQUFBO2lCQUNBLElBQUMsQ0FBQSxhQUFELENBQUEsRUFGRjtTQUhNO01BQUEsQ0FBUixDQUFBOztBQUFBLHVDQWFBLGFBQUEsR0FBZSxTQUFBLEdBQUE7QUFDYixRQUFBLElBQVUsSUFBQyxDQUFBLFFBQVg7QUFBQSxnQkFBQSxDQUFBO1NBQUE7QUFBQSxRQUNBLElBQUMsQ0FBQSxHQUFELENBQUssbUJBQUwsRUFBMkIsVUFBQSxHQUFTLENBQUEsZUFBZSxDQUFDLGlCQUFoQixDQUFBLENBQUEsQ0FBVCxHQUE4QyxPQUF6RSxDQURBLENBQUE7ZUFFQSxJQUFDLENBQUEsUUFBRCxHQUFZLEtBSEM7TUFBQSxDQWJmLENBQUE7O0FBQUEsdUNBa0JBLFNBQUEsR0FBVyxTQUFBLEdBQUE7QUFDVCxZQUFBLFVBQUE7QUFBQSxRQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQW5CLENBQUEsQ0FBYixDQUFBO0FBQ0EsUUFBQSx5QkFBRyxVQUFVLENBQUUsUUFBWixDQUFxQixRQUFyQixVQUFIO2lCQUF1QyxXQUF2QztTQUFBLE1BQUE7aUJBQXVELEtBQXZEO1NBRlM7TUFBQSxDQWxCWCxDQUFBOztBQUFBLHVDQXNCQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1YsWUFBQSxVQUFBO0FBQUEsUUFBQSxVQUFBLEdBQWEsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFiLENBQUE7QUFDQSxRQUFBLElBQUcsVUFBVSxDQUFDLFFBQVgsQ0FBb0IsUUFBcEIsQ0FBSDtBQUNFLGlCQUFPLGVBQWUsQ0FBQyxvQkFBaEIsQ0FBcUMsVUFBckMsQ0FBUCxDQURGO1NBRlU7TUFBQSxDQXRCWixDQUFBOztBQUFBLHVDQStCQSxjQUFBLEdBQWdCLFNBQUMsT0FBRCxHQUFBO0FBQ2QsWUFBQSx5QkFBQTtBQUFBLFFBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxVQUFELENBQUEsQ0FBVixDQUFBO0FBQUEsUUFDQSwyREFBTSxPQUFOLENBREEsQ0FBQTtBQUVBO0FBQUE7YUFBQSxTQUFBOzJCQUFBO0FBQ0Usd0JBQUEsTUFBTSxDQUFDLDRCQUFQLEdBQXNDLFNBQUMsS0FBRCxHQUFBO0FBQ3BDLFlBQUEsSUFBb0IsZUFBcEI7QUFBQSxxQkFBTyxLQUFQLENBQUE7YUFBQTttQkFDQSxLQUFLLENBQUMsa0JBQU4sQ0FBeUIsT0FBTyxDQUFDLGNBQWMsQ0FBQyxzQkFBaEQsRUFBd0UsT0FBTyxDQUFDLGNBQWMsQ0FBQyxxQkFBL0YsRUFGb0M7VUFBQSxFQUF0QyxDQURGO0FBQUE7d0JBSGM7TUFBQSxDQS9CaEIsQ0FBQTs7b0NBQUE7O09BRG1DLGlCQVB0QjtFQUFBLENBUGpCLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-results-view.coffee