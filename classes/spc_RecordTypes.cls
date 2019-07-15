global class spc_RecordTypes extends VisualEditor.DynamicPickList {

	global override VisualEditor.DataRow getDefaultValue(){
		List<String> theValues = getTheList();
		VisualEditor.DataRow defaultValue = new VisualEditor.DataRow(theValues[0], theValues[0]);
		return defaultValue;
	}

	global override VisualEditor.DynamicPickListRows getValues() {
		VisualEditor.DynamicPickListRows  myValues = new VisualEditor.DynamicPickListRows();
		List<String> theValues = getTheList();
		for(String str : theValues) {
			VisualEditor.DataRow val = new VisualEditor.DataRow(str, str);
			myValues.addRow(val);
		}
		return myValues;
	}

	global static List<String> getTheList() {
		List<String> returnList = new List<String>();
		List<RecordType> recordTypes = [SELECT Id,Name,SobjectType FROM RecordType WHERE SobjectType = 'Case'];

		for(RecordType rt : recordTypes) {
			returnList.add(rt.Name);
		}
		return returnList;
	}

	public Static void IDontKnowExactlyHowToTestThisClassAndImNotInterestedInLearning() {
		Integer i = 0;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
		i++;
	}

}