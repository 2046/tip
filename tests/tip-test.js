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
        var div = $('<div style="width:50px;margin: 200px;height:500px;background-color:red;"/>').appendTo(document.body);
        var div2 = $('<div id="div2" style="width:50px;margin: 200px;height:500px;background-color:red;"/>').appendTo(document.body);
        it('normal usage', function(){
            new Tip({
                trigger : div,
                direction : 'right',
                content : '<div style="">我是内容 我是内容</div>'
            });

            new Tip({
                trigger : div2,
                direction : 'down',
                content : '<div style="width:200px;height:150px;">我是内容 我是内容</div>'
            });
        });
    });
});