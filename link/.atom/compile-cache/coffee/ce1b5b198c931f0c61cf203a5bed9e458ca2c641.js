(function() {
  var $, CommandRunner, child_process, each_slice, fs, os, path, _;

  child_process = require('child_process');

  os = require('os');

  path = require('path');

  fs = require('fs');

  _ = require('lodash');

  $ = require('atom').$;

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
    CommandRunner._cachedEnv = void 0;

    CommandRunner.fetchEnvOfLoginShell = function(callback) {
      var command, outputPath;
      if (!process.env.SHELL) {
        return callback(new Error("SHELL environment variable is not set."));
      }
      if (process.env.SHELL.match(/csh$/)) {
        return callback(new Error("" + process.env.SHELL + " is not supported."));
      }
      outputPath = path.join(os.tmpdir(), 'CommandRunner_fetchEnvOfLoginShell.txt');
      if (fs.existsSync(outputPath)) {
        fs.unlinkSync(outputPath);
      }
      command = "" + process.env.SHELL + " -l -i -c '$(printenv > " + outputPath + ")'";
      return child_process.exec(command, (function(_this) {
        return function(execError, stdout, stderr) {
          if (execError != null) {
            return callback(execError);
          }
          return fs.readFile(outputPath, function(readError, data) {
            var env;
            if (readError != null) {
              return callback(readError);
            }
            env = _this.parseResultOfPrintEnv(data.toString());
            return callback(null, env);
          });
        };
      })(this));
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
      if (this._cachedEnv === void 0) {
        return this.fetchEnvOfLoginShell((function(_this) {
          return function(error, env) {
            if (env == null) {
              env = {};
            }
            _this._cachedEnv = _this.mergePathEnvs(env, process.env);
            return callback(_this._cachedEnv);
          };
        })(this));
      } else {
        return callback(this._cachedEnv);
      }
    };

    function CommandRunner(command) {
      this.command = command;
    }

    CommandRunner.prototype.run = function(callback) {
      return CommandRunner.getEnv((function(_this) {
        return function(env) {
          if (env == null) {
            env = process.env;
          }
          return _this.runWithEnv(env, callback);
        };
      })(this));
    };

    CommandRunner.prototype.runWithEnv = function(env, callback) {
      var hasInvokedCallback, proc, result;
      proc = child_process.spawn(this.command[0], this.command.slice(1), {
        env: env
      });
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLDREQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsRUFBQSxHQUFLLE9BQUEsQ0FBUSxJQUFSLENBREwsQ0FBQTs7QUFBQSxFQUVBLElBQUEsR0FBTyxPQUFBLENBQVEsTUFBUixDQUZQLENBQUE7O0FBQUEsRUFHQSxFQUFBLEdBQUssT0FBQSxDQUFRLElBQVIsQ0FITCxDQUFBOztBQUFBLEVBSUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBSkosQ0FBQTs7QUFBQSxFQUtDLElBQUssT0FBQSxDQUFRLE1BQVIsRUFBTCxDQUxELENBQUE7O0FBQUEsRUFPQSxVQUFBLEdBQWEsU0FBQyxLQUFELEVBQVEsSUFBUixFQUFjLFFBQWQsR0FBQTtBQUNYLFFBQUEsNEJBQUE7QUFBQTtTQUFTLG1GQUFULEdBQUE7QUFDRSxNQUFBLEtBQUEsR0FBUSxLQUFLLENBQUMsS0FBTixDQUFZLENBQVosRUFBZSxDQUFBLEdBQUksSUFBbkIsQ0FBUixDQUFBO0FBQUEsb0JBQ0EsUUFBQSxDQUFTLEtBQVQsRUFEQSxDQURGO0FBQUE7b0JBRFc7RUFBQSxDQVBiLENBQUE7O0FBQUEsRUFZQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxhQUFDLENBQUEsVUFBRCxHQUFjLE1BQWQsQ0FBQTs7QUFBQSxJQUVBLGFBQUMsQ0FBQSxvQkFBRCxHQUF3QixTQUFDLFFBQUQsR0FBQTtBQUN0QixVQUFBLG1CQUFBO0FBQUEsTUFBQSxJQUFHLENBQUEsT0FBUSxDQUFDLEdBQUcsQ0FBQyxLQUFoQjtBQUNFLGVBQU8sUUFBQSxDQUFhLElBQUEsS0FBQSxDQUFNLHdDQUFOLENBQWIsQ0FBUCxDQURGO09BQUE7QUFHQSxNQUFBLElBQUcsT0FB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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/command-runner.coffee