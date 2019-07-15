({
	doInit : function(component, event, helper) {
        console.log("fired");
		var action = component.get("c.DemoContentVideoURL");
        action.setParams({
            "recordId": component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                component.set("v.VideoUrl",response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
	}
})