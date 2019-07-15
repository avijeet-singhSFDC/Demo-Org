trigger ComputeDistanceTrigger on ServiceResource (before update) {
    
    
    if(Trigger.isBefore){
        
        system.debug('\n**Trigger.old[0].LastKnownLatitude***'+Trigger.old[0].LastKnownLatitude);
        system.debug('\n**Trigger.old[0].LastKnownLongitude***'+Trigger.old[0].LastKnownLongitude);
        system.debug('\n**Trigger.new[0].LastKnownLatitude***'+Trigger.new[0].LastKnownLatitude);
        system.debug('\n**Trigger.new[0].LastKnownLongitude***'+Trigger.new[0].LastKnownLongitude);
        
        system.debug('\n**Trigger.old[0].RecentlyTraveled__c***'+Trigger.old[0].RecentlyTraveled__c);
        system.debug('\n**Trigger.new[0].RecentlyTraveled__c***'+Trigger.new[0].RecentlyTraveled__c);
        
        if(Trigger.old[0].LastKnownLatitude != Trigger.new[0].LastKnownLatitude && Trigger.old[0].LastKnownLongitude != Trigger.new[0].LastKnownLongitude){
            Decimal oldlat = Trigger.old[0].LastKnownLatitude;
            Decimal oldlong = Trigger.old[0].LastKnownLongitude;
            
            Trigger.new[0].Previous_Location__Latitude__s =  oldlat;
            Trigger.new[0].Previous_Location__Longitude__s =  oldlong;
        }
    }
    
    /*if(Trigger.isAfter){
        if(Trigger.old[0].RecentlyTraveled__c  != Trigger.new[0].RecentlyTraveled__c){
            Trigger.new[0].Total_Distance__c = Trigger.old[0].Total_Distance__c + Trigger.new[0].RecentlyTraveled__c;
            
            
        }
    }*/
    
    
    
    
}