define(["jquery",
        "underscore",
        "backbone"], function($,_,Backbone){


var Community = Backbone.Model.extend({

	initWithouZone : function(siteData){
		var topicsArray = siteData.root;
		this.set({
				id: "-1",
				textName: "Only Public Knowledge Base ",
		 		publicName: "Only Public Knowledge Base ",
		 		label: "Only Public Knowledge Base ",
				announcements__c: "false",
				zoneDescription: "Only Public Knowledge Base",
				apiName: "PKB",
				dataCategory__c: "PKB",
				backgroundColor__c: siteData.umSite_backgroundColor__c,
				backgroundImagePath__c: siteData.backgroundImagePath__c,
				searchBannerLabel__c: siteData.searchBannerLabel__c,
				topics: topicsArray
			});

	}


});

return Community;
});