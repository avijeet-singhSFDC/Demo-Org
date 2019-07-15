({
	init : function(component, event, helper) {
        var con = component.get("v.contactname");
        var acc = component.get("v.accountname");
        console.log("Contact: " + con + ' | Account: ' + acc );
        if(con != ''){
            var action = component.get("c.GetContactId");
            action.setParams({
                Name: con
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.recId",response.getReturnValue());
                }
            });
            $A.enqueueAction(action);
        }
        if(acc != ''){
            var action = component.get("c.lookupAccount");
            action.setParams({
                Name: acc
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.recId",response.getReturnValue());
                }
            });
            $A.enqueueAction(action);
        }
        
		
	},
    toAccount : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open('/lightning/r/Account/' + whichOne + '/view');
    },
})