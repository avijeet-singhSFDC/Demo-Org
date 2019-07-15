({
	popTheCaseHelper : function(component, event) {
		var theCase = component.get('v.theCase');

		var workspaceAPI = component.find("workspace");
        workspaceAPI.getFocusedTabInfo().then(function(response) {
			try {
				workspaceAPI.openSubtab({
	                parentTabId: response.tabId,
	                url: '#/sObject/' + theCase.Id + '/view',
	                focus: false
	            });
			} catch(Exception) {
				console.log('There was an error.');
			}
        })
        .catch(function(error) {
            console.log(error);
        });
	}
})