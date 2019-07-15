({
	getChatDetails : function(helper, chatKey) {
        debugger;
        sforce.console.chat.getDetailsByChatKey(chatKey, function(result){
            debugger;
        });	
	},getLiveAgentChat : function(cmp, workItemId) {
        debugger;
        var action 	= cmp.get("c.getLiveChatTranscript");
        action.setParams({ id : workItemId });
        action.setCallback(this,function(response){
        	var state = response.getState();
            if (state === "SUCCESS") {
                        debugger;
                var liveChatTranscript = response.getReturnValue();
                sforce.console.chat.getDetailsByChatKey(liveChatTranscript.ChatKey, function(result){
                    debugger;
                });
                
                //hlp.getChatDetails(hlp,liveChatTranscript.ChatKey)
            }
        });
        
        $A.enqueueAction(action);
	},
})