/**
 * @fileoverview disallow use of chained assignment expressions
 * @author muhfaridzia
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ta-no-chained-var"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ta-no-chained-var", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "var a = b = c = 5;",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
