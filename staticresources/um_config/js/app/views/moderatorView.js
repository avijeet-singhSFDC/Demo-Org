define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/moderatorTemplate.html",
        "app/views/modalModeratorView",
        "bootstrap"], function($, _, backbone, utils, tmpl, ModalModeratorView){

    var ModeratorView = Backbone.View.extend({

        events:{
            "click #newMod" : "newMod"
        },

        initialize: function(args){
            this.setData(args);
        },

        setData: function(args){
            this.model = args.model;
        },

        render: function(){
            var self = this;
            this.undelegateEvents();
            var template = _.template(tmpl);
            this.$el.append( template({ m : this.model.get("Moderators") }) );
            this.delegateEvents();
            this.$el.find('.modRemove').click(function(e){
                self.deleteElement($(e.currentTarget).attr("data-id"));
                return false;
            });
            return this;
        },

        saveElement: function(elm){
            if ( typeof(this.model.get("Moderators")) == 'string' ) this.model.set({ 'Moderators' : [] });
            var modsArray = this.model.get("Moderators");
            var isNew = true;
            for(var i=0;i<modsArray.length;i++){
                var m = modsArray[i];
                if ( elm.userId__c == m.userId__c && m.delete == undefined ) isNew = false;
            }
            if (isNew == true){
                modsArray.push(elm);
            }
            $('#modalModerator').modal('hide');
            Backbone.Events.trigger("reloadTab","moderatorTab");
        },

        deleteElement: function(id){
            var modsArray = this.model.get("Moderators");
            for(var i=0;i<modsArray.length;i++){
                var elm = modsArray[i];
                if ( elm.Id == id ) elm.delete = true;
            }
            this.cleanAll();
            this.render();
        },

        newMod: function(){
            var self = this;
            umCustomSettingController.getOrgUsers(function(r,e){
                if ( self.modalModeratorView != undefined ){
                    self.modalModeratorView.off();
                    self.modalModeratorView.cleanAll();
                }
                self.modalModeratorView = new ModalModeratorView({ users : r });
                self.modalModeratorView.on("moderatorSelected",function(elm){
                    self.saveElement(elm);
                    $('#modalModerator').modal('hide');
                },self);
                self.$el.append(self.modalModeratorView.render().el);
                $('#modalModerator').modal('show');
                $('#modalModerator').on('hidden', function (e) {
                    $(e.currentTarget).empty().off().remove();
                    $('.modalModContainer').empty().off().remove();
                });

            });
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
        }
    });
    return ModeratorView;
});