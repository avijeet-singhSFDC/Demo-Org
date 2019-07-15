({
    handleUploadFinished: function (cmp, event) {
        var uploadedFiles = event.getParam("files");
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "type": "success",
            "message": "Photo added successfully."
        });
        toastEvent.fire();
        
        $A.get('e.force:refreshView').fire();
        $A.get("e.force:closeQuickAction").fire();
    }
})