public with sharing class QuickCalendarDisplay {

    public String jsCodeBehind {get;set;}
    public List<SObject> myObjectList {get;set;}
    public QuickCalendarData__c mySetup {get;set;}
    
    public String eventID {get;set;}
    public String dayDelta {get;set;}
    public String minDelta {get;set;}
    public String eventTitle {get;set;}
    public SObject mUpdateList {get;set;}
    
    public DateTime debugSDate {get;set;}
    public DateTime debugEDate {get;set;}
    
    public boolean isDateTime = false;
    public boolean endDateMissing = false;
    
    public PageReference UpdateEventAPEX() {
        eventID = Apexpages.currentPage().getParameters().get('eID');
        dayDelta = Apexpages.currentPage().getParameters().get('dDelta');
        minDelta = Apexpages.currentPage().getParameters().get('mDelta');
        
        if( eventID == null || eventID == '' && (dayDelta == '' || minDelta == '' )) {
            return null;
        }
        
        eventID = eventID.substring(1);
        String updateQuery = 'Select ' + mySetup.Title_Field__c + ', ' + mySetup.Date_Field__c + ',' + mySetup.End_Date_Field__c + ' From ' + mySetup.SObject_Name__c + ' Where Id = \'' + eventID + '\'';
        if( mySetup.End_Date_Field__c == 'NA' ) {
            updateQuery = updateQuery.replace( ','+mySetup.End_Date_Field__c, '' );
        }
        
        mUpdateList = Database.Query(updateQuery);
        
        if( mUpdateList != null && dayDelta != '' && isDateTime ) {
            // Update Day Mode (Month Adjust)
            DateTime StartDateDelta = DateTime.ValueOf(mUpdateList.get(mySetup.Date_Field__c));
            StartDateDelta = StartDateDelta.addDays( Integer.valueof( dayDelta ) );
            if( !endDateMissing ) {
                DateTime EndDateDelta = DateTime.ValueOf(mUpdateList.get(mySetup.End_Date_Field__c));
                EndDateDelta = EndDateDelta.addDays( Integer.valueof( dayDelta ) );
                mUpdateList.put(mySetup.End_Date_Field__c, EndDateDelta);
            }
            mUpdateList.put(mySetup.Date_Field__c, StartDateDelta);
                
            update mUpdateList;
        }
        else if( mUpdateList != null && minDelta != '' && dayDelta == '' && isDateTime ) {
            // Update Minute Mode (Week,Day Adjust)
            DateTime StartDateDelta = DateTime.ValueOf(mUpdateList.get(mySetup.Date_Field__c));
            StartDateDelta = StartDateDelta.addMinutes( Integer.valueof( minDelta ) );
            if( !endDateMissing ) {
                DateTime EndDateDelta = DateTime.ValueOf(mUpdateList.get(mySetup.End_Date_Field__c));
                EndDateDelta = EndDateDelta.addMinutes( Integer.valueof( minDelta ) );
                mUpdateList.put(mySetup.End_Date_Field__c, EndDateDelta);
            }
            mUpdateList.put(mySetup.Date_Field__c, StartDateDelta);
            update mUpdateList;
        }
        else if( mUpdateList != null && dayDelta != '' && !isDateTime ) {
            // Update Day Mode (Month Adjust)
            Date StartDateDelta = Date.ValueOf(mUpdateList.get(mySetup.Date_Field__c));
            StartDateDelta = StartDateDelta.addDays( Integer.valueof( dayDelta ) );
            if( !endDateMissing ) {
                Date EndDateDelta = Date.ValueOf(mUpdateList.get(mySetup.End_Date_Field__c));
                EndDateDelta = EndDateDelta.addDays( Integer.valueof( dayDelta ) );
                mUpdateList.put(mySetup.End_Date_Field__c, EndDateDelta);
            }
            mUpdateList.put(mySetup.Date_Field__c, StartDateDelta);

            update mUpdateList;
        }
        
        return null;
    }
    
    /* Default Constructor */
    public QuickCalendarDisplay() {
        GrabSetup();
        PopulateList();
        PopulateInternalJS();
    }
    
    /* Grabs the Setup Record (QuickCalendarData__c) for this calendar */
    public void GrabSetup() {
        mySetup = new QuickCalendarData__c();
        mySetup = [Select q.SObject_Name__c, q.Title_Field__c, q.Date_Field__c, q.Color_Field__c, q.End_Date_Field__c, q.Background__c From QuickCalendarData__c q Limit 1];
    }
    
    /* Runs the SOQL query to grab all records */
    public void PopulateList() {
        String soql = '';
        if( mySetup.Color_Field__c == 'NA' ) {
            soql = 'Select ' + mySetup.Title_Field__c + ',' + mySetup.Date_Field__c + ',' + mySetup.End_Date_Field__c + ' From ' + mySetup.SObject_Name__c + ' ';
        } else {
            soql = 'Select ' + mySetup.Title_Field__c + ',' + mySetup.Date_Field__c + ',' + mySetup.Color_Field__c + ',' + mySetup.End_Date_Field__c + ' From ' + mySetup.SObject_Name__c + ' ';            
        }
        if( mySetup.End_Date_Field__c == 'NA' ) {
            soql = soql.replace( ','+mySetup.End_Date_Field__c, '' );
            endDateMissing = true;
        } else {
            endDateMissing = false; 
        }
        myObjectList = Database.Query(soql);
    }
    
    public void PopulateInternalJS() {
        if( mySetup == null ) { jsCodeBehind = 'alert(\'Incomplete Setup\');'; return;}
        jsCodeBehind = '$(\'#calendar\').fullCalendar({header:{left:\'prev,next today\',center: \'title\',right: \'month,agendaWeek,agendaDay\'},editable:true,events: [';
        integer ctr = 0;
        isDateTime = false;
        for( SObject x : myObjectList ) {
            // Start Date
            String dT = String.valueof(x.get(mySetup.Date_Field__c));
            DateTime d = DateTime.Now();
            /* Check for empty dateTime */
            if( dT == null || dT == '' ) { continue; }
            /* Check for datetime or date sobject */
            if( dT.length() > 9 && !dt.substring(10,dt.length()).contains('00:00:00'))
            {
                d = DateTime.ValueOf(x.get(mySetup.Date_Field__c));
                isDateTime = true;
            } else {
                d = Date.ValueOf(dT.substring(0,10));
            }
            
            String edT = '';
            if( !endDateMissing ) {
                // End Date
                edT = String.valueof(x.get(mySetup.End_Date_Field__c));
            } else {
                edT = String.valueof(x.get(mySetup.Date_Field__c));
            }
            DateTime ed = DateTime.Now();
            /* Check for empty dateTime */
            if( edT == null || edT == '' ) { continue; }
            /* Check for datetime or date sobject */            
            if( edT.length() > 10 && !edt.substring(10,edt.length()).contains('00:00:00'))
            {
                ed = DateTime.ValueOf(x.get(mySetup.End_Date_Field__c));
                isDateTime = true;
            } else {
                ed = Date.ValueOf(edT.substring(0,10));
            }
           
            /* Add comma separator */
            if( ctr != 0 ) { jsCodeBehind += ','; }
            /* Add Title */
            jsCodeBehind += '{' + 'title: \'' + x.get(mySetup.Title_Field__c) + '\'';
            /* Add Date or DateTime Start Date */
            if( isDateTime ) {
                jsCodeBehind += '' + ',start: new Date(' + d.year() + ',' + (d.month()-1) + ',' + d.day() + ',' + d.hour() + ',' + d.minute() + ')';
            } else {
                jsCodeBehind += '' + ',start: new Date(' + d.year() + ',' + (d.month()-1) + ',' + (d.day()+1) + ')';
            }    
            /* Add Date or DateTime End Date */            
            if( mySetup.End_Date_Field__c == 'NA' ) {
                if( isDateTime ) {
                    jsCodeBehind += '' + ',end: new Date(' + d.year() + ',' + (d.month()-1) + ',' + d.day() + ',' + d.hour() + ',' + d.minute() + ')';
                    jsCodeBehind += ',allDay: false';
                } else {
                    jsCodeBehind += '' + ',end: new Date(' + d.year() + ',' + (d.month()-1) + ',' + (d.day()+1) + ')';
                }
            } else if (mySetup.End_Date_Field__c != 'NA') {
                if( isDateTime ) {
                    jsCodeBehind += '' + ',end: new Date(' + ed.year() + ',' + (ed.month()-1) + ',' + ed.day() + ',' + ed.hour() + ',' + d.minute() + ')';
                    jsCodeBehind += ',allDay: false';
                } else {
                    jsCodeBehind += '' + ',end: new Date(' + ed.year() + ',' + (ed.month()-1) + ',' + (ed.day()+1) + ')';
                }
            }
            
            /* Add Event Color */
            if( mySetup.Color_Field__c != 'NA' ) {
                jsCodeBehind += '\n,backgroundColor: \'' + x.get(mySetup.Color_Field__c) + '\'';
                //jsCodeBehind += '\n,textColor: \'white\',';
            }
            
            /* Add url to Event */
            jsCodeBehind += '\n,url: ' + '\'/' + x.ID + '\' ';
            jsCodeBehind += '\n}';
            ctr++;
        }
        jsCodeBehind += '],\n';
        
        /* Event Click Function */
        jsCodeBehind += 
            'eventClick: function(event) {' +
            '    if (event.url) {' +
            '        window.open(event.url);' +
            //'    $(\'#popup2\').bPopup({content:\'iframe\', contentContainer:\'#pContent\', loadUrl: event.url});' + 
            '        return false;' +
            '    } }';
            
        /* Event Drop Function */
        jsCodeBehind += 
            ',eventDrop: function(event,dayDelta,minuteDelta,allDay,revertFunc) {' +
            '    UpdateEventAF(event.url,dayDelta,minuteDelta); ' +
            '}';

        jsCodeBehind += '});';
    }
}