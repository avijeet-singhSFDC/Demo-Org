public class OpportunityProductsCtrl {
	
    @auraEnabled
    public static List<WrapperOpportunityProducts> getProducts(String oppId, String searchKeyword){
        List<WrapperOpportunityProducts> lstWrapperOppProducts = new List<WrapperOpportunityProducts>();
        List<Opportunity> lstOpportunity = [SELECT Id, PriceBook2Id FROM Opportunity WHERE Id=:oppId];
        String sPriceBook = lstOpportunity[0].PriceBook2Id;
        String sQuery;
        List<PriceBookEntry> lstPBE = new List<PriceBookEntry>();
        if(String.isEmpty(searchKeyword)){
        	sQuery = 'SELECT Id, Product2Id, UnitPrice, Product2.ProductCode, Product2.Name, Product2.Description, Product2.purl__c, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: sPriceBook';
        }else{
            searchKeyword = '%'+searchKeyword+'%';
            System.debug('searchKeyword:::'+searchKeyword);
            sQuery = 'SELECT Id, Product2Id, UnitPrice, Product2.ProductCode, Product2.Name, Product2.Description, Product2.purl__c, PriceBook2Id '+ 
                	+'FROM PriceBookEntry WHERE PriceBook2Id =: sPriceBook AND Product2.Name LIKE \''+searchKeyword+'\'';
        }
        lstPBE = Database.query(sQuery);//[SELECT Id, Product2Id, UnitPrice, Product2.ProductCode, Product2.Name, Product2.Description, Product2.purl__c, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: lstOpportunity[0].PriceBook2Id];
        System.debug('lstPBE::'+lstPBE);
        if(lstPBE != null && lstPBE.size() > 0){
            for(PriceBookEntry pbe : lstPBE){
                lstWrapperOppProducts.add(
                    new WrapperOpportunityProducts(
                        false,
                        pbe.Id,
                        pbe.Product2.Name,
                        pbe.Product2.ProductCode,
                        pbe.Product2.Description,
                        pbe.UnitPrice
                    )
                );
            }
        }
        return lstWrapperOppProducts;
    }
    @auraEnabled
    public static void createOpportunityProducts(String oppId, String listOfProductsString){
        List<OpportunityLineItem> lstToInsertOLI = new List<OpportunityLineItem>();
        List<WrapperOpportunityProducts> listOfProducts = (List<WrapperOpportunityProducts>)JSON.deserialize(listOfProductsString, List<WrapperOpportunityProducts>.class);
        
        System.debug('::listOfProducts::'+listOfProducts);
        if(listOfProducts != null && listOfProducts.size() > 0){
            for(WrapperOpportunityProducts wOP:listOfProducts){
                OpportunityLineItem objOLI = new OpportunityLineItem();
                objOLI.Description = wOP.sDescription;
                objOLI.UnitPrice = wOP.sUnitPrice;
                objOLI.Quantity = wOP.sQuantity;
                objOLI.ServiceDate = wOp.sDate;
                objOLI.PricebookEntryId = wOP.sId;
                objOLI.OpportunityId = oppId;
                lstToInsertOLI.add(objOLI);
            }
        }
        if(lstToInsertOLI != null && lstToInsertOLI.size() > 0){
            insert lstToInsertOLI;
        }
    }
    
    public class WrapperOpportunityProducts{
        @auraEnabled
        public boolean bSelect{get;set;}
       	@AuraEnabled
        public String sId{get;set;}
        @AuraEnabled
        public String sProductName{get;set;}
        @AuraEnabled
        public String sProductCode{get;set;}
        @AuraEnabled
        public String sDescription{get;set;}
        @AuraEnabled
        public Decimal sUnitPrice{get;set;}
        @AuraEnabled
        public Decimal sQuantity{get;set;}
        @AuraEnabled
        public Date sDate{get;set;}
        public WrapperOpportunityProducts(boolean bSelect, String sId, String sProductName, String sProductCode, String sDescription, Decimal sUnitPrice){
            this.bSelect = bSelect;
            this.sId = sId;
            this.sProductName = sProductName;
            this.sProductCode = sProductCode;
            this.sDescription = sDescription;
            this.sUnitPrice = sUnitPrice;
        }
        
        public WrapperOpportunityProducts(boolean bSelect, String sId, String sProductName, String sProductCode, String sDescription, Decimal sUnitPrice, Decimal sQuantity, Date sDate){
            this.sId = sId;
            this.sProductName = sProductName;
            this.sProductCode = sProductCode;
            this.sDescription = sDescription;
            this.sUnitPrice = sUnitPrice;
            this.sQuantity = sQuantity;
            this.sDate = sDate;
        }
    }
}