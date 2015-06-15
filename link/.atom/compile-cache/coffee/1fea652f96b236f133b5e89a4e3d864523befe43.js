(function() {
  var $, CompositeDisposable, Delegato, Disposable, Emitter, MinimapIndicator, MinimapOpenQuickSettingsView, MinimapRenderView, MinimapView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), $ = _ref.$, View = _ref.View;

  Delegato = require('delegato');

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Disposable = _ref1.Disposable, Emitter = _ref1.Emitter;

  MinimapRenderView = require('./minimap-render-view');

  MinimapIndicator = require('./minimap-indicator');

  MinimapOpenQuickSettingsView = require('./minimap-open-quick-settings-view');

  module.exports = MinimapView = (function(_super) {
    __extends(MinimapView, _super);

    Delegato.includeInto(MinimapView);

    MinimapView.delegatesMethods('getLineHeight', 'getCharHeight', 'getCharWidth', 'getLinesCount', 'getMinimapHeight', 'getMinimapScreenHeight', 'getMinimapHeightInLines', 'getFirstVisibleScreenRow', 'getLastVisibleScreenRow', 'pixelPositionForScreenPosition', 'decorateMarker', 'removeDecoration', 'decorationsForScreenRowRange', 'removeAllDecorationsForMarker', {
      toProperty: 'renderView'
    });

    MinimapView.delegatesMethods('getSelection', 'getSelections', 'getLastSelection', 'bufferRangeForBufferRow', 'getTextInBufferRange', 'getEofBufferPosition', 'scanInBufferRange', 'markBufferRange', {
      toProperty: 'editor'
    });

    MinimapView.delegatesProperty('lineHeight', {
      toMethod: 'getLineHeight'
    });

    MinimapView.delegatesProperty('charWidth', {
      toMethod: 'getCharWidth'
    });

    MinimapView.content = function(_arg) {
      var minimapView;
      minimapView = _arg.minimapView;
      return this.div({
        "class": 'minimap'
      }, (function(_this) {
        return function() {
          if (atom.config.get('minimap.displayPluginsControls')) {
            _this.subview('openQuickSettings', new MinimapOpenQuickSettingsView(minimapView));
          }
          _this.div({
            outlet: 'miniScroller',
            "class": "minimap-scroller"
          });
          return _this.div({
            outlet: 'miniWrapper',
            "class": "minimap-wrapper"
          }, function() {
            _this.div({
              outlet: 'miniUnderlayer',
              "class": "minimap-underlayer"
            });
            _this.subview('renderView', new MinimapRenderView);
            return _this.div({
              outlet: 'miniOverlayer',
              "class": "minimap-overlayer"
            }, function() {
              return _this.div({
                outlet: 'miniVisibleArea',
                "class": "minimap-visible-area"
              });
            });
          });
        };
      })(this));
    };

    MinimapView.prototype.isClicked = false;


    /* Public */

    function MinimapView(editorView) {
      this.onDrag = __bind(this.onDrag, this);
      this.onMove = __bind(this.onMove, this);
      this.onDragStart = __bind(this.onDragStart, this);
      this.onScrollViewResized = __bind(this.onScrollViewResized, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.onMouseWheel = __bind(this.onMouseWheel, this);
      this.onActiveItemChanged = __bind(this.onActiveItemChanged, this);
      this.updateScroll = __bind(this.updateScroll, this);
      this.updateScrollX = __bind(this.updateScrollX, this);
      this.updateScrollY = __bind(this.updateScrollY, this);
      this.updateMinimapSize = __bind(this.updateMinimapSize, this);
      this.updateMinimapRenderView = __bind(this.updateMinimapRenderView, this);
      this.updateMinimapView = __bind(this.updateMinimapView, this);
      this.emitter = new Emitter;
      this.setEditorView(editorView);
      this.paneView.classList.add('with-minimap');
      this.subscriptions = new CompositeDisposable;
      MinimapView.__super__.constructor.call(this, {
        minimapView: this,
        editorView: editorView
      });
      this.computeScale();
      this.miniScrollView = this.renderView.scrollView;
      this.offsetLeft = 0;
      this.offsetTop = 0;
      this.indicator = new MinimapIndicator();
      this.scrollView = this.getEditorViewRoot().querySelector('.scroll-view');
      this.scrollViewLines = this.scrollView.querySelector('.lines');
      this.subscribeToEditor();
      this.renderView.minimapView = this;
      this.renderView.setEditorView(this.editorView);
      this.updateMinimapView();
    }

    MinimapView.prototype.initialize = function() {
      var config;
      this.element.addEventListener('mousewheel', this.onMouseWheel);
      this.element.addEventListener('mousedown', this.onMouseDown);
      this.miniVisibleArea[0].addEventListener('mousedown', this.onDragStart);
      this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.element.removeEventListener('mousewheel', _this.onMouseWheel);
          _this.element.removeEventListener('mousedown', _this.onMouseDown);
          return _this.miniVisibleArea[0].removeEventListener('mousedown', _this.onDragStart);
        };
      })(this)));
      this.obsPane = this.pane.observeActiveItem(this.onActiveItemChanged);
      this.subscriptions.add(this.renderView.onDidUpdate(this.updateMinimapSize));
      this.subscriptions.add(this.renderView.onDidChangeScale((function(_this) {
        return function() {
          _this.computeScale();
          return _this.updatePositions();
        };
      })(this)));
      this.observer = new MutationObserver((function(_this) {
        return function(mutations) {
          return _this.updateTopPosition();
        };
      })(this));
      config = {
        childList: true
      };
      this.observer.observe(this.paneView, config);
      this.subscriptions.add(atom.themes.onDidReloadAll((function(_this) {
        return function() {
          _this.updateTopPosition();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          return window.removeEventListener('resize:end', _this.onScrollViewResized);
        };
      })(this)));
      window.addEventListener('resize:end', this.onScrollViewResized);
      this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
      this.miniScroller.toggleClass('visible', this.miniScrollVisible);
      this.displayCodeHighlights = atom.config.get('minimap.displayCodeHighlights');
      this.subscriptions.add(atom.config.observe('minimap.minimapScrollIndicator', (function(_this) {
        return function() {
          _this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
          return _this.miniScroller.toggleClass('visible', _this.miniScrollVisible);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.useHardwareAcceleration', (function(_this) {
        return function() {
          if (_this.ScrollView != null) {
            return _this.updateScroll();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.displayCodeHighlights', (function(_this) {
        return function() {
          var newOptionValue;
          newOptionValue = atom.config.get('minimap.displayCodeHighlights');
          return _this.setDisplayCodeHighlights(newOptionValue);
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('minimap.adjustMinimapWidthToSoftWrap', (function(_this) {
        return function(value) {
          if (value) {
            return _this.updateMinimapSize();
          } else {
            return _this.resetMinimapWidthWithWrap();
          }
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscriptions.add(atom.config.observe('editor.softWrap', (function(_this) {
        return function() {
          _this.updateMinimapSize();
          return _this.updateMinimapView();
        };
      })(this)));
      return this.subscriptions.add(atom.config.observe('editor.preferredLineLength', (function(_this) {
        return function() {
          return _this.updateMinimapSize();
        };
      })(this)));
    };

    MinimapView.prototype.onDidScroll = function(callback) {
      return this.emitter.on('did-scroll', callback);
    };

    MinimapView.prototype.computeScale = function() {
      var computedLineHeight, originalLineHeight;
      originalLineHeight = this.getEditorLineHeight();
      computedLineHeight = this.getLineHeight();
      return this.scaleX = this.scaleY = computedLineHeight / originalLineHeight;
    };

    MinimapView.prototype.getEditorLineHeight = function() {
      var lineHeight;
      lineHeight = window.getComputedStyle(this.getEditorViewRoot().querySelector('.lines')).getPropertyValue('line-height');
      return parseInt(lineHeight);
    };

    MinimapView.prototype.destroy = function() {
      this.resetMinimapWidthWithWrap();
      this.paneView.classList.remove('with-minimap');
      this.off();
      this.obsPane.dispose();
      this.subscriptions.dispose();
      this.observer.disconnect();
      this.detachFromPaneView();
      this.renderView.destroy();
      return this.remove();
    };

    MinimapView.prototype.setEditorView = function(editorView) {
      var _ref2;
      this.editorView = editorView;
      this.editor = this.editorView.getModel();
      this.pane = atom.workspace.paneForItem(this.editor);
      this.paneView = atom.views.getView(this.pane);
      if ((_ref2 = this.renderView) != null) {
        _ref2.setEditorView(this.editorView);
      }
      if (this.obsPane != null) {
        this.obsPane.dispose();
        return this.obsPane = this.pane.observeActiveItem(this.onActiveItemChanged);
      }
    };

    MinimapView.prototype.getEditorViewRoot = function() {
      var _ref2;
      return (_ref2 = this.editorView.shadowRoot) != null ? _ref2 : this.editorView;
    };

    MinimapView.prototype.setDisplayCodeHighlights = function(value) {
      if (value !== this.displayCodeHighlights) {
        this.displayCodeHighlights = value;
        return this.renderView.forceUpdate();
      }
    };

    MinimapView.prototype.attachToPaneView = function() {
      this.paneView.appendChild(this.element);
      this.computeScale();
      return this.updateTopPosition();
    };

    MinimapView.prototype.detachFromPaneView = function() {
      return this.detach();
    };

    MinimapView.prototype.minimapIsAttached = function() {
      return this.paneView.find('.minimap').length === 1;
    };

    MinimapView.prototype.getEditorViewClientRect = function() {
      return this.editorView.getBoundingClientRect();
    };

    MinimapView.prototype.getScrollViewClientRect = function() {
      return this.scrollViewLines.getBoundingClientRect();
    };

    MinimapView.prototype.getMinimapClientRect = function() {
      return this.element.getBoundingClientRect();
    };

    MinimapView.prototype.updateMinimapView = function() {
      if (!this.editorView) {
        return;
      }
      if (!this.indicator) {
        return;
      }
      if (this.frameRequested) {
        return;
      }
      this.updateMinimapSize();
      this.frameRequested = true;
      return requestAnimationFrame((function(_this) {
        return function() {
          _this.updateScroll();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapView.prototype.updateMinimapRenderView = function() {
      return this.renderView.update();
    };

    MinimapView.prototype.updateMinimapSize = function() {
      var editorViewRect, evh, evw, height, miniScrollViewRect, minimapVisibilityRatio, msvh, msvw, width, _ref2;
      if (this.indicator == null) {
        return;
      }
      _ref2 = this.getMinimapClientRect(), width = _ref2.width, height = _ref2.height;
      editorViewRect = this.getEditorViewClientRect();
      miniScrollViewRect = this.renderView.getClientRect();
      evw = editorViewRect.width;
      evh = editorViewRect.height;
      minimapVisibilityRatio = miniScrollViewRect.height / height;
      this.miniScroller.height(evh / minimapVisibilityRatio);
      this.miniScroller.toggleClass('visible', minimapVisibilityRatio > 1 && this.miniScrollVisible);
      this.miniWrapper.css({
        width: width
      });
      this.indicator.height = evh * this.scaleY;
      this.indicator.width = width / this.scaleX;
      this.miniVisibleArea.css({
        width: width / this.scaleX,
        height: evh * this.scaleY
      });
      this.updateMinimapWidthWithWrap();
      msvw = miniScrollViewRect.width || 0;
      msvh = miniScrollViewRect.height || 0;
      this.indicator.setWrapperSize(width, Math.min(height, msvh));
      this.indicator.setScrollerSize(msvw, msvh);
      return this.indicator.updateBoundary();
    };

    MinimapView.prototype.updateMinimapWidthWithWrap = function() {
      var adjustWidth, displayLeft, maxWidth, size, wraps;
      this.resetMinimapWidthWithWrap();
      size = atom.config.get('editor.preferredLineLength');
      wraps = atom.config.get('editor.softWrap');
      adjustWidth = atom.config.get('minimap.adjustMinimapWidthToSoftWrap');
      displayLeft = atom.config.get('minimap.displayMinimapOnLeft');
      maxWidth = size * this.getCharWidth();
      if (wraps && adjustWidth && size && this.width() > maxWidth) {
        maxWidth = maxWidth + 'px';
        this.css({
          maxWidth: maxWidth
        });
        if (displayLeft) {
          return this.editorView.style.paddingLeft = maxWidth;
        } else {
          this.editorView.style.paddingRight = maxWidth;
          return this.getEditorViewRoot().querySelector('.vertical-scrollbar').style.right = maxWidth;
        }
      }
    };

    MinimapView.prototype.resetMinimapWidthWithWrap = function() {
      var _ref2;
      this.css({
        maxWidth: ''
      });
      this.editorView.style.paddingRight = '';
      this.editorView.style.paddingLeft = '';
      return (_ref2 = this.getEditorViewRoot().querySelector('.vertical-scrollbar')) != null ? _ref2.style.right = '' : void 0;
    };

    MinimapView.prototype.updateScrollY = function(top) {
      var overlayY, overlayerOffset, scrollViewOffset;
      if (top != null) {
        overlayY = top;
      } else {
        scrollViewOffset = this.getEditorViewClientRect().top;
        overlayerOffset = this.getScrollViewClientRect().top;
        overlayY = -overlayerOffset + scrollViewOffset;
      }
      this.indicator.setY(overlayY * this.scaleY);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScrollX = function() {
      this.indicator.setX(this.editor.getScrollLeft());
      return this.updatePositions();
    };

    MinimapView.prototype.updateScroll = function() {
      this.indicator.setX(this.editor.getScrollTop());
      this.updateScrollY();
      return this.emitter.emit('did-scroll');
    };

    MinimapView.prototype.updatePositions = function() {
      this.transform(this.miniVisibleArea[0], this.translate(0, this.indicator.y));
      this.renderView.scrollTop(this.indicator.scroller.y * -1);
      this.transform(this.renderView[0], this.translate(0, this.indicator.scroller.y + this.getFirstVisibleScreenRow() * this.getLineHeight()));
      this.transform(this.miniUnderlayer[0], this.translate(0, this.indicator.scroller.y));
      this.transform(this.miniOverlayer[0], this.translate(0, this.indicator.scroller.y));
      return this.updateScrollerPosition();
    };

    MinimapView.prototype.updateScrollerPosition = function() {
      var height, scrollRange, totalHeight;
      height = this.miniScroller.height();
      totalHeight = this.height();
      scrollRange = totalHeight - height;
      return this.transform(this.miniScroller[0], this.translate(0, this.indicator.ratioY * scrollRange));
    };

    MinimapView.prototype.updateTopPosition = function() {
      return this.offset({
        top: (this.offsetTop = this.editorView.getBoundingClientRect().top)
      });
    };


    /* Internal */

    MinimapView.prototype.subscribeToEditor = function() {
      this.subscriptions.add(this.editor.onDidChangeScrollTop(this.updateScrollY));
      this.subscriptions.add(this.editor.onDidChangeScrollLeft(this.updateScrollX));
      this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          return _this.editorView.removeEventListener('focus');
        };
      })(this)));
      return this.editorView.addEventListener('focus', (function(_this) {
        return function() {
          var pane, paneView;
          pane = atom.workspace.paneForItem(_this.editor);
          paneView = atom.views.getView(pane);
          if (paneView !== _this.paneView) {
            _this.detachFromPaneView();
            _this.paneView = paneView;
            _this.attachToPaneView();
          }
          return true;
        };
      })(this));
    };

    MinimapView.prototype.unsubscribeFromEditor = function() {
      return this.subscriptions.dispose();
    };

    MinimapView.prototype.onActiveItemChanged = function(activeItem) {
      if (activeItem === this.editor) {
        if (this.parent().length === 0) {
          this.attachToPaneView();
        }
        this.updateMinimapView();
        return this.renderView.forceUpdate();
      } else {
        if (this.parent().length === 1) {
          return this.detachFromPaneView();
        }
      }
    };

    MinimapView.prototype.onMouseWheel = function(e) {
      var wheelDeltaX, wheelDeltaY;
      if (this.isClicked) {
        return;
      }
      wheelDeltaX = e.wheelDeltaX, wheelDeltaY = e.wheelDeltaY;
      if (wheelDeltaX) {
        this.editor.setScrollLeft(this.editor.getScrollLeft() - wheelDeltaX);
      }
      if (wheelDeltaY) {
        return this.editor.setScrollTop(this.editor.getScrollTop() - wheelDeltaY);
      }
    };

    MinimapView.prototype.onMouseDown = function(e) {
      var top, y;
      if (e.which !== 1) {
        return;
      }
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      y = e.pageY - this.offsetTop;
      top = this.indicator.computeFromCenterY(y) / this.scaleY;
      this.editor.scrollToScreenPosition({
        top: top,
        left: 0
      });
      return setTimeout((function(_this) {
        return function() {
          return _this.isClicked = false;
        };
      })(this), 377);
    };

    MinimapView.prototype.onScrollViewResized = function() {
      this.renderView.lineCanvas.height(this.editorView.clientHeight);
      this.updateMinimapSize();
      this.updateMinimapView();
      this.updateMinimapWidthWithWrap();
      return this.renderView.forceUpdate();
    };

    MinimapView.prototype.onDragStart = function(e) {
      var y;
      if (e.which !== 1) {
        return;
      }
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      y = e.pageY - this.offsetTop;
      this.grabY = y - (this.indicator.y + this.indicator.scroller.y);
      return this.on('mousemove.visible-area', this.onMove);
    };

    MinimapView.prototype.onMove = function(e) {
      if (e.which === 1) {
        return this.onDrag(e);
      } else {
        this.isClicked = false;
        return this.off('.visible-area');
      }
    };

    MinimapView.prototype.onDrag = function(e) {
      var top, y;
      y = e.pageY - this.offsetTop;
      top = (y - this.grabY) * (this.indicator.scroller.height - this.indicator.height) / (this.indicator.wrapper.height - this.indicator.height);
      return this.editor.setScrollTop(top / this.scaleY);
    };

    MinimapView.prototype.translate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (atom.config.get('minimap.useHardwareAcceleration')) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapView.prototype.scale = function(scale) {
      return " scale(" + scale + ", " + scale + ")";
    };

    MinimapView.prototype.transform = function(el, transform) {
      return el.style.webkitTransform = el.style.transform = transform;
    };

    return MinimapView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdKQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsc0JBQVIsQ0FBWixFQUFDLFNBQUEsQ0FBRCxFQUFJLFlBQUEsSUFBSixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUVBLFFBQTZDLE9BQUEsQ0FBUSxXQUFSLENBQTdDLEVBQUMsNEJBQUEsbUJBQUQsRUFBc0IsbUJBQUEsVUFBdEIsRUFBa0MsZ0JBQUEsT0FGbEMsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQUpwQixDQUFBOztBQUFBLEVBS0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBTG5CLENBQUE7O0FBQUEsRUFNQSw0QkFBQSxHQUErQixPQUFBLENBQVEsb0NBQVIsQ0FOL0IsQ0FBQTs7QUFBQSxFQXdDQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osa0NBQUEsQ0FBQTs7QUFBQSxJQUFBLFFBQVEsQ0FBQyxXQUFULENBQXFCLFdBQXJCLENBQUEsQ0FBQTs7QUFBQSxJQUVBLFdBQUMsQ0FBQSxnQkFBRCxDQUFrQixlQUFsQixFQUFtQyxlQUFuQyxFQUFvRCxjQUFwRCxFQUFvRSxlQUFwRSxFQUFxRixrQkFBckYsRUFBeUcsd0JBQXpHLEVBQW1JLHlCQUFuSSxFQUE4SiwwQkFBOUosRUFBMEwseUJBQTFMLEVBQXFOLGdDQUFyTixFQUF1UCxnQkFBdlAsRUFBeVEsa0JBQXpRLEVBQTZSLDhCQUE3UixFQUE2VCwrQkFBN1QsRUFBOFY7QUFBQSxNQUFBLFVBQUEsRUFBWSxZQUFaO0tBQTlWLENBRkEsQ0FBQTs7QUFBQSxJQUlBLFdBQUMsQ0FBQSxnQkFBRCxDQUFrQixjQUFsQixFQUFrQyxl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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-view.coffee