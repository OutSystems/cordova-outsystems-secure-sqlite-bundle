// Force dependency load
var SQLiteCipher = require('cordova-sqlcipher-adapter.SQLitePlugin');
var SecureStorage = require('cordova-plugin-secure-storage.SecureStorage');

// Validate SQLite plugin API is properly set
if (typeof(window.sqlitePlugin) === "undefined") {
	throw new Error("Dependencies were not loaded correctly: SQLite window API is missing.");
}

if (typeof(window.sqlitePlugin.openDatabase) !== "function") {
	throw new Error("Dependencies were not loaded correctly: SQLite window API does not provide an `openDatabase` function.");
}

var OUTSYSTEMS_KEYSTORE = "outsystems-key-store"
var LOCALSTORAGE_KEY = "outsystems-local-storage-key";

var lskCache = "";

/*
 * Provides the currently stored Local Storage Key or generates a new one
 */
function acquireLsk(successCallback, errorCallback) {
	// If the key is cached, use it
	if (lskCache) {
		successCallback(lskCache);
		return;
	}
	
	// Otherwise, open the OutSystems key store
    var ss = new SecureStorage(
		function () { /* success */ },
		errorCallback,
		OUTSYSTEMS_KEYSTORE);
			
	// and attempt to get the stored key
	ss.get(
		function (value) {
			lskCache = value;
			console.log("got lsk:", lskCache);
			successCallback(lskCache);
		},
		function (error) {
			// If there's no key yet, generate a new one and store it
			lskCache = generateKey();
			console.log("setting new lsk");
			ss.set(
				function (key) {
					successCallback(lskCache);
				},
				errorCallback,
				LOCALSTORAGE_KEY, 
				lskCache);
		},
		LOCALSTORAGE_KEY);
}

/*
 * Securely generates a new key
 */
function generateKey() {

    function makeVisible(c) {
        c += 32;
        if (c < 127) return c;
        return c + 34;
    }

    var a = new Uint8Array(16);
    crypto.getRandomValues(a);
    return Array.prototype.map.call(
            a,
            function(c) {
                return String.fromCharCode( makeVisible(c) );
            }).join("");
}

// Override existing openDatabase to automatically provide the `key` option
var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {
	return acquireLsk(
		function (key) {
			// Clone the options and set the `key`
			var newOptions = {};
			for (var prop in options) { 
				if (options.hasOwnProperty(prop)) {
					newOptions[prop] = options[prop]; 
				}
			}
			newOptions["key"] = key;
			
			// Ensure `location` is set (it is mandatory now)
			if (!newOptions.location) {
				newOptions.location = "default";
			}
			
			return originalOpenDatabase.call(window.sqlitePlugin, newOptions, successCallback, errorCallback);
		},
		errorCallback);
}
