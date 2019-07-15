(
    {
        doInit : function(component, event, helper) {
            console.log('updateData');
            var action = component.get("c.getEDInfo");
            action.setParams({
                "propertyId": component.get("v.recordId")
            });
            action.setCallback(component, function(response) {
                var result = response.getReturnValue();
                var state = response.getState();
                
                if (state === 'SUCCESS'){
                                        
                    $('.slds-card__header slds-grid').hide();
                    $('#predprice').html(myUtil.formatPrice(result.Discovery_Outcome__c));
                    $('#leadingCauses').html(myUtil.populateTable(result.Discovery_Explanation__c));
                    $('#recommendedImprovements').html(myUtil.populateTable(result.Discovery_Prescription__c));
                    
                } 
            });
            $A.enqueueAction(action);
            
        }
       
    })