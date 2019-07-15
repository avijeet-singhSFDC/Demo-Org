public with sharing class csfs_SettingsUtil {

    /* Page Layout Utils */
    public static final String MASTER_RECORD_TYPE_ID = '012000000000000AAA';

    static List<String> objectsToDescribe = new List<String>(csfs_Field_Sales_Supported_Objects__c.getAll().keySet());
    static Map<String, Schema.DescribeSObjectResult> objectDescribeMap = new Map<String, Schema.DescribeSObjectResult>();
    static List<Schema.DescribeSObjectResult> objectDescribes;
    static Map<String, String> nameFieldsMap = new Map<String, String>();
    static Map<csfs_PageLayout.LayoutComponent, csfs_PageLayout.LayoutItem> currencyCodeField;
    static Map<String, Schema.SObjectType> gd = Schema.getGlobalDescribe();
    static Map<String, Map<Id,Schema.RecordTypeInfo>> objectRecordTypes = new Map<String, Map<Id,Schema.RecordTypeInfo>>();
    public static Set<String> globalfieldsToHide = new Set<String>{'Id',
                                                            'IsDeleted',
                                                            'CreatedDate',
                                                            'CreatedById',
                                                            'LastModifiedDate',
                                                            'LastModifiedById',
                                                            'LastReferencedDate',
                                                            'LastViewedDate',
                                                            'SystemModstamp',
                                                            'MiddleName',
                                                            'InformalName',
                                                            'Suffix'};

    static Integer totalRecordTypes = 0;
    static Integer objectsToGet = 0;
    static Integer recordTypesPerObject = 0;
    static Boolean limitNumberOfRecordTypes = false;

    static {
        objectDescribes = new List<Schema.DescribeSObjectResult>();
        for (String o : objectsToDescribe) {
            try {
                objectDescribes.addAll(Schema.describeSObjects(new List<String>{o}));
            } catch (Exception e) {
                system.debug(e);
            }
        }

        csfs_Field_Sales_Settings__c settings = csfs_Field_Sales_Settings__c.getOrgDefaults();

        for (Schema.DescribeSObjectResult dr : objectDescribes) {
            objectDescribeMap.put(dr.getName(), dr);
        }
    }

    public static String getNameField(String objectType) {
        if (nameFieldsMap.get(objectType) != null) {
            return nameFieldsMap.get(objectType);
        }

        Schema.DescribeSObjectResult dr = Schema.getGlobalDescribe().get(objectType).getDescribe();

        String nameField;
        String objectName = dr.getName().toLowerCase();
        if (dr.fields.getMap().keyset().contains('name') && dr.fields.getMap().get('name').getDescribe().isNameField()) {
            nameField = 'Name';
            nameFieldsMap.put(dr.getName(), nameField);
        } else {
            for (String s : dr.fields.getMap().keyset()) {
                Schema.DescribeFieldResult dfr = dr.fields.getMap().get(s).getDescribe();

                if (dfr.isNameField()) {
                    nameField = dfr.getName();
                    break;
                }
            }
        }

        nameFieldsMap.put(dr.getName(), nameField);
        return nameField;
    }

    public static List<csfs_RestResourcePageLayout.ObjectLayoutInfo> getAllLayouts() {
        csfs_Field_Sales_Settings__c settings = csfs_Field_Sales_Settings__c.getOrgDefaults();

        for (Schema.DescribeSObjectResult dr : objectDescribes) {
            Schema.DescribeSObjectResult objectDescribe = Schema.getGlobalDescribe().get(dr.getName()).getDescribe();

            Boolean getRecordTypes = true;

            if (objectDescribe.isAccessible() == false) {
                getRecordTypes = false;
            }

            if (dr.getRecordTypeInfos().size() > 0 && getRecordTypes) {
                Map<Id,Schema.RecordTypeInfo> rtMap;
                for (Schema.RecordTypeInfo rti : dr.getRecordTypeInfos()) {
                    if (rti.getName() != 'Work Order PDF Report' ) {
                        if (rti.isAvailable() || rti.isMaster()) {
                            if (rtMap == null) { rtMap = new Map<Id,Schema.RecordTypeInfo>(); }

                            rtMap.put(rti.getRecordTypeId(), rti);
                        }
                    }
                }

                if (rtMap != null) {
                    if (!(rtMap.values().size() == 1 && rtMap.values()[0].getRecordTypeId() == MASTER_RECORD_TYPE_ID)) {
                        objectRecordTypes.put(dr.getName(), rtMap);
                    }
                }
            }

            objectDescribeMap.put(dr.getName(), dr);
        }


        List<csfs_RestResourcePageLayout.ObjectLayoutInfo> allLayouts = new List<csfs_RestResourcePageLayout.ObjectLayoutInfo>();

        for (String objectName : objectsToDescribe) {
            List<csfs_RestResourcePageLayout.ObjectLayoutInfo> layouts;

            if (Limits.getCallouts() < 100) {
                if (objectRecordTypes.get(objectName) == null) {
                    layouts = getObjectLayouts_WithoutRecordTypes(objectName);
                } else {
                    layouts = getObjectLayouts_WithRecordTypes(objectName);
                }
            }

            if (layouts != null && objectName.toLowerCase() != 'contentdocument') {
                allLayouts.addAll(layouts);
            }
        }

        return allLayouts;
    }

    public static List<FieldInfo> getFieldsFromLayout(csfs_PageLayout.Layout layout, String objectName) {
        List<FieldInfo> fieldList = new List<FieldInfo>();

        currencyCodeField = null;

        Map<String,Boolean> requiredFields = getRequiredFields(layout);

        if (currencyCodeField != null) {
            FieldInfo currencyInfo = getFieldInfo(new List<csfs_PageLayout.LayoutComponent>(currencyCodeField.keySet())[0], objectName, currencyCodeField.values()[0], requiredFields);

                if (currencyInfo != null) {
                    fieldList.add(currencyInfo);
                }
        }

        for (csfs_PageLayout.DetailLayoutSection detailSection : layout.detailLayoutSections) {
            // FieldInfo sectionName = new FieldInfo();
            // sectionName.Heading = detailSection.heading;
            // sectionName.Type = 'HEADING';
            // fieldList.add(sectionName);
            for (csfs_PageLayout.LayoutRow row : detailSection.layoutRows) {
                for (csfs_PageLayout.LayoutItem item : row.layoutItems) {
                    for (csfs_PageLayout.LayoutComponent component : item.layoutComponents) {
                        FieldInfo fieldInfo = getFieldInfo(component, objectName, item, requiredFields);

                        if (fieldInfo != null) {
                            fieldList.add(fieldInfo);
                        }
                    }
                }
            }
        }

        return fieldList;
    }

    private static List<csfs_RestResourcePageLayout.ObjectLayoutInfo> getObjectLayouts_WithRecordTypes(String objectName) {
        String salesforceHost = Site.getBaseUrl();

        if (String.isBlank(salesforceHost)) {
            salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();
        }

        List<csfs_RestResourcePageLayout.ObjectLayoutInfo> recordTypes = new List<csfs_RestResourcePageLayout.ObjectLayoutInfo>();
        Map<String, csfs_RestResourcePageLayout.ObjectLayoutInfo> recordTypeMap = new Map<String, csfs_RestResourcePageLayout.ObjectLayoutInfo>();
        Map<String,csfs_PageLayout.Layout> layoutMap = new Map<String,csfs_PageLayout.Layout>();

        if (objectRecordTypes.get(objectName) != null) {
            try {
                for(Schema.RecordTypeInfo rt : objectRecordTypes.get(objectName).values()) {

                    String url =  salesforceHost + '/services/data/v36.0/sobjects/' + objectName + '/describe/layouts/' + rt.getRecordTypeId();
                    HttpRequest req = new HttpRequest();

                    req.setMethod('GET');
                    req.setEndpoint(url);
                    req.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());

                    Http http = new Http();

                    if (!Test.isRunningTest()) {
                        HTTPResponse res = http.send(req);
                        csfs_PageLayout.Layout pl = (csfs_PageLayout.Layout)JSON.deserialize(res.getBody(), csfs_PageLayout.Layout.class);
                        layoutMap.put(rt.getRecordTypeId(),pl);
                    }
                    Boolean available = false;

                    if (rt.getRecordTypeId() != MASTER_RECORD_TYPE_ID && rt.isAvailable()) {
                        available = true;
                    }

                    csfs_RestResourcePageLayout.ObjectLayoutInfo oi = new csfs_RestResourcePageLayout.ObjectLayoutInfo();
                    oi.ObjectType = objectName;
                    oi.RecordTypeId = rt.getRecordTypeId();
                    oi.RecordTypeName = rt.getName();
                    oi.RecordTypeAvailable = rt.isAvailable();

                    recordTypeMap.put(oi.RecordTypeId, oi);
                }
            } catch (Exception e) {
                system.debug(e);
            }
        }

        Map<String, List<Map<String,String>>> layoutCache = new Map<String, List<Map<String,String>>>();

        if(layoutMap.size() > 0) {
            List<FieldInfo> fieldList;
            for (String cId : layoutMap.keySet()) {
                csfs_PageLayout.Layout layout = layoutMap.get(cId);
                fieldList = getFieldsFromLayout(layout, objectName);

                csfs_RestResourcePageLayout.ObjectLayoutInfo oi = recordTypeMap.get(cID);
                oi.FieldLayouts = fieldList;
                oi.layout = layout;

                String recordId;

                if (!String.isBlank(oi.RecordTypeId) && oi.RecordTypeId.substring(0,15) != '012000000000000') {
                    recordId = oi.RecordTypeId;
                } else {
                    recordId = layout.Id;
                }

                oi.Id = recordId;

                recordTypes.add(oi);
            }
        }
        return recordTypes;
    }

    private static List<csfs_RestResourcePageLayout.ObjectLayoutInfo> getObjectLayouts_WithoutRecordTypes(String objectName) {

        List<csfs_RestResourcePageLayout.ObjectLayoutInfo> fieldList;

        if (objectRecordTypes.get(objectName) == null && objectName != 'RecordType') {
            try {

                String salesforceHost = Site.getBaseUrl();

                if (String.isBlank(salesforceHost)) {
                    salesforceHost = System.Url.getSalesforceBaseURL().toExternalForm();
                }

                Map<String,RecordTypeInfo> recordTypes = new Map<String,RecordTypeInfo>();
                Map<String,csfs_PageLayout.Layout> layoutMap = new Map<String,csfs_PageLayout.Layout>();

                String url =  salesforceHost + '/services/data/v36.0/sobjects/' + objectName + '/describe/layouts';
                HttpRequest request = new HttpRequest();

                request.setMethod('GET');
                request.setEndpoint(url);
                request.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());

                Http http = new Http();

                csfs_PageLayout.Layout layout;
                csfs_PageLayout parentLayout;

                //if (!Test.isRunningTest()) {
                HTTPResponse res = http.send(request);
                parentLayout = (csfs_PageLayout)JSON.deserialize(res.getBody(), csfs_PageLayout.class);
                if (parentLayout != null) {
                    if (parentLayout.layouts != null && parentLayout.layouts.size() > 0) {
                        layout = parentLayout.layouts[0];
                    }
                }
                //}

                fieldList = new List<csfs_RestResourcePageLayout.ObjectLayoutInfo>();

                if (layout != null) {

                    csfs_RestResourcePageLayout.ObjectLayoutInfo oi = new csfs_RestResourcePageLayout.ObjectLayoutInfo();
                    oi.ObjectType = objectName;
                    oi.FieldLayouts = getFieldsFromLayout(layout, objectName);
                    oi.Id = layout.Id;
                    oi.layout = layout;

                    fieldList.add(oi);
                }
            } catch (Exception e) {
                system.debug(e);
            }
        }

        return fieldList;
    }

    private static FieldInfo getFieldInfo(csfs_PageLayout.LayoutComponent component, String objectName, csfs_PageLayout.LayoutItem item, Map<String,Boolean> requiredFields) {
        FieldInfo fieldInfo;

      if(component.type == 'Field' && objectDescribeMap.get(objectName) != null && objectDescribeMap.get(objectName).fields.getMap().get(component.value) != null) {
          Schema.DescribeFieldResult dfr = objectDescribeMap.get(objectName).fields.getMap().get(component.value).getDescribe();
          if(dfr.isAccessible() && !globalFieldsToHide.contains(dfr.getName())) {
              fieldInfo  =  new FieldInfo();

              fieldInfo.Label = dfr.getLabel();
              fieldInfo.Name = dfr.getName();
              fieldInfo.Type = String.valueOf(dfr.getType());
              fieldInfo.ExtraTypeInfo = component.details.extraTypeInfo;
              fieldInfo.Updateable = item.editableForUpdate;
              fieldInfo.Createable = item.editableForNew;
              fieldInfo.Required = requiredFields.get(component.value) == null ? 'false' : String.valueOf(requiredFields.get(component.value));
              fieldInfo.DefaultedOnCreate = String.valueOf(dfr.isDefaultedOnCreate());
              if(String.valueOf(dfr.getType()) == 'PICKLIST' || String.valueOf(dfr.getType()) == 'MULTIPICKLIST') {
                  fieldInfo.PicklistValues = component.details.picklistValues;
                  String values;

                  if (component.details.picklistValues != null && component.details.picklistValues.size() > 0) {
                    values = '';
                    List<String> valuesList = new List<String>();
                    for (csfs_PageLayout.PicklistValue pv : component.details.picklistValues) {
                        valuesList.add(pv.value);
                    }
                    values = String.join(valuesList, ',');
                  }

                  fieldInfo.Values = values;
              }
              if(String.valueOf(dfr.getType()) == 'REFERENCE') {
                  fieldInfo.RelationshipName = dfr.getRelationshipName();

                  String relatedObjectName = dfr.getReferenceTo()[0].getDescribe().getName();

                  fieldInfo.ReferenceTo = relatedObjectName;
                  fieldInfo.RelationshipField = getNameField(relatedObjectName);
              }
              if(String.valueOf(dfr.getType()) == 'INTEGER') {
                  fieldInfo.Length = String.valueOf(dfr.getDigits());
              } else if(String.valueOf(dfr.getType()) == 'DOUBLE') {
                  fieldInfo.Length = String.valueOf(dfr.getPrecision());
                  fieldInfo.Scale = String.valueOf(dfr.getScale());
              } else if(String.valueOf(dfr.getType()) == 'CURRENCY') {
                  fieldInfo.Length = String.valueOf(dfr.getPrecision());
                  fieldInfo.Scale = String.valueOf(dfr.getScale());
              } else if(String.valueOf(dfr.getType()) == 'PERCENT') {
                  fieldInfo.Length = String.valueOf(dfr.getPrecision());
                  fieldInfo.Scale = String.valueOf(dfr.getScale());
              } else {
                  fieldInfo.Length = String.valueOf(dfr.getLength());
              }

              if(String.valueOf(dfr.getType()) == 'ADDRESS') {
                  if (component.components != null) {
                        for (csfs_PageLayout.LayoutComponent addressDetail : component.components) {
                              if (addressDetail.value != null && addressDetail.value.toLowerCase().contains('street')) {
                                    fieldInfo.Street = addressDetail.value;
                              } else if (addressDetail.value != null && addressDetail.value.toLowerCase().contains('city')) {
                                    fieldInfo.City = addressDetail.value;
                              } else if (addressDetail.value != null && addressDetail.value.toLowerCase().contains('state')) {
                                    fieldInfo.State = addressDetail.value;
                                    if (addressDetail.details != null && addressDetail.details.picklistValues != null && addressDetail.details.picklistValues.size() > 0) {
                                        fieldInfo.StatePicklistMap = addressDetail.details.picklistValues;
                                    }
                              } else if (addressDetail.value != null && addressDetail.value.toLowerCase().contains('postalcode')) {
                                    fieldInfo.PostalCode = addressDetail.value;
                              } else if (addressDetail.value != null && addressDetail.value.toLowerCase().contains('country')) {
                                    fieldInfo.Country = addressDetail.value;

                                    if (addressDetail.details != null && addressDetail.details.picklistValues != null && addressDetail.details.picklistValues.size() > 0) {
                                        fieldInfo.CountryPicklistMap = addressDetail.details.picklistValues;
                                    }
                              }
                        }
                  }
              }

              if(component.details.extraTypeInfo != null && component.details.extraTypeInfo == 'personname') {
                  if (component.components != null) {
                        for (csfs_PageLayout.LayoutComponent nameDetail : component.components) {
                              if (nameDetail.value != null && nameDetail.value.toLowerCase().contains('firstname')) {
                                    fieldInfo.FirstName = nameDetail.value;
                              } else if (nameDetail.value != null && nameDetail.value.toLowerCase().contains('lastname')) {
                                    fieldInfo.LastName = nameDetail.value;
                              }
                        }
                  }
              }

              if(String.valueOf(dfr.getType()) == 'ENCRYPTEDSTRING') {
                fieldInfo.MaskType = component.details.maskType;
                fieldInfo.Mask = component.details.mask;
              }

              fieldInfo.ExternalID = component.details.externalId;

              String defaultValue;
              if (dfr.getDefaultValue() == null) {
                  defaultValue = String.valueOf(dfr.getDefaultValueFormula());
              } else {
                  defaultValue = String.valueOf(dfr.getDefaultValue());
              }
              fieldInfo.DefaultValue = defaultValue;
          }
      }

      return fieldInfo;
    }

    private static Map<String,Boolean> getRequiredFields(csfs_PageLayout.Layout layout) {
        Map<String,Boolean> fieldList = new Map<String,Boolean>();

        for (csfs_PageLayout.DetailLayoutSection detailSection : layout.editLayoutSections) {
            for (csfs_PageLayout.LayoutRow row : detailSection.layoutRows) {
                for (csfs_PageLayout.LayoutItem item : row.layoutItems) {
                    for (csfs_PageLayout.LayoutComponent component : item.layoutComponents) {
                        if(component.type == 'Field') {
                            fieldList.put(component.value, item.required);

                            if (component.value != null && component.value.toLowerCase() == 'currencyisocode') {
                                currencyCodeField = new Map<csfs_PageLayout.LayoutComponent, csfs_PageLayout.LayoutItem>();
                                currencyCodeField.put(component, item);
                            }
                        }
                    }
                }
            }
        }

        return fieldList;
    }


    public class FieldInfo {
        public String Label {get;set;}
        public String Name  {get;set;}
        public String Type {get;set;}
        public String ExtraTypeInfo {get;set;}
        public String Updateable {get;set;}
        public String Createable {get;set;}
        public String Required {get;set;}
        public String DefaultedOnCreate {get;set;}
        public String RelationshipName {get;set;}
        public String ReferenceTo {get;set;}
        public String RelationshipField {get;set;}
        public String Length {get;set;}
        public String Scale {get;set;}
        public String Street {get;set;}
        public String City {get;set;}
        public String State {get;set;}
        public List<csfs_PageLayout.PicklistValue> StatePicklistMap {get;set;}
        public List<csfs_PageLayout.PicklistValue> CountryPicklistMap {get;set;}
        public String Country {get;set;}
        public String PostalCode {get;set;}
        public String FirstName {get;set;}
        public String LastName {get;set;}
        public String MaskType {get;set;}
        public String Mask {get;set;}
        public String ExternalID {get;set;}
        public String DefaultValue {get;set;}
        public String Values {get;set;}
        public List<csfs_PageLayout.PicklistValue> PicklistValues {get;set;}
        public String Heading {get;set;}
    }
}