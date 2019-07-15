public with sharing class Q_NTOSurvey {
    private Network surveyCommunity {get;set;}
    private Domain communityDomain {get;set;}
    public String communityUrl {get;set;}
    public user rachel{get;set;}
    
    public Q_NTOSurvey() {
        rachel = [select Id, username, SmallPhotoURL, Name from User where name = 'Rachel Morris' limit 1];
        surveyCommunity = [select id, name, urlpathprefix from Network Where name = 'Northern Trail Sports Community' limit 1];
        communityDomain = [SELECT Domain FROM Domain limit 1];
        communityUrl = communityDomain.domain + '/'+ surveyCommunity.urlpathprefix;
    }
}