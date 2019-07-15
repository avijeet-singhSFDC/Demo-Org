@RestResource(urlMapping='/PlatformEvent/*')

global class PlatformEvent {
    @HttpPost
    global static string firePlatformEvent(Map<string,string> fieldValues, string eventName){
        system.debug(fieldValues);
        //instantiate event from string name
        sObject sObj = Schema.getGlobalDescribe()
            .get(eventName)
            .newSObject();
        
        //get fields from new event
        SObjectType objToken = Schema.getGlobalDescribe().get(eventName);
        DescribeSObjectResult objDef = objToken.getDescribe();
        Map<String, SObjectField> fields = objDef.fields.getMap();
        
        for(string f : fieldValues.keySet()){
           sObj.put(fields.get(f), Decimal.valueOf(fieldValues.get(f))); 
        }
        
        sObj.put('CoolerID__c', '02iB00000005YkFIAU');
        
        List<sObject> newEvents = new List<sObject>{sObj};
        List<Database.SaveResult> results = EventBus.publish(newEvents);       
        for (Database.SaveResult sr : results) {
            if (sr.isSuccess()) {
                System.debug('Successfully published event.');
                return 'Successfully published event.';
            } else {
                for(Database.Error err : sr.getErrors()) {
                    System.debug('Error returned: ' +
                                 err.getStatusCode() +
                                 ' - ' +
                                 err.getMessage());
                    return 'Error returned: ' +
                                 err.getStatusCode() +
                                 ' - ' +
                                 err.getMessage();
                }
            }       
        }
        return 'Insert Failed.';
    }

}