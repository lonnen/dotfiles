(function() {
  var Violation, util, _;

  _ = require('lodash');

  util = require('./util');

  module.exports = Violation = (function() {
    Violation.SEVERITIES = ['warning', 'error'];

    function Violation(severity, bufferRange, message, metadata) {
      this.severity = severity;
      this.bufferRange = bufferRange;
      this.message = message;
      this.metadata = metadata != null ? metadata : [];
      if (!_.contains(Violation.SEVERITIES, this.severity)) {
        message = "Severity must be any of " + (Violation.SEVERITIES.join(',')) + ". ";
        message += "" + this.severity + " is passed.";
        throw new Error(message);
      }
    }

    Violation.prototype.getMessageHTML = function() {
      var HTML;
      HTML = util.punctuate(util.capitalize(this.message));
      HTML = _.escape(HTML);
      HTML = HTML.replace(/(^|\s)&#39;(.+?)&#39;([\s\.\,\:\;\!\?\)]|$)/g, '$1<code>$2</code>$3');
      return HTML = HTML.replace(/`(.+?)`/g, '<code>$1</code>');
    };

    Violation.prototype.getAttachmentHTML = function() {
      return null;
    };

    Violation.prototype.getMetadataHTML = function() {
      var elements, item;
      elements = (function() {
        var _i, _len, _ref, _results;
        _ref = this.metadata;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          item = _ref[_i];
          _results.push("<span class=\"item\">" + (_.escape(item)) + "</span>");
        }
        return _results;
      }).call(this);
      return elements.join('');
    };

    return Violation;

  })();

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLGtCQUFBOztBQUFBLEVBQUEsQ0FBQSxHQUFJLE9BQUEsQ0FBUSxRQUFSLENBQUosQ0FBQTs7QUFBQSxFQUNBLElBQUEsR0FBTyxPQUFBLENBQVEsUUFBUixDQURQLENBQUE7O0FBQUEsRUFHQSxNQUFNLENBQUMsT0FBUCxHQUNNO0FBQ0osSUFBQSxTQUFDLENBQUEsVUFBRCxHQUFjLENBQUMsU0FBRCxFQUFZLE9BQVosQ0FBZCxDQUFBOztBQUVhLElBQUEsbUJBQUUsUUFBRixFQUFhLFdBQWIsRUFBMkIsT0FBM0IsRUFBcUMsUUFBckMsR0FBQTtBQUNYLE1BRFksSUFBQyxDQUFBLFdBQUEsUUFDYixDQUFBO0FBQUEsTUFEdUIsSUFBQyxDQUFBLGNBQUEsV0FDeEIsQ0FBQTtBQUFBLE1BRHFDLElBQUMsQ0FBQSxVQUFBLE9BQ3RDLENBQUE7QUFBQSxNQUQrQyxJQUFDLENBQUEsOEJBQUEsV0FBVyxFQUMzRCxDQUFBO0FBQUEsTUFBQSxJQUFBLENBQUEsQ0FBUSxDQUFDLFFBQUYsQ0FBVyxTQUFTLENBQUMsVUFBckIsRUFBaUMsSUFBQyxDQUFBLFFBQWxDLENBQVA7QUFDRSxRQUFBLE9BQUEsR0FBWSwwQkFBQSxHQUF5QixDQUFBLFNBQVMsQ0FBQyxVQUFVLENBQUMsSUFBckIsQ0FBMEIsR0FBMUIsQ0FBQSxDQUF6QixHQUF5RCxJQUFyRSxDQUFBO0FBQUEsUUFDQSxPQUFBLElBQVcsRUFBQSxHQUFFLElBQUMsQ0FBQSxRQUFILEdBQWEsYUFEeEIsQ0FBQTtBQUVBLGNBQVUsSUFBQSxLQUFBLENBQU0sT0FBTixDQUFWLENBSEY7T0FEVztJQUFBLENBRmI7O0FBQUEsd0JBUUEsY0FBQSxHQUFnQixTQUFBLEdBQUE7QUFDZCxVQUFBLElBQUE7QUFBQSxNQUFBLElBQUEsR0FBTyxJQUFJLENBQUMsU0FBTCxDQUFlLElBQUksQ0FBQyxVQUFMLENBQWdCLElBQUMsQ0FBQSxPQUFqQixDQUFmLENBQVAsQ0FBQTtBQUFBLE1BQ0EsSUFBQSxHQUFPLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxDQURQLENBQUE7QUFBQSxNQUVBLElBQUEsR0FBTyxJQUFJLENBQUMsT0FBTCxDQUFhLDhDQUFiLEVBQTZELHFCQUE3RCxDQUZQLENBQUE7YUFHQSxJQUFBLEdBQU8sSUFBSSxDQUFDLE9BQUwsQ0FBYSxVQUFiLEVBQXlCLGlCQUF6QixFQUpPO0lBQUEsQ0FSaEIsQ0FBQTs7QUFBQSx3QkFjQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7YUFDakIsS0FEaUI7SUFBQSxDQWRuQixDQUFBOztBQUFBLHdCQWlCQSxlQUFBLEdBQWlCLFNBQUEsR0FBQTtBQUNmLFVBQUEsY0FBQTtBQUFBLE1BQUEsUUFBQTs7QUFBWTtBQUFBO2FBQUEsMkNBQUE7MEJBQUE7QUFBQSx3QkFBQyx1QkFBQSxHQUFzQixDQUFBLENBQUMsQ0FBQyxNQUFGLENBQVMsSUFBVCxDQUFBLENBQXRCLEdBQXNDLFVBQXZDLENBQUE7QUFBQTs7bUJBQVosQ0FBQTthQUNBLFFBQVEsQ0FBQyxJQUFULENBQWMsRUFBZCxFQUZlO0lBQUEsQ0FqQmpCLENBQUE7O3FCQUFBOztNQUxGLENBQUE7QUFBQSIKfQ==
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/violation.coffee