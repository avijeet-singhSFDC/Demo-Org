({
	queryProducts : function(component, event) {
		var vRecordId = component.get('v.recordId');
        console.log('Record ID: ' + vRecordId);
        var action = component.get('c.getProductsNew');
        var vSearchProd = component.get('v.searchProd');
        if(vSearchProd == undefined || vSearchProd == null || vSearchProd == ''){
            vSearchProd = '';
        }
        action.setParams({ 
            recordId: vRecordId,
            searchKeyword:vSearchProd
        });
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
	},
    addClass : function(args, auraId, className){ 
        let [component, event, helper] = args
        let el = component.find(auraId)
        if(el.length){
            el.forEach(e => $A.util.addClass(e, className))
        }else{
            $A.util.addClass(el, className)            
        }
    },
    removeClass : function(args, auraId, className){
        let [component, event, helper] = args
        let el = component.find(auraId)
        if(el.length){
            el.forEach(e => $A.util.removeClass(e, className))
        }else{
            $A.util.removeClass(el, className)            
        }
    },
})