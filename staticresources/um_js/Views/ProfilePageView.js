define(["jquery",
        "underscore",
        "backbone",
        "Views/UserView",
        "Models/Profile",
        "Views/ProfileQuestionsList",
        "Views/ProfileCasesList"], function($,_,Backbone,UserView, ProfileModel,ProfileQListView,ProfileCListView){

var ProfilePageView = Backbone.View.extend({

    el: ".profilePageView",

    template : _.template($('#profileDetailPage_tpl').html()),

    initialize: function(){

        this.canUseCases = Um.modules.canAccess('ContactUS');
        this.canUseQuestions = Um.modules.canAccess('Questions');

        this.authorId = this.options.profileId;
        this.getCurrentSession();
        this.articleModel = null;
        //instantiante questions col to display short list
        this.questionsList = new ProfileQListView(this.options);//
        this.casesList = new ProfileCListView(this.options);//
        this.setDispatcherEvents();

        //instantiante profile model to fetch user details
        this.profileModel = new ProfileModel();
        this.profileModel.fetch(-1,this.authorId);
        this.profileModel.on("modelFetched",this.render,this);
    },

    setDispatcherEvents: function(){
        this.questionsList.bind("sendProfileQuestionsViews",this.questionsReady,this);
        this.casesList.bind("sendProfileCasesViews",this.casesReady,this);

        Um.dispatcher.bind("currentSessionDetails",this.buildFromSession,this);
    },

    events: {
        "click .topLeftBarArrowWrapper"        : "backArrowClick",
        "click #b_settings"         : "goToSettings",
        "click #b_seemoreCases"     : "seeMoreLinkEvent",
        "click #b_seemoreQuestions" : "seeMoreLinkEvent",
        "click #b_askFooterBtn"     : "startAskFlow"

    },

    render: function(){
        Backbone.Events.trigger("doTransition",this.$el);
        this.undelegateEvents();
        data = _.extend(this.profileModel.tidy().toJSON(),
                {   canUseCases : this.canUseCases && this.profileModel.get('profileIsMine') ,
                    canUseQuestions : this.canUseQuestions})
        this.$el.html(this.template(data));
        this.delegateEvents();

        if (this.canUseQuestions)
            this.resolveQuestions();

        if (this.canUseCases && this.profileModel.get('profileIsMine'))
            this.resolveCases();

        //add Ask Footer Section
        if (Um.modules.canAccess('Questions')){
            askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
            this.$el.find('#b_askOrSearchContainer').html(askSectionTPL());
        }

        //Triger footer
        //Um.dispatcher.trigger("launchContactFooter");

        return this;
    },

    goToSettings : function(){
        console.log('tbd');
    },

    backArrowClick: function (){

        window.history.back();
    },

    startAskFlow : function (){

        Um.dispatcher.trigger("navigate",{
                    route   : "app/zoneSelection",
                    trigger : true,
                    replace : false
                });
            Um.dispatcher.trigger("addSubscriber","app/zoneSelection",this,"communityClickedToAsk");
    },

    communityClickedToAsk : function (communityId){
         Um.dispatcher.trigger("navigate",{
            route     : "app/newQuestion/"+communityId.get('id'),
            trigger : true,
            replace    : true
        });
    },

    seeMoreLinkEvent: function(e){

        if ($(e.currentTarget).data().for == 'questions'){
            routTo = "app/profileQuestions/"+this.authorId+"/";
        }else{
            routTo = "app/profileCases/"+this.authorId+"/";
        }

        Um.dispatcher.trigger("navigate",{
            route   : routTo,
            trigger : true,
            replace : false
        });
    },

    getCurrentSession : function (){

        Um.dispatcher.trigger("getCurrentUser",{
            instance : this,
            method : "storeSessionData"
        });

    },

    storeSessionData : function (data){
        if (this.currentSession == undefined && typeof data == "object"){
            this.currentSession = data;
        }

    },

    /* profile questions short list*/

    resolveQuestions: function(){
        this.questionsList.profileIsMine = this.profileModel.get('profileIsMine');
        this.questionsList.bind("sendProfileQuestionsViews",_.once(this.questionsReady),this);
        this.questionsList.trigger("getQuestions");
    },


    questionsReady: function(collectionViews){
        var container = this.$el.find('#b_listOfQuestions').empty().off();
        this.$el.find('#b_listOfQuestions').hide();
        var count = 0;
        _.each(collectionViews,function(item){
            if (count < 3) container.append(item.renderSmall().el);
            count++;
        },this);
        this.$el.find('#b_listOfQuestions').fadeIn();
    },
    /* profile Support Requests short list */

    resolveCases: function(){

        this.casesList.profileIsMine = this.profileModel.get('profileIsMine');
        this.casesList.bind("sendProfileCasesViews",_.once(this.casesReady),this);
        this.casesList.trigger("getCases");
    },

    casesReady: function(collectionViews){
        var container = this.$el.find('#b_listOfCases').empty().off();
        this.$el.find('#b_listOfCases').hide();
        var count = 0;

        _.each(collectionViews,function(item){
            if (count < 3) container.append(item.renderCaseSmall().el);
            count++;
        },this);
        this.$el.find('#b_listOfCases').fadeIn();
    },



});
return ProfilePageView;
});
