define(function(require, exports, module){
    'use strict'

    var expect, Tip;

    Tip = require('tip');
    expect = require('expect');

    function equals(){
        var args = arguments;
        expect(args[0]).to.equal(args[1]);
    };

    describe('Tip', function(){
        it('normal usage', function(){
            new Tip();
        });
    });
});