"use strict";

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

// Checks whether a given array of statements is a single call of `super`.
function isSingleSuperCall(body) {
    return (
        body.length === 1 &&
        body[0].type === "ExpressionStatement" &&
        body[0].expression.type === "CallExpression" &&
        body[0].expression.callee.type === "Super"
    );
}

// Checks whether a given node is a pattern which doesn't have any side effects.
function isSimple(node) {
    return node.type === "Identifier" || node.type === "RestElement";
}

// Checks whether a given array of expressions is arguments or not
function isSpreadArguments(superArgs) {
    return (
        superArgs.length === 1 &&
        superArgs[0].type === "SpreadElement" &&
        superArgs[0].argument.type === "Identifier" &&
        superArgs[0].argument.name === "arguments"
    );
}

// Checks whether given 2 nodes are identifiers which have the same name or not.
function isValidIdentifierPair(ctorParam, superArg) {
    return (
        ctorParam.type === "Identifier" &&
        superArg.type === "Identifier" &&
        ctorParam.name === superArg.name
    );
}

//  Checks whether given 2 nodes are a rest/spread pair which has the same values.
function isValidRestSpreadPair(ctorParam, superArg) {
    return (
        ctorParam.type === "RestElement" &&
        superArg.type === "SpreadElement" &&
        isValidIdentifierPair(ctorParam.argument, superArg.argument)
    );
}


// Checks whether given 2 nodes have the same value or not.
function isValidPair(ctorParam, superArg) {
    return (
        isValidIdentifierPair(ctorParam, superArg) ||
        isValidRestSpreadPair(ctorParam, superArg)
    );
}

// Checks whether the parameters of a constructor and the arguments of `super()`
function isPassingThrough(ctorParams, superArgs) {
    if (ctorParams.length !== superArgs.length) {
        return false;
    }

    for (let i = 0; i < ctorParams.length; ++i) {
        if (!isValidPair(ctorParams[i], superArgs[i])) {
            return false;
        }
    }

    return true;
}

// Checks whether the constructor body is a redundant super call.
function isRedundantSuperCall(body, ctorParams) {
    return (
        isSingleSuperCall(body) &&
        ctorParams.every(isSimple) &&
        (
            isSpreadArguments(body[0].expression.arguments) ||
            isPassingThrough(ctorParams, body[0].expression.arguments)
        )
    );
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",
        docs: {
            description: "disallow unnecessary constructors",
            category: "ES6"
        },

        schema: [],

        messages: {
            noUselessConstructor: "Useless constructor."
        }
    },

    create(context) {

        // Checks whether a node is a redundant constructor        
        function checkForConstructor(node) {
            if (node.kind !== "constructor") {
                return;
            }

            // Prevent crashing on parsers which do not require class constructor
            if (!node.value.body) {
                return;
            }

            const body = node.value.body.body;
            const ctorParams = node.value.params;
            const superClass = node.parent.parent.superClass;

            if (superClass ? isRedundantSuperCall(body, ctorParams) : (body.length === 0)) {
                context.report({
                    node,
                    messageId: "noUselessConstructor"
                });
            }
        }

        return {
            MethodDefinition: checkForConstructor
        };
    }
};