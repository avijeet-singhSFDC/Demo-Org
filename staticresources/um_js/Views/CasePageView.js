define(["jquery",
        "underscore",
        "backbone",
        "Views/CaseView",
        "Views/AnswerView"], function($,_,Backbone,CaseView,AnswerView){

var casePageView = Backbone.View.extend({

    el: ".casePageView",

    caseTemplate : _.template($('#caseDetailPage_tpl').html()),

    privateQTemplate : _.template($('#privateQuestionDetailPage_tpl').html()),

    initialize: function(){

        this.community =  this.options.community;
        this.setDispatcherEvents();
        this.render();
        this.caseView = new CaseView();
        this.bind("sendQuestionsCol",this.renderRelatedSection,this);
        this.caseView.fetchFullDetails(this.community,this.options.caseId);


    },

    setDispatcherEvents: function(){

        Um.dispatcher.bind("sendCaseView",this.cViewReady,this);
    },

    events: {
        "click .topLeftBarButtonWrapper"        : "sideBarIconClick",
        "click .topLeftBarArrowWrapper"        : "backButtonClick",
        "click .topRigthBarIconWrapper"  : "goToSearch"

    },

    render: function(){
        Backbone.Events.trigger("doTransition",this.$el);
        if (this.community != undefined)
                this.$el.html(this.privateQTemplate());
            else
                this.$el.html(this.caseTemplate());


        this.delegateEvents();
        return this;
    },

    sideBarIconClick: function (){
        Um.dispatcher.trigger("sideBarIconClick");
    },

    goToSearch: function(){
        return;
    },


    backButtonClick: function(){


        //Sending to template the last url visited (if exist), cuz in case we come from home page or zone home page we should
        //display a back button in headers single item view or the profile button
        var buttonAsBack = null;
        if ( Um.transitionsQueue.queue.length > 2 ) {

            var url = Um.transitionsQueue.queue[Um.transitionsQueue.queue.length-2];
            if ( url.indexOf("app/contact") > -1 ) {
                     Um.dispatcher.trigger("navigate",{
                            route   : "app/home/",
                            trigger : true,
                            replace : false
                    });
            }
        }
        window.history.back();
    },

    cViewReady: function(view){
        this.qView =  view;
        view.renderFull();
        return this;
    },

    returnCaseView : function(){
        if ( this.model  != undefined ){
            Um.dispatcher.trigger("sendQuestionView",this);
        }
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
    }
});
return casePageView;
});