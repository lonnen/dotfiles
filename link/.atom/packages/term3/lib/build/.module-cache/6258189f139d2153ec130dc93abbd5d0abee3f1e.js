/** @jsx React.DOM */
/* global HTMLElement */
"use strict";

var React = require("react-atom-fork");
var flux = require("flukes");
var terminals = require("../terminal-model");

var TerminalView = React.createClass({displayName: 'TerminalView',
  propTypes: {
    terminal: React.PropTypes.instanceOf(terminals),
  },
  onMouseDown: function () {
    this.props.terminal.open();
  },
  render: function () {
    const t = this.props.terminal;
    return (
      React.DOM.li({onMouseDown: this.onMouseDown.bind(this, t.id)}, 
        React.DOM.i({className: "icon icon-terminal"}), 
        "tty-", t.title
      )
    );
  }
});

var ListView = React.createClass({displayName: 'ListView',
  mixins: [flux.createAutoBinder([], [terminals])],
  render: function () {
    // XXXX: Horrible hack to work around a bug in Atom. Sometimes, Atom will erase NODE_ENV when run from the command line
    if (!process.env.NODE_ENV) {
      process.env.NODE_ENV = "production";
    }
    if (!terminals.length) {
      return (React.DOM.div(null));
    }
    const terms = terminals.map(function (t) {
      return (TerminalView({terminal: t, key: t.id}));
    });
    return (
      React.DOM.div({className: "header"}, 
        React.DOM.span({className: ""}, React.DOM.i({className: "icon icon-terminal"}), "terminals"), 
        React.DOM.ul(null, 
          terms
        )
      )
    );
  }
});

const HTMLElementProto = Object.create(HTMLElement.prototype);

// HTMLElementProto.createdCallback = function () {
//   return;
// };

HTMLElementProto.attachedCallback = function () {
  this.reactNode = React.renderComponent(ListView({}), this);
};

// HTMLElementProto.attributeChangedCallback = function (attrName, oldVal, newVal) {
//   return;
// };

// HTMLElementProto.detachedCallback = function () {
//   return;
// };

module.exports = document.registerElement('terminal-list-view', {prototype: HTMLElementProto});
