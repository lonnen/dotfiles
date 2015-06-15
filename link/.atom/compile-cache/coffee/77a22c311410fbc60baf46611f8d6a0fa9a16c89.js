(function() {
  var Comb, CssCombView;

  Comb = require('csscomb');

  CssCombView = require('./css-comb-view');

  module.exports = {
    cssCombView: null,
    config: function() {
      var configSet, cssCombPackage;
      configSet = atom.config.get('css-comb.config');
      cssCombPackage = atom.packages.getLoadedPackage('atom-css-comb');
      if (configSet !== 'custom') {
        return configSet;
      } else if (configSet === 'custom') {
        return require(cssCombPackage.path + '/configs/.csscomb.json');
      } else {
        return 'yandex';
      }
    },
    activate: function(state) {
      atom.workspaceView.command("css-comb:comb", (function(_this) {
        return function() {
          return _this.comb();
        };
      })(this));
      return this.cssCombView = new CssCombView(state.cssCombViewState);
    },
    deactivate: function() {
      return this.cssCombView.destroy();
    },
    comb: function() {
      var comb, filePath;
      filePath = atom.workspace.activePaneItem.getPath();
      comb = new Comb(this.config());
      return comb.processPath(filePath);
    },
    serialize: function() {
      return {
        cssCombViewState: this.cssCombView.serialize()
      };
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxJQUVBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDSixVQUFBLHlCQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixDQUFaLENBQUE7QUFBQSxNQUNBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixlQUEvQixDQURqQixDQUFBO0FBR0EsTUFBQSxJQUFHLFNBQUEsS0FBYSxRQUFoQjtlQUNJLFVBREo7T0FBQSxNQUVLLElBQUcsU0FBQSxLQUFhLFFBQWhCO2VBQ0QsT0FBQSxDQUFRLGNBQWMsQ0FBQyxJQUFmLEdBQXNCLHdCQUE5QixFQURDO09BQUEsTUFBQTtlQUdELFNBSEM7T0FORDtJQUFBLENBRlI7QUFBQSxJQWFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNOLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixlQUEzQixFQUE0QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVDLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxXQUFELEdBQW1CLElBQUEsV0FBQSxDQUFZLEtBQUssQ0FBQyxnQkFBbEIsRUFGYjtJQUFBLENBYlY7QUFBQSxJQWlCQSxVQUFBLEVBQVksU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxPQUFiLENBQUEsRUFEUTtJQUFBLENBakJaO0FBQUEsSUFvQkEsSUFBQSxFQUFNLFNBQUEsR0FBQTtBQUNGLFVBQUEsY0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQTlCLENBQUEsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQVcsSUFBQSxJQUFBLENBQUssSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFMLENBRFgsQ0FBQTthQUVBLElBQUksQ0FBQyxXQUFMLENBQWlCLFFBQWpCLEVBSEU7SUFBQSxDQXBCTjtBQUFBLElBeUJBLFNBQUEsRUFBVyxTQUFBLEdBQUE7YUFDUDtBQUFBLFFBQUEsZ0JBQUEsRUFBa0IsSUFBQyxDQUFBLFdBQVcsQ0FBQyxTQUFiLENBQUEsQ0FBbEI7UUFETztJQUFBLENBekJYO0dBSkosQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-css-comb/lib/css-comb.coffee