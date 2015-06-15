(function() {
  var Linter, LinterRust, exec, fs, linterPath, log, path, warn, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  exec = require('child_process').exec;

  _ref = require("" + linterPath + "/lib/utils"), log = _ref.log, warn = _ref.warn;

  fs = require('fs');

  path = require('path');

  LinterRust = (function(_super) {
    __extends(LinterRust, _super);

    LinterRust.enabled = false;

    LinterRust.syntax = 'source.rust';

    LinterRust.rustcPath = '';

    LinterRust.prototype.linterName = 'rust';

    LinterRust.prototype.errorStream = 'stderr';

    LinterRust.prototype.regex = '(.+):(?<line>\\d+):(?<col>\\d+):\\s*(\\d+):(\\d+)\\s+((?<error>error|fatal error)|(?<warning>warning)|(?<info>note)):\\s+(?<message>.+)\n';

    function LinterRust(editor) {
      this.editor = editor;
      this.lintFile = __bind(this.lintFile, this);
      this.initCmd = __bind(this.initCmd, this);
      this.executionCheckHandler = __bind(this.executionCheckHandler, this);
      LinterRust.__super__.constructor.call(this, this.editor);
      atom.config.observe('linter-rust.executablePath', (function(_this) {
        return function() {
          var rustcPath;
          rustcPath = atom.config.get('linter-rust.executablePath');
          if (rustcPath !== _this.rustcPath) {
            _this.enabled = false;
            _this.rustcPath = rustcPath;
            return exec("" + _this.rustcPath + " --version", _this.executionCheckHandler);
          }
        };
      })(this));
    }

    LinterRust.prototype.executionCheckHandler = function(error, stdout, stderr) {
      var result, versionRegEx;
      versionRegEx = /rustc ([\d\.]+)/;
      if (!versionRegEx.test(stdout)) {
        result = error != null ? '#' + error.code + ': ' : '';
        if (stdout.length > 0) {
          result += 'stdout: ' + stdout;
        }
        if (stderr.length > 0) {
          result += 'stderr: ' + stderr;
        }
        return console.error("Linter-Rust: \"" + this.rustcPath + "\" was not executable: \"" + result + "\". Please, check executable path in the linter settings.");
      } else {
        this.enabled = true;
        log("Linter-Rust: found rust " + versionRegEx.exec(stdout)[1]);
        return this.initCmd();
      }
    };

    LinterRust.prototype.initCmd = function() {
      this.cmd = "" + this.rustcPath + " -Z no-trans --color never";
      return log('Linter-Rust: initialization completed');
    };

    LinterRust.prototype.lintFile = function(filePath, callback) {
      var origin_file;
      if (this.enabled) {
        origin_file = path.basename(this.editor.getPath());
        return LinterRust.__super__.lintFile.call(this, origin_file, callback);
      }
    };

    LinterRust.prototype.formatMessage = function(match) {
      var type;
      type = match.error ? match.error : match.warning ? match.warning : match.info;
      if (match[1] !== path.basename(this.editor.getPath())) {
        return "" + type + " in " + match[1] + ": " + match.message;
      } else {
        return "" + type + ": " + match.message;
      }
    };

    return LinterRust;

  })(Linter);

  module.exports = LinterRust;

}).call(this);
