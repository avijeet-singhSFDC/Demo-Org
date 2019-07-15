public class FSAutoFollowHelper {
   public static void follow(List<AssignedResource> assignedResources) {
      List<EntitySubscription> follows = new List<EntitySubscription>();
      Set<Id> serviceResourceIds = new Set<Id>();
      Set<Id> serviceAppointmentIds = new Set<Id>();
      for (AssignedResource ar : assignedResources) {
         serviceResourceIds.add(ar.ServiceResourceId);
         serviceAppointmentIds.add(ar.ServiceAppointmentId);
      }
      //load all ServiceResource that are associated with AssignedResource
      Map<Id, ServiceResource> serviceResources = new Map<Id, ServiceResource>([SELECT RelatedRecordId FROM ServiceResource WHERE Id IN :serviceResourceIds]);
      //load all serviceappointment that are associated with AssignedResource
      Map<Id, ServiceAppointment> serviceAppointments = new Map<Id, ServiceAppointment>([SELECT ParentRecordId FROM ServiceAppointment WHERE ParentRecord.Type = 'WorkOrder' AND Id IN :serviceAppointmentIds]);
      for (AssignedResource ar : assignedResources) {
         ServiceResource sr = serviceResources.get(ar.ServiceResourceId);

         EntitySubscription es = new EntitySubscription();
         es.ParentId = ar.ServiceAppointmentId;
         es.SubscriberId = sr.RelatedRecordId;
         //follow serviceappointments
         follows.add(es);
         
         //follow parent workorder only if the user is not following parent workorder already
         ServiceAppointment sa = serviceAppointments.get(ar.ServiceAppointmentId);
         if (sa != null) {
             List<EntitySubscription> existingEs = [SELECT id FROM EntitySubscription WHERE ParentId = :sa.ParentRecordId AND SubscriberId = :sr.RelatedRecordId];
             if (existingEs.size() == 0) {
                 es = new EntitySubscription();
                 es.ParentId = sa.ParentRecordId;
                 es.SubscriberId = sr.RelatedRecordId;
                 follows.add(es);
             }
         }
      }
      insert(follows);
   }

   public static void unfollow(List<AssignedResource> assignedResources) {
      List<EntitySubscription> unfollows = new List<EntitySubscription>();
      Set<Id> serviceResourceIds = new Set<Id>();
      Set<Id> serviceAppointmentIds = new Set<Id>();
      for (AssignedResource ar : assignedResources) {
         serviceResourceIds.add(ar.ServiceResourceId);
         serviceAppointmentIds.add(ar.ServiceAppointmentId);
      }
      //load all ServiceResource that are associated with AssignedResource
      Map<Id, ServiceResource> serviceResources = new Map<Id, ServiceResource>([SELECT RelatedRecordId FROM ServiceResource WHERE Id IN :serviceResourceIds]);
      //load all serviceappointment that are associated with AssignedResource
      Map<Id, ServiceAppointment> serviceAppointments = new Map<Id, ServiceAppointment>([SELECT ParentRecordId FROM ServiceAppointment WHERE ParentRecord.Type = 'WorkOrder' AND Id IN :serviceAppointmentIds]);
      for (AssignedResource ar : assignedResources) {
         ServiceResource sr = serviceResources.get(ar.ServiceResourceId);
         List<EntitySubscription> es = [SELECT Id FROM EntitySubscription WHERE ParentId = :ar.ServiceAppointmentId AND SubscriberId = :sr.RelatedRecordId];
         //unfollow serviceappointment
         unfollows.addAll(es);

        //unfollow parent workorder if the serviceresource is not assigned to any other SA related to the WO.
         ServiceAppointment sa = serviceAppointments.get(ar.ServiceAppointmentId);
         if (sa != null) {
            List<AssignedResource> srs2 = [SELECT AssignedResourceNumber FROM AssignedResource WHERE ServiceAppointmentId IN (Select Id from serviceappointment where parentRecordId = :sa.parentRecordId) AND ServiceResourceId IN (Select id from ServiceResource Where relatedRecordId = :sr.RelatedRecordId)];
            if (srs2.size() == 1) {
                es = [SELECT Id FROM EntitySubscription WHERE ParentId = :sa.parentRecordId AND SubscriberId = :sr.RelatedRecordId];
                unfollows.addAll(es);
            }
         }
      }
      delete(unfollows);
   }
   
   //update scenario. When AR is updated with new SR, old SR unfollow parent records and new SR follow parent records
   public static void updateFollow(Map<Id, AssignedResource> oldArs, List<AssignedResource> newArs){
       List<AssignedResource> toUnfollow = new List<AssignedResource>();
       List<AssignedResource> toFollow = new List<AssignedResource>();
       for(AssignedResource ar: newArs) {
           if (ar.ServiceResourceId != oldArs.get(ar.Id).ServiceResourceId) {
               toUnfollow.add(oldArs.get(ar.Id));
               toFollow.add(ar);
           }
       }
       
       if (toUnfollow.size() > 0) {
           unfollow(toUnfollow);
           follow(toFollow);
       }
   }
}