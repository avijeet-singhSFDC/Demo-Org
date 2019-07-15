({
	init : function(component, event, helper) {
		var industry = component.get("v.Industry");
        industry = industry.replace(/ /g,"%20");
        var endpoint = '/api/brand_contacts?industry__c=' + industry;
        console.log("Endpoint: "+endpoint);
        var callout = component.get("c.getCalloutResponseContents");
        callout.setParams({
            endpoint: endpoint
        });
		callout.setCallback(this, function(response) {
            console.log("here");
            var state = response.getState();
            if(state === 'SUCCESS'){
            	component.set("v.Contacts",JSON.parse(response.getReturnValue()));
            }
        });
		$A.enqueueAction(callout);
	},
    toContact : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open('/lightning/r/Contact/' + whichOne + '/view');
    },
})