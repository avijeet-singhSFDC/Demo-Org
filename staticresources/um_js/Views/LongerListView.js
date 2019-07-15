define(["jquery",
        "underscore",
        "backbone",
        "Collections/Questions",
        "Collections/Articles",
        "Views/ArticleView",
        "Views/QuestionView",
        "Views/filtersSection"], function($,_,Backbone,Questions,Articles,ArticleView,QuestionView,filters){

var LongerListView = Backbone.View.extend({

	el: ".longerListView",

	initialize: function(){
		this.community = this.options.community;
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.filterBy = '';
		this.filterValues = [];
		this.sortBy = '';
		this.setEvents();

		this.listSelectorOpen = false;

		//Checking cookie for filters
		this.cookieExist = this.checkCookies();
		Um.dispatcher.on('closeFilters',this.closeFilters,this);
	},

	setEvents: function(){
		if (this.canUseKB){
			this.bind("getArticles",this.getArticlesCallback,this);
			this.bind("sendArticlesCol",this.getArticlesReady,this);
			this.bind("sendFullArticlesCol",this.getFullArticlesReady,this);
		}
		if (this.canUseQuestions){
			this.bind("getQuestions",this.getQuestionsCallback,this);
			this.bind("sendQuestionsCol",this.getQuestionsReady,this);
			this.bind("sendFullQuestionsCol",this.getFullQuestionsReady,this);
		}
        Um.dispatcher.bind("updateSort",function (by){
        	this.sortBy = by;
        },this);

        Um.dispatcher.bind("updateFilter",function (by){
        	escaped = $.trim(by).length==0 ? '' : by+'#';
        	this.filterBy =escaped;
        },this);
	},

	events: {
        "click .topLeftBarButtonWrapper"    : "sideBarIconClick",
		"click .topRigthBarIconWrapper"		: "searchIconClick",
		"click #b_loadMore"  		: "loadMore",
		"click .longerlistSelection" : "changeListDisplay",
		"click #b_filters"			: "handleFilters",
		"click #b_askFooterBtn"		: "startAskFlow",
		"click #b_doneFilter"		: "handleFilters"
	},

	render: function(){
		this.$el.empty().off();
		this.undelegateEvents();

		Backbone.Events.trigger("doTransition",this.$el);
		this.template = _.template($('#longerListPage_tpl').html());

		if ( this.canUseQuestions ){
			/* pkb and chattern answers*/
			if (this.options.selTab != undefined && (this.options.selTab =='q'|| this.options.selTab=='a')){
				this.activeTab = this.options.selTab;
			}else{
				this.activeTab = "q";
			}

			this.$el.html(this.template({
				publicName__c : this.community.get("publicName"),
				canUseKB : this.canUseKB,
				canUseQuestions : this.canUseQuestions,
				activeTab : this.activeTab
			}));
			//Setting background image
			if (this.canUseQuestions){
				this.$el.find('#b_backgroundImagePath__c').css({
					"backgroundImage"	: "url('"+this.community.get('urlForStaticResources')+"/"+this.community.get('backgroundImagePath__c')+"')"
				});
			}

			//add Ask Footer Section
			askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
			this.$el.find('#b_askOrSearchContainer').html(askSectionTPL());
			this.questions = new Questions([]);
			if (this.canUseKB){
				this.articles = new Articles([]);
			}

		}else{
			if (this.canUseKB){
				/* only pkb is enabled*/
				this.activeTab = "a";
				this.template = _.template($('#longerListPagePKB_tpl').html());
				this.$el.html(this.template());
				this.articles = new Articles([]);
			}

		}


/*


		//choose tab
		if (this.canUseQuestions && this.canUseKB ){
			if (this.options.selTab != undefined && (this.options.selTab =='q'|| this.options.selTab=='a')){
				this.activeTab = this.options.selTab;
			}
		}else if (this.canUseQuestions)
					this.activeTab = "q";
				else
					this.activeTab = "a";


		Backbone.Events.trigger("doTransition",this.$el);
		this.$el.html(this.template({
			publicName__c : this.community.get("publicName"),
			canUseKB : this.canUseKB,
			canUseQuestions : this.canUseQuestions,
			activeTab : this.activeTab
		}));
		//Setting background image
		if (this.canUseQuestions){
			this.$el.find('#b_backgroundImagePath__c').css({
				"backgroundImage"	: "url('"+this.community.get('urlForStaticResources')+"/"+this.community.get('backgroundImagePath__c')+"')"
			});
		}

		if (this.canUseQuestions){
			//add Ask Footer Section
			askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
			this.$el.find('#b_askOrSearchContainer').html(askSectionTPL());
			this.questions = new Questions([]);
		}else{
			this.template = _.template($('#longerListPagePKB_tpl').html());
			this.$el.html(this.template());
		}

		if (this.canUseKB){
			this.articles = new Articles([]);
		}
*/
		//filters added after template is in place

		this.communityId = this.community.get('id');
		this.topicsList = this.community.get('topics');

		this.filters = new filters({ topics: this.topicsList	,
									communityId : this.communityId});
		this.filters.on("reloadLists",this.reloadLists,this);
		this.filters.on("closedFiltersMenu",this.saveCookie,this);

		if (this.activeTab =='a'){
			if (this.cookieExist) this.reloadLists();
			else this.fetchArticles();
		}else{
			if (this.cookieExist) this.reloadLists();
			else this.fetchQuestions();
		}


		//Triger footer
		//Um.dispatcher.trigger("launchContactFooter");
		this.delegateEvents();
		return this;
	},

	startAskFlow : function (){
		Um.dispatcher.trigger("navigate",{
			route 	: "app/newQuestion/"+this.community.get('id'),
			trigger : true,
			replace	: false
		});
	},

	/** list selection methods **/
	changeListDisplay : function(e){
		e.preventDefault();
        e.stopPropagation();
        //this.handleFilters();
		//close filters
		this.filters.close(false);
		if ($(e.currentTarget).hasClass('activeListTab')){
			$(e.currentTarget).removeClass('activeListTab').addClass('selActiveListTab');
			$('.inactiveListTab').show();
			this.listSelectorOpen= true;
		}else{
			$(e.currentTarget).removeClass('selActiveListTab').addClass('activeListTab');
			$('.inactiveListTab').hide();

			this.listSelectorOpen= false;

			if ($(e.currentTarget).data().for != this.activeTab){
				this.resetFiltering();
				Um.dispatcher.trigger("navigate",{
					route 	: "app/zoneLongerList/"+this.community.get('id')+'/'+$(e.currentTarget).data().for,
					trigger : true,
					replace	: false
				});
			}


		}


	},

	closeFilters: function(){
		$('.selActiveListTab').removeClass('selActiveListTab').addClass('activeListTab');
		$('.inactiveListTab').hide();
	},

	/** filter methods **/

	resetFiltering : function(){
		this.filterBy = '';
		this.sortBy = '';
		if (this.canUseQuestions && this.activeTab =='q'){
			this.sortBy = 'sortBy_POPULARITY';
			this.questions.sortBy = this.sortBy;
			this.questions.filterBy = this.filterBy;
			this.questions.offset = 0;
		}
		if (this.canUseKB && this.activeTab !='q'){
			this.sortBy = 'sortBy_LAST_PUBLISHED';
			this.articles.sortBy = this.sortBy;
			this.articles.filterBy = this.filterBy;
			this.articles.offset = 0;
		}
	},

	handleFilters : function (){
		if (! this.filters.open ){
			this.filters.show({currentList : this.activeTab , sortBy : this.sortBy , filterBy : this.filterBy});
			$('#b_filters').addClass("filtersIconOpen");
		}else{
			this.filters.close(true);
			$('#b_filters').removeClass("filtersIconOpen");
		}
	},

	sideBarIconClick: function (){
		Um.dispatcher.trigger("sideBarIconClick");
	},

	backButtonClick: function(){
		window.history.back();
	},

	searchIconClick: function(){
		Um.dispatcher.trigger("navigate",{
			route 	: "app/search/"+this.community.get('id'),
			trigger : true,
			replace	: false
		});
	},

	loadMore: function(){
		if ( this.activeTab == "q" )
			this.fetchQuestions();
		else
			this.fetchArticles();
	},

	reloadLists: function (obj){
		dataCat = this.filterBy;//.replace(/#/g, ',');

		if (this.canUseQuestions && this.activeTab =='q' && this.questions != undefined){
			this.questions.sortBy = this.sortBy;
			this.questions.filterBy = dataCat;
			this.questions.offset = 0;
			this.fetchQuestions();
		}
		if (this.canUseKB && this.activeTab =='a' && this.articles != undefined){
			this.articles.sortBy = this.sortBy;
			this.articles.filterBy = dataCat;
			this.articles.offset = 0;
			this.fetchArticles();
		}
	},

	/**
		  Questions methods
	**/
	getQuestionsCallback: function(){
		var questions = new Questions([]);
		questions.fetchAllQuestions(this.community.get('id'),this,"sendQuestionsCol");
	},

	getQuestionsReady: function(collection){
		var ret = [];
		_.each(collection.models,function(item){
			ret.push( new QuestionView({ model : item}) );
		},this);
		this.trigger("sendQuestionsViews",ret);
	},

	getFullQuestionsReady: function(collection){

		var ret = [];
		_.each(collection.models,function(item){
			ret.push( new QuestionView({ model : item }) );
		},this);
		var container = $('<div/>');
		_.each(ret,function(item){
			container.append(item.renderSmall().el);
		},this);
		container = $(container).find("li");

		this.$el.find('#b_loadMore').hide();

		$(container).hide();
		var cont = this.$el.find('#b_listOfElements');
		$(cont).empty().off();
		$(cont).append($(container));

		if (collection.hasMore)
			this.$el.find('#b_loadMore').show();

		$(container).fadeIn();

	},

	fetchQuestions: function(){

		this.filters.close(false);
		this.questions.fetchAllQuestions(this.community.get('id'),this,"sendFullQuestionsCol");
	},

	/**
		  KB methods
	**/

	getArticlesCallback: function(){
		var articles = new Articles([]);
		articles.fetchAllArticles(this.community.get('id'),this,"sendArticlesCol");
	},

	getArticlesReady: function(collection){
		var ret = [];
		_.each(collection.models,function(item){
			ret.push( new ArticleView({ model : item }) );
		},this);
		this.trigger("sendArticlesViews",ret);
	},

	getFullArticlesReady: function(collection){
		var ret = [];
		this.$el.find('#b_loadMore').hide();
		_.each(collection.models,function(item){
			ret.push( new ArticleView({ model : item}) );
		},this);
		var container = $('<div/>');
		_.each(ret,function(item){
			container.append(item.renderSmall().el);
		},this);
		container = $(container).find("li");
		var cont = this.$el.find('#b_listOfElements');
		$(container).hide();
		$(cont).empty().off();
		$(cont).append(container);

		if (collection.hasMore)
			this.$el.find('#b_loadMore').show();

		$(container).fadeIn();
	},

	fetchArticles: function(){

		this.filters.close(false);
		this.articles.fetchAllArticles(this.community.get('id'),this,"sendFullArticlesCol");
	},

	saveCookie: function(){
		var path = Um.sitePrefix.length > 0 ? Um.sitePrefix : "/";
		var domain = "."+document.location.host;
		var data = JSON.stringify({
			activeTab : this.activeTab,
			sortBy : this.sortBy,
			filterBy : this.filterBy,
			zoneId : this.community.get('id')
		});
		Um.cookies.setItem("umFilters",data,null,path,domain,null);
	},

	checkCookies: function(){
		var domain = "."+document.location.host;
        var p = Um.sitePrefix.length > 0 ? Um.sitePrefix : "/";
		//let's check if cookie exists
		var c = Um.cookies.getItem("umFilters");
		if ( c === null ) return false;
		//Lets validate if cookie selected dataCategory still exists in our app
		var opt = JSON.parse(Um.cookies.getItem('umFilters'));
		opt = opt.filterBy.split(":");
		opt = opt.length>1 ? opt[1].replace("#","") : "";
		if(window.rootRelations[opt]===undefined){
			//need to delete cookie as is no longer a valid cookie
			Um.cookies.removeItem("umFilters",p,domain);
    		return false;
		}

		if (!this.canUseKB && opt.activeTab === "a"){
			Um.cookies.removeItem("umFilters",p,domain);
    		return false;
		}

		if (!this.canUseQuestions && opt.activeTab === "q"){
			Um.cookies.removeItem("umFilters",p,domain);
			return false;
		}

		if (this.community === undefined){
			Um.cookies.removeItem("umFilters",p,domain);
			return false;
		}

		if (this.community.get('id') != JSON.parse(Um.cookies.getItem("umFilters")).zoneId){
			Um.cookies.removeItem("umFilters",p,domain);
			return false;
		}

		var data = JSON.parse(c);
		this.activeTab = data.activeTab;
		this.sortBy = data.sortBy;
		this.filterBy = data.filterBy;

		//uncomment next lines if you want to delete the cookies after using it for one time
		//var path = Um.sitePrefix.length > 0 ? Um.sitePrefix : "/";
		//Um.cookies.removeItem("umFilters",path,"."+document.location.host);
		return true;
	}
});
return LongerListView;
});
