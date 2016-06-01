module.exports = function(context) {
    
    var cordova = context.requireCordovaModule('cordova-lib/src/cordova/cordova');
    
    return cordova.plugins("list")
	.then(function(lst) {
	    if (lst.indexOf("cordova-sqlite-storage") !== -1) {
		return cordova.plugins("rm","cordova-sqlite-storage", null);
	    }
	    return;
	});
};
