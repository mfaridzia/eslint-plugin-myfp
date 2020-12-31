"use strict";

function getStaticStringValue(node) {
    switch (node.type) {
        case "Literal":
            if (node.value === null) {
                if (isNullLiteral(node)) {
                    return String(node.value); // null
                }
                if (node.regex) {
                    return `/${node.regex.pattern}/${node.regex.flags}`;
                }
                if (node.bigint) {
                    return node.bigint;
                } // Otherwise this is an unknown literal, function will return null
            } else {
                return String(node.value);
            }
            break;
        case "TemplateLiteral":
            if (node.expressions.length === 0 && node.quasis.length === 1) {
                return node.quasis[0].value.cooked;
            }
            break;
            // no default
    }
    return null;
}

function getStaticPropertyName(node) {
    let prop;

    switch (node && node.type) {
        case "ChainExpression":
            return getStaticPropertyName(node.expression);

        case "Property":
        case "MethodDefinition":
            prop = node.key;
            break;

        case "MemberExpression":
            prop = node.property;
            break;
            // no default
    }

    if (prop) {
        if (prop.type === "Identifier" && !node.computed) {
            return prop.name;
        }
        return getStaticStringValue(prop);
    }
    return null;
}

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = {
    meta: {
        type: "problem",
        docs: {
            description: "disallow duplicate class members",
            category: "ES6",
        },
        schema: [],
        messages: {
            unexpected: "Duplicate name '{{name}}'."
        }
    },

    create(context) {
        let stack = [];

        // Gets state of a given member name
        function getState(name, isStatic) {
            const stateMap = stack[stack.length - 1];
            const key = `$${name}`; // to avoid proto

            if (!stateMap[key]) {
                stateMap[key] = {
                    nonStatic: { init: false, get: false, set: false },
                    static: { init: false, get: false, set: false }
                };
            }

            return stateMap[key][isStatic ? "static" : "nonStatic"];
        }

        return {

            // Initializes the stack of state of member declarations
            Program() {
                stack = [];
            },

            // Initializes state of member declarations for the class
            ClassBody() {
                stack.push(Object.create(null));
            },

            // Disposes the state for the class
            "ClassBody:exit"() {
                stack.pop();
            },

            // Reports the node if its name has been declared already
            MethodDefinition(node) {
                const name = getStaticPropertyName(node);

                if (name === null || node.kind === "constructor") {
                    return;
                }

                const state = getState(name, node.static);
                let isDuplicate = false;

                if (node.kind === "get") {
                    isDuplicate = (state.init || state.get);
                    state.get = true;
                } else if (node.kind === "set") {
                    isDuplicate = (state.init || state.set);
                    state.set = true;
                } else {
                    isDuplicate = (state.init || state.get || state.set);
                    state.init = true;
                }

                if (isDuplicate) {
                    context.report({ node, messageId: "unexpected", data: { name } });
                }
            }
        };
    }
};