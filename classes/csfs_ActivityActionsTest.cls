@isTest
private class csfs_ActivityActionsTest {
	
	@isTest static void test_ActivityActions() {
		List<sObject> visitList = new List<sObject>();
		csfs_ActivityActions.updateActivityDate(visitList);

		csfs_visit__c visit = csfs_TestUtils.createVisit();
		visit.csfs_Status__c = 'Completed';
		upsert(visit);
		visitList.add(visit);

		Contact contact = csfs_TestUtils.createContact();
		Task task = csfs_TestUtils.newTask();
		task.Status = 'Completed';
		task.WhoId = contact.Id;
		insert(task);
		visitList.add(task);

		csfs_ActivityActions.updateActivityDate(visitList);
	}
	
}