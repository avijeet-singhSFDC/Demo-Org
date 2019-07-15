define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/modalSiteTemplate.html",
        "bootstrap"], function($, _, backbone, utils, tmpl){

    var ModalSiteView = Backbone.View.extend({

        initialize: function(args){
            this.sites = args.sites;
        },

        render: function(){
            var self = this;
            var template = _.template(tmpl);
            this.$el.append( template({ sites : this.sites }) );
            this.$el.find('#sitesTable tr').click(function(e){
                self.trigger('elementSelected',$(e.currentTarget).attr('data-name'));
            });
            return this;
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
        }
    });
    return ModalSiteView;
});