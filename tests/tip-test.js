define(function(require, exports, module){
    'use strict'

    var expect, Tip, tip, trigger, CONTENT;

    Tip = require('tip');
    CONTENT = '_content_';
    expect = require('expect');

    function equals(){
        var args = arguments;
        expect(args[0]).to.equal(args[1]);
    };

    describe('Tip', function(){
        beforeEach(function(){
            trigger = $('<div style="width:200px;">trigger</div>').appendTo(document.body);
        });

        afterEach(function(){
            tip.element.remove();
            trigger.remove();
        });

        it('content', function(){
            tip = new Tip({
                trigger : trigger,
                content : CONTENT
            });
            tip.show();
            equals(tip.element.find('[data-id="content"]').html(), CONTENT);
        });

        it('hover trigger', function(done){
            tip = new Tip({
                trigger : trigger,
                content : CONTENT
            });
            expect(tip.element.is(':visible')).to.be(false);
            trigger.trigger('mouseover');
            setTimeout(function(){
                expect(tip.element.is(':visible')).to.be(true);
                done();
            }, 80);
        });

        it('content from function', function(){
            tip = new Tip({
                trigger : trigger,
                content : function(){
                    return 'test content'
                }
            });
            tip.show();
            equals(tip.element.find('[data-id="content"]').html(), 'test content');
        });

        it('delay set content', function(done){
            tip = new Tip({
                trigger : trigger,
                content : function(){
                    setTimeout(function(){
                        tip.set('content', 'test content2');
                    }, 100);
                }
            });
            tip.show();
            setTimeout(function(){
                equals(tip.element.find('[data-id="content"]').html(), 'test content2');
                done();
            }, 150);
        });

        it('set size', function(){
            tip = new Tip({
                trigger : trigger,
                content : CONTENT,
                width: 600,
                height: '1024px'
            });
            tip.show();
            expect(tip.element.find('[data-id="content"]').width()).to.be(600);
            expect(tip.element.find('[data-id="content"]').height()).to.be(1024);
        });
    });
});