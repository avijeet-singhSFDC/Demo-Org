define(["jquery",
        "underscore",
        "backbone"], function($,_,Backbone){

var LoginModule = Backbone.Model.extend({

    initialize: function(args){
    	//Customize as needed
        this.builSitesURLS();
        //Binding Service
        Um.dispatcher.bind("loginLaunch",this.loginLaunch,this);
        Um.dispatcher.bind("backFromLogin",this.backFromLogin,this);
        Um.dispatcher.bind("logout",this.logout,this);
    },

    //buld site urls
    builSitesURLS : function (){
        //add https
        var url =  document.location.origin.indexOf("https") == -1 ? document.location.origin.replace("http","https") : document.location.origin;

        //check for secure subdomain

        if (url.match(/secure.force.com/) == null) {
            url =   (url.match(/secure.force.com/) == null) ? url.replace("force.com","secure.force.com") : url;
            //test if secure.force exists
            this.urlExists(url);
        }else{
            this.builSitesURLSCallback(url,true);
            return url;
        }

    },

    builSitesURLSCallback : function(url, validURL){

        if (!validURL){
            url = url.replace("secure.force.com","force.com");
        }

        this.opts = {
            loginPage : url+window.Um.sitePrefix+'/umLogin?startURL=/umHome',
            registerPage : url+window.Um.sitePrefix+'/umRegistrationPage'
        };

    },

    urlExists : function (url, callback){
        var self = this;

          $.ajax({
            url: url,
            success: function(){
              self.builSitesURLSCallback(url,true);
            },
            error: function() {
              self.builSitesURLSCallback(url,false);
            }
          });

    },



    getHttpsUrl: function(){

        var url =  document.location.origin.indexOf("https") == -1 ? document.location.origin.replace("http","https") : document.location.origin;

        if (url.match(/secure.force.com/) == null) {
            url =   (url.match(/secure.force.com/) == null) ? url.replace("force.com","secure.force.com") : url;
            //test if secure.force exists
            this.urlExists(url, function(exists){
              console.log(exists);
            });
        }else{
            return url;
        }

    },

    loginLaunch: function(selectedType){
    	//selectedType ==> "login" || "signup"
    	if ( typeof(selectedType) === 'string' ){
    		if ( selectedType === 'login' ){
    			this.saveCallbackCookie();
                //fix for asynchronic url check
                if(this.opts===undefined){
                    var self = this;
                    var f = function(){
                        if (self.opts===undefined){
                            setTimeout(f,500);
                        }else{
                            document.location.href = self.opts.loginPage;
                        }
                    }
                    setTimeout(f,500);
                }else{
                    document.location.href = this.opts.loginPage;
                }
    		}
    		if ( selectedType === 'signup' ){
    			this.saveCallbackCookie();
                //fix for asynchronic url check
                if(this.opts===undefined){
                    var self = this;
                    var f = function(){
                        if (self.opts===undefined){
                            setTimeout(f,500);
                        }else{
                            document.location.href = self.opts.registerPage;
                        }
                    }
                    setTimeout(f,500);
                }else{
                    document.location.href = this.opts.registerPage;
                }
    		}
    	}else{
    		console.log("Incorrect login model selectedType, it must be a string, received: "+selectedType);
    	}
    },

    backFromLogin: function(){
    	//If cookie value exists, then we clean it up and we navigate to the stored URL
        var navTo = Um.cookies.getItem("camBackURL") != null ? Um.cookies.getItem("camBackURL") : "";

    	if ( navTo.length > 0 ){
    		navTo = decodeURIComponent(navTo);
    		var v = navTo.split("#");
    		if ( v.length > 0 ){

                if  (!(Um.router.config.session.Id == "" && v[1] == "app/contact")){

            			setTimeout(function(){
            				Um.dispatcher.trigger("navigate",{
            					route : v[1],
            					trigger : true,
            					replace : false
            				});
            			},1000);
    		      }
            }
    	}
        var domain = "."+document.location.host;
        var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
    	Um.cookies.removeItem("camBackURL",p,domain);
    },

    logout: function(){
        //Removing salesforce cookie if exists(use case: user loged in using desktop version than switched to mobile page and uses the mobile logout link)
        var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
        Um.cookies.removeItem("logouturl",p,"."+document.location.hostname);
        //Setting new cookie to redirect to last mobile page visited
        var domain = "."+document.location.host;
        Um.cookies.setItem("logouturl",document.location.href,null,p,domain,null);
        this.saveCallbackCookie();
        document.location.href = document.location.origin+window.Um.sitePrefix+"/secur/logout.jsp";
    },

    saveCallbackCookie: function(){
        var domain = "."+document.location.host;
        var p = Um.sitePrefix.length > 0 ? Um.sitePrefix+"/" : "/";
        Um.cookies.setItem("camBackURL",document.location.href,null,p,domain,null);
    }
});
return LoginModule;
});
