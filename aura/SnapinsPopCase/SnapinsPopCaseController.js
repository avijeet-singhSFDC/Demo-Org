({
	doInit : function(component, event, helper) {
		var recordId = component.get('v.recordId');
		console.log('recordId : ' + recordId);

		var workspaceAPI = component.find("workspace");
		console.log('workspaceAPI : ' , workspaceAPI);

		var subject = component.get('v.subject');
		var description = component.get('v.description');
		var recordTypeName = component.get('v.recordTypeName');

        
		var action = component.get("c.createMyCase");
		action.setParams({
			"myId": recordId,
			"recordTypeName": recordTypeName,
			"subject": subject,
			"description": description
		});
		action.setCallback(this, function(a) {
			var theCase = a.getReturnValue();
			console.log('Case Id : ' + theCase.Id);
			component.set('v.theCase', theCase);
			helper.popTheCaseHelper(component, event);
		});
		$A.enqueueAction(action);



	}
})