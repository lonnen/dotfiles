(function() {
  var $, CONFIGS, Debug, Delegato, EditorView, MinimapEditorView, MinimapIndicator, MinimapView, View, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), $ = _ref.$, View = _ref.View, EditorView = _ref.EditorView;

  Debug = require('prolix');

  Delegato = require('delegato');

  MinimapEditorView = require('./minimap-editor-view');

  MinimapIndicator = require('./minimap-indicator');

  CONFIGS = require('./config');

  module.exports = MinimapView = (function(_super) {
    __extends(MinimapView, _super);

    Debug('minimap').includeInto(MinimapView);

    Delegato.includeInto(MinimapView);

    MinimapView.delegatesMethods('getLineHeight', 'getLinesCount', 'getMinimapHeight', 'getMinimapScreenHeight', 'getMinimapHeightInLines', 'getFirstVisibleScreenRow', 'getLastVisibleScreenRow', 'addLineClass', 'removeLineClass', 'removeAllLineClasses', {
      toProperty: 'miniEditorView'
    });

    MinimapView.content = function() {
      return this.div({
        "class": 'minimap'
      }, (function(_this) {
        return function() {
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
            _this.subview('miniEditorView', new MinimapEditorView());
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

    MinimapView.prototype.configs = {};

    MinimapView.prototype.isClicked = false;

    function MinimapView(editorView) {
      this.editorView = editorView;
      this.onDragEnd = __bind(this.onDragEnd, this);
      this.onMove = __bind(this.onMove, this);
      this.onDragStart = __bind(this.onDragStart, this);
      this.onScrollViewResized = __bind(this.onScrollViewResized, this);
      this.onMouseDown = __bind(this.onMouseDown, this);
      this.onMouseWheel = __bind(this.onMouseWheel, this);
      this.onActiveItemChanged = __bind(this.onActiveItemChanged, this);
      this.updateScroll = __bind(this.updateScroll, this);
      this.updateScrollX = __bind(this.updateScrollX, this);
      this.updateScrollY = __bind(this.updateScrollY, this);
      this.updateMinimapView = __bind(this.updateMinimapView, this);
      this.updateMinimapEditorView = __bind(this.updateMinimapEditorView, this);
      this.editor = this.editorView.getEditor();
      this.paneView = this.editorView.getPane();
      MinimapView.__super__.constructor.apply(this, arguments);
      this.scaleX = 0.2;
      this.scaleY = this.scaleX * 0.8;
      this.minimapScale = this.scale(this.scaleX, this.scaleY);
      this.miniScrollView = this.miniEditorView.scrollView;
      this.transform(this.miniWrapper[0], this.minimapScale);
      this.isPressed = false;
      this.offsetLeft = 0;
      this.offsetTop = 0;
      this.indicator = new MinimapIndicator();
      this.scrollView = this.editorView.scrollView;
      this.scrollViewLines = this.scrollView.find('.lines');
      this.subscribeToEditor();
      this.miniEditorView.minimapView = this;
      this.miniEditorView.setEditorView(this.editorView);
      this.updateMinimapView();
    }

    MinimapView.prototype.initialize = function() {
      var themeProp;
      this.on('mousewheel', this.onMouseWheel);
      this.on('mousedown', this.onMouseDown);
      this.on('mousedown', '.minimap-visible-area', this.onDragStart);
      this.subscribe(this.paneView.model.$activeItem, this.onActiveItemChanged);
      this.subscribe(this.paneView.model, 'item-removed', function(item) {
        return typeof item.off === "function" ? item.off('.minimap') : void 0;
      });
      this.subscribe(this.miniEditorView, 'minimap:updated', this.updateMinimapView);
      this.subscribe($(window), 'resize:end', this.onScrollViewResized);
      themeProp = 'minimap.theme';
      this.subscribe(atom.config.observe(themeProp, {
        callNow: true
      }, (function(_this) {
        return function() {
          var _ref1;
          _this.configs.theme = (_ref1 = atom.config.get(themeProp)) != null ? _ref1 : CONFIGS.theme;
          return _this.updateTheme();
        };
      })(this)));
      this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
      this.miniScroller.toggleClass('visible', this.miniScrollVisible);
      atom.config.observe('minimap.minimapScrollIndicator', (function(_this) {
        return function() {
          _this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
          return _this.miniScroller.toggleClass('visible', _this.miniScrollVisible);
        };
      })(this));
      return atom.config.observe('minimap.useHardwareAcceleration', (function(_this) {
        return function() {
          if (_this.ScrollView != null) {
            return _this.updateScroll();
          }
        };
      })(this));
    };

    MinimapView.prototype.destroy = function() {
      this.off();
      this.unsubscribe();
      this.detachFromPaneView();
      this.miniEditorView.destroy();
      return this.remove();
    };

    MinimapView.prototype.attachToPaneView = function() {
      this.paneView.addClass('with-minimap');
      return this.paneView.append(this);
    };

    MinimapView.prototype.detachFromPaneView = function() {
      this.paneView.removeClass('with-minimap');
      return this.detach();
    };

    MinimapView.prototype.minimapIsAttached = function() {
      return this.paneView.find('.minimap').length === 1;
    };

    MinimapView.prototype.unsubscribeFromEditor = function() {
      if (this.editor != null) {
        this.unsubscribe(this.editor, '.minimap');
      }
      if (this.scrollView != null) {
        return this.unsubscribe(this.scrollView, '.minimap');
      }
    };

    MinimapView.prototype.subscribeToEditor = function() {
      this.subscribe(this.editor, 'scroll-top-changed.minimap', this.updateScrollY);
      return this.subscribe(this.scrollView, 'scroll.minimap', this.updateScrollX);
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

    MinimapView.prototype.updateTheme = function() {
      return this.attr({
        'data-theme': this.configs.theme
      });
    };

    MinimapView.prototype.updateMinimapEditorView = function() {
      return this.miniEditorView.update();
    };

    MinimapView.prototype.updateMinimapView = function() {
      var editorViewRect, evh, evw, height, miniScrollViewRect, minimapVisibilityRatio, msvh, msvw, width, _ref1;
      if (!this.editorView) {
        return;
      }
      if (!this.indicator) {
        return;
      }
      this.offset({
        top: (this.offsetTop = this.editorView.offset().top)
      });
      _ref1 = this.getMinimapClientRect(), width = _ref1.width, height = _ref1.height;
      editorViewRect = this.getEditorViewClientRect();
      miniScrollViewRect = this.miniEditorView.getClientRect();
      width /= this.scaleX;
      height /= this.scaleY;
      evw = editorViewRect.width;
      evh = editorViewRect.height;
      minimapVisibilityRatio = miniScrollViewRect.height / height;
      this.miniScroller.height(evh / minimapVisibilityRatio);
      this.miniScroller.toggleClass('visible', minimapVisibilityRatio > 1 && this.miniScrollVisible);
      this.miniWrapper.css({
        width: width
      });
      this.miniVisibleArea.css({
        width: this.indicator.width = width,
        height: this.indicator.height = evh
      });
      msvw = miniScrollViewRect.width || 0;
      msvh = miniScrollViewRect.height || 0;
      this.indicator.setWrapperSize(width, Math.min(height, msvh));
      this.indicator.setScrollerSize(msvw, msvh);
      this.indicator.updateBoundary();
      if (this.frameRequested) {
        return;
      }
      this.frameRequested = true;
      return webkitRequestAnimationFrame((function(_this) {
        return function() {
          _this.updateScroll();
          return _this.frameRequested = false;
        };
      })(this));
    };

    MinimapView.prototype.updateScrollY = function(top) {
      var overlayY, overlayerOffset, scrollViewOffset;
      if (top != null) {
        overlayY = top;
      } else {
        scrollViewOffset = this.scrollView.offset().top;
        overlayerOffset = this.scrollView.find('.overlayer').offset().top;
        overlayY = -overlayerOffset + scrollViewOffset;
      }
      this.indicator.setY(overlayY);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScrollX = function() {
      this.indicator.setX(this.scrollView[0].scrollLeft);
      return this.updatePositions();
    };

    MinimapView.prototype.updateScroll = function() {
      this.updateScrollX();
      this.updateScrollY();
      return this.trigger('minimap:scroll');
    };

    MinimapView.prototype.updatePositions = function() {
      this.transform(this.miniVisibleArea[0], this.translate(this.indicator.x, this.indicator.y));
      this.transform(this.miniWrapper[0], this.minimapScale + this.translate(this.indicator.scroller.x, this.indicator.scroller.y));
      this.miniEditorView.scrollTop(this.indicator.scroller.y * -1);
      return this.updateScrollerPosition();
    };

    MinimapView.prototype.updateScrollerPosition = function() {
      var height, scrollRange, totalHeight;
      height = this.miniScroller.height();
      totalHeight = this.height();
      scrollRange = totalHeight - height;
      return this.transform(this.miniScroller[0], this.translate(0, this.indicator.ratioY * scrollRange));
    };

    MinimapView.prototype.onActiveItemChanged = function(item) {
      var activeView;
      activeView = this.paneView.viewForItem(item);
      if (activeView === this.editorView) {
        if (this.parent().length === 0) {
          this.attachToPaneView();
        }
        this.updateMinimapEditorView();
        return this.updateMinimapView();
      } else {
        if (this.parent().length === 1) {
          this.detachFromPaneView();
        }
        if (activeView != null ? activeView.hasClass('editor') : void 0) {
          return this.paneView.addClass('with-minimap');
        }
      }
    };

    MinimapView.prototype.onMouseWheel = function(e) {
      var wheelDeltaX, wheelDeltaY, _ref1;
      if (this.isClicked) {
        return;
      }
      _ref1 = e.originalEvent, wheelDeltaX = _ref1.wheelDeltaX, wheelDeltaY = _ref1.wheelDeltaY;
      if (wheelDeltaX) {
        this.editorView.scrollLeft(this.editorView.scrollLeft() - wheelDeltaX);
      }
      if (wheelDeltaY) {
        return this.editorView.scrollTop(this.editorView.scrollTop() - wheelDeltaY);
      }
    };

    MinimapView.prototype.onMouseDown = function(e) {
      var top, y;
      this.isClicked = true;
      e.preventDefault();
      e.stopPropagation();
      y = e.pageY - this.offsetTop;
      top = this.indicator.computeFromCenterY(y / this.scaleY);
      this.editorView.scrollTop(top);
      return setTimeout((function(_this) {
        return function() {
          return _this.isClicked = false;
        };
      })(this), 377);
    };

    MinimapView.prototype.onScrollViewResized = function() {
      return this.updateMinimapView();
    };

    MinimapView.prototype.onDragStart = function(e) {
      if (e.which !== 1) {
        return;
      }
      this.isPressed = true;
      this.on('mousemove.visible-area', this.onMove);
      return this.on('mouseup.visible-area', this.onDragEnd);
    };

    MinimapView.prototype.onMove = function(e) {
      if (this.isPressed) {
        return this.onMouseDown(e);
      }
    };

    MinimapView.prototype.onDragEnd = function(e) {
      this.isPressed = false;
      return this.off('.visible-area');
    };

    MinimapView.prototype.scale = function(x, y) {
      if (x == null) {
        x = 1;
      }
      if (y == null) {
        y = 1;
      }
      return "scale(" + x + ", " + y + ") ";
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

    MinimapView.prototype.transform = function(el, transform) {
      return el.style.webkitTransform = el.style.transform = transform;
    };

    return MinimapView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBd0IsT0FBQSxDQUFRLE1BQVIsQ0FBeEIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxrQkFBQSxVQUFWLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQUpwQixDQUFBOztBQUFBLEVBS0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBTG5CLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FOVixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7O0FBQUEsSUFBQSxLQUFBLENBQU0sU0FBTixDQUFnQixDQUFDLFdBQWpCLENBQTZCLFdBQTdCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFFBQVEsQ0FBQyxXQUFULENBQXFCLFdBQXJCLENBREEsQ0FBQTs7QUFBQSxJQUdBLFdBQUMsQ0FBQSxnQkFBRCxDQUFrQixlQUFsQixFQUFtQyxlQUFuQyxFQUFvRCxrQkFBcEQsRUFBd0Usd0JBQXhFLEVBQWtHLHlCQUFsRyxFQUE2SCwwQkFBN0gsRUFBeUoseUJBQXpKLEVBQW9MLGNBQXBMLEVBQW9NLGlCQUFwTSxFQUF1TixzQkFBdk4sRUFBK087QUFBQSxNQUFBLFVBQUEsRUFBWSxnQkFBWjtLQUEvTyxDQUhBLENBQUE7O0FBQUEsSUFLQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-view.coffee