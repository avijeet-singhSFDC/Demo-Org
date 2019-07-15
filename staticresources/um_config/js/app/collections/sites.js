define(["jquery", "underscore","backbone","app/models/site"], function($, _, backbone,site) {

	var sites = Backbone.Collection.extend({
        
        model : site,

        comparator: function(cammoderator) {
            return cammoderator.get('siteName__c');
        }
    });
    return sites;
});