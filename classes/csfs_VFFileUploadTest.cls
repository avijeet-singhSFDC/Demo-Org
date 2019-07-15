@isTest
private class csfs_VFFileUploadTest {
	
	@isTest static void test_File_Upload() {
		Task task = csfs_TestUtils.createTask();
		ApexPages.StandardController ctlr = new ApexPages.StandardController(task);
		csfs_VFFileUpload fu = new csfs_VFFileUpload(ctlr);
		PageReference pr = fu.UploadFile();
		fu.fileName = 'test';
		fu.fileBody = Blob.valueOf('test');
		pr = fu.UploadFile();
	}
}