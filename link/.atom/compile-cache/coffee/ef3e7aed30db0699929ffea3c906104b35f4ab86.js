(function() {
  var $, CssCombView, EditorView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom-space-pen-views'), View = _ref.View, EditorView = _ref.EditorView, $ = _ref.$;

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
          _this.h3('Common config');
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
                  value: 'common'
                });
              });
              return _this.button({
                "class": 'btn btn-sg css-comb-config disabled'
              }, 'Edit config file');
            });
          });
          _this.h3('Project config');
          _this.div({
            "class": 'css-comb__block'
          }, function() {
            return _this.div({
              "class": 'css-comb__row'
            }, function() {
              return _this.tag('label', 'use project config', function() {
                return _this.tag('input', {
                  type: 'radio',
                  name: 'csscomb',
                  value: 'project'
                });
              });
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
          if ($('input[value=common]:radio', _this).prop('checked')) {
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
