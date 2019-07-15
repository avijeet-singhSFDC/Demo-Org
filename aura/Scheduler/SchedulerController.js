({
    doInit : function(component, event, helper) {
        var action = component.get('c.getAccountList');
        
        action.setCallback(this, function(result){
            var res = result.getReturnValue();
            console.log('res --', res);
            
            component.set('v.accountList', res);
            component.set('v.filteredAccts', res);
            
            let timeSlots = [
                {
                    'time' : '',
                    'iso' : ''
                },
                {
                    'time' : '9:00am',
                    'iso' : '09:00:00'
                },
                {
                    'time' : '10:00am',
                    'iso' : '10:00:00'
                },            
                {
                    'time' : '11:00am',
                    'iso' : '11:00:00'
                },
                {
                    'time' : '12:00pm',
                    'iso' : '12:00:00'
                },
                {
                    'time' : '1:00pm',
                    'iso' : '13:00:00'
                },
                {
                    'time' : '2:00pm',
                    'iso' : '14:00:00'
                },
                {
                    'time' : '3:00pm',
                    'iso' : '15:00:00'
                },
                {
                    'time' : '4:00pm',
                    'iso' : '16:00:00'
                },
                {
                    'time' : '5:00pm',
                    'iso' : '17:00:00'
                }
            ];
            
            component.set('v.timeSlots', timeSlots);
        });
        
        $A.enqueueAction(action);
    },
    handleComponentEvent : function(component, event, helper) {
        console.log('in');
        var store = event.getParam('store');
        var callDay = event.getParam('callDay');
        var freq = event.getParam('freq');
        var target = event.getParam('target');
        
        var acctList = component.get('v.accountList');
        var newList = [];
        
        if(callDay != ''){
            if(newList.length > 0){
                var tempList = [];
                newList.forEach(function(el){
                    if(el.hasOwnProperty('Call_Day_of_Week__c')){
                        console.log('has prop', callDay);
                        if(el.Call_Day_of_Week__c == callDay){
                            console.log(el);
                            tempList.push(el);
                        }
                    }
                });
                newList = tempList;
                console.log(newList);
            } else {
                acctList.forEach(function(el){
                    if(el.hasOwnProperty('Call_Day_of_Week__c')){
                        console.log('has prop', callDay);
                        if(el.Call_Day_of_Week__c == callDay){
                            console.log(el);
                            newList.push(el);
                            console.log('newList', newList );
                        }
                    }
                });
            }
        }
        
        console.log('newList', newList );
        component.set('v.filteredAccts', newList);
    }, 
    drillIntoAccount : function(component, event, helper){
        console.log('target', event.target.id);
        var navEvt = $A.get("e.force:navigateToSObject");
        navEvt.setParams({
            "recordId": event.target.id
        });
        navEvt.fire();
        
    },
    addToEvents : function(component, event, helper){
        var events = component.get('v.newEventsList');
        console.log('Current events:', event.target);
        
        var row = event.target.parentElement.parentElement.parentElement.parentElement.parentElement;
        console.log('Row: ', row);
        var acct = row.dataset.acctid;
        console.log('acct: ', acct);
        var name = row.dataset.acctname;
        console.log('name: ', name);
        var day = row.children[1].firstChild.firstChild.firstChild.firstChild.value;
        console.log('day: ', day);
        var freq = row.children[2].firstChild.firstChild.firstChild.firstChild.value;
        console.log('freq: ', freq);
        var callTime = row.children[3].firstChild.firstChild.firstChild.firstChild.value;
        console.log('callTime: ', row.children[3].firstChild.firstChild.firstChild.firstChild.value);
        var timeArr = callTime.split('|');
        
        console.log('New event', acct, day, freq, callTime);
        
        if(events.length > 0){
            console.log('events exist, need to search');
            var matchFound = false;
            for(var i = 0; i < events.length; i++){
                if(events[i].acct == acct){
                    events[i].day = day;
                    events[i].freq = freq;
                    events[i].name = name;
                    events[i].callTime = timeArr[0];
                    events[i].listVal = timeArr[1];
                    console.log('updated events:', events[i]);
                    matchFound = true;
                    break;
                } 
            }
            
            if(!matchFound) {
                events.push({
                    'acct' : acct,
                    'day' : day,
                    'freq' : freq,
                    'name' : name,
                    'callTime' : timeArr[0],
                    'listVal' : timeArr[1]
                });
            } 
            
        } else {
            console.log('No previous events, create new!');
            events.push({
                'acct' : acct,
                'day' : day,
                'freq' : freq,
                'name' : name,
                'callTime' : timeArr[0],
                'listVal' : timeArr[1]
            });
        }
        console.log('End of update - events:', events);
        component.set('v.newEventsList', events);
    },
    saveSchedule : function(component, event, helper){
        var events = component.get('v.newEventsList');
        console.log('events to Submit:', events);
        
        var action = component.get('c.generateNewEvents');
        
        action.setParams({
            'eventMapString' : JSON.stringify(events)
        });
        
        action.setCallback(this, function(result){
            var res = result.getReturnValue();
            var state = result.getState();
            
            if(state === 'SUCCESS'){
                console.log('res', res);
                helper.popToast(component);
            } else {
                console.log(result.getError());
            }
        });
        
        $A.enqueueAction(action);
    }, 
    navToEvents : function(component, event, helper){
        
        var urlEvent = $A.get("e.force:navigateToURL");
        
        urlEvent.setParams({
            "url" : "/one/one.app#/n/Today_s_Visits"
        });
        
        urlEvent.fire();
        
    },
    clearSchedule : function(component, event, helper){
        var action = component.get('c.clearTheSchedule');
        
        action.setCallback(this, function(result){
            var res = result.getReturnValue();
            var state = result.getState();
            
            if(state === 'SUCCESS'){
                console.log('res - clear schedule -- ', res);
                
                component.set('v.accountList', res);
                component.set('v.filteredAccts', res);
                
                var resultsToast = $A.get("e.force:showToast");
                resultsToast.setParams({
                    "title": "Success!",
                    "message": "Your schedule has been cleared!"
                });
                resultsToast.fire();
            } else {
                console.log(result.getError());
            }
        });
        
        $A.enqueueAction(action);
    }
})