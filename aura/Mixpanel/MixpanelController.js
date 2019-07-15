({
	handleEvent : function(component, event, helper) {
        console.log('Mixpanel: Event Message Received');
        helper.setMessage(component, event, 'event');
	},
    handleUpdate : function(component, event, helper) {
        helper.setMessage(component, event, 'update');
	}
})