(function() {
  var $, AnnotationTooltip, Color, Config, ViolationTooltip,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Color = require('color');

  $ = require('atom').$;

  AnnotationTooltip = require('./annotation-tooltip');

  Config = require('./config');

  module.exports = ViolationTooltip = (function(_super) {
    __extends(ViolationTooltip, _super);

    function ViolationTooltip() {
      return ViolationTooltip.__super__.constructor.apply(this, arguments);
    }

    ViolationTooltip.DEFAULTS = $.extend({}, AnnotationTooltip.DEFAULTS, {
      violation: null,
      template: '<div class="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-inner">' + '<span class="message"></span><wbr><span class="metadata"></span>' + '<div class="attachment"></div>' + '</div>' + '</div>'
    });

    ViolationTooltip.prototype.init = function(type, element, options) {
      ViolationTooltip.__super__.init.call(this, type, element, options);
      this.violation = options.violation;
      return this.configSubscription = Config.observe('showViolationMetadata', (function(_this) {
        return function(newValue) {
          return _this.switchMetadataDisplay();
        };
      })(this));
    };

    ViolationTooltip.prototype.getDefaults = function() {
      return ViolationTooltip.DEFAULTS;
    };

    ViolationTooltip.prototype.setContent = function() {
      this.setMessageContent();
      this.setMetadataContent();
      this.setAttachmentContent();
      return this.tip().removeClass('fade in top bottom left right');
    };

    ViolationTooltip.prototype.setMessageContent = function() {
      return this.content().find('.message').html(this.violation.getMessageHTML() || '');
    };

    ViolationTooltip.prototype.setMetadataContent = function() {
      return this.content().find('.metadata').html(this.violation.getMetadataHTML() || '');
    };

    ViolationTooltip.prototype.setAttachmentContent = function() {
      var $attachment, HTML;
      $attachment = this.content().find('.attachment');
      HTML = this.violation.getAttachmentHTML();
      if (HTML != null) {
        return $attachment.html(HTML);
      } else {
        return $attachment.hide();
      }
    };

    ViolationTooltip.prototype.hasContent = function() {
      return this.violation != null;
    };

    ViolationTooltip.prototype.applyAdditionalStyle = function() {
      var $code, frontColor;
      ViolationTooltip.__super__.applyAdditionalStyle.call(this);
      $code = this.content().find('code, pre');
      if ($code.length > 0) {
        frontColor = Color(this.content().css('color'));
        $code.css('color', frontColor.clone().rgbaString());
        $code.css('background-color', frontColor.clone().clearer(0.96).rgbaString());
        $code.css('border-color', frontColor.clone().clearer(0.86).rgbaString());
      }
      return this.switchMetadataDisplay();
    };

    ViolationTooltip.prototype.switchMetadataDisplay = function() {
      if (this.shouldShowMetadata()) {
        if (!this.metadataFitInLastLineOfMessage()) {
          return this.content().find('.metadata').addClass('block-metadata');
        }
      } else {
        return this.content().find('.metadata').hide();
      }
    };

    ViolationTooltip.prototype.shouldShowMetadata = function() {
      return Config.get('showViolationMetadata');
    };

    ViolationTooltip.prototype.metadataFitInLastLineOfMessage = function() {
      var $message, $metadata, messageBottom, metadataBottom;
      $metadata = this.content().find('.metadata');
      $metadata.css('display', 'inline');
      $message = this.content().find('.message');
      messageBottom = $message.position().top + $message.height();
      $metadata = this.content().find('.metadata');
      metadataBottom = $metadata.position().top + $metadata.height();
      $metadata.css('display', '');
      return messageBottom === metadataBottom;
    };

    ViolationTooltip.prototype.content = function() {
      return this.contentElement != null ? this.contentElement : this.contentElement = this.tip().find('.tooltip-inner');
    };

    ViolationTooltip.prototype.destroy = function() {
      ViolationTooltip.__super__.destroy.call(this);
      return this.configSubscription.off();
    };

    return ViolationTooltip;

  })(AnnotationTooltip);

}).call(this);

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0MsSUFBSyxPQUFBLENBQVEsTUFBUixFQUFMLENBREQsQ0FBQTs7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSxzQkFBUixDQUZwQixDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLFFBQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxpQkFBaUIsQ0FBQyxRQUEvQixFQUF5QztBQUFBLE1BQ25ELFNBQUEsRUFBVyxJQUR3QztBQUFBLE1BRW5ELFFBQUEsRUFBVSx1QkFBQSxHQUNFLG1DQURGLEdBRUUsNkJBRkYsR0FHSSxrRUFISixHQUlJLGdDQUpKLEdBS0UsUUFMRixHQU1BLFFBUnlDO0tBQXpDLENBQVosQ0FBQTs7QUFBQSwrQkFXQSxJQUFBLEdBQU0sU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixHQUFBO0FBQ0osTUFBQSwyQ0FBTSxJQUFOLEVBQVksT0FBWixFQUFxQixPQUFyQixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBTyxDQUFDLFNBRnJCLENBQUE7YUFJQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsTUFBTSxDQUFDLE9BQVAsQ0FBZSx1QkFBZixFQUF3QyxDQUFBLFNBQUEsS0FBQSxHQUFBO2VBQUEsU0FBQyxRQUFELEdBQUE7aUJBQzVELEtBQUMsQ0FBQSxxQkFBRCxDQUFBLEVBRDREO1FBQUEsRUFBQTtNQUFBLENBQUEsQ0FBQSxDQUFBLElBQUEsQ0FBeEMsRUFMbEI7SUFBQSxDQVhOLENBQUE7O0FBQUEsK0JBbUJBLFdBQUEsR0FBYSxTQUFBLEdBQUE7YUFDWCxnQkFBZ0IsQ0FBQyxTQUROO0lBQUEsQ0FuQmIsQ0FBQTs7QUFBQSwrQkFzQkEsVUFBQSxHQUFZLFNBQUEsR0FBQTtBQUNWLE1BQUEsSUFBQyxDQUFBLGlCQUFELENBQUEsQ0FBQSxDQUFBO0FBQUEsTUFDQSxJQUFDLENBQUEsa0JBQUQsQ0FBQSxDQURBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxvQkFBRCxDQUFBLENBRkEsQ0FBQTthQUdBLElBQUMsQ0FBQSxHQUFELENBQUEsQ0FBTSxDQUFDLFdBQVAsQ0FBbUIsK0JBQW5CLEVBSlU7SUFBQSxDQXRCWixDQUFBOztBQUFBLCtCQTRCQSxpQkFBQSxHQUFtQixTQUFBLEdBQUE7YUFDakIsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsSUFBWCxDQUFnQixVQUFoQixDQUEyQixDQUFDLElBQTVCLENBQWlDLElBQUMsQ0FBQSxTQUFTLENBQUMsY0FBWCxDQUFBLENBQUEsSUFBK0IsRUFBaEUsRUFEaUI7SUFBQSxDQTVCbkIsQ0FBQTs7QUFBQSwrQkErQkEsa0JBQUEsR0FBb0IsU0FBQSxHQUFBO2FBQ2xCLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsV0FBaEIsQ0FBNEIsQ0FBQyxJQUE3QixDQUFrQyxJQUFDLENBQUEsU0FBUyxDQUFDLGVBQVgsQ0FBQSxDQUFBLElBQWdDLEVBQWxFLEVBRGtCO0lBQUEsQ0EvQnBCLENBQUE7O0FBQUEsK0JBa0NBLG9CQUFBLEdBQXNCLFNBQUEsR0FBQTtBQUNwQixVQUFBLGlCQUFBO0FBQUEsTUFBQSxXQUFBLEdBQWMsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsSUFBWCxDQUFnQixhQUFoQixDQUFkLENBQUE7QUFBQSxNQUNBLElBQUEsR0FBTyxJQUFDLENBQUEsU0FBUyxDQUFDLGlCQUFYLENBQUEsQ0FEUCxDQUFBO0FBRUEsTUFBQSxJQUFHLFlBQUg7ZUFDRSxXQUFXLENBQUMsSUFBWixDQUFpQixJQUFqQixFQURGO09BQUEsTUFBQTtlQUdFLFdBQVcsQ0FBQyxJQUFaLENBQUEsRUFIRjtPQUhvQjtJQUFBLENBbEN0QixDQUFBOztBQUFBLCtCQTBDQSxVQUFBLEdBQVksU0FBQSxHQUFBO2FBQ1YsdUJBRFU7SUFBQSxDQTFDWixDQUFBOztBQUFBLCtCQTZDQSxvQkFBQSxHQUFzQixTQUFBLEdBQUE7QUFDcEIsVUFBQSxpQkFBQTtBQUFBLE1BQUEseURBQUEsQ0FBQSxDQUFBO0FBQUEsTUFFQSxLQUFBLEdBQVEsSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsSUFBWCxDQUFnQixXQUFoQixDQUZSLENBQUE7QUFJQSxNQUFBLElBQUcsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUFsQjtBQUNFLFFBQUEsVUFBQSxHQUFhLEtBQUEsQ0FBTSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVUsQ0FBQyxHQUFYLENBQWUsT0FBZixDQUFOLENBQWIsQ0FBQTtBQUFBLFFBQ0EsS0FBSyxDQUFDLEdBQU4sQ0FBVSxPQUFWLEVBQW1CLFVBQVUsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxVQUFuQixDQUFBLENBQW5CLENBREEsQ0FBQTtBQUFBLFFBRUEsS0FBSyxDQUFDLEdBQU4sQ0FBVSxrQkFBVixFQUE4QixVQUFVLENBQUMsS0FBWCxDQUFBLENBQWtCLENBQUMsT0FBbkIsQ0FBMkIsSUFBM0IsQ0FBZ0MsQ0FBQyxVQUFqQyxDQUFBLENBQTlCLENBRkEsQ0FBQTtBQUFBLFFBR0EsS0FBSyxDQUFDLEdBQU4sQ0FBVSxjQUFWLEVBQTBCLFVBQVUsQ0FBQyxLQUFYLENBQUEsQ0FBa0IsQ0FBQyxPQUFuQixDQUEyQixJQUEzQixDQUFnQyxDQUFDLFVBQWpDLENBQUEsQ0FBMUIsQ0FIQSxDQURGO09BSkE7YUFVQSxJQUFDLENBQUEscUJBQUQsQ0FBQSxFQVhvQjtJQUFBLENBN0N0QixDQUFBOztBQUFBLCtCQTBEQSxxQkFBQSxHQUF1QixTQUFBLEdBQUE7QUFDckIsTUFBQSxJQUFHLElBQUMsQ0FBQSxrQkFBRCxDQUFBLENBQUg7QUFrQkUsUUFBQSxJQUFBLENBQUEsSUFBUSxDQUFBLDhCQUFELENBQUEsQ0FBUDtpQkFDRSxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVUsQ0FBQyxJQUFYLENBQWdCLFdBQWhCLENBQTRCLENBQUMsUUFBN0IsQ0FBc0MsZ0JBQXRDLEVBREY7U0FsQkY7T0FBQSxNQUFBO2VBcUJFLElBQUMsQ0FBQSxPQUFELENBQUEsQ0FBVSxDQUFDLElBQVgsQ0FBZ0IsV0FBaEIsQ0FBNEIsQ0FBQyxJQUE3QixDQUFBLEVBckJGO09BRHFCO0lBQUEsQ0ExRHZCLENBQUE7O0FBQUEsK0JBa0ZBLGtCQUFBLEdBQW9CLFNBQUEsR0FBQTthQUNsQixNQUFNLENBQUMsR0FBUCxDQUFXLHVCQUFYLEVBRGtCO0lBQUEsQ0FsRnBCLENBQUE7O0FBQUEsK0JBcUZBLDhCQUFBLEdBQWdDLFNBQUEsR0FBQTtBQUU5QixVQUFBLGtEQUFBO0FBQUEsTUFBQSxTQUFBLEdBQVksSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsSUFBWCxDQUFnQixXQUFoQixDQUFaLENBQUE7QUFBQSxNQUNBLFNBQVMsQ0FBQyxHQUFWLENBQWMsU0FBZCxFQUF5QixRQUF6QixDQURBLENBQUE7QUFBQSxNQUdBLFFBQUEsR0FBVyxJQUFDLENBQUEsT0FBRCxDQUFBLENBQVUsQ0FBQyxJQUFYLENBQWdCLFVBQWhCLENBSFgsQ0FBQTtBQUFBLE1BSUEsYUFBQSxHQUFnQixRQUFRLENBQUMsUUFBVCxDQUFBLENBQW1CLENBQUMsR0FBcEIsR0FBMEIsUUFBUSxDQUFDLE1BQVQsQ0FBQSxDQUoxQyxDQUFBO0FBQUEsTUFNQSxTQUFBLEdBQVksSUFBQyxDQUFBLE9BQUQsQ0FBQSxDQUFVLENBQUMsSUFBWCxDQUFnQixXQUFoQixDQU5aLENBQUE7QUFBQSxNQU9BLGNBQUEsR0FBaUIsU0FBUyxDQUFDLFFBQVYsQ0FBQSxDQUFvQixDQUFDLEdBQXJCLEdBQTJCLFNBQVMsQ0FBQyxNQUFWLENBQUEsQ0FQNUMsQ0FBQTtBQUFBLE1BU0EsU0FBUyxDQUFDLEdBQVYsQ0FBYyxTQUFkLEVBQXlCLEVBQXpCLENBVEEsQ0FBQTthQVdBLGFBQUEsS0FBaUIsZUFiYTtJQUFBLENBckZoQyxDQUFBOztBQUFBLCtCQW9HQSxPQUFBLEdBQVMsU0FBQSxHQUFBOzJDQUNQLElBQUMsQ0FBQSxpQkFBRCxJQUFDLENBQUEsaUJBQWtCLElBQUMsQ0FBQSxHQUFELENBQUEsQ0FBTSxDQUFDLElBQVAsQ0FBWSxnQkFBWixFQURaO0lBQUEsQ0FwR1QsQ0FBQTs7QUFBQSwrQkF1R0EsT0FBQSxHQUFTLFNBQUEsR0FBQTtBQUNQLE1BQUEsNENBQUEsQ0FBQSxDQUFBO2FBQ0EsSUFBQyxDQUFBLGtCQUFrQixDQUFDLEdBQXBCLENBQUEsRUFGTztJQUFBLENBdkdULENBQUE7OzRCQUFBOztLQUQ2QixrQkFOL0IsQ0FBQTtBQUFBIgp9
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/violation-tooltip.coffee