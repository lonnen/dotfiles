(function() {
  var Comb, CssCombView, path;

  Comb = require('csscomb');

  CssCombView = require('./css-comb-view');

  path = require('path');

  module.exports = {
    cssCombView: null,
    config: function() {
      var configSet, cssCombPackage, error, optionsFilePath, projectPath;
      configSet = atom.config.get('css-comb.config');
      cssCombPackage = atom.packages.getLoadedPackage('atom-css-comb');
      projectPath = atom.project.getPaths()[0];
      if (configSet === 'project') {
        optionsFilePath = path.join(projectPath, '.csscomb.json');
      } else if (configSet === 'common') {
        optionsFilePath = path.join(cssCombPackage.path, 'configs', '.csscomb.json');
      }
      if (optionsFilePath) {
        try {
          return require(optionsFilePath);
        } catch (_error) {
          error = _error;
          return error;
        }
      } else {
        return configSet || 'yandex';
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
      var comb, config, filePath;
      filePath = atom.workspace.getActivePaneItem().getPath();
      config = this.config();
      if (config instanceof Error) {
        return atom.notifications.addError(config.message);
      } else {
        comb = new Comb(this.config());
        return comb.processPath(filePath).then(function() {
          return atom.notifications.addSuccess('Css combed!');
        });
      }
    },
    serialize: function() {
      return {
        cssCombViewState: this.cssCombView.serialize()
      };
    }
  };

}).call(this);
