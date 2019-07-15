@isTest(SeeAllData=true)
private class TestisActiveBefore {
	@isTest static void TestisActiveBefore() {
		openCTIconfig__c cti = new openCTIconfig__c();

		cti.Account__c = '001f4000002zwYBAAY';
		cti.AccountName__c = 'United Partners';
		cti.Contact__c = '003f40000023LCZAA2';
		cti.ContactName__c = 'Lauren Boyle';
		cti.isActive__c = true;
		cti.Phone__c = '55555555';
		cti.Title__c = 'CEO';

		Test.startTest();

		insert cti;

		Test.stopTest();


	}
}