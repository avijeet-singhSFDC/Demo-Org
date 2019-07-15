define(["jquery",
        "underscore",
        "backbone",
        "Models/Question"], function($,_,Backbone,Question){


var Questions = Backbone.Collection.extend({

    model:Question,

    offset : 0,

    hasMore : true,

    sortBy : "sortBy_POPULARITY",

    filterBy : "-1",

    filterByTotal : 0,

    initialize: function(models,args){
        this.reset();
    },

    fetchAllQuestions: function(communityId,instance,eventToTrigger){


        if (this.sortBy == '' || this.sortBy == undefined)
            this.sortBy = 'sortBy_POPULARITY';

        this.reqModel =Um.modules.modelFor('Questions');
        this.reqModel.operationType = 'getQuestions';
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
            if (!result.isSuccess  ){
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                Um.dispatcher.trigger("FATAL_ERROR",result.message);
            }else{
                _.each(result.responseBody.resultList,function(item){
                    this.add(new Question(item));
                },self);
                self.offset = result.responseBody.offset;
                self.hasMore = result.responseBody.hasMore;
                instance.trigger(""+eventToTrigger+"",self);
                //session
                if (result.session != undefined){
                    //setCurrentUser
                    Um.dispatcher.trigger("setCurrentUser", result.session);
                }
            }
            //always return
            instance.trigger(""+eventToTrigger+"",self);
         }, true,this);
    },

    searchQuestions: function(communityId,searchStr,instance,eventToTrigger){

        if (searchStr == undefined){
            Um.dispatcher.trigger("FATAL_ERROR",'search string is empty on searchQuestions ');
            return;
        }else{
            searchStr = _.unescape(searchStr)
        }
        this.reqModel =Um.modules.modelFor('Questions');
        this.reqModel.operationType = 'searchQuestions';
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
                        this.add(new Question(item));
                },self);
                self.offset = result.responseBody.offset;
                //session
                if (result.session != undefined){
                    //setCurrentUser
                    Um.dispatcher.trigger("setCurrentUser", result.session);
                }
            }
            //always return
            instance.trigger(""+eventToTrigger+"",self);
         }, true,this);
    },

    fetchAllUserQuestions : function(communityId,profileId,questionType, instance,eventToTrigger){


        if (this.sortBy == '' || this.sortBy == undefined)
            this.sortBy = 'sortBy_POPULARITY';

        this.reqModel =Um.modules.modelFor('Questions');
        this.reqModel.operationType = 'getQuestions';
        this.reqModel.operationData = _.extend(this.reqModel.operationData,
                        {   communityId : communityId,
                            authorId : profileId,
                            topicName :this.filterBy,
                            sortBy :this.sortBy,
                            offset : this.offset,
                            questionsType: questionType
                });

        var self = this;
        if (this.offset == 0){
           self.models =[];
        }
        umProxy.getRemoteAction(JSON.stringify(this.reqModel),function(result,event){
            if (!result.isSuccess  ){
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                Um.dispatcher.trigger("FATAL_ERROR",result.message);
            }else{
                _.each(result.responseBody.resultList,function(item){
                    this.add(new Question(item));
                },self);
                self.offset = result.responseBody.offset;
                self.filterByTotal = result.responseBody.filterByTotal;
                self.hasMore = result.responseBody.hasMore;
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

return Questions;
});
