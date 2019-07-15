@isTest
public class OpportunityProductsCtrlTest {
    public static testmethod void testGetProducts(){
        Id pricebookId = Test.getStandardPricebookId();
        
        Account objAcc = new Account(Name ='Test Person');
        insert objAcc;
        Opportunity objOpp = new Opportunity(Name='Test Opp1' ,  AccountId= objAcc.Id,StageName = 'Prospecting', 
                                           CloseDate = Date.today(),PriceBook2Id = pricebookId);
        insert objOpp;
        
        //Create product
        Product2 objProd = new Product2(
            Name = 'Product 1',
            ProductCode = 'Pro-1',
            isActive = true
        );
        insert objProd;
        
        //Create pricebook entry
        PricebookEntry pbEntry = new PricebookEntry(
            Pricebook2Id = pricebookId,
            Product2Id = objProd.Id,
            UnitPrice = 100.00,
            IsActive = true
        );
        insert pbEntry;
        
        List<OpportunityProductsCtrl.WrapperOpportunityProducts> lstWrapOpProd = OpportunityProductsCtrl.getProducts(objOpp.Id,'');
        lstWrapOpProd = OpportunityProductsCtrl.getProducts(objOpp.Id,'Product');
        List<OpportunityProductsCtrl.WrapperOpportunityProducts> lstSelectedProd = new List<OpportunityProductsCtrl.WrapperOpportunityProducts>();
        for(OpportunityProductsCtrl.WrapperOpportunityProducts objWOP:lstWrapOpProd){
            OpportunityProductsCtrl.WrapperOpportunityProducts obj1WOP = new OpportunityProductsCtrl.WrapperOpportunityProducts(objWOP.bSelect,
            objWOP.sId,objWOP.sProductName,
            objWOP.sProductCode,objWOP.sDescription,
            objWOP.sUnitPrice,10,Date.today());
            lstSelectedProd.add(obj1WOP);  
        }
        String sSelectedProds = JSON.serialize(lstSelectedProd);
        OpportunityProductsCtrl.createOpportunityProducts(objOpp.Id, sSelectedProds);
    }
}