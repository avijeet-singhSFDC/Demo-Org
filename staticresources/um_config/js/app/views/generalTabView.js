define(["jquery",
        "underscore",
        "backbone",
        "app/utils/utils",
        "text!app/templates/siteCUTemplate.html",
        "app/views/modalSiteView",
        "app/views/modalResourceView",
        "app/views/modalProfileView",
        "bootstrap"], function($, _, backbone, utils, tmpl, ModalSiteView, ModalResourceView, ModalProfileView){

    var GeneralTabView = Backbone.View.extend({

        initialize: function(args){
            this.model = args.model;
        },

        events: {
            "click #openModalSite" : "openModalSite",
            "click #openModalResource" : "openModalResource",
            "click #openModalProfile" : "openModalProfile"
        },

        render: function(){
            var template = _.template(tmpl);
            this.$el.append( template({ m : this.model }) );
            return this;
        },

        cleanAll: function(){
            this.undelegateEvents();
            this.$el.empty().off();
        },

        openModalProfile: function(){
            var self = this;
            umCustomSettingController.getOrgProfiles(function(r,e){
                if ( self.modalSiteView != undefined ){
                    self.modalProfileView.off();
                    self.modalProfileView.cleanAll();
                }
                self.modalProfileView = new ModalProfileView({ profiles : r });
                self.modalProfileView.on("elementSelected",function(elm){
                    this.$el.find('#signUpProfile__c').val(elm);
                    $('#modalProfile').modal('hide');
                },self);
                self.$el.append(self.modalProfileView.render().el);
                $('#modalProfile').modal('show');
                $('#modalProfile').on('hidden', function (e) {
                    $(e.currentTarget).empty().off().remove();
                });
            });
        },

        openModalSite: function(){
            var self = this;
            umCustomSettingController.getOrgSites(function(r,e){
                if ( self.modalSiteView != undefined ){
                    self.modalSiteView.off();
                    self.modalSiteView.cleanAll();
                }
                self.modalSiteView = new ModalSiteView({ sites : r });
                self.modalSiteView.on("elementSelected",function(elm){
                    this.$el.find('#umSite_apiName__c').val(elm);
                    $('#modalSite').modal('hide');
                },self);
                self.$el.append(self.modalSiteView.render().el);
                $('#modalSite').modal('show');
                $('#modalSite').on('hidden', function (e) {
                    $(e.currentTarget).empty().off().remove();
                });
            });
        },

        openModalResource: function(){
            var self = this;
            umCustomSettingController.getOrgStaticResources(function(r,e){
                if ( self.modalResourceView != undefined ){
                    self.modalResourceView.off();
                    self.modalResourceView.cleanAll();
                }
                self.modalResourceView = new ModalResourceView({ resources : r });
                self.modalResourceView.on("elementSelected",function(elm){
                    this.$el.find('#umSite_staticResource__c').val(elm);
                    $('#modalResource').modal('hide');
                },self);
                self.$el.append(self.modalResourceView.render().el);
                $('#modalResource').modal('show');
                $('#modalResource').on('hidden', function (e) {
                    $(e.currentTarget).empty().off().remove();
                });
            });
        }
    });
    return GeneralTabView;
});