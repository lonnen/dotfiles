(function() {
  var MinimapColorHighlightView, WorkspaceView;

  MinimapColorHighlightView = require('../lib/minimap-color-highlight-view');

  WorkspaceView = require('atom').WorkspaceView;

  describe("MinimapColorHighlightView", function() {
    return it("has one valid test", function() {
      return expect("life").toBe("easy");
    });
  });

}).call(this);
