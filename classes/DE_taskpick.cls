public with sharing class DE_taskpick {
    public List <Activity_Template__c> MyTempz {get;set;}
 
    public DE_taskpick() {
        MyTempz = [SELECT CreatedDate,Id,Name FROM Activity_Template__c];
    }
    
    public PageReference createRecords() {
        PageReference pageRef = null;
        // If the list is empty we need to create the necessary objects...
        if( [SELECT Count() FROM Activity_Template__c] < 1 ) {
        
            Activity_Template__c template1 = new Activity_Template__c();
            template1.Name = 'New Promotion';
            insert template1;
            Activity_Template__c template2 = new Activity_Template__c();
            template2.Name = 'New Store Steup';
            insert template2;
            
            createATT('Execute on Corporate Communication #367', 'Badge employees for excellence in execution, driving sales, customer assistance, etc.', '8/16/2015', template1.Id);
            createATT('Inventory Rollout in New Display', 'Post completed Planogram picture back to Corporate Chatter Group', '9/8/2015', template1.Id);
            createATT('Hang Promotional Signage', 'in front of displays, window signage if applicable', '9/11/2015', template1.Id);
            createATT('Review Pricing Kit', 'confirm new pricing is loaded into POS system', '9/6/2015', template1.Id);
            createATT('Review New Promotion Bulletin from Corporate', 'this will include planogram, promotional discounts, marketing collateral for Social posts, and new signage', '9/5/2015', template1.Id);
            createATT('Chatter Post to Store Associates', 'inform associates about promotion (dates, discounts, focus items, etc)', '8/23/2015', template1.Id);
            createATT('Build Out Display(s)', 'managed from the planogram provided from corporate', '9/6/2015', template1.Id);
            createATT('Post Promotion to Store Social Outlets', 'Facebook, Twitter, Pinterest, Linkedin', '8/16/2015', template1.Id);
            createATT('Setup Social Store Presence', 'setup social accounts on Facebook, Twitter, LinkedIn for promotional activities', '9/5/2015', template2.Id);
            createATT('Arrange Clothes', 'setup clothes on new rack displays', '9/7/2015', template2.Id);
            createATT('Setup Rack Displays', 'upon receiving the rack displays for clothes, they need to be setup in the store', '9/6/2015', template2.Id);
            
            pageRef = ApexPages.currentPage();
            
        }
        return pageRef;
    }
    
    public void createATT(String name, String comments, String dateString, String template) {
        Activity_Template_Task__c newATT = new Activity_Template_Task__c();
        newATT.Activity_Name__c = name;
        newATT.Comments__c = comments;
        newATT.Due_Date__c = date.parse(dateString);
        newATT.Activity_Template__c = template;
        insert newATT;
    }
}