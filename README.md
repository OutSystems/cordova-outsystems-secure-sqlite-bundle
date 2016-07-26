# OutSystems Secure SQLite Plugin
Cordova meta-plugin that bundles requirements for secure SQLite device storage and initialization code for easy usage within OutSystems Platform native mobile apps.

## Supported Platforms
- iOS
- Android

## Installation
```shell
cordova plugin add https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle.git
```

## Usage

The API is essentially unchanged from the bundled [Cordova SQLCipher Adapter](https://github.com/litehelpers/Cordova-sqlcipher-adapter), but the encryption key creation and usage is completely managed by this plugin using [SecureStorage](https://github.com/Crypho/cordova-plugin-secure-storage).
```javascript
var options = { 
  name: 'sample.db',
  location: 'default',
  key: 'secure-encryption-key' /* not used, will be overriden by this plugin */
};
window.sqlitePlugin.openDatabase(options, successCallback, errorCallback);
```

Refer to the Cordova SQLCipher Adapter plugin documentation for samples and details of the supported features.
