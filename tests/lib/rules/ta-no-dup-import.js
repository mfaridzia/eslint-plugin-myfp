/**
 * @fileoverview disallow duplicate module import
 * @author muhfaridzia
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ta-no-dup-import"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ta-no-dup-import", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "import foo from 'foo'; import { named1, named2 } from 'foo';",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
