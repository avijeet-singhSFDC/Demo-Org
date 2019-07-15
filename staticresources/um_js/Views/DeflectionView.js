define(["jquery",
        "underscore",
        "backbone",
        "Collections/Questions",
        "Collections/Articles",
        "Views/ArticleView",
        "Views/QuestionView"], function($,_,Backbone,QuestionsCol,ArticlesCol,ArticleView,QuestionView){

var DeflectionView = Backbone.View.extend({


	initialize: function(){
		this.deflectQItems = [];
		this.deflectAItems = [];
		this.community =  this.options.community;
		this.searchStr = this.options.searchStr;
		this.deflectionCallBack = this.options.deflectionCallBack
		this.canUseKB = Um.modules.canAccess('KB');
		this.canUseQuestions = Um.modules.canAccess('Questions');
		this.setEvents();
	},

	setEvents: function(){
		this.bind("getResultItems",this.getResultItemsCallback,this);
		this.bind("addDeflectionQResults",this.addDeflectionQResults,this);
		this.bind("addDeflectionAResults",this.addDeflectionAResults,this);
	},

	events: {},

	render: function(){

		return this;
	},

	fetchResults : function(){
		this.totalQuestions = -1;
		if (this.canUseQuestions){
			this.$el.find('#b_similarIssues').empty().remove();
			var questionsCol = new QuestionsCol([]);
			questionsCol.searchQuestions(this.community,this.searchStr,this,"addDeflectionQResults");
		}else{

			this.totalQuestions = 0;
		}
		this.totalArticles = -1;
		if (this.canUseKB){
			this.$el.find('#b_similarIssues').empty().remove();
			var articlesCol = new ArticlesCol([]);
			articlesCol.searchArticles(this.community,this.searchStr,this,"addDeflectionAResults");

		}else{
			this.totalArticles = 0;
		}

	},

	getResultItems: function(){
		this.displayDeflectionItems();
	},

	addDeflectionQResults: function(collection){
		if (!this.canUseQuestions) return;

		var itemContainer = this.$el.find('#b_searchQuestionItems').empty().off();
		_.each(collection.models,function(item){
			qView = new QuestionView({ model : item}) ;
			this.deflectQItems.push(qView);
		},this);
		this.totalQuestions = _.size(collection.models);

		this.checkEmptyDeflection();

	},

	addDeflectionAResults: function(collection){

		if (!this.canUseKB) return;

		var itemContainer = this.$el.find('#b_searchArticleItems').empty().off();
		_.each(collection.models,function(item){
			aView = new ArticleView({ model : item  }) ;
			this.deflectAItems.push(aView);
		},this);
		this.totalArticles = _.size(collection.models);

		this.checkEmptyDeflection();

	},

	checkEmptyDeflection : function (){

		if (this.totalArticles > -1 && this.totalQuestions > -1){
			var totalItems = (this.totalQuestions + this.totalArticles);
			Um.dispatcher.trigger(this.deflectionCallBack, totalItems, this.options.data);
		}

	},

	displayDeflectionItems : function(){

		if (this.totalArticles > -1 && this.totalQuestions > -1){
			$('#b_similarItemsSection').show();
			var self = this;
			//2 Q , 2 KAV
			// 0 Q and 4 KAV
			// 4 Q and 4 KAV
			if (this.totalQuestions == 0 ){
				//display 4 KAV
				this.deflectAItems= this.deflectAItems.slice(0,4);
				_.each(this.deflectAItems,function(item){
					self.$el.append(item.renderSmall().el);
				},this);

			}else{
				if (this.totalArticles == 0){
					//display 4 Q
					this.deflectQItems= this.deflectQItems.slice(0,4);
					_.each(this.deflectQItems,function(item){
						self.$el.append(item.renderSmall().el);
					},this);
				}else{
					//display 2 QA and 2 KAV
					this.deflectAItems= this.deflectAItems.slice(0,2);
					_.each(this.deflectAItems,function(item){
						self.$el.append(item.renderSmall().el);
					},this);

					this.deflectQItems= this.deflectQItems.slice(0,2);
					_.each(this.deflectQItems,function(item){
						self.$el.append(item.renderSmall().el);
					},this);
				}
			}
		}
	},

	cleanUp : function (){
		this.unbind();
		this.$el.empty().off();
    }
});
return DeflectionView;
});