define(["jquery",
        "underscore",
	      "backbone",
        "jQCookie"], function($,_, Backbone){

    var camUtils = function(){};

    _.extend(camUtils.prototype, {


    deepClone : function (origObj){
      console.log("===!!!cloned!!!===");
      var origObjStringified = JSON.stringify(origObj);
      return JSON.parse(origObjStringified);
    },


    parseElapsedDate : function (mS,elap){

      var monthNames = [ "Jan", "Feb", "Mar", "Apr", "May", "June",
                              "July", "Aug", "Sept", "Oct", "Nov", "Dec" ];
        ml = 1000;
        s_m = ml;
        m_m = 60 *s_m;
        h_m = 60*m_m;
        d_m = 24*h_m;

        w_m = 7*24*h_m;
        y_m = 256*24*h_m;

        qElapse = '';
        if (elap == undefined){
          elap = parseInt(mS);
        }

        if (elap < 0){
          return '0 sec'
        }else{

          //It's a year
          if (Math.floor(elap/y_m) > 0 ){


            d = new Date(parseInt(mS));
            qElapse  = d.getDate() +' '+monthNames[d.getMonth()] + d.getFullYear() ;
            return qElapse;
          }
          //It's a week
          if (Math.floor(elap/w_m) > 0 ){

            d = new Date(parseInt(mS));
            qElapse  = d.getDate() +' '+monthNames[d.getMonth()];
            return qElapse;
          }

          //It's a day
          if (Math.floor(elap/d_m) > 0 ){
            d = Math.floor(elap/d_m);
            elap =  elap % d_m;
            tmpStr = d + ' d';
            qElapse  = (d>0) ? tmpStr : qElapse+'';
            return qElapse;
          }
          //it's hours
          if (  Math.floor(elap/h_m) > 0 ){
            h = Math.floor(elap/h_m);
            elap =  elap % h_m;
            tmpStr = h + ((h>1) ? ' hrs' : ' hr');
            qElapse  = (h>0) ? qElapse + ' '+ tmpStr :qElapse+'';
            return qElapse;
          }
          //it's minutes
          if (   Math.floor(elap/m_m) > 0 ){
            m = Math.floor(elap/m_m);
            elap =  elap % m_m;
            tmpStr = m + ' m';
            qElapse  = (m>0) ? qElapse + ' '+ tmpStr : qElapse+'';
            return qElapse;
          }
          //it's seconds

            stmp = Math.floor(elap/ml);
            qElapse  =  stmp + ' s';
            return qElapse;

        }
    },



    replaceTags : function (str){
      return str.replace(/&lt;/g,'<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    },

    replaceNewLineTags : function (str){
      return str.replace(/\n/g, '<br/>');
    },

    tidyRequestBody : function (str){
        return str.replace(/\n/g, "<br />");
    },


    tidyTitle : function (str){

      var tmpStr = $('<div></div>').html(str).text();
      tmpStr = _.escape(tmpStr).replace(/&amp;/g,"&");//this.replaceTags(tmpStr);
      return tmpStr ;
    },

    tidyTextContent : function (str){

      var tmpStr = $('<div></div>').html(str).text();
      //only replace LINKS if no manipulation has been done by saleforce
      if ( tmpStr.match(/href=/) == null && tmpStr.match(/HREF=/) == null )
        tmpStr = this.replaceURLWithHTMLLinks(tmpStr);


      return tmpStr ;
    },

    tidyPrivateTextContent : function (str){
      var tmpStr = $('<div></div>').html(str).text();
      tmpStr = this.replaceURLWithHTMLLinks(tmpStr);


      return tmpStr ;
    },

    tidyArticleContent : function (str){
      var tmpStr = $('<div></div>').html(str).text();
      tmpStr = this.replaceTags(tmpStr);
      return tmpStr ;
    },

    replaceURLWithHTMLLinks : function (text) {
        var exp = /(<\s*img.+?\/>)|(<\s*a.+?\/a>)|(((https?|ftp|file)?(:\/\/))?(www.)?[A-Za-z0-9\.?\-?]+\.[A-Za-z]{2,3}(\S*))/gi;
    	var ret = text.replace(exp,function(matched,group1,group2,group3){
    	    if ( group3 != undefined ) return '<a href="'+group3+'">'+group3+'</a>';
    	    return group1 != undefined ? group1 : group2;
    	});
    	return ret;
    },

    /*   methods to tidy strings on Q and A*/

    tidyQuestionTitle : function (str){

      var tmpStr = $('<div></div>').html(str).text();
      tmpStr = _.escape(tmpStr).replace(/&amp;/g,"&");//this.replaceTags(tmpStr);
      return tmpStr ;
    },

    tidyQuestionBody : function (str){

      var tmpStr = $('<div></div>').html(str).text();
      //only replace LINKS if no manipulation has been done by saleforce
      if ( tmpStr.match(/href=/) == null && tmpStr.match(/HREF=/) == null )
        tmpStr = this.replaceURLWithHTMLLinks(tmpStr);


      return tmpStr ;
    },


    tidyCaseDescription : function (str){

      var tmpStr = $('<div></div>').html(str).text();
      tmpStr = this.replaceNewLineTags(_.escape(tmpStr));
      //only replace LINKS if no manipulation has been done by saleforce
      if ( tmpStr.match(/href=/) == null && tmpStr.match(/HREF=/) == null )
        tmpStr = this.replaceURLWithHTMLLinks(tmpStr);

      return tmpStr ;
    },


    tidyCaseComment : function (str){

      var tmpStr = $('<div></div>').html(str).text();
      tmpStr = this.replaceNewLineTags(tmpStr);
      //only replace LINKS if no manipulation has been done by saleforce
      if ( tmpStr.match(/href=/) == null && tmpStr.match(/HREF=/) == null )
        tmpStr = this.replaceURLWithHTMLLinks(tmpStr);

      return tmpStr ;
    },



    cutAt :  function (origText,max){

      if (origText.length > max){
        cutAt = origText.indexOf(' ',(max-5));
        if (cutAt <= 0) {cutAt = origText.length ;}
        origText = origText.substring(0,cutAt) + '...';
      }

      return origText ;
    },

    compareIds :  function (id1,id2){

      tmpId1 = id1.substring(0,Math.min(id1.length,id2.length) );
      tmpId2 = id2.substring(0,Math.min(id1.length,id2.length) );

      return (tmpId1 == tmpId2) ;
    },

    resizeTextArea : function (elem){


        $(elem).height( 0 );
        outerHeight = $(elem)[0].scrollHeight ;//attr('scrollHeight')
        $(elem).height( outerHeight  );
        $(elem).parent().height( 0 );
        if (( parseInt($(elem).css('min-height').replace('px','')) < outerHeight)){
          $(elem).parent().height( outerHeight );
        }
        /*if ($(elem).is(":focus")){
          console.log('SCROLL TO ');
          scrollH = $(elem).offset().top + $('#bodyInput').height();
          $('html, body').animate({scrollTop: scrollH }, 0);
        }*/

    },

    expandTextArea : function (elem){

      if ($(elem).size() == 0 ) return;

      $(elem).css('overflow-y','hidden');
      this.resizeTextArea(elem);

      var ctrlDown = false;
      var ctrlKey = 17, commandKey =91 , vKey = 86, cKey = 67;

      $(document).keydown(function(e)
      {
          if (e.keyCode == ctrlKey || e.keyCode == commandKey ) ctrlDown = true;
      }).keyup(function(e)
      {
          if (e.keyCode == ctrlKey || e.keyCode == commandKey ) ctrlDown = false;
      });

      var that = this;
      $(elem).keyup(function(e){

        if (e.keyCode == ctrlKey || e.keyCode == commandKey ) {
            if (ctrlDown ) {
               that.resizeTextArea(elem);
             }
        }else{
            that.resizeTextArea(elem);
        }

      });

      $(elem).bind('drop', function(e) {
          that.resizeTextArea(elem);
      });

      $(elem).bind('paste', function(e) {
          setTimeout(function(){  that.resizeTextArea(elem); },500);
      });

    },

    addErrorSection : function (obj,msg){
        alert(msg);
      /*if ($('.errorMsg').size()== 0 ){
          $(obj).append(' <div id="HLSection" class="errorMsg"  >'+msg+' </div>');
          $('.errorMsg').fadeOut(3000, function(){
                  $(this).remove();
          });
      }*/
    },

    /** COOKIES HANDLING **/
       createCookie : function (name,value,days){
        //refactoring
        days = days != undefined ? days : 1;
        $.cookie(name, value, { expires: days });
      },

      readCookie : function (name) {
        //refactoring
        return $.cookie(name);
      },

      eraseCookie : function eraseCookie(name) {
        //Refactoring
        $.removeCookie(name);
      },

      printState : function (skeleton){

          console.log( 'cId:'+ skeleton.searchOptions.communityId +
                        '|req:'+ skeleton.globalOptions.requestType +
                        '|scope:'+ skeleton.searchOptions.scope  +
                        '|topic:'+ skeleton.searchOptions.topicName +
                        '|sort:'+ skeleton.searchOptions.sortBy);
        },

        trimToContentSize : function (obj){
          obj = $(obj);
          var height = parseInt(obj.parent().height());
          var temp = obj.text();
          console.log(height);console.log(text.outerHeight());
          while(parseInt(obj.outerHeight()) > height && temp.length>0) {
            console.log(temp);
              temp = temp.substr(0, temp.length-1)
              obj.text(temp +  '...');
          }
        }

    });

    return camUtils;
});