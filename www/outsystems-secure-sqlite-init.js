// force dependency
var SQLiteCipher = require('cordova-sqlcipher-adapter.SQLitePlugin');

console.log("hello world!");
console.log("dependencies were loaded: " +
        (typeof(window.sqlitePlugin) !== "undefined" &&
         typeof(window.sqlitePlugin.openDatabase) === "function"));
