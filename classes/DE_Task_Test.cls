@isTest
private class DE_Task_Test {
    static testMethod void runTest() {
        // Begin initialization and inserts 
        System.debug('DEBUG TEST: Test Beginning...');
        Activity_Template__c at = new Activity_Template__c();
        at.Name = 'test';
        
        Activity_Template_Task__c att = new Activity_Template_Task__c();
        att.Activity_Name__c = 'test';
        att.Comments__c = 'test';
        att.Due_Date__c = Date.today();
        
        Profile p = [SELECT id, Name FROM Profile where name = 'System Administrator' ].get(0);
        UserRole ur = [SELECT Id,Name FROM UserRole WHERE Name = 'CEO'].get(0);
        
        User tu = new User();
        tu.lastName = 'testUser';
        tu.alias = 'tU';
        tu.email = 'nickedises@gmail.com';
        tu.username = 'tU@dev.demo';
        tu.communityNickname = 'tU';
        tu.TimeZoneSidKey = 'America/Tijuana';
        tu.LocaleSidKey = 'en_US';
        tu.EmailEncodingKey = 'ISO-8859-1';
        tu.LanguageLocaleKey = 'en_US';    
        tu.ProfileId = p.Id;
        tu.UserRoleId = ur.Id;
        
        Account ta = new Account();
        ta.Name = 'testAccount';
        
        
        System.debug('DEBUG TEST: About to begin Test inserts...');
        Test.startTest();
        insert tu;
        System.runas(tu) {
            
            
            PageReference pageRef = Page.DE_taskpick;   
            DE_taskpick taskpick = new DE_taskpick();
            taskpick.createRecords();
            
            insert ta;   
            insert at;    
            att.Activity_Template__c = at.Id;
            insert att;
            System.debug('DEBUG TEST: objects inserted.');
            
            // Handle the building of controllers         
            pageRef = Page.DE_taska;
            pageRef.getParameters().put('id',at.Id);
            Test.setCurrentPage(pageRef);
            System.debug('DEBUG TEST: Test current page set');
         
            DE_taska taska = new DE_taska();
            System.debug('DEBUG TEST: Controllers built');
            
            // start calling methods to test 
            System.debug('DEBUG TEST: Beginning method calls...');
            taska.deleteTasks();
            taska.tz.OwnerId = tu.Id;
            taska.tz.WhatId = ta.Id;
            taska.howz = tu;
            taska.saveUser();
            taska.saveRegion();
            taska.saveRole();
            taska.getRegion();
            
        }
        Test.stopTest();
        System.debug('DEBUG TEST: Test complete.');
    }
}