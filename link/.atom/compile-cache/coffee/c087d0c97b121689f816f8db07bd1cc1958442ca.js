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
      atom.commands.add('atom-workspace', {
        'css-comb:comb': (function(_this) {
          return function() {
            return _this.comb();
          };
        })(this)
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlCQUFBOztBQUFBLEVBQUEsSUFBQSxHQUFPLE9BQUEsQ0FBUSxTQUFSLENBQVAsQ0FBQTs7QUFBQSxFQUNBLFdBQUEsR0FBYyxPQUFBLENBQVEsaUJBQVIsQ0FEZCxDQUFBOztBQUFBLEVBR0EsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsV0FBQSxFQUFhLElBQWI7QUFBQSxJQUVBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDSixVQUFBLHlCQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixDQUFaLENBQUE7QUFBQSxNQUNBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixlQUEvQixDQURqQixDQUFBO0FBR0EsTUFBQSxJQUFHLFNBQUEsS0FBYSxRQUFoQjtlQUNJLFVBREo7T0FBQSxNQUVLLElBQUcsU0FBQSxLQUFhLFFBQWhCO2VBQ0QsT0FBQSxDQUFRLGNBQWMsQ0FBQyxJQUFmLEdBQXNCLHdCQUE5QixFQURDO09BQUEsTUFBQTtlQUdELFNBSEM7T0FORDtJQUFBLENBRlI7QUFBQSxJQWFBLFFBQUEsRUFBVSxTQUFDLEtBQUQsR0FBQTtBQUNOLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFkLENBQWtCLGdCQUFsQixFQUFvQztBQUFBLFFBQUEsZUFBQSxFQUFpQixDQUFBLFNBQUEsS0FBQSxHQUFBO2lCQUFBLFNBQUEsR0FBQTttQkFBRyxLQUFDLENBQUEsSUFBRCxDQUFBLEVBQUg7VUFBQSxFQUFBO1FBQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFqQjtPQUFwQyxDQUFBLENBQUE7YUFDQSxJQUFDLENBQUEsV0FBRCxHQUFtQixJQUFBLFdBQUEsQ0FBWSxLQUFLLENBQUMsZ0JBQWxCLEVBRmI7SUFBQSxDQWJWO0FBQUEsSUFpQkEsVUFBQSxFQUFZLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxXQUFXLENBQUMsT0FBYixDQUFBLEVBRFE7SUFBQSxDQWpCWjtBQUFBLElBb0JBLElBQUEsRUFBTSxTQUFBLEdBQUE7QUFDRixVQUFBLGNBQUE7QUFBQSxNQUFBLFFBQUEsR0FBVyxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxPQUE5QixDQUFBLENBQVgsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFXLElBQUEsSUFBQSxDQUFLLElBQUMsQ0FBQSxNQUFELENBQUEsQ0FBTCxDQURYLENBQUE7YUFFQSxJQUFJLENBQUMsV0FBTCxDQUFpQixRQUFqQixFQUhFO0lBQUEsQ0FwQk47QUFBQSxJQXlCQSxTQUFBLEVBQVcsU0FBQSxHQUFBO2FBQ1A7QUFBQSxRQUFBLGdCQUFBLEVBQWtCLElBQUMsQ0FBQSxXQUFXLENBQUMsU0FBYixDQUFBLENBQWxCO1FBRE87SUFBQSxDQXpCWDtHQUpKLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-css-comb/lib/css-comb.coffee