module.exports = function(context) {
    
    var cordova = context.requireCordovaModule('cordova-lib/src/cordova/cordova');
    
    return cordova.plugins("rm","cordova-sqlite-storage", null);
};
