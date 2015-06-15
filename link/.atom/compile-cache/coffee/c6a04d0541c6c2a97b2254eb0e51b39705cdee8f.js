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
          _this.h2('CSS Comb settings:');
          _this.h3('Ready-made preferences');
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
          _this.h3('Own preferences');
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
                "class": "btn btn-sg css-comb-config disabled"
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
      return atom.workspaceView.command("css-comb:userSettings", (function(_this) {
        return function() {
          return _this.toggle();
        };
      })(this));
    };

    CssCombView.prototype.serialize = function() {};

    CssCombView.prototype.destroy = function() {
      return this.detach();
    };

    CssCombView.prototype.toggle = function() {
      if (this.hasParent()) {
        return this.detach();
      } else {
        atom.workspaceView.append(this);
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUF3QixPQUFBLENBQVEsTUFBUixDQUF4QixFQUFDLFlBQUEsSUFBRCxFQUFPLGtCQUFBLFVBQVAsRUFBbUIsU0FBQSxDQUFuQixDQUFBOztBQUFBLEVBRUEsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNGLGtDQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFdBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ04sSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDJCQUFQO09BQUwsRUFBeUMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtBQUNyQyxVQUFBLEtBQUMsQ0FBQSxFQUFELENBQUksb0JBQUosQ0FBQSxDQUFBO0FBQUEsVUFDQSxLQUFDLENBQUEsRUFBRCxDQUFJLHdCQUFKLENBREEsQ0FBQTtBQUFBLFVBRUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGlCQUFQO1dBQUwsRUFBK0IsU0FBQSxHQUFBO0FBQzNCLFlBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2QixTQUFBLEdBQUE7cUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLFFBQWQsRUFBd0IsU0FBQSxHQUFBO3VCQUNwQixLQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFDSTtBQUFBLGtCQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsa0JBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxrQkFFQSxLQUFBLEVBQU8sUUFGUDtpQkFESixFQURvQjtjQUFBLENBQXhCLEVBRHlCO1lBQUEsQ0FBN0IsQ0FBQSxDQUFBO0FBQUEsWUFNQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZUFBUDthQUFMLEVBQTZCLFNBQUEsR0FBQTtxQkFDekIsS0FBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsU0FBZCxFQUF5QixTQUFBLEdBQUE7dUJBQ3JCLEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUNJO0FBQUEsa0JBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxrQkFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLGtCQUVBLEtBQUEsRUFBTyxTQUZQO2lCQURKLEVBRHFCO2NBQUEsQ0FBekIsRUFEeUI7WUFBQSxDQUE3QixDQU5BLENBQUE7bUJBWUEsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGNBQUEsT0FBQSxFQUFPLGVBQVA7YUFBTCxFQUE2QixTQUFBLEdBQUE7cUJBQ3pCLEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUFjLEtBQWQsRUFBcUIsU0FBQSxHQUFBO3VCQUNqQixLQUFDLENBQUEsR0FBRCxDQUFLLE9BQUwsRUFDSTtBQUFBLGtCQUFBLElBQUEsRUFBTSxPQUFOO0FBQUEsa0JBQ0EsSUFBQSxFQUFNLFNBRE47QUFBQSxrQkFFQSxLQUFBLEVBQU8sS0FGUDtpQkFESixFQURpQjtjQUFBLENBQXJCLEVBRHlCO1lBQUEsQ0FBN0IsRUFiMkI7VUFBQSxDQUEvQixDQUZBLENBQUE7QUFBQSxVQXFCQSxLQUFDLENBQUEsRUFBRCxDQUFJLGlCQUFKLENBckJBLENBQUE7QUFBQSxVQXNCQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsWUFBQSxPQUFBLEVBQU8saUJBQVA7V0FBTCxFQUErQixTQUFBLEdBQUE7bUJBQzNCLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxjQUFBLE9BQUEsRUFBTyxlQUFQO2FBQUwsRUFBNkIsU0FBQSxHQUFBO0FBQ3pCLGNBQUEsS0FBQyxDQUFBLEdBQUQsQ0FBSyxPQUFMLEVBQWMsZUFBZCxFQUErQixTQUFBLEdBQUE7dUJBQzNCLEtBQUMsQ0FBQSxHQUFELENBQUssT0FBTCxFQUNJO0FBQUEsa0JBQUEsSUFBQSxFQUFNLE9BQU47QUFBQSxrQkFDQSxJQUFBLEVBQU0sU0FETjtBQUFBLGtCQUVBLEtBQUEsRUFBTyxRQUZQO2lCQURKLEVBRDJCO2NBQUEsQ0FBL0IsQ0FBQSxDQUFBO3FCQUtBLEtBQUMsQ0FBQSxNQUFELENBQVE7QUFBQSxnQkFBQSxPQUFBLEVBQU8scUNBQVA7ZUFBUixFQUFzRCxrQkFBdEQsRUFOeUI7WUFBQSxDQUE3QixFQUQyQjtVQUFBLENBQS9CLENBdEJBLENBQUE7aUJBOEJBLEtBQUMsQ0FBQSxHQUFELENBQUs7QUFBQSxZQUFBLE9BQUEsRUFBTyxvQ0FBUDtXQUFMLEVBQWtELFNBQUEsR0FBQTttQkFDOUMsS0FBQyxDQUFBLE1BQUQsQ0FBUTtBQUFBLGNBQUEsT0FBQSxFQUFPLDJCQUFQO2FBQVIsRUFBNEMsT0FBNUMsRUFEOEM7VUFBQSxDQUFsRCxFQS9CcUM7UUFBQSxFQUFBO01BQUEsQ0FBQSxDQUFBLENBQUEsSUFBQSxDQUF6QyxFQURNO0lBQUEsQ0FBVixDQUFBOztBQUFBLDBCQW1DQSxVQUFBLEdBQVksU0FBQyxjQUFELEdBQUE7YUFDUixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHVCQUEzQixFQUFvRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxNQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXBELEVBRFE7SUFBQSxDQW5DWixDQUFBOztBQUFBLDBCQXVDQSxTQUFBLEdBQVcsU0FBQSxHQUFBLENBdkNYLENBQUE7O0FBQUEsMEJBMENBLE9BQUEsR0FBUyxTQUFBLEdBQUE7YUFDTCxJQUFDLENBQUEsTUFBRCxDQUFBLEVBREs7SUFBQSxDQTFDVCxDQUFBOztBQUFBLDBCQTZDQSxNQUFBLEdBQVEsU0FBQSxHQUFBO0FBQ0osTUFBQSxJQUFHLElBQUMsQ0FBQSxTQUFELENBQUEsQ0FBSDtlQUNJLElBQUMsQ0FBQSxNQUFELENBQUEsRUFESjtPQUFBLE1BQUE7QUFHSSxRQUFBLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBbkIsQ0FBMEIsSUFBMUIsQ0FBQSxDQUFBO2VBQ0EsSUFBQyxDQUFBLFVBQUQsQ0FBQSxFQUpKO09BREk7SUFBQSxDQTdDUixDQUFBOztBQUFBLDBCQW9EQSxVQUFBLEdBQVksU0FBQSxHQUFBO0FBQ1IsVUFBQSx3Q0FBQTtBQUFBLE1BQUEsTUFBQSxHQUFTLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBWixDQUFnQixpQkFBaEIsQ0FBVCxDQUFBO0FBQUEsTUFDQSxnQkFBQSxvQkFBb0IsU0FBUyxRQUQ3QixDQUFBO0FBQUEsTUFFQSxjQUFBLEdBQWlCLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWQsQ0FBK0IsZUFBL0IsQ0FGakIsQ0FBQTtBQUFBLE1BSUEsQ0FBQSxDQUFFLFFBQUYsRUFBWSxJQUFaLENBQWMsQ0FBQyxNQUFmLENBQXNCLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLENBQUQsR0FBQTtBQUNsQixjQUFBLEtBQUE7QUFBQSxVQUFBLEtBQUEsR0FBUSxDQUFBLENBQUUsQ0FBQyxDQUFDLE1BQUosQ0FBVyxDQUFDLEdBQVosQ0FBQSxDQUFBLEtBQXFCLE1BQTdCLENBQUE7QUFDQSxVQUFBLElBQXdELEtBQXhEO0FBQUEsWUFBQSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQVosQ0FBZ0IsaUJBQWhCLEVBQW1DLENBQUEsQ0FBRSxDQUFDLENBQUMsTUFBSixDQUFXLENBQUMsR0FBWixDQUFBLENBQW5DLENBQUEsQ0FBQTtXQURBO0FBRUEsVUFBQSxJQUFHLENBQUEsQ0FBRSwyQkFBRixFQUErQixLQUEvQixDQUFpQyxDQUFDLElBQWxDLENBQXVDLFNBQXZDLENBQUg7bUJBQ0ksQ0FBQSxDQUFFLGtCQUFGLEVBQXNCLEtBQXRCLENBQXdCLENBQUMsV0FBekIsQ0FBcUMsVUFBckMsRUFESjtXQUFBLE1BQUE7bUJBR0ksQ0FBQSxDQUFFLGtCQUFGLEVBQXNCLEtBQXRCLENBQXdCLENBQUMsUUFBekIsQ0FBa0MsVUFBbEMsRUFISjtXQUhrQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQXRCLENBSkEsQ0FBQTtBQUFBLE1BWUEsQ0FBQSxDQUFFLGNBQUEsR0FBaUIsZ0JBQWpCLEdBQW9DLFNBQXRDLEVBQWlELElBQWpELENBQW1ELENBQUMsSUFBcEQsQ0FBeUQsU0FBekQsRUFBb0UsU0FBQyxDQUFELEVBQUksR0FBSixHQUFBO0FBQ2hFLFFBQUEsQ0FBQSxDQUFFLElBQUYsQ0FBSSxDQUFDLE9BQUwsQ0FBYSxRQUFiLENBQUEsQ0FBQTtlQUNBLEtBRmdFO01BQUEsQ0FBcEUsQ0FaQSxDQUFBO0FBQUEsTUFnQkEsQ0FBQSxDQUFFLGlCQUFGLEVBQXFCLElBQXJCLENBQXVCLENBQUMsS0FBeEIsQ0FBOEIsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDMUIsS0FBQyxDQUFBLE1BQUQsQ0FBQSxFQUQwQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQTlCLENBaEJBLENBQUE7YUFtQkEsQ0FBQSxDQUFFLGtCQUFGLEVBQXNCLElBQXRCLENBQXdCLENBQUMsS0FBekIsQ0FBK0IsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDM0IsS0FBQyxDQUFBLFlBQUQsQ0FBQSxFQUQyQjtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQS9CLEVBcEJRO0lBQUEsQ0FwRFosQ0FBQTs7QUFBQSwwQkEyRUEsWUFBQSxHQUFjLFNBQUEsR0FBQTtBQUNWLFVBQUEsY0FBQTtBQUFBLE1BQUEsY0FBQSxHQUFpQixJQUFJLENBQUMsUUFBUSxDQUFDLGdCQUFkLENBQStCLGVBQS9CLENBQWpCLENBQUE7YUFFQSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQWYsQ0FBb0IsY0FBYyxDQUFDLElBQWYsR0FBc0Isd0JBQTFDLEVBSFU7SUFBQSxDQTNFZCxDQUFBOzt1QkFBQTs7S0FEc0IsS0FIMUIsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-css-comb/lib/css-comb-view.coffee