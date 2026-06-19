# Contributing to OutSystems Secure SQLite Plugin

This is a Cordova meta-plugin that bundles secure SQLite storage requirements for OutSystems native mobile apps. Contributions should maintain compatibility with both Cordova and Capacitor environments.

## Development Setup

### Prerequisites

- Node.js (for package scripts and Capacitor hooks)
- Cordova CLI (version >=6.4.0)
- Platform-specific development environments:
  - **Android**: Android SDK, cordova-android >=6.0.0
  - **iOS**: Xcode, CocoaPods

### Installation

Clone and install dependencies:

```bash
git clone https://github.com/OutSystems/cordova-outsystems-secure-sqlite-bundle.git
cd cordova-outsystems-secure-sqlite-bundle
npm install
```

## Project Structure

- `www/` - JavaScript initialization code that wraps SQLCipher with secure key management
- `plugin.xml` - Cordova plugin manifest defining dependencies and platform support
- `build-actions/` - Build actions for ODC/Capacitor apps and Capacitor hooks
- `CHANGELOG.md` - Version history following Keep a Changelog format

## Development Workflow

### Branch Naming

Use descriptive branch names with prefix patterns:

- `feat/TICKET-ID/description` - New features
- `fix/TICKET-ID/description` - Bug fixes
- `chore/TICKET-ID/description` - Maintenance tasks

Examples from this repository: `feat/RMET-4293/update-sqlite`, `fix/RMET-4780/missing-strings-xml`

### Commit Messages

Follow conventional commit format with ticket references:

```
<type>(<scope>): <description>

Examples:
feat: update sqlite to 3.50.4
fix(ios): update to version 2.6.8-OS29 of cordova-plugin-secure-storage
chore(release): set version to 2.2.7
```

Common types: `feat`, `fix`, `chore`, `test`, `docs`

Common scopes: `ios`, `android`, `release`

Check recent commits: `git log --oneline -20`

### Testing

Manual testing is required across platforms:

1. Test plugin installation in a Cordova app: `cordova plugin add file:///path/to/plugin`
2. Verify database operations on Android and iOS devices
3. For Capacitor apps, verify build actions and hooks execute correctly
4. Test key scenarios:
   - First-time database creation
   - Database reopening with cached keys
   - Device PIN/lock screen changes (Android)
   - Migration from older plugin versions

### Code Standards

- JavaScript code follows standard formatting conventions
- Maintain compatibility with bundled plugin APIs (SQLCipher Adapter, Secure Storage)
- Console logging uses descriptive prefixes: `"SecureSQLiteBundle: ..."`
- Error handling must account for platform-specific security requirements

## Plugin Dependencies

This plugin depends on forked OutSystems versions of:

- `cordova-sqlcipher-adapter` - Encrypted SQLite database access
- `cordova-plugin-secure-storage` - Secure key storage in platform keystores
- `outsystems-plugin-disable-backup` - Disables Android auto-backup

Update dependencies in `plugin.xml` when newer versions are available. Version format: `X.Y.Z-OSnn` where `OSnn` is the OutSystems fork version.

## Pull Request Process

1. Update `CHANGELOG.md` under `[Unreleased]` section following Keep a Changelog format
2. Ensure changes don't break existing database compatibility
3. Test on both Android and iOS before submitting
4. Reference JIRA ticket in PR title and description
5. Code owners (@OutSystems/rd-mobile-ecosystem) will review PRs

## Release Process

1. Update version in `package.json` and `plugin.xml`
2. Move unreleased changes in `CHANGELOG.md` to new version section with date
3. Create commit: `chore(release): set version to X.Y.Z`
4. Tag release: `git tag X.Y.Z`
5. Push with tags: `git push origin master --tags`

Versioning follows [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## Useful Commands

| Command | Description |
|---------|-------------|
| `cordova plugin add .` | Install plugin locally for testing |
| `npm run capacitor:update:before` | Run Capacitor hook to update strings.xml |
| `git log --oneline -20` | View recent commit patterns |
| `cordova platform add android` | Add Android platform for testing |
| `cordova platform add ios` | Add iOS platform for testing |

## Platform-Specific Notes

### Android

- Auto-backup is disabled via build action to prevent keystore conflicts
- Requires device lock screen (PIN/pattern) for secure key storage
- Removing device lock screen renders encrypted databases unreadable

### iOS

- Uses iOS Keychain for secure key storage
- Supports biometric authentication when configured
- Protected data availability must be checked on app launch (iOS 15+)

### Capacitor

Build actions in `build-actions/` directory provide Cordova hook equivalents:
- `disable_auto_backups.yaml` - Android manifest modification
- `update_strings_for_keystore.js` - Capacitor hook for KeyStore plugin requirements

See [build-actions/README.md](./build-actions/README.md) for ODC integration details.

## Known Limitations

Before contributing, be aware of documented limitations:
- Android devices require PIN/lock screen configuration
- Existing unencrypted databases cannot be migrated automatically
- Auto-backup must remain disabled on Android

## Support

This plugin is officially supported by OutSystems. For questions or issues, contact @OutSystems/rd-mobile-ecosystem or file an issue on GitHub.
