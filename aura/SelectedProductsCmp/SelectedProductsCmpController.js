({
	doInit : function(component, event, helper) {
		var vSelectedProducts = [];
        vSelectedProducts = component.get('v.selectedProducts');
        console.log('vSelectedProducts::'+vSelectedProducts);
	},
    deleteProducts : function(component,event){
        var id = event.target.id;
        console.log('::id::'+id);
        var del = component.get("v.selectedProducts");
        var list = [];
        for(var i=0;i<del.length;i++){
            if(id != del[i].sId){
                list.push(del[i]);
            }
            else{
                console.log('in else');
            }
        }
        if(list.length > 0){
        	component.set("v.selectedProducts",list);
        }else{
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'pester',
                message: 'All records have deleted.',
                type: 'info',
                duration : '3000',
            });
            toastEvent.fire(); 
        }
    }, 
    saveProducts : function(component,event){
        var vRecordId = component.get('v.recordId');
        var action = component.get('c.createOpportunityProducts');
        var vSelectedProducts = component.get("v.selectedProducts");
        var vProducts = JSON.stringify(vSelectedProducts);
        action.setParams({ oppId : vRecordId,listOfProductsString : vProducts});
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('::state::'+state);
            if (state === "SUCCESS") {;
                //component.set('result::',response.getReturnValue());
               
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'sticky',
                    message: 'Records have successfully created.',
                    type: 'info',
                });
                toastEvent.fire();
                setTimeout(function(){
                    var urlEvent = $A.get("e.force:navigateToURL");
                    var urlId =  vRecordId;
                    urlEvent.setParams({
                        "url": "/"+urlId
                    });
                    urlEvent.fire();
                },5000);
                
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
    redirectBack : function(component,event){
        var vOppProducts = [];
        vOppProducts = component.get('v.selectedProducts');
        var vRecordId = component.get('v.recordId');
        var evt = $A.get("e.force:navigateToComponent");
        evt.setParams({
            componentDef : "c:OpportunityProductsCmp",
            componentAttributes: {
                'lstOppProducts' : vOppProducts,
                'recordId' : vRecordId
            }
        });
        evt.fire();
    }
})