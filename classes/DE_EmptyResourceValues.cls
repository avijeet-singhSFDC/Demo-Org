global class DE_EmptyResourceValues implements Schedulable
{
    global void execute(SchedulableContext ctx) 
    {
        try
        {
            List<ServiceResource> srList = [Select Id,Curr_Service_Appointment__c,Prev_Service_Appointment__c,Total_Distance__c from ServiceResource limit 10000];
            for(ServiceResource sr:srList)
            {
                sr.Curr_Service_Appointment__c = '';
                sr.Prev_Service_Appointment__c = '';
                sr.Total_Distance__c = 0;
            }
            Database.update(srList,false);
        }
        catch(Exception e)
        {
            system.debug('msg:'+e.getMessage());
        }
    }
}