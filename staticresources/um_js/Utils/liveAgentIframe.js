/*
	this code holds the logic of configuring and running liveAgent, it's used for testing
	chat availability	the status is refreshed on the parent page.
	By doing this we overcome the problem of having to start Live agent to test availability
	and then having to remove and	reinsert the script to be able to start a chat sending parameters.

*/
	function initData(setupData){

		//console.log(setupData);

		if (setupData.umContactus_liveAgentDeploymentId__c != undefined &&
			setupData.umContactus_liveAgentChatButtonId__c != undefined &&
			setupData.umContactus_liveAgentDeploymentURL__c != undefined &&
			setupData.organizationId__c != undefined &&
			setupData.umContactus_liveAgentChatServerURL__c != undefined
			){

				initLiveAgent(setupData);
				if (!window._laq) { window._laq = []; }
				window._laq.push(function(){
					liveagent.showWhenOnline(setupData.umContactus_liveAgentChatButtonId__c , document.getElementById('agentOnlineBtn'));
					liveagent.showWhenOffline(setupData.umContactus_liveAgentChatButtonId__c , document.getElementById('agentOfflineBtn'));
				});

			startInterval();

			}else{
				console.log('parameter vacio ');
			}
	}

	/*
		this method initialized liveAgent, if the liveagent object is not loaded in the dom we will
		test every 500 ms until it's valid
	*/
	function initLiveAgent (data){
		var self = this;
		self.data = data;

        if (typeof window.liveagent == "undefined"){
            setTimeout(function(p) {
                    initLiveAgent(self.data);
            }, 500);
        }else{
            liveagent.init(self.data.umContactus_liveAgentChatServerURL__c, self.data.umContactus_liveAgentDeploymentId__c, self.data.organizationId__c);
        }
	}


	function checkField(){
		var visibleIs = $('#agentOnlineBtn').css('display') != 'none';
		//!($('#agentOfflineBtn').is(':visible')) || $('#agentOnlineBtn').is(':visible');
		parent.liveAgentIframe(visibleIs);
	}
	/*
		every 1000ms we will test the status of the chat, and refresh the status in the parent page.
	*/
	function startInterval(){
		interv = window.setInterval(checkField, 500);
	}


