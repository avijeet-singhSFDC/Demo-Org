/**
* @author Salesforce.com
* @date 2016
*
* @description Utility class that keeps track of the last activity date for a Contact
*              based on the related Task and csfs_Visit__c objects
*/
public with sharing class csfs_ActivityActions {

    public static void updateActivityDate(List<sObject> newList) {
        Map<Id, Datetime> activityMap = new Map<Id, Datetime>();

        for (sObject so : newList) {
            Map<String, Object> fieldsToValue = so.getPopulatedFieldsAsMap();

            if (fieldsToValue.keySet().contains('csfs_Contact__c') &&
                fieldsToValue.keySet().contains('csfs_Status__c') &&
                fieldsToValue.get('csfs_Status__c') == 'Completed' &&
                so.getSObjectType() == Schema.csfs_Visit__c.getSObjectType()) {

                activityMap.put((Id)fieldsToValue.get('csfs_Contact__c'), System.now());
            }

            if (fieldsToValue.keySet().contains('WhoId') &&
                fieldsToValue.keySet().contains('Status') &&
                fieldsToValue.get('Status') == 'Completed' &&
                so.getSObjectType() == Schema.Task.getSObjectType()) {

                Id whoID = (Id)fieldsToValue.get('WhoId');

                if (whoID.getSObjectType() == Schema.Contact.getSObjectType()) {
                    activityMap.put((Id)fieldsToValue.get('WhoId'), System.now());
                }
            }
        }

        if (!activityMap.keySet().isEmpty()) {
            List<Contact> toUpdate = new List<Contact>();

            for (Id contactID : activityMap.keySet()) {
                toUpdate.add(new Contact(Id=contactID, csfs_LastActivityDate__c=activityMap.get(contactID)));
            }

            update toUpdate;
        }
    }
}