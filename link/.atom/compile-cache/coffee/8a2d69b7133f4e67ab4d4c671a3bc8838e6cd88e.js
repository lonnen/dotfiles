(function() {
  var CompositeDisposable, DecorationManagement, Emitter, Minimap, nextModelId, _ref;

  _ref = require('event-kit'), Emitter = _ref.Emitter, CompositeDisposable = _ref.CompositeDisposable;

  DecorationManagement = require('./mixins/decoration-management');

  nextModelId = 1;

  module.exports = Minimap = (function() {
    DecorationManagement.includeInto(Minimap);


    /* Public */

    function Minimap(options) {
      var subs;
      if (options == null) {
        options = {};
      }
      this.textEditor = options.textEditor;
      if (this.textEditor == null) {
        throw new Error('Cannot create a minimap without an editor');
      }
      this.id = nextModelId++;
      this.emitter = new Emitter;
      this.subscriptions = subs = new CompositeDisposable;
      this.initializeDecorations();
      subs.add(atom.config.observe('editor.scrollPastEnd', (function(_this) {
        return function(scrollPastEnd) {
          _this.scrollPastEnd = scrollPastEnd;
          return _this.emitter.emit('did-change-config', {
            config: 'editor.scrollPastEnd',
            value: _this.scrollPastEnd
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charHeight',
            value: _this.charHeight
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.charWidth',
            value: _this.charWidth
          });
        };
      })(this)));
      subs.add(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          return _this.emitter.emit('did-change-config', {
            config: 'minimap.interline',
            value: _this.interline
          });
        };
      })(this)));
      subs.add(this.textEditor.onDidChange((function(_this) {
        return function(changes) {
          return _this.emitChanges(changes);
        };
      })(this)));
      subs.add(this.textEditor.onDidChangeScrollTop((function(_this) {
        return function(scrollTop) {
          return _this.emitter.emit('did-change-scroll-top', scrollTop);
        };
      })(this)));
      subs.add(this.textEditor.onDidChangeScrollLeft((function(_this) {
        return function(scrollLeft) {
          return _this.emitter.emit('did-change-scroll-left', scrollLeft);
        };
      })(this)));
      subs.add(this.textEditor.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      subs.add(this.textEditor.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          return _this.emitter.emit('did-change-config');
        };
      })(this)));
    }

    Minimap.prototype.destroy = function() {
      this.subscriptions.dispose();
      this.textEditor = null;
      this.emitter.emit('did-destroy');
      return this.destroyed = true;
    };

    Minimap.prototype.isDestroyed = function() {
      return this.destroyed;
    };

    Minimap.prototype.onDidChange = function(callback) {
      return this.emitter.on('did-change', callback);
    };

    Minimap.prototype.onDidChangeConfig = function(callback) {
      return this.emitter.on('did-change-config', callback);
    };

    Minimap.prototype.onDidChangeScrollTop = function(callback) {
      return this.emitter.on('did-change-scroll-top', callback);
    };

    Minimap.prototype.onDidChangeScrollLeft = function(callback) {
      return this.emitter.on('did-change-scroll-left', callback);
    };

    Minimap.prototype.onDidDestroy = function(callback) {
      return this.emitter.on('did-destroy', callback);
    };

    Minimap.prototype.getTextEditor = function() {
      return this.textEditor;
    };

    Minimap.prototype.getTextEditorScaledHeight = function() {
      return this.textEditor.getHeight() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollTop = function() {
      return this.textEditor.getScrollTop() * this.getVerticalScaleFactor();
    };

    Minimap.prototype.getTextEditorScaledScrollLeft = function() {
      return this.textEditor.getScrollLeft() * this.getHorizontalScaleFactor();
    };

    Minimap.prototype.getTextEditorMaxScrollTop = function() {
      var lineHeight, maxScrollTop;
      maxScrollTop = this.textEditor.displayBuffer.getMaxScrollTop();
      lineHeight = this.textEditor.displayBuffer.getLineHeightInPixels();
      if (this.scrollPastEnd) {
        maxScrollTop -= this.textEditor.getHeight() - 3 * lineHeight;
      }
      return maxScrollTop;
    };

    Minimap.prototype.getTextEditorScrollRatio = function() {
      return this.textEditor.getScrollTop() / this.getTextEditorMaxScrollTop();
    };

    Minimap.prototype.getCapedTextEditorScrollRatio = function() {
      return Math.min(1, this.getTextEditorScrollRatio());
    };

    Minimap.prototype.getHeight = function() {
      return this.textEditor.getScreenLineCount() * this.getLineHeight();
    };

    Minimap.prototype.getVisibleHeight = function() {
      return Math.min(this.textEditor.getHeight(), this.getHeight());
    };

    Minimap.prototype.getVerticalScaleFactor = function() {
      return this.getLineHeight() / this.textEditor.getLineHeightInPixels();
    };

    Minimap.prototype.getHorizontalScaleFactor = function() {
      return this.getCharWidth() / this.textEditor.getDefaultCharWidth();
    };

    Minimap.prototype.getLineHeight = function() {
      return this.charHeight + this.interline;
    };

    Minimap.prototype.getCharWidth = function() {
      return this.charWidth;
    };

    Minimap.prototype.getCharHeight = function() {
      return this.charHeight;
    };

    Minimap.prototype.getInterline = function() {
      return this.interline;
    };

    Minimap.prototype.getFirstVisibleScreenRow = function() {
      return Math.floor(this.getScrollTop() / this.getLineHeight());
    };

    Minimap.prototype.getLastVisibleScreenRow = function() {
      return Math.ceil((this.getScrollTop() + this.textEditor.getHeight()) / this.getLineHeight());
    };

    Minimap.prototype.getScrollTop = function() {
      return Math.abs(this.getCapedTextEditorScrollRatio() * this.getMaxScrollTop());
    };

    Minimap.prototype.getMaxScrollTop = function() {
      return Math.max(0, this.getHeight() - this.textEditor.getHeight());
    };

    Minimap.prototype.canScroll = function() {
      return this.getMaxScrollTop() > 0;
    };

    Minimap.prototype.getMarker = function(id) {
      return this.textEditor.getMarker(id);
    };

    Minimap.prototype.findMarkers = function(o) {
      try {
        return this.textEditor.findMarkers(o);
      } catch (_error) {
        return [];
      }
    };

    Minimap.prototype.markBufferRange = function(range) {
      return this.textEditor.markBufferRange(range);
    };

    Minimap.prototype.emitChanges = function(changes) {
      return this.emitter.emit('did-change', changes);
    };

    return Minimap;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDhFQUFBOztBQUFBLEVBQUEsT0FBaUMsT0FBQSxDQUFRLFdBQVIsQ0FBakMsRUFBQyxlQUFBLE9BQUQsRUFBVSwyQkFBQSxtQkFBVixDQUFBOztBQUFBLEVBQ0Esb0JBQUEsR0FBdUIsT0FBQSxDQUFRLGdDQUFSLENBRHZCLENBQUE7O0FBQUEsRUFHQSxXQUFBLEdBQWMsQ0FIZCxDQUFBOztBQUFBLEVBV0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLElBQUEsb0JBQW9CLENBQUMsV0FBckIsQ0FBaUMsT0FBakMsQ0FBQSxDQUFBOztBQUVBO0FBQUEsZ0JBRkE7O0FBUWEsSUFBQSxpQkFBQyxPQUFELEdBQUE7QUFDWCxVQUFBLElBQUE7O1FBRFksVUFBUTtPQUNwQjtBQUFBLE1BQUMsSUFBQyxDQUFBLGFBQWMsUUFBZCxVQUFGLENBQUE7QUFDQSxNQUFBLElBQU8sdUJBQVA7QUFDRSxjQUFVLElBQUEsS0FBQSxDQUFNLDJDQUFOLENBQVYsQ0FERjtPQURBO0FBQUEsTUFJQSxJQUFDLENBQUEsRUFBRCxHQUFNLFdBQUEsRUFKTixDQUFBO0FBQUEsTUFLQSxJQUFDLENBQUEsT0FBRCxHQUFXLEdBQUEsQ0FBQSxPQUxYLENBQUE7QUFBQSxNQU1BLElBQUMsQ0FBQSxhQUFELEdBQWlCLElBQUEsR0FBTyxHQUFBLENBQUEsbUJBTnhCLENBQUE7QUFBQSxNQU9BLElBQUMsQ0FBQSxxQkFBRCxDQUFBLENBUEEsQ0FBQTtBQUFBLE1BU0EsSUFBSSxDQUFDLEdBQUwsQ0FBUyxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0Isc0JBQXBCLEVBQTRDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFFLGFBQUYsR0FBQTtBQUNuRCxVQURvRCxLQUFDLENBQUEsZ0JBQUEsYUFDckQsQ0FB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap.coffee