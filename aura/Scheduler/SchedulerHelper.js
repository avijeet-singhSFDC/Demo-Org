({
    popToast : function(component) {
        // Display the total in a "toast" status message
        var resultsToast = $A.get("e.force:showToast");
        resultsToast.setParams({
            "title": "Success!",
            "message": "Your schedule has been saved successfully!",
            "type" : "success"
        });
        resultsToast.fire();
        console.log('Toast should have fired');
    }
})