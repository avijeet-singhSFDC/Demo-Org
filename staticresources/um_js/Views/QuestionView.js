define(["jquery",
        "underscore",
        "backbone",
        "Models/Question",
        "Models/Answer",
        "Views/AnswerView"], function($,_,Backbone,Question,Answer,AnswerView){

var QuestionView = Backbone.View.extend({

	model: Question,

	tagName: "li",

	initialize: function(args){
		this.setDispatcherEvents();
		if (this.options != undefined && this.options.model != undefined  ){
			this.model = this.options.model;
		}else{
			this.model = new Question();
		}
		this.model.on("modelFetched",this.returnQuestionView,this);

    	//create model for replies
    	this.newReply = new Answer();
		this.newReply.on('replySubmitSuccess',this.renderNewReply,this);
        this.newReply.on('replySubmitPrivateSuccess',this.renderNewPrivateReply,this);
		this.newReply.on('replySubmitError',function(i){console.log(i);},this);

        this.publicRepliesModels = [];
        this.privateRepliesModels = [];

	},

	setDispatcherEvents: function(){
        Um.dispatcher.bind("reloadQuestionReplies",this.refreshAnswersList,this);
        Um.dispatcher.bind("bestAnswerUpdate",this.updateBestAnswer,this);
        Um.dispatcher.bind("newReplyUpdate",this.updateNewReply,this);
	},

	events: {
		"click" 						: "questionClicked",

        "click #b_QuestionMoreActions"	: "showMoreMenu",
        "click #b_addVoteUp"			: "addLikeVote",
        "click #b_reportAbuse"			: "addAbuseReport",
        "click #b_followQuestion"		: "updateSubscription",
        "click #b_unFollowQuestion"		: "updateSubscription",
        "click #b_shareViaMail"			: "sendPageLinkViaEmail",

        "click #b_submitReply"			: "submitReply",
        "click #b_showMoreContainter"	: "togglePreviusPublicReplies",
        "click #b_addReplyBtn"          : "focusOnReplyForm",

        "click #b_togglePrivateSection" : "togglePrivateSection",

        "click #b_submitPrivateReply"   : "submitPrivateReply",
        "keydown #b_addPrivateReply"    : "beginNewPrivateReply",

        "click .b_AuthorLink"         : "displayProfile"

	},

	questionClicked: function(e){
		Um.dispatcher.trigger("navigate",{
            route 	: "app/question/"+this.model.get('CommunityId')+"/"+this.model.get('Id')+"/",
            trigger : true,
            replace : false
        });
	},

	renderSmall: function(){
		this.template = _.template($('#questionItemView_tpl').html());
		this.$el.html(this.template(this.model.tidy(false).toJSON()));
		this.undelegateEvents(); this.delegateEvents();
		return this;
	},

	renderFull: function(){
		this.$el = $('#b_questionDetail');
		this.el = '#b_questionDetail';
        this.template = _.template($('#questionDetailView_tpl').html());
		this.$el.html(this.template(this.model.tidy(true).toJSON()));

        this.$el.find('#b_questionActionItems').hide();

		this.newReply.set('questionId',this.model.get('Id'));

 		//display public replies list
        self = this;
        if ( this.model.publicRepliesList != undefined){
            this.publicRepliesModels = this.model.publicRepliesList.models;
        	this.renderPublicReplies();
        }

 		//display private replies list
        if (this.model.privateRepliesList != undefined){
	        container = this.$el.find('#b_questionRepliesPrivate').empty().off();
	        _.each(this.model.privateRepliesList.models,function(item){
                this.renderSinglePrivateReply(item);
	        },this);
            this.$el.find('#b_PrivateSection').show();
            var currentCant = _.size(this.model.privateRepliesList.models);
            if(currentCant ==1){
                this.$el.find('#b_cantPrivate').html(currentCant + ' Private message with Support');
            }else{
                this.$el.find('#b_cantPrivate').html(currentCant + ' Private messages with Support');
            }
        }else{
            this.$el.find('#b_PrivateSection').hide();
            this.$el.find('#b_cantPrivate').html('');
        }

		this.undelegateEvents(); this.delegateEvents();

        this.checkStoredReply();
		return this;
	},

    renderSinglePrivateReply : function(repModel){
        container = this.$el.find('#b_questionRepliesPrivate');
        item  = new  AnswerView({model: repModel })
        container.append(item.renderPrivate().el);
    },


	render: function(){
		return this;
	},


	fetchFullDetails : function(comObject,qId){

		this.communityId = (typeof comObject == 'object' ? comObject.get('id') : '-1');
		this.model.fetch(this.communityId, qId );
	},

    renderPublicReplies : function(){
        if (this.repliewViewCol != undefined){
            _.each(this.repliewViewCol,function(i,e){
                i.cleanUp();
            });
        }
        this.repliewViewCol = [];
        var repliesCol = this.publicRepliesModels;
        repliesCol = _.sortBy(repliesCol, function(item){ return item.get('CreatedDate'); });
        //display public replies list
        if ( repliesCol != undefined  ){
            var container = this.$el.find('#b_questionRepliesPublic').empty().off();
            if ( repliesCol.length > 3){
                this.$el.find('#b_showMoreContainter').show();
            } else{
                this.$el.find('#b_showMoreContainter').hide();
            }
            this.currentBestAnswer = undefined;
            container.append('<li class="noHeight"></li>');
            _.each(repliesCol,function(item){
                this.renderSingleReply(item);
            },this);

            this.togglePreviusPublicReplies();
        }
    },

    renderSingleReply : function(repModel){
        var container = this.$el.find('#b_questionRepliesPublic');
        var bestAnswer = this.$el.find('#b_bestAnswerSection');
        item  = new  AnswerView({model: repModel})
        this.repliewViewCol.push(item);

        item.previousNode = $(container).find('li:last');
        listNode = item.renderPublic().el;

        if (repModel.get('isBestAnswer')) {
            //hide best answer in list
            this.currentBestAnswer = item ;
            bestAnswer.append( listNode);
        }else{
            container.append(listNode);
        }
    },


    togglePreviusPublicReplies: function (){

        publicRepliesFolded = this.$el.find('#b_questionRepliesPublic li:visible').size() < this.$el.find('#b_questionRepliesPublic li').size()

        if (publicRepliesFolded){
            this.$el.find('#b_questionRepliesPublic li').show();
            this.$el.find('#b_showMoreContainter span').text('less');
        }else{
            max = this.$el.find('#b_questionRepliesPublic li').size() -1;
            if (max > 3 ){
                this.$el.find('#b_questionRepliesPublic li').hide();
                startFrom = max - 3;
                this.$el.find('#b_questionRepliesPublic li:gt('+startFrom+')').show();
                this.$el.find('#b_showMoreContainter span').text('more');
            }

        }
    },


	returnQuestionView : function(){
		if ( this.model  != undefined ){
			Um.dispatcher.trigger("sendQuestionView",this);
		}
	},

    showMoreMenu : function (e){
        this.$el.find('#b_questionActionItems').toggle();
        if (this.$el.find('#b_questionActionItems').is(':visible')){
            $(e.target).removeClass('questionMore').addClass('questionMoreActive');
        }else{
            $(e.target).removeClass('questionMoreActive').addClass('questionMore');
        }
    },


    /*
        Actions on Question that reRender
    */

    addLikeVote : function (e){
        if ( this.model.get('LikeIt') || this.model.get('IAmAuthor') ) {
            console.log('YOU ALREADY LIKE  THIS or ARE THE AUTHOR');
            return;
        }
        this.controlSession("addLikeVoteCallback");

    },

    addLikeVoteCallback : function(valid){

        if (!valid) {
            if  ( confirm('You need to login')){
                Um.dispatcher.trigger("loginLaunch","login");
            }
        }else{
            console.log('add like : '+this.model.get('Title') );
            this.model.on('change',this.renderFull,this);
            this.model.addLike();
        }

    },


    addAbuseReport: function (e){
        if ( this.model.get('FlaggedId')  ) {
            console.log('YOU ALREADY FLAG  THIS');
            return;
        }

        this.controlSession("addAbuseReportCallback");

    },


    addAbuseReportCallback : function(valid){


        if (!valid) {
            if  ( confirm('You need to login')){
                Um.dispatcher.trigger("loginLaunch","login");
            }
        }else{
            this.model.on('change',this.renderFull,this);
            this.model.addAbuse();
        }


    },

    updateSubscription : function (e){
		if ( this.model.get('IAmAuthor') ) {
            console.log('YOU ARE THE AUTHOR');
            return;
        }

        this.controlSession("updateSubscriptionCallback");

    } ,

    updateSubscriptionCallback : function(valid){


        if (!valid) {
            if  ( confirm('You need to login')){
                Um.dispatcher.trigger("loginLaunch","login");
            }
        }else{
            this.model.on('change',this.renderFull,this);
            this.model.updateSubscription();
        }

    },


    /* cookie storing for reply */
    storeReply : function (){
        data =   this.$el.find('#b_newReplyBody').html();
        $.cookie('umReplyTemporal', data, { expires: 1 });

    },
    checkStoredReply : function(){
        var storeData = $.cookie('umReplyTemporal') != undefined ? $.cookie('umReplyTemporal') : '';
        if ($.trim(storeData) != ''){
            this.$el.find('#b_newReplyBody').html(storeData);
            this.focusOnReplyForm();
        }
        $.removeCookie('umReplyTemporal');
    },


    /*
        Actions on Question that reload
    */

    submitReply : function(e){
        this.controlSession("submitReplyCallback");
    },

    submitReplyCallback : function(valid){

        if (valid){
            //validate reply body
            if (!this.isValidReplyBody()) return;

            //sanitize body
            newBody = $('#b_newReplyBody').html()
                               .replace(/<div>/ig, '\n') // add a line break before all div and p tags
                               .replace(/<\/div>/ig, "")
                               .replace(/<br>/ig, "\n")
                               .replace(/&nbsp;/ig, " ")
                               .trim();

            this.newReply.set({ 'Body':newBody,
                                'isPrivate':false});

            this.newReply.on("createError",function(msg){
                alert('Error '+msg);
            },this);

            this.newReply.newReply();
        }else{
            if  ( confirm('You need to login')){
                this.storeReply();
                Um.dispatcher.trigger("loginLaunch","login");
            }
        }


        return;
    },

    sendPageLinkViaEmail : function(e){
    	body = 'body='+window.location.href;

    	window.location = "mailto:?subject=I%20thought%20you'd%20be%20interested%20in%20this&"+body;
    	return;
    },

    isValidReplyBody : function(isPrivate){
        if (isPrivate == undefined || !isPrivate)
        	replyBody = $.trim(this.$el.find('#b_newReplyBody').text());
        else
    	   replyBody = $.trim(this.$el.find('#b_newPrivateReplyBody').text());

        return replyBody.length > 0 ;
    },

	enableReplySubmit : function(){

        if ( this.isValidReplyBody() )
            this.$el.find('#b_submitReply').removeClass('disabled');
        else
            this.$el.find('#b_submitReply').addClass('disabled');
    },

    renderNewReply : function (repliesList){

        if (repliesList != undefined){
            this.model.set('NumReplies',(this.model.get('NumReplies')+1)  );
            this.publicRepliesModels.unshift(new Answer(repliesList[0])  );
            this.renderFull();
        }
		this.cleanReplySection();
        this.focusOn(this.$el.find('#b_questionRepliesPublic li:last'),false);
    },

    updateBestAnswer : function(newAnswer){



        if ( newAnswer.model.get('QuestionId') != this.model.get('Id') ) return;

        //remove previous best answer
        if ( this.currentBestAnswer != undefined) {
            $(this.currentBestAnswer.previousNode).after(this.currentBestAnswer.el);
            this.currentBestAnswer.model.set('isBestAnswer', false);
            this.currentBestAnswer = undefined ;
        }

        //update new BestAnswer
        if (newAnswer.model.get("isBestAnswer")){
            this.currentBestAnswer = newAnswer ;
            this.$el.find('#b_bestAnswerSection').append( newAnswer.el);
        }
    },


    cleanReplySection : function(isPrivate){

        this.newReply.set('Body','');

        if (isPrivate == undefined || !isPrivate){
            this.$el.find('#b_newReplyBody').html('');
            this.$el.find('#b_submitReply').addClass('disabled');
        }else{
            this.$el.find('#b_newPrivateReplyBody').html('');
            this.$el.find('#b_submitPrivateReply').addClass('disabled');
        }
    },


    focusOnReplyForm : function (e){

        this.focusOn(this.$el.find('#b_addReply'),true);

    },

    controlSession : function(callTo){

        Um.dispatcher.trigger("isValidSession",{
            opDetails : {},
            instance : this,
            method : callTo
        });
    },

    /**
        Private replies section

    **/

    togglePrivateSection : function(){
        if ( !this.model.get('IAmAuthor') ) {
            console.log('YOU ARE NOT THE AUTHOR');
            return;
        }
        this.$el.find("#b_privateArea").toggle();
    },

    submitPrivateReply : function(e){
        this.controlSession("submitPrivateReplyCallback");
    },

    submitPrivateReplyCallback : function(valid){

        if (valid){
            //validate reply body
            if (!this.isValidReplyBody(true)) return;

            //sanitize body
            newBody = $('#b_newPrivateReplyBody').html()
                               .replace(/<div>/ig, '\n') // add a line break before all div and p tags
                               .replace(/<\/div>/ig, "")
                               .replace(/<br>/ig, "\n")
                               .replace(/&nbsp;/ig, " ")
                               .trim();


            this.newReply.set({ 'Body':newBody,
                                'isPrivate':true});

            this.newReply.on("createError",function(msg){
                alert('Error '+msg);
            },this);

            this.newReply.newReply();
        }else{
             alert('You need to login');
        }


        return;
    },

    enablePrivateReplySubmit : function(){

        if ( this.isValidReplyBody(true) )
            this.$el.find('#b_submitPrivateReply').removeClass('disabled');
        else
            this.$el.find('#b_submitPrivateReply').addClass('disabled');
    },


    listTotalLabel : function (currentCant){

        label = currentCant + ' Response';
        if(currentCant !=1){
            label += 's';
        }
        return label;
    },

    renderNewPrivateReply : function (repliesList){

        if (repliesList != undefined){
            this.renderSinglePrivateReply(new Answer(repliesList[0]) );
            cVal = this.$el.find('#b_questionRepliesPrivate li').size()
        }else{
            cVal = 0;
        }
        //increment counter
        this.$el.find('#b_cantPrivate').html(this.listTotalLabel(cVal));

        this.cleanReplySection(true);
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



    beginNewPrivateReplyCallback : function(valid){
        if (!valid){
                alert('You need to login');
        }
    },

    beginNewPrivateReply : function(e){
        this.controlSession("beginNewPrivateReplyCallback");
    },

    focusOn : function (obj, animated){

        var ms = (animated) ? 2000 : 0;
        $('html, body').animate({
            scrollTop: $(obj).offset().top
         }, ms);

    }


});
return QuestionView;
});