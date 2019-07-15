({
	init : function(component, event, helper) {
		var industry = component.get("v.Industry");
        industry = industry.replace(/ /g,"%20");
        var endpoint = '/api/partners?industry__c=' + industry;
        var callout = component.get("c.getCalloutResponseContents");
        callout.setParams({
            endpoint: endpoint
        });
		callout.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                component.set("v.Partners",JSON.parse(response.getReturnValue()));
            }
        });
		$A.enqueueAction(callout); 
	},
    toURL : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open(whichOne);
    }
})