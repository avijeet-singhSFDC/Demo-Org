define(["jquery",
        "underscore",
        "backbone",
        "Views/QuestionView",
        "Views/AnswerView",
        "Collections/Questions"], function($,_,Backbone,QuestionView,AnswerView,QuestionsList){

var QuestionPageView = Backbone.View.extend({

    el: ".questionPageView",

    template : _.template($('#questionDetailPage_tpl').html()),

    initialize: function(){

        this.community =  this.options.community;
        this.setDispatcherEvents();
        this.render();
        this.questionView = new QuestionView();
        this.bind("sendQuestionsCol",this.renderRelatedSection,this);
        this.questionView.fetchFullDetails(this.community,this.options.questionId);
    },

    setDispatcherEvents: function(){
        Um.dispatcher.bind("sendQuestionView",this.qViewReady,this);
    },

    events: {
        "click .topLeftBarButtonWrapper"      : "sideBarIconClick",
        "click .topRigthBarIconWrapper"    : "goToSearch",
        "click #b_viewMoreRelated"    : "viewMoreRelated",
        "click .topLeftBarArrowWrapper"         : "backButton",
        "click #b_askFooterBtn"       : "startAskFlow"
    },

    render: function(){
        this.undelegateEvents();
        this.$el.empty().off();
        Backbone.Events.trigger("doTransition",this.$el);
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
            if ( url.indexOf("app/profile") > -1 ) buttonAsBack = true;
        }
        this.$el.html(this.template( { backBtn : buttonAsBack } ));
        this.$el.find('#b_relatedItems').hide();
        this.delegateEvents();

        //add Ask Footer Section
        if (Um.modules.canAccess('Questions')){
            askSectionTPL = _.template($('#askQuestionBanner_tpl').html());
            this.$el.find('#b_askOrSearchContainer').html(askSectionTPL());
        }

        //Triger footer
        if ($.trim($('#contactUsContainer').html()) == "")
            Um.dispatcher.trigger("launchContactFooter");
        return this;
    },


    startAskFlow : function (){
        Um.dispatcher.trigger("navigate",{
            route   : "app/newQuestion/"+this.community.get('id'),
            trigger : true,
            replace : false
        });
    },


    backButton: function(){
        window.history.back(1);
    },

    qViewReady: function(view){
        this.qView =  view;
        view.renderFull();
        var questionRel = new QuestionsList([]);
        questionRel.searchQuestions(view.model.get('CommunityId'),view.model.get('Title'),this,"sendQuestionsCol");
        return this;
    },

    sideBarIconClick: function (){
        Um.dispatcher.trigger("sideBarIconClick");
    },

    goToSearch: function(){
        Um.dispatcher.trigger("navigate",{
            route   : "app/search/"+this.community.get('id'),
            trigger : true,
            replace : false
        });
    },

    viewMoreRelated : function (){
        if ( this.qView != undefined){
            Um.dispatcher.trigger("navigate",{
                route   : "app/search/"+this.qView.model.get('CommunityId')+"/q/"+this.qView.model.get('Title'),
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
            if (this.qView.model.get('Id') != item.get('Id')&&
                queContainer.children().size() < 3){
                qView = new QuestionView({ model : item}) ;
                queContainer.append(qView.renderSmall().el);
            }
        },this);
        this.$el.find('#b_relatedItems').show();
        this.$el.find('#b_viewMoreRelated').show();
        this.$el.find(".b_askFooterOuter").removeClass('noBorderTop');
    }
});
return QuestionPageView;
});