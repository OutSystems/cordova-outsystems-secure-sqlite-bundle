const path = require('path');
const fs = require('fs');
const { DOMParser, XMLSerializer } = require('xmldom');

const parser = new DOMParser();
const platform = process.env.CAPACITOR_PLATFORM_NAME;
const projectRoot = process.env.CAPACITOR_ROOT_DIR;

if (platform != 'android') {
    // hook only needs to run for Android
    return
}

console.log("\nCiphered Local Storage Plugin - running hook after update - for " + platform);

const stringsXmlPath = path.join(projectRoot, 'android/app/src/main/res/values/strings.xml');
const jsonConfigPath = path.join(projectRoot, "outsystems.config.json");
if (!fs.existsSync(stringsXmlPath)) {
   console.error("\t[ERROR] - strings.xml file does not exist, and is required by this hook - " + stringsXmlPath);
   process.exit(1);
}
if (!fs.existsSync(jsonConfigPath)) {
   console.error("\t[ERROR] - capacitor.config.json file does not exist, and is required by this hook - " + jsonConfigPath);
   process.exit(1);
}

// read and parse files
const stringsXmlDoc = parser.parseFromString(fs.readFileSync(stringsXmlPath, 'utf-8'), 'text/xml');
const configJsonContent = JSON.parse(fs.readFileSync(jsonConfigPath, "utf8"));
let writtenValuesCount = 0;

// Add  entries only if they are not present
const valuesToAdd = [
    { stringsXmlName: 'migration_auth', value: 'false', type: 'bool', configKey: 'MIGRATE_KEYS_AUTH' },
    { stringsXmlName: 'biometric_prompt_title', value: 'Authentication required', type: 'string', configKey: 'BIOMETRIC_PROMPT_TITLE' },
    { stringsXmlName: 'biometric_prompt_subtitle', value: 'Please authenticate to continue', type: 'string', configKey: 'BIOMETRIC_PROMPT_SUBTITLE'  },
    { stringsXmlName: 'biometric_prompt_negative_button', value: 'Cancel', type: 'string', configKey: 'BIOMETRIC_PROMPT_NEGATIVE_BTN'  }
];
for (const { stringsXmlName, value, type, configKey } of valuesToAdd) {
    if (!elementExists(type, stringsXmlName, configKey)) {
        const stringElement = stringsXmlDoc.createElement(type);
        stringElement.setAttribute('name', stringsXmlName);
        stringElement.textContent = value;
        stringsXmlDoc.documentElement.appendChild(stringElement);
        writtenValuesCount = writtenValuesCount + 1;
    }
}

if (writtenValuesCount > 0) {
    // Serialize and write the updated XML file
    const serializer = new XMLSerializer();
    let updatedXmlString = serializer.serializeToString(stringsXmlDoc);
    // XMLSerializer doesn't properly indent the content, so it is manually done here
    updatedXmlString = updatedXmlString
        .replace(/>(\s*)</g, '>\n<') // put each tag on its own line
        .replace(/<([^?\/][^>]*)>/g, '    <$1>') // indent all opening tags except <?xml ...?>
        .replace(/ {4}(<\/?resources>)/g, '$1') // remove indentation from initial <resources> tag
    fs.writeFileSync(stringsXmlPath, updatedXmlString, 'utf-8');
    console.log("\t[SUCESSS] Added " + writtenValuesCount + " out of expected " + valuesToAdd.length + " values into strings.xml");
} else {
    console.log("\t[SKIPPED] Values already exist in strings.xml");
}

function elementExists(tagName, nameValue, configKey) {
    return elementExistsInStringsXml(tagName, nameValue) || elementExistsInCapacitorConfig(configKey);
}

function elementExistsInStringsXml(tagName, nameValue) {
    const elements = stringsXmlDoc.getElementsByTagName(tagName);
    for (let i = 0; i < elements.length; i++) {
        if (elements[i].getAttribute('name') === nameValue) {
            return true;
        }
    }
    return false;
}

function elementExistsInCapacitorConfig(configKey) {
    // Such elements in capacitor config should be written into strings.xml later
    // through a different build actions file (KeyStore plugin)
    return getConfigValue(configJsonContent, configKey) != undefined;
}

function getConfigValue(config, key) {
    if (!config || !config.buildConfigurations || 
        !config.buildConfigurations.buildActions || !config.buildConfigurations.buildActions[0] ||
        !config.buildConfigurations.buildActions[0].parameters) {
        return undefined;
    }
    return config.buildConfigurations.buildActions[0].parameters[key];
}