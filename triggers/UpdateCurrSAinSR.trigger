trigger UpdateCurrSAinSR on ServiceAppointment (after update) {
	List<ServiceResource> updateServiceResourceList = new List<ServiceResource>();
    List<Id> saids = new List<id>();
    Map<Id,Id> saidsridmap = new Map<Id,Id>();
    
    for(ServiceAppointment sa : Trigger.new){
        ServiceAppointment oldSa = Trigger.oldMap.get(sa.Id);
        
        if(oldSa.Status != 'In Progress' && sa.Status == 'In Progress'){
    		saids.add(sa.Id);        
        }
    }
    
    List<AssignedResource> assignedResourcesList = [select id, serviceresourceId, ServiceAppointmentId  from AssignedResource where ServiceAppointmentId in :saids];
    
    for(AssignedResource ar : assignedResourcesList){
        saidsridmap.put(ar.ServiceAppointmentId,ar.ServiceResourceId);
    }
    
    Map<Id,ServiceResource> srmap = new Map<Id,ServiceResource>([select Curr_Service_Appointment__c , Prev_Service_Appointment__c from ServiceResource where id in :saidsridmap.values()]);
    
    for(Id said : saidsridmap.keySet()){
        ServiceAppointment currsa = Trigger.newmap.get(said);
        ServiceResource currsr = srmap.get(saidsridmap.get(said));
        
        currsr.Prev_Service_Appointment__c = currsr.Curr_Service_Appointment__c;
        currsr.Curr_Service_Appointment__c = currsa.id;
        
        updateServiceResourceList.add(currsr);
    }
    
    update updateServiceResourceList;
}