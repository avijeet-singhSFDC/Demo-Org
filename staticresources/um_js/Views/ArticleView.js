define(["jquery",
        "underscore",
        "backbone",
        "Models/Article"], function($,_,Backbone,Article){

var ArticleView = Backbone.View.extend({

	model: Article,

	tagName: 'li',

	initialize: function(){

		this.setDispatcherEvents();
		if (this.options != undefined && this.options.model != undefined  ){
			this.model = this.options.model;
		}else{
			this.model = new Article();
		}

		this.model.on("fetchFullCallback",this.fetchFullCallback,this);
		this.model.on("fetchFeaturedCallback",this.fetchFeaturedCallback,this);

	},

	setDispatcherEvents: function(){
		Um.dispatcher.bind("getKAnnouncementDetail",_.once(this.getFeaturedKav),this);
	},

	events: {
		"click .b_smallView" 		: "kArticleClicked",
        "click #b_showMore"         : "showMoreMenu",
        "click #b_upVotes"          : "addLikeVote",
        "click #b_shareViaMail"     : "sendPageLinkViaEmail"
	},

	kArticleClicked: function(e){
		if (this.model.get('CommunityId') == undefined)
			routeTo = "app/article/-1/"+this.model.get('KnowledgeArticleId')+"/";
		else
			routeTo = "app/article/"+this.model.get('CommunityId')+"/"+this.model.get('KnowledgeArticleId')+"/";

		Um.dispatcher.trigger("navigate",{
            route 	: routeTo,
            trigger : true,
            replace : false
        });
	},

	renderHomeSection: function(){
		this.$el.empty().off();
		this.template = _.template($('#kArticleHomeView_tpl').html()),
		this.$el.html(this.template(this.model.tidy(true).toJSON()));
		this.undelegateEvents(); this.delegateEvents();
		return this;
	},

	renderSmall: function(){
		this.$el.empty().off();
		this.template = _.template($('#kArticleSmallView_tpl').html()),
		this.$el.html(this.template(this.model.tidy(false).toJSON()));

		this.undelegateEvents(); this.delegateEvents();
		return this;
	},

	renderDetail: function(){
		this.$el.empty().off();

		this.$el = $('#b_articleDetail');
		this.el = '#b_articleDetail';

		this.template = _.template($('#articleDetailBody_tpl').html()),
		this.$el.html(this.template(this.model.tidy(true).toJSON()));
		//display fields
		fieldTpl = _.template($('#template-KA-FieldDetail').html());
      	listFields = this.model.get('fieldValues').fieldOrder.split(',');
		//list detailing wich fields are RICHTEXT
		rFields = this.model.get('fieldValues').richTextFields.split(',');

		for ( i in listFields ) {
			if (typeof listFields[i] == 'string' && this.model.get('fieldValues')[listFields[i]] != undefined && this.model.get('fieldValues')[listFields[i]] != 'n/a') {
				if ( $.inArray(listFields[i],rFields) == -1 )
					tmpValue = _.escape(this.model.get('fieldValues')[listFields[i]]);
				else
					tmpValue = this.model.get('fieldValues')[listFields[i]];

				data = {
					fLabel: listFields[i],
					fValue:  tmpValue
				};
				this.$el.find('.articleBody').append(fieldTpl(data));
			}
		}

		this.undelegateEvents(); this.delegateEvents();
		return this;

  },


	renderAnnouncement : function (senderObj){
		this.model.fetchFeatured(senderObj);
	},

	fetchFeaturedCallback : function(senderObj,itmModel){
		if (typeof senderObj == 'object' && typeof senderObj.container == 'object' ){
			this.model = itmModel;
			senderObj.container.empty().off();
			senderObj.container.append(this.renderHomeSection().el).hide().fadeIn();
		}
	},


	resolveArticleDetailView : function (senderObj){
		this.model.fetchFull(senderObj);
	},


	fetchFullCallback : function(senderObj,itmModel){

		if (typeof senderObj == 'object' && typeof senderObj.container == 'object' ){
			this.model = itmModel;
			senderObj.container.empty().off();
			senderObj.container.append(this.renderDetail().el);
			Um.dispatcher.trigger("sendArticleView",this.model);
		}
	},

    showMoreMenu : function (e){
    },

    addLikeVote: function(e){
        if ( this.model.get('LikeIt') ) return;
        this.controlSession("addLikeCallback");
    },

    addLikeCallback : function (valid){
        if (!valid) {
            if  ( confirm('You need to login')){
                Um.dispatcher.trigger("loginLaunch","login");
            }
        }else{
           this.model.on('change',this.renderDetail,this);
        this.model.addLike();
        }
    },

    controlSession : function(callTo){

        Um.dispatcher.trigger("isValidSession",{
            opDetails : {},
            instance : this,
            method : callTo
        });

    },

    sendPageLinkViaEmail : function(e){
        body = 'body='+window.location.href;
        window.location = "mailto:?subject=I%20thought%20you'd%20be%20interested%20in%20this&"+body;
        return;
    }
});
return ArticleView;
});
