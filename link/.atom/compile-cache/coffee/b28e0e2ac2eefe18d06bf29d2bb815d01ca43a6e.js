(function() {
  var Comb, File;

  Comb = require('csscomb');

  File = require('pathwatcher').File;

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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLFVBQUE7O0FBQUEsRUFBQSxJQUFBLEdBQU8sT0FBQSxDQUFRLFNBQVIsQ0FBUCxDQUFBOztBQUFBLEVBQ0MsT0FBUSxPQUFBLENBQVEsYUFBUixFQUFSLElBREQsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ0k7QUFBQSxJQUFBLFlBQUEsRUFBYyxTQUFBLEdBQUE7QUFDVixVQUFBLDBCQUFBO0FBQUEsTUFBQSxVQUFBLEdBQWEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixDQUFiLENBQUE7QUFBQSxNQUNBLGNBQUEsR0FBaUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxnQkFBZCxDQUErQixlQUEvQixDQURqQixDQUFBO0FBR0EsTUFBQSxJQUFHLENBQUEsVUFBSDtBQUNJLFFBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLHFCQUFoQixFQUF1QyxJQUF2QyxDQUFBLENBREo7T0FIQTthQU1BLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBZixDQUFvQixjQUFjLENBQUMsSUFBZixHQUFzQix3QkFBMUMsRUFQVTtJQUFBLENBQWQ7QUFBQSxJQVNBLE1BQUEsRUFBUSxTQUFBLEdBQUE7QUFDSixVQUFBLHFDQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFaLENBQWdCLGlCQUFoQixDQUFaLENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IscUJBQWhCLENBRGIsQ0FBQTtBQUFBLE1BRUEsY0FBQSxHQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGVBQS9CLENBRmpCLENBQUE7QUFJQSxNQUFBLElBQUcsU0FBSDtlQUNJLFVBREo7T0FBQSxNQUVLLElBQUcsVUFBSDtlQUNELE9BQUEsQ0FBUSxjQUFjLENBQUMsSUFBZixHQUFzQix3QkFBOUIsRUFEQztPQUFBLE1BQUE7ZUFHRCxTQUhDO09BUEQ7SUFBQSxDQVRSO0FBQUEsSUFxQkEsUUFBQSxFQUFVLFNBQUEsR0FBQTtBQUNOLE1BQUEsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFuQixDQUEyQixlQUEzQixFQUE0QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxJQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTVDLENBQUEsQ0FBQTthQUNBLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBbkIsQ0FBMkIsdUJBQTNCLEVBQW9ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQUcsS0FBQyxDQUFBLFlBQUQsQ0FBQSxFQUFIO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBcEQsRUFGTTtJQUFBLENBckJWO0FBQUEsSUF5QkEsSUFBQSxFQUFNLFNBQUEsR0FBQTtBQUNGLFVBQUEsY0FBQTtBQUFBLE1BQUEsUUFBQSxHQUFXLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLE9BQTlCLENBQUEsQ0FBWCxDQUFBO0FBQUEsTUFDQSxJQUFBLEdBQVcsSUFBQSxJQUFBLENBQUssSUFBQyxDQUFBLE1BQUQsQ0FBQSxDQUFMLENBRFgsQ0FBQTthQUVBLElBQUksQ0FBQyxXQUFMLENBQWlCLFFBQWpCLEVBSEU7SUFBQSxDQXpCTjtHQUpKLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-css-comb/lib/css-comb.coffee