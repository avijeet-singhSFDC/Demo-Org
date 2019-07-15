define(["jquery",
        "underscore",
        "backbone",
        "app/models/site",
        "text!app/templates/sitesTableView.html",
        "app/utils/utils"], function($, _, backbone, Site, tmpl, utils){

    var SiteTableView = Backbone.View.extend({

        tagName: 'tr',

        initialize: function(args){
            this.model = args.model;
        },

        events: {
            "click #siteTableViewEdit" : "editSite",
            "click #siteTableViewRemove" : "deleteSite"
        },

        render: function(){
            this.cleanAll();
            var template = _.template( tmpl );
            this.$el.html( template({
                id : this.model.get("id"),
                apiName : this.model.get("umSite_apiName__c"),
                canswerEnabled : this.model.get('umChatterAnswers_enabled__c'),
                contactEnabled : this.model.get('umContactus_enabled__c'),
                knowledgeEnabled : this.model.get('umKnowledgeBase_enabled__c'),
                casesEnabled : this.model.get('umSite_casesEnabled__c'),
                authEnabled : this.model.get('umSite_authenticated__c')
            }) );
            this.delegateEvents();
            this.$el.find('.ttip').tooltip();
            return this;
        },

        cleanAll: function(){
            this.$el.empty().off();
            this.undelegateEvents();
        },

        editSite: function(){
            Backbone.Events.trigger("editSite",this.model);
        },

        deleteSite: function(e){
            //options.msg
            //options.instance
            //options.methodIfYes
            //options.methodIfNo
            //options.elementToRenderOver [with # if its id or . if its a class]
            //options.dataCallback [optional]
            utils.confirmDialog({
                msg : "Are you sure?",
                instance : this,
                methodIfYes : "confirmedDelete",
                methodIfNo  : "cancelDelete",
                elementToRenderOver : e.currentTarget
            });
        },

        confirmedDelete: function(){
            window.umCustomSettingController.deleteSite(JSON.stringify(this.model.attributes),function(results,event){Backbone.Events.trigger("backToList");});
        }
    });
    return SiteTableView;
});