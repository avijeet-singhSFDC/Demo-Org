define(["jquery",
        "underscore",
        "backbone",
        "appView"], function($,_,Backbone,AppView){

    var Router = Backbone.Router.extend({
        routes: {
            "app/profile/:id/"                          :   "profileDetail",
            "app/profileQuestions/:id/"                 :   "profileQuestions",
            "app/profileCases/:id/"                     :   "profileCases",
            "app/case/:id/"                             :   "caseDetail",
            "app/question/:comId/:id/"                  :   "questionDetail",
            "app/questionp/:comId/:id/"                 :   "questionPDetail",
            "app/newQuestion/:comId/:str"               :   "questionCreate",
            "app/newQuestion/:comId"                    :   "questionCreate",
            "app/article/:comId/:id/"                   :   "articleDetail",
     	    "app/search/:comId/:tab/:str"               :   "search",
            "app/search/:comId"                         :   "search",
            "app/zone/:id"                              :   "zonePage",
            "app/zoneSelection"                         :   "zoneSelection",
            "app/zoneLongerList/:communityId"           :   "zoneLongerList",
            "app/zoneLongerList/:communityId/:s"        :   "zoneLongerList",
            "app/home"                                  :   "home",
            "app/contact"                               :   "contactFlow",
            "app/contact/finalStep"                     :   "contactFlowFinalStep",
            "*actions"                                  :   "defaultRoute"
        },

        initialize: function(config){
            this.config = config;
            //Creating namespace
            window.Um.router = this;
            //Initializing events dispatcher
            this.setDispatcherEvents();
            //Initializing app Front Controller
            this.appView = new AppView(config);
            Um.dispatcher.trigger("backFromLogin");
        },

        setDispatcherEvents: function(){
            //Binding router events listener
            Um.dispatcher.bind("addSubscriber",this.addSubscriber,this);
            Um.dispatcher.bind("navigate",this.handleNavigation,this);
            Um.dispatcher.bind("FATAL_ERROR", this.declareError,this);
        },

        defaultRoute: function(){
            this.handleNavigation({
                route   : "app/home",
                trigger : true,
                replace : false
            });
            this.home();
        },

        handleNavigation: function(caller){
            if ( caller.requiresSession != undefined && ! this.appView.currentUser.validSession()){
                    /* if about to redirect to zoneSelection the comeback
                       should always be to Home page, unless we set the subscription again*/
                    this.appView.currentUser.promtLogin(caller);
            }else
                this.navigate( caller.route, { trigger : caller.trigger, replace : caller.replace } );
        },

        home: function(){
            this.cleanQueue();

            if (Um.modules.getSingleCommunity()!= null){
                var uniqueComId = Um.modules.getSingleCommunity().id;
                this.navigate( "app/zone/"+uniqueComId , { trigger :false, replace : true } );
                this.zonePage(uniqueComId);
            }else{
                this.appView.homePageView.render();
            }
        },

        zoneSelection: function(){
            this.cleanQueue();
            if (Um.modules.getSingleCommunity()!= null){
                var uniqueComId = Um.modules.getSingleCommunity().id;
                this.navigate( "app/zone/"+uniqueComId , { trigger :false, replace : true } );
                this.zonePage(uniqueComId);
            }else{
                this.appView.communitySelectionPageView.AfteSelect = this.search;
                this.appView.communitySelectionPageView.render();
            }
        },

        zonePage: function(communityId){
            this.cleanQueue();
            this.appView.initAZonePage(communityId);
        },

        zoneLongerList: function(communityId,startOn){
            this.cleanQueue();
            //if(communityId==="-1")return;
            this.appView.initZonePageLongerList(communityId,startOn);
        },

        search: function(comId,tab,str){
            this.cleanQueue();
            this.appView.initASearchPage(comId,str,tab);
        },

        zonePageList: function(communityId){
            this.cleanQueue();
            this.appView.initAZonePage(communityId);
        },

        questionPDetail: function (communityId,caseId){
            if (! this.appView.currentUser.validSession() ){
                this.defaultRoute();
                return;
            }
            this.appView.initQuestionPDetailPage(communityId,caseId);
        },

        questionDetail : function (communityId,questionId){
            this.appView.initQuestionDetailPage(communityId,questionId);
        },

        caseDetail : function (caseId){
            if (! this.appView.currentUser.validSession() ){
                this.defaultRoute();
                return;
            }
            this.appView.initCaseDetailPage(caseId);
        },

        articleDetail : function (communityId,articleId){
            this.appView.initArticleDetailPage(communityId,articleId);
        },

        profileDetail : function (profileId){
            this.appView.initProfileDetailPage(profileId);
        },

        profileQuestions : function (profileId){
            this.appView.initProfileQuestionsPage(profileId);
        },

        profileCases : function (profileId){
            if (! this.appView.currentUser.validSession() ){
                this.defaultRoute();
                return;
            }
            this.appView.initProfileCasesPage(profileId);
        },

        questionCreate : function(communityId,str){
            this.appView.initQuestionCreatePage(communityId,str);
        },

        addSubscriber: function(source,subscriber, method){
            switch(source){
                case "app/zoneSelection" : sourceObj =this.appView.communitySelectionPageView;
                break;
            }
            sourceObj.addSubscriber(subscriber, method);
        },

        declareError : function(data){
            switch (data.type){
                case '[SESSION_TIMED_OUT]' : alert(data.message);
                break;
            }
        },

        cleanQueue : function(){
            window.Um.ajaxQueue.cleanQueue();
        },

        contactFlow: function(){
            Um.dispatcher.trigger("contactFlow");
        },
        contactFlowFinalStep: function(){
            Um.dispatcher.trigger("contactFlowFinalStep");
        }
    });
return Router;
});
