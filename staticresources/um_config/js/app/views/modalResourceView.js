define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/modalResourceTemplate.html",
        "bootstrap"], function($, _, backbone, utils, tmpl){

    var ModalResourceView = Backbone.View.extend({

        initialize: function(args){
            this.resources = args.resources;
        },

        render: function(){
            var self = this;
            var template = _.template(tmpl);
            this.$el.append( template({ resources : this.resources }) );
            this.$el.find('#resourcesTable tr').click(function(e){
                self.trigger('elementSelected',$(e.currentTarget).attr('data-name'));
            });
            return this;
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
        }
    });
    return ModalResourceView;
});