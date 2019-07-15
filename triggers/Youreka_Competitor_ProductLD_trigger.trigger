/* This trigger was created by the Youreka package and is integral to it. 
Please do not delete */
trigger Youreka_Competitor_ProductLD_trigger on Competitor_Product__c (after update){
    disco.Util.updateAnswersInLinkedSections(trigger.new,'Competitor_Product__c');
}