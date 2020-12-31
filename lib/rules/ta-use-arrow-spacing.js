"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

// check if function is arrow-function
function isArrowToken(token) {
  return token.value === "=>" && token.type === "Punctuator";
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        docs: {
            description: "enforce consistent spacing before and after the arrow in arrow functions",
            category: "ES6",
        },

        schema: [],

        messages: {
            expectedBefore: "Missing space before =>.",
            unexpectedBefore: "Unexpected space before =>.",

            expectedAfter: "Missing space after =>.",
            unexpectedAfter: "Unexpected space after =>."
        }
    },

    create(context) {

        // create new obj and merge rules with default value
        const rule = Object.assign({}, context.options[0]);

        rule.before = rule.before !== false;
        rule.after = rule.after !== false;

        const sourceCode = context.getSourceCode();

        // Get tokens of arrow and before/after arrow
        function getTokens(node) {
            const arrow = sourceCode.getTokenBefore(node.body, isArrowToken);

            return {
                before: sourceCode.getTokenBefore(arrow),
                arrow,
                after: sourceCode.getTokenAfter(arrow)
            };
        }

        // Count spaces before/after arrow token
        function countSpaces(tokens) {
            const before = tokens.arrow.range[0] - tokens.before.range[1];
            const after = tokens.after.range[0] - tokens.arrow.range[1];

            return { before, after };
        }

        // Determines whether space before after arrow is match rule
        function spaces(node) {
            const tokens = getTokens(node);
            const countSpace = countSpaces(tokens);

            if (rule.before) {

                // should be space before arrow
                if (countSpace.before === 0) {
                    context.report({
                        node: tokens.before,
                        messageId: "expectedBefore"
                    });
                }
            } else {

                // should be no space before arrow
                if (countSpace.before > 0) {
                    context.report({
                        node: tokens.before,
                        messageId: "unexpectedBefore"
                    });
                }
            }

            if (rule.after) {

                // should be space(s) after arrow
                if (countSpace.after === 0) {
                    context.report({
                        node: tokens.after,
                        messageId: "expectedAfter"
                    });
                }
            } else {

                // should be no space after arrow
                if (countSpace.after > 0) {
                    context.report({
                        node: tokens.after,
                        messageId: "unexpectedAfter"
                    });
                }
            }
        }

        return {
            ArrowFunctionExpression: spaces
        };
    }
};