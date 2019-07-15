({
    //Tokens are stored as blobs to prevent trialforce changing the keys
    //Dev Token for Mixpanel 56fa2ebd672ca6ae20852367479d099e
    //Dev Token BLOB çwøÓ [çz8Ñ½uu¶ºíý¶uí{ÓÝ
    //Live Token for Mixpanel ACTUAL 53f404db5542E000000TZFJ2de17090e
    //Live Token for Mixpanel Base64 to ASCII NTNmNDA0ZGI1NTQ0MGIxMWRiYTY3ZjIyZGUxNzA5MGU= window.atob() to decrypt
    //Live Token for Mixpanel Base64 çwøÓ [çz8Ñ½uu¶ºíý¶uí{ÓÝ
    MIXPANEL_TOKEN: "NTNmNDA0ZGI1NTQ0MGIxMWRiYTY3ZjIyZGUxNzA5MGU=",
    getMixpanelToken : function(component){
        return new Promise($A.getCallback(function(resolve,reject){
            let action = component.get('c.getToken');
            
            action.setCallback(this, function(res){
                let retVal = res.getReturnValue();
                let state = res.getState();
                
                if(state === 'SUCCESS'){
                    console.log('Mixpanel:getMixpanelToken', retVal);
                    resolve(retVal);
                } else {
                    let err = res.getError();
                    reject(err);
                }
            })
            
            $A.enqueueAction(action);            
        }))
    },
    //Fetch org metadata and distinct id for mixpanel
    setMessage : function(component, event, messageType) {
        let self = this;
        console.log('Mixpanel:setMessage');
        return new Promise($A.getCallback(function(resolve,reject){
            let action = component.get('c.getOrgData');
            
            action.setCallback(this, function(res){
                let state = res.getState();
                let OrgData =  res.getReturnValue();
                
                if(state === 'SUCCESS'){
                    console.log('MixpanelHelper:setMessage:success', OrgData, messageType);
                    if(messageType === 'event'){
                        self.sendEvent(component, event, OrgData);
                    }
                    else if(messageType === 'update'){
                        self.sendUpdate(component, event, OrgData);
                    }
                }
                else if (state === 'ERROR'){
                    let error = res.getError();
                    console.log('MixpanelHelper:setMessage:error', error);
                }
            },'SUCCESS')
            
            $A.enqueueAction(action);
        }))
    },
    sendEvent : function(component, event, OrgData) {
        console.log('Mixpanel:sendEvent');
        let self = this;
        self.getMixpanelToken(component)
        .then(function(token){
            console.log('token', token);
            return new Promise($A.getCallback(function(resolve,reject){
                
                let action = component.get('c.createEvent');
                let eventName = event.getParam('eventName');
                let payload = event.getParam('payload');
                
                let data = {
                    'event' : eventName,
                    'properties' : payload
                }
                
                data.properties['token'] = token;
                data.properties['org_id'] = OrgData.org_id;
                data.properties['org_type'] = OrgData.org_type;
                data.properties['distinct_id'] = OrgData.distinct_id;
                console.log('MixpanelHelper:sendEvent:data', JSON.stringify(data))
                
                let dataString = btoa(JSON.stringify(data))
                console.log('MixpanelHelper:sendEvent:dataString', dataString)
                
                action.setParams({
                    data: dataString
                });
                
                action.setCallback(this, function(res){
                    let state = res.getState();
                    let retVal =  res.getReturnValue();
                    if(state === 'SUCCESS'){
                        console.log('MixpanelHelper:sendEvent:success', retVal);
                    }
                    else if (state === 'ERROR'){
                        console.log('MixpanelHelper:sendEvent:error', res.getError());
                    }
                })
                
                $A.enqueueAction(action);
            }))
        })
	},
    sendUpdate : function(component, event, OrgData) {
        console.log('Mixpanel:sendUpdate');
		var action = component.get('c.updateProfile')
        let operation = event.getParam('operation');
        let eventInfo = event.getParam('payload');
        
        let data = {
            '$token' : window.atob(this.MIXPANEL_TOKEN),
            '$distinct_id' : OrgData.distinct_id
        }
        
        if(!operation.startsWith('$')){
            '$' + operation;
        }
        
        data[operation] = payload;
        
        console.log('MixpanelHelper:sendUpdate:data' , data);
        
        action.setParams({
            data: btoa(data)
        })
        
        action.setCallback(this, function(res){
            let state = res.getState();
            let retVal =  res.getReturnValue();
            if(state === 'SUCCESS'){
                console.log('MixpanelHelper:sendUpdate:success', retVal);
            }
            else if (state === 'ERROR'){
                console.log('MixpanelHelper:sendUpdate:error', res.getError());
            }
        },'SUCCESS')
        
        $A.enqueueAction(action);
	}
})