({
	init : function(component, event, helper) {
        if(component.get("v.recType") == 'User'){
            var action = component.get("c.GetPersonaId");
            action.setParams({
                Name: component.get("v.PersonaName")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.personaId",response.getReturnValue());
                }
            });
            $A.enqueueAction(action);
        }else if(component.get("v.recType") == 'Contact'){
            var action = component.get("c.GetContactId");
            action.setParams({
                Name: component.get("v.PersonaName")
            });
            action.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.personaId",response.getReturnValue());
                }
            });
            $A.enqueueAction(action);
        }
        
		var action2 = component.get("c.GetOrgId");
		action2.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	component.set("v.OrgId",response.getReturnValue());
            }
        });
		$A.enqueueAction(action2);	
	},
    toUser : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open('/lightning/r/user/' + whichOne + '/view');
    },
    toContact : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open('/lightning/r/Contact/' + whichOne + '/view');
    },
    LoginAsUser : function(component, event, helper) {
        var userId = event.currentTarget.id;
        var orgId = component.get("v.OrgId");
        var url = "/servlet/servlet.su?oid=" + orgId + "&retURL=/"; 
        url += "&suorgadminid=" + userId + '&targetURL=%2F';
        
        let mixpanelEvent = component.getEvent('MixpanelEvent');
        mixpanelEvent.setParams({
            eventName: 'SDO Event',
            payload: {
                action: 'Personas - Multi'
            }
        });
        
        mixpanelEvent.fire();
        /*https://win19-rcg2.my.salesforce.com/servlet/servlet.su?oid=00D2E000000mm9TEAA&retURL=/&suorgadminid=0052E00000IFkIeAAI
        /*https://win19-rcg2.my.salesforce.com/servlet/servlet.su?oid=00D2E000000mm9TEAA&retURL=/&suorgadminid=0052E00000IFkIeAAI&targetURL=%2F*/
        window.location.replace(url);
    },
})