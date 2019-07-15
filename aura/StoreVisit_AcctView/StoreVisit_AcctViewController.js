({
    init : function(component, evt, helper) {
        var cmpTarget = component.find('slds-modal__container');
        $A.util.addClass(cmpTarget, 'largeModal');
    },
    prodList : function(cmp, evt, helper) {
        let vRecordId = cmp.get('v.recordId');
        console.log('RECORD ID: ' + vRecordId);
        let createVisit = cmp.get('c.newStoreVisit');
        createVisit.setParams({recordId: vRecordId});
        createVisit.setCallback(this,function(res){
            let id = res.getReturnValue();
            cmp.set('v.storeVisitId',id);
            $A.createComponent(
                    "c:StoreVisitProductsCmp",
                    {
                        storeVisitId : id,
                        recordId: vRecordId
                    },
                    function(newButton, status, errorMessage){
                        
                        //Add the new button to the body array
                        if (status === "SUCCESS") {
                            console.log("component created");
                            let body = cmp.get("v.body2");
                            body.push(newButton);
                            cmp.set("v.body2", body);
                        }
                        else if (status === "INCOMPLETE") {
                            console.log("No response from server or client is offline.")
                            // Show offline error
                        }
                        else if (status === "ERROR") {
                            console.log("Error: " + errorMessage);
                            // Show error message
                        }
                    }
                );
        });
        $A.enqueueAction(createVisit);
        helper.addClass(arguments, "storeDetails" , "slds-hide");
        helper.removeClass(arguments, "prodList",  "slds-hide");
	},
    
	goToProducts : function(cmp, event, helper) {
        let createVisit = cmp.get('c.newStoreVisit');
        let vRecordId = cmp.get('v.recordId');
        createVisit.setParams({acct: vRecordId});
        createVisit.setCallback(this,function(res){
            let id = res.getReturnValue();
            cmp.set('v.storeVisitId',id);
            cmp.set('v.recordId',vRecordId);
        $A.createComponent(
                "c:StoreVisit_StoreVisitFlow",
                {
                    storeVisitId : id,
                    acctId : vRecordId
                },
                function(newButton, status, errorMessage){
                    //Add the new button to the body array
                    if (status === "SUCCESS") {
                        var body = cmp.get("v.body");
                        body.push(newButton);
                        cmp.set("v.body", body);
                        
                        let prodList = cmp.find('prodList');
                        $A.util.addClass(prodList,'slds-hide');
                    }
                    else if (status === "INCOMPLETE") {
                        console.log("No response from server or client is offline.")
                        // Show offline error
                    }
                    else if (status === "ERROR") {
                        console.log("Error: " + errorMessage);
                        // Show error message
                    }
                }
            );
            });
        $A.enqueueAction(createVisit);
        helper.addClass(arguments, "storeDetails" , "slds-hide");
        helper.removeClass(arguments, "prodList",  "slds-hide");
	},
    EditAccountModal : function(component, event, helper) {
        var cmpTarget = component.find('EditAccountModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-closed');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_open');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_closed');
    },
    CloseDialog: function(component, event, helper) {
        var cmpTarget = component.find('EditAccountModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-closed');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_closed');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_open');
    },
    handleAccountSaved: function(component, event, helper) {
        console.log('account saved');
        var cmpTarget = component.find('EditAccountModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-closed');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-open');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_closed');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_open');
    }
})