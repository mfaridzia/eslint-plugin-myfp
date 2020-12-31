"use strict";


function isNullLiteral(node) {
    // Checking node.value === null does not guarantee that a literal is a null literal.
    return node.type === "Literal" && node.value === null && !node.regex && !node.bigint;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "suggestion",

        docs: {
            description: "require the use of === and !==",
            category: "Best Practices",
        },

        schema: {
            anyOf: [
                {
                    type: "array",
                    items: [
                        {
                            enum: ["always"]
                        },
                        {
                            type: "object",
                            properties: {
                                null: {
                                    enum: ["always", "never", "ignore"]
                                }
                            },
                            additionalProperties: false
                        }
                    ],
                    additionalItems: false
                },
                {
                    type: "array",
                    items: [
                        {
                            enum: ["smart", "allow-null"]
                        }
                    ],
                    additionalItems: false
                }
            ]
        },

        fixable: "code",

        messages: {
            unexpected: "Expected '{{expectedOperator}}' and instead saw '{{actualOperator}}'."
        }
    },

    create(context) {
        const config = context.options[0] || "always";
        const options = context.options[1] || {};
        const sourceCode = context.getSourceCode();

        const nullOption = (config === "always")
            ? options.null || "always"
            : "ignore";
        const enforceRuleForNull = (nullOption === "always");
        const enforceInverseRuleForNull = (nullOption === "never");

       // Checks if an expression is a typeof expression
        function isTypeOf(node) {
            return node.type === "UnaryExpression" && node.operator === "typeof";
        }

       // Checks if either operand of a binary expression is a typeof operation
        function isTypeOfBinary(node) {
            return isTypeOf(node.left) || isTypeOf(node.right);
        }

        // Checks if operands are literals of the same type (via typeof)
        function areLiteralsAndSameType(node) {
            return node.left.type === "Literal" && node.right.type === "Literal" &&
                    typeof node.left.value === typeof node.right.value;
        }
        
        // Checks if one of the operands is a literal null
        function isNullCheck(node) {
            return isNullLiteral(node.right) || isNullLiteral(node.left);
        }

        // report message 
        function report(node, expectedOperator) {
            const operatorToken = sourceCode.getFirstTokenBetween(
                node.left,
                node.right,
                token => token.value === node.operator
            );

            context.report({
                node,
                loc: operatorToken.loc,
                messageId: "unexpected",
                data: { expectedOperator, actualOperator: node.operator }
            });
        }

        return {
            BinaryExpression(node) {
                const isNull = isNullCheck(node);

                if (node.operator !== "==" && node.operator !== "!=") {
                    if (enforceInverseRuleForNull && isNull) {
                        report(node, node.operator.slice(0, -1));
                    }
                    return;
                }

                if (config === "smart" && (isTypeOfBinary(node) ||
                        areLiteralsAndSameType(node) || isNull)) {
                    return;
                }

                if (!enforceRuleForNull && isNull) {
                    return;
                }

                report(node, `${node.operator}=`);
            }
        };

    }
};