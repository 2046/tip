define(function(require, exports, module){
    'use strict'
    
    var Tip, Widget, Events;
    
    Widget = require('widget');
    
    Tip = Widget.extend({
        attrs : {
            delay : 70,
            distance : 8,
            trigger : null,
            content : null,
            direction : 'up',
            triggerType : 'hover',
            styles : require('./tip.styles'),
            template : require('./tip.tpl')
        },
        init : function(){
            var trigger, triggerType;
    
            if((trigger = this.get('trigger')) && (triggerType = this.get('triggerType'))){
                Events[triggerType](this, trigger);
            }
    
            this.render();
        },
        _onRenderContent : function(val){
            this.element.find('[data-id="content"]').html(val);
        }
    });
    
    Events = {
        'click' : function(ctx, trigger){
            trigger.on('click', function(){
                ctx[(trigger._active = !trigger._active) ? show : hide]();
            });
        },
        'hover' : function(ctx, trigger){
            var timer;
    
            trigger.on({
                'mouseenter' : function(){
                    clearTimeout(timer);
                    ctx.show();
                },
                'mouseleave' : function(){
                    mouseleave();
                }
            });
    
            ctx.delegateEvents({
                'mouseenter' : function(){
                    clearTimeout(timer);
                },
                'mouseleave' : function(){
                    mouseleave();
                }
            });
    
            function mouseleave(){
                timer = setTimeout(function(){
                    ctx.hide();
                }, ctx.get('delay'));
            }
        },
        'focus' : function(ctx, trigger){
            trigger.on('focus', function(){
                ctx.show();
            });
    
            trigger.on('blur', function(){
                setTimeout(function(){
                    (!ctx._downOnElement) && ctx.hide();
                    ctx._downOnElement = false;
                }, ctx.get('delay'));
            });
    
            ctx.delegateEvents({
                'mousedown' : function(){
                    ctx._downOnElement = true;
                }
            });
        }
    };
    
    module.exports = Tip;
});