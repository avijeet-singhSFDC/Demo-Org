public class ED_PropertiesCT {
    
    @AuraEnabled
    public static Account getEDInfo(String propertyId) {
        
        Account acct = new Account();
        
        try {
            acct = [SELECT Id, Name, Discovery_Outcome__c, Discovery_Explanation__c, Discovery_Prescription__c
                     FROM Account
                     WHERE id =: propertyId];
            
        } catch (Exception e) {
            System.debug('Account: ' + propertyId);
        }
        return acct;
    }

}