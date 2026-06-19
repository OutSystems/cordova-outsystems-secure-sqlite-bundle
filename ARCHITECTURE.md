# Cordova OutSystems Secure SQLite Bundle Architecture

> **Repository:** cordova-outsystems-secure-sqlite-bundle
> **Runtime Environment:** Mobile App (iOS/Android native webview with JavaScript bridge)
> **Last Updated:** 2026-03-16

## Overview

A Cordova meta-plugin that bundles secure SQLite storage capabilities for OutSystems mobile applications. It runs as a JavaScript bridge layer within Cordova/Capacitor mobile apps, coordinating between encrypted SQLite databases and platform-native secure keystores.

## Architecture Diagram

```mermaid
graph TB
    %% This plugin
    Plugin["Cordova OutSystems Secure SQLite Bundle<br/>Runs on: Mobile App WebView + Native Bridge"]

    %% External dependencies
    SQLCipher["cordova-sqlcipher-adapter<br/>EXTERNAL"]
    KeyStore["cordova-plugin-secure-storage<br/>EXTERNAL"]
    DisableBackup["outsystems-plugin-disable-backup<br/>EXTERNAL"]
    SQLiteDB[("SQLite Database (Encrypted)<br/>EXTERNAL")]
    NativeKeychain["Platform Keychain<br/>(iOS Keychain / Android KeyStore)<br/>EXTERNAL")]
    OSApp["OutSystems Mobile App<br/>EXTERNAL"]

    %% Communication flows
    OSApp -->|window.sqlitePlugin.openDatabase()<br/>Synchronous| Plugin
    Plugin -->|Intercepts & wraps calls<br/>Synchronous| SQLCipher
    Plugin -->|Acquire encryption key<br/>Synchronous| KeyStore
    SQLCipher -->|SQL operations with key<br/>Synchronous| SQLiteDB
    KeyStore -->|Store/retrieve key<br/>Synchronous| NativeKeychain
    Plugin -->|Depends on<br/>Build-time| DisableBackup

    %% Styling
    classDef thisPlugin fill:#e0f2f1,stroke:#00796b,stroke-width:3px
    classDef external fill:#ffe1e1,stroke:#d32f2f,stroke-width:2px,stroke-dasharray: 5 5
    classDef database fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px

    class Plugin thisPlugin
    class SQLCipher,KeyStore,DisableBackup,OSApp external
    class SQLiteDB,NativeKeychain database
```

## External Integrations

| External Service | Communication Type | Purpose |
|------------------|-------------------|---------|
| cordova-sqlcipher-adapter | Sync (JS API) | Provides encrypted SQLite database operations with SQLCipher |
| cordova-plugin-secure-storage | Sync (JS API) | Manages encryption keys in platform-native secure storage (iOS Keychain / Android KeyStore) |
| outsystems-plugin-disable-backup | Build-time dependency | Disables Android auto-backup to prevent unencrypted data leakage |
| SQLite Database (Encrypted) | Sync (SQL via adapter) | Persistent encrypted data storage on device filesystem |
| Platform Keychain | Sync (via secure-storage) | Native secure key storage (iOS Keychain API / Android KeyStore API) |
| OutSystems Mobile App | Sync (JS API) | Consumer application that uses this plugin for secure storage |

## Architectural Tenets

### T1. Encryption Key Transparency - Applications Cannot Control Database Encryption Keys

The plugin intercepts all `openDatabase` calls and forcibly overrides the `key` parameter with a plugin-managed encryption key stored in the platform's secure keychain. Application code cannot bypass this or provide its own keys.

**Rationale:** Ensures consistent security practices across all OutSystems mobile apps. Prevents developers from accidentally using weak keys, hardcoded keys, or no encryption. Centralizes key management in platform-native secure storage.

**Evidence:**
- `www/outsystems-secure-sqlite-init.js` (in `window.sqlitePlugin.openDatabase` override) - stores original function reference, wraps it with `acquireLsk` call, then forcibly sets `newOptions.key` to the acquired key regardless of input
- `www/outsystems-secure-sqlite-init.js` (in `validateDbOptions`) - validates key exists but application-provided key is never used

### T2. Key Lifecycle Bound to Device Security State

The encryption key is stored in platform-native secure storage that requires device-level authentication (PIN/biometric). Key access fails if device security is removed or authentication is skipped, making the database unreadable.

**Rationale:** Ties data security to device security posture. If a user removes their device PIN/passcode, the data becomes inaccessible rather than falling back to unprotected storage. This enforces a minimum security baseline.

**Evidence:**
- `www/outsystems-secure-sqlite-init.js` (in `acquireLsk` error handler) - handles "Device is not secure" error by prompting user to configure device security or exiting app
- `www/outsystems-secure-sqlite-init.js` (in `acquireLsk` error handler) - handles "Authentication screen skipped" by calling `navigator.app.exitApp()`, refusing to continue without authentication
- `README.md` (Known Issues section) - documents that "removal of the PIN will effectively render the database unreadable, as the key will be lost"

### T3. No Unencrypted Data Persistence - Backup Mechanisms Must Be Disabled

The plugin enforces that Android auto-backup is disabled at build time to prevent the operating system from backing up application data to cloud services in unencrypted form.

**Rationale:** Encrypted databases are meaningless if the OS backs up unencrypted data or if keystores are backed up separately from encrypted databases. Disabling backups prevents inadvertent data leakage through OS-managed backup mechanisms.

**Evidence:**
- `plugin.xml` - declares dependency on `outsystems-plugin-disable-backup` plugin
- `build-actions/disable_auto_backups.yaml` - sets `android:allowBackup` attribute to `"false"` in AndroidManifest.xml
- `README.md` (Limitations section) - explicitly documents that "Android Auto Backup for Apps is not compatible" and describes the mitigation

### T4. Single Key Per App Instance with In-Memory Caching

The plugin generates or retrieves a single encryption key per application instance and caches it in memory (`lskCache`) for the app lifetime to avoid repeated keychain access overhead.

**Rationale:** Reduces latency for database operations by avoiding repeated trips to native keychain APIs. The in-memory cache is safe because it lives only during app runtime in the JavaScript context, which is already within the app's security boundary.

**Evidence:**
- `www/outsystems-secure-sqlite-init.js` (in `acquireLsk` function) - checks `if (lskCache)` at beginning and returns cached value immediately
- `www/outsystems-secure-sqlite-init.js` (in `acquireLsk` function) - sets `lskCache = value` after successful key retrieval and `lskCache = newKey` after generation
- `www/outsystems-secure-sqlite-init.js` (top-level) - declares `var lskCache = "";` as module-scoped variable

### T5. Fail-Secure on Migration or Key Access Errors

When secure storage key migration fails or key access encounters authentication errors, the plugin exits the application rather than attempting fallback or recovery mechanisms that might compromise security.

**Rationale:** Prevents potential security vulnerabilities from partial migration states or authentication bypass attempts. Better to fail closed (exit app) than fail open (continue without proper encryption).

**Evidence:**
- `www/outsystems-secure-sqlite-init.js` (in `acquireLsk` error handler) - detects "MIGRATION FAILED" error and calls `navigator.app.exitApp()` after alerting user
- `www/outsystems-secure-sqlite-init.js` (in `acquireLsk` error handler) - exits app on "Authentication screen skipped" without retry
- `www/outsystems-secure-sqlite-init.js` (in `acquireLsk` error handler) - exits app on error code "OS-PLUG-KSTR-0010" (KeyStore initialization failure)
