define(["jquery",
        "underscore",
        "backbone",
        "app/models/site",
        "app/views/siteView",
        "app/collections/sites",
        "text!app/templates/sitesTemplate.html",
        "app/utils/utils",
        "app/views/siteTableView"], function($, _, backbone, Site, SiteView, Sites, sitesTemplate, Utils, SiteTableView){

    var SitesView = Backbone.View.extend({

        collection: Sites,

        el: '#appContext',

        events: {
            "click #newSite" : "newSite"
        },

        initialize: function(sites){
            this.collectionViews = [];
            this.collection = new Sites([]);
        },

        render: function(col){
            this.destroyViewsAndCollections();
            this.buildCollection(col);
            this.undelegateEvents();
            var template = _.template( sitesTemplate );
            this.$el.html( template({ sites : this.collection.models }) );
            this.delegateEvents();
            if ( this.collection.models.length > 0 ) this.buildCollectionViews().renderElements();
            return this;
        },

        buildCollection: function(col){
            this.collection = new Sites(col);
        },

        buildCollectionViews: function(){
            _.each(this.collection.models,function(m){
                var elm = new SiteTableView({ model : m });
                this.collectionViews.push(elm);
            },this);
            return this;
        },

        renderElements: function(){
            var container = this.$el.find('#sitesList');
            container.empty().off();
            _.each(this.collectionViews,function(colView){
                container.append( colView.render().el );
            },this);
        },

        destroyViewsAndCollections: function(){
            _.each(this.collectionViews,function(v){
                v.cleanAll();
            },this);
            this.collectionViews = [];
            this.collection.reset();
        },

        newSite: function(){
            var a = new Site();
            Backbone.Events.trigger("newSite",a);
        }

    });
    return SitesView;
});