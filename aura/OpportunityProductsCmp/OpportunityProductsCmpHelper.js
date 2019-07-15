({
	queryProducts : function(component, event) {
		var vRecordId = component.get('v.recordId');
        var action = component.get('c.getProducts');
        var vSearchProd = component.get('v.searchProd');
        if(vSearchProd == undefined || vSearchProd == null || vSearchProd == ''){
            vSearchProd = '';
        }
        action.setParams({ oppId : vRecordId,searchKeyword:vSearchProd});
        action.setCallback(this, function(response) {
            var state = response.getState();
            console.log('::state::'+state);
            if (state === "SUCCESS") {
                var result = response.getReturnValue();
                component.set('v.lstOppProducts',result);
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
	}
})