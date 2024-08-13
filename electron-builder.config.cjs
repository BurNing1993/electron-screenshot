/*eslint-env node*/
const { version } = require('./package.json')
const nameEN = 'SimpleScreenshot'

/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
module.exports = {
  productName: '截图',
  appId: 'com.joey.screenshot',
  artifactName: `${nameEN}-\${version}-\${os}-\${arch}.\${ext}`,
  directories: {
    output: 'release',
    buildResources: 'resources',
  },
  files: ['dist'],
  win: {
    icon: 'resources/icon.ico', // 256 * 256
    target: 'nsis',
  },
  nsis: {
    oneClick: false,
    perMachine: true,
    allowToChangeInstallationDirectory: true,
    installerLanguages: ['zh_CN', 'en_US'],
    license: 'resources/license.html',
    // multiLanguageInstaller: true,
    // language: '2052',
    // installerSidebar  164 × 314
  },
  mac: {
    icon: 'resources/icon.icns',
    target: 'default',
  },
  dmg: {
    window: {
      width: 540,
      height: 380,
    },
    contents: [
      {
        x: 410,
        y: 150,
        type: 'link',
        path: '/Applications',
      },
      {
        x: 130,
        y: 150,
        type: 'file',
      },
    ],
  },
  releaseInfo: {
    releaseName: `v${version}`,
    releaseNotes: '1. 修复已知问题\n2. 优化用户体验\n',
    releaseDate: new Date().toLocaleString('zh-CN'),
  },
  // publish: {
  // provider: 'github',
  // provider: 'generic',
  // url: 'http://localhost:3000',
  // },
}
