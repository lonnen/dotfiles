(function() {
  var $, CompositeDisposable, Delegato, Disposable, MinimapIndicator, MinimapOpenQuickSettingsView, MinimapRenderView, MinimapView, View, _ref, _ref1,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View;

  Delegato = require('delegato');

  _ref1 = require('event-kit'), CompositeDisposable = _ref1.CompositeDisposable, Disposable = _ref1.Disposable;

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
      this.setEditorView(editorView);
      this.paneView.addClass('with-minimap');
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
      this.scrollView = this.editorView.scrollView;
      this.scrollViewLines = this.scrollView.find('.lines');
      this.subscribeToEditor();
      this.renderView.minimapView = this;
      this.renderView.setEditorView(this.editorView);
      this.updateMinimapView();
    }

    MinimapView.prototype.initialize = function() {
      var config;
      this.on('mousewheel', this.onMouseWheel);
      this.on('mousedown', this.onMouseDown);
      this.miniVisibleArea.on('mousedown', this.onDragStart);
      this.obsPane = this.paneView.model.observeActiveItem(this.onActiveItemChanged);
      this.subscribe(this.renderView, 'minimap:updated', this.updateMinimapSize);
      this.subscribe(this.renderView, 'minimap:scaleChanged', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updatePositions();
        };
      })(this));
      this.observer = new MutationObserver((function(_this) {
        return function(mutations) {
          return _this.updateTopPosition();
        };
      })(this));
      config = {
        childList: true
      };
      this.observer.observe(this.paneView.element, config);
      this.subscriptions.add(atom.themes.onDidReloadAll((function(_this) {
        return function() {
          _this.updateTopPosition();
          return _this.updateMinimapView();
        };
      })(this)));
      this.subscribe($(window), 'resize:end', this.onScrollViewResized);
      this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
      this.miniScroller.toggleClass('visible', this.miniScrollVisible);
      this.displayCodeHighlights = atom.config.get('minimap.displayCodeHighlights');
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.minimapScrollIndicator', (function(_this) {
        return function() {
          _this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
          return _this.miniScroller.toggleClass('visible', _this.miniScrollVisible);
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.useHardwareAcceleration', (function(_this) {
        return function() {
          if (_this.ScrollView != null) {
            return _this.updateScroll();
          }
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.displayCodeHighlights', (function(_this) {
        return function() {
          var newOptionValue;
          newOptionValue = atom.config.get('minimap.displayCodeHighlights');
          return _this.setDisplayCodeHighlights(newOptionValue);
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('minimap.adjustMinimapWidthToSoftWrap', (function(_this) {
        return function(value) {
          if (value) {
            return _this.updateMinimapSize();
          } else {
            return _this.resetMinimapWidthWithWrap();
          }
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('editor.lineHeight', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updateMinimapView();
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('editor.fontSize', (function(_this) {
        return function() {
          _this.computeScale();
          return _this.updateMinimapView();
        };
      })(this))));
      this.subscriptions.add(this.asDisposable(atom.config.observe('editor.softWrap', (function(_this) {
        return function() {
          _this.updateMinimapSize();
          return _this.updateMinimapView();
        };
      })(this))));
      return this.subscriptions.add(this.asDisposable(atom.config.observe('editor.preferredLineLength', (function(_this) {
        return function() {
          return _this.updateMinimapSize();
        };
      })(this))));
    };

    MinimapView.prototype.computeScale = function() {
      var computedLineHeight, originalLineHeight;
      originalLineHeight = parseInt(this.editorView.find('.lines').css('line-height'));
      computedLineHeight = this.getLineHeight();
      return this.scaleX = this.scaleY = computedLineHeight / originalLineHeight;
    };

    MinimapView.prototype.destroy = function() {
      this.resetMinimapWidthWithWrap();
      this.paneView.removeClass('with-minimap');
      this.off();
      this.obsPane.dispose();
      this.subscriptions.dispose();
      this.unsubscribe();
      this.observer.disconnect();
      this.detachFromPaneView();
      this.renderView.destroy();
      return this.remove();
    };

    MinimapView.prototype.setEditorView = function(editorView) {
      var _ref2;
      this.editorView = editorView;
      this.editor = this.editorView.getEditor();
      this.paneView = this.editorView.getPaneView();
      if ((_ref2 = this.renderView) != null) {
        _ref2.setEditorView(this.editorView);
      }
      if (this.obsPane != null) {
        this.obsPane.dispose();
        return this.obsPane = this.paneView.model.observeActiveItem(this.onActiveItemChanged);
      }
    };

    MinimapView.prototype.setDisplayCodeHighlights = function(value) {
      if (value !== this.displayCodeHighlights) {
        this.displayCodeHighlights = value;
        return this.renderView.forceUpdate();
      }
    };

    MinimapView.prototype.attachToPaneView = function() {
      this.paneView.append(this);
      return this.updateTopPosition();
    };

    MinimapView.prototype.detachFromPaneView = function() {
      return this.detach();
    };

    MinimapView.prototype.minimapIsAttached = function() {
      return this.paneView.find('.minimap').length === 1;
    };

    MinimapView.prototype.getEditorViewClientRect = function() {
      return this.scrollView[0].getBoundingClientRect();
    };

    MinimapView.prototype.getScrollViewClientRect = function() {
      return this.scrollViewLines[0].getBoundingClientRect();
    };

    MinimapView.prototype.getMinimapClientRect = function() {
      return this[0].getBoundingClientRect();
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
      if (wraps && adjustWidth && size) {
        maxWidth = (size * this.getCharWidth()) + 'px';
        this.css({
          maxWidth: maxWidth
        });
        if (displayLeft) {
          return this.editorView.css({
            paddingLeft: maxWidth
          });
        } else {
          this.editorView.css({
            paddingRight: maxWidth
          });
          return this.editorView.find('.vertical-scrollbar').css({
            right: maxWidth
          });
        }
      }
    };

    MinimapView.prototype.resetMinimapWidthWithWrap = function() {
      this.css({
        maxWidth: ''
      });
      this.editorView.css({
        paddingRight: '',
        paddingLeft: ''
      });
      return this.editorView.find('.vertical-scrollbar').css({
        right: ''
      });
    };

    MinimapView.prototype.updateScrollY = function(top) {
      var overlayY, overlayerOffset, scrollViewOffset;
      if (top != null) {
        overlayY = top;
      } else {
        scrollViewOffset = this.scrollView.offset().top;
        overlayerOffset = this.scrollView.find('.lines').offset().top;
        overlayY = -overlayerOffset + scrollViewOffset;
      }
      this.indicator.setY(overlayY * this.scaleY);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScrollX = function() {
      this.indicator.setX(this.scrollView[0].scrollLeft);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScroll = function() {
      this.indicator.setX(this.scrollView[0].scrollLeft);
      this.updateScrollY();
      return this.trigger('minimap:scroll');
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
        top: (this.offsetTop = this.editorView.offset().top)
      });
    };


    /* Internal */

    MinimapView.prototype.subscribeToEditor = function() {
      this.subscribe(this.editor, 'scroll-top-changed.minimap', this.updateScrollY);
      return this.subscribe(this.scrollView, 'scroll.minimap', this.updateScrollX);
    };

    MinimapView.prototype.unsubscribeFromEditor = function() {
      if (this.editor != null) {
        this.unsubscribe(this.editor, '.minimap');
      }
      if (this.scrollView != null) {
        return this.unsubscribe(this.scrollView, '.minimap');
      }
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
      var wheelDeltaX, wheelDeltaY, _ref2;
      if (this.isClicked) {
        return;
      }
      _ref2 = e.originalEvent, wheelDeltaX = _ref2.wheelDeltaX, wheelDeltaY = _ref2.wheelDeltaY;
      if (wheelDeltaX) {
        this.editorView.scrollLeft(this.editorView.scrollLeft() - wheelDeltaX);
      }
      if (wheelDeltaY) {
        return this.editorView.scrollTop(this.editorView.scrollTop() - wheelDeltaY);
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
      this.editorView.scrollTop(top);
      return setTimeout((function(_this) {
        return function() {
          return _this.isClicked = false;
        };
      })(this), 377);
    };

    MinimapView.prototype.onScrollViewResized = function() {
      this.renderView.lineCanvas.height(this.editorView.height());
      this.updateMinimapSize();
      this.updateMinimapView();
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
      return this.editorView.scrollTop(top / this.scaleY);
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

    MinimapView.prototype.asDisposable = function(subscription) {
      return new Disposable(function() {
        return subscription.off();
      });
    };

    return MinimapView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtJQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBWSxPQUFBLENBQVEsTUFBUixDQUFaLEVBQUMsU0FBQSxDQUFELEVBQUksWUFBQSxJQUFKLENBQUE7O0FBQUEsRUFDQSxRQUFBLEdBQVcsT0FBQSxDQUFRLFVBQVIsQ0FEWCxDQUFBOztBQUFBLEVBRUEsUUFBb0MsT0FBQSxDQUFRLFdBQVIsQ0FBcEMsRUFBQyw0QkFBQSxtQkFBRCxFQUFzQixtQkFBQSxVQUZ0QixDQUFBOztBQUFBLEVBSUEsaUJBQUEsR0FBb0IsT0FBQSxDQUFRLHVCQUFSLENBSnBCLENBQUE7O0FBQUEsRUFLQSxnQkFBQSxHQUFtQixPQUFBLENBQVEscUJBQVIsQ0FMbkIsQ0FBQTs7QUFBQSxFQU1BLDRCQUFBLEdBQStCLE9BQUEsQ0FBUSxvQ0FBUixDQU4vQixDQUFBOztBQUFBLEVBd0NBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSixrQ0FBQSxDQUFBOztBQUFBLElBQUEsUUFBUSxDQUFDLFdBQVQsQ0FBcUIsV0FBckIsQ0FBQSxDQUFBOztBQUFBLElBRUEsV0FBQyxDQUFBLGdCQUFELENBQWtCLGVBQWxCLEVBQW1DLGVBQW5DLEVBQW9ELGNBQXBELEVBQW9FLGVBQXBFLEVBQXFGLGtCQUFyRixFQUF5Ryx3QkFBekcsRUFBbUkseUJBQW5JLEVBQThKLDBCQUE5SixFQUEwTCx5QkFBMUwsRUFBcU4sZ0NBQXJOLEVBQXVQLGdCQUF2UCxFQUF5USxrQkFBelEsRUFBNlIsOEJBQTdSLEVBQTZULCtCQUE3VCxFQUE4VjtBQUFBLE1BQUEsVUFBQSxFQUFZLFlBQVo7S0FBOVYsQ0FGQSxDQUFBOztBQUFBLElBSUEsV0FBQyxDQUFBLGdCQUFELENBQWtCLGNBQWxCLEVBQWtDLGVBQWxDLEVBQW1ELGtCQUFuRCxF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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-view.coffee