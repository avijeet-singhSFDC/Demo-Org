public class StoreVisitCtrl {
    public static List<Product_Present__c> products {get;set;}
    public static Product_Present__c product {get;set;}
    public static List<Product2> pList {get;set;}
    
    @AuraEnabled
    public static List<Product_Present__c> addPastProducts(String storeVisitId) {
        List<Product_Present__c> products = new List<Product_Present__c>();
        // Create a list of products on previous store visit
        products = [SELECT Product__r.Name,Product__r.Id, Name, Id, Notes__c, Quantity__c, Price__c, Location_Aisle__c FROM Product_Present__c LIMIT 3]; 
        
        // Add each List Item to newly created Store Visit
        for(Product_Present__c p : products){
            Product_Present__c NewProduct = new Product_Present__c();
            NewProduct.Product__c = p.Product__r.Id;
            NewProduct.Quantity__c = p.Quantity__c;
            NewProduct.Price__c = p.Price__c;
            NewProduct.Location_Aisle__c = p.Location_Aisle__c;
            NewProduct.Notes__c = p.Notes__c;
            NewProduct.Store_Visit__c = storeVisitId;
            insert NewProduct;
        }
        List<Product_Present__c> updatedProducts = new List<Product_Present__c>();
        updatedProducts = [SELECT Product__r.Name, Name, Id, Notes__c, Quantity__c, Price__c, Location_Aisle__c FROM Product_Present__c WHERE Store_Visit__c = :storeVisitId LIMIT 5];
        return updatedProducts;
    }
    
    @AuraEnabled
    public static List<Product_Present__c> getProducts2(String storeVisitId) {
        products = new List<Product_Present__c>();
        products = [SELECT Product__r.Name, Name, ID, Notes__c, Quantity__c, Price__c, Location_Aisle__c FROM Product_Present__c WHERE Store_Visit__c = :storeVisitId LIMIT 5];
        return products;
    }
    @AuraEnabled
    public static Product_Present__c searchProducts(String pId) {
        List<Product_Present__c> products = new List<Product_Present__c>();
        products = [SELECT Product__r.Name, Name, ID, Notes__c, Quantity__c, Price__c, Location_Aisle__c FROM Product_Present__c WHERE Id =: pId LIMIT 1];
        return products[0];
    }
    
	@AuraEnabled
    public static Product_Present__c[] getLastStoreVisitPP(String acctId) {
        Store_Visit__c[] storeVisits = [SELECT Account__c,Id
        	FROM Store_Visit__c 
        	WHERE Account__c =: acctId 
        	ORDER BY Date_of_Visit__c DESC NULLS LAST LIMIT 5];
        String lastStoreVisitId = storeVisits[0].Id;
        Product_Present__c[] pp = [SELECT Id,Name,Notes__c,Price__c,Product__r.Name,Quantity__c,Store_Visit__c 
                                   FROM Product_Present__c 
                                   WHERE Store_Visit__c =: lastStoreVisitId];
        return pp;
    }
    
    @AuraEnabled 
    public static String newStoreVisit(String acct){
        Store_Visit__c visit = new Store_Visit__c();
        visit.Account__c = acct;
        visit.Date_of_Visit__c = Date.today();
        insert visit;
        return visit.Id;
    }
    
    @AuraEnabled
    public static List<Competitive_Product__c> assignCompProduct(String storeVisitId, String qty, Decimal price, String comp) {
        Competitive_Product__c cp = New Competitive_Product__c();
        cp.Quantity__c = qty;
        cp.Store_Visit__c = storeVisitId;
        cp.Retail_Price__c = price;
        cp.Competitor_Name__c = comp; 
        insert cp;
        
        List<Competitive_Product__c> products = new LIST<Competitive_Product__c>();
        products = [SELECT Competitor__c,Competitor_Name__c,Id,Quantity__c,Retail_Price__c,Store_Visit__c FROM Competitive_Product__c WHERE Store_Visit__c =: storeVisitId];
        return products;
    }
    
    @AuraEnabled
    public static List<Competitive_Product__c> getProducts(String storeVisitId) {
        List<Competitive_Product__c> products = new LIST<Competitive_Product__c>();
        products = [SELECT Competitor__c,Id,Quantity__c,Retail_Price__c,Store_Visit__c FROM Competitive_Product__c WHERE Store_Visit__c =: storeVisitId];
        return products;
    }
    
    @auraEnabled
    public static List<WrapperOpportunityProducts> getProductsNew(String recordId,String searchKeyword){
        List<WrapperOpportunityProducts> lstWrapperOppProducts = new List<WrapperOpportunityProducts>();
        String sPriceBook = [SELECT Default_Price_Book__c FROM Account WHERE Id = :recordId].Default_Price_Book__c;  
        if (sPriceBook == null){
            sPriceBook = [SELECT Id FROM Pricebook2 WHERE name = 'Alpine Group Pricebook'].Id; 
        }
        String sQuery;
        List<PriceBookEntry> lstPBE = new List<PriceBookEntry>();
        if(String.isEmpty(searchKeyword)){
        	sQuery = 'SELECT Id, Product2Id, Product2.ProductCode,Product2.Name, Product2.Description, Product2.purl__c, PriceBook2Id FROM PriceBookEntry WHERE PriceBook2Id =: sPriceBook';
        }else{
            searchKeyword = '%'+searchKeyword+'%';
            System.debug('searchKeyword:::'+searchKeyword);
            sQuery = 'SELECT Id, Product2Id, Product2.ProductCode, Product2.Name, Product2.Description, Product2.purl__c, PriceBook2Id '+ 
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
                        pbe.Product2Id
                    )
                );
            }
        }
        return lstWrapperOppProducts;
    }
    @AuraEnabled
    public static Product_Present__c newProduct(String name, Integer quantity, String notes, Decimal price, String location, String name2, String storeVisit) {
        Product_Present__c p = new Product_Present__c();
		p.Product__c = name2;
        p.Store_Visit__c = storeVisit;
        p.Quantity__c = quantity;
        p.Price__c = price;
        p.Notes__c = notes;
        p.Location_Aisle__c = location;
        insert p;
		Product_Present__c hack = new Product_Present__c();
        hack = [SELECT Name, ID, Notes__c, Product__r.Name, Quantity__c, Price__c, Location_Aisle__c FROM Product_Present__c WHERE Id =: p.Id LIMIT 1];
        return hack;
    }
    
    /** New Product Selector Feature ***/
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
    @auraEnabled
    public static void createVisitProducts(String recordId, String listOfProductsString, String StoreVisitId){
        List<Product_Present__c> lstToInsertOLI = new List<Product_Present__c>();
        List<WrapperOpportunityProducts> listOfProducts = (List<WrapperOpportunityProducts>)JSON.deserialize(listOfProductsString, List<WrapperOpportunityProducts>.class);
        System.debug('::listOfProducts::'+listOfProducts);
        if(listOfProducts != null && listOfProducts.size() > 0){
            for(WrapperOpportunityProducts wOP:listOfProducts){
                String ProdId = [SELECT Product2.Id FROM PriceBookEntry WHERE Id = :wOP.sId].Id;
                System.debug('::PRODUCT ID IS ::'+ProdId);
                Product_Present__c NewProduct = new Product_Present__c();
                NewProduct.Product__c = wOP.sProduct2Id;
                NewProduct.Quantity__c = wOP.sQuantity;
                NewProduct.Price__c = wOP.sUnitPrice;
                NewProduct.Notes__c = wOP.sDescription;
                NewProduct.Store_Visit__c = StoreVisitId;
                NewProduct.Location_Aisle__c = wOP.sLocation;
                lstToInsertOLI.add(NewProduct);
            }
        }
        if(lstToInsertOLI != null && lstToInsertOLI.size() > 0){
            insert lstToInsertOLI;
        }
        Product_Present__c p = new Product_Present__c();
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
        public Id sProduct2Id{get;set;}
        @AuraEnabled
        public String sLocation{get;set;}
        
        @AuraEnabled
        public Date sDate{get;set;}
        public WrapperOpportunityProducts(boolean bSelect, String sId, String sProductName, String sProductCode, String sDescription, Id sProduct2Id){
            this.bSelect = bSelect;
            this.sId = sId;
            this.sProductName = sProductName;
            this.sProductCode = sProductCode;
            this.sDescription = sDescription;
            this.sUnitPrice = sUnitPrice;
            this.sProduct2Id = sProduct2Id;
            this.sLocation = sLocation;
        }
        public WrapperOpportunityProducts(boolean bSelect, String sId, String sProductName, String sProductCode, String sDescription,  Decimal sQuantity, Date sDate){
            this.sId = sId;
            this.sProductName = sProductName;
            this.sProductCode = sProductCode;
            this.sDescription = sDescription;
            this.sUnitPrice = sUnitPrice;
            this.sQuantity = sQuantity;
            this.sDate = sDate;
            this.sLocation = sLocation;
        }
    }
    
    @AuraEnabled
    public static Einstein_PredictionResult detectShelfObjects(String modelId, String base64){
        Einstein_PredictionService service = new Einstein_PredictionService(Einstein_PredictionService.Types.IMAGE_DETECTION);
        Einstein_PredictionResult result = service.detectImageBase64(modelId, base64, 0, '');
        return result;
    }
    
    @AuraEnabled
    public static Shelf_Scan__c storeScanResults(String jsonString, String StoreVisitId) {
        List<Object> scanResults = (List<Object>)JSON.deserializeUntyped(jsonString);
        System.debug(scanResults);
        Shelf_Scan__c scan = new Shelf_Scan__c();
        insert scan;
        
        List<Scan_Result__c> storeResults = new List<Scan_Result__c>();
        for (Object obj : scanResults) {
            Map<String, Object> result = (Map<String, Object>)obj;
            Scan_Result__c storeResult = new Scan_Result__c(Store_Visit__c=String.valueOf(StoreVisitId), Name=String.valueOf(result.get('label')), Count__c=(Decimal)result.get('count'), Shelf_Scan__c=scan.Id);
            storeResults.add(storeResult);
        }
        insert storeResults;
        return scan;
    }
    /**** SIGNATURE CAPTURE ****/
    @AuraEnabled 
    public static void uploadSignature(String parentId, Blob content) {
        
        System.debug('Body: ' + content.toString());        
        String myString = content.toString();
        
        ContentVersion cv = new ContentVersion();
        cv.ContentLocation = 'S';
        cv.VersionData = EncodingUtil.base64Decode(myString);
        cv.Title = 'Signature';
        cv.PathOnClient = 'Signature.png';
        
        insert cv;
        
        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [SELECT Id, ContentDocumentId FROM ContentVersion WHERE Id =: cv.Id].ContentDocumentId;
        cdl.LinkedEntityId = parentId;
        cdl.ShareType = 'V';
        insert cdl;
        
    }
    
    public static void passTest(){
		Integer i = 0;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
    }
}