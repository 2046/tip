'use strict'

var Tip, Overlay;

Overlay = require('overlay');

Tip = Overlay.extend({
    attrs : {
        delay : 100,
        distance : 10,
        trigger : null,
        content : null,
        direction : 'right',
        triggerType : 'click',
        template : require('./tip.tpl'),
        style : {
            position : 'absolute'
        }
    },
    init : function(){
        this._originDirection = this.get('direction');
        this['_on' + capitalize(this.get('triggerType'))]();
        this.render();
    },
    show : function(){
        this.set('direction', this._originDirection, {
            silent : true
        }).trigger('change:direction');
        Tip.superclass.show.call(this);
    },
    _onRenderContent : function(val){
        this.$('[data-id="content"]').html(val);
    },
    _onRenderDirection : function(val){
        var trigger, gap, width, height, offset, css;

        if(!this.rendered){
            return;
        }

        trigger = this.get('trigger');
        offset = trigger.offset();
        width = this.element.width();
        height = this.element.height();
        gap = getDistanceVisualWindow(trigger);

        css = fixedPosition(this, offset.left, offset.top, trigger.width() + offset.left, trigger.height() + offset.top, width, height);

        this.element.css(css);
    },
    _onClick : function(){
        var ctx, trigger;

        ctx = this;
        trigger = this.get('trigger');

        trigger.on('click', function(){
            ctx[(ctx._active = !ctx._active) ? 'show' : 'hide']();
        });
    },
    _onHover : function(){
        var ctx, trigger, timer;

        ctx = this;
        trigger = this.get('trigger');

        trigger.hover(function(){
            clearTimeout(timer);
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

function fixedPosition(ctx, x1, y1, x2, y2, elWidth, elHeight){
    var distance, direction, width, height, offsets, top, left, arrow;

    offsets = [];
    offsets[0] = 15;
    width = x2 - x1;
    height = y2 - y1;
    distance = ctx.get('distance');
    direction = ctx.get('direction');
    arrow = ctx.$('.widget-tip-arrow');

    if(direction == 'up' || direction == 'down'){
        offsets[1] = width / 2 - 6 - offsets[0];
        left = x1 + offsets[1];
    }else if(direction == 'left' || direction == 'right'){
        offsets[1] = height / 2 - 6 - offsets[0];
        top = y1 + offsets[1];
    }

    arrow.removeClass('up down left right').addClass(direction);

    switch(direction){
        case 'up':
            top = y1 - distance - elHeight;
            break;
        case 'down':
            top = y2 + distance;
            break;
        case 'left':
            left = x1 - distance - elWidth;
            break;
        case 'right':
            left = x2 + distance;
            break;
    }

    return {
        top : top,
        left : left
    }
};

function capitalize(val){
    return val.charAt(0).toUpperCase() + val.slice(1);
};

function getDistanceVisualWindow(trigger){
    var win, offset, top;

    win = $(window);
    offset = trigger.offset();
    top = offset.top - win.scrollTop();

    return {
        top : top,
        left : offset.left,
        bottom : win.height() - top - trigger.height(),
        right : win.width() - offset.left - trigger.width()
    };
};

module.exports = Tip;