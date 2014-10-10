define(function(require, exports, module){
    'use strict'
    
    var Tip, Overlay;
    
    Overlay = require('overlay');
    
    Tip = Overlay.extend({
        attrs : {
            delay : 100,
            distance : 10,
            trigger : null,
            content : null,
            direction : 'left',
            triggerType : 'click',
            template : require('./tip.tpl'),
            style : {
                display : 'none',
                position : 'absolute'
            }
        },
        init : function(){
            this._arrow = this.$('.widget-tip-arrow');
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
            var trigger, offset, width, height, direction;
    
            if(!this.rendered){
                return;
            }
    
            trigger = this.get('trigger');
            offset = trigger.offset();
            width = this.element.width();
            height = this.element.height();
            direction = this.get('direction');
    
            if(isOverflow(this, trigger, direction, width, height)){
                return;
            }
    
            fixedPosition(this, offset.left, offset.top, trigger.width() + offset.left, trigger.height() + offset.top, width, height);
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
        var arrow, width, height, distance, arrowSize, left, top, offsets, direction, $win;
    
        arrow = {};
        offsets = [];
        offsets[0] = 15;
        width = x2 - x1;
        height = y2 - y1;
        $win = $(window);
        distance = ctx.get('distance');
        direction = ctx.get('direction');
        arrowSize = getArrowSize(ctx._arrow.find('em'));
    
        if(direction == 'up' || direction == 'down'){
            offsets[1] = width / 2 - arrowSize - offsets[0];
            left = x1 + offsets[1];
        }else if(direction == 'left' || direction == 'right'){
            offsets[1] = height / 2 - arrowSize - offsets[0];
            top = y1 + offsets[1];
        }
    
        if(direction == 'up'){
            top = y1 - distance - elHeight;
            arrow.left = offsets[0];
            arrow.bottom = 0;
            arrow.top = 'auto';
        }else if(direction == 'down'){
            top = y2 + distance;
            arrow.left = offsets[0];
            arrow.top = -arrowSize;
        }else if(direction == 'left'){
            left = x1 - distance - elWidth;
            arrow.top = offsets[0];
            arrow.right = 0;
            arrow.left = 'auto';
        }else if(direction == 'right'){
            left = x2 + distance;
            arrow.top = offsets[0];
            arrow.left = -arrowSize;
        }
    
        if(direction == 'up' || direction == 'down'){
            if(left + elWidth > $win.width()){
                left = x1 - (elWidth - width) - offsets[1];
                arrow.left = offsets[0] + (elWidth - width) + offsets[1] + offsets[1];
            }
        }else if(direction == 'left' || direction == 'right'){
            if(top + elHeight > $win.height() + $win.scrollTop()){
                top = y1 - (elHeight - height) - offsets[1];
                arrow.top = offsets[0] + (elHeight - height) + offsets[1] + offsets[1];
            }
        }
    
        ctx.element.css({
            top : top,
            left : left
        });
    
        ctx._arrow.removeClass('up down left right').addClass(direction).css(arrow);
    };
    
    function isOverflow(ctx, trigger, direction, width, height){
        var gap = getDistanceVisualWindow(trigger);
    
        if(direction == 'up' && height > gap.top && height < gap.bottom){
            ctx.set('direction', 'down');
            return true;
        }else if(direction == 'down' && height > gap.bottom && height < gap.top){
            ctx.set('direction', 'up');
            return true;
        }else if(direction == 'left' && width > gap.left && width < gap.right){
            ctx.set('direction', 'right');
            return true;
        }else if(direction == 'right' && width > gap.right && width < gap.left){
            ctx.set('direction', 'left');
            return true;
        }
    
        return false;
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
    
    function getArrowSize(arrow){
        var index, len, widths, tmp;
    
        widths = arrow.css('borderWidth').split(' ');
    
        for(index = 0, len = widths.length; index < len; index++){
            if((tmp = parseInt(widths[index], 10)) != 0){
                return tmp;
            }
        }
    };
    
    function capitalize(val){
        return val.charAt(0).toUpperCase() + val.slice(1);
    };
    
    module.exports = Tip;
});