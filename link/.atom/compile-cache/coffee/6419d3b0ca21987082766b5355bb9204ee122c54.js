(function() {
  var Linter, LinterRust, exec, fs, linterPath, log, path, tmp, warn, _ref,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  linterPath = atom.packages.getLoadedPackage("linter").path;

  Linter = require("" + linterPath + "/lib/linter");

  exec = require('child_process').exec;

  _ref = require("" + linterPath + "/lib/utils"), log = _ref.log, warn = _ref.warn;

  fs = require('fs');

  path = require('path');

  tmp = require('tmp');

  LinterRust = (function(_super) {
    __extends(LinterRust, _super);

    LinterRust.enabled = false;

    LinterRust.syntax = 'source.rust';

    LinterRust.prototype.rustcPath = '';

    LinterRust.prototype.linterName = 'rust';

    LinterRust.prototype.errorStream = 'stderr';

    LinterRust.prototype.regex = '(?<file>.+):(?<line>\\d+):(?<col>\\d+):\\s*(\\d+):(\\d+)\\s+((?<error>error|fatal error)|(?<warning>warning)|(?<info>note)):\\s+(?<message>.+)\n';

    LinterRust.prototype.cargoFilename = '';

    LinterRust.prototype.dependencyDir = "target/debug/deps";

    LinterRust.prototype.tmpFile = null;

    LinterRust.prototype.lintOnChange = false;

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
            return exec("\"" + _this.rustcPath + "\" --version", _this.executionCheckHandler);
          }
        };
      })(this));
      atom.config.observe('linter-rust.cargoFilename', (function(_this) {
        return function() {
          return _this.cargoFilename = atom.config.get('linter-rust.cargoFilename');
        };
      })(this));
      atom.config.observe('linter-rust.lintOnChange', (function(_this) {
        return function() {
          return _this.lintOnChange = atom.config.get('linter-rust.lintOnChange');
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
      var cargoPath;
      this.cmd = [this.rustcPath, '-Z', 'no-trans', '--color', 'never'];
      cargoPath = this.locateCargo();
      if (cargoPath) {
        this.cmd.push('-L');
        this.cmd.push(path.join(cargoPath, this.dependencyDir));
      }
      return log('Linter-Rust: initialization completed');
    };

    LinterRust.prototype.lintFile = function(filePath, callback) {
      var cur_dir, fileName;
      if (this.enabled) {
        fileName = path.basename(this.editor.getPath());
        if (this.lintOnChange) {
          cur_dir = path.dirname(this.editor.getPath());
          this.tmpFile = tmp.fileSync({
            dir: cur_dir,
            postfix: "-" + fileName
          });
          fs.writeFileSync(this.tmpFile.name, this.editor.getText());
          return LinterRust.__super__.lintFile.call(this, this.tmpFile.name, callback);
        } else {
          return LinterRust.__super__.lintFile.call(this, fileName, callback);
        }
      }
    };

    LinterRust.prototype.locateCargo = function() {
      var cargoFile, directory, root_dir;
      directory = path.resolve(path.dirname(this.editor.getPath()));
      root_dir = /^win/.test(process.platform) ? /^.:\\$/ : /^\/$/;
      while (true) {
        cargoFile = path.join(directory, this.cargoFilename);
        if (fs.existsSync(cargoFile)) {
          return directory;
        }
        if (root_dir.test(directory)) {
          break;
        }
        directory = path.resolve(path.join(directory, '..'));
      }
      return false;
    };

    LinterRust.prototype.processMessage = function(message, callback) {
      if (this.tmpFile) {
        this.tmpFile.removeCallback();
        this.tmpFile = null;
      }
      return LinterRust.__super__.processMessage.call(this, message, callback);
    };

    LinterRust.prototype.formatMessage = function(match) {
      var fileName, fileNameRE, type;
      fileName = path.basename(this.editor.getPath());
      fileNameRE = RegExp("-" + fileName + "$");
      type = match.error ? match.error : match.warning ? match.warning : match.info;
      if (fileNameRE.test(match.file) || fileName === match.file) {
        return "" + type + ": " + match.message;
      } else {
        return "" + type + " in " + match.file + ": " + match.message;
      }
    };

    return LinterRust;

  })(Linter);

  module.exports = LinterRust;

}).call(this);
