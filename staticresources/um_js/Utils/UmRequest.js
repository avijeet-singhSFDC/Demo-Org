define(["jquery",
        "underscore",
	      "backbone"], function($,_, Backbone){

    var UmRequest = function(){};

    _.extend(UmRequest.prototype, {

      /**
                  Chatter Answers requests
      **/
      buildForQuestionList : function (communityId){

        reqObj = new Object();
        reqObj.operationType ='getQuestions';
        reqObj.operationData = {
                                communityId : communityId,
                                topicName :"-1",
                                sortBy :'sortBy_POPULARITY'
                              };

            return reqObj;
      },


      buildForSearchQuestionList : function (communityId,searchStr){

        reqObj = new Object();
        reqObj.operationType ='searchQuestions';
        reqObj.operationData = {
            communityId : communityId,
            searchInput :searchStr,
            topicName :"-1",
            sortBy :'sortBy_POPULARITY'};

            return reqObj;
      },

      buildForQuestionDetail : function (communityId,qId){
        reqObj = new Object();
        reqObj.operationType ='getQuestionDetail';

        reqObj.operationData = {
                communityId : communityId,
                topicName :"-1",
                sortBy :'sortBy_POPULARITY',
                questionId : qId
              };

            return reqObj;
      },



      /**
                  Knowledge Base requests
      **/

      buildForArticlesList : function (communityId){

        reqObj = new Object();
        reqObj.operationType ='getArticles';
        reqObj.operationData = {
                                communityId : communityId,
                                topicName :"-1",
                                sortBy :'sortBy_POPULARITY'
                              };

            return reqObj;
      },

      buildForSearchArticleList : function (communityId,searchStr){
        reqObj = new Object();
        reqObj.operationType ='searchArticles';
        reqObj.operationData = {
            communityId : communityId,
            searchInput :searchStr,
            topicName :"-1",
            sortBy :'sortBy_POPULARITY'};

            return reqObj;
      },

      buildForFeaturedArticle : function (communityId,searchStr){
        reqObj = new Object();
        reqObj.operationType ='searchArticles';
        reqObj.operationData = {
            communityId : communityId,
            searchInput :searchStr,
            topicName :"-1",
            sortBy :'sortBy_POPULARITY'};

            return reqObj;
      },

      buildForFeaturedArticle : function (communityId,aNumber){
        reqObj = new Object();
        reqObj.operationType ='getFeaturedArticleDetail';

        reqObj.operationData = {
                communityId : communityId,
                topicName :"-1",
                sortBy :'sortBy_POPULARITY',
                articleNumber : aNumber
              };

            return reqObj;
      },

      buildForArticleDetail : function (communityId,aId){
        reqObj = new Object();
        reqObj.operationType ='getArticleDetail';

        reqObj.operationData = {
                communityId : communityId,
                topicName :"-1",
                sortBy :'sortBy_POPULARITY',
                articleId : aId
              };

            return reqObj;
      }


    });

    return UmRequest;
});