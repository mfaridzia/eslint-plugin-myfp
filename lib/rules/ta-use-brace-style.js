"use strict";

const STATEMENT_LIST_PARENTS = new Set(["Program", "BlockStatement", "SwitchCase"]);
function isTokenOnSameLine(left, right) {
  return left.loc.end.line === right.loc.start.line;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "layout",

        docs: {
            description: "enforce consistent brace style for blocks",
            category: "Stylistic Issues",
        },

        schema: [
            {
                enum: ["1tbs"]
            },
            {
                type: "object",
                properties: {
                    allowSingleLine: {
                        type: "boolean",
                        default: false
                    }
                },
                additionalProperties: false
            }
        ],

        fixable: "whitespace",

        messages: {
            nextLineOpen: "opening curly brace does not appear on the same line as controlling statement.",
            nextLineClose: "closing curly brace does not appear on the same line block.",
            blockSameLine: "statement inside of curly braces should be on next line.",
            singleLineClose: "closing curly brace should be on the same line as opening curly brace."
        }
    },

    create(context) {
        const style = context.options[0] || "1tbs",
            params = context.options[1] || {},
            sourceCode = context.getSourceCode();

        //--------------------------------------------------------------------------
        // Helpers
        //--------------------------------------------------------------------------

        // Validates a pair of curly brackets based on the users config
        function validateCurlyPair(openingCurly, closingCurly) {
            const tokenBeforeOpeningCurly = sourceCode.getTokenBefore(openingCurly);
            const tokenAfterOpeningCurly = sourceCode.getTokenAfter(openingCurly);
            const tokenBeforeClosingCurly = sourceCode.getTokenBefore(closingCurly);
            const singleLineException = params.allowSingleLine && isTokenOnSameLine(openingCurly, closingCurly);

            if (!isTokenOnSameLine(tokenBeforeOpeningCurly, openingCurly)) {
                context.report({
                    node: openingCurly,
                    messageId: "nextLineOpen"
                });
            }

            if (isTokenOnSameLine(openingCurly, tokenAfterOpeningCurly) && tokenAfterOpeningCurly !== closingCurly && !singleLineException) {
                context.report({
                    node: openingCurly,
                    messageId: "blockSameLine"
                });
            }

            if (tokenBeforeClosingCurly !== openingCurly && !singleLineException && isTokenOnSameLine(tokenBeforeClosingCurly, closingCurly)) {
                context.report({
                    node: closingCurly,
                    messageId: "singleLineClose"
                });
            }

        }

        // Validates the location of a token that appears before  a keyword like a newline before else
        function validateCurlyBeforeKeyword(curlyToken) {
            const keywordToken = sourceCode.getTokenAfter(curlyToken);

            if (style === "1tbs" && !isTokenOnSameLine(curlyToken, keywordToken)) {
                context.report({
                    node: curlyToken,
                    messageId: "nextLineClose"
                });
            }
        }

        //--------------------------------------------------------------------------
        // Public API
        //--------------------------------------------------------------------------

        return {
            BlockStatement(node) {
                if (!STATEMENT_LIST_PARENTS.has(node.parent.type)) {
                    validateCurlyPair(sourceCode.getFirstToken(node), sourceCode.getLastToken(node));
                }
            },
            ClassBody(node) {
                validateCurlyPair(sourceCode.getFirstToken(node), sourceCode.getLastToken(node));
            },
            SwitchStatement(node) {
                const closingCurly = sourceCode.getLastToken(node);
                const openingCurly = sourceCode.getTokenBefore(node.cases.length ? node.cases[0] : closingCurly);

                validateCurlyPair(openingCurly, closingCurly);
            },
            IfStatement(node) {
                if (node.consequent.type === "BlockStatement" && node.alternate) {

                    // Handle the keyword after if block and before else
                    validateCurlyBeforeKeyword(sourceCode.getLastToken(node.consequent));
                }
            },
            TryStatement(node) {

                // Handle the keyword after try block & before catch or finally
                validateCurlyBeforeKeyword(sourceCode.getLastToken(node.block));

                if (node.handler && node.finalizer) {

                    // Handle the keyword after catch block before finally
                    validateCurlyBeforeKeyword(sourceCode.getLastToken(node.handler.body));
                }
            }
        };
    }
};