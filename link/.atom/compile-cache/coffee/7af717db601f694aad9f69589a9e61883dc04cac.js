(function() {
  var $, Debug, EditorView, Emitter, MinimapEditorView, ScrollView, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  _ref = require('atom'), EditorView = _ref.EditorView, ScrollView = _ref.ScrollView, $ = _ref.$;

  Emitter = require('emissary').Emitter;

  Debug = require('prolix');

  module.exports = MinimapEditorView = (function(_super) {
    __extends(MinimapEditorView, _super);

    Emitter.includeInto(MinimapEditorView);

    Debug('minimap').includeInto(MinimapEditorView);

    MinimapEditorView.content = function() {
      return this.div({
        "class": 'minimap-editor editor editor-colors'
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": 'scroll-view',
            outlet: 'scrollView'
          }, function() {
            return _this.div({
              "class": 'lines',
              outlet: 'lines'
            });
          });
        };
      })(this));
    };

    MinimapEditorView.prototype.frameRequested = false;

    MinimapEditorView.prototype.dummyNode = document.createElement('div');

    function MinimapEditorView() {
      this.update = __bind(this.update, this);
      this.registerBufferChanges = __bind(this.registerBufferChanges, this);
      MinimapEditorView.__super__.constructor.apply(this, arguments);
      this.pendingChanges = [];
      this.lineClasses = {};
    }

    MinimapEditorView.prototype.initialize = function() {
      this.lineOverdraw = atom.config.get('minimap.lineOverdraw');
      atom.config.observe('minimap.lineOverdraw', (function(_this) {
        return function() {
          return _this.lineOverdraw = atom.config.get('minimap.lineOverdraw');
        };
      })(this));
      this.lines.css('line-height', atom.config.get('editor.lineHeight') + 'em');
      return atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          return _this.lines.css('line-height', atom.config.get('editor.lineHeight') + 'em');
        };
      })(this));
    };

    MinimapEditorView.prototype.destroy = function() {
      this.unsubscribe();
      return this.editorView = null;
    };

    MinimapEditorView.prototype.setEditorView = function(editorView) {
      this.editorView = editorView;
      this.editor = this.editorView.getModel();
      this.buffer = this.editorView.getEditor().buffer;
      return this.subscribe(this.editor, 'screen-lines-changed.minimap', (function(_this) {
        return function(changes) {
          _this.pendingChanges.push(changes);
          return _this.requestUpdate();
        };
      })(this));
    };

    MinimapEditorView.prototype.requestUpdate = function() {
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return setImmediate((function(_this) {
        return function() {
          _this.startBench();
          _this.update();
          _this.endBench('minimpap update');
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapEditorView.prototype.scrollTop = function(scrollTop, options) {
      if (options == null) {
        options = {};
      }
      if (scrollTop == null) {
        return this.cachedScrollTop || 0;
      }
      if (scrollTop === this.cachedScrollTop) {
        return;
      }
      this.cachedScrollTop = scrollTop;
      return this.requestUpdate();
    };

    MinimapEditorView.prototype.addLineClass = function(line, cls) {
      var index, _base, _ref1;
      (_base = this.lineClasses)[line] || (_base[line] = []);
      this.lineClasses[line].push(cls);
      if ((this.firstRenderedScreenRow != null) && line >= this.firstRenderedScreenRow && line <= this.lastRenderedScreenRow) {
        index = line - this.firstRenderedScreenRow - 1;
        return (_ref1 = this.lines.children()[index]) != null ? _ref1.classList.add(cls) : void 0;
      }
    };

    MinimapEditorView.prototype.removeLineClass = function(line, cls) {
      var index, _ref1;
      if (this.lineClasses[line] && (index = this.lineClasses[line].indexOf(cls)) !== -1) {
        this.lineClasses[line].splice(index, 1);
      }
      if ((this.firstRenderedScreenRow != null) && line >= this.firstRenderedScreenRow && line <= this.lastRenderedScreenRow) {
        index = line - this.firstRenderedScreenRow - 1;
        return (_ref1 = this.lines.children()[index]) != null ? _ref1.classList.remove(cls) : void 0;
      }
    };

    MinimapEditorView.prototype.removeAllLineClasses = function() {
      var classes, classesToRemove, cls, k, _i, _len, _ref1;
      classesToRemove = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _ref1 = this.lineClasses;
      for (k in _ref1) {
        classes = _ref1[k];
        for (_i = 0, _len = classes.length; _i < _len; _i++) {
          cls = classes[_i];
          if (classesToRemove.length === 0 || __indexOf.call(classesToRemove, cls) >= 0) {
            this.find("." + cls).removeClass(cls);
          }
        }
      }
      return this.lineClasses = {};
    };

    MinimapEditorView.prototype.registerBufferChanges = function(event) {
      return this.pendingChanges.push(event);
    };

    MinimapEditorView.prototype.getMinimapHeight = function() {
      return this.getLinesCount() * this.getLineHeight();
    };

    MinimapEditorView.prototype.getLineHeight = function() {
      return this.lineHeight || (this.lineHeight = parseInt(this.editorView.css('line-height')));
    };

    MinimapEditorView.prototype.getLinesCount = function() {
      return this.editorView.getEditor().getScreenLineCount();
    };

    MinimapEditorView.prototype.getMinimapScreenHeight = function() {
      return this.minimapView.height() / this.minimapView.scaleY;
    };

    MinimapEditorView.prototype.getMinimapHeightInLines = function() {
      return Math.ceil(this.getMinimapScreenHeight() / this.getLineHeight());
    };

    MinimapEditorView.prototype.getFirstVisibleScreenRow = function() {
      var screenRow;
      screenRow = Math.floor(this.scrollTop() / this.getLineHeight());
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapEditorView.prototype.getLastVisibleScreenRow = function() {
      var calculatedRow, screenRow;
      calculatedRow = Math.ceil((this.scrollTop() + this.getMinimapScreenHeight()) / this.getLineHeight()) - 1;
      screenRow = Math.max(0, Math.min(this.editor.getScreenLineCount() - 1, calculatedRow));
      if (isNaN(screenRow)) {
        screenRow = 0;
      }
      return screenRow;
    };

    MinimapEditorView.prototype.update = function() {
      var changes, firstVisibleScreenRow, has_no_changes, intactRanges, lastScreenRow, lastScreenRowToRender, renderFrom, renderTo;
      if (this.editorView == null) {
        return;
      }
      firstVisibleScreenRow = this.getFirstVisibleScreenRow();
      lastScreenRowToRender = firstVisibleScreenRow + this.getMinimapHeightInLines() - 1;
      lastScreenRow = this.editor.getLastScreenRow();
      this.lines.css({
        fontSize: "" + (this.editorView.getFontSize()) + "px"
      });
      if ((this.firstRenderedScreenRow != null) && firstVisibleScreenRow >= this.firstRenderedScreenRow && lastScreenRowToRender <= this.lastRenderedScreenRow) {
        renderFrom = Math.min(lastScreenRow, this.firstRenderedScreenRow);
        renderTo = Math.min(lastScreenRow, this.lastRenderedScreenRow);
      } else {
        renderFrom = Math.min(lastScreenRow, Math.max(0, firstVisibleScreenRow - this.lineOverdraw));
        renderTo = Math.min(lastScreenRow, lastScreenRowToRender + this.lineOverdraw);
      }
      has_no_changes = this.pendingChanges.length === 0 && this.firstRenderedScreenRow && this.firstRenderedScreenRow <= renderFrom && renderTo <= this.lastRenderedScreenRow;
      if (has_no_changes) {
        return;
      }
      changes = this.pendingChanges;
      intactRanges = this.computeIntactRanges(renderFrom, renderTo);
      this.clearDirtyRanges(intactRanges);
      this.fillDirtyRanges(intactRanges, renderFrom, renderTo);
      this.firstRenderedScreenRow = renderFrom;
      this.lastRenderedScreenRow = renderTo;
      this.updatePaddingOfRenderedLines();
      return this.emit('minimap:updated');
    };

    MinimapEditorView.prototype.computeIntactRanges = function(renderFrom, renderTo) {
      var change, changes, emptyLineChanges, intactRanges, newIntactRanges, range, _i, _j, _k, _len, _len1, _len2, _ref1, _ref2, _ref3;
      if ((this.firstRenderedScreenRow == null) && (this.lastRenderedScreenRow == null)) {
        return [];
      }
      intactRanges = [
        {
          start: this.firstRenderedScreenRow,
          end: this.lastRenderedScreenRow,
          domStart: 0
        }
      ];
      if (this.editorView.showIndentGuide) {
        emptyLineChanges = [];
        _ref1 = this.pendingChanges;
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          change = _ref1[_i];
          changes = this.computeSurroundingEmptyLineChanges(change);
          emptyLineChanges.push.apply(emptyLineChanges, changes);
        }
        (_ref2 = this.pendingChanges).push.apply(_ref2, emptyLineChanges);
      }
      _ref3 = this.pendingChanges;
      for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
        change = _ref3[_j];
        newIntactRanges = [];
        for (_k = 0, _len2 = intactRanges.length; _k < _len2; _k++) {
          range = intactRanges[_k];
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
        }
        intactRanges = newIntactRanges;
      }
      this.truncateIntactRanges(intactRanges, renderFrom, renderTo);
      this.pendingChanges = [];
      return intactRanges;
    };

    MinimapEditorView.prototype.truncateIntactRanges = function(intactRanges, renderFrom, renderTo) {
      var i, range;
      i = 0;
      while (i < intactRanges.length) {
        range = intactRanges[i];
        if (range.start < renderFrom) {
          range.domStart += renderFrom - range.start;
          range.start = renderFrom;
        }
        if (range.end > renderTo) {
          range.end = renderTo;
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

    MinimapEditorView.prototype.computeSurroundingEmptyLineChanges = function(change) {
      var afterEnd, afterStart, beforeEnd, beforeStart, emptyLineChanges;
      emptyLineChanges = [];
      if (change.bufferDelta != null) {
        afterStart = change.end + change.bufferDelta + 1;
        if (this.editor.lineForBufferRow(afterStart) === '') {
          afterEnd = afterStart;
          while (this.editor.lineForBufferRow(afterEnd + 1) === '') {
            afterEnd++;
          }
          emptyLineChanges.push({
            start: afterStart,
            end: afterEnd,
            screenDelta: 0
          });
        }
        beforeEnd = change.start - 1;
        if (this.editor.lineForBufferRow(beforeEnd) === '') {
          beforeStart = beforeEnd;
          while (this.editor.lineForBufferRow(beforeStart - 1) === '') {
            beforeStart--;
          }
          emptyLineChanges.push({
            start: beforeStart,
            end: beforeEnd,
            screenDelta: 0
          });
        }
      }
      return emptyLineChanges;
    };

    MinimapEditorView.prototype.clearDirtyRanges = function(intactRanges) {
      var currentLine, domPosition, i, intactRange, _i, _j, _len, _ref1, _ref2, _results;
      if (intactRanges.length === 0) {
        return this.lines[0].innerHTML = '';
      } else if (currentLine = this.lines[0].firstChild) {
        domPosition = 0;
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intactRange = intactRanges[_i];
          while (intactRange.domStart > domPosition) {
            currentLine = this.clearLine(currentLine);
            domPosition++;
          }
          for (i = _j = _ref1 = intactRange.start, _ref2 = intactRange.end; _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = _ref1 <= _ref2 ? ++_j : --_j) {
            currentLine = currentLine.nextSibling;
            domPosition++;
          }
        }
        _results = [];
        while (currentLine) {
          _results.push(currentLine = this.clearLine(currentLine));
        }
        return _results;
      }
    };

    MinimapEditorView.prototype.clearLine = function(lineElement) {
      var next;
      next = lineElement.nextSibling;
      this.lines[0].removeChild(lineElement);
      return next;
    };

    MinimapEditorView.prototype.fillDirtyRanges = function(intactRanges, renderFrom, renderTo) {
      var classes, currentLine, dirtyRangeEnd, html, i, line, lineElement, lines, linesComponent, nextIntact, row, screenRow, _base, _results;
      i = 0;
      nextIntact = intactRanges[i];
      currentLine = this.lines[0].firstChild;
      row = renderFrom;
      _results = [];
      while (row <= renderTo) {
        if (row === (nextIntact != null ? nextIntact.end : void 0) + 1) {
          nextIntact = intactRanges[++i];
        }
        if (!nextIntact || row < nextIntact.start) {
          if (nextIntact) {
            dirtyRangeEnd = nextIntact.start - 1;
          } else {
            dirtyRangeEnd = renderTo;
          }
          if (this.editorView instanceof EditorView) {
            _results.push((function() {
              var _i, _len, _ref1, _ref2, _results1;
              _ref1 = this.editorView.buildLineElementsForScreenRows(row, dirtyRangeEnd);
              _results1 = [];
              for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                lineElement = _ref1[_i];
                classes = this.lineClasses[row + 1];
                if (classes != null) {
                  if (lineElement != null) {
                    (_ref2 = lineElement.classList).add.apply(_ref2, classes);
                  }
                }
                this.lines[0].insertBefore(lineElement, currentLine);
                _results1.push(row++);
              }
              return _results1;
            }).call(this));
          } else {
            linesComponent = this.editorView.component.refs.lines;
            lines = this.editor.linesForScreenRows(row, dirtyRangeEnd);
            (_base = linesComponent.props).lineDecorations || (_base.lineDecorations = {});
            _results.push((function() {
              var _i, _len, _ref1, _results1;
              _results1 = [];
              for (i = _i = 0, _len = lines.length; _i < _len; i = ++_i) {
                line = lines[i];
                screenRow = row + i;
                html = linesComponent.buildLineHTML(line, screenRow);
                this.dummyNode.innerHTML = html;
                lineElement = this.dummyNode.childNodes[0];
                classes = this.lineClasses[row + 1];
                if (classes != null) {
                  if (lineElement != null) {
                    (_ref1 = lineElement.classList).add.apply(_ref1, classes);
                  }
                }
                if (lineElement != null) {
                  lineElement.style.cssText = "";
                }
                this.lines[0].insertBefore(lineElement, currentLine);
                _results1.push(row++);
              }
              return _results1;
            }).call(this));
          }
        } else {
          currentLine = currentLine != null ? currentLine.nextSibling : void 0;
          _results.push(row++);
        }
      }
      return _results;
    };

    MinimapEditorView.prototype.updatePaddingOfRenderedLines = function() {
      var paddingBottom, paddingTop;
      paddingTop = this.firstRenderedScreenRow * this.lineHeight;
      this.lines.css('padding-top', paddingTop);
      paddingBottom = (this.editor.getLastScreenRow() - this.lastRenderedScreenRow) * this.lineHeight;
      return this.lines.css('padding-bottom', paddingBottom);
    };

    MinimapEditorView.prototype.getClientRect = function() {
      var sv;
      sv = this.scrollView[0];
      return {
        width: sv.scrollWidth,
        height: sv.scrollHeight
      };
    };

    return MinimapEditorView;

  })(ScrollView);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBO0lBQUE7Ozs7eUpBQUE7O0FBQUEsRUFBQSxPQUE4QixPQUFBLENBQVEsTUFBUixDQUE5QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxrQkFBQSxVQUFiLEVBQXlCLFNBQUEsQ0FBekIsQ0FBQTs7QUFBQSxFQUNDLFVBQVcsT0FBQSxDQUFRLFVBQVIsRUFBWCxPQURELENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVIsQ0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7O0FBQUEsSUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixpQkFBcEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsS0FBQSxDQUFNLFNBQU4sQ0FBZ0IsQ0FBQyxXQUFqQixDQUE2QixpQkFBN0IsQ0FEQSxDQUFBOztBQUFBLElBR0EsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHFDQUFQO09BQUwsRUFBbUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakQsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGFBQVA7QUFBQSxZQUFzQixNQUFBLEVBQVEsWUFBOUI7V0FBTCxFQUFpRCxTQUFBLEdBQUE7bUJBQy9DLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxPQUFQO0FBQUEsY0FBZ0IsTUFBQSxFQUFRLE9BQXhCO2FBQUwsRUFEK0M7VUFBQSxDQUFqRCxFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5ELEVBRFE7SUFBQSxDQUhWLENBQUE7O0FB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-editor-view.coffee