define(["jquery",
        "underscore",
        "backbone",
        "Models/Question",
        "Views/DeflectionView"], function($,_,Backbone,QuestionModel,DeflectionView){

var QuestionCreateView = Backbone.View.extend({

    el: ".questionCreateView",

    /**  form **/
    template : _.template($('#questionCreatePage_tpl').html()),
    /**  deflection **/
    deflectionTemplate : _.template($('#questionCreateDeflectionPage_tpl').html()),
    /**  success  **/
    successsTemplate : _.template($('#questionCreateSuccessPage_tpl').html()),

    initialize: function(){
        this.skipDeflection = false;
        this.community =  this.options.community;

        this.setDispatcherEvents();

        this.newQuestion = new QuestionModel();
        if (this.options.searchStr == undefined){
            this.searchStr = '';
        }else{
            this.skipDeflection = true;
            this.searchStr = this.options.searchStr;
        }
        this.newQuestion.set('Title',this.searchStr);
        //initially the question will be public , same as the default label
        this.newQuestion.set('Type','public');
        this.newQuestion.set('Step','0');
        this.newQuestion.set('CommunityId',this.community.get('id'));

        this.newQuestion.on("createSuccess",this.showSuccess,this);
        this.newQuestion.on("createError",this.displayError,this);

        this.render();

    },

    setDispatcherEvents: function(){
        Um.dispatcher.bind("NQDeflectionCallback",this.handleDeflectionStep,this);
    },

    events: {
        "click .topLeftCancelIconWrapper"        : "cancelBtn",
        "click #b_cancelFooterBtn"  : "cancelBtn",

        "click #b_deflectbtn"       : "deflectQuestion",

        "click .topLeftBarButtonWrapper"  : "backToForm",

        "click #b_submitbtn"        : "submitQuestion",
        "click #b_submitFooterBtn"  : "submitQuestion",
        "click #b_seeAllQuestionsBtn" : "redirectToProfile",
        "click #b_goHomeFooterBtn"  : "redirectHome",

        "click .questionTo li"      : "changeAskToEvent",
        "click #b_ToOptionsToggle"  : "displayOptionSection",

        "click .questionTopic li"   : "changeTopicEvent",
        "click #b_TopicsOptionsToggle"  : "displayOptionSection",

        "focusout #b_questionTitle"  : "enableSubmitBtn",
        "focusin #b_questionTitle"   : "enableSubmitBtn",

        "click #b_newQuestion"      : "redirectToQuestionDetail",

        "focusout .pHolder"     : "checkFields"

    },

    render: function(){

        this.$el.empty().off();
        this.undelegateEvents();
        Backbone.Events.trigger("doTransition",this.$el);
        this.checkStoredData();

        var flowStep = this.newQuestion.get('Step');
        switch(flowStep){
            case '0' : /* form */
                        this.renderForm();
            break;
            case '1' : /* deflection */
                        this.buildDeflection();
            break;
            case '2' : /* final*/
                        this.renderFinalStep();
            break;
        }

        return this;
    },

    renderForm : function(){

        thisTopics = this.community.get('topics');
        if (thisTopics.length == 0 ){
            thisTopics.push({
                            apiName: this.community.get('apiName'),
                            label: this.community.get('publicName')
                        });

        }else{
            thisTopics = [];
            _.each(this.community.get('topics').childs, function(obj,e){
                thisTopics.push({
                                apiName: obj.name,
                                label: obj.label
                });
            });
        }

        this.$el.html(this.template({   topics : thisTopics ,
                                        privateQuestions : true,
                                        searchStr : this.searchStr,
                                        title : this.newQuestion.get('Title'),
                                        body : this.newQuestion.get('Body') }));



        if ( thisTopics.length < 2){
            var tmplabelName = '';
            var tmpdcName = '';
            if (thisTopics.length == 0 ){
                tmplabelName = rootRelations[this.community.get('dataCategory__c')] ;
                tmpdcName = this.community.get('dataCategory__c');
            }else{
                tmplabelName = thisTopics[0].label;
                tmpdcName = thisTopics[0].apiName;
            }

            this.$el.find('.questionTopic ul').hide();
            this.$el.find('#b_TopicsOptionsToggle .displayOptionsIcon').hide();
            this.$el.find('#b_TopicLabel').html(tmplabelName);
            this.newQuestion.set('Topic',tmpdcName);
        }else{
            var askToNode = $("[data-sel='"+this.newQuestion.get('Type')+"']");
            this.changeAskTo(askToNode);

            if (this.newQuestion.get('Topic') != ''){
                var topicNode = $("[data-sel='"+this.newQuestion.get('Topic')+"']");
                this.changeTopic(topicNode);
            }
        }

        this.delegateEvents();
    },


    renderFinalStep : function(){

        this.delegateEvents();
    },

    /**  COOKIE HANDLING METHODS **/

    removeCookie: function(){
        var domain = "."+document.location.host;
        var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
        Um.cookies.removeItem("umNewQuestion",p,domain);
        return this;
    },

    getCookie: function(){
        var tCookie = Um.cookies.getItem("umNewQuestion");
        tCookie = tCookie != null ? JSON.parse(tCookie) : tCookie;
        return tCookie;
    },

    preProcessCookieText : function (str){
        var tmpLocal = escape(str);
        tmpLocal = encodeURIComponent(decodeURIComponent(tmpLocal));
        return tmpLocal;
    },

    postProcessCookieText: function (str){
        var tmpLocal = decodeURIComponent(str);
        tmpLocal =  unescape(tmpLocal);
        return tmpLocal;
    },

    /* cookie storing for reply */
    storeNewQuestion : function (){

        var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
        var domain = "."+document.location.host;
        var tmpText =
        this.newQuestion.set('Title',this.preProcessCookieText(this.newQuestion.get('Title')));
        this.newQuestion.set('Body' ,this.preProcessCookieText(this.newQuestion.get('Body')));

        Um.cookies.setItem("umNewQuestion",JSON.stringify(this.newQuestion.attributes),null,p,domain,null);

        this.newQuestion.set('Title',this.postProcessCookieText(this.newQuestion.get('Title')));
        this.newQuestion.set('Body',this.postProcessCookieText(this.newQuestion.get('Body')));
    },

    checkStoredData : function(){

        var storeData = this.getCookie();
        if ($.trim(storeData) != ''){
            storeData.Title = decodeURIComponent(storeData.Title);
            storeData.Body  = decodeURIComponent(storeData.Body);
            this.newQuestion.set(storeData);
        }
        this.removeCookie();
    },


    /** NEW QUESTION FORM METHODS **/
    cancelBtn: function(e){
        this.removeCookie();
        history.back();
    },


    displayOptionSection : function(e){

        elem = $(e.currentTarget).find('[data-for]');
        if (elem == undefined) return;
        //if there's only one topic we display it by default and do not open
        // section with single option
        if (this.community.get('topics').childs.length == 1 && $(elem).data().for == 'topics' ) return;


        if ($(elem).hasClass('displayOptionsIcon')){
            $(elem).removeClass('displayOptionsIcon').addClass('displayOptionsIconActive');
        }else{
            $(elem).removeClass('displayOptionsIconActive').addClass('displayOptionsIcon');
        }
        if ($(elem).data().for=='receiver')
            this.$el.find('.questionTo ul').toggle();
        else
            this.$el.find('.questionTopic ul').toggle();
    },


    changeAskToEvent : function(e){
        this.changeAskTo($(e.currentTarget));
    },

    changeAskTo : function(elem){
        if ($(elem).size() == 0 ){
            return;
        }

        this.newQuestion.set('Type',$(elem).data().sel);
        this.$el.find('#b_ToOption').html($(elem).html());
        this.$el.find('.questionTo ul').hide();
        if (this.newQuestion.get('Type')=='private'){
            this.$el.find('.questionTopic').hide();
        }else{
            this.$el.find('.questionTopic').show();
        }
        this.enableSubmitBtn();
        //deselect
        var arrowICon = this.$el.find('[data-for="receiver"]');
        $(arrowICon).removeClass('displayOptionsIconActive').addClass('displayOptionsIcon');

    },

    changeTopicEvent : function(e){
        this.changeTopic($(e.currentTarget));
    },

    changeTopic : function(elem){
        if ($(elem).size()==0){
            return;
        }

        this.newQuestion.set('Topic',$(elem).data().sel);
        this.$el.find('#b_TopicLabel').html($(elem).html());
        this.$el.find('.questionTopic ul').hide();
        this.enableSubmitBtn();
        //deselect
        var arrowICon = this.$el.find('[data-for=topics]');
        $(arrowICon).removeClass('displayOptionsIconActive').addClass('displayOptionsIcon');
    },

    backToForm : function (){
            this.newQuestion.set('Step','0');
            this.storeNewQuestion();
            this.render();
    },


    /**  QUESTION DEFLECTION  METHODS **/

    deflectQuestion: function (e){

        trimmedTitle = $.trim(this.$el.find('#b_questionTitle').val());
        //trimmedDesc = $.trim(this.$el.find('#b_questionDescription').val());
         //sanitize body
        trimmedDesc = $('#b_questionDescription').html()
                           .replace(/<div>/ig, '\n') // add a line break before all div and p tags
                           .replace(/<\/div>/ig, "")
                           .replace(/<br>/ig, "\n")
                           .replace(/&nbsp;/ig, " ")
                           .trim();

        if (this.canEnableSubmit()  && trimmedTitle.length >=  2 ){
            this.newQuestion.set('Title',trimmedTitle);
            this.newQuestion.set('Body',trimmedDesc);
            this.newQuestion.set('Step','1');

            //check that fields have valid values
            validation = this.newQuestion.checkFields();
            msg = '';error=false;
            _.each(validation, function(i,e){
                    error = error || !i.status;
                    if (i.msg != undefined ) msg += i.msg;
            })
            if (error){
                alert(msg);
                return;
            }

            this.storeNewQuestion();

            /** if we came from search string we will skip deflection **/
            if (this.skipDeflection){
                this.handleDeflectionStep(0);
            }else{
                this.buildDeflection();
            }
        }

    },


    /* test deflection results*/
    buildDeflection : function(){

         //store cookie in case userNavigates to detail page
        this.storeNewQuestion();
        if (typeof this.deflectionView == "object"){
            this.deflectionView.cleanUp();
        }
        this.deflectionView = new DeflectionView({   community : this.community.get('id') ,
                                        searchStr : this.newQuestion.get('Title'),
                                        deflectionCallBack : 'NQDeflectionCallback'
        });
        //fetch deflection to skip if there are no results.
        this.deflectionView.fetchResults();
    },

    handleDeflectionStep : function (deflectionListSize){

        if ((deflectionListSize== 0)){
            this.submitQuestion();

        }else{
            this.$el.empty().off();
            var  compiledTPL = this.deflectionTemplate({ Title : _.escape(this.newQuestion.get('Title')),
                                                         Body :  this.newQuestion.get('Body')
                                });
            this.$el.html(compiledTPL);
            this.$el.find('#b_similarItemsSection').hide();
            //set element and populate deflection results
            this.deflectionView.setElement(this.$el.find("#b_similarIssues"));
            this.deflectionView.getResultItems();
            this.delegateEvents();
        }

    },

    canEnableSubmit : function(){

        titleStr = (this.$el.find('#b_questionTitle') == undefined) ? this.newQuestion.get('Title') : $.trim(this.$el.find('#b_questionTitle').val());

        validTitle  = (titleStr.length > 0 );
        type = this.newQuestion.get('Type');
        var isValidTopic = this.newQuestion.get('Topic') != undefined  && this.newQuestion.get('Topic') != '';
        return ( validTitle &&
                    ( type == 'private' ||
                    ( type == 'public' && isValidTopic )
                )
            );
    },

    enableSubmitBtn : function(){

        if ( this.canEnableSubmit() )
            this.$el.find('#b_deflectbtn').removeClass('disabled');
        else
            this.$el.find('#b_deflectbtn').addClass('disabled');
    },


    submitQuestion : function (){

        Um.dispatcher.trigger("getCurrentUser",{
            instance : this,
            method : "saveQuestionCallback"
        });

    },

    saveQuestionCallback : function (data){

        if ( typeof data == "object"&& data.get('Id') != ""){
                this.currentUserId = data.get('Id');
                this.saveQuestion();
        }else{
            if  ( confirm('You need to login')){

                if (this.deflectionView != undefined)
                    this.deflectionView.cleanUp();
                //store data
                this.storeNewQuestion();
                //redirect to login
                Um.dispatcher.trigger("loginLaunch","login");
            }
        }
    },

    saveQuestion : function (){
        this.newQuestion.saveQuestion();
    },

    /**  FINAL STEP  METHODS **/

    showSuccess : function (msg){
        //this.$el.empty().off();
        var localData = { Title : _.escape(this.newQuestion.get('Title')),
                         Body :  this.newQuestion.get('Body'),
                         Type :  this.newQuestion.get('Type')
                        };
        this.$el.html(this.successsTemplate(localData));
        this.delegateEvents();
        this.removeCookie();
    },

    checkFields : function(e){
        if ( $.trim($(e.currentTarget).text()).length == 0 ) {
            $(e.currentTarget).html('');
        }
    },

    displayError : function (msg){
        alert('display Error '+msg);
        console.log('display Error '+msg);
    },

    redirectToQuestionDetail : function(e){

        if (this.newQuestion.get('Type') =='private'){

           Um.dispatcher.trigger("navigate",{
                route   : "app/questionp/"+this.community.get('id')+"/"+this.newQuestion.get('id')+"/",
                trigger : true,
                replace : false
            });

        }else{

            Um.dispatcher.trigger("navigate",{
                route   : "app/question/"+this.community.get('id')+"/"+this.newQuestion.get('id')+"/",
                trigger : true,
                replace : false
            });
        }
    },

    redirectToProfile : function(e){

        this.cleanUpView();
        Um.dispatcher.trigger("navigate",{
            route   : "app/profile/"+this.currentUserId+"/",
            trigger : true,
            replace : false
        });
    },

    redirectHome : function(e){

        this.cleanUpView();
        Um.dispatcher.trigger("navigate",{
                route   : "app/zone/"+this.community.get('id'),
                trigger : true,
                replace : false
        });
    },

    cleanUpView: function(){
        this.unbind();
        this.newQuestion.off(null, null, this);
        this.undelegateEvents();
        this.$el.empty().off();

        if (this.deflectionView != undefined) {
            this.deflectionView.cleanUp();
            this.deflectionView.off();
        }
        Um.dispatcher.unbind("NQDeflectionCallback",this.handleDeflectionStep,this);
    }

});
return QuestionCreateView;
});
