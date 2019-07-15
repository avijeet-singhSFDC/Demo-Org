public class Q_DFPurchaseReset {
    public Id p {get;set;}
    public Q_DFPurchaseReset(ApexPages.StandardController controller) {
        p = controller.getId();
    }
    public PageReference resetDemo(){
        List<Purchase_Item__c> pl = [SELECT Id, Name, Product__c, Recall__c, Product__r.Name FROM Purchase_Item__c WHERE Purchase_History__c =: p];
        List<Case> cl = [SELECT Id, ProductId FROM Case WHERE Product.Name =: 'SUPERLIGHT'];
        List<Purchase_Item__c> updatePI = new List<Purchase_Item__c>();
        List<Purchase_Item__c> deletepi = new List<Purchase_Item__c>();
        for(Purchase_Item__c pi : pl){
            if(pi.Recall__c == true){
                pi.Status__c = 'Completed';
                updatePI.add(pi);
            }
            if(pi.Product__r.Name == 'BLUE KAZOO'){
                deletePI.add(pi);
            }
        }
        update updatePI;
        delete cl;
        delete deletePI;
        return new PageReference('/' + p);
    }
}