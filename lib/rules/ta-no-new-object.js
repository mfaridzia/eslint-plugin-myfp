"use strict";

function getVariableByName(initScope, name) {
  let scope = initScope;
  while (scope) {
    const variable = scope.set.get(name);
    if (variable) {
      return variable;
    }
    scope = scope.upper;
  }
  return null;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "disallow Object constructors",
      category: "Stylistic Issues",
      recommended: false,
    },
    schema: [],
    messages: {
      preferLiteral: "The object literal notation is preferrable."
    }    
  },

  create(context) {
    return {
      NewExpression(node) {
        const variable = getVariableByName(
          context.getScope(),
          node.callee.name
        );

        if (variable && variable.identifiers.length > 0) {
          return;
        }

        if (node.callee.name === "Object") {
          context.report({
            node,
            messageId: "preferLiteral"
          });
        }
      }
    };
  }
};
