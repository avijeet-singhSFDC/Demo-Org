({
	resetDemoFunction : function(component, event, helper) {
        var action = component.get("c.resetDemoMethod");
        
        action.setCallback(this, function(response) {
            var state = response.getState();
            var responseValue = response.getReturnValue();

            if (state === "SUCCESS") {
                // We need to toast the success or failure
                
                var toastEvent = $A.get("e.force:showToast");
                var title = (responseValue == "Success" ? "Success!" : "Error");
                var type = (responseValue == "Success" ? "success" : "error");
                var message = (responseValue == "Success" ? "The demo has been reset successfully." : responseValue);
                toastEvent.setParams({
                    "title": title,
                    "message": message,
                    "type": type
                });
                toastEvent.fire();
                
            }
            else if (state === "INCOMPLETE") {
            }
            else if (state === "ERROR") {
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " + errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });

        $A.enqueueAction(action);
	}
})