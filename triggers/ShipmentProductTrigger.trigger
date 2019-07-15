trigger ShipmentProductTrigger on Shipment__c (after insert) {
    for (Shipment__c shipment : trigger.new) {
        if (shipment.Include_All_Order_Items__c) {
            // get the Opportunity/order
            Opportunity oppty = [select o.Id, o.AccountId from Opportunity o where o.Id = :shipment.Order__c limit 1];
            
            // get the Opportunity/Order products
            List<OpportunityLineItem> lineItems = [select li.OpportunityId from OpportunityLineItem li where li.OpportunityId = :oppty.Id];
            
            // Connect these line items to the shipment
            if (lineItems != null) {
                for (OpportunityLineItem item : lineItems) {
                    item.Shipment__c = shipment.Id;
                    update item;
                }
            }
        }
    }
}