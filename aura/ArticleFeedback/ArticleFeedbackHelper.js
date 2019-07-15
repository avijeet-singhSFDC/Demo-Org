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
        
        var articleId = component.get("v.recordId");
            
        var action = component.get("c.upsertFavArticles");
        action.setParams({
            "recordId": articleId,
            "title": component.get("v.title"),
            "reasonAttr" : reasonVal,
            "unlineDescAttr" : unlineDescVal,
            "isLikedAttr" : isLiked
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
            }
            this.hideSpinner(component, event);
        });
        $A.enqueueAction(action);
    }
})