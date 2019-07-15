@isTest
private class csfs_ImageUploadTest {    

    @isTest static void test_Image_Upload() {
        csfs_Promotion__c promotion = csfs_TestUtils.createPromotion();
        ApexPages.StandardController ctlr = new ApexPages.StandardController(promotion);
        csfs_ImageUpload iu = new csfs_ImageUpload(ctlr);
        PageReference pr = iu.UploadFile();
        iu.fileName = 'test';
        iu.fileBody = Blob.valueOf('test');
        pr = iu.UploadFile();
    }

}