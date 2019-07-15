define(["jquery",
        "underscore",
        "backbone",
        "Utils/cam_Utils"], function($,_,Backbone,utilsObj){


var Article = Backbone.Model.extend({

	utils : new utilsObj,

	tidy : function (isFullView){
		//calculate elapsed time
		lastP = this.get('LastPublishedDate');
		elap = this.get('CreatedDateElap');
		this.set('elapsedDate', this.utils.parseElapsedDate(lastP, elap));


		if (isFullView){
			this.set('TitleDisplay',_.escape(this.get('Title')));
		}else{

			this.set('TitleDisplay',this.get('Title'));//_.escape(this.get('Title')));
		}

		if (this.get('isAgent') != undefined && this.get('isAgent') ){
			this.set('BodyDisplay',this.utils.replaceTags(this.get('Body')));
		}else{
			this.set('BodyDisplay',this.utils.tidyTextContent(this.get('Body')));
		}


		//trim
		if (this.get('Summary')  != undefined){
			if (!isFullView){
				var tmpLongText = _.unescape(this.get('Summary'));
				tmpLongText = this.utils.cutAt(tmpLongText,140);
				this.set('SummaryShort',_.escape(tmpLongText));
			}
			this.set('SummaryDisplay',_.escape(this.get('Summary')));
        } else{
        	this.set('SummaryDisplay','');
        	this.set('SummaryShort','');
        }


		return this;
	},

	fetchFeatured: function(contxt){
		req = Um.modules.modelFor('KB');
        req.operationType = 'getFeaturedArticleDetail';
        req.operationData = _.extend(req.operationData,
		                        {   communityId : contxt.idCommunity,
					                topicName :"-1",
					                sortBy :'sortBy_POPULARITY',
					                articleNumber : contxt.articleNumber
		                		});

		var self = this;
		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                Um.dispatcher.trigger("FATAL_ERROR",r.message);
			}else{
				if (typeof r.responseBody == 'object' && r.responseBody.Id != undefined ){
					item = _.extend(r.responseBody,{CommunityId :contxt.idCommunity });
					self.set(item);
					self.trigger("fetchFeaturedCallback",contxt,self);
				}
				//session
                if (r.session != undefined){
                    //setCurrentUser
                    Um.dispatcher.trigger("setCurrentUser", r.session);
                }
			}
		}, true, this);
	},


	fetchFull : function(contxt ){

		req =Um.modules.modelFor('KB');
        req.operationType = 'getArticleDetail';
        req.operationData = _.extend(req.operationData,
		                        {   communityId : contxt.idCommunity,
					                topicName :"-1",
					                sortBy :'sortBy_POPULARITY',
					                articleId : contxt.articleId
		                		});

		var self = this;
		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                Um.dispatcher.trigger("FATAL_ERROR",r.responseBody);
			}else{
				if (typeof r.responseBody == 'object' && r.responseBody.Id != undefined ){
					item = _.extend(r.responseBody,{CommunityId :contxt.idCommunity });
					self.set(item);
					self.trigger("fetchFullCallback",contxt,self);
				}
				//session
                if (r.session != undefined){
                    //setCurrentUser
                    Um.dispatcher.trigger("setCurrentUser", r.session);
                }
			}
		}, true, this);
	},

	addLike : function (){

		req =Um.modules.modelFor('KB');
       	req.operationType = 'addLikeVoteKB';
        req.operationData = _.extend(req.operationData,
		                        { 	communityId : "-1",
				                	topicName :"-1",
				                  	articleId : this.get('KnowledgeArticleId')
		                		});

		var self = this;
		var votesCount = parseInt( this.get("Likes") );
		votesCount++;

		umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
			if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
				Um.dispatcher.trigger("FATAL_ERROR",r.responseBody);
			}else{
				 self.set({ Likes: votesCount, LikeIt: "true" });
			}
		}, true, this);

	}




});

return Article;
});