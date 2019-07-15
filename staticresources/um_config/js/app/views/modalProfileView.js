define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/modalProfileTemplate.html",
        "bootstrap"], function($, _, backbone, utils, tmpl){

    var ModalProfileView = Backbone.View.extend({

        initialize: function(args){
            this.profiles = args.profiles;
        },

        render: function(){
            var self = this;
            var template = _.template(tmpl);
            this.$el.append( template({ profiles : this.profiles }) );
            this.$el.find('#profilesTable tr').click(function(e){
                self.trigger('elementSelected',$(e.currentTarget).attr('data-name'));
            });
            return this;
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
        }
    });
    return ModalProfileView;
});