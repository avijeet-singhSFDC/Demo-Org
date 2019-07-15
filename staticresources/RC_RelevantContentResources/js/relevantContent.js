/*
	relevantContent.js Custom JavaScript for use with Relevant Content package
	Author: Mike Hineline

	Copyright (c) 2013, salesforce.com, Inc.
	All rights reserved.
	
	Redistribution and use in source and binary forms, with or without modification, 
	are permitted provided that the following conditions are met:
	
	    * Redistributions of source code must retain the above copyright notice, 
	    this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright notice, 
	    this list of conditions and the following disclaimer in the documentation 
	    and/or other materials provided with the distribution.
	    * Neither the name of the salesforce.com, Inc. nor the names of its contributors 
	    may be used to endorse or promote products derived from this software 
	    without specific prior written permission.
	
	THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND 
	ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED 
	WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. 
	IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, 
	INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, 
	BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, 
	DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF 
	LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE 
	OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
	OF THE POSSIBILITY OF SUCH DAMAGE.

*/
		/* 
			RC_getPageFormat - get the pageFormat string based on the user's UI
			Inputs: none
			Output: String pageFormat = console, mobile, or aloha
		*/
		function RC_getPageFormat() {
			// Detect the page format
			var pageFormat = "aloha";
			if((typeof sforce != 'undefined') && (sforce != null)) {
				// If sforce is defined, the page is in the Salesforce Console or Salesforce1 mobile app
				if (sforce.console.isInConsole()) {
					// In Salesforce Console
					pageFormat = "console";
				} else if ((typeof sforce.one != 'undefined') && (sforce.one != null)) {
					// In Salesforce1 mobile app
					pageFormat = "mobile";
				}
			} else {
				// Default to aloha
				pageFormat = "aloha";
			}
			// Return the page format
			return pageFormat;
        } 

		/*
			RC_openSubtab - open a new subtab in the Salesforce console as a subtab of the enclosing primary tab
			Inputs:
				- String url - URL to open in the subtab
				- String tabTitle - title of the console subtab
			Returns: none
		*/
		function RC_openSubtab(url,tabTitle) {
			var RC_openSubtabFunction = function RC_openSubtabFunction(result) {
				// Open a new subtab with primaryTabId=result.id, url=url,active=true,tabLabel=tabTitle,id=null (create new subtab),callback=N/A,name=N/A
				sforce.console.openSubtab(result.id,url,true,tabTitle,null);
			}
			sforce.console.getEnclosingPrimaryTabId(RC_openSubtabFunction);
		}

		/*
			RC_openRecord - open a Salesforce record page specific to the UI:
				- Salesforce console: a new tab is opened containing the record
				- Salesforce1 mobile app: the record is navigated to
				- Aloha UI: the record is opened in a new window (/browser tab)
			Inputs:
				- ID recordID - ID of the record to which to navigate
				- String tabType:
					- primary - open a new primary tab
					- sub - open a new subtab
				- String targetLabel - title of the console tab (input null or empty string ('') to accept default label) [should be passed URI encoded]
				- String targetAction:
					- view - open the record for viewing
					- edit - open the record for editing
					- close - open the URL with delete rendering where available (console, aloha, NOT Salesforce1)
					- new - create a new record [NOTE: needs more work as only a new Task is included currently]
				- String entityName - name of the object (e.g. Task) [NOTE: needs more work as only a new Task is included currently]
			Returns: none
		*/
		function RC_openRecord(recordID, tabType, targetLabel, targetAction, entityName) {
			// Initial recordID cleanup
			if (recordID != null) {
				recordID = decodeURI(recordID);

				// Set the default 'URL' to be the recordID
				var thisURL = '/' + recordID;

				// Detect Content which will be displayed instead of Files in the Salesforce console & Aloha UI
				// 	Note: Content & Files both use 069 IDs.  If entityType = 'Files' (or anything other than 'Content')
				//		the record will be opened as a File in Aloha and the Console  
				if (entityName == 'Content' && (recordID.substring(0,3) == '069' || recordID.substring(0,3) == '068')) {
					thisURL = encodeURI('/sfc/#version/' + recordID);
				}
			}

			// Initial targetLabel cleanup
			targetLabel = decodeURI(targetLabel);

			// Append appropriate modifier based on targetAction
			if (targetAction == 'close') {
				// close/edit modifier
				thisURL += '/e?close=1&cancelURL=%2F' + recordID;
			} else if (targetAction == 'edit') {
				// edit modifier
				thisURL += '/e';
			} else if (targetAction == 'new') {
				// new URL (overwrites initialized default)
				if (entityName == 'Task') {
					thisURL = '/00T/e';
				}
			}
			
			// Determine the UI
			var pageFormat = RC_getPageFormat();
	
			// Form the appropriate javascript function based on the UI the user is using
			if (pageFormat == 'console') {
				// Open the targetURL in a new console tab
				if (tabType == 'sub') {
					if(targetLabel == null || targetLabel == '') targetLabel = '';
					// Open a new sub tab
					RC_openSubtab(thisURL, targetLabel);
				} else {
					// Open a new primary tab
					// Paramters: id=null (new tab), url=thisURL, active=true, tabLabel=targetLabel, callback=N/A
					if(targetLabel == null || targetLabel == '') {
						sforce.console.openPrimaryTab(null, thisURL, true);
					} else {
						sforce.console.openPrimaryTab(null, thisURL, true, targetLabel);
					}
				}
			} else if (pageFormat == 'mobile') {
				if (targetAction == 'edit') {
					// Open the record for editing in Salesforce1
					sforce.one.editRecord(recordID);
				} else if (targetAction == 'new') {
					// Open the record for editing in Salesforce1
					sforce.one.createRecord(entityName);
				} else {
					// Default (including targetAction == 'view'): open the recordID for viewing in Salesforce1
					sforce.one.navigateToSObject(recordID);
				}
			} else {
				// Open record using normal browser window.open commands (for the Aloha UI)
				window.open(thisURL,recordID);
			}
		}

		/*
			RC_launchAttachFileModal - open and initialize the attach file to record modal dialogue 
			Input:
				ID contentId - ID of the piece of Content to be attached to the record
				String contentTitle - Title of the piece of Content to be attached to the record
				String iconFilePath - Location of the filetype icon for this piece of Content
				String iconFilename - Filename of the filetype icon for this piece of Content
			Returns:
				- None
		*/
		function RC_launchAttachFileModal(contentId,contentTitle,iconFilePath,iconFilename) {
			// Set the attachmentModal Filename, removing the auto-generated isdtp query string parameter
			var thisIconFilename = iconFilePath.replace(/\?isdtp=../,'');
			thisIconFilename += iconFilename;
			// Set the attachmentModal modalContentId value the ID of this content
			$( '#modalContentId' ).val(contentId);
			
			// Set the attachmentModal icon filename
			$( '#attachmentModalIconFilename' ).attr("src",thisIconFilename); 
			
			// Set the attachmentModal Content title
			$( '#attachmentModalFileTitle' ).html(contentTitle); 
			
			// Open the attachmentModal
			$( '#attachmentModal' ).modal();
			
			// Focus the Comment textbox
			$('#attachmentModal').on('shown.bs.modal', function() {
				$('#modalCommentBody').focus();
			});
		}
		
		/*
			RC_clearAttachFileModal - clear the variables in the attach file to record modal dialogue 
				and close (hide) it
			Input:
				- None
			Returns:
				- None
		*/
		function RC_clearAttachFileModal() {
			// Close the attachmentModal
			$( '#attachmentModal' ).modal('hide');

			// Clear the attachmentModal Filename
			$( '#modalContentId' ).val('');
			
			// Clear the attachmentModal icon filename
			$( '#attachmentModalIconFilename' ).attr('src','/s.gif'); 
			
			// Clear the attachmentModal Content title
			$( '#attachmentModalFileTitle' ).html(''); 

			// Clear the attachmentModal comments
			$( '#modalCommentBody' ).val('');

			// Clear the attachmentModal messages and hide the container
			$( '#attachmentModalMessage' ).html('');
			$( '#attachmentModalMessageContainer').addClass('hidden');
		}

		/*
			RC_attachFile - attach piece of Content to the Chatter feed of the current record 
				by performing a webservices call to the controller
			Input:
				ID contentId - ID of the piece of Content to be attached to the record
				ID parentRecordId - ID of the record to which this piece of Content will be attached
				String commentBody - (optional) body of the Chatter post accompanying the Content 
			Returns:
				- None (asynchronous)
			Action:
				- Javascript remote call to Apex controller to create Chatter post
				- Notify user of success/failure
		*/
		function RC_postFileToFeed(contentId,parentRecordId,commentBody) {
			// Clear the attachmentModal messages and hide the container
			$( '#attachmentModalMessage' ).html('');
			$( '#attachmentModalMessageContainer' ).addClass("hidden");

			// Set the commentBody to null if blank
			if(commentBody == '' || commentBody === undefined) {
				commentBody = null;
			}

			// JavasScript remote call to the controller
			RC_ContentSearch.postFileToFeed(
				contentId,
				parentRecordId,
				commentBody,
				function(result, event) {;
					if(event.status) {
						// Successful update actions
						if (result == true) {
							// The controller returned success
							// 	Close the modal
							RC_clearAttachFileModal();
							//	Make the attachment button green
							$("#contentAttachButton"+contentId).removeClass("btn-default");
							$("#contentAttachButton"+contentId).addClass("btn-success");
							// If in the console or Aloha, refresh the record page
							var pageFormat = RC_getPageFormat();
							if (pageFormat == "console") {
								// Callback function to refresh the tab with ID found by getEnclosingTabId (below)
								var RC_refreshSubtab = function RC_refreshSubtab(tabResult) {
									var thisTabId = tabResult.id;
									sforce.console.refreshSubtabById(thisTabId,true);
								};
								// Find the ID of the current tab and call the callback function RC_refreshSubtab to refresh it
								sforce.console.getEnclosingTabId(RC_refreshSubtab);
							}
						} else {
							// The controller returned false
							// Display an error message in the modal
							$("#attachmentModalMessage").html("<b>Error:</b> Content could not be attached");
							$("#attachmentModalMessageContainer").removeClass("hidden");
							// Make the attachment button red
							$("#contentAttachButton"+contentId).removeClass("btn-default");
							$("#contentAttachButton"+contentId).addClass("btn-danger");
						}
					} else if (event.type === 'exception') {
						// The controller returned an exception
						console.log('Error: ' + result);
						// Display an error message in the modal
						$("#attachmentModalMessage").html(event.message);
						$("#attachmentModalMessageContainer").removeClass("hidden");
						// Make the attachment button red
						$("#contentAttachButton"+contentId).removeClass("btn-default");
						$("#contentAttachButton"+contentId).addClass("btn-danger");
					} else {
						// Unknown exception actions
						console.log('An unknown error has occurred');
						// Display an error message in the modal
						$("#attachmentModalMessage").html(event.message);
						$("#attachmentModalMessageContainer").removeClass("hidden");
						// Make the attachment button red
						$("#contentAttachButton"+contentId).removeClass("btn-default");
						$("#contentAttachButton"+contentId).addClass("btn-danger");
					}
			},{escape: true});
		}
