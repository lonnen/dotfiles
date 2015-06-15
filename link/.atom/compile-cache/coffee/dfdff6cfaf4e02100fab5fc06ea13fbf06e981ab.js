(function() {
  var requirePackages;

  requirePackages = require('atom-utils').requirePackages;

  module.exports = {
    binding: null,
    activate: function(state) {
      return requirePackages('minimap', 'find-and-replace').then(function(_arg) {
        var MinimapFindAndReplaceBinding, find, minimap;
        minimap = _arg[0], find = _arg[1];
        if (!minimap.versionMatch('>= 3.5.0')) {
          return this.deactivate();
        }
        MinimapFindAndReplaceBinding = require('./minimap-find-and-replace-binding');
        return this.binding = new MinimapFindAndReplaceBinding(find, minimap);
      })["catch"](function(reasons) {
        return console.log(reasons);
      });
    },
    deactivate: function() {
      var _ref;
      if ((_ref = this.binding) != null) {
        _ref.deactivate();
      }
      this.minimapPackage = null;
      this.findPackage = null;
      return this.binding = null;
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLFlBQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsT0FBQSxFQUFTLElBQVQ7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTthQUNSLGVBQUEsQ0FBZ0IsU0FBaEIsRUFBMkIsa0JBQTNCLENBQThDLENBQUMsSUFBL0MsQ0FBb0QsU0FBQyxJQUFELEdBQUE7QUFDbEQsWUFBQSwyQ0FBQTtBQUFBLFFBRG9ELG1CQUFTLGNBQzdELENBQUE7QUFBQSxRQUFBLElBQUEsQ0FBQSxPQUFtQyxDQUFDLFlBQVIsQ0FBcUIsVUFBckIsQ0FBNUI7QUFBQSxpQkFBTyxJQUFDLENBQUEsVUFBRCxDQUFBLENBQVAsQ0FBQTtTQUFBO0FBQUEsUUFFQSw0QkFBQSxHQUErQixPQUFBLENBQVEsb0NBQVIsQ0FGL0IsQ0FBQTtlQUdBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSw0QkFBQSxDQUE2QixJQUE3QixFQUFtQyxPQUFuQyxFQUptQztNQUFBLENBQXBELENBTUEsQ0FBQyxPQUFELENBTkEsQ0FNTyxTQUFDLE9BQUQsR0FBQTtlQUNMLE9BQU8sQ0FBQyxHQUFSLENBQVksT0FBWixFQURLO01BQUEsQ0FOUCxFQURRO0lBQUEsQ0FGVjtBQUFBLElBWUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTs7WUFBUSxDQUFFLFVBQVYsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBRmYsQ0FBQTthQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FKRDtJQUFBLENBWlo7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-and-replace.coffee