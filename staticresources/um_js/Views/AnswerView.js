define(["jquery",
        "underscore",
        "backbone",
        "Models/Answer"], function($,_,Backbone,Answer){

var AnswerView = Backbone.View.extend({

    model: Answer,

    tagName: "li",

    initialize: function(args){
        this.dispatcher = args.dispatcher;
        this.setDispatcherEvents();
        this.model.on('change',this.renderPublic,this);
        this.model.on('bestAnswerUpdated', this.handleBestUpdateCallback,this)
    },

    setDispatcherEvents: function(){
    },

    events: {
        "click #b_replyBest"        : "setAsBestAnswer",
        "click #b_replyRemoveBest"  : "unSetAsBestAnswer",
        "click #b_flagReply"        : "flagAnswer",
        "click #b_addVoteUpReply"   : "addLikeVote",
        "click #b_replyMoreActions" : "showMoreMenu",
        "click .b_ReplyAuthorLink"  : "displayProfile"
    },



    showMoreMenu : function (e){
        this.$el.find('.iconWr').toggle();
        if (this.$el.find('.iconWr').is(':visible')){
            $(e.target).removeClass('questionMore').addClass('questionMoreActive');
        }else{
            $(e.target).removeClass('questionMoreActive').addClass('questionMore');
        }
    },

    /**
            Deselect the answer as the best - only author
    **/
    unSetAsBestAnswer : function(e){

       if (   !this.model.get('IAmQuestionAuthor') ) return;
        this.controlSession("unSetAsBestAnswerCallback");
    },

    unSetAsBestAnswerCallback : function (){
        //console.log('ANSWER : REMOVE bestAnswer for ['+this.cid+']'+this.model.get('Body') );
        this.model.selectAsBestAnswer(-1);
    },

    /**
            Select the answer as the best - author and not selected currently
    **/
    setAsBestAnswer: function(e){

        if ( this.model.get('isBestAnswer') || !this.model.get('IAmQuestionAuthor') ) return;
        this.controlSession("setAsBestAnswerCallback");
    },

    setAsBestAnswerCallback : function (){
        //console.log('ANSWER : Add bestAnswer for ['+this.cid+']'+this.model.get('Body') );
        this.model.selectAsBestAnswer(1);
    },


    /**
            Flag current reply - not flagged already
    **/
    flagAnswer: function(e){
        if ( this.model.get('FlaggedIt') ) return;
        this.controlSession("flagAnswerCallback");
    },

    flagAnswerCallback : function (valid){

        if (!valid) {
            if  ( confirm('You need to login')){
                Um.dispatcher.trigger("loginLaunch","login");
            }
        }else{
            this.model.flagReply();
        }
    },


    /**
            Add Like vote - not author, not voted yet
    **/
    addLikeVote: function(e){
        if ( this.model.get('LikeIt') || this.model.get('IAmAuthor') ) return;

        this.controlSession("addLikeCallback");
    },

    addLikeCallback : function (valid){
        if (!valid) {
            if  ( confirm('You need to login')){
                Um.dispatcher.trigger("loginLaunch","login");
            }
        }else{
            this.model.addLike();
        }
    },

    renderPublic: function(){

        if (this.model.get('isPrivate')) return;

        this.$el.empty().off();
        this.undelegateEvents();

        this.template = _.template($('#answerItemView_tpl').html());
        data = _.extend({}, this.model.tidy().attributes);
        this.$el.html(this.template(data));


        this.delegateEvents();

        this.$el.find('.iconWr').hide();

        return this;
    },

    handleBestUpdateCallback : function (){

        /*  if (this.model.previousAttributes().isBestAnswer)
                console.log('BEST UPDATED : '+this.model.get('Body') +'trigger Update cid '+this.cid);
            else
                console.log('BEST REMOVED : '+this.model.get('Body') +'trigger Update cid '+this.cid);
        */
            Um.dispatcher.trigger("bestAnswerUpdate",this);

    },

    renderPrivate: function(){
        this.$el.empty().off();
        this.template = _.template($('#answerPrivateItemView_tpl').html());
        this.$el.html(this.template(this.model.tidy().toJSON()));
        this.undelegateEvents(); this.delegateEvents();
        return this;
    },

    displayProfile : function(e){

        e.stopImmediatePropagation();

        if (this.model.get('isAgent')) return;

        Um.dispatcher.trigger("navigate",{
            route   : "app/profile/"+this.model.get('CreatedById')+"/",
            trigger : true,
            replace : false
        });

    },
    controlSession : function(callTo){

        Um.dispatcher.trigger("isValidSession",{
            opDetails : {},
            instance : this,
            method : callTo
        });

    },

    cleanUp : function (){
        console.log(' cleanUp for  cid '+this.cid);
        this.model.off(null, null, this);
        this.$el.empty().off( null, null, this );
        this.undelegateEvents();
    }


});
return AnswerView;
});