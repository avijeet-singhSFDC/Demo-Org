define(["jquery",
        "underscore",
        "backbone",
        "Views/ArticleView",
        "Collections/Articles"], function($,_,Backbone,ArticleView,ArticleList){

var ArticlePageView = Backbone.View.extend({

    el: ".articlePageView",

    template : _.template($('#articleDetailPage_tpl').html()),

    initialize: function(){
        this.community =  this.options.community;


        this.canUseKB = Um.modules.canAccess('KB');
        this.canUseQuestions = Um.modules.canAccess('Questions');

        this.getCurrentSession();

        this.setDispatcherEvents();
        this.articleModel = null;

        this.articleView = new ArticleView();
        this.bind("sendArticlesCol",this.renderRelatedSection,this);

        this.articleView.resolveArticleDetailView({
                    idCommunity : this.community.get('id'),
                    articleId : this.options.articleId,
                    container : this.$el.find("#b_articleDetail")
        });

        this.showRelated = ! (this.canUseQuestions &&  (this.community.get('id') == '-1') );

        this.render();
    },

    setDispatcherEvents: function(){
        Um.dispatcher.bind("currentSessionDetails",this.buildFromSession,this);
        Um.dispatcher.bind("sendArticleView",this.aViewReady,this);
    },

    events: {
        "click .topLeftBarButtonWrapper"    : "sideBarIconClick",
        "click .topRigthBarIconWrapper"  : "goToSearch",
        "click #b_viewMoreRelated"  : "viewMoreRelated",
        "click .topLeftBarArrowWrapper"       : "backButton",
        "click #b_askFooterBtn"     : "startAskFlow"
    },

    render: function(){
        this.undelegateEvents();
        this.$el.empty().off();
        Backbone.Events.trigger("doTransition",this.$el);
        this.undelegateEvents();
        //Sending to template the last url visited (if exist), cuz in case we come from home page or zone home page we should
        //display a back button in headers single item view or the profile button
        var buttonAsBack = null;
        if ( Um.transitionsQueue.queue.length < 2 ) buttonAsBack = false;
        else{
            var url = Um.transitionsQueue.queue[Um.transitionsQueue.queue.length-2];
            if ( url.indexOf("app/zone") > -1 ) buttonAsBack = true;
            if ( url.indexOf("app/home") > -1 ) buttonAsBack = true;
            if ( url.indexOf("app/contact") > -1 ) buttonAsBack = true;
            if ( url.indexOf("app/newQuestion") > -1 ) buttonAsBack = true;
            if ( url.indexOf("app/zoneLongerList") > -1 ) buttonAsBack = true;
            if ( url.indexOf("app/search") > -1 ) buttonAsBack = true;
        }

        this.$el.html(this.template({ backBtn : buttonAsBack,showRelated :this.showRelated }));
        this.$el.find('#b_relatedItems').hide();
        //add Ask Footer Section
        if (Um.modules.canAccess('Questions')){
            askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
            this.$el.find('#b_askOrSearchContainer').html(askSectionTPL());
        }

        this.delegateEvents();

        //Triger footer
        if ($.trim($('#contactUsContainer').html()) == "")
            Um.dispatcher.trigger("launchContactFooter");

        return this;
    },

    backButton: function(){
        window.history.back(1);
    },

   startAskFlow : function (){
        if (this.showRelated ){
            Um.dispatcher.trigger("navigate",{
                route   : "app/newQuestion/"+this.community.get('id'),
                trigger : true,
                replace : false
            });
        }else{

            Um.dispatcher.trigger("navigate",{
                        route   : "app/zoneSelection",
                        trigger : true,
                        replace : false
                    });
            Um.dispatcher.trigger("addSubscriber","app/zoneSelection",this,"communityClickedToAsk");
        }

    },

    communityClickedToAsk : function (communityId){
         Um.dispatcher.trigger("navigate",{
            route     : "app/newQuestion/"+communityId.get('id'),
            trigger : true,
            replace    : true
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


    aViewReady: function(aModel){

        Um.dispatcher.trigger("kavClickedForSidebar",aModel);

        if ( this.showRelated ){
            this.articleModel = aModel;
            var articles = new ArticleList([]);
            articles.searchArticles(this.community.get('id'),aModel.get('Title'),this,"sendArticlesCol");
        }
        return this;
    },

    sideBarIconClick: function (){
        Um.dispatcher.trigger("sideBarIconClick");
    },

    goToSearch: function(){

        if ( !this.showRelated ){
            Um.dispatcher.trigger("navigate",{
                route   : "app/zoneSelection",
                trigger : true,
                    replace : false
            });
            Um.dispatcher.trigger("addSubscriber","app/zoneSelection",this,"communityClickedForSearch");
        }else{

            Um.dispatcher.trigger("navigate",{
                route   : "app/search/"+this.community.get('id'),
                trigger : true,
                replace : false
            });

        }
    },

    communityClickedForSearch : function (communityId){
         Um.dispatcher.trigger("navigate",{
            route     : "app/search/"+communityId.get('id'),
            trigger : true,
            replace    : true
        });
    },



    viewMoreRelated : function (){
        if ( typeof this.articleModel == 'object'){
            Um.dispatcher.trigger("navigate",{
                route   : "app/search/"+this.community.get('id')+"/a/"+this.articleModel.get('Title'),
                trigger : true,
                replace : false
            });

        }
    },

    renderRelatedSection:function(collection){

        this.$el.find(".b_askFooterOuter").addClass('noBorderTop');
        if (_.size(collection) <= 1 ) return;

        this.$el.find("#b_relatedItems ul").empty().off();

        var queContainer = this.$el.find('#b_relatedItems ul').empty().off();

        _.each(collection.models,function(item){
            if (this.articleView.model.get('Id') != item.get('Id') &&
                queContainer.children().size() < 3){
                listViewItem = new ArticleView({ model : item}) ;

                queContainer.append(listViewItem.renderSmall().el);
            }
        },this);

        this.$el.find('#b_relatedItems').show();
        this.$el.find('#b_viewMoreRelated').show();
        this.$el.find(".b_askFooterOuter").removeClass('noBorderTop');
    }

});
return ArticlePageView;
});
