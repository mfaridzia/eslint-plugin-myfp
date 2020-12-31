"use strict";

module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "require `let` or `const` instead of `var`",
      category: "ES6",
    },
    messages: {
      unexpectedVar: "Unexpected var, use let or const instead."
    }
  },

  create(context) {
    // Reports a given variable declaration node.
    function report(node) {
      context.report({
        node,
        messageId: "unexpectedVar",
      });
    }

    function noVar(node) {
      if (node.kind === "var") {
        report(node);
      }
    }

    return {
      "VariableDeclaration:exit": noVar
    };
  }
};