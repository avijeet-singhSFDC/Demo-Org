public class DE_InitializationScreenCtrl 
{
    public void callInitLatLong()
    {
        system.debug('called');
        List<AssignedResource> arList = [SELECT Id,ServiceAppointmentId,ServiceResourceId FROM AssignedResource];
        Set<Id> srIdSet = new Set<Id>();
        Set<Id> saIdSet = new Set<Id>();
        Map<Id,Id> srsaIdMap = new Map<Id,Id>();
        for(AssignedResource ar:arList)
        {
            srIdSet.add(ar.ServiceResourceId);
            srsaIdMap.put(ar.ServiceResourceId,ar.ServiceAppointmentId);
        }
        for(Id srId:srIdSet)
        {
            saIdSet.add(srsaIdMap.get(srId));
        }
        List<ServiceResource> updateSrList = new List<ServiceResource>();
        List<ServiceResource> srList = [Select Id,LastKnownLatitude,LastKnownLongitude from Serviceresource where Id IN: srIdSet];
        Map<Id,ServiceAppointment> saListMap = new Map<Id,ServiceAppointment>([Select Id,Latitude,Longitude from ServiceAppointment where Id IN:saIdSet]);
        for(ServiceResource sr:srList)
        {
            ServiceAppointment sa = saListMap.get(srsaIdMap.get(sr.Id));
            if (sa.Latitude!=null)    {
            sr.LastKnownLatitude = sa.Latitude + 0.0002;
            }
            if (sa.Longitude!=null)    {
            sr.LastKnownLongitude = sa.Longitude + 0.0002;
            }
            updateSrList.add(sr);
        }
       
        Database.update(updateSrList, false);
    }
    public void callInitNumVals()
    {
        List<ServiceAppointment> saList = [SELECT Id,Distance_travelled_to_reach__c FROM ServiceAppointment WHERE Distance_travelled_to_reach__c = null];
        for(ServiceAppointment sa:saList)
        {
            sa.Distance_travelled_to_reach__c = 0;
        }
        Database.update(saList, false);
        
        List<ServiceResource> srList = [select id, Total_Distance__c  from ServiceResource where Total_Distance__c  = null];
        for(ServiceResource sr : srList){
            sr.Total_Distance__c = 0;
        }
        Database.update(srList, false);
        
    }
    public void callEmptyVals()
    {
        try
        {
            DE_EmptyResourceValues erv = new DE_EmptyResourceValues();
            String sch = '0 0 0 * * *';
            String jobID = system.schedule('Empty Resource Values', sch, erv);
            system.debug('jobId:'+jobID);
        }
        catch(Exception e)
        {
            system.debug('msg:'+e.getMessage());
        }

    }
}