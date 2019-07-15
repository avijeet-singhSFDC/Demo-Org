define(["jquery",
        "underscore",
        "backbone",
        "Collections/Articles",
        "Views/ArticleView"], function($,_,Backbone,Articles,ArticleView){

var HomeArticleListView = Backbone.View.extend({

	el: "#b_listOfElementsContainer",

	initialize: function(){

		console.log('init home article list   View');

		this.render();
		this.articles = new Articles([]);
		this.articles.fetchAllArticles('-1',this,"sendArticlesCol");
		this.setEvents();
	},

	setEvents: function(){
		this.bind("getArticles",this.getArticlesCallback,this);
		this.bind("sendArticlesCol",this.getArticlesReady,this);
		this.bind("sendFullArticlesCol",this.getFullArticlesReady,this);
	},

	events: {
		"click #b_loadMore"  		: "loadMore"
	},

	render: function(){
		this.undelegateEvents();
		this.template = _.template($('#homeArticleList_tpl').html());

		this.$el.html(this.template());

		this.delegateEvents();
		return this;
	},
	
	loadMore: function (){
		Um.dispatcher.trigger("navigate",{
			route 	: "app/zoneLongerList/-1/",
			trigger : true,
			replace	: false
		});
	},

	/**
		  KB methods
	**/

	 
	getArticlesReady: function(collection){
		var container = this.$el.find('#b_listOfElements').empty().off();
		var count = 0;
		_.each(collection.models,function(item){
			artView = new ArticleView({ model : item });
			if (count < 3) container.append(artView.renderSmall().el);
			count++;
		},this); 
	}
});
return HomeArticleListView;
});
