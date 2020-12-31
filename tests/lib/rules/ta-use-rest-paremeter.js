/**
 * @fileoverview use rest parameters instead of arguments
 * @author muhfaridzia
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ta-use-rest-paremeter"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ta-use-rest-paremeter", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "function foo() { console.log(arguments) }",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
