(function() {
  var CommandRunner, EnvStore, child_process;

  child_process = require('child_process');

  EnvStore = require('./env-store');

  module.exports = CommandRunner = (function() {
    function CommandRunner(command) {
      this.command = command;
    }

    CommandRunner.prototype.run = function(callback) {
      var env;
      env = EnvStore.get();
      return this.runWithEnv(env, callback);
    };

    CommandRunner.prototype.runWithEnv = function(env, callback) {
      var hasInvokedCallback, proc, result;
      proc = this.createChildProcess(env);
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

    CommandRunner.prototype.createChildProcess = function(env) {
      var options;
      options = {
        env: env
      };
      if (atom.project.path) {
        options.cwd = atom.project.path;
      }
      if (process.platform === 'win32') {
        options.windowsVerbatimArguments = true;
        return child_process.spawn('cmd', ['/s', '/c', '"' + this.command.join(' ') + '"'], options);
      } else {
        return child_process.spawn(this.command[0], this.command.slice(1), options);
      }
    };

    return CommandRunner;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHNDQUFBOztBQUFBLEVBQUEsYUFBQSxHQUFnQixPQUFBLENBQVEsZUFBUixDQUFoQixDQUFBOztBQUFBLEVBQ0EsUUFBQSxHQUFXLE9BQUEsQ0FBUSxhQUFSLENBRFgsQ0FBQTs7QUFBQSxFQUdBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDUyxJQUFBLHVCQUFFLE9BQUYsR0FBQTtBQUFZLE1BQVgsSUFBQyxDQUFBLFVBQUEsT0FBVSxDQUFaO0lBQUEsQ0FBYjs7QUFBQSw0QkFFQSxHQUFBLEdBQUssU0FBQyxRQUFELEdBQUE7QUFDSCxVQUFBLEdBQUE7QUFBQSxNQUFBLEdBQUEsR0FBTSxRQUFRLENBQUMsR0FBVCxDQUFBLENBQU4sQ0FBQTthQUNBLElBQUMsQ0FBQSxVQUFELENBQVksR0FBWixFQUFpQixRQUFqQixFQUZHO0lBQUEsQ0FGTCxDQUFBOztBQUFBLDRCQU1BLFVBQUEsR0FBWSxTQUFDLEdBQUQsRUFBTSxRQUFOLEdBQUE7QUFDVixVQUFBLGdDQUFBO0FBQUEsTUFBQSxJQUFBLEdBQU8sSUFBQyxDQUFBLGtCQUFELENBQW9CLEdBQXBCLENBQVAsQ0FBQTtBQUFBLE1BRUEsTUFBQSxHQUNFO0FBQUEsUUFBQSxPQUFBLEVBQVMsSUFBQyxDQUFBLE9BQVY7QUFBQSxRQUNBLEdBQUEsRUFBSyxHQURMO0FBQUEsUUFFQSxNQUFBLEVBQVEsRUFGUjtBQUFBLFFBR0EsTUFBQSxFQUFRLEVBSFI7T0FIRixDQUFBO0FBQUEsTUFRQSxrQkFBQSxHQUFxQixLQVJyQixDQUFBO0FBQUEsTUFVQSxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQVosQ0FBZSxNQUFmLEVBQXVCLFNBQUMsSUFBRCxHQUFBO2VBQ3JCLE1BQU0sQ0FBQyxNQUFQLElBQWlCLEtBREk7TUFBQSxDQUF2QixDQVZBLENBQUE7QUFBQSxNQWFBLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBWixDQUFlLE1BQWYsRUFBdUIsU0FBQyxJQUFELEdBQUE7ZUFDckIsTUFBTSxDQUFDLE1BQVAsSUFBaUIsS0FESTtNQUFBLENBQXZCLENBYkEsQ0FBQTtBQUFBLE1BZ0JBLElBQUksQ0FBQyxFQUFMLENBQVEsT0FBUixFQUFpQixTQUFDLFFBQUQsR0FBQTtBQUNmLFFBQUEsSUFBVSxrQkFBVjtBQUFBLGdCQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsTUFBTSxDQUFDLFFBQVAsR0FBa0IsUUFEbEIsQ0FBQTtBQUFBLFFBRUEsUUFBQSxDQUFTLElBQVQsRUFBZSxNQUFmLENBRkEsQ0FBQTtlQUdBLGtCQUFBLEdBQXFCLEtBSk47TUFBQSxDQUFqQixDQWhCQSxDQUFBO2FBc0JBLElBQUksQ0FBQyxFQUFMLENBQVEsT0FBUixFQUFpQixTQUFDLEtBQUQsR0FBQTtBQUNmLFFBQUEsSUFBVSxrQkFBVjtBQUFBLGdCQUFBLENBQUE7U0FBQTtBQUFBLFFBQ0EsUUFBQSxDQUFTLEtBQVQsRUFBZ0IsTUFBaEIsQ0FEQSxDQUFBO2VBRUEsa0JBQUEsR0FBcUIsS0FITjtNQUFBLENBQWpCLEVBdkJVO0lBQUEsQ0FOWixDQUFBOztBQUFBLDRCQWtDQSxrQkFBQSxHQUFvQixTQUFDLEdBQUQsR0FBQTtBQUNsQixVQUFBLE9BQUE7QUFBQSxNQUFBLE9BQUEsR0FBVTtBQUFBLFFBQUUsR0FBQSxFQUFLLEdBQVA7T0FBVixDQUFBO0FBQ0EsTUFBQSxJQUFtQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQWhEO0FBQUEsUUFBQSxPQUFPLENBQUMsR0FBUixHQUFjLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBM0IsQ0FBQTtPQURBO0FBR0EsTUFBQSxJQUFHLE9BQU8sQ0FBQyxRQUFSLEtBQW9CLE9BQXZCO0FBQ0UsUUFBQSxPQUFPLENBQUMsd0JBQVIsR0FBbUMsSUFBbkMsQ0FBQTtlQUNBLGFBQWEsQ0FBQyxLQUFkLENBQW9CLEtBQXBCLEVBQTJCLENBQUMsSUFBRCxFQUFPLElBQVAsRUFBYSxHQUFBLEdBQU0sSUFBQyxDQUFBLE9BQU8sQ0FBQyxJQUFULENBQWMsR0FBZCxDQUFOLEdBQTJCLEdBQXhDLENBQTNCLEVBQXlFLE9BQXpFLEVBRkY7T0FBQSxNQUFBO2VBSUUsYUFBYSxDQUFDLEtBQWQsQ0FBb0IsSUFBQyxDQUFBLE9BQVEsQ0FBQSxDQUFBLENBQTdCLEVBQWlDLElBQUMsQ0FBQSxPQUFPLENBQUMsS0FBVCxDQUFlLENBQWYsQ0FBakMsRUFBb0QsT0FBcEQsRUFKRjtPQUprQjtJQUFBLENBbENwQixDQUFBOzt5QkFBQTs7TUFMRixDQUFBO0FBQUEiCn0=
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/command-runner.coffee