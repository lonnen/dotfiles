(function() {
  var $, CompositeDisposable, DecorationManagement, Delegato, Disposable, Emitter, MinimapRenderView, ScrollView, TextEditorView, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), TextEditorView = _ref.TextEditorView, ScrollView = _ref.ScrollView, $ = _ref.$;

  Emitter = require('emissary').Emitter;

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Disposable = _ref1.Disposable;

  Delegato = require('delegato');

  DecorationManagement = require('./mixins/decoration-management');

  module.exports = MinimapRenderView = (function(_super) {
    __extends(MinimapRenderView, _super);

    Emitter.includeInto(MinimapRenderView);

    Delegato.includeInto(MinimapRenderView);

    DecorationManagement.includeInto(MinimapRenderView);

    MinimapRenderView.delegatesMethods('getMarker', 'findMarkers', {
      toProperty: 'editor'
    });

    MinimapRenderView.content = function() {
      return this.div({
        "class": 'minimap-editor editor editor-colors'
      }, (function(_this) {
        return function() {
          return _this.tag('canvas', {
            outlet: 'lineCanvas',
            "class": 'minimap-canvas',
            id: 'line-canvas'
          });
        };
      })(this));
    };

    MinimapRenderView.prototype.frameRequested = false;


    /* Public */

    function MinimapRenderView() {
      this.update = __bind(this.update, this);
      this.subscriptions = new CompositeDisposable;
      MinimapRenderView.__super__.constructor.apply(this, arguments);
      this.pendingChanges = [];
      this.context = this.lineCanvas[0].getContext('2d');
      this.tokenColorCache = {};
      this.decorationColorCache = {};
      this.initializeDecorations();
      this.tokenized = false;
      this.offscreenCanvas = document.createElement('canvas');
      this.offscreenCtxt = this.offscreenCanvas.getContext('2d');
    }

    MinimapRenderView.prototype.initialize = function() {
      this.lineCanvas.webkitImageSmoothingEnabled = false;
      this.interline = atom.config.get('minimap.interline');
      this.charWidth = atom.config.get('minimap.charWidth');
      this.charHeight = atom.config.get('minimap.charHeight');
      this.textOpacity = atom.config.get('minimap.textOpacity');
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.interline', (function(_this) {
        return function(interline) {
          _this.interline = interline;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.charWidth', (function(_this) {
        return function(charWidth) {
          _this.charWidth = charWidth;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.charHeight', (function(_this) {
        return function(charHeight) {
          _this.charHeight = charHeight;
          _this.emit('minimap:scaleChanged');
          return _this.forceUpdate();
        };
      })(this))));
      return this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.textOpacity', (function(_this) {
        return function(textOpacity) {
          _this.textOpacity = textOpacity;
          return _this.forceUpdate();
        };
      })(this))));
    };

    MinimapRenderView.prototype.destroy = function() {
      this.unsubscribe();
      this.subscriptions.dispose();
      return this.editorView = null;
    };

    MinimapRenderView.prototype.setEditorView = function(editorView) {
      this.editorView = editorView;
      this.editor = this.editorView.getModel();
      this.buffer = this.editorView.getEditor().getBuffer();
      this.displayBuffer = this.editor.displayBuffer;
      if (this.editor.onDidChangeScreenLines != null) {
        this.subscriptions.add(this.editor.onDidChangeScreenLines((function(_this) {
          return function(changes) {
            return _this.stackChanges(changes);
          };
        })(this)));
      } else {
        this.subscriptions.add(this.editor.onDidChange((function(_this) {
          return function(changes) {
            return _this.stackChanges(changes);
          };
        })(this)));
      }
      this.subscriptions.add(this.displayBuffer.onDidTokenize((function(_this) {
        return function() {
          _this.tokenized = true;
          return _this.forceUpdate();
        };
      })(this)));
      if (this.displayBuffer.tokenizedBuffer.fullyTokenized) {
        return this.tokenized = true;
      }
    };

    MinimapRenderView.prototype.update = function() {
      var firstRow, hasChanges, intact, intactRanges, lastRow, _i, _len;
      if (this.editorView == null) {
        return;
      }
      this.lineCanvas[0].width = this.lineCanvas[0].offsetWidth * devicePixelRatio;
      this.lineCanvas[0].height = this.lineCanvas[0].offsetHeight * devicePixelRatio;
      hasChanges = this.pendingChanges.length > 0;
      firstRow = this.getFirstVisibleScreenRow();
      lastRow = this.getLastVisibleScreenRow();
      intactRanges = this.computeIntactRanges(firstRow, lastRow);
      if (intactRanges.length === 0) {
        this.drawLines(this.context, firstRow, lastRow, 0);
      } else {
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intact = intactRanges[_i];
          this.copyBitmapPart(this.context, this.offscreenCanvas, intact.domStart, intact.start - firstRow, intact.end - intact.start);
        }
        this.fillGapsBetweenIntactRanges(this.context, intactRanges, firstRow, lastRow);
      }
      this.offscreenCanvas.width = this.lineCanvas[0].width;
      this.offscreenCanvas.height = this.lineCanvas[0].height;
      this.offscreenCtxt.drawImage(this.lineCanvas[0], 0, 0);
      this.offscreenFirstRow = firstRow;
      this.offscreenLastRow = lastRow;
      if (hasChanges) {
        return this.emit('minimap:updated');
      }
    };

    MinimapRenderView.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.update();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapRenderView.prototype.forceUpdate = function() {
      this.tokenColorCache = {};
      this.decorationColorCache = {};
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapRenderView.prototype.stackChanges = function(changes) {
      this.pendingChanges.push(changes);
      return this.requestUpdate();
    };

    MinimapRenderView.prototype.scrollTop = function(scrollTop) {
      if (scrollTop == null) {
        return this.cachedScrollTop || 0;
      }
      if (scrollTop === this.cachedScrollTop) {
        return;
      }
      this.cachedScrollTop = scrollTop;
      return this.update();
    };

    MinimapRenderView.prototype.getMinimapHeight = function() {
      return this.getLinesCount() * this.getLineHeight();
    };

    MinimapRenderView.prototype.getLineHeight = function() {
      return this.charHeight + this.interline;
    };

    MinimapRenderView.prototype.getCharHeight = function() {
      return this.charHeight;
    };

    MinimapRenderView.prototype.getCharWidth = function() {
      return this.charWidth;
    };

    MinimapRenderView.prototype.getTextOpacity = function() {
      return this.textOpacity;
    };

    MinimapRenderView.prototype.getLinesCount = function() {
      return this.editor.getScreenLineCount();
    };

    MinimapRenderView.prototype.getMinimapScreenHeight = function() {
      return this.minimapView.height();
    };

    MinimapRenderView.prototype.getMinimapHeightInLines = function() {
      return Math.ceil(this.getMinimapScreenHeight() / this.getLineHeight());
    };

    MinimapRenderView.prototype.getFirstVisibleScreenRow = function() {
      var screenRow;
      screenRow = Math.floor(this.scrollTop() / this.getLineHeight());
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapRenderView.prototype.getLastVisibleScreenRow = function() {
      var calculatedRow, screenRow;
      calculatedRow = Math.ceil((this.scrollTop() + this.getMinimapScreenHeight()) / this.getLineHeight()) - 1;
      screenRow = Math.max(0, Math.min(this.editor.getScreenLineCount() - 1, calculatedRow));
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapRenderView.prototype.getClientRect = function() {
      var canvas;
      canvas = this.lineCanvas[0];
      return {
        width: canvas.scrollWidth,
        height: this.getMinimapHeight()
      };
    };

    MinimapRenderView.prototype.pixelPositionForScreenPosition = function(position) {
      var actualRow, column, row, _ref2;
      _ref2 = this.buffer.constructor.Point.fromObject(position), row = _ref2.row, column = _ref2.column;
      actualRow = Math.floor(row);
      return {
        top: row * this.getLineHeight() * devicePixelRatio,
        left: column * devicePixelRatio
      };
    };

    MinimapRenderView.prototype.getDefaultColor = function() {
      return this.transparentize(this.minimapView.editorView.css('color'), this.getTextOpacity());
    };

    MinimapRenderView.prototype.getTokenColor = function(token) {
      var color, flatScopes;
      flatScopes = (token.scopeDescriptor || token.scopes).join();
      if (!(flatScopes in this.tokenColorCache)) {
        color = this.retrieveTokenColorFromDom(token);
        this.tokenColorCache[flatScopes] = color;
      }
      return this.tokenColorCache[flatScopes];
    };

    MinimapRenderView.prototype.getDecorationColor = function(decoration) {
      var color, properties;
      properties = decoration.getProperties();
      if (properties.color != null) {
        return properties.color;
      }
      if (!(properties.scope in this.decorationColorCache)) {
        color = this.retrieveDecorationColorFromDom(decoration);
        this.decorationColorCache[properties.scope] = color;
      }
      return this.decorationColorCache[properties.scope];
    };

    MinimapRenderView.prototype.retrieveTokenColorFromDom = function(token) {
      var color, scopes;
      scopes = token.scopeDescriptor || token.scopes;
      color = this.retrieveStyleFromDom(scopes, 'color');
      return this.transparentize(color, this.getTextOpacity());
    };

    MinimapRenderView.prototype.retrieveDecorationColorFromDom = function(decoration) {
      return this.retrieveStyleFromDom(decoration.getProperties().scope.split(/\s+/), 'background-color');
    };

    MinimapRenderView.prototype.retrieveStyleFromDom = function(scopes, property) {
      var node, parent, scope, value, _i, _len;
      this.ensureDummyNodeExistence();
      parent = this.dummyNode;
      for (_i = 0, _len = scopes.length; _i < _len; _i++) {
        scope = scopes[_i];
        node = document.createElement('span');
        node.className = scope.replace(/\.+/g, ' ');
        if (parent != null) {
          parent.appendChild(node);
        }
        parent = node;
      }
      value = getComputedStyle(parent).getPropertyValue(property);
      this.dummyNode.innerHTML = '';
      return value;
    };

    MinimapRenderView.prototype.ensureDummyNodeExistence = function() {
      if (this.dummyNode == null) {
        this.dummyNode = document.createElement('span');
        this.dummyNode.style.visibility = 'hidden';
        return this.editorView.append(this.dummyNode);
      }
    };

    MinimapRenderView.prototype.transparentize = function(color, opacity) {
      if (opacity == null) {
        opacity = 1;
      }
      return color.replace('rgb(', 'rgba(').replace(')', ", " + opacity + ")");
    };

    MinimapRenderView.prototype.drawLines = function(context, firstRow, lastRow, offsetRow) {
      var canvasWidth, charHeight, charWidth, color, decoration, decorations, displayCodeHighlights, highlightDecorations, line, lineDecorations, lineHeight, lines, re, row, screenRow, token, value, w, x, y, y0, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref2;
      if (firstRow > lastRow) {
        return;
      }
      lines = this.editor.tokenizedLinesForScreenRows(firstRow, lastRow);
      lineHeight = this.getLineHeight() * devicePixelRatio;
      charHeight = this.getCharHeight() * devicePixelRatio;
      charWidth = this.getCharWidth() * devicePixelRatio;
      canvasWidth = this.lineCanvas.width() * devicePixelRatio;
      displayCodeHighlights = this.minimapView.displayCodeHighlights;
      decorations = this.decorationsForScreenRowRange(firstRow, lastRow);
      line = lines[0];
      if (line.invisibles != null) {
        re = RegExp("" + line.invisibles.cr + "|" + line.invisibles.eol + "|" + line.invisibles.space + "|" + line.invisibles.tab, "g");
      }
      for (row = _i = 0, _len = lines.length; _i < _len; row = ++_i) {
        line = lines[row];
        x = 0;
        y = offsetRow + row;
        screenRow = firstRow + row;
        y0 = y * lineHeight;
        lineDecorations = this.decorationsByTypesForRow(screenRow, 'line', decorations);
        for (_j = 0, _len1 = lineDecorations.length; _j < _len1; _j++) {
          decoration = lineDecorations[_j];
          context.fillStyle = this.getDecorationColor(decoration);
          context.fillRect(0, y0, canvasWidth, lineHeight);
        }
        highlightDecorations = this.decorationsByTypesForRow(firstRow + row, 'highlight-under', decorations);
        for (_k = 0, _len2 = highlightDecorations.length; _k < _len2; _k++) {
          decoration = highlightDecorations[_k];
          this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
        }
        _ref2 = line.tokens;
        for (_l = 0, _len3 = _ref2.length; _l < _len3; _l++) {
          token = _ref2[_l];
          w = token.screenDelta;
          if (!token.isOnlyWhitespace()) {
            color = displayCodeHighlights && this.tokenized ? this.getTokenColor(token) : this.getDefaultColor();
            value = token.value;
            if (re != null) {
              value = value.replace(re, ' ');
            }
            x = this.drawToken(context, value, color, x, y0, charWidth, charHeight);
          } else {
            x += w * charWidth;
          }
        }
        highlightDecorations = this.decorationsByTypesForRow(firstRow + row, 'highlight', 'highlight-over', decorations);
        for (_m = 0, _len4 = highlightDecorations.length; _m < _len4; _m++) {
          decoration = highlightDecorations[_m];
          this.drawHighlightDecoration(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth);
        }
      }
      return context.fill();
    };

    MinimapRenderView.prototype.drawToken = function(context, text, color, x, y, charWidth, charHeight) {
      var char, chars, _i, _len;
      context.fillStyle = color;
      chars = 0;
      for (_i = 0, _len = text.length; _i < _len; _i++) {
        char = text[_i];
        if (/\s/.test(char)) {
          if (chars > 0) {
            context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
          }
          chars = 0;
        } else {
          chars++;
        }
        x += charWidth;
      }
      if (chars > 0) {
        context.fillRect(x - (chars * charWidth), y, chars * charWidth, charHeight);
      }
      return x;
    };

    MinimapRenderView.prototype.drawHighlightDecoration = function(context, decoration, y, screenRow, lineHeight, charWidth, canvasWidth) {
      var colSpan, range, rowSpan, x;
      context.fillStyle = this.getDecorationColor(decoration);
      range = decoration.getMarker().getScreenRange();
      rowSpan = range.end.row - range.start.row;
      if (rowSpan === 0) {
        colSpan = range.end.column - range.start.column;
        return context.fillRect(range.start.column * charWidth, y * lineHeight, colSpan * charWidth, lineHeight);
      } else {
        if (screenRow === range.start.row) {
          x = range.start.column * charWidth;
          return context.fillRect(x, y * lineHeight, canvasWidth - x, lineHeight);
        } else if (screenRow === range.end.row) {
          return context.fillRect(0, y * lineHeight, range.end.column * charWidth, lineHeight);
        } else {
          return context.fillRect(0, y * lineHeight, canvasWidth, lineHeight);
        }
      }
    };

    MinimapRenderView.prototype.copyBitmapPart = function(context, bitmapCanvas, srcRow, destRow, rowCount) {
      var lineHeight;
      lineHeight = this.getLineHeight() * devicePixelRatio;
      return context.drawImage(bitmapCanvas, 0, srcRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight, 0, destRow * lineHeight, bitmapCanvas.width, rowCount * lineHeight);
    };


    /* Internal */

    MinimapRenderView.prototype.fillGapsBetweenIntactRanges = function(context, intactRanges, firstRow, lastRow) {
      var currentRow, intact, _i, _len;
      currentRow = firstRow;
      for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
        intact = intactRanges[_i];
        this.drawLines(context, currentRow, intact.start - 1, currentRow - firstRow);
        currentRow = intact.end;
      }
      if (currentRow <= lastRow) {
        return this.drawLines(context, currentRow, lastRow, currentRow - firstRow);
      }
    };

    MinimapRenderView.prototype.computeIntactRanges = function(firstRow, lastRow) {
      var change, intactRange, intactRanges, newIntactRanges, range, _i, _j, _len, _len1, _ref2;
      if ((this.offscreenFirstRow == null) && (this.offscreenLastRow == null)) {
        return [];
      }
      intactRanges = [
        {
          start: this.offscreenFirstRow,
          end: this.offscreenLastRow,
          domStart: 0
        }
      ];
      _ref2 = this.pendingChanges;
      for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
        change = _ref2[_i];
        newIntactRanges = [];
        for (_j = 0, _len1 = intactRanges.length; _j < _len1; _j++) {
          range = intactRanges[_j];
          if (change.end < range.start && change.screenDelta !== 0) {
            newIntactRanges.push({
              start: range.start + change.screenDelta,
              end: range.end + change.screenDelta,
              domStart: range.domStart
            });
          } else if (change.end < range.start || change.start > range.end) {
            newIntactRanges.push(range);
          } else {
            if (change.start > range.start) {
              newIntactRanges.push({
                start: range.start,
                end: change.start - 1,
                domStart: range.domStart
              });
            }
            if (change.end < range.end) {
              newIntactRanges.push({
                start: change.end + change.screenDelta + 1,
                end: range.end + change.screenDelta,
                domStart: range.domStart + change.end + 1 - range.start
              });
            }
          }
          intactRange = newIntactRanges[newIntactRanges.length - 1];
          if ((intactRange != null) && (isNaN(intactRange.end) || isNaN(intactRange.start))) {
            debugger;
          }
        }
        intactRanges = newIntactRanges;
      }
      this.truncateIntactRanges(intactRanges, firstRow, lastRow);
      this.pendingChanges = [];
      return intactRanges;
    };

    MinimapRenderView.prototype.truncateIntactRanges = function(intactRanges, firstRow, lastRow) {
      var i, range;
      i = 0;
      while (i < intactRanges.length) {
        range = intactRanges[i];
        if (range.start < firstRow) {
          range.domStart += firstRow - range.start;
          range.start = firstRow;
        }
        if (range.end > lastRow) {
          range.end = lastRow;
        }
        if (range.start >= range.end) {
          intactRanges.splice(i--, 1);
        }
        i++;
      }
      return intactRanges.sort(function(a, b) {
        return a.domStart - b.domStart;
      });
    };

    MinimapRenderView.prototype.asDisposable = function(subscription) {
      return new Disposable(function() {
        return subscription.off();
      });
    };

    return MinimapRenderView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHVJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBa0MsT0FBQSxDQUFRLE1BQVIsQ0FBbEMsRUFBQyxzQkFBQSxjQUFELEVBQWlCLGtCQUFBLFVBQWpCLEVBQTZCLFNBQUEsQ0FBN0IsQ0FBQTs7QUFBQSxFQUNDLFVBQVcsT0FBQSxDQUFRLFVBQVIsRUFBWCxPQURELENBQUE7O0FBQUEsRUFFQSxRQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLDRCQUFBLG1CQUFELEVBQXNCLG1CQUFBLFVBRnRCLENBQUE7O0FBQUEsRUFHQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FIWCxDQUFBOztBQUFBLEVBSUEsb0JBQUEsR0FBdUIsT0FBQSxDQUFRLGdDQUFSLENBSnZCLENBQUE7O0FBQUEsRUFRQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osd0NBQUEsQ0FBQTs7QUFBQSxJQUFBLE9BQU8sQ0FBQyxXQUFSLENBQW9CLGlCQUFwQixDQUFBLENBQUE7O0FBQUEsSUFDQSxRQUFRLENBQUMsV0FBVCxDQUFxQixpQkFBckIsQ0FEQSxDQUFBOztBQUFBLElBRUEsb0JBQW9CLENBQUMsV0FBckIsQ0FBaUMsaUJBQWpDLENBRkEsQ0FBQTs7QUFBQSxJQUtBLGlCQUFDLENBQUEsZ0JBQUQsQ0FBa0IsV0FBbEIsRUFBK0IsYUFBL0IsRUFBOEM7QUFBQSxNQUFBLFVBQUEsRUFBWSxRQUFaO0tBQTlDLENBTEEsQ0FBQTs7QUFBQSxJQU9BLGlCQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxRQUFBLE9BQUEsRUFBTyxxQ0FBUDtPQUFMLEVBQW1ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7aUJBQ2pELEtB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-render-view.coffee