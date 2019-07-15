@isTest
public class im_LaunchShoppingTest {

    public static testMethod void validateUserName() {
        String userName = im_LaunchShoppingCartCtrl.getUser();
        System.assert(userName != null);
    }
    
    public static testMethod void validateContactName() {
        Contact c = new Contact();
        c.FirstName = 'Irene';
        c.LastName = 'Ma';
        insert c;
        String contactName = im_LaunchShoppingCartCtrl.getContName(c.Id);
        System.assertEquals('Irene Ma',contactName);
    }
    
    public static testMethod void validateContactNameCase() {
        Contact c = new Contact();
        c.FirstName = 'Irene';
        c.LastName = 'Ma';
        insert c;
        Case cs = new Case();
        cs.BusinessHoursId = '01m46000000kfiXAAQ';
        cs.ContactId = c.Id;
        insert cs;
        String contactName = im_LaunchShoppingCartCtrl.getContName(cs.Id);
        System.assertEquals('Irene Ma',contactName);
    }
}