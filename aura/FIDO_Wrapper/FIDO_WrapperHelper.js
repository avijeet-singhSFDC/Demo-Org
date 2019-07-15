({
	calculateWelcome : function(component, event, helper) {
		var BrandCompleted = component.get("v.BrandCompleted");
        var PersonaCompleted = component.get("v.PersonaCompleted");
        var SolutionsCompleted = component.get("v.SolutionsCompleted");
        var ResourcesCompleted = component.get("v.ResourcesCompleted");
        var PartnersCompleted = component.get("v.PartnersCompleted");
        var SetupCompleted = component.get("v.SetupCompleted");
        var FeaturesCompleted = component.get("v.FeaturesCompleted");
        
        var firsttotal = (BrandCompleted + PersonaCompleted + SolutionsCompleted + ResourcesCompleted + PartnersCompleted + SetupCompleted + FeaturesCompleted);
        var percenttotal = (((BrandCompleted + PersonaCompleted + SolutionsCompleted + ResourcesCompleted + PartnersCompleted  + SetupCompleted + FeaturesCompleted)/7) * 100);
        component.set("v.CompetedTotal",firsttotal);
        component.set("v.CompetedTotalPercent",percenttotal);
	},
    getSettings: function(component, event, helper) {
        var industry = component.get("v.Industry");
        industry = industry.replace(/ /g,"%20");
        var endpoint = '/api/settings?industry__c=' + industry;
        var callout = component.get("c.getCalloutResponseContents");
        callout.setParams({
            endpoint: endpoint
        });
		callout.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                component.set("v.Settings",JSON.parse(response.getReturnValue()));
            }
        });
		$A.enqueueAction(callout); 
    }
})