public with sharing class Q_CreatePurchaseHistoryCase {
  public RecordType rt {get;set;}
  public Case recallCase {get;set;}
  public Product2 superlight {get;set;}
  public Contact rachel {get;set;}

  public Q_CreatePurchaseHistoryCase(ApexPages.StandardController std) {
    rt = [select id, name from recordtype where name = 'Recall'];
    recallCase = [Select id, casenumber from Case where casenumber = '00001852'];
    superlight = [select id, name from product2 where name = 'SUPERLIGHT'];
    rachel = [select id,name from contact where name = 'Rachel Morris'];
  }

  public PageReference CreateCase() {
    

    Case c = new Case();
    c.RecordTypeId = rt.id;
    c.internal_case__c = recallCase.id;
    c.ProductId = superlight.id;
    c.contactId = rachel.id;
    c.subject = 'Product Recall : Superlight';
    c.EntitlementId = '55080000001huOJ';
    insert c;

    PageReference casePage = new PageReference('/' + c.id ); // + '/e'?retUrl=%2F' + c.id + '%2F
    casePage.setRedirect(true);
    return casePage;

  }
}