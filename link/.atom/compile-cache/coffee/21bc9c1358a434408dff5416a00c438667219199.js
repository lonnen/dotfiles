(function() {
  var CompileStatus, LineMessageView, MessagePanelView, Path, PlainMessageView, spawn, _ref;

  _ref = require('atom-message-panel'), MessagePanelView = _ref.MessagePanelView, LineMessageView = _ref.LineMessageView, PlainMessageView = _ref.PlainMessageView;

  Path = require('path');

  spawn = require('child_process').spawn;

  CompileStatus = require('./compile-status');

  module.exports = {
    messagePanelView: null,
    configDefaults: {
      compileOnSave: true,
      erlangPath: "/usr/local/bin",
      rebarPath: "/usr/local/bin"
    },
    activate: function(state) {
      atom.workspaceView.command("erlang-build:compile", (function(_this) {
        return function() {
          return _this.compile();
        };
      })(this));
      this.setupPathOptions();
      return this.setupCompileOnSave();
    },
    deactivate: function() {},
    serialize: function() {},
    compile: function() {
      var proc, status;
      this.resetPanel();
      proc = spawn(this.rebarBin(), ['compile'], {
        cwd: atom.project.path
      });
      status = new CompileStatus;
      proc.stdout.pipe(status);
      return proc.stdout.on('end', (function(_this) {
        return function() {
          var app, error, errors, _i, _len, _ref1;
          _ref1 = status.errors;
          for (app in _ref1) {
            errors = _ref1[app];
            if (errors.length > 0) {
              _this.displayMessage("Application: " + app + " has compilation errors:");
              for (_i = 0, _len = errors.length; _i < _len; _i++) {
                error = errors[_i];
                _this.displayMessage(error);
              }
            } else {
              _this.displayMessage("Application: " + app + " compiled successfully.");
            }
          }
          return _this.done();
        };
      })(this));
    },
    setupPathOptions: function() {
      return atom.config.observe('erlang-build.erlangPath', {
        callNow: true
      }, function(val) {
        return process.env.PATH = "" + process.env.PATH + ":" + val;
      });
    },
    setupCompileOnSave: function() {
      var compileHandler;
      compileHandler = function() {
        var editor;
        editor = atom.workspace.getActiveEditor();
        if ((editor != null) && editor.getGrammar().name !== 'Erlang') {
          return;
        }
        return atom.workspaceView.trigger('erlang-build:compile');
      };
      return atom.config.observe('erlang-build.compileOnSave', {
        callNow: true
      }, function(val) {
        if (val) {
          return atom.workspace.eachEditor(function(ed) {
            return ed.buffer.on('saved', compileHandler);
          });
        } else {
          return atom.workspace.eachEditor(function(ed) {
            return ed.buffer.off('saved', compileHandler);
          });
        }
      });
    },
    done: function() {
      return console.log('tasks completed');
    },
    resetPanel: function() {
      if ((atom.workspaceView.find('#erlang-build-mp')).length > 0) {
        return this.messagePanelView.clear();
      } else {
        this.messagePanelView = new MessagePanelView({
          title: '<span class="icon-diff-added"></span> erlang-build',
          rawTitle: true
        });
        this.messagePanelView.attr('id', 'erlang-build-mp');
        return this.messagePanelView.attach();
      }
    },
    displayMessage: function(msg) {
      if (typeof msg === "string") {
        return this.messagePanelView.add(new PlainMessageView({
          message: msg
        }));
      } else if (typeof msg === "object") {
        return this.messagePanelView.add(new LineMessageView(msg));
      } else {
        return console.log(typeof msg);
      }
    },
    rebarBin: function() {
      return Path.join(atom.config.get('erlang-build.rebarPath'), 'rebar');
    }
  };

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFGQUFBOztBQUFBLEVBQUEsT0FBd0QsT0FBQSxDQUFRLG9CQUFSLENBQXhELEVBQUMsd0JBQUEsZ0JBQUQsRUFBbUIsdUJBQUEsZUFBbkIsRUFBb0Msd0JBQUEsZ0JBQXBDLENBQUE7O0FBQUEsRUFDQSxJQUFBLEdBQU8sT0FBQSxDQUFRLE1BQVIsQ0FEUCxDQUFBOztBQUFBLEVBRUMsUUFBUyxPQUFBLENBQVEsZUFBUixFQUFULEtBRkQsQ0FBQTs7QUFBQSxFQUdBLGFBQUEsR0FBZ0IsT0FBQSxDQUFRLGtCQUFSLENBSGhCLENBQUE7O0FBQUEsRUFLQSxNQUFNLENBQUMsT0FBUCxHQUNFO0FBQUEsSUFBQSxnQkFBQSxFQUFrQixJQUFsQjtBQUFBLElBRUEsY0FBQSxFQUNFO0FBQUEsTUFBQSxhQUFBLEVBQWUsSUFBZjtBQUFBLE1BQ0EsVUFBQSxFQUFZLGdCQURaO0FBQUEsTUFFQSxTQUFBLEVBQVcsZ0JBRlg7S0FIRjtBQUFBLElBT0EsUUFBQSxFQUFVLFNBQUMsS0FBRCxHQUFBO0FBQ1IsTUFBQSxJQUFJLENBQUMsYUFBYSxDQUFDLE9BQW5CLENBQTJCLHNCQUEzQixFQUFtRCxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQSxHQUFBO2lCQUFHLEtBQUMsQ0FBQSxPQUFELENBQUEsRUFBSDtRQUFBLEVBQUE7TUFBQSxDQUFBLENBQUEsQ0FBQSxJQUFBLENBQW5ELENBQUEsQ0FBQTtBQUFBLE1BQ0EsSUFBQyxDQUFBLGdCQUFELENBQUEsQ0FEQSxDQUFBO2FBRUEsSUFBQyxDQUFBLGtCQUFELENBQUEsRUFIUTtJQUFBLENBUFY7QUFBQSxJQVlBLFVBQUEsRUFBWSxTQUFBLEdBQUEsQ0FaWjtBQUFBLElBY0EsU0FBQSxFQUFXLFNBQUEsR0FBQSxDQWRYO0FBQUEsSUFnQkEs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
//# sourceURL=/Users/lonnen/.atom/packages/erlang-build/lib/erlang-build.coffee