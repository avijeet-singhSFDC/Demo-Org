/**
* @author Salesforce.com
* @date 2016
*
* @description Wrapper class for a page layout returned from the REST metadata API.
*/
public with sharing class csfs_PageLayout {
    public List<Layout> layouts {get;set;}

    public class Layout {
        public List<DetailLayoutSection> detailLayoutSections {get;set;}
        public List<DetailLayoutSection> editLayoutSections {get;set;}
        //public List<RelatedListComponent> relatedLists {get;set;}
        public DetailLayoutSection highlightsPanelLayoutSection {get;set;}
        public String Id {get;set;}
    }

    public class DetailLayoutSection {
        public List<LayoutRow> layoutRows {get;set;}
        public String heading {get;set;}
    }

    public class LayoutRow {
        public List<LayoutItem> layoutItems {get;set;}
    }

    public class LayoutItem {
        public String label {get;set;}
        public List<LayoutComponent> layoutComponents {get;set;}
        public Boolean required {get;set;}
        public String editableForNew {get;set;}
        public String editableForUpdate {get;set;}
    }

    public class LayoutComponent {
        public String value {get;set;}
        public String type {get;set;}
        public LayoutComponentDetail details {get;set;}
        public List<LayoutComponent> components {get;set;}
    }

    public class LayoutComponentDetail {
        public String label {get;set;}
        public String type {get;set;}
        public String extraTypeInfo {get;set;}
        public String maskType {get;set;}
        public String mask {get;set;}
        public String relationshipName {get;set;}
        public String externalId {get;set;}
        public List<String> referenceTo {get;set;}
        public List<PicklistValue> picklistValues {get;set;}
    }

    public class RelatedListComponent {
        public String name {get;set;}
        public List<RelatedListColumn> columns {get;set;}
    }

    public class RelatedListColumn {
        public String field {get;set;}
        public String name {get;set;}
    }

    public class PicklistValue {
        public Boolean Active {get;set;}
        public Boolean DefaultValue {get;set;}
        public String Label {get;set;}
        public String Value {get;set;}
        public String ValidFor {get;set;}
    }
}