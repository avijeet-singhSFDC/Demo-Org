({
	init : function(component, event, helper) {
		var action = component.get("c.GetPricebookEntryByIndustry");
        action.setParams({
            PId: component.get("v.PricebookId")
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	component.set("v.Product",response.getReturnValue());
            }
        });
		$A.enqueueAction(action);
	},
    GoToProduct : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open('/lightning/r/Product2/' + whichOne + '/view');
    }
})