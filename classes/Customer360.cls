/*
 	* Created by Jesse Chase
 		* jchase@salesforce.com
 			* 11/29/2018.
*/
public class Customer360 {
	//Get Contact Details //
    @AuraEnabled
    public static list<Contact> GetContactInfo(String contactId) {
        return [SELECT Name,Tier__c ,Tier_Status__c ,Cust360_CSAT__c,Cust360_Id__c,myNTO_Status__c,Total_Order_Amount__c,
                Profile_Image_URL__c,Cust360_ChurnRisk__c,MailingCity,MailingState FROM Contact WHERE Id = :contactId];
    }
    //Get Person Account Details //
    @AuraEnabled
    public static list<Account> GetPAInfo(String contactId) {
        return [SELECT Name,Cust360_CSAT__pc,Cust360_ChurnRisk__pc,Profile_Image_URL__pc ,Cust360_Id__pc,ShippingCity,ShippingState,Tier__c, Tier__pc  FROM Account WHERE Id = :contactId];
    }
    //Get Contact from Case //
    @AuraEnabled
    public static list<Contact> GetContactInfoFromCase(String contactId) {
        String cId = [SELECT ContactId FROM Case  WHERE Id = :contactId].ContactId;
        return [SELECT Name,Tier__c ,Tier_Status__c ,Cust360_CSAT__c,Cust360_Id__c,myNTO_Status__c,Total_Order_Amount__c ,Profile_Image_URL__c,Cust360_ChurnRisk__c,MailingCity,MailingState FROM Contact WHERE Id = :cId];
    }
    //Get Contact from Chat //
    @AuraEnabled
    public static list<Contact> GetContactInfoFromChat(String contactId) {
        String cId = [SELECT ContactId FROM LiveChatTranscript  WHERE Id = :contactId].ContactId;
        return [SELECT Name,Tier__c ,Tier_Status__c ,Cust360_CSAT__c,Cust360_Id__c,myNTO_Status__c,Total_Order_Amount__c ,Profile_Image_URL__c,Cust360_ChurnRisk__c,MailingCity,MailingState FROM Contact WHERE Id = :cId];
    }

    //Get Order total for Contact //
	@AuraEnabled
    public static Decimal GetOrderTotals(String contactId,String ObjType) {
        System.debug('Contact Id sent to Apex: ' + contactId);
        Decimal total = 0;
        if(ObjType == 'Case'){
            String CaseCId = [SELECT ContactId FROM Case WHERE Id = :contactId].ContactId;
        	Order[] ords = [SELECT TotalAmount FROM Order WHERE BillToContactId = :CaseCId]; 
            for(Order o: ords) {
                total += o.TotalAmount ;
            }
            ccrz__E_Order__c [] ccOrders = [SELECT ccrz__TotalAmount__c FROM ccrz__E_Order__c  WHERE ccrz__Contact__c = :CaseCId];
            for(ccrz__E_Order__c c: ccOrders) {
                total += c.ccrz__TotalAmount__c ;
            }
        }else{
            Order[] ords = [SELECT TotalAmount FROM Order WHERE BillToContactId = :contactId OR AccountId = :contactId];
            for(Order o: ords) {
                total += o.TotalAmount ;
            }
            ccrz__E_Order__c [] ccOrders = [SELECT ccrz__TotalAmount__c FROM ccrz__E_Order__c  WHERE ccrz__Contact__c = :contactId];
            for(ccrz__E_Order__c c: ccOrders) {
                total += c.ccrz__TotalAmount__c ;
            }
        }
        return total;
    }
}