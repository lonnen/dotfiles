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
      atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          if (_this.editorView != null) {
            return _this.lines.css({
              lineHeight: "" + (_this.getLineHeight()) + "px"
            });
          }
        };
      })(this));
      return atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          if (_this.editorView != null) {
            return _this.lines.css({
              fontSize: "" + (_this.getFontSize()) + "px"
            });
          }
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
      this.lines.css({
        lineHeight: "" + (this.getLineHeight()) + "px",
        fontSize: "" + (this.getFontSize()) + "px"
      });
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
          _this.endBench('minimap update');
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
      return this.lineHeight || (this.lineHeight = parseInt(this.editorView.find('.lines').css('line-height')));
    };

    MinimapEditorView.prototype.getFontSize = function() {
      return this.fontSize || (this.fontSize = parseInt(this.editorView.find('.lines').css('font-size')));
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
        if (currentLine == null) {
          console.warn("Unexpected undefined first line in clearing dirty ranges");
          return;
        }
        domPosition = 0;
        for (_i = 0, _len = intactRanges.length; _i < _len; _i++) {
          intactRange = intactRanges[_i];
          while (intactRange.domStart > domPosition) {
            if (currentLine == null) {
              console.warn("Unexpected undefined line at dom position " + domPosition + " with range starting at position " + intactRange.domStart + " (" + intactRange.start + ".." + intactRange.end + ")");
              return;
            }
            currentLine = this.clearLine(currentLine);
            domPosition++;
          }
          for (i = _j = _ref1 = intactRange.start, _ref2 = intactRange.end; _ref1 <= _ref2 ? _j <= _ref2 : _j >= _ref2; i = _ref1 <= _ref2 ? ++_j : --_j) {
            if (currentLine == null) {
              console.warn("Unexpected undefined line when clearing dirty range " + intactRange.start + ".." + intactRange.end);
              return;
            }
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
      var classes, currentLine, dirtyRangeEnd, html, i, line, lineElement, lines, linesComponent, nextIntact, row, _base, _results;
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
                classes = this.classesForRow(row);
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
              for (_i = 0, _len = lines.length; _i < _len; _i++) {
                line = lines[_i];
                html = linesComponent.buildLineHTML(line, row);
                this.dummyNode.innerHTML = html;
                lineElement = this.dummyNode.childNodes[0];
                if (lineElement == null) {
                  console.warn("Unexpected undefined line element at screen row " + screenRow);
                  continue;
                }
                classes = this.classesForRow(row);
                lineElement.className = 'line';
                if (classes != null) {
                  (_ref1 = lineElement.classList).add.apply(_ref1, classes);
                }
                lineElement.style.cssText = "";
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

    MinimapEditorView.prototype.classesForRow = function(row) {
      return this.lineClasses[row + 1];
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtFQUFBO0lBQUE7Ozs7eUpBQUE7O0FBQUEsRUFBQSxPQUE4QixPQUFBLENBQVEsTUFBUixDQUE5QixFQUFDLGtCQUFBLFVBQUQsRUFBYSxrQkFBQSxVQUFiLEVBQXlCLFNBQUEsQ0FBekIsQ0FBQTs7QUFBQSxFQUNDLFVBQVcsT0FBQSxDQUFRLFVBQVIsRUFBWCxPQURELENBQUE7O0FBQUEsRUFFQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVIsQ0FGUixDQUFBOztBQUFBLEVBSUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLHdDQUFBLENBQUE7O0FBQUEsSUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixpQkFBcEIsQ0FBQSxDQUFBOztBQUFBLElBQ0EsS0FBQSxDQUFNLFNBQU4sQ0FBZ0IsQ0FBQyxXQUFqQixDQUE2QixpQkFBN0IsQ0FEQSxDQUFBOztBQUFBLElBR0EsaUJBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLHFDQUFQO09BQUwsRUFBbUQsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDakQsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGFBQVA7QUFBQSxZQUFzQixNQUFBLEVBQVEsWUFBOUI7V0FBTCxFQUFpRCxTQUFBLEdBQUE7bUJBQy9DLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxPQUFQO0FBQUEsY0FBZ0IsTUFBQSxFQUFRLE9BQXhCO2FBQUwsRUFEK0M7VUFBQSxDQUFqRCxFQURpRDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5ELEVBRFE7SUFBQSxDQUhWLENBQUE7O0FBQUEsZ0NBUUEsY0FBQSxHQUFnQixLQVJoQixDQUFBOztBQUFBLGdDQVNBLFNBQUEsR0FBVyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQVRYLENBQUE7O0FBV2EsSUFBQSwyQkFBQSxHQUFBO0FBQ1gsNkNBQUEsQ0FBQTtBQUFBLDJFQUFBLENBQUE7QUFBQSxNQUFBLG9EQUFBLFNBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixFQURsQixDQUFBO0FBQUEsTUFFQSxJQUFDLENBQUEsV0FBRCxHQUFlLEVBRmYsQ0FEVztJQUFBLENBWGI7O0FBQUEsZ0NBZ0JBLFVBQUEsR0FBWSxTQUFBLEdBQUE7QUFDVixNQUFBLElBQUMsQ0FBQSxZQUFELEdBQWdCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixzQkFBaEIsQ0FBaEIsQ0FBQTtBQUFBLE1BRUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLHNCQUFwQixFQUE0QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUMxQyxLQUFDLENBQUEsWUFBRCxHQUFnQixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0Isc0JBQWhCLEVBRDBCO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBNUMsQ0FGQSxDQUFBO0FBQUEsTUFLQSxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQVosQ0FBb0IsbUJBQXBCLEVBQXlDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkMsVUFBQSxJQUFHLHdCQUFIO21CQUNFLEtBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUFXO0FBQUEsY0FBQSxVQUFBLEVBQVksRUFBQSxHQUFFLENBQUEsS0FBQyxDQUFBLGFBQUQsQ0FBQSxDQUFBLENBQUYsR0FBb0IsSUFBaEM7YUFBWCxFQURGO1dBRHVDO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBekMsQ0FMQSxDQUFBO2FBU0EsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFaLENBQW9CLGlCQUFwQixFQUF1QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO0FBQ3JDLFVBQUEsSUFBRyx3QkFBSDttQkFDRSxLQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVztBQUFBLGNBQUEsUUFBQSxFQUFVLEVBQUEsR0FBRSxDQUFBLEtBQUMsQ0FBQSxXQUFELENBQUEsQ0FBQSxDQUFGLEdBQWtCLElBQTVCO2FBQVgsRUFERjtXQURxQztRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXZDLEVBVlU7SUFBQSxDQWhCWixDQUFBOztBQUFBLGdDQThCQSxPQUFBLEdBQVMsU0FBQSxHQUFBO0FBQ1AsTUFBQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUEsQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELEdBQWMsS0FGUDtJQUFBLENBOUJULENBQUE7O0FBQUEsZ0NBa0NBLGFBQUEsR0FBZSxTQUFFLFVBQUYsR0FBQTtBQUNiLE1BRGMsSUFBQyxDQUFBLGFBQUEsVUFDZixDQUFBO0FBQUEsTUFBQSxJQUFDLENBQUEsTUFBRCxHQUFVLElBQUMsQ0FBQSxVQUFVLENBQUMsUUFBWixDQUFBLENBQVYsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLE1BQUQsR0FBVSxJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVosQ0FBQSxDQUF1QixDQUFDLE1BRGxDLENBQUE7QUFBQSxNQUdBLElBQUMsQ0FBQSxLQUFLLENBQUMsR0FBUCxDQUNFO0FBQUEsUUFBQSxVQUFBLEVBQVksRUFBQSxHQUFFLENBQUEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUFBLENBQUYsR0FBb0IsSUFBaEM7QUFBQSxRQUNBLFFBQUEsRUFBVSxFQUFBLEdBQUUsQ0FBQSxJQUFDLENBQUEsV0FBRCxDQUFBLENBQUEsQ0FBRixHQUFrQixJQUQ1QjtPQURGLENBSEEsQ0FBQTthQU9BLElBQUMsQ0FBQSxTQUFELENBQVcsSUFBQyxDQUFBLE1BQVosRUFBb0IsOEJBQXBCLEVBQW9ELENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLE9BQUQsR0FBQTtBQUNsRCxVQUFBLEtBQUMsQ0FBQSxjQUFjLENBQUMsSUFBaEIsQ0FBcUIsT0FBckIsQ0FBQSxDQUFBO2lCQUNBLEtBQUMsQ0FBQSxhQUFELENBQUEsRUFGa0Q7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUFwRCxFQVJhO0lBQUEsQ0FsQ2YsQ0FBQTs7QUFBQSxnQ0E4Q0EsYUFBQSxHQUFlLFNBQUEsR0FBQTtBQUNiLE1BQUEsSUFBVSxJQUFDLENBQUEsY0FBWDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixJQURsQixDQUFBO2FBR0EsWUFBQSxDQUFhLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDWCxVQUFBLEtBQUMsQ0FBQSxVQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsTUFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLFFBQUQsQ0FBVSxnQkFBVixDQUZBLENBQUE7aUJBR0EsS0FBQyxDQUFBLGNBQUQsR0FBa0IsTUFKUDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQWIsRUFKYTtJQUFBLENBOUNmLENBQUE7O0FBQUEsZ0NBd0RBLFNBQUEsR0FBVyxTQUFDLFNBQUQsRUFBWSxPQUFaLEdBQUE7O1FBQVksVUFBUTtPQUM3QjtBQUFBLE1BQUEsSUFBb0MsaUJBQXBDO0FBQUEsZUFBTyxJQUFDLENBQUEsZUFBRCxJQUFvQixDQUEzQixDQUFBO09BQUE7QUFDQSxNQUFBLElBQVUsU0FBQSxLQUFhLElBQUMsQ0FBQSxlQUF4QjtBQUFBLGNBQUEsQ0FBQTtPQURBO0FBQUEsTUFHQSxJQUFDLENBQUEsZUFBRCxHQUFtQixTQUhuQixDQUFBO2FBSUEsSUFBQyxDQUFBLGFBQUQsQ0FBQSxFQUxTO0lBQUEsQ0F4RFgsQ0FBQTs7QUFBQSxnQ0ErREEsWUFBQSxHQUFjLFNBQUMsSUFBRCxFQUFPLEdBQVAsR0FBQTtBQUNaLFVBQUEsbUJBQUE7QUFBQSxlQUFBLElBQUMsQ0FBQSxZQUFZLENBQUEsSUFBQSxXQUFBLENBQUEsSUFBQSxJQUFVLEdBQXZCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxXQUFZLENBQUEsSUFBQSxDQUFLLENBQUMsSUFBbkIsQ0FBd0IsR0FBeEIsQ0FEQSxDQUFBO0FBR0EsTUFBQSxJQUFHLHFDQUFBLElBQTZCLElBQUEsSUFBUSxJQUFDLENBQUEsc0JBQXRDLElBQWlFLElBQUEsSUFBUSxJQUFDLENBQUEscUJBQTdFO0FBQ0UsUUFBQSxLQUFBLEdBQVEsSUFBQSxHQUFPLElBQUMsQ0FBQSxzQkFBUixHQUFpQyxDQUF6QyxDQUFBO3FFQUN3QixDQUFFLFNBQVMsQ0FBQyxHQUFwQyxDQUF3QyxHQUF4QyxXQUZGO09BSlk7SUFBQSxDQS9EZCxDQUFBOztBQUFBLGdDQXVFQSxlQUFBLEdBQWlCLFNBQUMsSUFBRCxFQUFPLEdBQVAsR0FBQTtBQUNmLFVBQUEsWUFBQTtBQUFBLE1BQUEsSUFBRyxJQUFDLENBQUEsV0FBWSxDQUFBLElBQUEsQ0FBYixJQUF1QixDQUFDLEtBQUEsR0FBUSxJQUFDLENBQUEsV0FBWSxDQUFBLElBQUEsQ0FBSyxDQUFDLE9BQW5CLENBQTJCLEdBQTNCLENBQVQsQ0FBQSxLQUE4QyxDQUFBLENBQXhFO0FBQ0UsUUFBQSxJQUFDLENBQUEsV0FBWSxDQUFBLElBQUEsQ0FBSyxDQUFDLE1BQW5CLENBQTBCLEtBQTFCLEVBQWlDLENBQWpDLENBQUEsQ0FERjtPQUFBO0FBR0EsTUFBQSxJQUFHLHFDQUFBLElBQTZCLElBQUEsSUFBUSxJQUFDLENBQUEsc0JBQXRDLElBQWlFLElBQUEsSUFBUSxJQUFDLENBQUEscUJBQTdFO0FBQ0UsUUFBQSxLQUFBLEdBQVEsSUFBQSxHQUFPLElBQUMsQ0FBQSxzQkFBUixHQUFpQyxDQUF6QyxDQUFBO3FFQUN3QixDQUFFLFNBQVMsQ0FBQyxNQUFwQyxDQUEyQyxHQUEzQyxXQUZGO09BSmU7SUFBQSxDQXZFakIsQ0FBQTs7QUFBQSxnQ0ErRUEsb0JBQUEsR0FBc0IsU0FBQSxHQUFBO0FBQ3BCLFVBQUEsaURBQUE7QUFBQSxNQURxQix5RUFDckIsQ0FBQTtBQUFBO0FBQUEsV0FBQSxVQUFBOzJCQUFBO0FBQ0UsYUFBQSw4Q0FBQTs0QkFBQTtBQUNFLFVBQUEsSUFBRyxlQUFlLENBQUMsTUFBaEIsS0FBMEIsQ0FBMUIsSUFBK0IsZUFBTyxlQUFQLEVBQUEsR0FBQSxNQUFsQztBQUNFLFlBQUEsSUFBQyxDQUFBLElBQUQsQ0FBTyxHQUFBLEdBQUUsR0FBVCxDQUFnQixDQUFDLFdBQWpCLENBQTZCLEdBQTdCLENBQUEsQ0FERjtXQURGO0FBQUEsU0FERjtBQUFBLE9BQUE7YUFLQSxJQUFDLENBQUEsV0FBRCxHQUFlLEdBTks7SUFBQSxDQS9FdEIsQ0FBQTs7QUFBQSxnQ0F1RkEscUJBQUEsR0FBdUIsU0FBQyxLQUFELEdBQUE7YUFDckIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxJQUFoQixDQUFxQixLQUFyQixFQURxQjtJQUFBLENBdkZ2QixDQUFBOztBQUFBLGdDQTBGQSxnQkFBQSxHQUFrQixTQUFBLEdBQUE7YUFBRyxJQUFDLENBQUEsYUFBRCxDQUFBLENBQUEsR0FBbUIsSUFBQyxDQUFBLGFBQUQsQ0FBQSxFQUF0QjtJQUFBLENBMUZsQixDQUFBOztBQUFBLGdDQTJGQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLGVBQUQsSUFBQyxDQUFBLGFBQWUsUUFBQSxDQUFTLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQixRQUFqQixDQUEwQixDQUFDLEdBQTNCLENBQStCLGFBQS9CLENBQVQsR0FBbkI7SUFBQSxDQTNGZixDQUFBOztBQUFBLGdDQTRGQSxXQUFBLEdBQWEsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLGFBQUQsSUFBQyxDQUFBLFdBQWEsUUFBQSxDQUFTLElBQUMsQ0FBQSxVQUFVLENBQUMsSUFBWixDQUFpQixRQUFqQixDQUEwQixDQUFDLEdBQTNCLENBQStCLFdBQS9CLENBQVQsR0FBakI7SUFBQSxDQTVGYixDQUFBOztBQUFBLGdDQTZGQSxhQUFBLEdBQWUsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxTQUFaLENBQUEsQ0FBdUIsQ0FBQyxrQkFBeEIsQ0FBQSxFQUFIO0lBQUEsQ0E3RmYsQ0FBQTs7QUFBQSxnQ0ErRkEsc0JBQUEsR0FBd0IsU0FBQSxHQUFBO2FBQUcsSUFBQyxDQUFBLFdBQVcsQ0FBQyxNQUFiLENBQUEsQ0FBQSxHQUF3QixJQUFDLENBQUEsV0FBVyxDQUFDLE9BQXhDO0lBQUEsQ0EvRnhCLENBQUE7O0FBQUEsZ0NBZ0dBLHVCQUFBLEdBQXlCLFNBQUEsR0FBQTthQUFHLElBQUksQ0FBQyxJQUFMLENBQVUsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0FBQSxHQUE0QixJQUFDLENBQUEsYUFBRCxDQUFBLENBQXRDLEVBQUg7SUFBQSxDQWhHekIsQ0FBQTs7QUFBQSxnQ0FrR0Esd0JBQUEsR0FBMEIsU0FBQSxHQUFBO0FBQ3hCLFVBQUEsU0FBQTtBQUFBLE1BQUEsU0FBQSxHQUFZLElBQUksQ0FBQyxLQUFMLENBQVcsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLEdBQWUsSUFBQyxDQUFBLGFBQUQsQ0FBQSxDQUExQixDQUFaLENBQUE7QUFDQSxNQUFBLElBQWlCLEtBQUEsQ0FBTSxTQUFOLENBQWpCO0FBQUEsUUFBQSxTQUFBLEdBQVksQ0FBWixDQUFBO09BREE7YUFFQSxVQUh3QjtJQUFBLENBbEcxQixDQUFBOztBQUFBLGdDQXVHQSx1QkFBQSxHQUF5QixTQUFBLEdBQUE7QUFDdkIsVUFBQSx3QkFBQTtBQUFBLE1BQUEsYUFBQSxHQUFnQixJQUFJLENBQUMsSUFBTCxDQUFVLENBQUMsSUFBQyxDQUFBLFNBQUQsQ0FBQSxDQUFBLEdBQWUsSUFBQyxDQUFBLHNCQUFELENBQUEsQ0FBaEIsQ0FBQSxHQUE2QyxJQUFDLENBQUEsYUFBRCxDQUFBLENBQXZELENBQUEsR0FBMkUsQ0FBM0YsQ0FBQTtBQUFBLE1BQ0EsU0FBQSxHQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxFQUFZLElBQUksQ0FBQyxHQUFMLENBQVMsSUFBQyxDQUFBLE1BQU0sQ0FBQyxrQkFBUixDQUFBLENBQUEsR0FBK0IsQ0FBeEMsRUFBMkMsYUFBM0MsQ0FBWixDQURaLENBQUE7QUFFQSxNQUFBLElBQWlCLEtBQUEsQ0FBTSxTQUFOLENBQWpCO0FBQUEsUUFBQSxTQUFBLEdBQVksQ0FBWixDQUFBO09BRkE7YUFHQSxVQUp1QjtJQUFBLENBdkd6QixDQUFBOztBQUFBLGdDQTZHQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ04sVUFBQSx3SEFBQTtBQUFBLE1BQUEsSUFBYyx1QkFBZDtBQUFBLGNBQUEsQ0FBQTtPQUFBO0FBQUEsTUFFQSxxQkFBQSxHQUF3QixJQUFDLENBQUEsd0JBQUQsQ0FBQSxDQUZ4QixDQUFBO0FBQUEsTUFHQSxxQkFBQSxHQUF3QixxQkFBQSxHQUF3QixJQUFDLENBQUEsdUJBQUQsQ0FBQSxDQUF4QixHQUFxRCxDQUg3RSxDQUFBO0FBQUEsTUFJQSxhQUFBLEdBQWdCLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBQSxDQUpoQixDQUFBO0FBTUEsTUFBQSxJQUFHLHFDQUFBLElBQTZCLHFCQUFBLElBQXlCLElBQUMsQ0FBQSxzQkFBdkQsSUFBa0YscUJBQUEsSUFBeUIsSUFBQyxDQUFBLHFCQUEvRztBQUNFLFFBQUEsVUFBQSxHQUFhLElBQUksQ0FBQyxHQUFMLENBQVMsYUFBVCxFQUF3QixJQUFDLENBQUEsc0JBQXpCLENBQWIsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxHQUFMLENBQVMsYUFBVCxFQUF3QixJQUFDLENBQUEscUJBQXpCLENBRFgsQ0FERjtPQUFBLE1BQUE7QUFJRSxRQUFBLFVBQUEsR0FBYSxJQUFJLENBQUMsR0FBTCxDQUFTLGFBQVQsRUFBd0IsSUFBSSxDQUFDLEdBQUwsQ0FBUyxDQUFULEVBQVkscUJBQUEsR0FBd0IsSUFBQyxDQUFBLFlBQXJDLENBQXhCLENBQWIsQ0FBQTtBQUFBLFFBQ0EsUUFBQSxHQUFXLElBQUksQ0FBQyxHQUFMLENBQVMsYUFBVCxFQUF3QixxQkFBQSxHQUF3QixJQUFDLENBQUEsWUFBakQsQ0FEWCxDQUpGO09BTkE7QUFBQSxNQWFBLGNBQUEsR0FBaUIsSUFBQyxDQUFBLGNBQWMsQ0FBQyxNQUFoQixLQUEwQixDQUExQixJQUFnQyxJQUFDLENBQUEsc0JBQWpDLElBQTRELElBQUMsQ0FBQSxzQkFBRCxJQUEyQixVQUF2RixJQUFzRyxRQUFBLElBQVksSUFBQyxDQUFBLHFCQWJwSSxDQUFBO0FBY0EsTUFBQSxJQUFVLGNBQVY7QUFBQSxjQUFBLENBQUE7T0FkQTtBQUFBLE1BZ0JBLE9BQUEsR0FBVSxJQUFDLENBQUEsY0FoQlgsQ0FBQTtBQUFBLE1BaUJBLFlBQUEsR0FBZSxJQUFDLENBQUEsbUJBQUQsQ0FBcUIsVUFBckIsRUFBaUMsUUFBakMsQ0FqQmYsQ0FBQTtBQUFBLE1BbUJBLElBQUMsQ0FBQSxnQkFBRCxDQUFrQixZQUFsQixDQW5CQSxDQUFBO0FBQUEsTUFvQkEsSUFBQyxDQUFBLGVBQUQsQ0FBaUIsWUFBakIsRUFBK0IsVUFBL0IsRUFBMkMsUUFBM0MsQ0FwQkEsQ0FBQTtBQUFBLE1BcUJBLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixVQXJCMUIsQ0FBQTtBQUFBLE1Bc0JBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixRQXRCekIsQ0FBQTtBQUFBLE1BdUJBLElBQUMsQ0FBQSw0QkFBRCxDQUFBLENBdkJBLENBQUE7YUF3QkEsSUFBQyxDQUFBLElBQUQsQ0FBTSxpQkFBTixFQXpCTTtJQUFBLENBN0dSLENBQUE7O0FBQUEsZ0NBd0lBLG1CQUFBLEdBQXFCLFNBQUMsVUFBRCxFQUFhLFFBQWIsR0FBQTtBQUNuQixVQUFBLDRIQUFBO0FBQUEsTUFBQSxJQUFjLHFDQUFELElBQStCLG9DQUE1QztBQUFBLGVBQU8sRUFBUCxDQUFBO09BQUE7QUFBQSxNQUVBLFlBQUEsR0FBZTtRQUFDO0FBQUEsVUFBQyxLQUFBLEVBQU8sSUFBQyxDQUFBLHNCQUFUO0FBQUEsVUFBaUMsR0FBQSxFQUFLLElBQUMsQ0FBQSxxQkFBdkM7QUFBQSxVQUE4RCxRQUFBLEVBQVUsQ0FBeEU7U0FBRDtPQUZmLENBQUE7QUFJQSxNQUFBLElBQUcsSUFBQyxDQUFBLFVBQVUsQ0FBQyxlQUFmO0FBQ0UsUUFBQSxnQkFBQSxHQUFtQixFQUFuQixDQUFBO0FBQ0E7QUFBQSxhQUFBLDRDQUFBOzZCQUFBO0FBQ0UsVUFBQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGtDQUFELENBQW9DLE1BQXBDLENBQVYsQ0FBQTtBQUFBLFVBQ0EsZ0JBQWdCLENBQUMsSUFBakIseUJBQXNCLE9BQXRCLENBREEsQ0FERjtBQUFBLFNBREE7QUFBQSxRQUtBLFNBQUEsSUFBQyxDQUFBLGNBQUQsQ0FBZSxDQUFDLElBQWhCLGNBQXFCLGdCQUFyQixDQUxBLENBREY7T0FKQTtBQVlBO0FBQUEsV0FBQSw4Q0FBQTsyQkFBQTtBQUNFLFFBQUEsZUFBQSxHQUFrQixFQUFsQixDQUFBO0FBQ0EsYUFBQSxxREFBQTttQ0FBQTtBQUNFLFVBQUEsSUFBRyxNQUFNLENBQUMsR0FBUCxHQUFhLEtBQUssQ0FBQyxLQUFuQixJQUE2QixNQUFNLENBQUMsV0FBUCxLQUFzQixDQUF0RDtBQUNFLFlBQUEsZUFBZSxDQUFDLElBQWhCLENBQ0U7QUFBQSxjQUFBLEtBQUEsRUFBTyxLQUFLLENBQUMsS0FBTixHQUFjLE1BQU0sQ0FBQyxXQUE1QjtBQUFBLGNBQ0EsR0FBQSxFQUFLLEtBQUssQ0FBQyxHQUFOLEdBQVksTUFBTSxDQUFDLFdBRHhCO0FBQUEsY0FFQSxRQUFBLEVBQVUsS0FBSyxDQUFDLFFBRmhCO2FBREYsQ0FBQSxDQURGO1dBQUEsTUFNSyxJQUFHLE1BQU0sQ0FBQyxHQUFQLEdBQWEsS0FBSyxDQUFDLEtBQW5CLElBQTRCLE1BQU0sQ0FBQyxLQUFQLEdBQWUsS0FBSyxDQUFDLEdBQXBEO0FBQ0gsWUFBQSxlQUFlLENBQUMsSUFBaEIsQ0FBcUIsS0FBckIsQ0FBQSxDQURHO1dBQUEsTUFBQTtBQUdILFlBQUEsSUFBRyxNQUFNLENBQUMsS0FBUCxHQUFlLEtBQUssQ0FBQyxLQUF4QjtBQUNFLGNBQUEsZUFBZSxDQUFDLElBQWhCLENBQ0U7QUFBQSxnQkFBQSxLQUFBLEVBQU8sS0FBSyxDQUFDLEtBQWI7QUFBQSxnQkFDQSxHQUFBLEVBQUssTUFBTSxDQUFDLEtBQVAsR0FBZSxDQURwQjtBQUFBLGdCQUVBLFFBQUEsRUFBVSxLQUFLLENBQUMsUUFGaEI7ZUFERixDQUFBLENBREY7YUFBQTtBQUtBLFlBQUEsSUFBRyxNQUFNLENBQUMsR0FBUCxHQUFhLEtBQUssQ0FBQyxHQUF0QjtBQUNFLGNBQUEsZUFBZSxDQUFDLElBQWhCLENBQ0U7QUFBQSxnQkFBQSxLQUFBLEVBQU8sTUFBTSxDQUFDLEdBQVAsR0FBYSxNQUFNLENBQUMsV0FBcEIsR0FBa0MsQ0FBekM7QUFBQSxnQkFDQSxHQUFBLEVBQUssS0FBSyxDQUFDLEdBQU4sR0FBWSxNQUFNLENBQUMsV0FEeEI7QUFBQSxnQkFFQSxRQUFBLEVBQVUsS0FBSyxDQUFDLFFBQU4sR0FBaUIsTUFBTSxDQUFDLEdBQXhCLEdBQThCLENBQTlCLEdBQWtDLEtBQUssQ0FBQyxLQUZsRDtlQURGLENBQUEsQ0FERjthQVJHO1dBUFA7QUFBQSxTQURBO0FBQUEsUUF1QkEsWUFBQSxHQUFlLGVBdkJmLENBREY7QUFBQSxPQVpBO0FBQUEsTUFzQ0EsSUFBQyxDQUFBLG9CQUFELENBQXNCLFlBQXRCLEVBQW9DLFVBQXBDLEVBQWdELFFBQWhELENBdENBLENBQUE7QUFBQSxNQXdDQSxJQUFDLENBQUEsY0FBRCxHQUFrQixFQXhDbEIsQ0FBQTthQTBDQSxhQTNDbUI7SUFBQSxDQXhJckIsQ0FBQTs7QUFBQSxnQ0FxTEEsb0JBQUEsR0FBc0IsU0FBQyxZQUFELEVBQWUsVUFBZixFQUEyQixRQUEzQixHQUFBO0FBQ3BCLFVBQUEsUUFBQTtBQUFBLE1BQUEsQ0FBQSxHQUFJLENBQUosQ0FBQTtBQUNBLGFBQU0sQ0FBQSxHQUFJLFlBQVksQ0FBQyxNQUF2QixHQUFBO0FBQ0UsUUFBQSxLQUFBLEdBQVEsWUFBYSxDQUFBLENBQUEsQ0FBckIsQ0FBQTtBQUNBLFFBQUEsSUFBRyxLQUFLLENBQUMsS0FBTixHQUFjLFVBQWpCO0FBQ0UsVUFBQSxLQUFLLENBQUMsUUFBTixJQUFrQixVQUFBLEdBQWEsS0FBSyxDQUFDLEtBQXJDLENBQUE7QUFBQSxVQUNBLEtBQUssQ0FBQyxLQUFOLEdBQWMsVUFEZCxDQURGO1NBREE7QUFJQSxRQUFBLElBQUcsS0FBSyxDQUFDLEdBQU4sR0FBWSxRQUFmO0FBQ0UsVUFBQSxLQUFLLENBQUMsR0FBTixHQUFZLFFBQVosQ0FERjtTQUpBO0FBTUEsUUFBQSxJQUFHLEtBQUssQ0FBQyxLQUFOLElBQWUsS0FBSyxDQUFDLEdBQXhCO0FBQ0UsVUFBQSxZQUFZLENBQUMsTUFBYixDQUFvQixDQUFBLEVBQXBCLEVBQXlCLENBQXpCLENBQUEsQ0FERjtTQU5BO0FBQUEsUUFRQSxDQUFBLEVBUkEsQ0FERjtNQUFBLENBREE7YUFXQSxZQUFZLENBQUMsSUFBYixDQUFrQixTQUFDLENBQUQsRUFBSSxDQUFKLEdBQUE7ZUFBVSxDQUFDLENBQUMsUUFBRixHQUFhLENBQUMsQ0FBQyxTQUF6QjtNQUFBLENBQWxCLEVBWm9CO0lBQUEsQ0FyTHRCLENBQUE7O0FBQUEsZ0NBbU1BLGtDQUFBLEdBQW9DLFNBQUMsTUFBRCxHQUFBO0FBQ2xDLFVBQUEsOERBQUE7QUFBQSxNQUFBLGdCQUFBLEdBQW1CLEVBQW5CLENBQUE7QUFFQSxNQUFBLElBQUcsMEJBQUg7QUFDRSxRQUFBLFVBQUEsR0FBYSxNQUFNLENBQUMsR0FBUCxHQUFhLE1BQU0sQ0FBQyxXQUFwQixHQUFrQyxDQUEvQyxDQUFBO0FBQ0EsUUFBQSxJQUFHLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsVUFBekIsQ0FBQSxLQUF3QyxFQUEzQztBQUNFLFVBQUEsUUFBQSxHQUFXLFVBQVgsQ0FBQTtBQUNXLGlCQUFNLElBQUMsQ0FBQSxNQUFNLENBQUMsZ0JBQVIsQ0FBeUIsUUFBQSxHQUFXLENBQXBDLENBQUEsS0FBMEMsRUFBaEQsR0FBQTtBQUFYLFlBQUEsUUFBQSxFQUFBLENBQVc7VUFBQSxDQURYO0FBQUEsVUFFQSxnQkFBZ0IsQ0FBQyxJQUFqQixDQUFzQjtBQUFBLFlBQUMsS0FBQSxFQUFPLFVBQVI7QUFBQSxZQUFvQixHQUFBLEVBQUssUUFBekI7QUFBQSxZQUFtQyxXQUFBLEVBQWEsQ0FBaEQ7V0FBdEIsQ0FGQSxDQURGO1NBREE7QUFBQSxRQU1BLFNBQUEsR0FBWSxNQUFNLENBQUMsS0FBUCxHQUFlLENBTjNCLENBQUE7QUFPQSxRQUFBLElBQUcsSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUF5QixTQUF6QixDQUFBLEtBQXVDLEVBQTFDO0FBQ0UsVUFBQSxXQUFBLEdBQWMsU0FBZCxDQUFBO0FBQ2MsaUJBQU0sSUFBQyxDQUFBLE1BQU0sQ0FBQyxnQkFBUixDQUF5QixXQUFBLEdBQWMsQ0FBdkMsQ0FBQSxLQUE2QyxFQUFuRCxHQUFBO0FBQWQsWUFBQSxXQUFBLEVBQUEsQ0FBYztVQUFBLENBRGQ7QUFBQSxVQUVBLGdCQUFnQixDQUFDLElBQWpCLENBQXNCO0FBQUEsWUFBQyxLQUFBLEVBQU8sV0FBUjtBQUFBLFlBQXFCLEdBQUEsRUFBSyxTQUExQjtBQUFBLFlBQXFDLFdBQUEsRUFBYSxDQUFsRDtXQUF0QixDQUZBLENBREY7U0FSRjtPQUZBO2FBZUEsaUJBaEJrQztJQUFBLENBbk1wQyxDQUFBOztBQUFBLGdDQXFOQSxnQkFBQSxHQUFrQixTQUFDLFlBQUQsR0FBQTtBQUNoQixVQUFBLDhFQUFBO0FBQUEsTUFBQSxJQUFHLFlBQVksQ0FBQyxNQUFiLEtBQXVCLENBQTFCO2VBQ0UsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxTQUFWLEdBQXNCLEdBRHhCO09BQUEsTUFFSyxJQUFHLFdBQUEsR0FBYyxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLFVBQTNCO0FBQ0gsUUFBQSxJQUFPLG1CQUFQO0FBQ0UsVUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLDBEQUFiLENBQUEsQ0FBQTtBQUNBLGdCQUFBLENBRkY7U0FBQTtBQUFBLFFBSUEsV0FBQSxHQUFjLENBSmQsQ0FBQTtBQUtBLGFBQUEsbURBQUE7eUNBQUE7QUFDRSxpQkFBTSxXQUFXLENBQUMsUUFBWixHQUF1QixXQUE3QixHQUFBO0FBQ0UsWUFBQSxJQUFPLG1CQUFQO0FBQ0UsY0FBQSxPQUFPLENBQUMsSUFBUixDQUFjLDRDQUFBLEdBQTJDLFdBQTNDLEdBQXdELG1DQUF4RCxHQUEwRixXQUFXLENBQUMsUUFBdEcsR0FBZ0gsSUFBaEgsR0FBbUgsV0FBVyxDQUFDLEtBQS9ILEdBQXNJLElBQXRJLEdBQXlJLFdBQVcsQ0FBQyxHQUFySixHQUEwSixHQUF4SyxDQUFBLENBQUE7QUFDQSxvQkFBQSxDQUZGO2FBQUE7QUFBQSxZQUdBLFdBQUEsR0FBYyxJQUFDLENBQUEsU0FBRCxDQUFXLFdBQVgsQ0FIZCxDQUFBO0FBQUEsWUFJQSxXQUFBLEVBSkEsQ0FERjtVQUFBLENBQUE7QUFPQSxlQUFTLHlJQUFULEdBQUE7QUFDRSxZQUFBLElBQU8sbUJBQVA7QUFDRSxjQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWMsc0RBQUEsR0FBcUQsV0FBVyxDQUFDLEtBQWpFLEdBQXdFLElBQXhFLEdBQTJFLFdBQVcsQ0FBQyxHQUFyRyxDQUFBLENBQUE7QUFDQSxvQkFBQSxDQUZGO2FBQUE7QUFBQSxZQUdBLFdBQUEsR0FBYyxXQUFXLENBQUMsV0FIMUIsQ0FBQTtBQUFBLFlBSUEsV0FBQSxFQUpBLENBREY7QUFBQSxXQVJGO0FBQUEsU0FMQTtBQW9CQTtlQUFNLFdBQU4sR0FBQTtBQUNFLHdCQUFBLFdBQUEsR0FBYyxJQUFDLENBQUEsU0FBRCxDQUFXLFdBQVgsRUFBZCxDQURGO1FBQUEsQ0FBQTt3QkFyQkc7T0FIVztJQUFBLENBck5sQixDQUFBOztBQUFBLGdDQWdQQSxTQUFBLEdBQVcsU0FBQyxXQUFELEdBQUE7QUFDVCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxXQUFXLENBQUMsV0FBbkIsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxXQUFWLENBQXNCLFdBQXRCLENBREEsQ0FBQTthQUVBLEtBSFM7SUFBQSxDQWhQWCxDQUFBOztBQUFBLGdDQXFQQSxlQUFBLEdBQWlCLFNBQUMsWUFBRCxFQUFlLFVBQWYsRUFBMkIsUUFBM0IsR0FBQTtBQUNmLFVBQUEsd0hBQUE7QUFBQSxNQUFBLENBQUEsR0FBSSxDQUFKLENBQUE7QUFBQSxNQUNBLFVBQUEsR0FBYSxZQUFhLENBQUEsQ0FBQSxDQUQxQixDQUFBO0FBQUEsTUFFQSxXQUFBLEdBQWMsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxVQUZ4QixDQUFBO0FBQUEsTUFJQSxHQUFBLEdBQU0sVUFKTixDQUFBO0FBS0E7YUFBTSxHQUFBLElBQU8sUUFBYixHQUFBO0FBQ0UsUUFBQSxJQUFHLEdBQUEsMkJBQU8sVUFBVSxDQUFFLGFBQVosR0FBa0IsQ0FBNUI7QUFDRSxVQUFBLFVBQUEsR0FBYSxZQUFhLENBQUEsRUFBQSxDQUFBLENBQTFCLENBREY7U0FBQTtBQUdBLFFBQUEsSUFBRyxDQUFBLFVBQUEsSUFBZSxHQUFBLEdBQU0sVUFBVSxDQUFDLEtBQW5DO0FBQ0UsVUFBQSxJQUFHLFVBQUg7QUFDRSxZQUFBLGFBQUEsR0FBZ0IsVUFBVSxDQUFDLEtBQVgsR0FBbUIsQ0FBbkMsQ0FERjtXQUFBLE1BQUE7QUFHRSxZQUFBLGFBQUEsR0FBZ0IsUUFBaEIsQ0FIRjtXQUFBO0FBS0EsVUFBQSxJQUFHLElBQUMsQ0FBQSxVQUFELFlBQXVCLFVBQTFCOzs7QUFDRTtBQUFBO21CQUFBLDRDQUFBO3dDQUFBO0FBQ0UsZ0JBQUEsT0FBQSxHQUFVLElBQUMsQ0FBQSxhQUFELENBQWUsR0FBZixDQUFWLENBQUE7QUFDQSxnQkFBQSxJQUEwQyxlQUExQzs7b0JBQUEsU0FBQSxXQUFXLENBQUUsU0FBYixDQUFzQixDQUFDLEdBQXZCLGNBQTJCLE9BQTNCO21CQUFBO2lCQURBO0FBQUEsZ0JBRUEsSUFBQyxDQUFBLEtBQU0sQ0FBQSxDQUFBLENBQUUsQ0FBQyxZQUFWLENBQXVCLFdBQXZCLEVBQW9DLFdBQXBDLENBRkEsQ0FBQTtBQUFBLCtCQUdBLEdBQUEsR0FIQSxDQURGO0FBQUE7OzJCQURGO1dBQUEsTUFBQTtBQU9FLFlBQUEsY0FBQSxHQUFpQixJQUFDLENBQUEsVUFBVSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsS0FBNUMsQ0FBQTtBQUFBLFlBQ0EsS0FBQSxHQUFRLElBQUMsQ0FBQSxNQUFNLENBQUMsa0JBQVIsQ0FBMkIsR0FBM0IsRUFBZ0MsYUFBaEMsQ0FEUixDQUFBO0FBQUEscUJBR0EsY0FBYyxDQUFDLE1BQUssQ0FBQyx5QkFBRCxDQUFDLGtCQUFvQixHQUh6QyxDQUFBO0FBQUE7O0FBS0E7bUJBQUEsNENBQUE7aUNBQUE7QUFDRSxnQkFBQSxJQUFBLEdBQU8sY0FBYyxDQUFDLGFBQWYsQ0FBNkIsSUFBN0IsRUFBbUMsR0FBbkMsQ0FBUCxDQUFBO0FBQUEsZ0JBQ0EsSUFBQyxDQUFBLFNBQVMsQ0FBQyxTQUFYLEdBQXVCLElBRHZCLENBQUE7QUFBQSxnQkFFQSxXQUFBLEdBQWMsSUFBQyxDQUFBLFNBQVMsQ0FBQyxVQUFXLENBQUEsQ0FBQSxDQUZwQyxDQUFBO0FBR0EsZ0JBQUEsSUFBTyxtQkFBUDtBQUNFLGtCQUFBLE9BQU8sQ0FBQyxJQUFSLENBQWMsa0RBQUEsR0FBaUQsU0FBL0QsQ0FBQSxDQUFBO0FBQ0EsMkJBRkY7aUJBSEE7QUFBQSxnQkFNQSxPQUFBLEdBQVUsSUFBQyxDQUFBLGFBQUQsQ0FBZSxHQUFmLENBTlYsQ0FBQTtBQUFBLGdCQU9BLFdBQVcsQ0FBQyxTQUFaLEdBQXdCLE1BUHhCLENBQUE7QUFRQSxnQkFBQSxJQUF5QyxlQUF6QztBQUFBLGtCQUFBLFNBQUEsV0FBVyxDQUFDLFNBQVosQ0FBcUIsQ0FBQyxHQUF0QixjQUEwQixPQUExQixDQUFBLENBQUE7aUJBUkE7QUFBQSxnQkFTQSxXQUFXLENBQUMsS0FBSyxDQUFDLE9BQWxCLEdBQTBCLEVBVDFCLENBQUE7QUFBQSxnQkFVQSxJQUFDLENBQUEsS0FBTSxDQUFBLENBQUEsQ0FBRSxDQUFDLFlBQVYsQ0FBdUIsV0FBdkIsRUFBb0MsV0FBcEMsQ0FWQSxDQUFBO0FBQUEsK0JBV0EsR0FBQSxHQVhBLENBREY7QUFBQTs7MEJBTEEsQ0FQRjtXQU5GO1NBQUEsTUFBQTtBQWdDRSxVQUFBLFdBQUEseUJBQWMsV0FBVyxDQUFFLG9CQUEzQixDQUFBO0FBQUEsd0JBQ0EsR0FBQSxHQURBLENBaENGO1NBSkY7TUFBQSxDQUFBO3NCQU5lO0lBQUEsQ0FyUGpCLENBQUE7O0FBQUEsZ0NBa1NBLGFBQUEsR0FBZSxTQUFDLEdBQUQsR0FBQTthQUFTLElBQUMsQ0FBQSxXQUFZLENBQUEsR0FBQSxHQUFJLENBQUosRUFBdEI7SUFBQSxDQWxTZixDQUFBOztBQUFBLGdDQW9TQSw0QkFBQSxHQUE4QixTQUFBLEdBQUE7QUFDNUIsVUFBQSx5QkFBQTtBQUFBLE1BQUEsVUFBQSxHQUFhLElBQUMsQ0FBQSxzQkFBRCxHQUEwQixJQUFDLENBQUEsVUFBeEMsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLEtBQUssQ0FBQyxHQUFQLENBQVcsYUFBWCxFQUEwQixVQUExQixDQURBLENBQUE7QUFBQSxNQUdBLGFBQUEsR0FBZ0IsQ0FBQyxJQUFDLENBQUEsTUFBTSxDQUFDLGdCQUFSLENBQUEsQ0FBQSxHQUE2QixJQUFDLENBQUEscUJBQS9CLENBQUEsR0FBd0QsSUFBQyxDQUFBLFVBSHpFLENBQUE7YUFJQSxJQUFDLENBQUEsS0FBSyxDQUFDLEdBQVAsQ0FBVyxnQkFBWCxFQUE2QixhQUE3QixFQUw0QjtJQUFBLENBcFM5QixDQUFBOztBQUFBLGdDQTJTQSxhQUFBLEdBQWUsU0FBQSxHQUFBO0FBQ2IsVUFBQSxFQUFBO0FBQUEsTUFBQSxFQUFBLEdBQUssSUFBQyxDQUFBLFVBQVcsQ0FBQSxDQUFBLENBQWpCLENBQUE7YUFDQTtBQUFBLFFBQ0UsS0FBQSxFQUFPLEVBQUUsQ0FBQyxXQURaO0FBQUEsUUFFRSxNQUFBLEVBQVEsRUFBRSxDQUFDLFlBRmI7UUFGYTtJQUFBLENBM1NmLENBQUE7OzZCQUFBOztLQUQ4QixXQUxoQyxDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-editor-view.coffee