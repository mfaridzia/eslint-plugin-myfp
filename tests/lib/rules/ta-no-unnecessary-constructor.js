/**
 * @fileoverview disallow unnecessary constructors
 * @author muhfaridzia
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ta-no-unnecessary-constructor"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ta-no-unnecessary-constructor", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "class A { constructor () {} }",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
