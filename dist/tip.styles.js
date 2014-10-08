define(function(require, exports, module){
    module.exports = {
        'element' : {
            'display' : 'none',
            'position' : 'absolute',
            'z-index' : 99
        },
        '.widget-tip-arrow' : {
            'position' : 'absolute'
        },
        '.widget-tip-arrow em' : {
            'position' : 'absolute',
            'width' : 0,
            'height' : 0,
            'overflow' : 'hidden',
            'border-style' : 'solid'
        },
        '.widget-tip-arrow span' : {
            'position' : 'absolute',
            'top' : 0,
            'left' : 0,
            'width' : 0,
            'height' : 0,
            'overflow' : 'hidden',
            'border-style' : 'solid'
        }
    };
});