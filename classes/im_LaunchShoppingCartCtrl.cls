public class im_LaunchShoppingCartCtrl {
	
    @AuraEnabled
    public static String getUser(){
        String usNameFirst = UserInfo.getFirstName();
        String usNameLast = UserInfo.getLastName();
        String fullName = usNameFirst + ' ' + usNameLast;
        return fullName;
    }
    
    @AuraEnabled
    public static String getContName(String objId){
        Id c = Id.valueOf(objId);
        String objName = c.getSObjectType().getDescribe().getName();
        System.debug(objName);
        String fullName;
        if (objName == 'Contact') {
        	Contact cont = [SELECT FirstName,LastName,Id FROM Contact WHERE Id =: objId];
            fullName = cont.FirstName + ' ' + cont.LastName;    
        } else if (objName == 'Case') {
            Case cs = [SELECT ContactId,Id FROM Case WHERE Id =: objId];
            Contact cont = [SELECT FirstName,LastName,Id FROM Contact WHERE Id =: cs.ContactId];
            fullName = cont.FirstName + ' ' + cont.LastName;
        }
        
        return fullName;
    }
}