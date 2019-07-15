@isTest
private class csfs_PageLayoutTest {
    

    @IsTest public static void testcsfs_PageLayoutTest() {
    	Test.setMock(HttpCalloutMock.class, new csfs_PageLayoutTestMockResponseGenerator());

        csfs_PageLayout controller = new csfs_PageLayout();

        String salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();
        String url =  salesforceHost + '/services/data/v36.0/sobjects/Account/describe/layouts/';
        HttpRequest req = new HttpRequest();
        req.setMethod('GET');
        req.setEndpoint(url);
        req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());

        Http http = new Http();
        HTTPResponse res = http.send(req);
	    csfs_PageLayout.Layout pl  = (csfs_PageLayout.Layout)JSON.deserialize(res.getBody(), csfs_PageLayout.Layout.class);
    }    

    @IsTest public static void testcsfs_PageLayoutCreateTest() {
        csfs_PageLayout.Layout layout = new csfs_PageLayout.Layout();
        layout.detailLayoutSections = new List<csfs_PageLayout.DetailLayoutSection>();
        layout.editLayoutSections = new List<csfs_PageLayout.DetailLayoutSection>();
        layout.highlightsPanelLayoutSection = new csfs_PageLayout.DetailLayoutSection();
        layout.id = '12345';

        csfs_PageLayout.DetailLayoutSection detailLayoutSections = new csfs_PageLayout.DetailLayoutSection();
        detailLayoutSections.layoutRows = new List<csfs_PageLayout.LayoutRow>();
        detailLayoutSections.heading = 'heading';

        csfs_PageLayout.LayoutRow layoutRow = new csfs_PageLayout.LayoutRow();
        layoutRow.layoutItems = new  List<csfs_PageLayout.LayoutItem>();

        csfs_PageLayout.LayoutItem layoutItem = new csfs_PageLayout.LayoutItem();
        layoutItem.label = 'label';
        layoutItem.layoutComponents = new List<csfs_PageLayout.LayoutComponent>();
        layoutItem.required = true;
        layoutItem.editableForNew = 'editableForNew';
        layoutItem.editableForUpdate = 'editableForUpdate';

        csfs_PageLayout.LayoutComponent layoutComponent = new csfs_PageLayout.LayoutComponent();
        layoutComponent.value= 'value';
        layoutComponent.type = 'type';
        layoutComponent.details = new csfs_PageLayout.LayoutComponentDetail();
        layoutComponent.components = new List<csfs_PageLayout.LayoutComponent>();

        csfs_PageLayout.LayoutComponentDetail layoutComponentDetail = new csfs_PageLayout.layoutComponentDetail();
        layoutComponentDetail.label = 'label';
        layoutComponentDetail.type = 'type';
        layoutComponentDetail.extraTypeInfo = 'extraTypeInfo';
        layoutComponentDetail.maskType = 'mastType';
        layoutComponentDetail.mask = 'mask';
        layoutComponentDetail.relationshipName = 'relationshipName';
        layoutComponentDetail.externalId = 'externalId';
        layoutComponentDetail.referenceTo = new List<String>();
        layoutComponentDetail.picklistValues = new List<csfs_PageLayout.PicklistValue>();

        csfs_PageLayout.RelatedListComponent relatedListComponent = new csfs_PageLayout.RelatedListComponent();
        relatedListComponent.name = 'name';
        relatedListComponent.columns = new List<csfs_PageLayout.RelatedListColumn>();

        csfs_PageLayout.RelatedListColumn relatedListColumn = new csfs_PageLayout.RelatedListColumn();
        relatedListColumn.field = 'field';
        relatedListColumn.name = 'name';

        csfs_PageLayout.PicklistValue picklistValue = new csfs_PageLayout.PicklistValue();
        picklistValue.active = true;
        picklistValue.defaultValue = true;
        picklistValue.Label = 'label';
        picklistValue.value = 'value';
        picklistValue.validFor = 'validFor';
    }

}