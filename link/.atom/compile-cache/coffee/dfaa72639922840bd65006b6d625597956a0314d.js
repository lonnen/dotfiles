(function() {
  var MinimapFindAndReplaceBinding;

  MinimapFindAndReplaceBinding = require('./minimap-find-and-replace-binding');

  module.exports = {
    binding: null,
    activate: function(state) {
      var findPackage, minimapPackage;
      findPackage = atom.packages.getLoadedPackage('find-and-replace');
      minimapPackage = atom.packages.getLoadedPackage('minimap');
      if (!((findPackage != null) && (minimapPackage != null))) {
        return this.deactivate();
      }
      return this.binding = new MinimapFindAndReplaceBinding(findPackage, minimapPackage);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDRCQUFBOztBQUFBLEVBQUEsNEJBQUEsR0FBK0IsT0FBQSxDQUFRLG9DQUFSLENBQS9CLENBQUE7O0FBQUEsRUFFQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxPQUFBLEVBQVMsSUFBVDtBQUFBLElBQ0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsVUFBQSwyQkFBQTtBQUFBLE1BQUEsV0FBQSxHQUFjLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0Isa0JBQS9CLENBQWQsQ0FBQTtBQUFBLE1BQ0EsY0FBQSxHQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLFNBQS9CLENBRGpCLENBQUE7QUFHQSxNQUFBLElBQUEsQ0FBQSxDQUE0QixxQkFBQSxJQUFpQix3QkFBN0MsQ0FBQTtBQUFBLGVBQU8sSUFBQyxDQUFBLFVBQUQsQ0FBQSxDQUFQLENBQUE7T0FIQTthQUtBLElBQUMsQ0FBQSxPQUFELEdBQWUsSUFBQSw0QkFBQSxDQUE2QixXQUE3QixFQUEwQyxjQUExQyxFQU5QO0lBQUEsQ0FEVjtBQUFBLElBU0EsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTs7WUFBUSxDQUFFLFVBQVYsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBRmYsQ0FBQTthQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FKRDtJQUFBLENBVFo7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-and-replace.coffee