({
	init : function(component, event, helper) {
		var action = component.get("c.getProducts");
        action.setCallback(this, function(response) {
            var name = response.getState();
            if (name === "SUCCESS") {
                console.log('Products: ',response.getReturnValue());
                component.set("v.Products",response.getReturnValue())
            } else {
                console.log('error: ',error);
            }
        });
        $A.enqueueAction(action);
	},
    handleClick  : function(component, event, helper) {
        var searchText = component.get('v.SearchText');
        if(searchText != ''){
            var action = component.get("c.getFilteredProducts ");
            action.setParams({  SearchPhrase : searchText });
            
            action.setCallback(this, function(response) {
                var name = response.getState();
                if (name === "SUCCESS") {
                    component.set("v.Products",response.getReturnValue());
                }
            });
            $A.enqueueAction(action);
        }else{
            var action = component.get("c.getProducts");
            action.setCallback(this, function(response) {
                var name = response.getState();
                if (name === "SUCCESS") {
                    console.log('Products: ',response.getReturnValue());
                    component.set("v.Products",response.getReturnValue())
                } else {
                    console.log('error: ',error);
                }
            });
            $A.enqueueAction(action);
        } 
    },
    handleNavigate: function(cmp, event) {
       var navigate = cmp.get("v.navigateFlow");
       navigate(event.getParam("action"));
    }
})