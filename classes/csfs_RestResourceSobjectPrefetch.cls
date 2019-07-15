/**
* @author Salesforce.com
* @date 2016
*
* @description REST endpoint (/prefetch/*) that returns a list of sobjects of the type specified by the url, e.g. /prefetch/account
*/

@RestResource(urlMapping='/*/prefetch')
global with sharing class csfs_RestResourceSobjectPrefetch {

	static csfs_Field_Sales_Settings__c settings = csfs_Field_Sales_Settings__c.getOrgDefaults();
	static String queryOffset = csfs_RestUtils.getStringParamFromKey('offset');
	static String pageSize = csfs_RestUtils.getStringParamFromKey('limit');

	@HttpGet
	global static List<sObject> doGet() {
		List<String> uriParts = RestContext.request.requestURI.split('/');
    String path = uriParts[ uriParts.size() - 1 ];

		if (path.toLowerCase() == 'account') {
			return getAccounts();
		}

		if (path.toLowerCase() == 'contact') {
			return getContacts();
		}
        
		if (path.toLowerCase() == 'task') {
			return getTasks();
		}

		if (path.toLowerCase() == 'order') {
			return getObjects('order', 'OwnerId');
		}

		if (path.toLowerCase() == 'product2') {
			return getObjects('Product2', 'CreatedById');
		}
        
		if (path.toLowerCase() == 'task') {
			return getObjects('task', 'OwnerId');
		}

		if (path.toLowerCase() == 'csfs_notification__c') {
			return getObjects('csfs_notification__c', 'OwnerId');
		}

		if (path.toLowerCase() == 'csfs_productonhand__c') {
			return getObjects('csfs_productonhand__c', 'OwnerId');
		}

		if (path.toLowerCase() == 'csfs_product_promotion__c') {
			return getObjects('csfs_product_promotion__c', null);
		}

    	if (path.toLowerCase() == 'csfs_store_objective__c') {
			return getObjects('csfs_store_objective__c', 'OwnerId');
		}

		if (path.toLowerCase() == 'csfs_store_product__c') {
			return getStoreProducts();
		}

		if (path.toLowerCase() == 'csfs_Store_Product_Visit_Audit__c') {
			return getObjects('csfs_Store_Product_Visit_Audit__c', null);
		}

		if (path.toLowerCase() == 'csfs_store_promotion__c') {
			return getStorePromotions();
		}

		if (path.toLowerCase() == 'csfs_visit_Audit__c') {
			return getObjects('csfs_visit_Audit__c', 'OwnerId');
		}

		if (path.toLowerCase() == 'csfs_visitobjective__c') {
			return getObjects('csfs_visitobjective__c', null);
		}

		if (path.toLowerCase() == 'csfs_Store_Check_Section__c') {
			return getObjects('csfs_Store_Check_Section__c', null);
		}

		if (path.toLowerCase() == 'csfs_visit__c') {
			return getVisits();
		}

        return NULL;
	}

	private static List<sObject> getTasks() {

		List<String> fields = csfs_RestUtils.requestedOrAllFields('fields', 'Task');

		String query = 'SELECT ';
		query += String.join(fields, ',');
		query += ' FROM Task ';

		if (settings.csfs_Data_Sync_Option__c == 'MyRecords') {
			query += ' WHERE OwnerId = \''+ UserInfo.getUserId() + '\' ';
		}

		if (!String.isBlank(pageSize)) {
	        query += ' LIMIT ' + pageSize;
	    }

	    if (!String.isBlank(queryOffset)) {
	        query += ' OFFSET ' + queryOffset;
	    }

		return Database.query(query);
	}

	private static List<sObject> getStorePromotions() {
		List<String> fields = csfs_RestUtils.requestedOrAllFields('fields', 'csfs_Store_Promotion__c');

		String query = 'SELECT ';
		query += String.join(fields, ',');
		query += ' FROM csfs_Store_Promotion__c ';
		query += ' where csfs_promotion__r.csfs_enddate__c > TODAY';

		if (!String.isBlank(pageSize)) {
	        query += ' LIMIT ' + pageSize;
	    }

	    if (!String.isBlank(queryOffset)) {
	        query += ' OFFSET ' + queryOffset;
	    }
		return Database.query(query);
	}

	private static List<sObject> getStoreProducts() {
		List<String> fields = csfs_RestUtils.requestedOrAllFields('fields', 'csfs_Store_Product__c');

		String query = 'SELECT ';
		query += String.join(fields, ',');
		query += ' FROM csfs_Store_Product__c ';

		if (settings.csfs_Data_Sync_Option__c == 'MyRecords') {
			query += ' WHERE Store__r.OwnerId = \''+ UserInfo.getUserId() + '\' ';
		}

		if (!String.isBlank(pageSize)) {
	        query += ' LIMIT ' + pageSize;
	    }

	    if (!String.isBlank(queryOffset)) {
	        query += ' OFFSET ' + queryOffset;
	    }
		return Database.query(query);
	}

	private static List<sObject> getVisits() {
		List<String> fields = csfs_RestUtils.requestedOrAllFields('fields', 'csfs_Visit__c');

		String query = 'SELECT ';
		query += String.join(fields, ',');
		query += ' FROM csfs_Visit__c ';
		if (settings.csfs_Data_Sync_Option__c == 'MyRecords') {
			query += 'where csfs_Account__r.ownerId = \''+ UserInfo.getUserId() + '\' ';
		}

		if (!String.isBlank(pageSize)) {
	        query += ' LIMIT ' + pageSize;
	    }

	    if (!String.isBlank(queryOffset)) {
	        query += ' OFFSET ' + queryOffset;
	    }

		return Database.query(query);
	}

	private static List<sObject> getAccounts() {
		List<String> fields = csfs_RestUtils.requestedOrAllFields('fields', 'Account');

		String query = 'SELECT ';
		query += String.join(fields, ',');
		query += ' FROM Account ';
		Boolean whereSet = false;

		if (settings.csfs_Data_Sync_Option__c == 'MyRecords') {
			query += ' WHERE OwnerId = \''+ UserInfo.getUserId() + '\' ';
			whereSet = true;
		}

		Id storeRecordTypeId = [select Id from RecordType where Name = 'Retail Store' and SobjectType = 'Account'][0].Id;

		if (settings.csfs_Account_Sync_Option__c == 'StoreRecords') {
			if (whereSet == true) {
				query += ' AND RecordTypeId = :storeRecordTypeId';
			} else {
				query += ' WHERE RecordTypeId = :storeRecordTypeId';
				whereSet = true;
			}
		}

		if (!String.isBlank(pageSize)) {
	        query += ' LIMIT ' + pageSize;
	    }

	    if (!String.isBlank(queryOffset)) {
	        query += ' OFFSET ' + queryOffset;
	    }
	    System.debug(query);
		return Database.query(query);
	}

	private static List<sObject> getContacts() {
		List<String> fields = csfs_RestUtils.requestedOrAllFields('fields', 'Contact');

		String query = 'SELECT ';
		query += String.join(fields, ',');
		query += ' FROM Contact ';

		if (settings.csfs_Data_Sync_Option__c == 'MyRecords') {
			query += 'where Account.ownerId = \''+ UserInfo.getUserId() + '\' ';
		}

		if (!String.isBlank(pageSize)) {
	        query += ' LIMIT ' + pageSize;
	    }

	    if (!String.isBlank(queryOffset)) {
	        query += ' OFFSET ' + queryOffset;
	    }

		return Database.query(query);
	}

	private static List<sObject> getObjects(String fieldName, String ownerFieldName) {
		List<String> fields = csfs_RestUtils.requestedOrAllFields('fields', fieldName);

		String query = 'SELECT ';
		query += String.join(fields, ',');
		query += ' FROM ' + fieldName;
		if (settings.csfs_Data_Sync_Option__c == 'MyRecords' && ownerFieldName != null) {
			query += ' WHERE ' + ownerFieldName + ' = \''+ UserInfo.getUserId() + '\' ';
		}

		if (!String.isBlank(pageSize)) {
            query += ' LIMIT ' + pageSize;
        }

        if (!String.isBlank(queryOffset)) {
            query += ' OFFSET ' + queryOffset;
        }

		return Database.query(query);
	}
}