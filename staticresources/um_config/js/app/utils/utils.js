define(["jquery", "underscore", "text!app/templates/dialogTemplate.html"], function($, _, tmplDialog) {

    var utils = {};

    utils.confirmDialog = function(options){
        //Options are this ones
        //options.msg
        //options.instance
        //options.methodIfYes
        //options.methodIfNo
        //options.elementToRenderOver [e.currentTarget]
        //options.dataCallback [optional]
        if ( options.msg === undefined || options.msg === undefined || options.instance === undefined
            || options.methodIfYes === undefined || options.methodIfNo === undefined || options.elementToRenderOver === undefined )
                return false;

        var t = _.template(tmplDialog);
        $($(options.elementToRenderOver)).popover({
            html : true,
            placement : 'top',
            trigger : 'manual',
            title : options.msg,
            container: 'body',
            content : t()
        });

        $($(options.elementToRenderOver)).popover('show');

        $("#dialogYes").click(function(e){
            e.stopImmediatePropagation();
            $($(options.elementToRenderOver)).popover('destroy');
            if ( typeof (options.instance[options.methodIfYes]) === "function" ){
                if ( options.dataCallback === undefined ) options.instance[options.methodIfYes]();
                else options.instance[options.methodIfYes](options.dataCallback);
            }
            return false;
        });

        $("#dialogNo").click(function(e){
            e.stopImmediatePropagation();
            if ( typeof (options.instance[options.methodIfNo]) === "function" ){
                options.instance[options.methodIfNo]();
            }
            $($(options.elementToRenderOver)).popover('destroy');
            return false;
        });
    };
    return utils;
});