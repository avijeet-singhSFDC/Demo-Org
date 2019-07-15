define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/modalModeratorTemplate.html",
        "bootstrap"], function($, _, backbone, utils, tmpl){

    var ModalModeratorView = Backbone.View.extend({

        className: "modalModContainer",

        initialize: function(args){
            this.users = args.users;
        },

        render: function(){
            var self = this;
            var template = _.template(tmpl);
            this.$el.append( template({ moderators : this.users }) );
            this.$el.find('#moderatorsTable tr').click(function(e){
                self.selectedElement($(e.currentTarget).attr('data-id'));
            });
            return this;
        },

        selectedElement: function(id){
            for (var i=0;i<this.users.length;i++){
                var currentElement = this.users[i];
                if( id == currentElement.Id ){
                    this.trigger("moderatorSelected",{ Id : (new Date()).getTime(),
                                                       userId__c : currentElement.Id,
                                                       userInfo__c : currentElement.Name});
                    break;
                }
            }
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
        }
    });
    return ModalModeratorView;
});