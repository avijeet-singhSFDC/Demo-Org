({
    getLabels : function(component,event, field, counter) {
        var action = component.get('c.getLabel');
        var label = ""
        action.setParams({
            'fieldAPIName' : field,
        })
        action.setCallback(this,function(response){
            var state = response.getState();
            var fieldLabel = response.getReturnValue();
            var currentAttr = 'v.metric' + counter + 'Name';
            console.log(state)
            console.log(fieldLabel)
            console.log(typeof fieldLabel)  
            
            component.set(currentAttr, fieldLabel);
            
            
        })
        $A.enqueueAction(action)
    }
})