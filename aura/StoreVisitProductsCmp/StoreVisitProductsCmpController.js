({
	doInit : function(component, event, helper) {
        var vlstProd = [];
        vlstProd = component.get('v.lstOppProducts');
        console.log('::vlstProd.length::'+vlstProd.length);
        if(vlstProd.length === 0){
        	helper.queryProducts(component, event);
        }else{
            component.set('v.lstOppProducts',vlstProd);
        }
	},
    productSearch :  function(component, event, helper) {
       helper.queryProducts(component, event);
    },
    selectedProducts : function(component,event,helper){
        var vSelectedProducts = component.get("v.lstOppProducts");
        var vRecordId = component.get('v.recordId');
        var vOppProducts = [];
        for(var i=0; i < vSelectedProducts.length; i++){
            if(vSelectedProducts[i].bSelect == true){
                vOppProducts.push(vSelectedProducts[i]);
            }
        }
        //console.log('new list:'+select[0].flag);
        component.set("v.selectedProducts",vOppProducts);
        helper.addClass(arguments, "storeDetails" , "slds-hide");
        helper.removeClass(arguments, "mainWrap",  "slds-hide");
    },
    redirectBack : function(component,event,helper){
        helper.removeClass(arguments, "storeDetails" , "slds-hide");
        helper.addClass(arguments, "mainWrap",  "slds-hide");
    },
    cancel: function(component,event){
        var urlEvent = $A.get("e.force:navigateToURL");
        var urlId =  component.get('v.recordId');
        urlEvent.setParams({
            "url": "/"+urlId
        });
        urlEvent.fire();   
    },
    saveProducts : function(component,event,helper){
        var vRecordId = component.get('v.recordId');  
        var vStoreVisitId = component.get('v.storeVisitId');
        var vSelectedProducts = component.get("v.selectedProducts");
        var vProducts = JSON.stringify(vSelectedProducts);
        var action = component.get('c.createVisitProducts');
        action.setParams({ 
            recordId : vRecordId,
            listOfProductsString : vProducts,
            StoreVisitId: vStoreVisitId,
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('::state::'+state);
            if (state === "SUCCESS") {;
                //component.set('result::',response.getReturnValue());
                component.set('v.ToastMessage', 'Saved Successfully!'); 
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'sticky',
                    message: 'Products Saved!', 
                    type: 'info',
                });
            toastEvent.fire();
            }else if (state === "INCOMPLETE") {
                // do something
            }else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + 
                                 errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
})