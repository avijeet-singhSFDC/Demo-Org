define(["jquery",
        "underscore",
        "backbone",
        "Views/HomePageView",
        "Views/CommunitySelectionPageView",
        "Views/SideMenuView",
        "Views/ArticleView",
        "Views/SearchPageView",
        "Views/ZonePageView",
        "Views/ArticlePageView",
        "Views/QuestionPageView",
        "Views/CasePageView",
        "Views/UserView",
        "Views/QuestionCreateView",
        "Views/LongerListView",
        "Models/Login",
        "Views/ProfilePageView",
        "Views/ProfileQuestionsList",
        "Views/ProfileCasesList",
	"Views/contactModule/contactUsModule"], function($,_,Backbone,HomePageView,CommunitySelectionPageView,
        									SideMenuView, ArticleView,SearchPageView,ZonePageView,
        									ArticlePageView,QuestionPageView,CasePageView,
        									UserView,QuestionCreateView,LongerListView,Login,
        									ProfilePageView, ProfileQListView,ProfileCListView,ContactUsModule ){

var AppView = Backbone.View.extend({

	initialize: function(){
		//Initializing main views
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.canUseProfile = Um.modules.canAccess('Profile');

		this.currentSiteData = this.getCurrentSiteData();
		this.hostingSingleCommunity
		this.currentUser = new UserView({userDetails: this.options.session});
		this.homePageView = new HomePageView({homeData : this.currentSiteData });
		if (Um.modules.canAccess('Questions'))
			this.communitySelectionPageView = new CommunitySelectionPageView();
		this.sideMenuView = new SideMenuView();
		this.loginModel = new Login();
		Backbone.Events.bind("doTransition",this.doTransition,this);
		Backbone.Events.bind("doTransitionSide",this.doTransitionSide,this);
		//setCurrentUser
		Um.dispatcher.trigger("setCurrentUser", this.options.session);
		window.Um.dispatcher.trigger("backFromLogin");

		if (!this.canUseQuestions && this.canUseKB){
			Um.dispatcher.bind("getSingleCommunity",this.returnPKBCommunityModel,this);
			this.homePageView.community = this.generatePKBCommunity();
		}
		this.contactUsModule = new ContactUsModule();
	},

	setDispatcherEvents: function(){

	},

	generatePKBCommunity : function(){
		var CommunityModel = require("Models/Community");
		commModel = new CommunityModel();
		commModel.initWithouZone(this.currentSiteData);

		return commModel;
	},

	returnPKBCommunityModel : function(obj){

		commModel = this.generatePKBCommunity();
		if (typeof obj != 'object'){
			Um.dispatcher.trigger("sendSingleCommunity",commModel);
		}else{
			fullRet = _.extend({community : commModel}, obj.opDetails);
			obj.instance[''+obj.method+''](fullRet);
		}


	},

	getCurrentSiteData: function(){
		var ret;
		if (window.siteData != undefined){
			ret = window.siteData;
		}
		window.siteData = undefined;
		return ret;
	},

	/**
		Zone Home page
	**/

	initAZonePage: function(id){
		Um.dispatcher.trigger("getSingleCommunity",{
	 		opDetails : {},
	 		idCommunity : id,
	        instance : this,
	        method : "initAZonePageCallback"
	    });

	},

	initAZonePageCallback: function(data){
		if (  data != undefined &&  data.community != undefined  ){
			if (this.zonePageView!=undefined) this.zonePageView.destroyView();
			this.zonePageView = new ZonePageView(data);
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},

	/**
		Zone Longer List page
	**/
	initZonePageLongerList: function(id,startOn){

	 	Um.dispatcher.trigger("getSingleCommunity",{
	 		opDetails : { selTab : startOn},
	 		idCommunity : id,
	        instance : this,
	        method : "initZonePageLongerListCallback"
	    });

	},

	initZonePageLongerListCallback: function(data){
		if (  data != undefined &&  data.community != undefined  ){
			if (this.zonePageView!=undefined) this.zonePageView.destroyView();

			this.zonePageView = new ZonePageView(data);
			this.zonePageView.seeMoreLink();

		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},


	/**
		Search page
	**/

	initASearchPage: function(id, str,tab){
	 	Um.dispatcher.trigger("getSingleCommunity",{
	 		opDetails : {searchStr : str, selTab : tab},
	 		idCommunity : id,
	        instance : this,
	        method : "initASearchPageCallback"
	    });
	},

	initASearchPageCallback: function(data){
		if (  data != undefined &&  data.community != undefined ){
			var searchPageView = new SearchPageView (data);
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},

    /*  Detail view */
    initQuestionDetailPage: function(communityId,itemId){
    	if(Um.modules.canAccess('Questions')) {

			Um.dispatcher.trigger("getSingleCommunity",{
		 		opDetails : {questionId : itemId},
		 		idCommunity : communityId,
		        instance : this,
		        method : "questionDetailCallback"
		    });
		}else{
			alert('QUESTIONS IS DISABLED!!!');
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
    },

    questionDetailCallback : function(data){

		if (  data != undefined &&  data.community != undefined  ){
			 var questionPageView = new QuestionPageView (data);
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},


    initArticleDetailPage : function(communityId,itemId){
    	if(Um.modules.canAccess('KB')){
			//from a Zone
			Um.dispatcher.trigger("getSingleCommunity",{
		 		opDetails : {articleId : itemId},
		 		idCommunity : communityId,
		        instance : this,
		        method : "articleDetailCallback"
		    });

    	}else{
			alert('KB IS DISABLED!!!');
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
    },

    articleDetailCallback: function(data){
		if (  data != undefined &&  data.community != undefined ){
			 var articlePageView = new ArticlePageView (data);
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},

	initQuestionCreatePage : function (communityId,str){
		if(Um.modules.canAccess('Questions')) {

			Um.dispatcher.trigger("getSingleCommunity",{
		 		opDetails : {searchStr : str},
		 		idCommunity : communityId,
		        instance : this,
		        method : "questionCreateCallback"
		    });

		}
	},
    questionCreateCallback : function(data){

		if (  data != undefined &&  data.community != undefined  ){
			 var questionCreateView = new QuestionCreateView (data);
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},



	/*  Detail view */
    initQuestionPDetailPage: function(communityId,caseId){
    	if(Um.modules.canAccess('Questions')) {

			Um.dispatcher.trigger("getSingleCommunity",{
		 		opDetails : {caseId : caseId},
		 		idCommunity : communityId,
		        instance : this,
		        method : "questionPDetailCallback"
		    });
		}else{
			alert('QUESTIONS IS DISABLED!!!');
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
    },

    questionPDetailCallback : function(data){

		if (  data != undefined &&  data.community != undefined  ){
			 var casePageView = new CasePageView (data);
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},

	/* initCaseDetailPage */
	initCaseDetailPage : function(caseId){
	 var casePageView = new CasePageView ({caseId : caseId});
	},


	/*
		profile detail page
	*/

    initProfileDetailPage: function(itemId){
    	var data = {
			 		opDetails : {profileId : itemId},
			 		profileId : itemId,
			 		idCommunity : "-1",
			        instance : this,
			        method : "profileDetailCallback"
	    };

    	if (this.canUseKB || this.canUseQuestions){
			Um.dispatcher.trigger("getSingleCommunity",data);
    	}else{
			var profView = new ProfilePageView (data);
    	}


	},
    profileDetailCallback : function(data){

		if (  data != undefined &&  data.community != undefined  ){
			 var profView = new ProfilePageView (data);
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},

    initProfileQuestionsPage: function(itemId){

		Um.dispatcher.trigger("getSingleCommunity",{
	 		opDetails : {profileId : itemId},
	 		idCommunity : "-1",
	        instance : this,
	        method : "profileQuestionsCallback"
	    });

	},
    profileQuestionsCallback : function(data){

		if (  data != undefined &&  data.community != undefined  ){
			 var profileQuestionsView = new ProfileQListView (data);
			 profileQuestionsView.render();
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},


    initProfileCasesPage: function(itemId){

		var data = {
	 		opDetails : {profileId : itemId},
			profileId : itemId,
	 		idCommunity : "-1",
	        instance : this,
	        method : "profileQCasesCallback"
	    };

		if (this.canUseKB || this.canUseQuestions){
			Um.dispatcher.trigger("getSingleCommunity",data);
    	}else{
			var profileCasesView = new ProfileCListView (data);
			profileCasesView.render();
    	}


	},
    profileQCasesCallback : function(data){

		if (  data != undefined &&  data.community != undefined  ){
			 var profileCasesView = new ProfileCListView (data);
			 profileCasesView.render();
		}else{
			//As community doesn't exist, just redirect to home no cache for url
			Um.dispatcher.trigger({
				route   : "app/home",
                trigger : true,
                replace : true});
		}
	},


	doTransition: function(elm){
		window.Um.transitionsQueue.push();
		//Fix for duplicated event fire
		if ( elm.hasClass('tActive') ) return;
		//Lets check direction [0=forward,1=backwards]
		var moveTo = Um.transitionsQueue.slideTo;

		$('.leftT').removeClass('leftT');
		$('.rightT').removeClass('rightT');

		if(moveTo==0){
			$('.tActive').addClass('leftT').removeClass("pageInT").removeClass("tActive");
			elm.addClass("rightT");
		}else{
			$('.tActive').addClass('rightT').removeClass("pageInT").removeClass("tActive");
			elm.addClass("leftT");
		}
		elm.addClass("tActive");

		setTimeout(function(){
			$.each( $('#b_appLayer > div') , function(i,e){
				if (!$(e).hasClass("tActive")){
					$(e).empty().off();
					$(e).removeClass("leftT").removeClass("rightT");
					$(e).removeClass("pageInT");
				}
			} );
		},300);
		$('.sideMenuView').addClass("sideMenuClosed");
		setTimeout(function(){ elm.addClass("pageInT").removeClass("rightT").removeClass("leftT") },100);
		$('.overlay').empty().off().remove();

		window.scrollTo(0,1);
		setTimeout(function(){ $('#b_appLayer').removeClass('transScroll'); },250);
		$('#b_appLayer').addClass('sideMenuOpenBody');
		_.each( $('#b_appLayer > div') , function(elm){
    			$(elm).attr('style', function(i, style){
					return '';
				});
		});
		setTimeout(function(){
			$('#b_appLayer').removeClass('sideMenuOpenBody');
			Um.dispatcher.trigger("launchContactFooter");
		},700);
	},

	doTransitionSide: function(elm){
		elm.removeClass("sideMenuClosed");
		window.setTimeout(function(){
			$(".overlay").click(_.once(function(e){
				elm.addClass("sideMenuClosed");
				window.setTimeout(function(){$('#b_appLayer').removeClass('sideMenuOpenBody')},1500);
				$('.tActiveBlocked').attr('style', function(i, style){
					return '';
				});
				$('.overlay').empty().off().remove();
			}));
		}, 1000);
	}
});
return AppView;
});
