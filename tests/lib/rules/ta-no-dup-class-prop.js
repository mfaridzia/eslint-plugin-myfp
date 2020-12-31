/**
 * @fileoverview disallow duplicate class members
 * @author muhfaridzia
 */
"use strict";

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var rule = require("../../../lib/rules/ta-no-dup-class-prop"),

    RuleTester = require("eslint").RuleTester;


//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

var ruleTester = new RuleTester();
ruleTester.run("ta-no-dup-class-prop", rule, {

    valid: [

        // give me some code that won't trigger a warning
    ],

    invalid: [
        {
            code: "class Foo { bar() { } bar() { } }",
            errors: [{
                message: "Fill me in.",
                type: "Me too"
            }]
        }
    ]
});
