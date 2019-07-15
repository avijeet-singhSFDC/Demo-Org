({
    onMouseDown : function(c,e,h){
        var pos3 = e.clientX;
        var pos4 = e.clientY;
        c.set("v.pos3",pos3);
        c.set("v.pos4",pos4);
    },
    onDragEnd : function(c,e,h){
        const elements = c.get('v.elements');
        const element = elements[e.srcElement.closest('[data-index]').dataset.index];
        var pos1 = c.get("v.pos3") - e.clientX;
        var pos2 = c.get("v.pos4") - e.clientY;
        var pos3 = e.clientX;
        var pos4 = e.clientY;
        c.set("v.pos1",pos1);
        c.set("v.pos2",pos2);
        c.set("v.pos3",pos3);
        c.set("v.pos4",pos4);
        element.Offset_X__c = (element.Offset_X__c - pos2);
        element.Offset_Y__c = (element.Offset_Y__c - pos1);
        c.set('v.elements', elements);
    },
    jsLoaded : function(component,event,helper){
        $A.util.removeClass( component.find('loadingDiv'), "slds-hide");
        var action = component.get('c.initHighlightPanel');
        action.setParams({
            recordId : component.get("v.recordId"),
            panelDesignId : component.get("v.panelDesign")
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var ret = response.getReturnValue();
                component.set("v.errorMessage",ret['ERROR']);
                component.set("v.panelDesign_record",ret['PANEL_DESIGN_RECORD']);
                component.set("v.isEditPage",ret['IS_EDIT_PAGE']);
                component.set("v.panelDesign",ret['PANEL_DESIGN_ID']);
                component.set("v.sObjectsList",ret['SOBJECT_LIST']);
                component.set("v.panelComponentTypes",ret['PANEL_COMPONENT_TYPES']);
                component.set("v.selectedSobjectFields",ret['SELECTED_SOBJECT_FIELDS']);
                component.set("v.isValidRecordPage",ret['VALID_RECORD_PAGE']);
                component.set("v.fontSizes",ret['FONT_SIZES']);
                var currentWidth = $(window).width();
                if(ret['PANEL_DESIGN_RECORD']){
                    var recordWidth = ret['PANEL_DESIGN_RECORD'].Canvas_Width__c;
                    if(currentWidth == recordWidth){
                        component.set("v.elements",ret['PANEL_COMPONENTS']);
                    }else{
                        var newElements = [];
                        var elements = ret['PANEL_COMPONENTS'];
                        for(var i=0;i<Object.keys(elements).length;i++){
                            var element = elements[i];
                            var percOffset = (element.Offset_Y__c / recordWidth) * 100;
                            var newOffset = currentWidth * (percOffset / 100);
                            element.Offset_Y__c =  newOffset;
                            newElements.push(element);
                        }
                        component.set("v.elements",newElements);
                    }
                    var width = $(window).width();
                    $(window).on('resize', function(){
                        if($(this).width() != width){
                            width = $(this).width();
                            var newElements = [];
                            var elements = ret['PANEL_COMPONENTS'];
                            for(var i=0;i<Object.keys(elements).length;i++){
                                var element = elements[i];
                                var percOffset = (element.Offset_Y__c / recordWidth) * 100;
                                var newOffset = width * (percOffset / 100);
                                element.Offset_Y__c =  newOffset;
                                newElements.push(element);
                            }
                            component.set("v.elements",newElements);
                            recordWidth = $(window).width();
                        }
                    });
                }
                $A.util.addClass( component.find('loadingDiv'), "slds-hide");
            }else{
                console.log('error');
            }
        });
        $A.enqueueAction(action);
    },
    onLoadDiv : function(c,e,h){
        try{
            $("#"+e.currentTarget.id).resizable();
        }catch(err){
            
        }
    },
    onMouseUp:function(c,e,h){
        try {
            const elements = c.get('v.elements');
            const element = elements[e.srcElement.closest('[data-index]').dataset.index];
            element.Width__c =  $("#"+e.currentTarget.id).width();
            element.Height__c =  $("#"+e.currentTarget.id).height();
            c.set('v.elements', elements);
        }
        catch(err) {
        }
    },
    onClickSaveChanges : function(c,e,h){
        var panelDesign_record = c.get("v.panelDesign_record");
        var panelDesignComponents = c.get("v.elements");
        var action = c.get('c.saveChanges');
        action.setParams({
            panelDesign : panelDesign_record,
            panelDesignComponents : panelDesignComponents,
            width : $(window).width()+''
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "The record has been updated successfully.",
                    "type" : "success"
                });
                toastEvent.fire();
            }
            else if (response.getState() === 'ERROR'){
                var errors = response.getError();
                if (errors) {
                    if (errors[0] && errors[0].message) {
                        console.log("Error message: " +
                                    errors[0].message);
                    }
                } else {
                    console.log("Unknown error");
                }
            }
        });
        $A.enqueueAction(action);
    },
    onChangeSobjectName : function(c,e,h){
        var action = c.get('c.getAllFields');
        action.setParams({
            objectName : c.get("v.panelDesign_record.sObject_Name__c")
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                c.set("v.selectedSobjectFields",response.getReturnValue());
            }
            else if (response.getState() === 'ERROR'){
                console.log('error');
            }
        });
        $A.enqueueAction(action);
    },
    onImageUploadFinished_Component : function(c,e,h){
        var fileId = e.getSource().get('v.name');    
        var uploadedFiles = e.getParam("files");
        var action = c.get('c.getPanelBackgroundImageURL');
        action.setParams({
            contentDocumentId : uploadedFiles[0].documentId
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                const elements = c.get('v.elements');
                const element = elements[fileId];
                element.Image_URL__c = response.getReturnValue();
                element.Width__c = 100;
                element.Height__c = 100;
                c.set('v.elements', elements);
            }
            else if (response.getState() === 'ERROR'){
                console.log('error');
            }
        });
        $A.enqueueAction(action);
    },
    onClickAddPanelComponent : function(c,e,h){
        var elements = c.get("v.elements");
        var positionTop = document.getElementById('newComponentBox').getBoundingClientRect().top + window.pageYOffset - 155;
        var positionLeft = document.getElementById('newComponentBox').getBoundingClientRect().left + window.pageXOffset  + 10;
        var action = c.get('c.createNewElement');
        action.setParams({
            panelDesignId : c.get("v.panelDesign_record.Id"),
            position_top : positionTop,
            position_left : positionLeft 
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                elements.push(response.getReturnValue());
                c.set("v.elements",elements);
            }
            else if (response.getState() === 'ERROR'){
                console.log('error');
            }
        });
        $A.enqueueAction(action);
    },
    onClickDelete : function(c,e,h){
        var index = e.currentTarget.id;
        var elements = c.get("v.elements");
        var element = c.get("v.elements["+index+"]");
        if(!element.Id){
            elements.splice(index, 1);
            c.set("v.elements",elements);
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Success!",
                "message": "Panel Component is Deleted",
                "type" : "success"
            });
            toastEvent.fire();
        }else{
            var action = c.get('c.deleteElement');
            action.setParams({
                elementId : element.Id
            });
            action.setCallback(this, function(response) {
                if (response.getState() === 'SUCCESS') {
                    if(response.getReturnValue() == true){
                        elements.splice(index, 1);
                        c.set("v.elements",elements);
                        var toastEvent = $A.get("e.force:showToast");
                        toastEvent.setParams({
                            "title": "Success!",
                            "message": "Panel Component is Deleted",
                            "type" : "success"
                        });
                        toastEvent.fire();
                    }
                }
                else if (response.getState() === 'ERROR'){
                    console.log('error');
                }
            });
            $A.enqueueAction(action);
        }
    },
    onClickDeleteHighlightPanel : function(c,e,h){
        var action = c.get('c.deleteHighlightPanel');
        action.setParams({
            highlightPanelId : c.get('v.panelDesign_record').Id
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                if(response.getReturnValue() == true){
                    window.open('/one/one.app#/sObject/Panel_Design__c/list?filterName=Recent','_self');
                }
            }
            else if (response.getState() === 'ERROR'){
                console.log('error');
            }
        });
        $A.enqueueAction(action);
    },
    onClickClone : function(c,e,h){
        $A.util.removeClass( c.find('clonePopup'), "slds-hide");
    },
    closeClonePopup : function(c,e,h){
        $A.util.addClass( c.find('clonePopup'), "slds-hide");
    },
    onClickClonePanelDesign : function(c,e,h){
        var action = c.get('c.clonePanelDesign');
        action.setParams({
            panelDesignId : c.get('v.panelDesign_record.Id'),
            panelDesignName : c.get('v.clone_PanelDesignName')
        });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "A new Panel Design has been created.",
                    "type" : "success"
                });
                toastEvent.fire();
                $A.util.addClass( c.find('clonePopup'), "slds-hide");
                window.open("/"+response.getReturnValue(),"_blank");
            }
            else if (response.getState() === 'ERROR'){
                console.log('error');
            }
        });
        $A.enqueueAction(action);
    },
    onClickShowUtilityIcons : function(c,e,h){
        $A.util.removeClass( c.find('iconDesignsPopup'), "slds-hide");
    },
    closeUtilityIconPopup : function(c,e,h){
        $A.util.addClass( c.find('iconDesignsPopup'), "slds-hide");
    },
    onClickComboBoxType : function(c,e,h){
        var id = e.currentTarget.id;
        var index = id.split('~')[2];
        var value = id.split('~')[1];
        var element = c.get("v.elements["+index+"]");
        element.Combo_Box_Type__c = value;
        c.set("v.elements["+index+"]",element);
    },
    reRenderElements : function(c,e,h){
        c.set("v.elements",c.get("v.elements"));
    }
})