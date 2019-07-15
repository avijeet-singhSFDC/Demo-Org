public class Cust360 {
    //Get CloudCraze Order Total
	@AuraEnabled
    public static Decimal GetCCOrders(String contactId) {
        Decimal total = 0;
        ccrz__E_Order__c [] ccOrders = [SELECT ccrz__TotalAmount__c FROM ccrz__E_Order__c  WHERE ccrz__Contact__c = :contactId];
        for(ccrz__E_Order__c c: ccOrders) {
            total += c.ccrz__TotalAmount__c ;
        }
        return total;
    }
    //Get Order Total
	@AuraEnabled
    public static Decimal GetOrders(String contactId) {
        Decimal total = 0;
        Order[] Orders = [SELECT TotalAmount FROM Order WHERE BillToContactId  = :contactId];
        for(Order o: Orders) {
            total += o.TotalAmount ;
        }
        return total;
    }
    //Get Account Order Total
	@AuraEnabled
    public static Decimal GetPersonAccountOrders(String contactId) {
        Decimal total = 0;
        Order[] Orders = [SELECT Id, Name,TotalAmount FROM Order WHERE AccountId = :contactId];
        for(Order o: Orders) {
            total += o.TotalAmount ;
        }
        return total;
    }
}