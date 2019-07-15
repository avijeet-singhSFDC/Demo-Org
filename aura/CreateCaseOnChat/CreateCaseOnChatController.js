({
	myAction : function(component, event, helper) {
		
	},
    
    doInit: function(cmp) {
        // Set the attribute value. 
        // You could also fire an event here instead.
    },
    
    getAgentWorks: function(cmp, evt, hlp) {
        var omniAPI = cmp.find("omniToolkit"); 
        var self 	= this;
        
        debugger;
        sforce.console.chat.getDetailsByChatKey('9eab7851-a522-4667-b606-4ac21b2ba563', function(result){
                    debugger;
                });
/*        
        omniAPI.getAgentWorks({
            callback: function(result) {
                debugger;
                if (result.success) {
                    console.log('Get work items successful');
                    var works = JSON.parse(result.works);
                    if (works.length > 0){
                        var work = works[works.length -1];
                        
						hlp.getLiveAgentChat(cmp, work.workItemId);                        
                        
                        console.log('First Agent Work ID is: ' +  work.workId);
                        console.log('Assigned Entity Id of the first Agent Work is: ' + work.workItemId);
                        console.log('Is first Agent Work Engaged: ' + work.isEngaged);
                        
                    }
                } else {
                    console.log('Get work items failed');
                }
            }
        });*/
    }

})