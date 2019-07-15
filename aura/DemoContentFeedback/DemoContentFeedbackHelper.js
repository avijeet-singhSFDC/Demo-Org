({
    showSpinner : function (component, event) {
        var spinner = component.find("spinner");
        $A.util.removeClass(spinner, "slds-hide");
        $A.util.addClass(spinner, "slds-show");
    },
    hideSpinner : function (component, event) {
       var spinner = component.find("spinner");
       $A.util.removeClass(spinner, "slds-show");
       $A.util.addClass(spinner, "slds-hide");
    },
    saveFeedBackJS : function (component, event){
        this.showSpinner(component, event);
    	var reasonVal = component.get("v.value");
        var unlineDescVal = component.get("v.unlikeDescription");
        var isLiked = !component.get("v.liked");
        var recId = component.get("v.recordId");
        var action = component.get("c.emailContentFeedback");
        action.setParams({
            "recordId": recId,
            "title": component.get("v.title"),
            "reasonAttr" : reasonVal,
            "unlineDescAttr" : unlineDescVal
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "Feedback saved successfully.",
                    "type": "success" 
                });
                toastEvent.fire();
                component.set("v.value","");
                component.set("v.unlikeDescription","");
                
                var feedback = component.find("feedback");
                $A.util.addClass(feedback, "slds-hide");
        		$A.util.removeClass(feedback, "slds-show");
                
                var thankyou = component.find("Thankyou");
                $A.util.addClass(thankyou, "slds-show");
        		$A.util.removeClass(thankyou, "slds-hide");
            }
            this.hideSpinner(component, event);
        });
        $A.enqueueAction(action);
    }
})