trigger ShipmentAccountTrigger on Shipment__c (before insert) {
    for (Shipment__c shipment : trigger.new) {
        // associate the shipment with the end customer
        Opportunity oppty = [select o.Id, o.AccountId from Opportunity o where o.Id = :shipment.Order__c limit 1];
        shipment.End_Customer__c = oppty.AccountId;
    }
}