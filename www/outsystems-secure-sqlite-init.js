// force dependency
var SQLiteCipher = require('cordova-sqlcipher-adapter.SQLitePlugin');
var SecureStorage = require('cordova-plugin-secure-storage.SecureStorage');

console.log("hello world!");
console.log("dependencies were loaded: " +
        (typeof(window.sqlitePlugin) !== "undefined" &&
         typeof(window.sqlitePlugin.openDatabase) === "function"));

var KEYSTORE = "outsystems-key-store"
var KEYNAME = "outsystems-local-storage-key";

var lsk = "";

function acquireLsk(onSuccess) {
    var ss = new SecureStorage(
            function() {
                ss.get(
                        function (value) {
                            lsk = value;
                            console.log("got lsk:", lsk);
                            onSuccess(lsk);
                        },
                        function (error) {
                            // recreate lsk
                            lsk = generateKey();
                            console.log("setting new lsk");
                            ss.set(
                                    function (key) {
                                        onSuccess(lsk);
                                    },
                                    function (error) {
                                        console.error("error setting local storage key", error);
                                    },
                                    KEYNAME, lsk);
                        },
                        KEYNAME);
            },
            function (error) {
                console.error("error creating keystore");
            },
            KEYSTORE);
}

function generateKey() {

    function makeVisible(c) {
        c+=32;
        if (c<127) return c;
        return c+34;
    }

    var a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.prototype.map.call(
            a,
            function(c) {
                return String.fromCharCode( makeVisible(c) );
            }).join("");
}


var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {
    function innerOpenDb(lsk) {
        var newOptions = {};
        for (var key in options) { if (options.hasOwnProperty(key)) newOptions[key] = options[key]; }
        newOptions["key"] = lsk;
        return originalOpenDatabase.call(window.sqlitePlugin, newOptions, successCallback, errorCallback);
    }
    if (lsk) return innerOpenDb(lsk);
    else {
        acquireLsk(innerOpenDb);
    }
}
