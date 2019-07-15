define(["jquery",
        "underscore",
        "backbone",
        "Utils/cam_Utils",
        "Collections/Answers"], function($,_,Backbone,utilsObj,AnswersCol){


var Question = Backbone.Model.extend({

	utils : new utilsObj,

	tidy : function (isFullView){


		//tidy title
        if (this.get('Subject')  != undefined){
        	if (this.get('CommunityId') == undefined || this.get('CommunityId') == "" ){
          		this.set('SubjectDisplay',this.utils.tidyTitle(this.get('Subject')));
        	}else{
				if (isFullView)
					this.set('SubjectDisplay',_.escape(this.get('Subject')));
    			else
 					this.set('SubjectDisplay', this.get('Subject'));
        	}
        }else{
        	this.set('Subject','');
        }

		if (this.get('Description') == undefined){

			this.set('Description','');

		}else{

			if (this.get('CommunityId') == undefined || this.get('CommunityId') == ""){
				var tmpDesc = this.utils.tidyCaseDescription(this.get('Description'));
			}else{
				var tmpDesc = this.get('Description');//this.utils.tidyQuestionBody(this.get('Description'));
			}

			if (isFullView)
				this.set('DescriptionDisplay',tmpDesc);
			else
				this.set('DescriptionDisplay',_.unescape(tmpDesc));
		}

		//calculate elapsed time
		CreatedDate = this.get('CreatedDate');
		CreatedDateElap = this.get('CreatedDateElap');
		this.set('elapsedDate', this.utils.parseElapsedDate(CreatedDate, CreatedDateElap));

		//newStatus workingStatus closeStatus escalatedStatus
		switch(this.get('Status').toLowerCase()){
			case 'new' : cssClass = "newStatus";
			break;
			case 'working' : cssClass = "workingStatus";
			break;
			case 'escalated' : cssClass = "escalatedStatus";
			break;
			case 'closed' : cssClass = "closedStatus";
			break;
			default : cssClass = "newStatus";
		}
		this.set('statusCssClass',cssClass);


		if (this.get('UMCustomer_emoticon__c') == undefined){
			this.set('UMCustomer_emoticon__c','');
		}

		if (this.get('UMgeolocalization__Latitude__s') == undefined){
			this.set('UMgeolocalization__Latitude__s',0);
		}

		if (this.get('UMgeolocalization__Longitude__s') == undefined){
			this.set('UMgeolocalization__Longitude__s',0);
		}




		if (this.get('CommunityId') == undefined){
			this.set('CommunityId','');
		}


		this.set('AuthorName',_.escape(this.get('CreatorName')));


		this.set('NumReplies',0);

		return this;
	},


	fetch: function(comId,cId ){

		if (comId != "-1"){
			//request for private question
			req =Um.modules.modelFor('Questions');
			req.operationType = 'getPrivateQuestionDetail';
        	req.operationData = _.extend(req.operationData,
		                        {   communityId : comId,
					                topicName :"-1",
					                sortBy :'sortBy_RECENT',
					                caseId : cId
		                		});
		}else{
			//request for support request
			req =Um.modules.modelFor('Case');
			req.operationType = 'getCaseDetail';
        	req.operationData = _.extend(req.operationData,
		                        {   caseId : cId
		                		});

		}


		var self = this;
		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                Um.dispatcher.trigger("FATAL_ERROR",r.message);
			}else{
				 if (r.responseBody.result){
                    //private replies
                    if ( r.responseBody.replies != undefined){
	                    var privateRepliesList = new AnswersCol();
	                    privateRepliesList.add(r.responseBody.replies);
	                    self.privateRepliesList = privateRepliesList;
					}
                    self.set(r.responseBody.result);
					self.trigger('modelFetched');
					//session
	                if (r.session != undefined){
	                    //setCurrentUser
	                    Um.dispatcher.trigger("setCurrentUser", r.session);
	                }

	                self.loadAttachedImage();
                }
			}
		}, true, this);
    },

    loadAttachedImage : function (){
		//check for any attachments
		var self = this;
		umProxy.getAttachment(this.get('Id'),function(r,e){
			if (r.success){
				self.trigger('attachmentFetched', r.data);
			}else{
				console.log('NO ATTACHMENT ');
			}
		}, true,this);

    },



	resolveCase : function (cId){

		req =Um.modules.modelFor('Case');
		req.operationType = 'markAsCaseResolved';
    	req.operationData = _.extend(req.operationData,
	                        {   caseId : this.get('Id')
	                		});

		var self = this;
		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
				Um.dispatcher.trigger("FATAL_ERROR",r.responseBody);
			}else{
				  if (r.responseBody.result){
                    //private replies
                    if ( r.responseBody.replies != undefined){
	                    var privateRepliesList = new AnswersCol();
	                    privateRepliesList.add(r.responseBody.replies);
	                    self.privateRepliesList = privateRepliesList;
					}
                    self.set(r.responseBody.result);
					self.trigger('modelFetched');
					//session
	                if (r.session != undefined){
	                    //setCurrentUser
	                    Um.dispatcher.trigger("setCurrentUser", r.session);
	                }
                }
			}
		}, true, this);

	}




});

return Question;
});