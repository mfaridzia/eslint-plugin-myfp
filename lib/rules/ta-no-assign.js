"use strict";

function isModifyVarRef(reference, index, references) {
    const identifier = reference.identifier;
  
    // check if destructuring assignment have multiple default value and references idetifier
    const modifyDifIdentifier = index === 0 ||
        references[index - 1].identifier !== identifier;
  
    return (identifier &&
        reference.init === false &&
        reference.isWrite() &&
        modifyDifIdentifier
    );
  }
  
  
  function getModifyVarRef(references) {
    return references.filter(isModifyVarRef);
  }

//------------------------------------------------------------------------------
// Rule Definitions
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow reassigning const variables",
            category: "ES6",
            recommended: false
        },
        fixable: null,  // or "code" or "whitespace"
        schema: [],
        messages: {
            const: "'{{name}}' is constant."
        }
    },

    create: function(context) {
  
        function checkVariable(variable) {
            getModifyVarRef(variable.references).forEach(reference => {
                context.report({ node: reference.identifier, messageId: "const", data: { name: reference.identifier.name } });
            });
        }

        return {
            VariableDeclaration(node) {
                if (node.kind === "const") {
                    context.getDeclaredVariables(node).forEach(checkVariable);
                }
            }
        };
    }
};
