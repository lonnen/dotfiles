(function() {
  var Linter, LinterRust, exec, findFile, fs, linterPath, log, path, warn, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  exec = require('child_process').exec;

  _ref = require("" + linterPath + "/lib/utils"), log = _ref.log, warn = _ref.warn, findFile = _ref.findFile;

  fs = require('fs');

  path = require('path');

  LinterRust = (function(_super) {
    __extends(LinterRust, _super);

    LinterRust.prototype.regex = '(?<file>.+):(?<line>\\d+):(?<col>\\d+):\\s*(\\d+):(\\d+)\\s+((?<error>error|fatal error)|(?<warning>warning)|(?<info>note)):\\s+(?<message>.+)\n';

    LinterRust.syntax = 'source.rust';

    LinterRust.prototype.linterName = 'rust';

    LinterRust.prototype.errorStream = 'stderr';

    LinterRust.prototype.rustcPath = '';

    LinterRust.prototype.cargoPath = '';

    LinterRust.prototype.cargoManifestFilename = '';

    LinterRust.prototype.cargoDependencyDir = "target/debug/deps";

    LinterRust.prototype.useCargo = true;

    LinterRust.prototype.jobsNumber = 2;

    LinterRust.prototype.baseOptions = [];

    LinterRust.prototype.executionTimeout = 10000;

    function LinterRust(editor) {
      this.editor = editor;
      this.formatMessage = __bind(this.formatMessage, this);
      this.lintFile = __bind(this.lintFile, this);
      this.initCmd = __bind(this.initCmd, this);
      this.executionCheckHandler = __bind(this.executionCheckHandler, this);
      LinterRust.__super__.constructor.call(this, this.editor);
      atom.config.observe('linter-rust.executablePath', (function(_this) {
        return function() {
          _this.rustcPath = atom.config.get('linter-rust.executablePath');
          return exec("\"" + _this.rustcPath + "\" --version", _this.executionCheckHandler);
        };
      })(this));
      atom.config.observe('linter-rust.cargoExecutablePath', (function(_this) {
        return function() {
          _this.cargoPath = atom.config.get('linter-rust.cargoExecutablePath');
          return exec("\"" + _this.cargoPath + "\" --version", _this.executionCheckHandler);
        };
      })(this));
      atom.config.observe('linter-rust.cargoManifestFilename', (function(_this) {
        return function() {
          return _this.cargoManifestFilename = atom.config.get('linter-rust.cargoManifestFilename');
        };
      })(this));
      atom.config.observe('linter-rust.useCargo', (function(_this) {
        return function() {
          return _this.useCargo = atom.config.get('linter-rust.useCargo');
        };
      })(this));
      atom.config.observe('linter-rust.jobsNumber', (function(_this) {
        return function() {
          return _this.jobsNumber = atom.config.get('jobsNumber');
        };
      })(this));
      atom.config.observe('linter-rust.executionTimeout', (function(_this) {
        return function() {
          return _this.executionTimeout = atom.config.get('linter-rust.executionTimeout');
        };
      })(this));
    }

    LinterRust.prototype.executionCheckHandler = function(error, stdout, stderr) {
      var executable, result, versionRegEx;
      executable = /^rustc/.test(stdout) ? ['rustc', this.rustcPath] : ['cargo', this.cargoPath];
      versionRegEx = /(rustc|cargo) ([\d\.]+)/;
      if (!versionRegEx.test(stdout)) {
        result = error != null ? '#' + error.code + ': ' : '';
        if (stdout.length > 0) {
          result += 'stdout: ' + stdout;
        }
        if (stderr.length > 0) {
          result += 'stderr: ' + stderr;
        }
        console.error("Linter-Rust: \"" + executable[1] + "\" was not executable: \"" + result + "\". Please, check executable path in the linter settings.");
        if ('rustc' === executable[0]) {
          return this.rustcPath = '';
        } else {
          return this.cargoPath = '';
        }
      } else {
        return log("Linter-Rust: found " + executable[0]);
      }
    };

    LinterRust.prototype.initCmd = function(editingFile) {
      var cargoManifestPath;
      cargoManifestPath = this.locateCargoManifest();
      if (!this.cargoPath || !this.useCargo || !cargoManifestPath) {
        this.cmd = [this.rustcPath, '-Z', 'no-trans', '--color', 'never'];
        if (cargoManifestPath) {
          this.cmd.push('-L');
          this.cmd.push(path.join(path.dirname(cargoManifestPath), this.cargoDependencyDir));
        }
        return editingFile;
      } else {
        this.cmd = [this.cargoPath, 'build', '-j', 2, '--manifest-path'];
        return cargoManifestPath;
      }
    };

    LinterRust.prototype.lintFile = function(filePath, callback) {
      var editingFile;
      editingFile = this.initCmd(path.basename(this.editor.getPath()));
      if (this.rustcPath || (this.cargoPath && this.useCargo)) {
        return LinterRust.__super__.lintFile.call(this, editingFile, callback);
      }
    };

    LinterRust.prototype.locateCargoManifest = function() {
      var cur_dir;
      cur_dir = path.resolve(path.dirname(this.editor.getPath()));
      return findFile(cur_dir, this.cargoManifestFilename);
    };

    LinterRust.prototype.formatMessage = function(match) {
      var fileName, type;
      type = match.error ? match.error : match.warning ? match.warning : match.info;
      fileName = path.basename(this.editor.getPath());
      if (match.file !== fileName) {
        match.col = match.line = 0;
        return "" + type + " in " + match.file + ": " + match.message;
      } else {
        return "" + type + ": " + match.message;
      }
    };

    return LinterRust;

  })(Linter);

  module.exports = LinterRust;

}).call(this);
