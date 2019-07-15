public class EinsteinOffersCT {
    @AuraEnabled 
    public static List<Einstein_Prediction__c> getCSAT(String recId)
    {
        List<Einstein_Prediction__c> c =  [Select id, Title__c, Section_A_Color__c,Section_B_Color__c,Leading_Cause__c,Cause_Percent__c,Improvement_Percent__c, Improve__c, Contact__c,Score__c from Einstein_Prediction__c where Contact__c = '0033A00002FxSGGQA3'];
        System.debug('Records : ' + c);
        return c; 
	}
}