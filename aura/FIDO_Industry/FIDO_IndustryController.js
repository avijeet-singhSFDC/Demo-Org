({
	myAction : function(component, event, helper) {
		
	},
    IndustryChoice: function(component, event, helper) {
    	var whichOne = event.currentTarget.id;
        component.set("v.Industry",whichOne);
        component.set("v.ScreenChoice","Brand");
        component.set("v.ComponentTitle", "Getting to know your brand");
	},
})