({
    init : function(component, event, helper) {
		var action = component.get("c.getSingleProducts");
        action.setParams({
            ProdId : component.get("v.ProductId"),
        });
        action.setCallback(this, function(response) {
            var name = response.getState();
            if (name === "SUCCESS") {
                console.log("Product: " + JSON.stringify(response.getReturnValue()));
                component.set("v.Products",response.getReturnValue())
            } else {
                console.log('error: ',error);
            }
        });
        $A.enqueueAction(action);
	},
	addProds : function(component, event, helper) {
        var whichOne = event.currentTarget.id;
        console.log('Product ID: ' + whichOne);
        console.log('Order ID: ' + component.get("v.OrderId"));
		var action = component.get("c.addProduct");
        action.setParams({
            OrderId : component.get("v.OrderId"),
            ProdId : whichOne,
        });
        action.setCallback(this, function(response) {
            var name = response.getState();
            if (name === "SUCCESS") {
                console.log('Items: ',response.getReturnValue());
                component.set("v.Items",response.getReturnValue());
                
                component.set("v.addIcon","utility:check");
                component.set("v.AddProductText",'Product Added!');
                
            }else {
            	console.log('There was a problem : '+response.getError());
        	}
        });
        $A.enqueueAction(action);  
	}, 
})