({
    initOldMethod : function() {
        var action = component.get('c.getPanelDesign');
        action.setParams({
            recordId : component.get("v.recordId")
        });
        action.setCallback(this, function(response) {
            const ret = response.getReturnValue();
            if (response.getState() === 'SUCCESS') {
                if(response.getReturnValue()){ //Is Panel Design record page
                    component.set("v.panelDesign_record",response.getReturnValue());
                    component.set("v.isEditPage",true);
                    component.set("v.panelDesign",component.get("v.recordId"));
                    var action1 = component.get('c.getSobjects');
                    action1.setParams({
                        recordId : component.get("v.recordId")
                    });
                    action1.setCallback(this, function(response) {
                        if (response.getState() === 'SUCCESS') {
                            component.set("v.sObjectsList",response.getReturnValue());
                        }
                        else if (response.getState() === 'ERROR'){
                            console.log('error');
                        }
                    });
                    $A.enqueueAction(action1);
                    var action5 = component.get('c.getPanelComponentTypes');
                    action5.setCallback(this, function(response) {
                        if (response.getState() === 'SUCCESS') {
                            component.set("v.panelComponentTypes",response.getReturnValue());
                        }
                        else if (response.getState() === 'ERROR'){
                            console.log('error');
                        }
                    });
                    $A.enqueueAction(action5);
                    var action6 = component.get('c.getAllFields');
                    action6.setParams({
                        objectName : component.get("v.panelDesign_record.sObject_Name__c")
                    });
                    action6.setCallback(this, function(response) {
                        if (response.getState() === 'SUCCESS') {
                            component.set("v.selectedSobjectFields",response.getReturnValue());
                        }
                        else if (response.getState() === 'ERROR'){
                            console.log('error');
                        }
                    });
                    $A.enqueueAction(action6);
                }else{ //Other record page
                    component.set("v.isEditPage",false);
                    //component.set("v.panelDesign_editRecord",{});
                    var action3 = component.get('c.getPanelDesign');
                    action3.setParams({
                        recordId : component.get("v.panelDesign")
                    });
                    action3.setCallback(this, function(response) {
                        if (response.getState() === 'SUCCESS') {
                            component.set("v.panelDesign_record",response.getReturnValue());
                            var action21 = component.get('c.isPanelDesignForCurrentRecordPage');
                            action21.setParams({
                                panelDesignObjectName : response.getReturnValue().sObject_Name__c,
                                recordId : component.get("v.recordId")
                            });
                            action21.setCallback(this, function(response) {
                                if (response.getState() === 'SUCCESS') {
                                    component.set("v.isValidRecordPage",response.getReturnValue());
                                }
                                else if (response.getState() === 'ERROR'){
                                    console.log('error');
                                }
                            });
                            $A.enqueueAction(action21);
                        }
                        else if (response.getState() === 'ERROR'){
                            console.log('error');
                        }
                    });
                    $A.enqueueAction(action3);
                }
                var action2 = component.get('c.getPanelComponents');
                action2.setParams({
                    panelDesignId : component.get("v.panelDesign")
                });
                action2.setCallback(this, function(response) {
                    if (response.getState() === 'SUCCESS') {
                        var records = response.getReturnValue();
                        if(!component.get("v.isEditPage")){
                            var action7 = component.get('c.getViewPanelRecordDetail');
                            action7.setParams({
                                panelDesign : component.get("v.panelDesign_record"),
                                panelDesignComponents : records,
                                recordId : component.get("v.recordId")
                            });
                            action7.setCallback(this, function(response) {
                                if (response.getState() === 'SUCCESS') {
                                    component.set("v.elements",response.getReturnValue());
                                }
                                else if (response.getState() === 'ERROR'){
                                    console.log('error');
                                }
                            });
                            $A.enqueueAction(action7);
                        }else{
                            component.set("v.elements",records);
                        }
                    }
                    else if (response.getState() === 'ERROR'){
                        console.log('error');
                    }
                });
                $A.enqueueAction(action2);
            }
            else if (response.getState() === 'ERROR'){
                console.log('error');
            }
        });
        $A.enqueueAction(action);
    }
})