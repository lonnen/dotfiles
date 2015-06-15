(function() {
  var requirePackages;

  requirePackages = require('atom-utils').requirePackages;

  module.exports = {
    binding: null,
    activate: function(state) {},
    consumeMinimapServiceV1: function(minimap) {
      return requirePackages('find-and-replace').then((function(_this) {
        return function(_arg) {
          var MinimapFindAndReplaceBinding, find;
          find = _arg[0];
          MinimapFindAndReplaceBinding = require('./minimap-find-and-replace-binding');
          return _this.binding = new MinimapFindAndReplaceBinding(find, minimap);
        };
      })(this))["catch"](function(reasons) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQ0E7QUFBQSxNQUFBLGVBQUE7O0FBQUEsRUFBQyxrQkFBbUIsT0FBQSxDQUFRLFlBQVIsRUFBbkIsZUFBRCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDRTtBQUFBLElBQUEsT0FBQSxFQUFTLElBQVQ7QUFBQSxJQUVBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQSxDQUZWO0FBQUEsSUFJQSx1QkFBQSxFQUF5QixTQUFDLE9BQUQsR0FBQTthQUN2QixlQUFBLENBQWdCLGtCQUFoQixDQUFtQyxDQUFDLElBQXBDLENBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLElBQUQsR0FBQTtBQUV2QyxjQUFBLGtDQUFBO0FBQUEsVUFGeUMsT0FBRCxPQUV4QyxDQUFBO0FBQUEsVUFBQSw0QkFBQSxHQUErQixPQUFBLENBQVEsb0NBQVIsQ0FBL0IsQ0FBQTtpQkFDQSxLQUFDLENBQUEsT0FBRCxHQUFlLElBQUEsNEJBQUEsQ0FBNkIsSUFBN0IsRUFBbUMsT0FBbkMsRUFId0I7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxDQUtBLENBQUMsT0FBRCxDQUxBLENBS08sU0FBQyxPQUFELEdBQUE7ZUFDTCxPQUFPLENBQUMsR0FBUixDQUFZLE9BQVosRUFESztNQUFBLENBTFAsRUFEdUI7SUFBQSxDQUp6QjtBQUFBLElBYUEsVUFBQSxFQUFZLFNBQUEsR0FBQTtBQUNWLFVBQUEsSUFBQTs7WUFBUSxDQUFFLFVBQVYsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLElBRmYsQ0FBQTthQUdBLElBQUMsQ0FBQSxPQUFELEdBQVcsS0FKRDtJQUFBLENBYlo7R0FIRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lonnen/.atom/packages/minimap-find-and-replace/lib/minimap-find-and-replace.coffee