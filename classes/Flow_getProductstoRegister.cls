public class Flow_getProductstoRegister {
	@AuraEnabled 
	public static List<Product2> getProduct() {
        List<String> ProductList = new List<String>();
        List<Product2> products = new LIST<Product2>();  
        products=[Select Name,Id, purl__c  from Product2 WHERE Available_to_Register__c = TRUE ORDER BY Name DESC]; 
        return products; 
    }
}