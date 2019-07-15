define(["jquery",
        "underscore",
        "backbone",
        "Models/Case"], function($,_,Backbone,Case){


var Cases = Backbone.Collection.extend({

    model:Case,

    offset : 0,

    hasMore : false,

    sortBy : "sortBy_RECENT",

    filterBy : "-1",

    filterByTotal : 0,

    initialize: function(models,args){
        this.reset();
    },


    fetchAllCases : function(communityId,profileId, instance,eventToTrigger){


        if (this.sortBy == '' || this.sortBy == undefined)
            this.sortBy = 'sortBy_RECENT';

        this.reqModel =Um.modules.modelFor('Case');
        this.reqModel.operationType = 'getCases';
        this.reqModel.operationData = _.extend(this.reqModel.operationData,
                        {   communityId : communityId,
                            authorId : profileId,
                            filterBy :this.filterBy,
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
                    this.add(new Case(item));
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

return Cases;
});
