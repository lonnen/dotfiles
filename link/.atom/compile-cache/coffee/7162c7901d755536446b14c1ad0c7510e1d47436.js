(function() {
  var Clipboard, EditorView, Gist, GistView, View, _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  _ref = require('atom'), EditorView = _ref.EditorView, View = _ref.View;

  Clipboard = require('clipboard');

  Gist = require('./gist-model');

  module.exports = GistView = (function(_super) {
    __extends(GistView, _super);

    function GistView() {
      return GistView.__super__.constructor.apply(this, arguments);
    }

    GistView.content = function() {
      return this.div({
        "class": "gist overlay from-top padded"
      }, (function(_this) {
        return function() {
          return _this.div({
            "class": "inset-panel"
          }, function() {
            _this.div({
              "class": "panel-heading"
            }, function() {
              _this.span({
                outlet: "title"
              });
              return _this.div({
                "class": "btn-toolbar pull-right",
                outlet: 'toolbar'
              }, function() {
                return _this.div({
                  "class": "btn-group"
                }, function() {
                  _this.button({
                    outlet: "privateButton",
                    "class": "btn"
                  }, "Secret");
                  return _this.button({
                    outlet: "publicButton",
                    "class": "btn"
                  }, "Public");
                });
              });
            });
            return _this.div({
              "class": "panel-body padded"
            }, function() {
              _this.div({
                outlet: 'signupForm'
              }, function() {
                _this.subview('descriptionEditor', new EditorView({
                  mini: true,
                  placeholderText: 'Description'
                }));
                _this.div({
                  "class": 'block pull-right'
                }, function() {
                  _this.button({
                    outlet: 'cancelButton',
                    "class": 'btn inline-block-tight'
                  }, "Cancel");
                  return _this.button({
                    outlet: 'gistButton',
                    "class": 'btn btn-primary inline-block-tight'
                  }, "Gist It");
                });
                return _this.div({
                  "class": 'clearfix'
                });
              });
              _this.div({
                outlet: 'progressIndicator'
              }, function() {
                return _this.span({
                  "class": 'loading loading-spinner-medium'
                });
              });
              return _this.div({
                outlet: 'urlDisplay'
              }, function() {
                return _this.span("All Done! the Gist's URL has been copied to your clipboard.");
              });
            });
          });
        };
      })(this));
    };

    GistView.prototype.initialize = function(serializeState) {
      this.handleEvents();
      this.gist = null;
      atom.views.getView(atom.workspace).command("gist-it:gist-current-file", (function(_this) {
        return function() {
          return _this.gistCurrentFile();
        };
      })(this));
      atom.views.getView(atom.workspace).command("gist-it:gist-selection", (function(_this) {
        return function() {
          return _this.gistSelection();
        };
      })(this));
      return atom.views.getView(atom.workspace).command("gist-it:gist-open-buffers", (function(_this) {
        return function() {
          return _this.gistOpenBuffers();
        };
      })(this));
    };

    GistView.prototype.serialize = function() {};

    GistView.prototype.destroy = function() {
      return this.detach();
    };

    GistView.prototype.handleEvents = function() {
      this.gistButton.on('click', (function(_this) {
        return function() {
          return _this.gistIt();
        };
      })(this));
      this.cancelButton.on('click', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
      this.publicButton.on('click', (function(_this) {
        return function() {
          return _this.makePublic();
        };
      })(this));
      this.privateButton.on('click', (function(_this) {
        return function() {
          return _this.makePrivate();
        };
      })(this));
      this.descriptionEditor.on('core:confirm', (function(_this) {
        return function() {
          return _this.gistIt();
        };
      })(this));
      return this.descriptionEditor.on('core:cancel', (function(_this) {
        return function() {
          return _this.detach();
        };
      })(this));
    };

    GistView.prototype.gistCurrentFile = function() {
      var activeEditor;
      this.gist = new Gist();
      activeEditor = atom.workspace.getActiveEditor();
      this.gist.files[activeEditor.getTitle()] = {
        content: activeEditor.getText()
      };
      this.title.text("Gist Current File");
      return this.presentSelf();
    };

    GistView.prototype.gistSelection = function() {
      var activeEditor;
      this.gist = new Gist();
      activeEditor = atom.workspace.getActiveEditor();
      this.gist.files[activeEditor.getTitle()] = {
        content: activeEditor.getSelectedText()
      };
      this.title.text("Gist Selection");
      return this.presentSelf();
    };

    GistView.prototype.gistOpenBuffers = function() {
      var editor, _i, _len, _ref1;
      this.gist = new Gist();
      _ref1 = atom.workspace.getEditors();
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        editor = _ref1[_i];
        this.gist.files[editor.getTitle()] = {
          content: editor.getText()
        };
      }
      this.title.text("Gist Open Buffers");
      return this.presentSelf();
    };

    GistView.prototype.presentSelf = function() {
      this.showGistForm();
      atom.workspaceView.append(this);
      return this.descriptionEditor.focus();
    };

    GistView.prototype.gistIt = function() {
      this.showProgressIndicator();
      this.gist.description = this.descriptionEditor.getText();
      return this.gist.post((function(_this) {
        return function(response) {
          Clipboard.writeText(response.html_url);
          _this.showUrlDisplay();
          return setTimeout((function() {
            return _this.detach();
          }), 1000);
        };
      })(this));
    };

    GistView.prototype.makePublic = function() {
      this.publicButton.addClass('selected');
      this.privateButton.removeClass('selected');
      return this.gist.isPublic = true;
    };

    GistView.prototype.makePrivate = function() {
      this.privateButton.addClass('selected');
      this.publicButton.removeClass('selected');
      return this.gist.isPublic = false;
    };

    GistView.prototype.showGistForm = function() {
      if (this.gist.isPublic) {
        this.makePublic();
      } else {
        this.makePrivate();
      }
      this.descriptionEditor.setText(this.gist.description);
      this.toolbar.show();
      this.signupForm.show();
      this.urlDisplay.hide();
      return this.progressIndicator.hide();
    };

    GistView.prototype.showProgressIndicator = function() {
      this.toolbar.hide();
      this.signupForm.hide();
      this.urlDisplay.hide();
      return this.progressIndicator.show();
    };

    GistView.prototype.showUrlDisplay = function() {
      this.toolbar.hide();
      this.signupForm.hide();
      this.urlDisplay.show();
      return this.progressIndicator.hide();
    };

    return GistView;

  })(View);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxPQUFxQixPQUFBLENBQVEsTUFBUixDQUFyQixFQUFDLGtCQUFBLFVBQUQsRUFBYSxZQUFBLElBQWIsQ0FBQTs7QUFBQSxFQUNBLFNBQUEsR0FBWSxPQUFBLENBQVEsV0FBUixDQURaLENBQUE7O0FBQUEsRUFHQSxJQUFBLEdBQU8sT0FBQSxDQUFRLGNBQVIsQ0FIUCxDQUFBOztBQUFBLEVBS0EsTUFBTSxDQUFDLE9BQVAsR0FDTTtBQUNKLCtCQUFBLENBQUE7Ozs7S0FBQTs7QUFBQSxJQUFBLFFBQUMsQ0FBQSxPQUFELEdBQVUsU0FBQSxHQUFBO2FBQ1IsSUFBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFFBQUEsT0FBQSxFQUFPLDhCQUFQO09BQUwsRUFBNEMsQ0FBQSxTQUFBLEtBQUEsR0FBQTtlQUFBLFNBQUEsR0FBQTtpQkFDMUMsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLFlBQUEsT0FBQSxFQUFPLGFBQVA7V0FBTCxFQUEyQixTQUFBLEdBQUE7QUFDekIsWUFBQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsY0FBQSxPQUFBLEVBQU8sZUFBUDthQUFMLEVBQTZCLFNBQUEsR0FBQTtBQUMzQixjQUFBLEtBQUMsQ0FBQSxJQUFELENBQU07QUFBQSxnQkFBQSxNQUFBLEVBQVEsT0FBUjtlQUFOLENBQUEsQ0FBQTtxQkFDQSxLQUFDLENBQUEsR0FBRCxDQUFLO0FBQUEsZ0JBQUEsT0FBQSxFQUFPLHdCQUFQO0FBQUEsZ0JBQWlDLE1BQUEsRUFBUSxTQUF6QztlQUFMLEVBQXlELFNBQUEsR0FBQTt1QkFDdkQsS0FBQyxDQUFBLEdBQUQsQ0FBSztBQUFBLGtCQUFBLE9BQUEsRUFBTyxXQUFQO2lCQUFMLEVBQXlCLFNBQUEsR0FBQTtB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
//# sourceURL=/Users/lonnen/.atom/packages/gist-it/lib/gist-view.coffee