define(["jquery",
        "underscore",
        "backbone",
        "app/views/sitesView",
        "app/views/siteView",
        "bootstrap"],
        function($, _, backbone, SitesView, SiteView){
    var appView = Backbone.View.extend({
        initialize: function(options){
            $('#app_splash').fadeOut().remove();
            //initial data from server
            this.dataFromServer = options;
            if ( this.dataFromServer.Status != "Success" ){
                console.log("===Error from Server=== closing app now ===");
                return;
            }
            Backbone.Events.bind('backToList',this.reloadData,this);
            Backbone.Events.bind('editSite',this.initSiteDetail,this);
            Backbone.Events.bind('newSite',this.initSiteDetail,this);
            this.initSites();
        },

        initSites: function(){
            this.sitesView = this.sitesView == undefined ? new SitesView(this.dataFromServer.Sites) : this.sitesView;
            this.sitesView.render(this.dataFromServer.Sites);
        },

        initSiteDetail: function(model){
            if ( this.siteView != undefined ) this.siteView.cleanAll();
            this.siteView = new SiteView({ m : model });
        },

        reloadData: function(){
            var self = this;
            umCustomSettingController.getAllSitesSetup(function(data,result){self.dataFromServer = data; self.initSites();});
        }
    });
    return appView;
});