define(["jquery",
        "underscore",
        "backbone",
        "Models/Case",
        "Models/Answer",
        "Views/AnswerView"], function($,_,Backbone,Case,Answer,AnswerView){

var QuestionView = Backbone.View.extend({

	model: Case,

	tagName: "li",

	initialize: function(args){
		this.setDispatcherEvents();
		if (this.options != undefined && this.options.model != undefined  ){
			this.model = this.options.model;
		}else{
			this.model = new Case();
		}
		this.model.on("modelFetched",this.returnCaseView,this);
        this.model.on("attachmentFetched", this.storeAttachment, this);

    	//create model for replies
    	this.newReply = new Answer();
        this.newReply.on('replySubmitPrivateSuccess',this.renderNewPrivateReply,this);
		this.newReply.on('replySubmitError',function(i){console.log(i);},this);

	},

	setDispatcherEvents: function(){
        Um.dispatcher.bind("reloadCaseReplies",this.refreshAnswersList,this);
        Um.dispatcher.bind("bestAnswerUpdate",this.updateBestAnswer,this);
        Um.dispatcher.bind("newReplyUpdate",this.updateNewReply,this);
	},

	events: {
        "click .b_smallView"            : "caseClicked",
        "click .b_caseSmallView"        : "supportRequestClicked",
        "click #b_submitPrivateReply"   : "submitPrivateReply",
        "keydown #b_addPrivateReply"    : "beginNewPrivateReply",
        "click #b_resolveCase"          : "markAsResolved",

        "click #b_authorDetail"         : "displayProfile"
	},

	caseClicked: function(e){
		Um.dispatcher.trigger("navigate",{
            route 	: "app/questionp/"+this.model.get('CommunityId')+"/"+this.model.get('Id')+"/",
            trigger : true,
            replace : false
        });
	},

    supportRequestClicked : function(e){
        Um.dispatcher.trigger("navigate",{
            route   : "app/case/"+this.model.get('Id')+"/",
            trigger : true,
            replace : false
        });
    },

	renderCaseSmall: function(){
		this.template = _.template($('#caseItemView_tpl').html());
		this.$el.html(this.template(this.model.tidy(false).toJSON()));
		this.undelegateEvents(); this.delegateEvents();
		return this;
	},

    renderSmall: function(){
        this.template = _.template($('#privateQuestionItemView_tpl').html());
        this.$el.html(this.template(this.model.tidy(false).toJSON()));
        this.undelegateEvents(); this.delegateEvents();
        return this;
    },

	renderFull: function(){

		this.$el = $('#b_caseDetail');
		this.el = '#b_caseDetail';

		this.template = _.template($('#caseDetailView_tpl').html());
		this.$el.html(this.template(this.model.tidy(true).toJSON()));

		this.newReply.set('caseId',this.model.get('Id'));


 		//display private replies list
        if (this.model.privateRepliesList != undefined){
	        container = this.$el.find('#b_questionRepliesPrivate').empty().off();
	        _.each(this.model.privateRepliesList.models,function(item){
                this.renderSinglePrivateReply(item);
	        },this);
            this.$el.find('#b_PrivateSection').show();
            currentCant = $('#b_questionRepliesPrivate li').size();
            this.$el.find('#b_cantPrivate').html(this.listTotalLabel(currentCant));
        }else{
            this.$el.find('#b_PrivateSection').hide();
            this.$el.find('#b_cantPrivate').html(this.listTotalLabel(0));
        }

        //geolocalization
        $('#b_geoLocContainter').hide();
        if (this.model.get('UMgeolocalization__Latitude__s') != 0 &&
            this.model.get('UMgeolocalization__Longitude__s') != 0 ){

            var Lat = this.model.get('UMgeolocalization__Latitude__s');
            var Longit = this.model.get('UMgeolocalization__Longitude__s');
            $('#geoLocPlace').text("");


            var self = this;
            $.ajax({
                url: "http://maps.googleapis.com/maps/api/geocode/json?latlng="+Lat+","+Longit+"&sensor=false"
            }).done(function (data){

                var address = '';//data.results[data.results.length-2].formatted_address;
                if (data.results.length > 2){
                    _.each(data.results , function (i,e){
                        if (_.contains(i.types,"locality")&&_.contains(i.types,"political")){
                            address= i.formatted_address ;
                        }
                    });
                    if (address == '')
                        address = data.results[data.results.length-2].formatted_address;
                }else
                    address = data.results[0].formatted_address;

                $('#geoLocPlace').text(address);
                $('#b_geoLocContainter').show();
            });
        }

        this.displayAttachment();


		this.undelegateEvents(); this.delegateEvents();
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


    storeAttachment : function (data){
        this.base64Data = data;
        this.displayAttachment();
    },

    displayAttachment : function (){
        if (this.base64Data != undefined){
            this.$el.find('#b_questionImg').addClass('fixWidth');
            this.$el.find('#b_qImgContainter').addClass('qImgContainter');
            this.$el.find('#b_questionImg').attr('src', 'data:image/png;base64,'+this.base64Data);
            this.$el.find('#b_qImgContainter').show();
        }

    },


	fetchFullDetails : function(comObject,cId){

		this.communityId = (typeof comObject == 'object' ? comObject.get('id') : '-1');
		this.model.fetch(this.communityId, cId );
	},

	returnCaseView : function(){
		if ( this.model  != undefined ){
			Um.dispatcher.trigger("sendCaseView",this);
		}
	},

    /*
        Actions on Case that reload
    */

    isValidReplyBody : function(){
    	replyBody = $.trim(this.$el.find('#b_newPrivateReplyBody').text());
        return replyBody.length > 0 ;
    },

	enableReplySubmit : function(){

        if ( this.isValidReplyBody() )
            this.$el.find('#b_submitPrivateReply').removeClass('disabled');
        else
            this.$el.find('#b_submitPrivateReply').addClass('disabled');
    },


    updateBestAnswer : function(newAnswer){

        if ( newAnswer.model.get('QuestionId') != this.model.get('Id') ) return;

         item  = new  AnswerView({model: newAnswer  });

        //remove previous best answer
        if ( this.currentBestAnswer != undefined) {
            $(this.currentBestAnswer.previousNode).after(this.currentBestAnswer.el);
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
        this.$el.find('#b_newPrivateReplyBody').html('');
        this.$el.find('#b_submitPrivateReply').addClass('disabled');

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

    beginNewPrivateReply : function(e){
        this.controlSession("beginNewPrivateReplyCallback");
    },

    beginNewPrivateReplyCallback : function(valid){
        if (!valid){
                alert('You need to login');
        }
    },

    markAsResolved : function(){

        this.model.on('change',this.renderFull,this);
        this.model.resolveCase();
    },

    displayProfile : function(e){

        e.stopImmediatePropagation();

        Um.dispatcher.trigger("navigate",{
            route   : "app/profile/"+this.model.get('CreatedById')+"/",
            trigger : true,
            replace : false
        });

    }



});
return QuestionView;
});