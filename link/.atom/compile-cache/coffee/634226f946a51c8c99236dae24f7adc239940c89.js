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
        return configSet || 'yandex';
      } else if (configSet === 'custom') {
        return require(cssCombPackage.path + '/configs/.csscomb.json');
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
      filePath = atom.workspace.getActivePaneItem().getPath();
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
