({
	getDetails : function(component, event, helper) {
		var action = component.get("c.GetContactInfo");
        action.setParams({
            contactId: component.get("v.ContactId")
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	component.set("v.Contact",response.getReturnValue());
            }
        });
		$A.enqueueAction(action); 
        helper.getContactOrder(component, event, helper);
	},
    getDetailsFromCase : function(component, event, helper) {
		var action = component.get("c.GetContactInfoFromCase");
        action.setParams({
            contactId: component.get("v.ContactId"),
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	component.set("v.Contact",response.getReturnValue());
                console.log("Contact: " + JSON.stringify(response.getReturnValue()));
            }else{
                console.log("test2");
            }
        });
		$A.enqueueAction(action);  
        helper.getContactOrder(component, event, helper);
	},
    getDetailsFromChat : function(component, event, helper) {
		var action = component.get("c.GetContactInfoFromChat");
        action.setParams({
            contactId: component.get("v.ContactId"),
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	component.set("v.Contact",response.getReturnValue());
            }
        });
		$A.enqueueAction(action);  
        helper.getContactOrder(component, event, helper);
	},
    getContactOrder : function(component, event, helper) {
        var action = component.get("c.GetOrderTotals");
        action.setParams({
            contactId: component.get("v.ContactId"),
            ObjType: component.get("v.sobjecttype"),
        });
		action.setCallback(this, function(response) {
            component.set("v.OrderTotal",response.getReturnValue());
        });
		$A.enqueueAction(action); 
    },
})