"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

//  Gets the variable object of arguments which is defined implicitly
function getVariableOfArguments(scope) {
    const variables = scope.variables;

    for (let i = 0; i < variables.length; ++i) {
        const variable = variables[i];

        if (variable.name === "arguments") {
            //If there arguments, the implicit arguments is not defined
            return (variable.identifiers.length === 0) ? variable : null;
        }
    }
    /* istanbul ignore next : unreachable */
    return null;
}

//  Checks if the reference is not normal member access
function isNotNormalMemberAccess(reference) {
    const id = reference.identifier;
    const parent = id.parent;

    return !(
        parent.type === "MemberExpression" &&
        parent.object === id &&
        !parent.computed
    );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "user rest parameters instead of `arguments`",
            category: "ES6",
        },

        schema: [],

        messages: {
            preferRestParams: "Use the rest parameters instead of 'arguments'."
        }
    },

    create(context) {

        function report(reference) {
            context.report({
                node: reference.identifier,
                loc: reference.identifier.loc,
                messageId: "preferRestParams"
            });
        }
        
        // report references of the implicit arguments variable if exist
        function checkForArguments() {
            const argumentsVar = getVariableOfArguments(context.getScope());

            if (argumentsVar) {
                argumentsVar.references.filter(isNotNormalMemberAccess).forEach(report);
            }
        }

        return {
            "FunctionDeclaration:exit": checkForArguments,
            "FunctionExpression:exit": checkForArguments
        };
    }
};