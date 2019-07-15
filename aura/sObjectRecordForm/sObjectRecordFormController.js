({
    doInit : function(component, event, helper) {
        
        var action = component.get("c.getFields");
        var objectApiName = component.get("v.objectApiName");
        var fsName = component.get("v.fieldSetName");
        action.setParams({typeName: objectApiName, recId: component.get('v.recordId'), fieldSetName:fsName});
        action.setCallback(this, function(a) {
            var fields = a.getReturnValue();
            console.log(JSON.stringify(fields));
            component.set("v.fieldList", fields);
            //var recid = component.get('v.recordId');
            //component.find(recid).reloadRecord(true); 
        });
        $A.enqueueAction(action);     
    },
    onSuccess : function(component, event, helper) {
        var params  = event.getParams();  
        component.set('v.recId',params.id);
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "message": "The record has been saved successfully.",
            "type":"success"
        });
        toastEvent.fire();
    },
    onSubmit : function(component, event, helper) {
    },
    onLoad : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Loaded!",
            "message": "The record has been Loaded successfully ."
        });
        toastEvent.fire();
    },
    onError : function(component, event, helper) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Error!",
            "message": "Failed to save the record.",
            "type":"error"
        });
        toastEvent.fire();
    }
    
    
})