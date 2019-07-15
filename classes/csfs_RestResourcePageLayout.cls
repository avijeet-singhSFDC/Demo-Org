/**
* @author Salesforce.com
* @date 2016
*
* @description REST endpoint (/pageLayout) that returns fields for a page layout associated with the passed in object type and record type ID
*/

@RestResource(urlMapping='/*/pageLayout/*')
global with sharing class csfs_RestResourcePageLayout {

    static Map<Id,Schema.RecordTypeInfo> recordTypes;

    @HttpGet
    global static List<ObjectLayoutInfo> doGet() {

        List<ObjectLayoutInfo> toReturn;

        List<String> uriParts = RestContext.request.requestURI.split('/');
        String path = uriParts[ uriParts.size() - 1 ];
        String objectType = csfs_RestUtils.getStringParamFromKey('objectType');

        if (String.isBlank(objectType)) {
            toReturn = csfs_SettingsUtil.getAllLayouts();
        } else {
            String recordTypeID = csfs_RestUtils.getStringParamFromKey('recordTypeId');
            Schema.SObjectType targetType = Schema.getGlobalDescribe().get(objectType);

            if (targetType != null) {
                recordTypes = Schema.getGlobalDescribe().get(objectType).getDescribe().getRecordTypeInfosById();
            }

            if (String.isBlank(recordTypeID)) {
                recordTypeID = '';
            }

            Integer numberOfRecordTypes = 0;

            if (!String.isBlank(objectType)) {
                numberOfRecordTypes = Schema.getGlobalDescribe().get(objectType).getDescribe().getRecordTypeInfos().size();

                if (recordTypeID == '') {
                    if (numberOfRecordTypes == 0) {
                        toReturn = new List<ObjectLayoutInfo>{getLayout(objectType,'')};
                    } else {
                        toReturn = new List<ObjectLayoutInfo>{getLayout(objectType, csfs_SettingsUtil.MASTER_RECORD_TYPE_ID)};
                    }
                } else {
                    toReturn = new List<ObjectLayoutInfo>{getLayout(objectType,recordTypeID)};
                }
            }
        }

        return toReturn;
    }


    private static ObjectLayoutInfo getLayout(String objectType, String recordTypeId) {
        String salesforceHost = Site.getBaseUrl();

        if (String.isBlank(salesforceHost)) {
            salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();
        }

        String url =  salesforceHost + '/services/data/v36.0/sobjects/' + objectType + '/describe/layouts/';

        if (!String.isBlank(recordTypeId)) {
            url += recordTypeId;
        }

        HttpRequest req = new HttpRequest();
        req.setMethod('GET');
        req.setEndpoint(url);
        req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());

        Http http = new Http();

        csfs_PageLayout.Layout pl;

        //if (!Test.isRunningTest() && Limits.getCallouts() < 100) {
        if (Limits.getCallouts() < 100) {
            HTTPResponse res = http.send(req);

            if (!String.isBlank(recordTypeId)) {
                pl = (csfs_PageLayout.Layout)JSON.deserialize(res.getBody(), csfs_PageLayout.Layout.class);
            } else {
                csfs_PageLayout parentLayout = (csfs_PageLayout)JSON.deserialize(res.getBody(), csfs_PageLayout.class);
                if (parentLayout != null) {
                    if (parentLayout.layouts != null && parentLayout.layouts.size() > 0) {
                        pl = parentLayout.layouts[0];
                    }
                }
            }

            List<csfs_SettingsUtil.FieldInfo> fieldList;
            fieldList = csfs_SettingsUtil.getFieldsFromLayout(pl, objectType);

            ObjectLayoutInfo info = new ObjectLayoutInfo();
            info.ObjectType = objectType;
            info.layout = pl;

            if (String.isBlank(recordTypeID)) {
                info.RecordTypeId = null;
            } else {
                info.RecordTypeId = recordTypeID;
            }

            info.FieldLayouts = fieldList;

            String recordId;

            if (!String.isBlank(recordTypeId) && recordTypeId.substring(0,15) != '012000000000000') {
                recordId = recordTypeId;
            } else {
                recordId = pl.Id;
            }

            info.Id = recordId;

            if (!String.isBlank(recordTypeID) && recordTypes != null && recordTypes.get(recordTypeID) != null) {
                info.RecordTypeName = recordTypes.get(recordTypeID).getName();
                info.RecordTypeAvailable = recordTypes.get(recordTypeID).isAvailable();
            }

            return info;
        }

        return null;
    }


    global class ObjectLayoutInfo {
        public String Id {get;set;}
        public String ObjectType {get;set;}
        public String RecordTypeId {get;set;}
        public String RecordTypeName {get;set;}
        public Boolean RecordTypeAvailable {get;set;}
        public List<csfs_SettingsUtil.FieldInfo> FieldLayouts {get;set;}
        public csfs_PageLayout.Layout Layout {get;set;}
    }
}