({
    doInit: function(component, event, helper) {
        var currentRecord = component.get("v.recordId");
        var fieldsToUse = []; 
        var typeOfObject;
        var fieldsArray;
        var attrCounter = 1; 
        
        console.log('doInit and current record Id = ' + currentRecord)
        typeOfObject = currentRecord.slice(0,3);
        if(typeOfObject == '003'){
            console.log('typeOfObject is Contact')
            var action = component.get('c.getContactFromContact');
            action.setParams({
                'contactId' : component.get("v.recordId"),
            })
            action.setCallback(this,function(response){
                var state = response.getState();
                var contactRecord = response.getReturnValue();
                console.log(state);
                console.log(Object.values(contactRecord))
                if(state == "SUCCESS" && contactRecord.Profile_Metric_1__c != null){
                    // Setting Metric
                    Object.values(contactRecord).forEach(function(element, idx){
                        console.log(element)
                        console.log(idx)
                        if(element == component.get('v.recordId')){
                            console.log('id')
                        }else{
                            var currentField = 'Profile_Metric_' + attrCounter + '__c';
                            var fieldToInsert = 'v.field' + idx;
                            var currentAttr = 'v.metric' + attrCounter + 'Name';
                            if(component.get(currentAttr) == '' || component.get(currentAttr) == undefined){
                                helper.getLabels(component,event,currentField, attrCounter);
                            } else {
                                console.log('Already has label')
                            }
                            attrCounter++;
                            component.set(fieldToInsert, element)
                        }
                    })
                    
                } else if(state == "ERROR"){
                    console.log('ERROR');
                } else {
                    console.log('Null?');
                }
            })
            $A.enqueueAction(action)
        } else if (typeOfObject == '500'){
            console.log('typeOfObject is Case')
            var action = component.get('c.getContactFromCase');
            action.setParams({
                'caseId' : component.get("v.recordId"),
            })
            action.setCallback(this,function(response){
                var state = response.getState();
                var contactRecord = response.getReturnValue();
                console.log(state);
                console.log(Object.values(contactRecord))
                if(state == "SUCCESS" && contactRecord.Profile_Metric_1__c != null){
                    // Setting Metric
                    Object.values(contactRecord).forEach(function(element, idx){
                        console.log(element)
                        console.log(idx)
                        if(element == contactRecord.Id){
                            console.log('id')
                        }else{
                            var currentField = 'Profile_Metric_' + attrCounter + '__c';
                            var fieldToInsert = 'v.field' + idx;
                            var currentAttr = 'v.metric' + attrCounter + 'Name';
                            if(component.get(currentAttr) == '' || component.get(currentAttr) == undefined){
                                helper.getLabels(component,event,currentField, attrCounter);
                            } else {
                                console.log('Already has label')
                            }
                            attrCounter++;
                            component.set(fieldToInsert, element)
                        }
                        
                    })
                    
                } else if(state == "ERROR"){
                    console.log('ERROR');
                } else {
                    console.log('Null?');
                }
            })
            $A.enqueueAction(action)
        } else if (typeOfObject == '001'){
            console.log('typeOfObject is Person Account')
            var action = component.get('c.getContactFromPerson');
            action.setParams({
                'personId' : component.get("v.recordId"),
            })
            action.setCallback(this,function(response){
                var state = response.getState();
                var personRecord = response.getReturnValue();
                console.log(state);
                console.log(Object.values(personRecord))
                if(state == "SUCCESS" && personRecord.Profile_Metric_1__pc != null){
                    // Setting Metric
                    Object.values(personRecord).forEach(function(element, idx){
                        console.log(element)
                        console.log(idx)
                        if(element == personRecord.Id){
                            console.log('id')
                        }else{
                            var currentField = 'Profile_Metric_' + attrCounter + '__pc';
                            var fieldToInsert = 'v.field' + idx;
                            var currentAttr = 'v.metric' + attrCounter + 'Name';
                            if(component.get(currentAttr) == '' || component.get(currentAttr) == undefined){
                                helper.getLabels(component,event,currentField, attrCounter);
                            } else {
                                console.log('Already has label')
                            }
                            attrCounter++;
                            component.set(fieldToInsert, element)
                        }
                    })
                } else if(state == "ERROR"){
                    console.log('ERROR');
                } else {
                    console.log('Null?');
                }
            })
            $A.enqueueAction(action)
        } else {
            console.log('Error')            
        }
    } 
})