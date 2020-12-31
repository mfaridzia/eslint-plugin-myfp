/**
 * @fileoverview enforce consistent spacing before and after the arrow in arrow functions&#34;
 * @author muhfaridzia
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ta-use-arrow-spacing"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ta-use-arrow-spacing", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "()=> {};",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
