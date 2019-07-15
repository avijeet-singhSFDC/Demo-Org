({
    triggerEvent : function(component, event, helper) {
        //var store = component.find('store').getElement().value;
        var callDay = component.find('call-day').getElement().value;
        var freq = component.find('freq').getElement().value;
        //var target = component.find('target').getElement().value;
        
        console.log(callDay, freq);
        
        var compEvent = component.getEvent('updateFilter');
        compEvent.setParams({ 
            'freq' : freq,
            'callDay' : callDay
        });
        console.log('here', compEvent.getParams());
        compEvent.fire();
    }
})