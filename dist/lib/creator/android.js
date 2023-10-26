"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sharp_1 = __importDefault(require("sharp"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const index_1 = require("../../utils/index");
const android_1 = require("../utils/android");
class AndroidIconCreator {
    constructor(context, opts) {
        this.context = context;
        this.options = opts;
        if (typeof opts.android === 'string') {
            if (!(0, android_1.isAndroidIconNameCorrectFormat)(opts.android)) {
                throw new Error('The icon name must contain only lowercase a-z, 0-9, or underscore: \nE.g. "ic_my_new_icon"');
            }
        }
    }
    createAndroidIcons(imagePath) {
        return new Promise((resolve, reject) => {
            const androidResDirectory = path_1.default.resolve(this.context, (0, android_1.getAndroidResDirectory)(this.options.flavor));
            let iconName = this.options.android;
            if (typeof iconName === 'string') {
                (0, index_1.log)('🚀 Adding a new Android launcher icon');
            }
            else {
                iconName = 'ic_launcher';
                (0, index_1.log)('Overwriting the default Android launcher icon with a new icon');
            }
            fs_1.default.readFile(imagePath, (err, image) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return reject(err);
                }
                if (!this.options.disableLauncherIcon) {
                    yield this.overwriteAndroidManifestIcon(iconName);
                }
                for (const androidIcon of android_1.androidIcons) {
                    const iconDirectory = path_1.default.resolve(androidResDirectory, androidIcon.directoryName);
                    yield this.saveIcon(image, iconDirectory, iconName, androidIcon);
                    yield this.saveRoundedIcon(image, iconDirectory, iconName, androidIcon);
                }
                (0, sharp_1.default)(image)
                    .resize(512, 512)
                    .toFile(path_1.default.resolve(androidResDirectory, 'playstore-icon.png'), (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }));
        });
    }
    ;
    createAdaptiveIcons(adaptiveIconBackground, adaptiveIconForeground) {
        const { flavor, android } = this.options;
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(path_1.default.resolve(this.context, adaptiveIconForeground), (err, foreground) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return reject(err);
                }
                const androidResDirectory = path_1.default.resolve(this.context, (0, android_1.getAndroidResDirectory)(flavor));
                const foregroundIconName = typeof android === 'string'
                    ? `${android}_foreground` : android_1.androidAdaptiveForegroundFileName;
                for (const adaptiveIcon of android_1.adaptiveAndroidIcons) {
                    const iconDirectory = path_1.default.resolve(androidResDirectory, adaptiveIcon.directoryName);
                    yield this.saveIcon(foreground, iconDirectory, foregroundIconName, adaptiveIcon);
                }
                if (path_1.default.extname(adaptiveIconBackground) === '.png') {
                    yield this.createAdaptiveBackgrounds(adaptiveIconBackground, androidResDirectory);
                }
                else {
                    yield this.createAdaptiveIconMipmapXmlFile();
                    yield this.updateColorsXmlFile(adaptiveIconBackground);
                }
                resolve();
            }));
        });
    }
    saveRoundedIcon(image, iconDirectory, iconName, androidIcon) {
        const roundIconName = `${iconName}_round`;
        const { size } = androidIcon;
        return new Promise((resolve, reject) => {
            (0, sharp_1.default)(image)
                .resize(size, size)
                .composite([{
                    input: (0, android_1.getRoundedCornersLayer)(size),
                    blend: 'dest-in'
                }])
                .toFile(path_1.default.resolve(iconDirectory, `${roundIconName}.png`), (err, info) => {
                if (err) {
                    return reject(err);
                }
                resolve(info);
            });
        });
    }
    saveIcon(image, iconDirectory, iconName, androidIcon) {
        return new Promise((resolve, reject) => {
            (0, index_1.createDirectory)(iconDirectory);
            (0, sharp_1.default)(image)
                .resize(androidIcon.size, androidIcon.size)
                .toFile(path_1.default.resolve(iconDirectory, `${iconName}.png`), (err, info) => {
                if (err) {
                    return reject(err);
                }
                resolve(info);
            });
        });
    }
    updateColorsXmlFile(adaptiveIconBackground) {
        const { flavor } = this.options;
        return new Promise((resolve) => {
            const colorsXml = path_1.default.resolve(this.context, (0, android_1.getAndroidColorsFile)(flavor));
            if (fs_1.default.existsSync(colorsXml)) {
                (0, index_1.log)('📄 Updating colors.xml with color for adaptive icon background');
                resolve(this.updateColorsFile(colorsXml, adaptiveIconBackground));
            }
            else {
                (0, index_1.log)('⚠️ No colors.xml file found in your Android project');
                (0, index_1.log)('Creating colors.xml file and adding it to your Android project');
                resolve(this.createNewColorsFile(adaptiveIconBackground));
            }
        });
    }
    updateColorsFile(colorsXml, adaptiveIconBackground) {
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(colorsXml, 'utf-8', (err, colors) => {
                if (err) {
                    return reject(err);
                }
                const lines = colors.split('\n');
                let foundExisting = false;
                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.includes('name="ic_launcher_background"')) {
                        foundExisting = true;
                        // replace anything between tags which does not contain another tag
                        lines[i] = line.replace(/>([^><]*)</g, `>${adaptiveIconBackground}<`);
                        break;
                    }
                }
                if (!foundExisting) {
                    lines.splice(lines.length - 1, 0, `\t<color name="ic_launcher_background">${adaptiveIconBackground}</color>`);
                }
                fs_1.default.writeFileSync(colorsXml, lines.join('\n'));
                resolve();
            });
        });
    }
    createNewColorsFile(adaptiveIconBackground) {
        return new Promise((resolve) => {
            const colorsXml = path_1.default.resolve(this.context, (0, android_1.getAndroidColorsFile)(this.options.flavor));
            (0, index_1.createDirectory)(path_1.default.dirname(colorsXml));
            const { android } = this.options;
            const iconName = typeof android === 'string'
                ? android : 'ic_launcher';
            fs_1.default.writeFileSync(colorsXml, (0, android_1.getColorsXmlTemplate)(iconName));
            resolve(this.updateColorsFile(colorsXml, adaptiveIconBackground));
        });
    }
    createAdaptiveIconMipmapXmlFile() {
        const { android, flavor } = this.options;
        return new Promise((resolve, reject) => {
            const iconName = typeof android === 'string'
                ? android : 'ic_launcher';
            const iconFileName = `${iconName}.xml`;
            const directory = path_1.default.resolve(this.context, (0, android_1.getAndroidAdaptiveXmlFolder)(flavor));
            (0, index_1.createDirectory)(directory);
            fs_1.default.writeFile(path_1.default.resolve(directory, iconFileName), (0, android_1.getIcLauncherXml)(iconName), (err) => {
                if (err) {
                    return reject(err);
                }
                resolve();
            });
        });
    }
    createAdaptiveBackgrounds(adaptiveIconBackground, androidResDirectory) {
        const { android, flavor } = this.options;
        const adaptiveIconBackgroundPath = path_1.default.resolve(this.context, adaptiveIconBackground);
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(adaptiveIconBackgroundPath, (err, background) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return reject(err);
                }
                const backgroundIconName = typeof android === 'string'
                    ? `${android}_background` : android_1.androidAdaptiveBackgroundFileName;
                for (const adaptiveIcon of android_1.adaptiveAndroidIcons) {
                    const iconDirectory = path_1.default.resolve(androidResDirectory, adaptiveIcon.directoryName);
                    yield this.saveIcon(background, iconDirectory, backgroundIconName, adaptiveIcon);
                }
                const iconName = typeof android === 'string'
                    ? android : 'ic_launcher';
                const directory = path_1.default.resolve(this.context, (0, android_1.getAndroidAdaptiveXmlFolder)(flavor));
                (0, index_1.createDirectory)(directory);
                fs_1.default.writeFile(path_1.default.resolve(directory, `${iconName}.xml`), (0, android_1.getIcLauncherDrawableBackgroundXml)(iconName), (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            }));
        });
    }
    overwriteAndroidManifestIcon(iconName) {
        return new Promise((resolve, reject) => {
            fs_1.default.readFile(android_1.androidManifestFile, 'utf-8', (err, manifest) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        (0, index_1.warn)('No AndroidManifest.xml was found, icon can\'t be replaced. Skipped');
                        return resolve();
                    }
                    return reject(err);
                }
                (0, index_1.log)('Overwriting icon in AndroidManifest.xml');
                const newManifest = this.transformAndroidManifestIcon(manifest, iconName);
                fs_1.default.writeFile(android_1.androidManifestFile, newManifest, (err) => {
                    if (err) {
                        return reject(err);
                    }
                    resolve();
                });
            });
        });
    }
    transformAndroidManifestIcon(oldManifest, iconName) {
        return oldManifest.split('\n').map((line) => {
            if (line.includes('android:icon')) {
                // Using RegExp replace the value of android:icon to point to the new icon
                // anything but a quote of any length: [^"]*
                // an escaped quote: \\" (escape slash, because it exists regex)
                // quote, no quote / quote with things behind : \"[^"]*
                // repeat as often as wanted with no quote at start: [^"]*(\"[^"]*)*
                // escaping the slash to place in string: [^"]*(\\"[^"]*)*"
                // result: any string which does only include escaped quotes
                return line.replace(/android:icon="[^"]*(\\"[^"]*)*"/g, `android:icon="@mipmap/${iconName}"`);
            }
            else if (line.includes('android:roundIcon')) {
                return line.replace(/android:icon="[^"]*(\\"[^"]*)*"/g, `android:roundIcon="@mipmap/${iconName}_round"`);
            }
            else {
                return line;
            }
        }).join('\n');
    }
}
exports.default = AndroidIconCreator;
//# sourceMappingURL=android.js.map