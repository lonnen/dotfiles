(function() {
  var Comb;

  Comb = require('csscomb');

  module.exports = {
    userSettings: function() {
      var cssCombPackage, userConfig;
      userConfig = atom.config.get('css-comb.userConfig');
      cssCombPackage = atom.packages.getLoadedPackage('atom-css-comb');
      if (!userConfig) {
        atom.config.set('css-comb.userConfig', true);
      }
      return atom.workspace.open(cssCombPackage.path + '/configs/.csscomb.json');
    },
    config: function() {
      var configSet, cssCombPackage, userConfig;
      configSet = atom.config.get('css-comb.config');
      userConfig = atom.config.get('css-comb.userConfig');
      cssCombPackage = atom.packages.getLoadedPackage('atom-css-comb');
      if (configSet) {
        return configSet;
      } else if (userConfig) {
        return require(cssCombPackage.path + '/configs/.csscomb.json');
      } else {
        return 'yandex';
      }
    },
    activate: function() {
      atom.workspaceView.command("css-comb:comb", (function(_this) {
        return function() {
          return _this.comb();
        };
      })(this));
      return atom.workspaceView.command("css-comb:userSettings", (function(_this) {
        return function() {
          return _this.userSettings();
        };
      })(this));
    },
    comb: function() {
      var comb, filePath;
      filePath = atom.workspace.activePaneItem.getPath();
      comb = new Comb(this.config());
      return comb.processPath(filePath);
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLElBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FBUCxDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDSTtBQUFBLElBQUEsWUFBQSxFQUFjLFNBQUEsR0FBQTtBQUNWLFVBQUEsMEJBQUE7QUFBQSxNQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBQWIsQ0FBQTtBQUFBLE1BQ0EsY0FBQSxHQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGVBQS9CLENBRGpCLENBQUE7QUFHQSxNQUFBLElBQUcsQ0FBQSxVQUFIO0FBQ0ksUUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLEVBQXVDLElBQXZDLENBQUEsQ0FESjtPQUhBO2FBTUEsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFmLENBQW9CLGNBQWMsQ0FBQyxJQUFmLEdBQXNCLHdCQUExQyxFQVBVO0lBQUEsQ0FBZDtBQUFBLElBU0EsTUFBQSxFQUFRLFNBQUEsR0FBQTtBQUNKLFVBQUEscUNBQUE7QUFBQSxNQUFBLFNBQUEsR0FBWSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLENBQVosQ0FBQTtBQUFBLE1BQ0EsVUFBQSxHQUFhLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixxQkFBaEIsQ0FEYixDQUFBO0FBQUEsTUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsZUFBL0IsQ0FGakIsQ0FBQTtBQUlBLE1BQUEsSUFBRyxTQUFIO2VBQ0ksVUFESjtPQUFBLE1BRUssSUFBRyxVQUFIO2VBQ0QsT0FBQSxDQUFRLGNBQWMsQ0FBQyxJQUFmLEdBQXNCLHdCQUE5QixFQURDO09BQUEsTUFBQTtlQUdELFNBSEM7T0FQRDtJQUFBLENBVFI7QUFBQSxJQXFCQSxRQUFBLEVBQVUsU0FBQSxHQUFBO0FBQ04sTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLGVBQTNCLEVBQTRDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLElBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUMsQ0FBQSxDQUFBO2FBQ0EsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQix1QkFBM0IsRUFBb0QsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFBRyxLQUFDLENBQUEsWUFBRCxDQUFBLEVBQUg7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRCxFQUZNO0lBQUEsQ0FyQlY7QUFBQSxJQXlCQSxJQUFBLEVBQU0sU0FBQSxHQUFBO0FBQ0YsVUFBQSxjQUFBO0FBQUEsTUFBQSxRQUFBLEdBQVcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsT0FBOUIsQ0FBQSxDQUFYLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBVyxJQUFBLElBQUEsQ0FBSyxJQUFDLENBQUEsTUFBRCxDQUFBLENBQUwsQ0FEWCxDQUFBO2FBRUEsSUFBSSxDQUFDLFdBQUwsQ0FBaUIsUUFBakIsRUFIRTtJQUFBLENBekJOO0dBSEosQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-css-comb/lib/css-comb.coffee