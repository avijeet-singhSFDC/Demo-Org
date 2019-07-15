({
	doInit: function(component, event, helper) { 
        var objectName = component.get("v.sobjecttype");
        if(objectName == 'Case'){
            helper.getDetailsFromCase(component, event, helper);
        }if(objectName == 'LiveChatTranscript'){
            helper.getDetailsFromChat(component, event, helper);
        }else{
            helper.getDetails(component, event, helper);
        }
	}
})