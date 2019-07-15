define(["jquery",
        "underscore",
        "backbone",
        "Models/Article"], function($,_,Backbone,Article){


var Articles = Backbone.Collection.extend({
	model:Article,

    offset : 0,

    hasMore : false,

    sortBy : "sortBy_POPULARITY",

    filterBy : "-1",

	initialize: function(models,args){
        this.reset();
	},

	fetchAllArticles: function(communityId,instance,eventToTrigger){

        if (this.sortBy == '' || this.sortBy == undefined)
            this.sortBy = 'sortBy_POPULARITY';

        this.reqModel = Um.modules.modelFor('KB');
        this.reqModel.operationType = 'getArticles';
        this.reqModel.operationData = _.extend(this.reqModel.operationData,
                        {   communityId : communityId,
                            topicName :this.filterBy,
                            sortBy :this.sortBy,
                            offset : this.offset
                });

		var self = this;
        if (this.offset == 0){
           self.models =[];
        }
		umProxy.getRemoteAction(JSON.stringify(this.reqModel),function(result,event){
			if ( !result.isSuccess ){
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
				Um.dispatcher.trigger("FATAL_ERROR",result.message);
			}else{
				_.each(result.responseBody.resultList,function(item){
                    item = _.extend(item,{CommunityId :communityId });
					this.add(new Article(item));
				},self);
                self.offset = result.responseBody.offset;
                self.hasMore = result.responseBody.hasMore;
                if (result.session != undefined){
                    //setCurrentUser
                    Um.dispatcher.trigger("setCurrentUser", result.session);
                }
			}
            //always return
            instance.trigger(""+eventToTrigger+"",self);
		 }, true,this);
	},

    searchArticles: function(communityId,searchStr,instance,eventToTrigger){

        if (searchStr == undefined){
                Um.dispatcher.trigger("FATAL_ERROR",'search string is empty on searchArticles ');
                return;
        }else{
            searchStr = _.unescape(searchStr);
        }
        this.reqModel =Um.modules.modelFor('KB');
        this.reqModel.operationType = 'searchArticles';
        this.reqModel.operationData = _.extend(this.reqModel.operationData,
                        {   communityId : communityId,
                            topicName :"-1",
                            searchInput :searchStr,
                            sortBy :'sortBy_POPULARITY'
                });

       var self = this;
       self.models =[];
        umProxy.getRemoteAction(JSON.stringify(this.reqModel),function(result,event){
            if (!result.isSuccess  ){
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                Um.dispatcher.trigger("FATAL_ERROR",result.message);
            }else{
                _.each(result.responseBody.resultList,function(item){
                        var elm = new Article();
                         item = _.extend(item,{CommunityId :communityId })
                        elm.set(item);
                        this.add(elm);
                },self);
                //session
                if (result.session != undefined){
                    //setCurrentUser
                    Um.dispatcher.trigger("setCurrentUser", result.session);
                }
            }
            //always return
            instance.trigger(""+eventToTrigger+"",self);
         }, true,this);
    }
});
return Articles;
});