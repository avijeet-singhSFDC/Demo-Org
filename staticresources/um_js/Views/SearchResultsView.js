define(["jquery",
        "underscore",
        "backbone",
        "Collections/Questions",
        "Collections/Articles",
        "Views/ArticleView",
        "Views/QuestionView"], function($,_,Backbone,QuestionsCol,ArticlesCol,ArticleView,QuestionView){

var SearchResultsView = Backbone.View.extend({

	el: "#b_searchBody",

	template : _.template($('#searchResultsView_tpl').html()),

	initialize: function(){

		this.community =  this.options.community;
		this.searchStr = this.options.searchStr;
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.setEvents();
		this.render();
	},

	setEvents: function(){
		this.bind("getResultItems",this.getResultItemsCallback,this);
		this.bind("displayQuestionsResults",this.displayQuestionsResults,this);
		this.bind("displayArticlesResults",this.displayArticleResults,this);
	},

	events: {
		"click #b_loadMore"		: "loadMore",
		"click #b_quesNumber"	: "showQuestions",
		"click #b_artNumber"	: "showArticles",
		"click #b_askBtn"		: "goToAskForm",
		"click #b_askFooterBtn"	: "startAskFlow"
	},

	render: function(){
		this.$el.empty().off();
		this.undelegateEvents();
		this.$el.html(this.template({
			canUseKB : this.canUseKB,
			canUseQuestions : this.canUseQuestions
		}));
		this.delegateEvents();

        //Triger footer
        if ($.trim($('#contactUsContainer').html()) == "")
            Um.dispatcher.trigger("launchContactFooter");

		this.getResultItems();
		return this;
	},

	renderContactSection : function(){
		if (this.canUseQuestions){
			//add Ask Footer Section
			askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
			this.$el.find('#b_askOrSearchContainer').html(askSectionTPL());
		}
		//Triger footer
		//Um.dispatcher.trigger("launchContactFooter");
	},

	startAskFlow : function (){
		str='';
		if (this.searchStr != undefined)
			str = this.searchStr;

		Um.dispatcher.trigger("navigate",{
			route 	: "app/newQuestion/"+this.community.get('id')+'/'+str,
			trigger : true,
			replace	: false
		});
	},

	getResultItems: function(){

		if (this.canUseQuestions){
			this.$el.find('#deflectionItemsContainerQ').empty().remove();
			var questionsCol = new QuestionsCol([]);
			questionsCol.searchQuestions(this.community.get("id"),this.searchStr,this,"displayQuestionsResults");
			this.totalQuestions = -1;
			if (!this.canUseKB)
				this.showQuestions();
		}

		if (this.canUseKB){
			this.$el.find('#deflectionItemsContainerA').empty().remove();
			var articlesCol = new ArticlesCol([]);

			articlesCol.searchArticles(this.community.get('id'),this.searchStr,this,"displayArticlesResults");
			this.totalArticles = -1;
			this.showArticles();
		}

	},


	backButtonClick: function(){
		window.history.back();
	},

	goToAskForm :function(e){

		Um.dispatcher.trigger("navigate",{
			route 	: "app/newQuestion/"+this.community.get('id')+"/"+this.searchStr,
			trigger : true,
			replace	: false,
			requiresSession : true
		});
	},

	/**
			Questions Search methods
	**/

	showQuestions : function(){
		if (!this.canUseQuestions) return;
		//select Questions
		this.$el.find('#b_searchQuestionItems').show();
		this.$el.find('#b_questionsTab').removeClass('centered').addClass('centeredActive');

		//unselect Articles
		this.$el.find('#b_searchArticleItems').hide();
		this.$el.find('#b_articlesTab').removeClass('centered1Active').addClass('centered1');

	},

	/**
			Knowledge Search methods
	**/

	displayQuestionsResults: function(collection){
		if (!this.canUseQuestions) return;

		var itemContainer = this.$el.find('#b_searchQuestionItems').empty().off();
		_.each(collection.models,function(item){
			qView = new QuestionView({ model : item}) ;
			itemContainer.append(qView.renderSmall().el);
		},this);
		//update totals label
		this.totalQuestions = collection.models.length;
		this.$el.find('#b_totalQuestions').html(this.totalQuestions);

		this.displayNonEmptyList();

		this.renderContactSection();
	},

	displayArticleResults: function(collection){

		if (!this.canUseKB) return;

		var itemContainer = this.$el.find('#b_searchArticleItems').empty().off();
		_.each(collection.models,function(item){
			aView = new ArticleView({ model : item  }) ;
			itemContainer.append(aView.renderSmall().el);
		},this);
		//update totals label
		this.totalArticles = collection.models.length;
		this.$el.find('#b_totalArticles').html(this.totalArticles);
		this.displayNonEmptyList();

		this.renderContactSection();

	},

	showNoResultsMessage : function (){

		nadaTPL = _.template($('#searchNoResultsView_tpl').html());
		this.$el.find('#b_ResultContainer').html(nadaTPL({str : _.escape(this.searchStr)}));

		this.$el.find('#b_askOrSearchContainer').hide();

	},
	//by default display tab with content
	displayNonEmptyList : function(){

		if (this.totalArticles == 0 ){
			if (this.totalQuestions == 0){
				this.showNoResultsMessage();
				return;
			}
		}

		if (this.totalArticles == 0 && this.totalQuestions > 0){
				this.showQuestions()
		}else{
			this.showArticles();
		}

	},

	showArticles : function(){
		if (!this.canUseKB) return;
		//unselecte Questions
		this.$el.find('#b_searchQuestionItems').hide();
		this.$el.find('#b_questionsTab').removeClass('centeredActive').addClass('centered');

		//select Articles
		this.$el.find('#b_searchArticleItems').show();
		this.$el.find('#b_articlesTab').removeClass('centered1').addClass('centered1Active');


	},

	loadMore: function(){

	}
});
return SearchResultsView;
});