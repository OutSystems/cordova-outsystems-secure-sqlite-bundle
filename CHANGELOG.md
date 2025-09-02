# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.2.2] - 2025-09-02
- Fix: Update dependency to cordova-sqlcipher-adapter plugin to use version `0.1.7-OS10` (https://outsystemsrd.atlassian.net/browse/RMET-4297).
- Fix: Remove dependencies to OSLogger (https://outsystemsrd.atlassian.net/browse/RMET-4297).

## [2.2.1] - 2025-07-08
- Chore: Update dependency to KeyStore plugin to use version `2.6.8-OS23`.

## [2.2.0] - 2025-06-20
- Feat: Support for Capacitor apps with OutSystems.
- Chore: Update dependency to KeyStore plugin to use version `2.6.8-OS22`.

## [2.1.7] - 2025-02-07
- Chore: [iOS] Update dependency to KeyStore plugin to use version `2.6.8-OS21` (https://outsystemsrd.atlassian.net/browse/RMET-4037).
- Fix: [iOS] Update SQLite to 3.46.1 (https://outsystemsrd.atlassian.net/browse/RMET-3850).

## [2.1.6] - 2024-11-14
- Fix: [Android] Update sqlcipher to 4.6.1 and sqlite 3.46.1 (https://outsystemsrd.atlassian.net/browse/RMET-3602).

## [2.1.5] - 2023-11-13
- Fix: [Android/iOS] Update sqlcipher to 4.5.4 and sqlite 3.40.1 (https://outsystemsrd.atlassian.net/browse/RMET-2843).

## [2.1.4] - 2023-01-20
- Fix: [Android] Udpate secure-storage version to 2.6.8-OS17 (https://outsystemsrd.atlassian.net/browse/RMET-2190).

## [2.1.3] - 2022-12-19
- Fix: [Android] Udpate secure-storage version to 2.6.8-OS16 to remove jcenter from gradle (https://outsystemsrd.atlassian.net/browse/RMET-2036).

## [2.1.2] - 2022-11-23
### Fixes
- Fix: [iOS] When there are no keys associated with a store, return empty string instead of `nil`.

## [2.1.1] - 2022-11-09
### Features
- Feat: Update dependency to KeyStore plugin to use version `2.6.8-OS14`.

## [2.1.0] - 2022-10-21
### Features
- Feat: Update dependency to KeyStore plugin to use its new implementation (https://outsystemsrd.atlassian.net/browse/RMET-1846)

## [2.0.16] - 2022-09-01
### Fixes
- Fix: Fixing the way we checked the migration failed error (https://outsystemsrd.atlassian.net/browse/RMET-1771)

## [2.0.15] - 2022-04-14
### Fixes
- Fix: For iOS 15, on the `init` method, if ProtectedData is unavailable, add an observer for the `UIApplicationProtectedDataDidBecomeAvailable` notification that re-triggers `init` when it becomes available. (RMET-1417)

## [2.0.14] - 2022-04-12
### Fixes
- Fix: Fix for the error messages: Keystore operation failed, User not authenticated, Key not yet valid. (RMET-1182)

## [2.0.13] - 2022-01-28
### Fixes
- Fix: Implementation of the skip flow in the authentication. (https://outsystemsrd.atlassian.net/browse/RMET-1373)
## [2.0.12] - 2022-01-05
### Fixes
- Fix: error opening apps after creating a PIN for the first time by updating dependency to secure storage. (https://outsystemsrd.atlassian.net/browse/RMET-1292)
## [2.0.11] - 2021-11-09
### Fixes
- Fix: Improved self-healing policy, by updating dependency to sql-adapter (https://outsystemsrd.atlassian.net/browse/RMET-1191)

## [2.0.10] - 2021-11-04
### Fixes
- New plugin release to include metadata tag in Extensibility Configurations in the OS wrapper

## [2.0.9] - 2020-12-07
### Changes
- Update version of cordova-plugin-secure-storage to 2.6.8-OS6

## [2.0.8] - 2020-12-06
### Changes
- Remove Logger dependency 
- Update plugin dependencies to fetch the version due to the breaking change wiht Cordova CLI 10

## [2.0.7] - 2020-11-13
### Changes
- Update version of outsystems-plugin-disable-backup to 1.0.1 


## [2.0.6] - 2020-10-30
### Changes
- Update version of cordova-plugin-secure-storage to 2.6.8-OS5 


## [2.0.5] - 2020-03-12
### Changes
- Update version of cordova-plugin-secure-storage to 2.6.8-OS4 [RNMT-3803](https://outsystemsrd.atlassian.net/browse/RNMT-3803)

## 2.0.4 - 2020-02-19
### Changes
- Update version of cordova-plugin-secure-storage to 2.6.8-OS3 [RNMT-3824](https://outsystemsrd.atlassian.net/browse/RNMT-3824)

### Removals
- Revert: Lock screen authentication can no longer be bypassed in Android 10 devices [RNMT-3604](https://outsystemsrd.atlassian.net/browse/RNMT-3604)

## 2.0.3 - 2020-01-21
### Changes
- Update version of cordova-plugin-secure-storage to 2.6.8-OS2 [RNMT-3604](https://outsystemsrd.atlassian.net/browse/RNMT-3604)

### Fixes
- Lock screen authentication can no longer be bypassed in Android 10 devices [RNMT-3604](https://outsystemsrd.atlassian.net/browse/RNMT-3604)

## 2.0.2 - 2019-12-26
### Changes
- Update version of cordova-plugin-secure-storage to 2.6.8-OS1 [RNMT-3540](https://outsystemsrd.atlassian.net/browse/RNMT-3540)

## 2.0.1 - 2019-09-04
### Changes
- Updates version of cordova-plugin-secure-storage to 2.6.8-OS [RNMT-3257](https://outsystemsrd.atlassian.net/browse/RNMT-3257)

## 2.0.0 - 2019-06-12
### Additions
- Support to 64-bits [RNMT-2669](https://outsystemsrd.atlassian.net/browse/RNMT-2669)

### Additions
- Disables Android Auto Backup for apps [RNMT-1853](https://outsystemsrd.atlassian.net/browse/RNMT-1853)

### Fixes
- Fixes Cipher Local Storage key fetch mechanism [RNMT-1853](https://outsystemsrd.atlassian.net/browse/RNMT-1853)

## 1.1.1 - 2019-01-30
### Additions
- Updates cordova-sqlcipher-adapter to version 0.1.7-os.3 [RNMT-2530](https://outsystemsrd.atlassian.net/browse/RNMT-2530)

[Unreleased]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.12...HEAD
[2.0.12]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.10...2.0.12
[2.0.11]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.10...2.0.11
[2.0.10]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.9...2.0.10
[2.0.9]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.8...2.0.9
[2.0.8]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.7...2.0.8
[2.0.7]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.6...2.0.7
[2.0.6]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.5...2.0.6
[2.0.5]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.4...2.0.5
[2.0.4]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.3...2.0.4
[2.0.3]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/2.0.0...2.0.1
[2.0.0]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/1.1.1...2.0.0
[1.1.1]: https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle/compare/1.1.0...1.1.1
