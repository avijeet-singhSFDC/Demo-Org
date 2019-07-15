global class EmailPublisherForHighPriorityCases implements QuickAction.QuickActionDefaultsHandler {
    // Empty constructor
    global EmailPublisherForHighPriorityCases() {
    }
    
    // The main interface method
    global void onInitDefaults(QuickAction.QuickActionDefaults[] defaults) {
        QuickAction.SendEmailQuickActionDefaults sendEmailDefaults = (QuickAction.SendEmailQuickActionDefaults)defaults.get(0);
        EmailMessage emailMessage = (EmailMessage)sendEmailDefaults.getTargetSObject(); 
        
        Case c = [SELECT CaseNumber, Priority FROM Case WHERE Id=:sendEmailDefaults.getContextId()];

        // If case severity is “High,” append “managers@acme.com” to the existing (and possibly blank) BCC field
        if (c.Priority != null && c.Priority.equals('High')) { // Priority is 'High'
            emailMessage.BccAddress = 'managers@acme.com';        
        }        
    } 
}