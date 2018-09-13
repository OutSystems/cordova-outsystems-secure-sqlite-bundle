// Force dependency load
var SQLiteCipher = require('cordova-sqlcipher-adapter.SQLitePlugin');
var SecureStorage = require('cordova-plugin-secure-storage.SecureStorage');

// Validate SQLite plugin API is properly set
if (typeof(window.sqlitePlugin) === "undefined") {
    throw new Error("Dependencies were not loaded correctly: window.sqlitePlugin is not defined.");
}

if (typeof(window.sqlitePlugin.openDatabase) !== "function") {
    throw new Error("Dependencies were not loaded correctly: window.sqlitePlugin does not provide an `openDatabase` function.");
}

var OUTSYSTEMS_KEYSTORE = "outsystems-key-store"
var LOCAL_STORAGE_KEY = "outsystems-local-storage-key";

var lskCache = "";

/**
 * https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
 * 
 * Returns a hash code for a string.
 * (Compatible to Java's String.hashCode())
 *
 * The hash code for a string object is computed as
 *     s[0]*31^(n-1) + s[1]*31^(n-2) + ... + s[n-1]
 * using number arithmetic, where s[i] is the i th character
 * of the given string, n is the length of the string,
 * and ^ indicates exponentiation.
 * (The hash value of the empty string is zero.)
 *
 * @param {string} s a string
 * @return {number} a hash code value for the given string.
 */
hashCode = function(s) {
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
            h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h;
}

/**
 * Provides the currently stored Local Storage Key or generates a new one.
 *
 * @param {Function} successCallback    Called with a successfully acquired LSK.
 * @param {Function} errorCallback      Called when an error occurs acquiring the LSK.
 */
function acquireLsk(successCallback, errorCallback) {
    // If the key is cached, use it
    if (lskCache) {
        successCallback(lskCache);
        return;
    }

    // Otherwise, open the OutSystems key store
    var initFn = function() {
        var ss = new SecureStorage(
            function () {
                // and when initialized attempt to get the stored key
                ss.get(
                    function (value) {
                        lskCache = value;
                        console.log("Got Local Storage key");
                        OutSystemsNative.Logger.logWarning("Got Local Storage key (" + hashCode(lskCache) + ")", "SecureSQLiteBundle");
                        successCallback(lskCache);
                    },
                    function (error) {
                        // If there's no key yet, generate a new one and store it
                        var newKey = generateKey();
                        lskCache = undefined;
                        console.log("Setting new Local Storage key");
                        ss.set(
                            function (key) {
                                lskCache = newKey;
                                OutSystemsNative.Logger.logError("Setting new Local Storage key (" + hashCode(lskCache) + ")", "SecureSQLiteBundle");
                                successCallback(lskCache);
                            },
                            errorCallback,
                            LOCAL_STORAGE_KEY,
                            newKey);
                    },
                    LOCAL_STORAGE_KEY);
            },
            function(error) {
                if (error.message === "Device is not secure") {
                    OutSystemsNative.Logger.logError("Device is not secure", "SecureSQLiteBundle");
                    if (window.confirm("In order to use this app, your device must have a secure lock screen. Press OK to setup your device.")) {
                        ss.secureDevice(
                            initFn,
                            function() {
                                navigator.app.exitApp();
                            }
                        );
                    } else {
                        navigator.app.exitApp();
                    }
                } else {
                    errorCallback(error);
                }
            },
            OUTSYSTEMS_KEYSTORE);
     };

     initFn();
}

/**
 * Securely generates a new key.
 *
 * @return {String} The generated key.
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

/**
 * Validates the options passed to a `openDatabase` call are correctly set.
 *
 * @param {Object} options  Options object to be passed to a `openDatabase` call.
 */
function validateDbOptions(options) {
    if (typeof options.key !== 'string' || options.key.length === 0) {
        throw new Error("Attempting to open a database without a valid encryption key.");
    }
}

// Set the `isSQLCipherPlugin` feature flag to help ensure the right plugin was loaded
window.sqlitePlugin.sqliteFeatures["isSQLCipherPlugin"] = true;

// Override existing openDatabase to automatically provide the `key` option
var originalOpenDatabase = window.sqlitePlugin.openDatabase;
window.sqlitePlugin.openDatabase = function(options, successCallback, errorCallback) {
    return acquireLsk(
        function (key) {
            // Clone the options
            var newOptions = {};
            for (var prop in options) {
                if (options.hasOwnProperty(prop)) {
                    newOptions[prop] = options[prop];
                }
            }
            
            // Ensure `location` is set (it is mandatory now)
            if (newOptions.location === undefined) {
                newOptions.location = "default";
            }
            
            // Set the `key` to the one provided
            newOptions.key = key;

            // Validate the options and call the original openDatabase
            validateDbOptions(newOptions);
            return originalOpenDatabase.call(window.sqlitePlugin, newOptions, successCallback, errorCallback);
        },
        errorCallback);
};
