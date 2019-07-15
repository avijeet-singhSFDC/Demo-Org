trigger AggregateDistanceinSA on Service_Resource_Movement__c (before update,after insert) {
	
    Map<Id,ServiceAppointment> samap;
    List<String> tosaids = new List<String>();
    List<ServiceAppointment> updatesas;
    
    if(Trigger.isUpdate){
        updatesas = new List<ServiceAppointment>();
        for(Service_Resource_Movement__c newsrm : Trigger.new){
            
            Service_Resource_Movement__c oldsrm = Trigger.oldMap.get(newsrm.Id);
            
            if(oldsrm.To_Service_Appointment__c == null && newsrm.To_Service_Appointment__c != null)
                tosaids.add(newsrm.To_Service_Appointment__c);
        }
        
        samap = new Map<Id,ServiceAppointment>([select id,Distance_travelled_to_reach__c  from serviceappointment where id in :tosaids]);
        
        for(Service_Resource_Movement__c newsrm : Trigger.new){
            
            Service_Resource_Movement__c oldsrm = Trigger.oldMap.get(newsrm.Id);
            
            if(oldsrm.To_Service_Appointment__c == null && newsrm.To_Service_Appointment__c != null){
                ServiceAppointment currsa = samap.get(newsrm.To_Service_Appointment__c);
                system.debug('currsa:'+currsa);
                system.debug('newsrm:'+newsrm);
                if(currsa != null){
                    currsa.Distance_travelled_to_reach__c += newsrm.Distance_Travelled__c;
                    //updatesas.add(currsa);
                    
                    samap.put(newsrm.To_Service_Appointment__c,currsa);
                }
                
            }
            
        }
        
        if(samap != null && samap.values() != null)
        	update samap.values();
    }
}