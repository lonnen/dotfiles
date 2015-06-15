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