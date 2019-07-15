requirejs.config({
	paths: {
        'backbone' 		: "Libs/backbone/backbone-min",
        'jquery'		: "Libs/JQuery/jquery-min",
        'underscore'	: "Libs/Underscore/underscore-min",
        'text' 			: "Require/text",
        'jQCookie'		: "Libs/JQuery/jquery.cookie",
    },
    shim:{
    	"backbone": {
    		"deps": [ "underscore", "jquery" ],
            "exports": "Backbone"
    	},
    	"jQCookie": {
    		"deps": [ "jquery" ]
    	}
    }
});
requirejs(["jquery",
			"underscore",
			"backbone",
			"router",
			"Models/Cookies"], function($, _, Backbone, Router, Cookies) {
	XMLHttpRequest.prototype.origOpen = XMLHttpRequest.prototype.open;
	var camLoader = function(method, url, async, user, password){
		//ajax queue add
		window.Um.ajaxQueue.queue.push(this);
		this.addEventListener("readystatechange",function(){
			if ( this.readyState == 1 ){
				var valImg = window.loaderImgSource != undefined ? "<img src='"+window.loaderImgSource+"'/>" : "Loading...";
				if ( ($("body").find("#overlayGral")).length == 0 ){
					$('<div id="overlayGral"></div>').appendTo("body");
					$('<div class="loader"></div>').appendTo("body");
            	}
			}else if ( this.readyState == 4 ){
				$("body").find("#overlayGral").remove();
	    		$("body").find(".loader").remove();
			}
		});
		this.origOpen(method, url, async, user, password);
	};
	XMLHttpRequest.prototype.open = camLoader;
	var callback = function (result, event){
		if (result.isSuccess){
			var config =  result.responseBody;
			config.communities = window.communityData;

			Um.modules.init(config);
			var app_Router = new Router(config);
			Backbone.history.start();
		}
	};
	window.Um = {};

	window.Um.dispatcher = _.extend({}, Backbone.Events);

	window.Um.ajaxQueue = {
		cleanQueue : function(){
            _.each(this.queue,function(item){
                item.abort();
            });
            this.queue = [];
        },
        queue : []
	};

	window.Um.sitePrefix = window.camV2_sitePrefix;
	//cleaning this value from global scope
	window.camV2_sitePrefix = undefined;
	//exposing cookies util model to namespace
	window.Um.cookies = new Cookies();

	window.Um.modules = function(){

		var modules = [] ;
		var moduleModel = [] ;
		var moduleSorting = [] ;

		function initialize(data){
			this.data = data;
			moduleModel = {};
			modules = {};
			if (typeof data['Questions'] == 'object'){
				moduleModel['Questions'] =  data['Questions'].requestModel;
				moduleSorting['Questions'] = data['Questions'].sortOptions;
				modules['Questions'] = true;
			}
			if (typeof data['KB'] == 'object'){
				moduleModel['KB'] =  data['KB'].requestModel;
				moduleSorting['KB'] = data['KB'].sortOptions;
				modules['KB'] = true;
			}
			if (typeof data['ContactUS'] == 'object'){
				moduleModel['ContactUS'] =  data['ContactUS'].requestModel;
				modules['ContactUS'] = true;
			}
			if (typeof data['Profile'] == 'object'){
				moduleModel['Profile'] =  data['Profile'].requestModel;
				modules['Profile'] = true;
			}

			if (typeof data['Case'] == 'object'){
				moduleModel['Case'] =  data['Case'].requestModel;
				moduleSorting['Case'] = data['Case'].statusOptions;
				modules['Case'] = true;
			}


		}

		function getModuleData(moduleName){
			if (this.canAccess(moduleName)) return this.data[moduleName];
			else return null;
		}

		function getInfo(moduleName){
			res = false;
			if (modules[moduleName]  != undefined){
				res = modules[moduleName] ;
			}
			return res;
		}

		function getModel(moduleName){
			res = false;
			if (moduleModel[moduleName]  != undefined){
				res = moduleModel[moduleName] ;
			}
			var origObjStringified = JSON.stringify(res);
            var reqObj = JSON.parse(origObjStringified);
			return reqObj;
		}

		function getFiltersFor(moduleName){
			res = false;
			if (moduleSorting[moduleName]  != undefined){
				res = moduleSorting[moduleName] ;
			}
			var origObjStringified = JSON.stringify(res);
            var reqObj = JSON.parse(origObjStringified);
			return reqObj;
		}
		/* if there only one community this method will return the details */
		function getSingleCommunity(){
			var ret = undefined;
			if (this.data.communities != undefined && this.data.communities.length == 1){
				ret = this.data.communities[0];
			}
			return ret;
		}

		return {
				init : initialize,
				modelFor: getModel,
				canAccess: getInfo,
				sortingFor : getFiltersFor,
				getModuleData : getModuleData,
				getSingleCommunity : getSingleCommunity
		}
	}();

	window.Um.transitionsQueue = {};
	// 0 = right to left (forward)
	// 1 = left to right (backwards)
	window.Um.transitionsQueue.slideTo = 0;
	window.Um.transitionsQueue.queue = [];
	window.Um.transitionsQueue.push = function(){
		var page = window.location.hash;
		//lets resolve if this page is a new one or an already visited (max 1 inmediate step backwards)
		if (this.queue.length == 0){
			this.queue.push(page);
			this.slideTo = 0;
		}else if (this.queue.length == 1){
			if(this.queue[0] != page) this.queue.push(page);
			this.slideTo = 0;
		}else{
			if(this.queue[this.queue.length-1] == page){
				//Kinda bug if in this scenario
				//this.slideTo = 0;
			}else{
				if(this.queue[this.queue.length-2] == page){
				this.slideTo = 1;
				this.queue = this.queue.slice(0,(this.queue.length-1));
				}else{
					this.queue.push(page);
					this.slideTo = 0;
				}
			}
		}
	};

	/*$(window).on('hashchange', function(){
		window.Um.transitionsQueue.push();
	});*/

	v = new Object();
	v.operationType ='getSetup';
	umProxy.getRemoteAction(JSON.stringify(v),callback, true,this);
});
