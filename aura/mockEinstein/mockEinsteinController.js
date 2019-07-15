({
    doInit : function(component) {
        var rId = component.get("v.recordId");
        var action = component.get("c.getCSAT");
        action.setParams({recId: rId}); 
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log("From server: " + response.getReturnValue());
                var x = response.getReturnValue();
                if(x != null){
                    component.set("v.customerData",response.getReturnValue());
                    var score = component.get("v.customerData[0].Score__c"); 

                }
            }
            
            if (state === "ERROR") {
                console.log("From server: " + response.getReturnValue());
            }
        });
        $A.enqueueAction(action);
    },
    
    nextPage1:function()
    { 
        document.getElementById("card1").style.display="block";
        document.getElementById("card0").style.display="none";
        document.getElementById("card2").style.display="none";
    },
    
   	nextPage2:function()
    {
        document.getElementById("card1").style.display="none";
        document.getElementById("card0").style.display="none";
        document.getElementById("card2").style.display="block";
    },
    
    nextPage0:function()
    {
        document.getElementById("card1").style.display="none";
        document.getElementById("card0").style.display="block";
        document.getElementById("card2").style.display="none";
    },
})