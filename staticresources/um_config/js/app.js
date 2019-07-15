requirejs.config({
    baseUrl: window.baseUrlFragment != undefined ? window.baseUrlFragment+'/js/lib' : 'js/lib',
    paths: {
        'app' : '../app',
        'bootstrap' : '../lib/bootstrap.min',
        'jquery' : '../lib/jquery',
        'jquery.jqueryui' : '../lib/jquery-ui-1.10.3.custom.min'
    },
    shim: {
		'bootstrap' :{
			deps: ['jquery']
		},
        'jquery.jqueryui': {
            deps: ['jquery']
        }
	}
});
// Start the main app logic.
requirejs(['app/sub']);