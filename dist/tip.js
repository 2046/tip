define(function(require, exports, module){
    'use strict'
    
    var Tip, Overlay, $win;
    
    $win = $(window);
    Overlay = require('overlay');
    
    Tip = Overlay.extend({
        attrs : {
            distance : 10,
            content : null,
            arrowOffset : 15,
            direction : 'right',
            triggerType : 'hover',
            template : require('./tip.tpl'),
            style : {
                position : 'absolute'
            }
        },
        setup : function(){
            Tip.superclass.setup.call(this);
            this._originDirection = this.get('direction');
            this._arrow = this.$('.widget-tip-arrow').css('position', 'absolute');
            this.render();
        },
        render : function(){
            Tip.superclass.render.call(this);
            this.set('arrowSize', getArrowSize(this._arrow.find('em')));
            return this;
        },
        show : function(){
            this.set('direction', this._originDirection, {
                silent : true
            }).trigger('change:direction');
            Tip.superclass.show.call(this);
        },
        _onRenderContent : function(val){
            if(typeof val !== 'string'){
                val = val.call(this);
            }
    
            this.$('[data-id="content"]').html(val);
        },
        _onRenderWidth : function(val){
            this.$('[data-id="content"]').css('width', val);
        },
        _onRenderHeight : function(val){
            this.$('[data-id="content"]').css('height', val);
        },
        _onRenderDirection : function(val){
            var trigger, width, height, direction;
    
            if(!this.rendered){
                return;
            }
    
            width = this.element.width();
            height = this.element.height();
            trigger = this.get('trigger');
            direction = this.get('direction');
    
            if(isOverflow(this, trigger, direction, width, height)){
                return;
            }
    
            pin(this, trigger, direction, width, height);
        }
    });
    
    function pin(ctx, trigger, direction, elWidth, elHeight){
        var coords, pinCoords, arrowCoords;
    
        coords = {
            x1 : trigger.offset().left,
            y1 : trigger.offset().top
        };
    
        coords.x2 = coords.x1 + trigger.width();
        coords.y2 = coords.y1 + trigger.height();
    
        arrowCoords = getArrowCoords(ctx, direction);
        pinCoords = getPinCoords(ctx, direction, coords, elWidth, elHeight, arrowCoords);
    
        ctx.element.css(pinCoords);
        ctx._arrow.removeClass('up down left right').addClass(direction).css(arrowCoords);
    };
    
    function getPinCoords(ctx, direction, coords, elWidth, elHeight, arrowCoords){
        var distance, width, height, arrowOffset, offset, top, left;
    
        width = coords.x2 - coords.x1;
        height = coords.y2 - coords.y1;
        distance= ctx.get('distance');
        arrowOffset = ctx.get('arrowOffset');
    
        if(direction == 'up' || direction == 'down'){
            offset = width;
        }else if(direction == 'left' || direction == 'right'){
            offset = height;
        }
    
        offset = offset / 2 - ctx.get('arrowSize') - arrowOffset;
    
        if(direction == 'up'){
            top = coords.y1 - distance - elHeight;
            left = coords.x1 + offset;
        }else if(direction == 'down'){
            top = coords.y2 + distance;
            left = coords.x1 + offset;
        }else if(direction == 'left'){
            top = coords.y1 + offset;
            left = coords.x1 - distance - elWidth;
        }else if(direction == 'right'){
            top = coords.y1 + offset;
            left = coords.x2 + distance;
        }
    
        if(direction == 'up' || direction == 'down'){
            if(left + elWidth > $win.width()){
                left = coords.x1 - (elWidth - width) - offset;
                arrowCoords.left = arrowOffset + (elWidth - width) + offset + offset;
            }
        }else if(direction == 'left' || direction == 'right'){
             if(top + elHeight > $win.height() + $win.scrollTop()){
                top = coords.y1 - (elHeight - height) - offset;
                arrowCoords.top = arrowOffset + (elHeight - height) + offset + offset;
             }
        }
    
        return {
            top : top,
            left : left
        }
    };
    
    function getArrowCoords(ctx, direction){
        var arrow, arrowOffset, arrowSize;
    
        arrow = {
            top : null,
            left : null,
            right : null,
            bottom : null
        };
        arrowSize = ctx.get('arrowSize');
        arrowOffset = ctx.get('arrowOffset');
    
        if(direction == 'up'){
            arrow.left = arrowOffset;
            arrow.bottom = 0;
        }else if(direction == 'down'){
            arrow.left = arrowOffset;
            arrow.top = -arrowSize;
        }else if(direction == 'left'){
            arrow.top = arrowOffset;
            arrow.right = 0;
        }else if(direction == 'right'){
            arrow.top = arrowOffset;
            arrow.left = -arrowSize;
        }
    
        return arrow;
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
        var offset, top;
    
        offset = trigger.offset();
        top = offset.top - $win.scrollTop();
    
        return {
            top : top,
            left : offset.left,
            bottom : $win.height() - top - trigger.height(),
            right : $win.width() - offset.left - trigger.width()
        };
    };
    
    function getArrowSize(arrow){
        var index, len, borderWidth, tmp;
    
        borderWidth = [];
        $(['Top', 'Right', 'Bottom', 'Left']).each(function(i, item){
            borderWidth.push(arrow.css('border' + item + 'Width'));
        });
    
        for(index = 0, len = borderWidth.length; index < len; index++){
            if((tmp = parseInt(borderWidth[index], 10)) !== 0){
                return tmp;
            }
        }
    };
    
    module.exports = Tip;
});