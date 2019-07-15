public class OM_CaseRelatedOrdersCtrl {

    public Case c {get; set;}
    public List<Order> ol {get; set;}
    
    public OM_CaseRelatedOrdersCtrl(ApexPages.StandardController std){
        c = [SELECT AccountId, Id FROM Case WHERE Id = :std.getId()];
        ol = [SELECT AccountId,Id,OrderNumber,TotalAmount FROM Order WHERE AccountId = :c.AccountId ORDER BY CreatedDate DESC NULLS LAST];
        system.debug(ol);
    }
}