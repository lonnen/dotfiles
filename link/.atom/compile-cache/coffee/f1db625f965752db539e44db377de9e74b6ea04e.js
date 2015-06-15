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
      return this.configSubscription = Config.onDidChange('showViolationMetadata', (function(_this) {
        return function(event) {
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

//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAiZmlsZSI6ICIiLAogICJzb3VyY2VSb290IjogIiIsCiAgInNvdXJjZXMiOiBbCiAgICAiIgogIF0sCiAgIm5hbWVzIjogW10sCiAgIm1hcHBpbmdzIjogIkFBQUE7QUFBQSxNQUFBLHFEQUFBO0lBQUE7bVNBQUE7O0FBQUEsRUFBQSxLQUFBLEdBQVEsT0FBQSxDQUFRLE9BQVIsQ0FBUixDQUFBOztBQUFBLEVBQ0MsSUFBSyxPQUFBLENBQVEsTUFBUixFQUFMLENBREQsQ0FBQTs7QUFBQSxFQUVBLGlCQUFBLEdBQW9CLE9BQUEsQ0FBUSxzQkFBUixDQUZwQixDQUFBOztBQUFBLEVBR0EsTUFBQSxHQUFTLE9BQUEsQ0FBUSxVQUFSLENBSFQsQ0FBQTs7QUFBQSxFQUtBLE1BQU0sQ0FBQyxPQUFQLEdBQ007QUFDSix1Q0FBQSxDQUFBOzs7O0tBQUE7O0FBQUEsSUFBQSxnQkFBQyxDQUFBLFFBQUQsR0FBWSxDQUFDLENBQUMsTUFBRixDQUFTLEVBQVQsRUFBYSxpQkFBaUIsQ0FBQyxRQUEvQixFQUF5QztBQUFBLE1BQ25ELFNBQUEsRUFBVyxJQUR3QztBQUFBLE1BRW5ELFFBQUEsRUFBVSx1QkFBQSxHQUNFLG1DQURGLEdBRUUsNkJBRkYsR0FHSSxrRUFISixHQUlJLGdDQUpKLEdBS0UsUUFMRixHQU1BLFFBUnlDO0tBQXpDLENBQVosQ0FBQTs7QUFBQSwrQkFXQSxJQUFBLEdBQU0sU0FBQyxJQUFELEVBQU8sT0FBUCxFQUFnQixPQUFoQixHQUFBO0FBQ0osTUFBQSwyQ0FBTSxJQUFOLEVBQVksT0FBWixFQUFxQixPQUFyQixDQUFBLENBQUE7QUFBQSxNQUVBLElBQUMsQ0FBQSxTQUFELEdBQWEsT0FBTyxDQUFDLFNBRnJCLENBQUE7YUFJQSxJQUFDLENBQUEsa0JBQUQsR0FBc0IsTUFBTSxDQUFDLFdBQVAsQ0FBbUIsdUJBQW5CLEVBQTRDLENBQUEsU0FBQSxLQUFBLEdBQUE7ZUFBQSxTQUFDLEtBQUQsR0FBQTtpQkFDaEUsS0FBQyxDQUFBLHFCQUFELENBQUEsRUFE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
//# sourceURL=/Users/lonnen/.atom/packages/atom-lint/lib/violation-tooltip.coffee