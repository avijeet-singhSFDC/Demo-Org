({
	ToastNotification : function(Title,Message,Type) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
        	title : Title,
            message: Message,
            duration:' 5000',
            type: Type,
            mode: 'pester'
        });
        toastEvent.fire(); 
    },
    HandleEventFiring : function(component, event, helper,whichone) { 
        if(whichone == 'Misc_Required_Setting'){
            helper.CreateRSIframe(component, event, helper);
            helper.StartDataFlow(component, event, helper);
            helper.UpdateEnabledField(component, event, helper, whichone);
        }else if(whichone == 'B2B_Commerce'){
            helper.UpdateOliviaBuyerRecordType(component, event, helper);
            helper.UpdateCloudCrazeSettings(component, event, helper);
            helper.UpdateEnabledField(component, event, helper, whichone);
        }else if( whichone == 'LiveMessage_Phone_Settings'){
            helper.OpenDialog(component, event, helper);
        }else if(whichone == 'Field_Sales'){
            helper.CreateStoreVisit(component, event, helper);
            helper.UpdateWaveURL(component, event, helper);
            helper.UpdateEnabledField(component, event, helper, whichone);
        }else if(whichone == 'IoT'){
            helper.OpenIoTDialog(component, event, helper);
        }else if(whichone == 'Update_Field_Service_Lightning_Data'){
			helper.OpenFSLDialog(component, event, helper);
        }else{
            helper.ToastNotification('No Method Found', 'Have you setup your methods?', 'error');
        }
    },
    /** Update Demo Setting to enabled **/
    UpdateEnabledField  : function(component, event, helper,whichone) { 
       var action = component.get("c.UpdateDemoSetting");
        action.setParams({
            WhichSetting: whichone,
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
                component.set("v.DemoSettings",response.getReturnValue());
            }
        });
		$A.enqueueAction(action);
    },
    UpdateRachelMorrisPhone : function(component, event, helper) {
        var phone = component.get("v.mobilephone");
        var persona = component.get("v.Persona");
        var email = component.get("v.LVEmail");
		var action = component.get("c.UpdateRMorrisPhone");
        
        action.setParams({
            PhoneNumber: phone,
            Persona: persona,
            Email: email
        });
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	helper.ToastNotification('Updated Contact Record', 'The Phone & Email of your persona has been updated. You may now use this for LiveMessage', 'success');
            }else{
                helper.ToastNotification('Persona Phone Update Failed', 'Failed to update the Phone Number', 'error');
            }
        });
		$A.enqueueAction(action);
    },
    CreateStoreVisit : function(component, event, helper) {
		var action = component.get("c.CreateStoreVisitRecord");
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	helper.ToastNotification('Store Visit Record Created', 'Store Visit Record Created and Assigned to Chantelle Rep', 'success');
            }else{
                helper.ToastNotification('Store Visit Record Creation Failed', 'Failed to create a store visit record', 'error');
            }
        });
		$A.enqueueAction(action);
    },
    StartDataFlow : function(component, event, helper){ 
        window.setTimeout(
            $A.getCallback(function() {
                var iframe = document.createElement('iframe');
                var base = component.get("v.BaseURL");
                iframe.src = base + '/apex/DemoSetupWaveAcc';
                document.getElementById('iframe_dataflow').appendChild(iframe);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Dataflow Started',
                    message: 'We have Started the Dataflow process. Please allow 10 minutes for this to complete.',
                    duration:' 5000',
                    type: 'success',
                    mode: 'pester'
                });
                toastEvent.fire();
        	}), 500
        );
    },
    UpdateWaveURL : function(component, event, helper){
        window.setTimeout(
            $A.getCallback(function() {
                var iframe = document.createElement('iframe');
                var base = component.get("v.BaseURL");
                iframe.src = base + '/apex/DemoSetupUpdateWaveURL';
                document.getElementById('iframe_waveurl').appendChild(iframe);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Updated Wave Dashboard URL',
                    message: 'I have updated the Wave Dashboard URL in the Field Sales Admin area.',
                    duration:' 5000',
                    type: 'success',
                    mode: 'pester'
                });
                toastEvent.fire();
        	}), 500
        );
    },
    UpdateCloudCrazeSettings : function(component, event, helper) {
        console.log("i am called");
        var action = component.get("c.UpdateCCStoreFront");
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	helper.ToastNotification('Updated CloudCraze Settings', 'CloudCraze URLs Updated', 'success');
            }else{
                helper.ToastNotification('CloudCraze Settings update Failed', 'Failed to update settings', 'error');
            }
        });
		$A.enqueueAction(action);
    },
    UpdateOliviaBuyerRecordType : function(component, event, helper) {
		var action = component.get("c.updateOliviaBuyer");
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	helper.ToastNotification('Updated Olivia Buyer Settings', 'Olivia Buyer contact record updated.', 'success');
            }else{
                helper.ToastNotification('Olivia Buyer Update Failed', 'Failed to update settings', 'error');
            }
        });
		$A.enqueueAction(action);
    },
    UpdateIoTOrchestration : function(component, event, helper) {
		var action = component.get("c.UpdatedIoTSettings");
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	helper.ToastNotification('Updated IoT Settings', 'The IoT Orchestration Settings have been updated.', 'success');
            }else{
                helper.ToastNotification('IoT Settings update Failed', 'Failed to update settings', 'error');
            }
        });
		$A.enqueueAction(action);
    },
    UpdateIoTCoolerURL : function(component, event, helper) {
		var action = component.get("c.UpdatedIoTAssetInventorySettings");
		action.setCallback(this, function(response) {
            var state = response.getState();
            if(state === 'SUCCESS'){
            	helper.ToastNotification('Updated IoT Cooler Community URL', 'The Community URL For Staged B2B Cart has been updated..', 'success');
            }else{
                helper.ToastNotification('IoT Alpine Cooler URL update Failed', 'Failed to update settings', 'error');
            }
        });
		$A.enqueueAction(action);
    },
    CreateRSIframe : function(component, event, helper){ 
        window.setTimeout(
            $A.getCallback(function() {
                var iframe = document.createElement('iframe');
                var base = component.get("v.BaseURL");
                iframe.src = base + '/apex/DemoSetup';
                document.getElementById('iframe_parent').appendChild(iframe);
                
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    title : 'Remote Site Setting Created',
                    message: 'We have Created the thisorg and MyDomain Remote Site Settings.',
                    duration:' 5000',
                    type: 'success',
                    mode: 'pester'
                });
                toastEvent.fire();
        	}), 500
        );
    },
    OpenDialog: function(component, event, helper) {
        var cmpTarget = component.find('InputPhoneNumber');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-closed');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_open');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_closed');
    },
    OpenFSLDialog: function(component, event, helper) {
        var cmpTarget = component.find('FSLModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-closed');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_open');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_closed');
    },
    
    OpenIoTDialog: function(component, event, helper) {
        var cmpTarget = component.find('IoTModal');
        $A.util.addClass(cmpTarget, 'slds-fade-in-open');
		$A.util.removeClass(cmpTarget, 'slds-fade-in-closed');
        
        var cmpTarget2 = component.find('overlay');
        $A.util.addClass(cmpTarget2, 'slds-backdrop_open');
		$A.util.removeClass(cmpTarget2, 'slds-backdrop_closed');
    },  
})