({
    init : function(component, event, helper) {
        var action = component.get("c.getCalloutResponseContents");
        action.setParams({
            endpoint: '/api/content'
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                component.set("v.DemoContent",JSON.parse(response.getReturnValue()));
            }
        });
		$A.enqueueAction(action); 
	}, 
    onIndustryChange: function(component, event, helper) {
        var filter = component.get("v.IndustryChosen");
        if(filter == '-- None --'){
            helper.resetFilters(component, event, helper);
        }else{
            filter = filter.replace(/ /g,"%20");
            var endpoint = '/api/content?industry__c=' + filter;
            var callout = component.get("c.getCalloutResponseContents");
            callout.setParams({
                endpoint: endpoint
            });
            callout.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.DemoContent",JSON.parse(response.getReturnValue()));
                }
            });
            $A.enqueueAction(callout); 
        }
    },
    onSolutionChange: function(component, event, helper) {
        var filter = component.get("v.SolutionChosen");	
        if(filter == '-- None --'){
            helper.resetFilters(component, event, helper);
        }else{
            filter = filter.replace(/ /g,"%20");
            var endpoint = '/api/content?solution__c=' + filter;
            var callout = component.get("c.getCalloutResponseContents");
            callout.setParams({
                endpoint: endpoint
            });
            callout.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.DemoContent",JSON.parse(response.getReturnValue()));
                }
            });
            $A.enqueueAction(callout); 
        }
    },
    onPersonaChange: function(component, event, helper) {
        var filter = component.get("v.PersonaChosen");
        if(filter == '-- None --'){
            helper.resetFilters(component, event, helper);
        }else{
            filter = filter.replace(/ /g,"%20");
            var endpoint = '/api/content?persona__c=' + filter;
            var callout = component.get("c.getCalloutResponseContents");
            callout.setParams({
                endpoint: endpoint
            });
            callout.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.DemoContent",JSON.parse(response.getReturnValue()));
                }
            });
            $A.enqueueAction(callout); 
        }
    },
    onCloudChange: function(component, event, helper) {
        var filter = component.get("v.CloudChosen");
        if(filter == '-- None --'){
            helper.resetFilters(component, event, helper);
        }else{
            filter = filter.replace(/ /g,"%20");
            var endpoint = '/api/content?cloud_product__c=' + filter;
            var callout = component.get("c.getCalloutResponseContents");
            callout.setParams({
                endpoint: endpoint
            });
            callout.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.DemoContent",JSON.parse(response.getReturnValue()));
                }
            });
            $A.enqueueAction(callout); 
        }
    },
    onFeatureChange: function(component, event, helper) {
        var filter = component.get("v.FeatureChosen");
        if(filter == '-- None --'){
            helper.resetFilters(component, event, helper);
        }else{
            filter = filter.replace(/ /g,"%20");
            var endpoint = '/api/content?features__c=' + filter;
            var callout = component.get("c.getCalloutResponseContents");
            callout.setParams({
                endpoint: endpoint
            });
            callout.setCallback(this, function(response) {
                var state = response.getState();
                if(state === 'SUCCESS'){
                    component.set("v.DemoContent",JSON.parse(response.getReturnValue()));
                }
            });
            $A.enqueueAction(callout); 
        }
    },
    onPicklistChange: function(component, event, helper) {
        var action = component.get("c.GetFilteredDemoContent");
        action.setParams({
            cp: event.getSource().get("v.value"),
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                component.set("v.DemoContent",response.getReturnValue());
            }
        });
		$A.enqueueAction(action);
    },
    gotoContent: function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open('/lightning/r/Demo_Content__c/' + whichOne + '/view' ,'_blank');
    },
    OpenDialog: function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        component.set("v.setScriptId",whichOne);
        
        var cmpTarget = component.find('scriptModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-closed');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_open');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_closed');
    },
    CloseDialog : function(component, event, helper) {
        var cmpTarget = component.find('scriptModal');
        $A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        $A.util.addClass(cmpTarget, 'slds-fade-in-closed');
            
        var cmpTarget2 = component.find('overlay');
        $A.util.removeClass(cmpTarget2, 'slds-backdrop_open');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_closed');
    },
    toScript : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open(whichOne);
    },
    toContent : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        window.open('/lightning/r/Demo_Content__c/' + whichOne + '/view');
    },
})