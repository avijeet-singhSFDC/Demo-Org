({
	init : function(component, event, helper) {    
        var industry = component.get("v.Industry");
        industry = industry.replace(/ /g,"%20");
        var endpoint = '/api/persona?industry__c=' + industry;
        var callout = component.get("c.getCalloutResponseContents");
        callout.setParams({
            endpoint: endpoint
        });
		callout.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                component.set("v.Personas",JSON.parse(response.getReturnValue()));
            }
        });
		$A.enqueueAction(callout); 
	},
    toSolutions : function(component, event, helper) {
        component.set("v.ScreenChoice",'Solutions');
        component.set("v.ComponentTitle", "Getting to know your solutions");
    },
    toPreviousPage : function(component, event, helper) {
        component.set("v.MenuOpenClose",'close');
        component.set("v.ScreenChoice",'Brand');
        component.set("v.ComponentTitle", "Getting to know your brand"); 
    },
})