define(["jquery",
        "underscore",
        "backbone",
        "Utils/cam_Utils",
        "Collections/Answers"], function($,_,Backbone,utilsObj,AnswersCol){


var Answer = Backbone.Model.extend({

   utils : new utilsObj,

    tidy : function (){

        if (this.get('Body') == undefined){
            this.set('Body','');
        }

        if (this.get('CommentBody') != undefined){
            var tmpTxt = this.utils.tidyCaseComment(this.get('CommentBody'));
            this.set('CommentBodyEdit',_.escape(tmpTxt));
        }


        //calculate elapsed time
        CreatedDate = this.get('CreatedDate');
        CreatedDateElap = this.get('CreatedDateElap');
        this.set('elapsedDate', this.utils.parseElapsedDate(CreatedDate, CreatedDateElap));

        if (typeof this.get('CreatorName') == "object" ){
             this.set('AuthorName',_.escape(this.get('CreatorName').Name));
        }else{
            this.set('AuthorName',_.escape(this.get('CreatorName')));
        }





        return this;
    },

    newReply : function(){
        if (Um.modules.canAccess('Questions')){
            req =Um.modules.modelFor('Questions');
            req.operationType = 'addReply';
        }
        else{
            if (Um.modules.canAccess('Case')){
                req =Um.modules.modelFor('Case');
                req.operationType = 'addCaseComment';
            }
        }

        self = this;
        req.operationData = this.attributes;

        //validate
        if (this.get('Body').length > 5000){
            self.trigger('createError', 'Reply body can be at most 5000 characters');
            return;
        }


        var self = this;
        umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
            if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                    Um.dispatcher.trigger("OPERATION_ERROR",r.message);
                    self.trigger('createError', r.responseBody.message);
            }else{

                 if (r.responseBody  != undefined) {
                    if (self.get('isPrivate')){
                        if (r.responseBody.privateReplies != undefined && Um.modules.canAccess('Questions')){
                            self.trigger('replySubmitPrivateSuccess',r.responseBody.privateReplies );
                        }else{
                            self.trigger('replySubmitPrivateSuccess',r.responseBody);
                        }
                    }else{
                        if (r.responseBody.publicReplies != undefined)
                            self.trigger('replySubmitSuccess',r.responseBody.publicReplies );
                    }
            }
        }
        }, true, this);
    },

    addLike : function(){

        req =Um.modules.modelFor('Questions');
        req.operationType = 'addLikeVoteReply';
        req.operationData = _.extend(req.operationData,
                                {   communityId : this.get('CommunityId'),
                                    topicName :"-1",
                                    replyId : this.get('Id')
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

    flagReply : function(){

        req =Um.modules.modelFor('Questions');
        req.operationType = 'addReportOnReply';
        req.operationData = _.extend(req.operationData,
                                {   communityId : this.get('CommunityId'),
                                    topicName :"-1",
                                    replyId : this.get('Id')
                                });

        var self = this;
        umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
            if (!r.isSuccess  ) {
                Um.dispatcher.trigger("FATAL_ERROR",r.responseBody);
            }else{
                  self.set({FlaggedIt: !self.get("FlaggedIt") });
            }
        }, true, this);
    },

    selectAsBestAnswer : function(type){

        rId = (type == 1) ? this.get('Id'): '-1';

        req =Um.modules.modelFor('Questions');
        req.operationType = 'selectAsBestAnswer';
        req.operationData = _.extend(req.operationData,
                                {   communityId : this.get('CommunityId'),
                                    topicName :"-1",
                                    replyId : rId,
                                    questionId : this.get('QuestionId')
                                });

        var self = this;
        umProxy.getRemoteAction(JSON.stringify(req),function (r,e){
            if (!r.isSuccess  ) {
                console.log('[REMOTE ERROR]:');
                console.log(result.responseBody);
                Um.dispatcher.trigger("FATAL_ERROR",r.responseBody);
            }else{

                self.set({isBestAnswer: !self.get("isBestAnswer") });
                self.trigger('bestAnswerUpdated');
            }
        }, true, this);
    }
});

return Answer;
});