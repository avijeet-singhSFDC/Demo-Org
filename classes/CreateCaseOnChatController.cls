public with sharing class CreateCaseOnChatController {
	
    @AuraEnabled
    public static LiveChatTranscript getLiveChatTranscript (Id id) {
        LiveChatTranscript liveChat = [SELECT ChatKey, Id FROM LiveChatTranscript WHERE Id = :id];
        return liveChat;
    }
    
    @AuraEnabled
    public static Case createCase (String chatKey, String email) {
        Case newCase = new Case();
        newCase.SCQuickSetup__chatKey__c 	= chatKey;
        newCase.Status 						= 'New';
        newCase.Type 						= 'Other';
        newCase.Origin 						= 'Live Agent';
        newCase.RecordTypeId				= getRecordType().Id;
        
        if (String.isBlank(email)) {
            newCase.Subject = 'Chat create by ....';
        } else {
            List<Contact> contacts = getContact(email);
            if (contacts.size() > 0) {
                newCase.Subject = 'Chat create by ' + contacts[0].Name;
                newCase.ContactId = contacts[0].Id;
            } else {
                newCase.Subject = 'Chat create by ' + email;
            }
        }
        insert newCase;
        return newCase;
    }
    
    private static RecordType getRecordType() {
		List<RecordType> recordTypes = [SELECT Id,Name,SobjectType FROM RecordType WHERE SobjectType = 'Case' AND Name = 'Chat Live Agent'];
        return recordTypes[0];
    }
    
    private static List<Contact> getContact(String email) {
        return [SELECT Id, Name FROM Contact WHERE email = :email];
    }
}