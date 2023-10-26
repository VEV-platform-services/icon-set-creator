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
const ios_1 = require("../utils/ios");
class IOSIconCreator {
    constructor(context, opts) {
        this.context = context;
        this.options = opts;
    }
    createIosIcons(imagePath) {
        return new Promise((resolve, reject) => {
            const projectName = this.getIosProjectName();
            if (!projectName) {
                return reject('No Project Directory for IOS was found');
            }
            fs_1.default.readFile(imagePath, (err, image) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    return reject(err);
                }
                let iconName = ios_1.iosDefaultIconName;
                let catalogName = ios_1.iosDefaultCatalogName;
                const { flavor, ios, disableLauncherIcon } = this.options;
                if (flavor) {
                    catalogName = `AppIcon-${flavor}`;
                    iconName = ios_1.iosDefaultIconName;
                }
                else if (typeof ios === 'string') {
                    iconName = ios;
                    catalogName = iconName;
                }
                for (const iosIcon of ios_1.iosIcons) {
                    const flavorPath = path_1.default.resolve(this.context, (0, ios_1.getIosDefaultIconFolder)(projectName, flavor));
                    yield this.saveIosIcon(image, flavorPath, iconName, iosIcon);
                }
                if (!disableLauncherIcon) {
                    yield this.changeIosLauncherIcon(catalogName, projectName);
                }
                this.modifyContentsFile(catalogName, iconName, projectName);
                resolve();
            }));
        });
    }
    getIosProjectName() {
        const { group } = this.options;
        if (group) {
            return group;
        }
        const appFilePath = path_1.default.resolve(this.context, 'app.json');
        if (fs_1.default.existsSync(appFilePath)) {
            const app = require(appFilePath);
            if (typeof app === 'object' && app.name) {
                return app.name;
            }
        }
        const iosDirectory = path_1.default.resolve(this.context, 'ios');
        const directories = fs_1.default.readdirSync(iosDirectory, { withFileTypes: true });
        for (const dir of directories) {
            if (!dir.isDirectory()) {
                continue;
            }
            if (fs_1.default.existsSync(path_1.default.resolve(iosDirectory, dir.name, 'Images.xcassets'))) {
                return dir.name;
            }
        }
        return 'AppName';
    }
    saveIosIcon(image, iconDirectory, iconName, iosIcon) {
        return new Promise((resolve, reject) => {
            (0, index_1.createDirectory)(iconDirectory);
            (0, sharp_1.default)(image)
                .resize(iosIcon.size, iosIcon.size)
                .removeAlpha() // Icons with alpha channel are not allowed in the Apple App Store
                .toFile(path_1.default.resolve(iconDirectory, `${iconName + iosIcon.name}.png`), (err, data) => {
                if (err) {
                    return reject(err);
                }
                resolve(data);
            });
        });
    }
    changeIosLauncherIcon(catalogName, projectName) {
        return new Promise((resolve, reject) => {
            const iOSconfigFile = path_1.default.resolve(this.context, (0, ios_1.getIosConfigFile)(projectName));
            fs_1.default.readFile(iOSconfigFile, 'utf-8', (err, config) => {
                if (err) {
                    if (err.code === 'ENOENT') {
                        (0, index_1.warn)('No project.pbxproj was found, icon can\'t be replaced in config file. Skipped');
                        return resolve();
                    }
                    return reject(err);
                }
                const lines = config.split('\n');
                let currentConfig, onConfigurationSection = false;
                for (let i = 0; i <= lines.length - 1; i++) {
                    const line = lines[i];
                    if (line.includes('/* Begin XCBuildConfiguration section */')) {
                        onConfigurationSection = true;
                    }
                    if (line.includes('/* End XCBuildConfiguration section */')) {
                        onConfigurationSection = false;
                    }
                    if (onConfigurationSection) {
                        const regex = /.*\/* (.*)\.xcconfig \*\/;/;
                        const match = regex.exec(line);
                        if (match) {
                            currentConfig = match[1];
                        }
                        if (currentConfig && line.includes('ASSETCATALOG_COMPILER_APPICON_NAME')) {
                            lines[i] = line.replace(/=(.*);/g, `= ${catalogName};`);
                        }
                    }
                }
                const entireFile = lines.join('\n');
                resolve(fs_1.default.writeFileSync(iOSconfigFile, entireFile));
            });
        });
    }
    modifyContentsFile(newCatalogName, newIconName, projectName) {
        const newIconDirectory = path_1.default.resolve(this.context, (0, ios_1.getIosAssetFolder)(projectName), `${newCatalogName}.appiconset/Contents.json`);
        (0, index_1.createDirectory)(path_1.default.dirname(newIconDirectory));
        const contentsFileContent = (0, ios_1.generateContentsFile)(newIconName);
        fs_1.default.writeFileSync(newIconDirectory, JSON.stringify(contentsFileContent, null, 2));
    }
}
exports.default = IOSIconCreator;
//# sourceMappingURL=ios.js.map