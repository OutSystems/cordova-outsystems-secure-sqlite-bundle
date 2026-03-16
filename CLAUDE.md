# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a Cordova meta-plugin that bundles secure SQLite storage for OutSystems mobile applications. It wraps cordova-sqlcipher-adapter and cordova-plugin-secure-storage to provide transparent encryption key management.

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the boundary diagram, external integrations, and architectural tenets (especially T1: Encryption Key Transparency).

See [CONTRIBUTING.md](./CONTRIBUTING.md) for development workflow, branch naming, commit conventions, and the release process.

## Directory Structure

```
www/                               JavaScript initialization code
  outsystems-secure-sqlite-init.js   Core plugin logic: wraps openDatabase, manages keys
build-actions/                     Capacitor/ODC build configuration
  disable_auto_backups.yaml          Android manifest modification (build action)
  update_strings_for_keystore.js    Capacitor hook for KeyStore plugin strings
  README.md                          ODC integration instructions
plugin.xml                         Cordova plugin manifest with dependencies
```

## Command Quick Reference

| Command | Purpose |
|---------|---------|
| `cordova plugin add .` | Install plugin locally in a test Cordova app |
| `npm run capacitor:update:before` | Run Capacitor hook to update KeyStore plugin strings |
| `git log --oneline -20` | View recent commit patterns for conventional commit format |
| `cordova platform add android` | Add Android platform for testing |
| `cordova platform add ios` | Add iOS platform for testing |

No automated tests exist. Manual testing required on both platforms.

## Domain Glossary

**LSK (Local Storage Key)** - The encryption key for SQLCipher databases, stored in platform-native secure storage (iOS Keychain / Android KeyStore). Generated once per app instance and cached in memory.

**SQLCipher** - Encrypted SQLite implementation used by cordova-sqlcipher-adapter. Requires a `key` parameter for all database operations.

**SecureStorage** - Refers to cordova-plugin-secure-storage, which provides access to platform-native keystores (iOS Keychain API / Android KeyStore API).

**OUTSYSTEMS_KEYSTORE** - The SecureStorage namespace used by this plugin (constant: `"outsystems-key-store"`).

**LOCAL_STORAGE_KEY** - The key name under which the LSK is stored in SecureStorage (constant: `"outsystems-local-storage-key"`).

**ODC (OutSystems Developer Cloud)** - OutSystems cloud platform that uses Capacitor instead of Cordova. Build actions in `build-actions/` provide Cordova hook equivalents for ODC apps.

**MABS (Mobile Apps Build Service)** - OutSystems build service for Cordova-based mobile apps.

## Key Implementation Details

### Plugin Initialization Flow

When the plugin loads (`www/outsystems-secure-sqlite-init.js`):
1. Forces load of SQLCipher and SecureStorage dependencies
2. Validates `window.sqlitePlugin.openDatabase` exists
3. Stores original `openDatabase` reference
4. Overrides `openDatabase` to intercept all calls and inject plugin-managed encryption keys

### Key Acquisition (`acquireLsk` function)

1. Check `lskCache` - if key exists in memory, return immediately
2. Open OutSystems keystore via SecureStorage
3. Call `rewriteLsk()` to work around older plugin version compatibility
4. Check if `LOCAL_STORAGE_KEY` exists in keystore:
   - If yes: retrieve and cache the key
   - If no: generate new key using `crypto.getRandomValues()`, store in keystore, cache it
5. Error handling follows fail-secure pattern (see ARCHITECTURE.md T5)

### Error Handling Behavior

Critical errors trigger `navigator.app.exitApp()`:
- "Authentication screen skipped" - user must authenticate to proceed
- "Device is not secure" - prompts user to set up device PIN, exits if declined
- "MIGRATION FAILED" - secure storage upgrade failed
- Error code "OS-PLUG-KSTR-0010" - KeyStore initialization failure

### Key Security Constraints

Application code **cannot control** encryption keys. The plugin intercepts `openDatabase` and forcibly overrides `options.key` with the plugin-managed LSK. User-provided keys are validated but never used (see ARCHITECTURE.md T1).

## Plugin Dependencies

All dependencies point to OutSystems forks with `-OS<version>` suffix:

- `cordova-sqlcipher-adapter` (currently `0.1.7-OS11`) - SQLCipher database adapter
- `cordova-plugin-secure-storage` (currently `2.6.8-OS29`) - Platform keystore access
- `outsystems-plugin-disable-backup` (currently `1.0.2`) - Disables Android auto-backup

Version updates in `plugin.xml` are common maintenance tasks. Check CHANGELOG.md for dependency update patterns.

## Capacitor/ODC Specifics

For Capacitor apps (OutSystems ODC), Cordova hooks don't work. Two mechanisms replace them:

1. **Build Actions** (`disable_auto_backups.yaml`) - Declared in ODC plugin extensibility config, modifies AndroidManifest.xml at build time
2. **Capacitor Hooks** (`update_strings_for_keystore.js`) - Runs via npm script `capacitor:update:before`, ensures strings.xml has KeyStore plugin requirements

See [build-actions/README.md](./build-actions/README.md) for ODC integration instructions.

## Testing Scenarios

Manual testing must cover:

1. **First install** - Database creation with new key generation
2. **App restart** - Database reopening with cached key (memory) vs. re-fetched key (cold start)
3. **Device PIN change** - Android: removing PIN renders database unreadable (known limitation)
4. **Migration** - Apps upgrading from older plugin versions must successfully migrate keys
5. **Authentication skip** - Verify app exits when user skips lock screen authentication
6. **Unsecure device** - Verify app prompts for PIN setup or exits

Test both Cordova (MABS) and Capacitor (ODC) build paths.

## Known Limitations and Workarounds

**Android requires device PIN/lock screen**: Removing the PIN makes databases unreadable because the encryption key stored in Android KeyStore becomes inaccessible. This is by design (ARCHITECTURE.md T2).

**Cannot open existing unencrypted databases**: SQLCipher cannot read non-encrypted databases. Workaround: delete old database or use different name.

**Android auto-backup disabled**: The plugin forcibly disables `android:allowBackup` in AndroidManifest.xml to prevent unencrypted data leakage. Apps requiring backup functionality are incompatible (ARCHITECTURE.md T3).

## Changelog and Versioning

Follows [Keep a Changelog](http://keepachangelog.com/en/1.0.0/) format. Update `[Unreleased]` section in CHANGELOG.md for all changes. Versioning follows [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

Most version bumps historically are dependency updates (cordova-plugin-secure-storage or cordova-sqlcipher-adapter). Check recent CHANGELOG entries for pattern: `Fix [iOS]: Update dependency to ... plugin to use version X.Y.Z-OSnn`.

## Support and Ownership

Officially supported by OutSystems. Code owned by @OutSystems/rd-mobile-ecosystem (see CODEOWNERS).

For JIRA ticket references, use format: `feat/RMET-XXXX/description` or `fix/RMET-XXXX/description` in branch names and PR titles.
