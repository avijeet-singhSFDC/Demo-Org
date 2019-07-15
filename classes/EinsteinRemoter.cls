global with sharing class EinsteinRemoter {

    public String accountName { get; set; }
    public static Account account { get; set; }
    public EinsteinRemoter() { } // empty constructor
    
    @RemoteAction
    global static void updateCase(String caseId) {
        Case myCase = [select case.casenumber from case where id=:caseId limit 1];
        myCase.priority = 'High';
        myCase.type = 'Product Support';
        
        update myCase;
    }
}