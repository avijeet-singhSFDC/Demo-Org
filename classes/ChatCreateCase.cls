public without sharing class ChatCreateCase { 

    public String email {get;set;}
    public String chatkey {get;set;}
    public String caseId{get;set;}
    public String caseNumber{get;set;}
    
    public PageReference loadCaseByKey () {
        System.debug(chatkey);
        
        List<Case> cases = [Select Id, CaseNumber From Case Where SCQuickSetup__chatKey__c =: this.chatkey ];
        
        if(cases.size() == 0) {
            Case newCase        = new Case();
            newCase.Status      = 'New';
            newCase.Type        = 'Other';
            newCase.SCQuickSetup__chatKey__c  = this.chatkey;     
            newCase.Origin = 'Live Agent';
            newCase.OwnerId = UserInfo.getUserId();
            
            List<RecordType> records = [SELECT Id,Name,SobjectType FROM RecordType WHERE SobjectType = 'Case' AND Name = 'Chat Live Agent'];
            newCase.recordTypeId = records[0].id;
            
            if (String.isEmpty(this.email)) {
                newCase.Subject = 'Chat create by ....';
            } else {
                List<Contact> contacts = [SELECT Id, Name FROM Contact Where email =:this.email];
                if (contacts.size() > 0) {
                   newCase.ContactId = contacts[0].Id;
                   newCase.Subject = 'Chat create by ' + contacts[0].Name;
                   
                } else {
                   newCase.Subject = 'Chat create by ' + this.email;
                }
            }
            insert newCase;
            cases = [Select Id, CaseNumber From Case Where SCQuickSetup__chatKey__c =: this.chatkey ];
        } 
        
        if (cases.size() > 0){
            this.caseNumber =cases[0].CaseNumber;
            this.caseId = cases[0].id;
        }
        
        return null;
    }
}