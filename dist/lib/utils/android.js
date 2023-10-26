"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorsXmlTemplate = exports.getIcLauncherDrawableBackgroundXml = exports.getIcLauncherXml = exports.getRoundedCornersLayer = exports.androidIcons = exports.adaptiveAndroidIcons = exports.androidAdaptiveBackgroundFileName = exports.androidAdaptiveForegroundFileName = exports.isAndroidIconNameCorrectFormat = exports.getAndroidColorsFile = exports.getAndroidAdaptiveXmlFolder = exports.getAndroidResDirectory = exports.androidManifestFile = void 0;
exports.androidManifestFile = 'android/app/src/main/AndroidManifest.xml';
const getAndroidResDirectory = (flavor) => `android/app/src/${flavor !== null && flavor !== void 0 ? flavor : 'main'}/res/`;
exports.getAndroidResDirectory = getAndroidResDirectory;
const getAndroidAdaptiveXmlFolder = (flavor) => `${(0, exports.getAndroidResDirectory)(flavor)}mipmap-anydpi-v26/`;
exports.getAndroidAdaptiveXmlFolder = getAndroidAdaptiveXmlFolder;
const getAndroidColorsFile = (flavor) => `${(0, exports.getAndroidResDirectory)(flavor)}/values/colors-launcher.xml`;
exports.getAndroidColorsFile = getAndroidColorsFile;
const isAndroidIconNameCorrectFormat = (iconName) => {
    return /^[a-z0-9_]+$/.exec(iconName);
};
exports.isAndroidIconNameCorrectFormat = isAndroidIconNameCorrectFormat;
exports.androidAdaptiveForegroundFileName = 'ic_launcher_foreground';
exports.androidAdaptiveBackgroundFileName = 'ic_launcher_background';
exports.adaptiveAndroidIcons = [
    { directoryName: 'drawable-mdpi', size: 108 },
    { directoryName: 'drawable-hdpi', size: 162 },
    { directoryName: 'drawable-xhdpi', size: 216 },
    { directoryName: 'drawable-xxhdpi', size: 324 },
    { directoryName: 'drawable-xxxhdpi', size: 432 },
];
exports.androidIcons = [
    { directoryName: 'mipmap-mdpi', size: 48 },
    { directoryName: 'mipmap-hdpi', size: 72 },
    { directoryName: 'mipmap-xhdpi', size: 96 },
    { directoryName: 'mipmap-xxhdpi', size: 144 },
    { directoryName: 'mipmap-xxxhdpi', size: 192 },
];
const getRoundedCornersLayer = (size) => Buffer.from(`<svg><rect x="0" y="0" width="${size}" height="${size}" rx="${Math.floor(size / 2)}" ry="${Math.floor(size / 2)}"/></svg>`);
exports.getRoundedCornersLayer = getRoundedCornersLayer;
const getIcLauncherXml = (iconName) => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/${iconName || 'ic_launcher'}_background"/>
    <foreground android:drawable="@drawable/${iconName || 'ic_launcher'}_foreground"/>
</adaptive-icon>
`;
exports.getIcLauncherXml = getIcLauncherXml;
const getIcLauncherDrawableBackgroundXml = (iconName) => `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@drawable/${iconName || 'ic_launcher'}_background"/>
    <foreground android:drawable="@drawable/${iconName || 'ic_launcher'}_foreground"/>
</adaptive-icon>
`;
exports.getIcLauncherDrawableBackgroundXml = getIcLauncherDrawableBackgroundXml;
const getColorsXmlTemplate = (iconName) => `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="${iconName || 'ic_launcher'}_background">#FF000000</color>
</resources>
`;
exports.getColorsXmlTemplate = getColorsXmlTemplate;
//# sourceMappingURL=android.js.map