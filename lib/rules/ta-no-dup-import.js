"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

// Returns the name of the module imported or re-exported.
function getValue(node) {
    if (node && node.source && node.source.value) {
        return node.source.value.trim();
    }
    return "";
}

// Checks if the name of the import or export exists in the given array, and reports if so.
function checkAndReport(context, node, value, array, messageId) {
    if (array.indexOf(value) !== -1) {
        context.report({
            node,
            messageId,
            data: {
                module: value
            }
        });
    }
}

// Returns a function handling the imports of a given file
function handleImports(context, includeExports, importsInFile, exportsInFile) {
    return function(node) {
        const value = getValue(node);

        if (value) {
            checkAndReport(context, node, value, importsInFile, "import");

            if (includeExports) {
                checkAndReport(context, node, value, exportsInFile, "importAs");
            }

            importsInFile.push(value);
        }
    };
}

// Returns a function handling the exports of a given file
function handleExports(context, importsInFile, exportsInFile) {
    return function(node) {
        const value = getValue(node);

        if (value) {
            checkAndReport(context, node, value, exportsInFile, "export");
            checkAndReport(context, node, value, importsInFile, "exportAs");

            exportsInFile.push(value);
        }
    };
}

module.exports = {
    meta: {
        type: "problem",

        docs: {
            description: "disallow duplicate module imports",
            category: "ES6",
        },

        schema: [],
        messages: {
            import: "'{{module}}' import is duplicated.",
            importAs: "'{{module}}' import is duplicated as export.",
            export: "'{{module}}' export is duplicated.",
            exportAs: "'{{module}}' export is duplicated as import."
        }
    },

    create(context) {
        const includeExports = (context.options[0] || {}).includeExports,
            importsInFile = [],
            exportsInFile = [];

        const handlers = {
            ImportDeclaration: handleImports(context, includeExports, importsInFile, exportsInFile)
        };

        if (includeExports) {
            handlers.ExportNamedDeclaration = handleExports(context, importsInFile, exportsInFile);
            handlers.ExportAllDeclaration = handleExports(context, importsInFile, exportsInFile);
        }

        return handlers;
    }
};