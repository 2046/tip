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
        var div = $('<div style="width:50px;height:50px;background-color:red;"/>').appendTo(document.body);
        // var div2 = $('<div style="width:50px;height:50px;background-color:red;"/>').appendTo(document.body);
        it('normal usage', function(){
            new Tip({
                trigger : div,
                content : '我是内容 我是内容'
            });

            // new Tip({
            //     trigger : div2,
            //     content : '我是内容 我是内容'
            // });
        });
    });
});