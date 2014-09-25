'use strict'

var Tip, Widget, tpl, styles;

tpl = require('./tip.tpl');
Widget = require('widget');
styles = require('./tip.styles');

Tip = Widget.extend({
    attrs : {
        delay : 70,
        styles : styles,
        trigger : null,
        template : tpl,
        triggerType : 'hover'
    },
    init : function(){
        var trigger = this.get('trigger');

        if(trigger){
            this['_bind' + capitalize(this.get('triggerType'))](trigger);
        }

        console.log(this.element.html())
    },
    _bindClick : function(trigger){
        var ctx = this;

        trigger.on('click', function(){
            ctx[(trigger._active = !trigger._active) ? show : hide]();
        });
    },
    _bindFocus : function(trigger){
        var ctx = this;

        trigger.on({
            'focus' : function(){
                ctx.show();
            },
            'blur' : function(){
                setTimeout(function(){
                    (!ctx._downOnElement) && ctx.hide();
                    ctx._downOnElement = false;
                }, ctx.get('delay'));
            }
        });

        ctx.delegateEvents({
            'mousedown' : function(){
                this._downOnElement = true;
            }
        });
    },
    _bindHover : function(trigger){
        var ctx = this;

        trigger.on({
            'mouseenter' : function(){
                ctx.show();
            },
            'mouseleave' : function(){
                ctx.hide();
            }
        })
    },
    _onChangeContent : function(val){

    }
});

function capitalize(val){
    return val.charAt(0).toUpperCase() + val.slice(1);
};

module.exports = Tip;