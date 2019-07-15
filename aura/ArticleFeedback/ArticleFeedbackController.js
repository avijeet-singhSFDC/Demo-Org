({
    doInit : function (component, event, helper) {
        var unlikeCardCmp = component.find("unlikeCard");
        $A.util.removeClass(unlikeCardCmp, "slds-show");
        $A.util.addClass(unlikeCardCmp, "slds-hide");
    },
    
    handleToggleLike : function (component, event, helper) {
        
        var liked = component.get("v.liked");
        console.log(liked);
        var unlikeCardCmp = component.find("unlikeCard");
        $A.util.removeClass(unlikeCardCmp, "slds-show");
        $A.util.addClass(unlikeCardCmp, "slds-hide");
        
        component.set("v.liked", false);
        component.set("v.initLiked", true);
        
        component.set("v.value","");
        component.set("v.unlikeDescription","");
        helper.saveFeedBackJS(component, event);
    },
    
    handleToggleDislike : function (component, event, helper) {
        
        var liked = component.get("v.liked");
        console.log(liked);
        var unlikeCardCmp = component.find("unlikeCard");
        $A.util.addClass(unlikeCardCmp, "slds-show");
        $A.util.removeClass(unlikeCardCmp, "slds-hide");
        
        component.set("v.liked", true);
    },
    
    handleClick : function (component, event, helper) {
        helper.saveFeedBackJS(component, event);
    }
})