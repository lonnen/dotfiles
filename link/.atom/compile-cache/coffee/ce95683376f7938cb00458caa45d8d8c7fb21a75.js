(function() {
  var $, CssCombView, EditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), View = _ref.View, EditorView = _ref.EditorView, $ = _ref.$;

  module.exports = CssCombView = (function(_super) {
    __extends(CssCombView, _super);

    function CssCombView() {
      return CssCombView.__super__.constructor.apply(this, arguments);
    }

    CssCombView.content = function() {
      return this.div({
        "class": 'css-comb overlay from-top'
      }, (function(_this) {
        return function() {
          _this.h2('CSS Comb configs:');
          _this.h3('Ready-made configs');
          _this.div({
            "class": 'css-comb__block'
          }, function() {
            _this.div({
              "class": 'css-comb__row'
            }, function() {
              return _this.tag('label', 'yandex', function() {
                return _this.tag('input', {
                  type: 'radio',
                  name: 'csscomb',
                  value: 'yandex'
                });
              });
            });
            _this.div({
              "class": 'css-comb__row'
            }, function() {
              return _this.tag('label', 'csscomb', function() {
                return _this.tag('input', {
                  type: 'radio',
                  name: 'csscomb',
                  value: 'csscomb'
                });
              });
            });
            return _this.div({
              "class": 'css-comb__row'
            }, function() {
              return _this.tag('label', 'zen', function() {
                return _this.tag('input', {
                  type: 'radio',
                  name: 'csscomb',
                  value: 'zen'
                });
              });
            });
          });
          _this.h3('Own configs');
          _this.div({
            "class": 'css-comb__block'
          }, function() {
            return _this.div({
              "class": 'css-comb__row'
            }, function() {
              _this.tag('label', 'custom config', function() {
                return _this.tag('input', {
                  type: 'radio',
                  name: 'csscomb',
                  value: 'custom'
                });
              });
              return _this.button({
                "class": 'btn btn-sg css-comb-config disabled'
              }, 'Edit config file');
            });
          });
          return _this.div({
            "class": 'css-comb__row css-comb__row_aright'
          }, function() {
            return _this.button({
              "class": "btn btn-lg css-comb-close"
            }, 'Close');
          });
        };
      })(this));
    };

    CssCombView.prototype.initialize = function(serializeState) {
      return atom.commands.add('atom-workspace', {
        'css-comb:userSettings': (function(_this) {
          return function() {
            return _this.toggle();
          };
        })(this)
      });
    };

    CssCombView.prototype.serialize = function() {};

    CssCombView.prototype.destroy = function() {
      return this.detach();
    };

    CssCombView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        $(atom.views.getView(atom.workspace)).append(this);
        return this.setActions();
      }
    };

    CssCombView.prototype.setActions = function() {
      var config, cssCombPackage, radioButtonValue;
      config = atom.config.get('css-comb.config');
      radioButtonValue = config != null ? config : 'yandex';
      cssCombPackage = atom.packages.getLoadedPackage('atom-css-comb');
      $(':radio', this).change((function(_this) {
        return function(e) {
          var value;
          value = $(e.target).val() !== config;
          if (value) {
            atom.config.set('css-comb.config', $(e.target).val());
          }
          if ($('input[value=custom]:radio', _this).prop('checked')) {
            return $('.css-comb-config', _this).removeClass('disabled');
          } else {
            return $('.css-comb-config', _this).addClass('disabled');
          }
        };
      })(this));
      $('input[value=' + radioButtonValue + ']:radio', this).prop('checked', function(i, val) {
        $(this).trigger('change');
        return true;
      });
      $('.css-comb-close', this).click((function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
      return $('.css-comb-config', this).click((function(_this) {
        return function() {
          return _this.userSettings();
        };
      })(this));
    };

    CssCombView.prototype.userSettings = function() {
      var cssCombPackage;
      cssCombPackage = atom.packages.getLoadedPackage('atom-css-comb');
      return atom.workspace.open(cssCombPackage.path + '/configs/.csscomb.json');
    };

    return CssCombView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF3QixPQUFBLENBQVEsTUFBUixDQUF4QixFQUFDLFlBQUEsSUFBRCxFQUFPLGtCQUFBLFVBQVAsRUFBbUIsU0FBQSxDQUFuQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNGLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDJCQUFQO09BQUwsRUFBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyQyxVQUFBLEtBQUMsQ0FBQSxFQUFELENBQUksbUJBQUosQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsRUFBRCxDQUFJLG9CQUFKLENBREEsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGlCQUFQO1dBQUwsRUFBK0IsU0FBQSxHQUFBO0FBQzNCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2QixTQUFBLEdBQUE7cUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLFFBQWQsRUFBd0IsU0FBQSxHQUFBO3VCQUNwQixLQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFDSTtBQUFBLGtCQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsa0JBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxrQkFFQSxLQUFBLEVBQU8sUUFGUDtpQkFESixFQURvQjtjQUFBLENBQXhCLEVBRHlCO1lBQUEsQ0FBN0IsQ0FBQSxDQUFBO0FBQUEs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
//# sourceURL=/Users/lonnen/.atom/packages/atom-css-comb/lib/css-comb-view.coffee