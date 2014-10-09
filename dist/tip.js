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
            direction : 'left',
            triggerType : 'click',
            arrowBorderBg : 'red',
            arrowInsideBg : 'black',
            template : require('./tip.tpl'),
            styles : require('./tip.styles')
        },
        init : function(){
            if(this.get('trigger')){
                this._originDirection = this.get('direction');
                this['_on' + capitalize(this.get('triggerType'))]();
                this.render();
            }
        },
        show : function(){
            this.set('direction', this._originDirection, {silent : true}).trigger('change:direction');
            Tip.superclass.show.call(this);
        },
        _onRenderContent : function(val){
            this.$('[data-id="content"]').html(val);
        },
        _onRenderDirection : function(val){
            var trigger, offset, css, elWidth, elHeight;
    
            if(!this.rendered){
                return;
            }
    
            trigger = this.get('trigger');
            offset = trigger.offset();
            elWidth = this.element.width();
            elHeight = this.element.height();
    
            css = fixedPosition(this, offset.left, offset.top, trigger.width() + offset.left, trigger.height() + offset.top, elWidth, elHeight, getDistanceVisualWindow(trigger));
    
            if(!css){
                return;
            }
    
            this.element.css(css.pos);
            this.$('.widget-tip-arrow').css(css.arrow);
            this.$('.widget-tip-arrow em').css(css.arrowBorder);
            this.$('.widget-tip-arrow span').css(css.arrowInside);
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
    
    function fixedPosition(ctx, x1, y1, x2, y2, elWidth, elHeight, gap){
        var css, vars, width, height, distance, arrowSize, arrowBorderBg, arrowInsideBg, left, top, offsets, direction, $win;
    
        offsets = [];
        offsets[0] = 15;
        width = x2 - x1;
        height = y2 - y1;
        $win = $(window);
        distance = ctx.get('distance');
        direction = ctx.get('direction');
        arrowSize = ctx.get('arrowSize');
        arrowBorderBg = ctx.get('arrowBorderBg');
        arrowInsideBg = ctx.get('arrowInsideBg');
    
        css = {
            pos : {},
            arrow : {},
            arrowBorder : {
                top : 0,
                left : 0,
                borderWidth : arrowSize
            },
            arrowInside : {
                borderWidth : arrowSize
            }
        };
    
        if(direction == 'up' || direction == 'down'){
            offsets[1] = width / 2 - arrowSize - offsets[0];
            left = x1 + offsets[1];
        }else if(direction == 'left' || direction == 'right'){
            offsets[1] = height / 2 - arrowSize - offsets[0];
            top = y1 + offsets[1];
        }
    
        switch (direction) {
            case 'up':
                if(elHeight > gap.top && elHeight < gap.bottom){
                    ctx.set('direction', 'down');
                    return false;
                }
    
                top = y1 - distance - elHeight;
                css.arrow.left = offsets[0];
                css.arrow.bottom = 0;
                css.arrow.top = 'auto';
                css.arrowBorder.top = 1;
                vars = ['Bottom', 'Top'];
                break;
            case 'down':
                if(elHeight > gap.bottom && elHeight < gap.top){
                    ctx.set('direction', 'up');
                    return false;
                }
    
                top = y2 + distance;
                css.arrow.left = offsets[0];
                css.arrow.top = -arrowSize;
                css.arrowBorder.top = -1;
                vars = ['Top', 'Bottom'];
                break;
            case 'left':
                if(elWidth > gap.left && elWidth < gap.right){
                    ctx.set('direction', 'right');
                    return false;
                }
    
                left = x1 - distance - elWidth;
                css.arrow.top = offsets[0];
                css.arrow.right = 0;
                css.arrow.left = 'auto';
                css.arrowBorder.left = 1;
                vars = ['Right', 'Left'];
                break;
            case 'right':
                if(elWidth > gap.right && elWidth < gap.left){
                    ctx.set('direction', 'left');
                    return false;
                }
    
                left = x2 + distance;
                css.arrow.top = offsets[0];
                css.arrow.left = -arrowSize;
                css.arrowBorder.left = -1;
                vars = ['Left', 'Right'];
                break;
        };
    
        if(direction == 'up' || direction == 'down'){
            if(left + elWidth > $win.width()){
                left = x1 - (elWidth - width) - offsets[1];
                css.arrow.left = offsets[0] + (elWidth - width) + offsets[1] + offsets[1];
            }
        }else if(direction == 'left' || direction == 'right'){
            if(top + elHeight > $win.height() + $win.scrollTop()){
                top = y1 - (elHeight - height) - offsets[1];
                css.arrow.top = offsets[0] + (elHeight - height) + offsets[1] + offsets[1];
            }
        }
    
        css.pos.top = top;
        css.pos.left = left;
        css.arrowBorder['border' + vars[0] + 'Width'] = 0;
        css.arrowInside['border' + vars[0] + 'Width'] = 0;
        css.arrowBorder['border' + vars[1] + 'Color'] = arrowBorderBg;
        css.arrowInside['border' + vars[1] + 'Color'] = arrowInsideBg;
    
        return css;
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
});