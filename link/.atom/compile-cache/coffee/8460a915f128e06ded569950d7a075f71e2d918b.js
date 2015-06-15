(function() {
  var $, Point, Range, View, ViolationTooltip, ViolationView, _, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ = require('lodash');

  _ref = require('atom'), $ = _ref.$, View = _ref.View, Range = _ref.Range, Point = _ref.Point;

  ViolationTooltip = require('./violation-tooltip');

  module.exports = ViolationView = (function(_super) {
    __extends(ViolationView, _super);

    function ViolationView() {
      return ViolationView.__super__.constructor.apply(this, arguments);
    }

    ViolationView.content = function() {
      return this.div({
        "class": 'violation'
      }, (function(_this) {
        return function() {
          _this.div({
            "class": 'violation-arrow'
          });
          return _this.div({
            "class": 'violation-area'
          });
        };
      })(this));
    };

    ViolationView.prototype.initialize = function(violation, lintView) {
      this.violation = violation;
      this.lintView = lintView;
      this.lintView.append(this);
      this.editorView = this.lintView.editorView;
      this.editor = this.editorView.getEditor();
      this.initializeSubviews();
      this.initializeStates();
      this.trackEdit();
      this.trackCursor();
      this.showHighlight();
      return this.toggleTooltipWithCursorPosition();
    };

    ViolationView.prototype.initializeSubviews = function() {
      this.arrow = this.find('.violation-arrow');
      this.arrow.addClass("violation-" + this.violation.severity);
      this.area = this.find('.violation-area');
      return this.area.addClass("violation-" + this.violation.severity);
    };

    ViolationView.prototype.initializeStates = function() {
      var screenRange;
      screenRange = this.editor.screenRangeForBufferRange(this.violation.bufferRange);
      this.screenStartPosition = screenRange.start;
      this.screenEndPosition = screenRange.end;
      return this.isValid = true;
    };

    ViolationView.prototype.trackEdit = function() {
      var options;
      options = {
        invalidate: 'inside',
        persistent: false
      };
      this.marker = this.editor.markScreenRange(this.getCurrentScreenRange(), options);
      this.editor.decorateMarker(this.marker, {
        type: 'gutter',
        "class": "lint-" + this.violation.severity
      });
      return this.marker.on('changed', (function(_this) {
        return function(event) {
          var _ref1;
          _this.screenStartPosition = event.newTailScreenPosition;
          _this.screenEndPosition = event.newHeadScreenPosition;
          _this.isValid = event.isValid;
          if (_this.isValid) {
            if (_this.isVisibleMarkerChange(event)) {
              return setImmediate(function() {
                _this.showHighlight();
                return _this.toggleTooltipWithCursorPosition();
              });
            } else {
              _this.hide();
              if (_this.scheduleDeferredShowHighlight == null) {
                _this.scheduleDeferredShowHighlight = _.debounce(_this.showHighlight, 500);
              }
              return _this.scheduleDeferredShowHighlight();
            }
          } else {
            _this.hideHighlight();
            return (_ref1 = _this.violationTooltip) != null ? _ref1.hide() : void 0;
          }
        };
      })(this));
    };

    ViolationView.prototype.isVisibleMarkerChange = function(event) {
      var editorFirstVisibleRow, editorLastVisibleRow;
      editorFirstVisibleRow = this.editorView.getFirstVisibleScreenRow();
      editorLastVisibleRow = this.editorView.getLastVisibleScreenRow();
      return [event.oldTailScreenPosition, event.newTailScreenPosition].some(function(position) {
        var _ref1;
        return (editorFirstVisibleRow <= (_ref1 = position.row) && _ref1 <= editorLastVisibleRow);
      });
    };

    ViolationView.prototype.trackCursor = function() {
      return this.subscribe(this.editor.getCursor(), 'moved', (function(_this) {
        return function() {
          var _ref1;
          if (_this.isValid) {
            return _this.toggleTooltipWithCursorPosition();
          } else {
            return (_ref1 = _this.violationTooltip) != null ? _ref1.hide() : void 0;
          }
        };
      })(this));
    };

    ViolationView.prototype.showHighlight = function() {
      this.updateHighlight();
      return this.show();
    };

    ViolationView.prototype.hideHighlight = function() {
      return this.hide();
    };

    ViolationView.prototype.updateHighlight = function() {
      var arrowSize, borderOffset, borderThickness, endPixelPosition, startPixelPosition, verticalOffset;
      startPixelPosition = this.editorView.pixelPositionForScreenPosition(this.screenStartPosition);
      endPixelPosition = this.editorView.pixelPositionForScreenPosition(this.screenEndPosition);
      arrowSize = this.editorView.charWidth / 2;
      verticalOffset = this.editorView.lineHeight + Math.floor(arrowSize / 4);
      this.css({
        'top': startPixelPosition.top,
        'left': startPixelPosition.left,
        'width': this.editorView.charWidth - (this.editorView.charWidth % 2),
        'height': verticalOffset
      });
      this.arrow.css({
        'border-right-width': arrowSize,
        'border-bottom-width': arrowSize,
        'border-left-width': arrowSize
      });
      borderThickness = 1;
      borderOffset = arrowSize / 2;
      this.area.css({
        'left': borderOffset,
        'width': endPixelPosition.left - startPixelPosition.left - borderOffset,
        'height': verticalOffset
      });
      if (this.screenEndPosition.column - this.screenStartPosition.column > 1) {
        return this.area.addClass("violation-border");
      } else {
        return this.area.removeClass("violation-border");
      }
    };

    ViolationView.prototype.toggleTooltipWithCursorPosition = function() {
      var cursorPosition, _ref1;
      cursorPosition = this.editor.getCursor().getScreenPosition();
      if (cursorPosition.row === this.screenStartPosition.row && cursorPosition.column === this.screenStartPosition.column) {
        if (this.violationTooltip == null) {
          this.violationTooltip = this.createViolationTooltip();
        }
        return this.violationTooltip.show();
      } else {
        return (_ref1 = this.violationTooltip) != null ? _ref1.hide() : void 0;
      }
    };

    ViolationView.prototype.getCurrentBufferStartPosition = function() {
      return this.editor.bufferPositionForScreenPosition(this.screenStartPosition);
    };

    ViolationView.prototype.getCurrentScreenRange = function() {
      return new Range(this.screenStartPosition, this.screenEndPosition);
    };

    ViolationView.prototype.beforeRemove = function() {
      var _ref1, _ref2;
      if ((_ref1 = this.marker) != null) {
        _ref1.destroy();
      }
      return (_ref2 = this.violationTooltip) != null ? _ref2.destroy() : void 0;
    };

    ViolationView.prototype.createViolationTooltip = function() {
      var options;
      options = {
        violation: this.violation,
        container: this.lintView,
        selector: this.find('.violation-area'),
        editorView: this.editorView
      };
      return new ViolationTooltip(this, options);
    };

    return ViolationView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLCtEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxDQUFBLEdBQUksT0FBQSxDQUFRLFFBQVIsQ0FBSixDQUFBOztBQUFBLEVBQ0EsT0FBMEIsT0FBQSxDQUFRLE1BQVIsQ0FBMUIsRUFBQyxTQUFBLENBQUQsRUFBSSxZQUFBLElBQUosRUFBVSxhQUFBLEtBQVYsRUFBaUIsYUFBQSxLQURqQixDQUFBOztBQUFBLEVBRUEsZ0JBQUEsR0FBbUIsT0FBQSxDQUFRLHFCQUFSLENBRm5CLENBQUE7O0FBQUEsRUFJQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osb0NBQUEsQ0FBQTs7OztLQUFBOztBQUFBLElBQUEsYUFBQyxDQUFBLE9BQUQsR0FBVSxTQUFBLEdBQUE7YUFDUixJQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsUUFBQSxPQUFBLEVBQU8sV0FBUDtPQUFMLEVBQXlCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFBLEdBQUE7QUFDdkIsVUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8saUJBQVA7V0FBTCxDQUFBLENBQUE7aUJBQ0EsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGdCQUFQO1dBQUwsRUFGdUI7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QixFQURRO0lBQUEsQ0FBVixDQUFBOztBQUFBLDRCQUtBLFVBQUEsR0FBWSxTQUFFLFNBQUYsRUFBYyxRQUFkLEdBQUE7QUFDVixNQURXLElBQUMsQ0FBQSxZQUFBLFNBQ1osQ0FBQTtBQUFBLE1BRHVCLElBQUMsQ0FBQSxXQUFBLFFBQ3hCLENBQUE7QUFBQSxNQUFBLElBQUMsQ0FBQSxRQUFRLENBQUMsTUFBVixDQUFpQixJQUFqQixDQUFB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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/violation-view.coffee