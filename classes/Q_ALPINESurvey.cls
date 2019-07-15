public with sharing class Q_ALPINESurvey {
    private Network surveyCommunity {get;set;}
    private Domain communityDomain {get;set;}
    public String communityUrl {get;set;}

    public user olivia{get;set;}
    
    public Q_ALPINESurvey() {
        olivia= [select Id, username, SmallPhotoURL, Name from User where name = 'Olivia Buyer' limit 1];
        surveyCommunity = [select id, name, urlpathprefix from Network Where name = 'Alpine Retail Partner Community' limit 1];
        communityDomain = [SELECT Domain FROM Domain limit 1];
        communityUrl = communityDomain.domain + '/'+ surveyCommunity.urlpathprefix;
    }
}