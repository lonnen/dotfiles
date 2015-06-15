(function() {
  var CommandRunner, child_process, crypto, each_slice, fs, os, path, _;

  child_process = require('child_process');

  os = require('os');

  path = require('path');

  fs = require('fs');

  crypto = require('crypto');

  _ = require('lodash');

  each_slice = function(array, size, callback) {
    var i, slice, _i, _ref, _results;
    _results = [];
    for (i = _i = 0, _ref = array.length; size > 0 ? _i <= _ref : _i >= _ref; i = _i += size) {
      slice = array.slice(i, i + size);
      _results.push(callback(slice));
    }
    return _results;
  };

  module.exports = CommandRunner = (function() {
    CommandRunner.fetchEnvOfLoginShell = function(callback) {
      var command, outputPath;
      if (!process.env.SHELL) {
        if (process.platform === 'win32') {
          return callback(null, null);
        } else {
          return callback(new Error("SHELL environment variable is not set."));
        }
      }
      if (process.env.SHELL.match(/csh$/)) {
        return callback(new Error("" + process.env.SHELL + " is not supported."));
      }
      outputPath = this.getEnvOutputFilePath();
      command = "" + process.env.SHELL + " -l -i -c '$(printenv > " + outputPath + ")'";
      return child_process.exec(command, (function(_this) {
        return function(execError, stdout, stderr) {
          if (execError != null) {
            return callback(execError);
          }
          return fs.readFile(outputPath, function(readError, data) {
            var env;
            if (fs.existsSync(outputPath)) {
              fs.unlinkSync(outputPath);
            }
            if (readError != null) {
              return callback(readError);
            }
            env = _this.parseResultOfPrintEnv(data.toString());
            return callback(null, env);
          });
        };
      })(this));
    };

    CommandRunner.getEnvOutputFilePath = function() {
      var outputPath, randomHex;
      randomHex = crypto.randomBytes(20).toString('hex');
      outputPath = path.join(os.tmpdir(), "atom-lint_" + randomHex + ".txt");
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      return outputPath;
    };

    CommandRunner.parseResultOfPrintEnv = function(string) {
      var env, key, line, lines, lines_and_last_chars, matches, value, _i, _len, _match;
      env = {};
      lines_and_last_chars = string.split(/([^\\])\n/);
      lines = each_slice(lines_and_last_chars, 2, function(slice) {
        return slice.join('');
      });
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        line = lines[_i];
        matches = line.match(/^(.+?)=([\S\s]*)$/);
        if (matches == null) {
          continue;
        }
        _match = matches[0], key = matches[1], value = matches[2];
        if (!(key != null) || key.length === 0) {
          continue;
        }
        env[key] = value;
      }
      return env;
    };

    CommandRunner.mergePathEnvs = function(baseEnv, subsequentEnv) {
      var key, _i, _len, _ref;
      _ref = ['PATH', 'GEM_PATH'];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        key = _ref[_i];
        baseEnv[key] = this.mergePaths(baseEnv[key], subsequentEnv[key]);
      }
      return baseEnv;
    };

    CommandRunner.mergePaths = function(baseString, subsequentString) {
      var basePaths, paths, subsequentPaths;
      basePaths = baseString ? baseString.split(':') : [];
      subsequentPaths = subsequentString ? subsequentString.split(':') : [];
      paths = basePaths.concat(subsequentPaths);
      return _.uniq(paths).join(':');
    };

    CommandRunner.getEnv = function(callback) {
      if (this.cachedEnv === void 0) {
        return this.fetchEnvOfLoginShell((function(_this) {
          return function(error, env) {
            if ((error != null) && !_this.supressError) {
              console.log(error.stack);
            }
            if (env != null) {
              _this.cachedEnv = _this.mergePathEnvs(env, process.env);
            } else {
              _this.cachedEnv = process.env;
            }
            return callback(_this.cachedEnv);
          };
        })(this));
      } else {
        return callback(this.cachedEnv);
      }
    };

    function CommandRunner(command) {
      this.command = command;
    }

    CommandRunner.prototype.run = function(callback) {
      return CommandRunner.getEnv((function(_this) {
        return function(env) {
          return _this.runWithEnv(env, callback);
        };
      })(this));
    };

    CommandRunner.prototype.runWithEnv = function(env, callback) {
      var hasInvokedCallback, options, proc, result;
      if (process.platform === 'win32') {
        proc = child_process.spawn('cmd', ['/s', '/c', '"' + this.command.join(' ') + '"'], {
          windowsVerbatimArguments: true,
          env: env
        });
      } else {
        options = {
          env: env,
          cwd: atom.project.path
        };
        proc = child_process.spawn(this.command[0], this.command.slice(1), options);
      }
      result = {
        command: this.command,
        env: env,
        stdout: '',
        stderr: ''
      };
      hasInvokedCallback = false;
      proc.stdout.on('data', function(data) {
        return result.stdout += data;
      });
      proc.stderr.on('data', function(data) {
        return result.stderr += data;
      });
      proc.on('close', function(exitCode) {
        if (hasInvokedCallback) {
          return;
        }
        result.exitCode = exitCode;
        callback(null, result);
        return hasInvokedCallback = true;
      });
      return proc.on('error', function(error) {
        if (hasInvokedCallback) {
          return;
        }
        callback(error, result);
        return hasInvokedCallback = true;
      });
    };

    return CommandRunner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGlFQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsTUFBQSxHQUFTLE9BQUEsQ0FBUSxRQUFSLENBSlQsQ0FBQTs7QUFBQSxFQUtBLENBQUEsR0FBSSxPQUFBLENBQVEsUUFBUixDQUxKLENBQUE7O0FBQUEsRUFPQSxVQUFBLEdBQWEsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLFFBQWQsR0FBQTtBQUNYLFFBQUEsNEJBQUE7QUFBQTtTQUFTLG1GQUFULEdBQUE7QUFDRSxNQUFBLEtBQUEsR0FBUSxLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZSxDQUFBLEdBQUksSUFBbkIsQ0FBUixDQUFBO0FBQUEsb0JBQ0EsUUFBQSxDQUFTLEtBQVQsRUFEQSxDQURGO0FBQUE7b0JBRFc7RUFBQSxDQVBiLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxhQUFDLENBQUEsb0JBQUQsR0FBdUIsU0FBQyxRQUFELEdBQUE7QUFDckIsVUFBQSxtQkFBQTtBQUFBLE1BQUEsSUFBRyxDQUFBLE9BQVEsQ0FBQyxHQUFHLENBQUMsS0FBaEI7QUFDRSxRQUFBLElBQUcsT0FBTyxDQUFDLFFBQVIsS0FBb0IsT0FBdkI7QUFDRSxpQkFBTyxRQUFBLENBQVMsSUFBVCxFQUFlLElBQWYsQ0FBUCxDQURGO1NBQUEsTUFBQTtBQUdFLGlCQUFPLFFBQUEsQ0FBYSxJ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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/command-runner.coffee