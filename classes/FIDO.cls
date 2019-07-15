/*
 	* Created by Jesse Chase
 		* jchase@salesforce.com
 			* 11/17/2018.
*/
public class FIDO {
    /** Get Demo Personas User ID **/
	@AuraEnabled
    public static String GetPersonaId(String Name) {
        return [SELECT Id FROM User WHERE Name = :Name Limit 1].Id;
    }
    /** Get Demo Personas Contact ID **/
	@AuraEnabled
    public static String GetContactId(String Name) {
        return [SELECT Id FROM Contact WHERE Name = :Name Limit 1].Id;
    }
    /** Get Demo Personas Contact ID **/
	@AuraEnabled
    public static String lookupAccount(String Name) {
        return [SELECT Id FROM Account WHERE Name = :Name Limit 1].Id;
    }
    /** Get All Pricebooks by Industry **/
	@AuraEnabled
    public static List<PriceBook2> GetPricebookByIndustry(String Industry,String Brand) {
        String b = '%'+Brand+'%';
        return [Select ID, Name FROM PriceBook2 WHERE Name LIKE :b LIMIT 1];
    } 
    /** Get All Pricebooks Entries by Industry **/
	@AuraEnabled
    public static List<PricebookEntry> GetPricebookEntryByIndustry(String PId) {
        return [SELECT Id,Product2.Name,Product2.Image_URL__c, UnitPrice, Product2.ProductCode ,Product2.Description FROM PricebookEntry WHERE Pricebook2.Id = :PId Order By Product2.Name];
    }     
    /** Get Org Id **/
	@AuraEnabled
    public static String GetOrgId() {
        return UserInfo.getOrganizationId(); 
    } 
    /** Send Feedback to Demo Content Owner Via Email **/
    @AuraEnabled 
    public static void emailContentFeedback(String title, String reasonAttr, String unlineDescAttr,String email){
        Id userId = userInfo.getUserId();
        String OwnerEmail = email;
        String ContentTitle = title;
        String UserProfile = [SELECT ID FROM Profile WHERE Name = 'System Administrator'].Id;
        String UserEmail = [SELECT Email FROM User WHERE ProfileId = :UserProfile AND (UserRole.Name = 'CEO') LIMIT 1].Email;
        /* org information */
        String instanceName = [select InstanceName from Organization limit 1].InstanceName;
        Organization org = [SELECT id, Name, PrimaryContact  FROM Organization];
        Id orgId = org.Id;
        String Name = org.Name;
        String PrimContact = org.PrimaryContact;

        String EmailBody;
        String likedisliketext;
        EmailBody = '<h2>Content Feedback</h2>' +
            		'<strong>Demo Content</strong><br/>' +  ContentTitle + '<br/><br/>' + 
            		'<strong>Feedback Reason</strong><br/>' +  reasonAttr + '<br/><br/>' +
            		'<strong>Description</strong><br/>' +  unlineDescAttr + '<br/><br/><hr/>' + 
            		'<h2>Org Details</h2>' +
            		'<strong>Org Details</strong><br/>' +  instanceName + '<br/><br/>' + 
            		'<strong>Id: </strong>' +  orgId + ' | ' +
            		'<strong>Name: </strong>' +  Name + ' | ' +
            		'<strong>User: </strong> ' + PrimContact + ' | ' + 	
        			'<strong>Email: </strong>' + UserEmail;
        
        String EmailSubj = 'Demo Content Feedback | ' + ContentTitle;
        
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.toAddresses = new String[] { OwnerEmail};
        message.optOutPolicy = 'FILTER';
        message.subject = EmailSubj;
        message.htmlBody = EmailBody;
        Messaging.SingleEmailMessage[] messages =   new List<Messaging.SingleEmailMessage> {message};
        Messaging.SendEmailResult[] results = Messaging.sendEmail(messages);
        
        if (results[0].success) {
            System.debug('The email was sent successfully.');
        } else {
            System.debug('The email failed to send: ' + results[0].errors[0].message);
        }
    }
    @AuraEnabled
    public static String getCalloutResponseContents(String endpoint) {
    	String base = 'https://gettingtoknowtheido.herokuapp.com';
        String url = base + endpoint;    

        Http h = new Http();
    
         // Instantiate a new HTTP request, specify the method (GET) as well as the endpoint
        HttpRequest req = new HttpRequest();
        req.setEndpoint(url);
        req.setMethod('GET');
    
        // Send the request, and return a response
        HttpResponse res = h.send(req);
        System.debug('RESPONSE IS: ' + res.getBody());
        return res.getBody();
      }
    
}