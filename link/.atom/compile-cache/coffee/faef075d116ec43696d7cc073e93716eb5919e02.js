(function() {
  var CanvasDrawer, CompositeDisposable, DOMStylesReader, Disposable, MinimapElement, MinimapQuickSettingsView, debounce, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  debounce = require('underscore-plus').debounce;

  _ref = require('event-kit'), CompositeDisposable = _ref.CompositeDisposable, Disposable = _ref.Disposable;

  DOMStylesReader = require('./mixins/dom-styles-reader');

  CanvasDrawer = require('./mixins/canvas-drawer');

  MinimapQuickSettingsView = null;

  MinimapElement = (function(_super) {
    __extends(MinimapElement, _super);

    function MinimapElement() {
      this.relayMousewheelEvent = __bind(this.relayMousewheelEvent, this);
      return MinimapElement.__super__.constructor.apply(this, arguments);
    }

    DOMStylesReader.includeInto(MinimapElement);

    CanvasDrawer.includeInto(MinimapElement);


    /* Public */

    MinimapElement.prototype.domPollingInterval = 100;

    MinimapElement.prototype.domPollingIntervalId = null;

    MinimapElement.prototype.domPollingPaused = false;

    MinimapElement.prototype.displayMinimapOnLeft = false;

    MinimapElement.prototype.createdCallback = function() {
      this.subscriptions = new CompositeDisposable;
      this.initializeContent();
      this.subscriptions.add(atom.themes.onDidChangeActiveThemes((function(_this) {
        return function() {
          _this.invalidateCache();
          return _this.requestForcedUpdate();
        };
      })(this)));
      return this.observeConfig({
        'minimap.displayMinimapOnLeft': (function(_this) {
          return function(displayMinimapOnLeft) {
            var swapPosition;
            swapPosition = (_this.minimap != null) && displayMinimapOnLeft !== _this.displayMinimapOnLeft;
            _this.displayMinimapOnLeft = displayMinimapOnLeft;
            if (swapPosition) {
              return _this.swapMinimapPosition();
            }
          };
        })(this),
        'minimap.minimapScrollIndicator': (function(_this) {
          return function(minimapScrollIndicator) {
            _this.minimapScrollIndicator = minimapScrollIndicator;
            if (_this.minimapScrollIndicator && (_this.scrollIndicator == null)) {
              _this.initializeScrollIndicator();
            } else if (_this.scrollIndicator != null) {
              _this.disposeScrollIndicator();
            }
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this),
        'minimap.displayPluginsControls': (function(_this) {
          return function(displayPluginsControls) {
            _this.displayPluginsControls = displayPluginsControls;
            if (_this.displayPluginsControls && (_this.openQuickSettings == null)) {
              return _this.initializeOpenQuickSettings();
            } else if (_this.openQuickSettings != null) {
              return _this.disposeOpenQuickSettings();
            }
          };
        })(this),
        'minimap.textOpacity': (function(_this) {
          return function(textOpacity) {
            _this.textOpacity = textOpacity;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.displayCodeHighlights': (function(_this) {
          return function(displayCodeHighlights) {
            _this.displayCodeHighlights = displayCodeHighlights;
            if (_this.attached) {
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.adjustMinimapWidthToSoftWrap': (function(_this) {
          return function(adjustToSoftWrap) {
            _this.adjustToSoftWrap = adjustToSoftWrap;
            if (_this.attached) {
              _this.measureHeightAndWidth();
              return _this.requestForcedUpdate();
            }
          };
        })(this),
        'minimap.useHardwareAcceleration': (function(_this) {
          return function(useHardwareAcceleration) {
            _this.useHardwareAcceleration = useHardwareAcceleration;
            if (_this.attached) {
              return _this.requestUpdate();
            }
          };
        })(this)
      });
    };

    MinimapElement.prototype.attachedCallback = function() {
      this.domPollingIntervalId = setInterval(((function(_this) {
        return function() {
          return _this.pollDOM();
        };
      })(this)), this.domPollingInterval);
      this.measureHeightAndWidth();
      this.requestUpdate();
      return this.attached = true;
    };

    MinimapElement.prototype.detachedCallback = function() {
      clearInterval(this.domPollingIntervalId);
      return this.attached = false;
    };

    MinimapElement.prototype.attributeChangedCallback = function(attrName, oldValue, newValue) {};

    MinimapElement.prototype.isVisible = function() {
      return this.offsetWidth > 0 || this.offsetHeight > 0;
    };

    MinimapElement.prototype.attach = function() {
      if (this.attached) {
        return;
      }
      this.swapMinimapPosition();
      return this.attached = true;
    };

    MinimapElement.prototype.attachToLeft = function() {
      var root;
      root = this.getTextEditorElementRoot();
      return root.insertBefore(this, root.children[0]);
    };

    MinimapElement.prototype.attachToRight = function() {
      return this.getTextEditorElementRoot().appendChild(this);
    };

    MinimapElement.prototype.swapMinimapPosition = function() {
      if (this.displayMinimapOnLeft) {
        return this.attachToLeft();
      } else {
        return this.attachToRight();
      }
    };

    MinimapElement.prototype.detach = function() {
      if (!this.attached) {
        return;
      }
      if (this.parentNode == null) {
        return;
      }
      return this.parentNode.removeChild(this);
    };

    MinimapElement.prototype.destroy = function() {
      this.subscriptions.dispose();
      return this.detach();
    };

    MinimapElement.prototype.initializeContent = function() {
      var canvasMousedown, elementMousewheel, visibleAreaMousedown;
      this.initializeCanvas();
      this.shadowRoot = this.createShadowRoot();
      this.shadowRoot.appendChild(this.canvas);
      this.visibleArea = document.createElement('div');
      this.visibleArea.classList.add('minimap-visible-area');
      this.shadowRoot.appendChild(this.visibleArea);
      this.controls = document.createElement('div');
      this.controls.classList.add('minimap-controls');
      this.shadowRoot.appendChild(this.controls);
      elementMousewheel = (function(_this) {
        return function(e) {
          return _this.relayMousewheelEvent(e);
        };
      })(this);
      canvasMousedown = (function(_this) {
        return function(e) {
          return _this.mousePressedOverCanvas(e);
        };
      })(this);
      visibleAreaMousedown = (function(_this) {
        return function(e) {
          return _this.startDrag(e);
        };
      })(this);
      this.addEventListener('mousewheel', elementMousewheel);
      this.canvas.addEventListener('mousedown', canvasMousedown);
      this.visibleArea.addEventListener('mousedown', visibleAreaMousedown);
      return this.subscriptions.add(new Disposable((function(_this) {
        return function() {
          _this.removeEventListener('mousewheel', elementMousewheel);
          _this.canvas.removeEventListener('mousedown', canvasMousedown);
          return _this.visibleArea.removeEventListener('mousedown', visibleAreaMousedown);
        };
      })(this)));
    };

    MinimapElement.prototype.initializeScrollIndicator = function() {
      this.scrollIndicator = document.createElement('div');
      this.scrollIndicator.classList.add('minimap-scroll-indicator');
      return this.controls.appendChild(this.scrollIndicator);
    };

    MinimapElement.prototype.disposeScrollIndicator = function() {
      this.controls.removeChild(this.scrollIndicator);
      return this.scrollIndicator = void 0;
    };

    MinimapElement.prototype.initializeOpenQuickSettings = function() {
      this.openQuickSettings = document.createElement('div');
      this.openQuickSettings.classList.add('open-minimap-quick-settings');
      this.controls.appendChild(this.openQuickSettings);
      return this.openQuickSettings.addEventListener('mousedown', (function(_this) {
        return function(e) {
          var left, top, _ref1;
          e.preventDefault();
          e.stopPropagation();
          if (_this.quickSettingsView != null) {
            _this.quickSettingsView.destroy();
            return _this.quickSettingsSubscription.dispose();
          } else {
            if (MinimapQuickSettingsView == null) {
              MinimapQuickSettingsView = require('./minimap-quick-settings-view');
            }
            _this.quickSettingsView = new MinimapQuickSettingsView(_this);
            _this.quickSettingsSubscription = _this.quickSettingsView.onDidDestroy(function() {
              return _this.quickSettingsView = null;
            });
            _this.quickSettingsView.attach();
            _ref1 = _this.getBoundingClientRect(), top = _ref1.top, left = _ref1.left;
            return _this.quickSettingsView.css({
              top: top + 'px',
              left: (left - _this.quickSettingsView.width()) + 'px'
            });
          }
        };
      })(this));
    };

    MinimapElement.prototype.disposeOpenQuickSettings = function() {
      this.controls.removeChild(this.openQuickSettings);
      return this.openQuickSettings = void 0;
    };

    MinimapElement.prototype.getTextEditor = function() {
      return this.minimap.getTextEditor();
    };

    MinimapElement.prototype.getTextEditorElement = function() {
      return this.editorElement != null ? this.editorElement : this.editorElement = atom.views.getView(this.getTextEditor());
    };

    MinimapElement.prototype.getTextEditorElementRoot = function() {
      var editorElement, _ref1;
      editorElement = this.getTextEditorElement();
      return (_ref1 = editorElement.shadowRoot) != null ? _ref1 : editorElement;
    };

    MinimapElement.prototype.getDummyDOMRoot = function(shadowRoot) {
      if (shadowRoot) {
        return this.getTextEditorElementRoot();
      } else {
        return this.getTextEditorElement();
      }
    };

    MinimapElement.prototype.getModel = function() {
      return this.minimap;
    };

    MinimapElement.prototype.setModel = function(minimap) {
      this.minimap = minimap;
      this.subscriptions.add(this.minimap.onDidChangeScrollTop((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeScrollLeft((function(_this) {
        return function() {
          return _this.requestUpdate();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidDestroy((function(_this) {
        return function() {
          return _this.destroy();
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChangeConfig((function(_this) {
        return function() {
          if (_this.attached) {
            return _this.requestForcedUpdate();
          }
        };
      })(this)));
      this.subscriptions.add(this.minimap.onDidChange((function(_this) {
        return function(change) {
          _this.pendingChanges.push(change);
          return _this.requestUpdate();
        };
      })(this)));
      return this.minimap;
    };

    MinimapElement.prototype.requestUpdate = function() {
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

    MinimapElement.prototype.requestForcedUpdate = function() {
      this.offscreenFirstRow = null;
      this.offscreenLastRow = null;
      return this.requestUpdate();
    };

    MinimapElement.prototype.update = function() {
      var canvasTop, canvasTransform, editorHeight, indicatorHeight, indicatorScroll, visibleAreaLeft, visibleAreaTop;
      if (!(this.attached && this.isVisible() && !this.minimap.isDestroyed())) {
        return;
      }
      if (this.adjustToSoftWrap && (this.marginRight != null)) {
        this.style.marginRight = this.marginRight + 'px';
      } else {
        this.style.marginRight = null;
      }
      visibleAreaLeft = this.minimap.getTextEditorScaledScrollLeft();
      visibleAreaTop = this.minimap.getTextEditorScaledScrollTop() - this.minimap.getScrollTop();
      this.applyStyles(this.visibleArea, {
        width: this.clientWidth + 'px',
        height: this.minimap.getTextEditorScaledHeight() + 'px',
        transform: this.makeTranslate(visibleAreaLeft, visibleAreaTop)
      });
      this.applyStyles(this.controls, {
        width: Math.min(this.canvas.width, this.width) + 'px'
      });
      canvasTop = this.minimap.getFirstVisibleScreenRow() * this.minimap.getLineHeight() - this.minimap.getScrollTop();
      canvasTransform = this.makeTranslate(0, canvasTop);
      if (devicePixelRatio !== 1) {
        canvasTransform += " " + this.makeScale(1 / devicePixelRatio);
      }
      this.applyStyles(this.canvas, {
        transform: canvasTransform
      });
      if (this.minimapScrollIndicator && this.minimap.canScroll() && !this.scrollIndicator) {
        this.initializeScrollIndicator();
      }
      if (this.scrollIndicator != null) {
        editorHeight = this.getTextEditor().getHeight();
        indicatorHeight = editorHeight * (editorHeight / this.minimap.getHeight());
        indicatorScroll = (editorHeight - indicatorHeight) * this.minimap.getCapedTextEditorScrollRatio();
        this.applyStyles(this.scrollIndicator, {
          height: indicatorHeight + 'px',
          transform: this.makeTranslate(0, indicatorScroll)
        });
        if (!this.minimap.canScroll()) {
          this.disposeScrollIndicator();
        }
      }
      return this.updateCanvas();
    };

    MinimapElement.prototype.setDisplayCodeHighlights = function(displayCodeHighlights) {
      this.displayCodeHighlights = displayCodeHighlights;
      if (this.attached) {
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.pauseDOMPolling = function() {
      this.domPollingPaused = true;
      if (this.resumeDOMPollingAfterDelay == null) {
        this.resumeDOMPollingAfterDelay = debounce(this.resumeDOMPolling, 100);
      }
      return this.resumeDOMPollingAfterDelay();
    };

    MinimapElement.prototype.resumeDOMPolling = function() {
      return this.domPollingPaused = false;
    };

    MinimapElement.prototype.resumeDOMPollingAfterDelay = null;

    MinimapElement.prototype.pollDOM = function() {
      if (this.domPollingPaused || this.updateRequested) {
        return;
      }
      if (this.width !== this.clientWidth || this.height !== this.clientHeight) {
        this.measureHeightAndWidth();
        return this.requestForcedUpdate();
      }
    };

    MinimapElement.prototype.measureHeightAndWidth = function() {
      var canvasWidth, lineLength, softWrap, softWrapAtPreferredLineLength, width;
      this.height = this.clientHeight;
      this.width = this.clientWidth;
      canvasWidth = this.width;
      if (!this.isVisible()) {
        return;
      }
      if (this.adjustToSoftWrap) {
        lineLength = atom.config.get('editor.preferredLineLength');
        softWrap = atom.config.get('editor.softWrap');
        softWrapAtPreferredLineLength = atom.config.get('editor.softWrapAtPreferredLineLength');
        width = lineLength * this.minimap.getCharWidth();
        if (softWrap && softWrapAtPreferredLineLength && lineLength && width < this.width) {
          this.marginRight = width - this.width;
          canvasWidth = width;
        } else {
          this.marginRight = null;
        }
      } else {
        delete this.marginRight;
      }
      if (canvasWidth !== this.canvas.width || this.height !== this.canvas.height) {
        this.canvas.width = canvasWidth * devicePixelRatio;
        return this.canvas.height = (this.height + this.minimap.getLineHeight()) * devicePixelRatio;
      }
    };

    MinimapElement.prototype.observeConfig = function(configs) {
      var callback, config, _results;
      if (configs == null) {
        configs = {};
      }
      _results = [];
      for (config in configs) {
        callback = configs[config];
        _results.push(this.subscriptions.add(atom.config.observe(config, callback)));
      }
      return _results;
    };

    MinimapElement.prototype.mousePressedOverCanvas = function(_arg) {
      var duration, from, pageY, row, scrollTop, step, target, to, which, y;
      which = _arg.which, pageY = _arg.pageY, target = _arg.target;
      if (which !== 1) {
        return;
      }
      y = pageY - target.getBoundingClientRect().top;
      row = Math.floor(y / this.minimap.getLineHeight()) + this.minimap.getFirstVisibleScreenRow();
      scrollTop = row * this.minimap.textEditor.getLineHeightInPixels() - this.minimap.textEditor.getHeight() / 2;
      from = this.minimap.textEditor.getScrollTop();
      to = scrollTop;
      step = (function(_this) {
        return function(now) {
          return _this.minimap.textEditor.setScrollTop(now);
        };
      })(this);
      if (atom.config.get('minimap.scrollAnimation')) {
        duration = 300;
      } else {
        duration = 0;
      }
      return this.animate({
        from: from,
        to: to,
        duration: duration,
        step: step
      });
    };

    MinimapElement.prototype.relayMousewheelEvent = function(e) {
      var editorElement;
      editorElement = atom.views.getView(this.minimap.textEditor);
      return editorElement.component.onMouseWheel(e);
    };

    MinimapElement.prototype.startDrag = function(_arg) {
      var dragOffset, initial, mousemoveHandler, mouseupHandler, offsetTop, pageY, top, which;
      which = _arg.which, pageY = _arg.pageY;
      if (which !== 1) {
        return;
      }
      top = this.visibleArea.getBoundingClientRect().top;
      offsetTop = this.getBoundingClientRect().top;
      dragOffset = pageY - top;
      initial = {
        dragOffset: dragOffset,
        offsetTop: offsetTop
      };
      mousemoveHandler = (function(_this) {
        return function(e) {
          return _this.drag(e, initial);
        };
      })(this);
      mouseupHandler = (function(_this) {
        return function(e) {
          return _this.endDrag(e, initial);
        };
      })(this);
      document.body.addEventListener('mousemove', mousemoveHandler);
      document.body.addEventListener('mouseup', mouseupHandler);
      document.body.addEventListener('mouseout', mouseupHandler);
      return this.dragSubscription = new Disposable((function(_this) {
        return function() {
          document.body.removeEventListener('mousemove', mousemoveHandler);
          document.body.removeEventListener('mouseup', mouseupHandler);
          return document.body.removeEventListener('mouseout', mouseupHandler);
        };
      })(this));
    };

    MinimapElement.prototype.drag = function(e, initial) {
      var ratio, y;
      if (e.which !== 1) {
        return;
      }
      y = e.pageY - initial.offsetTop - initial.dragOffset;
      ratio = y / (this.minimap.getVisibleHeight() - this.minimap.getTextEditorScaledHeight());
      return this.minimap.textEditor.setScrollTop(ratio * this.minimap.getTextEditorMaxScrollTop());
    };

    MinimapElement.prototype.endDrag = function(e, initial) {
      return this.dragSubscription.dispose();
    };

    MinimapElement.prototype.applyStyles = function(element, styles) {
      var cssText, property, value;
      cssText = '';
      for (property in styles) {
        value = styles[property];
        cssText += "" + property + ": " + value + "; ";
      }
      return element.style.cssText = cssText;
    };

    MinimapElement.prototype.makeTranslate = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = 0;
      }
      if (this.useHardwareAcceleration) {
        return "translate3d(" + x + "px, " + y + "px, 0)";
      } else {
        return "translate(" + x + "px, " + y + "px)";
      }
    };

    MinimapElement.prototype.makeScale = function(x, y) {
      if (x == null) {
        x = 0;
      }
      if (y == null) {
        y = x;
      }
      if (this.useHardwareAcceleration) {
        return "scale3d(" + x + ", " + y + ", 1)";
      } else {
        return "scale(" + x + ", " + y + ")";
      }
    };

    MinimapElement.prototype.animate = function(_arg) {
      var duration, from, start, step, swing, to, update;
      from = _arg.from, to = _arg.to, duration = _arg.duration, step = _arg.step;
      start = new Date();
      swing = function(progress) {
        return 0.5 - Math.cos(progress * Math.PI) / 2;
      };
      update = function() {
        var delta, passed, progress;
        passed = new Date() - start;
        if (duration === 0) {
          progress = 1;
        } else {
          progress = passed / duration;
        }
        if (progress > 1) {
          progress = 1;
        }
        delta = swing(progress);
        step(from + (to - from) * delta);
        if (progress < 1) {
          return requestAnimationFrame(update);
        }
      };
      return update();
    };

    return MinimapElement;

  })(HTMLElement);

  module.exports = MinimapElement = document.registerElement('atom-text-editor-minimap', {
    prototype: MinimapElement.prototype
  });

  MinimapElement.registerViewProvider = function() {
    return atom.views.addViewProvider(require('./minimap'), function(model) {
      var element;
      element = new MinimapElement;
      element.setModel(model);
      return element;
    });
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHdIQUFBO0lBQUE7O21TQUFBOztBQUFBLEVBQUMsV0FBWSxPQUFBLENBQVEsaUJBQVIsRUFBWixRQUFELENBQUE7O0FBQUEsRUFDQSxPQUFvQyxPQUFBLENBQVEsV0FBUixDQUFwQyxFQUFDLDJCQUFBLG1CQUFELEVBQXNCLGtCQUFBLFVBRHRCLENBQUE7O0FBQUEsRUFFQSxlQUFBLEdBQWtCLE9BQUEsQ0FBUSw0QkFBUixDQUZsQixDQUFBOztBQUFBLEVBR0EsWUFBQSxHQUFlLE9BQUEsQ0FBUSx3QkFBUixDQUhmLENBQUE7O0FBQUEsRUFLQSx3QkFBQSxHQUEyQixJQUwzQixDQUFBOztBQUFBLEVBUU07QUFDSixxQ0FBQSxDQUFBOzs7OztLQUFBOztBQUFBLElBQUEsZUFBZSxDQUFDLFdBQWhCLENBQTRCLGNBQTVCLENBQUEsQ0FBQTs7QUFBQSxJQUNBLFlBQVksQ0FBQyxXQUFiLENBQXlCLGNBQXpCLENBREEsQ0FBQTs7QUFHQTtBQUFBLGdCQUhBOztBQUFBLDZCQUtBLGtCQUFBLEdBQW9CLEdBTHBCLENBQUE7O0FBQUEsNkJBTUEsb0JBQUEsR0FBc0IsSUFOdEIsQ0FBQTs7QUFBQSw2QkFPQSxnQkFBQSxHQUFrQixLQVBsQixDQUFBOztBQUFBLDZCQVFBLG9CQUFBLEdBQXNCLEtBUnRCLENBQUE7O0FBQUEsNkJBa0JBLGVBQUEsR0FBaUIsU0FBQSxHQUFBO0FBQ2YsTUFBQSxJQUFDLENBQUEsYUFBRCxHQUFpQixHQUFBLENBQUEsbUJBQWpCLENBQUE7QUFBQSxNQUNBLElBQUMsQ0FBQSxpQkFBRCxDQUFBLENBREEsQ0FBQTtBQUFBLE1BR0EsSUFBQyxDQUFBLGFBQWEsQ0FBQyxHQUFmLENBQW1CLElBQUksQ0FBQyxNQUFNLENBQUMsdUJBQVosQ0FBb0MsQ0FBQSxTQUFBLEtB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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/minimap-element.coffee