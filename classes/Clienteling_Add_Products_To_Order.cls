public class Clienteling_Add_Products_To_Order {
	@AuraEnabled
    public static List<Product2> getProducts() {
        return [SELECT Id, Name, purl__c, Description , MSRP__c FROM Product2 WHERE Enable_in_Mobile_Apps__c = True LIMIT 10];  
    }
    @AuraEnabled
    public static List<Product2> getSingleProducts(String ProdId) {
        return [SELECT Id, Name, purl__c, Description , MSRP__c FROM Product2 WHERE Id = :ProdId];  
    } 
    @AuraEnabled
    public static List<Product2> getFilteredProducts(String SearchPhrase) {
        String sp = '%' + SearchPhrase + '%';
        return [SELECT Id, Name, purl__c, Description , MSRP__c FROM Product2 WHERE (Name LIKE :sp) AND (Enable_in_Mobile_Apps__c = True)];   
    }
    @AuraEnabled
    public static List<OrderItem> addProduct(String OrderId, String ProdId) {  
        
        String OId = OrderId;
		String PId = ProdId;

		String pbookId = [SELECT Pricebook2Id FROM Order WHERE Id = :OId].Pricebook2Id;
		String EntryId = [SELECT Id FROM PricebookEntry WHERE Product2Id = :PId AND (Pricebook2Id = :pbookId)].Id;
		Decimal up = [SELECT UnitPrice FROM PricebookEntry WHERE Product2Id = :PId AND (Pricebook2Id = :pbookId)].UnitPrice;


        OrderItem oi = New OrderItem();
        	oi.Quantity = 1;
        	oi.Product2Id = PId;
            oi.OrderId  = OId;
			oi.PricebookEntryId = EntryId;
			oi.UnitPrice = up;
        	insert oi;  
        
        return [SELECT Product2Id,Quantity FROM OrderItem WHERE OrderId = :OrderId];  
    }
    
}