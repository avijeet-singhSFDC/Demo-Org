public class SchedulerController {
    
    @AuraEnabled
    public static List<Account> getAccountList(){
        return [SELECT Id, Name, Call_Day_of_Week__c, Call_Frequency__c, Last_Sales_Call__c, Call_Time__c
                FROM Account
                WHERE Name LIKE '%NTO%'
               ];
    }
    
    @AuraEnabled
    public static Account getAccount(String accId){
        return [SELECT Id, Name, Call_Day_of_Week__c, Call_Frequency__c, Last_Sales_Call__c, Call_Time__c
                FROM Account
                WHERE Id =: accId];
    }
    
    @AuraEnabled
    public static List<Event> generateNewEvents(String eventMapString){
        System.debug('eventMapString --' + eventMapString);
        
        List<Event> newEvents = new List<Event>();
        List<Account> acctsUpdated = new List<Account>();
        
        List<Map<String, String>> eventsMap = (List<Map<String, String>>)JSON.deserialize(eventMapString, List<Map<String, String>>.class);
        for(Map<String,String> eventMap: eventsMap){
            
            String acctId = eventMap.get('acct');
            String day = processDay(eventMap.get('day'));
            String name = eventMap.get('name');
            String freq = eventMap.get('freq');    
            String listVal = eventMap.get('listVal');
            
            String callTime = eventMap.get('callTime');
            String[] timeArr = callTime.split(':');
            String hour = timeArr[0];
            String min = timeArr[1];
            String second = timeArr[2];
            
            System.debug('New Event:  ' + acctId + ' - ' + day + ' - ' + freq + ' - ' + callTime);
            
            if(freq == 'Weekly'){
                Date today = system.today();
                DateTime activityDT = Datetime.newInstance(today.year(), today.month(), today.day(), 
                                                           Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                
                Datetime dt = Datetime.newInstance(today.year(), today.month(), today.day());
                String formattedDay = dt.format('E');
                
                if(formattedDay == day){
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT, Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(7), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(14), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(21), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                } else {
                    // First move the current date forward until the date of the week is equal to the requested day
                    
                    Date newDate = System.today();
                    
                    Datetime newDt;
                    String formatted;
                    for(Integer i = 1; i < 7; i++){
                        newDate = System.today().addDays(i);                        
                        DateTime actDT = Datetime.newInstance(newDate.year(), newDate.month(), newDate.day(), 
                                                              Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                        
                        newDt = Datetime.newInstance(newDate.year(), newdate.month(), newDate.day());
                        formatted = newDt.format('E');
                        
                        if(formatted == day){
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT, Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(7), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(14), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(21), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                        }
                    }                  
                }
            } else if(freq == 'Bi-Weekly 1') {
                Date today = system.today();
                DateTime activityDT = Datetime.newInstance(today.year(), today.month(), today.day(), 
                                                           Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                
                Datetime dt = Datetime.newInstance(today.year(), today.month(), today.day());
                String formattedDay = dt.format('E');
                
                if(formattedDay == day){
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT, Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(14), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                } else {
                    // First move the current date forward until the date of the week is equal to the requested day
                    
                    Date newDate = System.today();
                    Datetime newDt;
                    String formatted;
                    for(Integer i = 1; i < 7; i++){
                        newDate = System.today().addDays(i);
                        DateTime actDT = Datetime.newInstance(newDate.year(), newDate.month(), newDate.day(), 
                                                              Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                        
                        newDt = Datetime.newInstance(newDate.year(), newdate.month(), newDate.day());
                        formatted = newDt.format('E');
                        
                        if(formatted == day){
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT, Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(14), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                        }
                    }                  
                }
            } else if(freq == 'Bi-Weekly 2') {
                Date today = system.today();
                DateTime activityDT = Datetime.newInstance(today.year(), today.month(), today.day(), 
                                                           Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                
                Datetime dt = Datetime.newInstance(today.year(), today.month(), today.day());
                String formattedDay = dt.format('E');
                
                if(formattedDay == day){
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(7), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(21), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                } else {
                    // First move the current date forward until the date of the week is equal to the requested day
                    
                    Date newDate = System.today();
                    Datetime newDt;
                    String formatted;
                    for(Integer i = 1; i < 7; i++){
                        newDate = System.today().addDays(i);
                        DateTime actDT = Datetime.newInstance(newDate.year(), newDate.month(), newDate.day(), 
                                                              Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                        
                        newDt = Datetime.newInstance(newDate.year(), newdate.month(), newDate.day());
                        formatted = newDt.format('E');
                        
                        if(formatted == day){
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(7), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(21), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                        }
                    }                  
                }
            } else if(freq == 'Monthly 1') {
                Date today = system.today();
                DateTime activityDT = Datetime.newInstance(today.year(), today.month(), today.day(), 
                                                           Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                
                Datetime dt = Datetime.newInstance(today.year(), today.month(), today.day());
                String formattedDay = dt.format('E');
                
                if(formattedDay == day){
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT, Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                } else {
                    // First move the current date forward until the date of the week is equal to the requested day
                    
                    Date newDate = System.today();
                    Datetime newDt;
                    String formatted;
                    for(Integer i = 1; i < 7; i++){
                        newDate = System.today().addDays(i);
                        DateTime actDT = Datetime.newInstance(newDate.year(), newDate.month(), newDate.day(), 
                                                              Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                        
                        newDt = Datetime.newInstance(newDate.year(), newdate.month(), newDate.day());
                        formatted = newDt.format('E');
                        
                        if(formatted == day){
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT, Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                        }
                    }                  
                }
            } else if(freq == 'Monthly 2') {
                Date today = system.today();
                DateTime activityDT = Datetime.newInstance(today.year(), today.month(), today.day(), 
                                                           Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                
                Datetime dt = Datetime.newInstance(today.year(), today.month(), today.day());
                String formattedDay = dt.format('E');
                
                if(formattedDay == day){
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(7), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                } else {
                    // First move the current date forward until the date of the week is equal to the requested day
                    
                    Date newDate = System.today();
                    Datetime newDt;
                    String formatted;
                    for(Integer i = 1; i < 7; i++){
                        newDate = System.today().addDays(i);
                        DateTime actDT = Datetime.newInstance(newDate.year(), newDate.month(), newDate.day(), 
                                                              Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                        
                        newDt = Datetime.newInstance(newDate.year(), newdate.month(), newDate.day());
                        formatted = newDt.format('E');
                        
                        if(formatted == day){
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(7), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                        }
                    }                  
                }
            } else if(freq == 'Monthly 3') {
                Date today = system.today();
                DateTime activityDT = Datetime.newInstance(today.year(), today.month(), today.day(), 
                                                           Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                
                Datetime dt = Datetime.newInstance(today.year(), today.month(), today.day());
                String formattedDay = dt.format('E');
                
                if(formattedDay == day){
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(14), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                } else {
                    // First move the current date forward until the date of the week is equal to the requested day
                    
                    Date newDate = System.today();
                    Datetime newDt;
                    String formatted;
                    for(Integer i = 1; i < 7; i++){
                        newDate = System.today().addDays(i);
                        DateTime actDT = Datetime.newInstance(newDate.year(), newDate.month(), newDate.day(), 
                                                              Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                        
                        newDt = Datetime.newInstance(newDate.year(), newdate.month(), newDate.day());
                        formatted = newDt.format('E');
                        
                        if(formatted == day){
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(14), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                        }
                    }                  
                }
            } else if(freq == 'Monthly 4') {
                Date today = system.today();
                DateTime activityDT = Datetime.newInstance(today.year(), today.month(), today.day(), 
                                                           Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                
                Datetime dt = Datetime.newInstance(today.year(), today.month(), today.day());
                String formattedDay = dt.format('E');
                
                if(formattedDay == day){
                    newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = activityDT.addDays(21), Subject = 'Call with ' + Name, Type = 'Call', Description = 'This call was scheduled on '+ System.today(), DurationInMinutes = 60));
                } else {
                    // First move the current date forward until the date of the week is equal to the requested day
                    
                    Date newDate = System.today();
                    Datetime newDt;
                    String formatted;
                    for(Integer i = 1; i < 7; i++){
                        newDate = System.today().addDays(i);
                        DateTime actDT = Datetime.newInstance(newDate.year(), newDate.month(), newDate.day(), 
                                                              Integer.valueOf(hour), Integer.valueOf(min), Integer.valueOf(second));
                        
                        newDt = Datetime.newInstance(newDate.year(), newdate.month(), newDate.day());
                        formatted = newDt.format('E');
                        
                        if(formatted == day){
                            newEvents.add(new Event(WhatId = Id.valueOf(acctId), ActivityDateTime = actDT.addDays(21), Subject = 'Call with ' + Name, 
                                                    Description = 'This call was scheduled on '+ System.today(), Type = 'Call', DurationInMinutes = 60));
                        }
                    }                  
                }
            }
            
            System.debug('Calls to be scheduled: ' + newEvents);
            
            Account a = [SELECT Id, Name, Call_Day_of_Week__c, Call_Frequency__c FROM Account WHERE Id =: acctId];
            a.Call_Day_of_Week__c = eventMap.get('day');
            a.Call_Frequency__c = freq;
            a.Call_Time__c = listVal;
            
            acctsUpdated.add(a);
        }
        
        if(eventsMap.size() > 1){
            List<Event> events2Remove = [SELECT Id from Event WHERE ActivityDate > TODAY AND Type = 'Call'];
            delete events2Remove;
            System.debug('Removed Events');
        }
        insert newEvents;
        update acctsUpdated;
        return newEvents;
    }
    
    @AuraEnabled
    public static List<Account> clearTheSchedule(){
        List<Account> aList = [SELECT Id, Name, Call_Frequency__c, Call_Day_of_Week__c, Last_Sales_Call__c  
                               FROM Account
                               WHERE Call_Frequency__c != ''];
        for(Account a : aList){
            a.Call_Frequency__c = '';
            a.Call_Day_of_Week__c = '';
        }
        
        List<Event> events2Remove = [SELECT Id from Event WHERE ActivityDateTime >= TODAY AND Type = 'Call'];
        System.debug('events2Remove' + events2Remove);
        delete events2Remove;
        update aList;
        
        return aList;
    }
    
    private static String processDay(String d){
        if(d == 'Monday'){
            return 'Mon';
        } else if(d == 'Tuesday') {
            return 'Tue';
        } else if(d == 'Wednesday'){
            return 'Wed';
        } else if(d == 'Thursday') {
            return 'Thu';
        } else if(d == 'Friday') {
            return 'Fri';
        } else {
            return null;
        }
    }
}