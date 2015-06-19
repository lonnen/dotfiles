(function() {
  module.exports = {
    config: {
      executablePath: {
        type: 'string',
        "default": 'rustc',
        description: 'Path to rust compiller.'
      },
      cargoFilename: {
        type: 'string',
        "default": 'Cargo.toml',
        description: 'Cargo configuration file.'
      }
    },
    activate: function() {
      return console.log('Linter-Rust: package loaded, ready to get initialized by AtomLinter.');
    }
  };

}).call(this);