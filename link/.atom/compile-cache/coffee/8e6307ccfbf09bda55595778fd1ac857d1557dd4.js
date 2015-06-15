(function() {
  var Decoration, DecorationManagement, Emitter, Mixin, path,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    __slice = [].slice,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  Mixin = require('mixto');

  path = require('path');

  Emitter = require('event-kit').Emitter;

  Decoration = require(path.join(atom.config.resourcePath, 'src', 'decoration'));

  module.exports = DecorationManagement = (function(_super) {
    __extends(DecorationManagement, _super);

    function DecorationManagement() {
      return DecorationManagement.__super__.constructor.apply(this, arguments);
    }


    /* Public */

    DecorationManagement.prototype.initializeDecorations = function() {
      if (this.emitter == null) {
        this.emitter = new Emitter;
      }
      this.decorationsById = {};
      this.decorationsByMarkerId = {};
      this.decorationMarkerChangedSubscriptions = {};
      this.decorationMarkerDestroyedSubscriptions = {};
      this.decorationUpdatedSubscriptions = {};
      return this.decorationDestroyedSubscriptions = {};
    };

    DecorationManagement.prototype.onDidAddDecoration = function(callback) {
      return this.emitter.on('did-add-decoration', callback);
    };

    DecorationManagement.prototype.onDidRemoveDecoration = function(callback) {
      return this.emitter.on('did-remove-decoration', callback);
    };

    DecorationManagement.prototype.onDidChangeDecoration = function(callback) {
      return this.emitter.on('did-change-decoration', callback);
    };

    DecorationManagement.prototype.onDidUpdateDecoration = function(callback) {
      return this.emitter.on('did-update-decoration', callback);
    };

    DecorationManagement.prototype.decorationForId = function(id) {
      return this.decorationsById[id];
    };

    DecorationManagement.prototype.decorationsByTypesForRow = function() {
      var array, decoration, decorations, id, out, row, types, _i, _j, _len, _ref;
      row = arguments[0], types = 3 <= arguments.length ? __slice.call(arguments, 1, _i = arguments.length - 1) : (_i = 1, []), decorations = arguments[_i++];
      out = [];
      for (id in decorations) {
        array = decorations[id];
        for (_j = 0, _len = array.length; _j < _len; _j++) {
          decoration = array[_j];
          if ((_ref = decoration.getProperties().type, __indexOf.call(types, _ref) >= 0) && decoration.getMarker().getScreenRange().intersectsRow(row)) {
            out.push(decoration);
          }
        }
      }
      return out;
    };

    DecorationManagement.prototype.decorationsForScreenRowRange = function(startScreenRow, endScreenRow) {
      var decorations, decorationsByMarkerId, marker, _i, _len, _ref;
      decorationsByMarkerId = {};
      _ref = this.findMarkers({
        intersectsScreenRowRange: [startScreenRow, endScreenRow]
      });
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        marker = _ref[_i];
        if (decorations = this.decorationsByMarkerId[marker.id]) {
          decorationsByMarkerId[marker.id] = decorations;
        }
      }
      return decorationsByMarkerId;
    };

    DecorationManagement.prototype.decorateMarker = function(marker, decorationParams) {
      var cls, decoration, _base, _base1, _base2, _base3, _base4, _name, _name1, _name2, _name3, _name4;
      if (marker == null) {
        return;
      }
      marker = this.getMarker(marker.id);
      if (marker == null) {
        return;
      }
      if ((decorationParams.scope == null) && (decorationParams["class"] != null)) {
        cls = decorationParams["class"].split(' ').join('.');
        decorationParams.scope = ".minimap ." + cls;
      }
      if ((_base = this.decorationMarkerDestroyedSubscriptions)[_name = marker.id] == null) {
        _base[_name] = marker.onDidDestroy((function(_this) {
          return function() {
            return _this.removeAllDecorationsForMarker(marker);
          };
        })(this));
      }
      if ((_base1 = this.decorationMarkerChangedSubscriptions)[_name1 = marker.id] == null) {
        _base1[_name1] = marker.onDidChange((function(_this) {
          return function(event) {
            var decoration, decorations, end, start, _i, _len, _ref;
            decorations = _this.decorationsByMarkerId[marker.id];
            if (decorations != null) {
              for (_i = 0, _len = decorations.length; _i < _len; _i++) {
                decoration = decorations[_i];
                _this.emitter.emit('did-change-decoration', {
                  marker: marker,
                  decoration: decoration,
                  event: event
                });
              }
            }
            start = event.oldTailScreenPosition;
            end = event.oldHeadScreenPosition;
            if (start.row > end.row) {
              _ref = [end, start], start = _ref[0], end = _ref[1];
            }
            return _this.emitRangeChanges({
              start: start,
              end: end,
              screenDelta: end - start
            });
          };
        })(this));
      }
      decoration = new Decoration(marker, this, decorationParams);
      if ((_base2 = this.decorationsByMarkerId)[_name2 = marker.id] == null) {
        _base2[_name2] = [];
      }
      this.decorationsByMarkerId[marker.id].push(decoration);
      this.decorationsById[decoration.id] = decoration;
      if ((_base3 = this.decorationUpdatedSubscriptions)[_name3 = decoration.id] == null) {
        _base3[_name3] = decoration.onDidChangeProperties((function(_this) {
          return function(event) {
            return _this.emitDecorationChanges(decoration);
          };
        })(this));
      }
      if ((_base4 = this.decorationDestroyedSubscriptions)[_name4 = decoration.id] == null) {
        _base4[_name4] = decoration.onDidDestroy((function(_this) {
          return function(event) {
            return _this.removeDecoration(decoration);
          };
        })(this));
      }
      this.emitDecorationChanges(decoration);
      this.emitter.emit('did-add-decoration', {
        marker: marker,
        decoration: decoration
      });
      return decoration;
    };

    DecorationManagement.prototype.emitDecorationChanges = function(decoration) {
      var range;
      if (decoration.marker.displayBuffer.isDestroyed()) {
        return;
      }
      range = decoration.marker.getScreenRange();
      if (range == null) {
        return;
      }
      return this.emitRangeChanges(range);
    };

    DecorationManagement.prototype.emitRangeChanges = function(range) {
      var changeEvent, endScreenRow, firstRenderedScreenRow, lastRenderedScreenRow, screenDelta, startScreenRow;
      startScreenRow = range.start.row;
      endScreenRow = range.end.row;
      lastRenderedScreenRow = this.getLastVisibleScreenRow();
      firstRenderedScreenRow = this.getFirstVisibleScreenRow();
      screenDelta = (lastRenderedScreenRow - firstRenderedScreenRow) - (endScreenRow - startScreenRow);
      if (isNaN(screenDelta)) {
        screenDelta = 0;
      }
      changeEvent = {
        start: startScreenRow,
        end: endScreenRow,
        screenDelta: screenDelta
      };
      return this.emitChanges(changeEvent);
    };

    DecorationManagement.prototype.removeDecoration = function(decoration) {
      var decorations, index, marker;
      if (decoration == null) {
        return;
      }
      marker = decoration.marker;
      if (!(decorations = this.decorationsByMarkerId[marker.id])) {
        return;
      }
      this.emitDecorationChanges(decoration);
      this.decorationUpdatedSubscriptions[decoration.id].dispose();
      this.decorationDestroyedSubscriptions[decoration.id].dispose();
      delete this.decorationUpdatedSubscriptions[decoration.id];
      delete this.decorationDestroyedSubscriptions[decoration.id];
      index = decorations.indexOf(decoration);
      if (index > -1) {
        decorations.splice(index, 1);
        delete this.decorationsById[decoration.id];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        if (decorations.length === 0) {
          return this.removedAllMarkerDecorations(marker);
        }
      }
    };

    DecorationManagement.prototype.removeAllDecorationsForMarker = function(marker) {
      var decoration, decorations, _i, _len, _ref;
      if (marker == null) {
        return;
      }
      decorations = (_ref = this.decorationsByMarkerId[marker.id]) != null ? _ref.slice() : void 0;
      if (!decorations) {
        return;
      }
      for (_i = 0, _len = decorations.length; _i < _len; _i++) {
        decoration = decorations[_i];
        this.emitter.emit('did-remove-decoration', {
          marker: marker,
          decoration: decoration
        });
        this.emitDecorationChanges(decoration);
      }
      return this.removedAllMarkerDecorations(marker);
    };

    DecorationManagement.prototype.removedAllMarkerDecorations = function(marker) {
      if (marker == null) {
        return;
      }
      this.decorationMarkerChangedSubscriptions[marker.id].dispose();
      this.decorationMarkerDestroyedSubscriptions[marker.id].dispose();
      delete this.decorationsByMarkerId[marker.id];
      delete this.decorationMarkerChangedSubscriptions[marker.id];
      return delete this.decorationMarkerDestroyedSubscriptions[marker.id];
    };

    DecorationManagement.prototype.decorationUpdated = function(decoration) {
      return this.emitter.emit('did-update-decoration', decoration);
    };

    return DecorationManagement;

  })(Mixin);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNEQUFBO0lBQUE7Ozt5SkFBQTs7QUFBQSxFQUFBLEtBQUEsR0FBUSxPQUFBLENBQVEsT0FBUixDQUFSLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsVUFBVyxPQUFBLENBQVEsV0FBUixFQUFYLE9BRkQsQ0FBQTs7QUFBQSxFQUdBLFVBQUEsR0FBYSxPQUFBLENBQVEsSUFBSSxDQUFDLElBQUwsQ0FBVSxJQUFJLENBQUMsTUFBTSxDQUFDLFlBQXRCLEVBQW9DLEtBQXBDLEVBQTJDLFlBQTNDLENBQVIsQ0FIYixDQUFBOztBQUFBLEVBT0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLDJDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQTtBQUFBLGdCQUFBOztBQUFBLG1DQUdBLHFCQUFBLEdBQXVCLFNBQUEsR0FBQTs7UUFDckIsSUFBQyxDQUFBLFVBQVcsR0FBQSxDQUFBO09BQVo7QUFBQSxNQUNBLElBQUMsQ0FBQSxlQUFELEdBQW1CLEVBRG5CLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxxQkFBRCxHQUF5QixFQUZ6QixDQUFBO0FBQUEsTUFHQSxJQUFDLENBQUEsb0NBQUQsR0FBd0MsRUFIeEMsQ0FBQTtBQUFBLE1BSUEsSUFBQyxDQUFBLHNDQUFELEdBQTBDLEVBSjFDLENBQUE7QUFBQSxNQUtBLElBQUMsQ0FBQSw4QkFBRCxHQUFrQyxFQUxsQyxDQUFBO2FBTUEsSUFBQyxDQUFBLGdDQUFELEdBQW9DLEdBUGY7SUFBQSxDQUh2QixDQUFBOztBQUFBLG1DQVlBLGtCQUFBLEdBQW9CLFNBQUMsUUFBRCxHQUFBO2FBQ2xCLElBQUMsQ0FBQSxPQUFPLENBQUMsRUFBVCxDQUFZLG9CQUFaLEVBQWtDLFFBQWxDLEVBRGtC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
//# sourceURL=/Users/lonnen/.atom/packages/minimap/lib/mixins/decoration-management.coffee