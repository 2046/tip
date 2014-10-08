define(function(require, exports, module){
    'use strict'
    
    var Tip, Widget;
    
    Widget = require('widget');
    
    Tip = Widget.extend({
        attrs : {
            delay : 100,
            distance : 10,
            trigger : null,
            content : null,
            arrowSize : 6,
            direction : 'right',
            arrowBorder : 'red',
            arrowInside : 'black',
            triggerType : 'hover',
            template : require('./tip.tpl'),
            styles : require('./tip.styles')
        },
        init : function(){
            if(this.get('trigger')){
                this['_on' + capitalize(this.get('triggerType'))]();
                this.render();
            }
        },
        _onRenderContent : function(val){
            this.$('[data-id="content"]').html(val);
        },
        _onClick : function(){
            var ctx, trigger, action;
    
            ctx = this;
            trigger = this.get('trigger');
    
            trigger.on('click', function(){
                action = 'hide';
    
                if(trigger._active = !trigger._active){
                    fixedPosition(ctx);
                    action = 'show';
                }
    
                ctx[action]();
            });
        },
        _onHover : function(){
            var ctx, trigger, timer;
    
            ctx = this;
            trigger = this.get('trigger');
    
            trigger.hover(function(){
                clearTimeout(timer);
                fixedPosition(ctx);
                ctx.show();
            }, function(){
                mouseleave();
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
            };
        },
        _onFocus : function(){
            var ctx, trigger;
    
            ctx = this;
            trigger = this.get('trigger');
    
            trigger.on('focus', function(){
                fixedPosition(ctx);
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
    });
    
    function fixedPosition(ctx){
        var trigger, distance, width, height, offset, css, arrowSize, arrowBorder, arrowInside, elWidth, elHeight, docWidth, docHeight, scrollTop;
    
        trigger = ctx.get('trigger');
        distance = ctx.get('distance');
        arrowSize = ctx.get('arrowSize');
        arrowBorder = ctx.get('arrowBorder');
        arrowInside = ctx.get('arrowInside');
        width = trigger.width();
        height = trigger.height();
        offset = trigger.offset();
        elWidth = ctx.element.width();
        elHeight = ctx.element.height();
        docWidth = $(window).outerWidth();
        scrollTop = $(window).scrollTop();
        docHeight = scrollTop + $(window).outerHeight();
    
        css = {
            pos : {
                top : offset.top,
                left : offset.left
            },
            arrow : {},
            arrowBorder : {
                top : 0,
                left : 0,
                borderWidth : arrowSize
            },
            arrowInside : {
                borderWidth : arrowSize
            }
        }
    
        switch (ctx.get('direction')) {
            case 'up':
                css.pos.top = offset.top - distance - elHeight;
                css.pos.left = offset.left + (width / 2 - arrowSize - 15);
    
                if(css.pos.top < scrollTop){
                    ctx.set('direction', 'down');
                    fixedPosition(ctx);
                    return;
                }
    
                css.arrow.left = 15;
                css.arrow.bottom = 0;
                css.arrowBorder.top = 1;
                css.arrowBorder.borderBottomWidth = 0;
                css.arrowInside.borderBottomWidth = 0;
                css.arrowBorder.borderTopColor = arrowBorder;
                css.arrowInside.borderTopColor = arrowInside;
                break;
            case 'down':
                css.pos.top = offset.top + height + distance;
                css.pos.left = offset.left + (width / 2 - arrowSize - 15);
    
                if(css.pos.top + elHeight > docHeight){
                    ctx.set('direction', 'up');
                    fixedPosition(ctx);
                    return;
                }
    
                css.arrow.top = -arrowSize;
                css.arrow.left = 15;
                css.arrowBorder.top = -1;
                css.arrowBorder.borderTopWidth = 0;
                css.arrowInside.borderTopWidth = 0;
                css.arrowBorder.borderBottomColor = arrowBorder;
                css.arrowInside.borderBottomColor = arrowInside;
                break;
            case 'left':
                css.pos.left = offset.left - distance- elWidth;
                css.pos.top = offset.top + (height / 2 - arrowSize - 15);
                css.arrow.top = 15;
                css.arrow.right = 0;
                css.arrowBorder.left = 1;
                css.arrowBorder.borderRightWidth = 0;
                css.arrowInside.borderRightWidth = 0;
                css.arrowBorder.borderLeftColor = arrowBorder;
                css.arrowInside.borderLeftColor = arrowInside;
                break;
            case 'right':
                css.pos.left = offset.left + width + distance;
                css.pos.top = offset.top + (height / 2 - arrowSize - 15);
                css.arrow.top = 15;
                css.arrow.left = -arrowSize;
                css.arrowBorder.left = -1;
                css.arrowBorder.borderLeftWidth = 0;
                css.arrowInside.borderLeftWidth = 0;
                css.arrowBorder.borderRightColor = arrowBorder;
                css.arrowInside.borderRightColor = arrowInside;
                break;
        }
    
        ctx.element.css(css.pos);
        ctx.$('.widget-tip-arrow').css(css.arrow);
        ctx.$('.widget-tip-arrow em').css(css.arrowBorder);
        ctx.$('.widget-tip-arrow span').css(css.arrowInside);
    };
    
    function capitalize(val){
        return val.charAt(0).toUpperCase() + val.slice(1);
    };
    
    module.exports = Tip;
});