({
    getActivitiesForAccount : function (component) {
        var action = component.get('c.getActivitiesForAccount');
        var id = component.get('v.recordId');
                
        action.setParams( {recordId : id} ); 
                
        action.setCallback(this, function(response){
            	var state = response.getState();
                if (component.isValid() && state === "SUCCESS"){
                    
                  component.set("v.activities", response.getReturnValue());
                  console.log(response.getReturnValue());
                  
                  
                }
                else {
                  console.log("Failed with state" + state);
                }
          })
          $A.enqueueAction(action);
    }    ,
    getActivitiesForContact : function (component) {
        var action = component.get('c.getActivitiesForContact');
        var id = component.get('v.recordId');
        console.log(id);
        
        action.setParams( {recordId : id} ); 
                
        action.setCallback(this, function(response){
            	var state = response.getState();
                if (component.isValid() && state === "SUCCESS"){
                    
                  component.set("v.activities", response.getReturnValue());
                  console.log(response.getReturnValue());
                  
                  
                }
                else {
                  console.log("Failed with state" + state);
                }
          })
          $A.enqueueAction(action);
    },
    getContactForAccount: function ( component ) {
        var action = component.get('c.getContactForAccount');
        var id = component.get ('v.recordId');
        
        action.setParams( {recordId : id} ); 
                
        action.setCallback(this, function(response){
            	var state = response.getState();
                if (component.isValid() && state === "SUCCESS"){
                    
                  component.set("v.contactId", response.getReturnValue());
                  console.log(response.getReturnValue());
                  
                  
                }
                else {
                  console.log("Failed with state" + state);
                }
          })
          $A.enqueueAction(action);
        
    }
})