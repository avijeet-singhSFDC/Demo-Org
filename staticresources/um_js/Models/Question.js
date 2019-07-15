define(["jquery",
        "underscore",
        "backbone",
        "Utils/cam_Utils",
        "Collections/Answers"], function($,_,Backbone,utilsObj,AnswersCol){


var Question = Backbone.Model.extend({

	utils : new utilsObj,

	defaults : {
		'Body' : '',
		'Title' : '',
		'Topic' : '',
		'Type' : 'public',
		'Step' : 0
	},



	tidy : function (isFullView){

		if (this.get('Body') == undefined){
			this.set('Body','');
			this.set('BodyShort','');
		}

		var bodyFieldValue = this.get('Body');
		var titleFieldValue = this.get('Title');

		if (isFullView){
			//Question Title
			titleFieldValue= _.escape(titleFieldValue);
	        //Question Body
	        this.set('BodyDisplay',bodyFieldValue);//_.escape(bodyFieldValue));
		}else{

			var tmpBody = this.utils.tidyQuestionBody(bodyFieldValue);
			tmpLongText = this.utils.cutAt(tmpBody,140);
			this.set('BodyShort',tmpLongText);//_.escape(tmpLongText));
		}

		this.set('TitleDisplay',this.utils.tidyQuestionTitle(titleFieldValue));

		this.set('hasBestReply',this.get('BestReplyId') != undefined);

		//calculate elapsed time
		if (this.get('CreatedDate') != undefined){
			CreatedDate = this.get('CreatedDate');
			CreatedDateElap = this.get('CreatedDateElap');
			this.set('elapsedDate', this.utils.parseElapsedDate(CreatedDate, CreatedDateElap));
		}


		this.set('AuthorName',_.escape(this.get('CreatorName')));

		return this;
	},


	fetch: function(comId,qId ){
		req =Um.modules.modelFor('Questions');
        self = this;
		req.operationType = 'getQuestionDetail';
        req.operationData = _.extend(req.operationData,
		                        {   communityId : comId,
					                topicName :"-1",
					                sortBy :'sortBy_POPULARITY',
					                questionId : qId
		                		});


		var self = this;
		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                Um.dispatcher.trigger("FATAL_ERROR",r.message);
			}else{
				 if (r.responseBody.result){
                    //public replies
                    if ( r.responseBody.publicReplies != undefined){
	                    var publicRepliesList = new AnswersCol();
	                    publicRepliesList.add(r.responseBody.publicReplies);
	                    self.publicRepliesList = publicRepliesList;
                    }
                    //private replies
                    if ( r.responseBody.privateReplies != undefined){
	                    var privateRepliesList = new AnswersCol();
	                    privateRepliesList.add(r.responseBody.privateReplies);
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
    },


    checkFields : function (){
    	result = {
    		'Title' : {'status':true},
    		'Body' : {'status':true}
    	};
		data =Um.modules.modelFor('Questions');
		fieldLengths = data.operationData.fieldLengths;

		if (this.get('type')=='private'){
				maxT = fieldLengths.privateTitle;
				maxD = fieldLengths.privateBody;
		}else{
				maxT = fieldLengths.publicTitle;
				maxD = fieldLengths.publicBody;
		}

		 //validate
        if (this.get('Title').length > maxT){
        	result.Title = _.extend(result.Title,
        								{	'status' : false,
        									'msg' : 'Title can be at most '+maxT+' characters'});
        }
        if (this.get('Body').length > maxD){
        	result.Body = _.extend(result.Body,
        								{	'status' : false,
        									'msg' : 'Body can be at most '+maxD+' characters'});
        }

        return result;

    },


    saveQuestion : function (){
    	req =Um.modules.modelFor('Questions');
        self = this;
		req.operationType = 'createQuestion';
        req.operationData = this.attributes;


		var self = this;
		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
					console.log('CREATION ERROR ' + r.message);
					self.trigger('createError', r.message);
			}else{
					self.set('id',r.responseBody.result);
					self.trigger('createSuccess' );
			}
		}, true, this);
    },

	addLike : function (){

		req =Um.modules.modelFor('Questions');
       	req.operationType = 'addLikeVote';
        req.operationData = _.extend(req.operationData,
		                        { 	communityId : this.get('CommunityId'),
				                	topicName :"-1",
				                  	questionId : this.get('Id')
		                		});

		var self = this;
		var votesCount = parseInt( this.get("UpVotes") );
		votesCount++;

		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
				Um.dispatcher.trigger("FATAL_ERROR",r.responseBody);
			}else{
				 self.set({ UpVotes: votesCount, LikeIt: true });
			}
		}, true, this);

	},
	addAbuse : function (){

		req =Um.modules.modelFor('Questions');
       	req.operationType = 'addAbuse';
        req.operationData = _.extend(req.operationData,
		                        { 	communityId : this.get('CommunityId'),
				                	topicName :"-1",
				                  	questionId : this.get('Id')
		                		});

		var self = this;


		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
				Um.dispatcher.trigger("FATAL_ERROR",r.responseBody);
			}else{
				 self.set({FlaggedIt: true });
			}
		}, true, this);

	},
	updateSubscription: function (){

		req =Um.modules.modelFor('Questions');
       	req.operationType = 'updateSubscription';
        req.operationData = _.extend(req.operationData,
		                        { 	communityId : this.get('CommunityId'),
				                	topicName :"-1",
				                  	questionId : this.get('Id')
		                		});

		var self = this;


		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
				Um.dispatcher.trigger("FATAL_ERROR",r.responseBody);
			}else{
				 self.set({FollowingIt: !self.get("FollowingIt") });
			}
		}, true, this);

	},


});

return Question;
});