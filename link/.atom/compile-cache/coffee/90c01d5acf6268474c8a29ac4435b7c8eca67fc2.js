(function() {
  var MinimapColorHighlight;

  MinimapColorHighlight = require('../lib/minimap-color-highlight');

  describe("MinimapColorHighlight", function() {
    var activationPromise;
    activationPromise = null;
    beforeEach(function() {
      atom.workspaceView = new WorkspaceView;
      return activationPromise = atom.packages.activatePackage('minimapColorHighlight');
    });
    return describe("when the minimap-color-highlight:toggle event is triggered", function() {
      return it("attaches and then detaches the view", function() {
        expect(atom.workspaceView.find('.minimap-color-highlight')).not.toExist();
        atom.workspaceView.trigger('minimap-color-highlight:toggle');
        waitsForPromise(function() {
          return activationPromise;
        });
        return runs(function() {
          expect(atom.workspaceView.find('.minimap-color-highlight')).toExist();
          atom.workspaceView.trigger('minimap-color-highlight:toggle');
          return expect(atom.workspaceView.find('.minimap-color-highlight')).not.toExist();
        });
      });
    });
  });

}).call(this);
