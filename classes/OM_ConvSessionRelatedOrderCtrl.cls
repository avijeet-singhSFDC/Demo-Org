public class OM_ConvSessionRelatedOrderCtrl {
    public LiveText__Conversation_Session__c c {get; set;}
    public List<Order> ol {get; set;}
    
    public OM_ConvSessionRelatedOrderCtrl(ApexPages.StandardController std){
        
        ol = [SELECT AccountId,Id,OrderNumber,TotalAmount FROM Order WHERE AccountId = '0014600000Xabqo' ORDER BY CreatedDate DESC NULLS LAST];
        system.debug(ol);
    }
}