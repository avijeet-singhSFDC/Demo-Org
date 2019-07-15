define([
    'jquery',
    'underscore',
    'backbone'
    ], function($, _, Backbone ){

    var filterSortItem = Backbone.View.extend({
        template: _.template($('#filtersItem_tpl').html()),
        tagName : 'article',
        events: {
            "click" : "itemclick"
        },
        initialize: function() {
            this.model = this.options;
            this.selection = this.options.selection;
            this.onlyOne  = this.options.onlyOne;
            this.notifyTo  = this.options.notifyTo;
            Um.dispatcher.bind("removeStatus",this.removeStatus,this);
        },
        render: function(){
            this.$el.html(this.template(this.model));
            return this;
        },
        itemclick: function(e){
            Um.dispatcher.trigger(this.notifyTo,this.model.apiName,this.onlyOne);
            this.$el.parent().find(".checkMark").removeClass("checkMark");
            var t = $(e.currentTarget).find("div").attr("id");
            var selectAsTrue = this.model.sel;
            Um.dispatcher.trigger("removeStatus");
            this.render();
            if(!selectAsTrue){
                $('#'+t).addClass("checkMark");
                this.model.sel = true;
            }
        },
        removeStatus: function(){
            this.model.sel = false;
        }
    });
    return filterSortItem;
});
