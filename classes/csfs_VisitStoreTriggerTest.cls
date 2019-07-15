@isTest
private class csfs_VisitStoreTriggerTest {
	
	@isTest static void test_insert_update_Visit() {
		csfs_Visit__c visit = csfs_TestUtils.createVisit();
		visit.csfs_Notes__c = 'test note';
		upsert(visit);
	}
	
}