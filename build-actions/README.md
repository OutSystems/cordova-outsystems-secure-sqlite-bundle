
# Build Actions

This folder contains a .yaml file for configuring build actions to use in a plugin on ODC with Capacitor. The purpose of these build actions is to provide the same functionality as cordova hooks, but in a Capacitor shell for OutSystems apps.

## Contents

The file [disable_auto_backups.yaml](./disable_auto_backups.yaml) contains 1 build action:

1. Android specific. Disable auto-backup for the Android application, by changing the `AndroidManifest.xml` file.


Furthermore, there are changes that can't be accomplished with build actions, and we used [Capacitor hooks](https://capacitorjs.com/docs/cli/hooks) for this. We have one JavaScript file for hooks:

- [update_strings_for_keystore.js](./update_strings_for_keystore.js) - Update the application's `strings.xml` file that are used for the [KeyStore Plugin](https://github.com/OutSystems/cordova-plugin-secure-storage), which is a dependency of this Cordova plugin. 

Reasoning for this hook: The KeyStore plugin has its own build actions to update these strings, which only triggers from OutSystems apps. The dependency exists only at the Cordova-level, not OutSystems level, and the actual strings aren't meant to be configured here, since they won't actually be used in the plugin, it's just required for the KeyStore plugin initialization. Therefore, this hook only adds the strings to `strings.xml` if they don't already exist yet, to avoid modifying custom strings from the KeyStore Plugin (which can happen if users have an OutSystems app with both Ciphered and KeyStore plugins). [The Key Store's build actions](https://github.com/OutSystems/cordova-plugin-secure-storage/blob/outsystems/build-actions/setStringsAndroid.yaml) will run after this hook as well, and they will modify existing strings.


## Outsystems' Usage

1. Copy the build action yaml file (which can contain multiple build actions inside) into the ODC Plugin, placing them in "Data" -> "Resources" and set "Deploy Action" to "Deploy to Target Directory", with target directory empty.
2. Update the Plugin's Extensibility configuration to use the build action.

```json
{
    "buildConfigurations": {
        "buildAction": {
            "config": $resources.buildActionFileName.yaml,
            "parameters": {
                // parameters go here; if there are no parameters then the block can be ommited
            }
        }
    }
}
```