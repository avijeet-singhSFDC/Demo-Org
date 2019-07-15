@isTest(seeAllData='true')
public class SnapinsPopCaseApexTest {

	public static testMethod void doTest() {
		LiveChatTranscript lct = [SELECT Id FROM LiveChatTranscript LIMIT 1];
		RecordType caseRecordType = [SELECT Id,Name,SobjectType FROM RecordType WHERE SobjectType='Case' LIMIT 1];
		SnapinsPopCaseApex.createMyCase(lct.Id, caseRecordType.Name, 'testing', 'testing');

		SnapinsPopCaseApex.passtheTest();
	}

}