({
	fetchPickListVal: function(component, fieldName, elementId,helper) {
        var obj = component.get("v.objInfo");
        var opts = [];
        var titles = [];
        var action = component.get("c.getselectOptions");
        action.setParams({
            objObject: obj,
            fld: fieldName
        });
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
 
                if (allValues != undefined && allValues.length > 0) {
                    opts.push({
                        class: "optionClass",
                        label: "--- None ---",
                        value: ""
                    });
                }
                for (var i = 0; i < allValues.length; i++) {
                    opts.push({
                    	class: "optionClass",
                        label: allValues[i],
                        value: allValues[i]
                    });
                }
                component.find(elementId).set("v.options", opts);
            }else{
                console.log("error");
            }
        });
        $A.enqueueAction(action);
    },
    resetFilters: function(component, event,helper) {
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
    }
})