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
      return atom.config.observe('minimap.minimapScrollIndicator', (function(_this) {
        return function() {
          _this.miniScrollVisible = atom.config.get('minimap.minimapScrollIndicator');
          return _this.miniScroller.toggleClass('visible', _this.miniScrollVisible);
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
      return setImmediate((function(_this) {
        return function() {
          return _this.updateScroll();
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
      return "translate(" + x + "px, " + y + "px)";
    };

    MinimapView.prototype.transform = function(el, transform) {
      return el.style.webkitTransform = el.style.transform = transform;
    };

    return MinimapView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFHQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUEsT0FBd0IsT0FBQSxDQUFRLE1BQVIsQ0FBeEIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxrQkFBQSxVQUFWLENBQUE7O0FBQUEsRUFDQSxLQUFBLEdBQVEsT0FBQSxDQUFRLFFBQVIsQ0FEUixDQUFBOztBQUFBLEVBRUEsUUFBQSxHQUFXLE9BQUEsQ0FBUSxVQUFSLENBRlgsQ0FBQTs7QUFBQSxFQUlBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSx1QkFBUixDQUpwQixDQUFBOztBQUFBLEVBS0EsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBTG5CLENBQUE7O0FBQUEsRUFNQSxPQUFBLEdBQVUsT0FBQSxDQUFRLFVBQVIsQ0FOVixDQUFBOztBQUFBLEVBUUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLGtDQUFBLENBQUE7O0FBQUEsSUFBQSxLQUFBLENBQU0sU0FBTixDQUFnQixDQUFDLFdBQWpCLENBQTZCLFdBQTdCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFFBQVEsQ0FBQyxXQUFULENBQXFCLFdBQXJCLENBREEsQ0FBQTs7QUFBQSxJQUdBLFdBQUMsQ0FBQSxnQkFBRCxDQUFrQixlQUFsQixFQUFtQyxlQUFuQyxFQUFvRCxrQkFBcEQsRUFBd0Usd0JBQXhFLEVBQWtHLHlCQUFsRyxFQUE2SCwwQkFBN0gsRUFBeUoseUJBQXpKLEVBQW9MLGNBQXBMLEVBQW9NLGlCQUFwTSxFQUF1TixzQkFBdk4sRUFBK087QUFBQSxNQUFBLFVBQUEsRUFBWSxnQkFBWjtLQUEvTyxDQUhBLENBQUE7O0FBQUEsSUFLQSxXQUFDLENBQUEsT0FBRCxHQUFVLFNBQUEsR0FBQTthQUNSLElBQUMsQ0FBQSxHQUFELENBQUs7QUFB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-view.coffee