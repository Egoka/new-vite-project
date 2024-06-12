// rollup.config.mjs
// =====================================================================================================================
import fs from 'fs-extra'
import path from 'path'
import { fileURLToPath } from 'node:url'
// =====================================================================================================================
import vue from '@vitejs/plugin-vue'
import postcss from 'rollup-plugin-postcss'
import postcssPresetEnv from 'postcss-preset-env';
import postcssSelectorParser from 'postcss-selector-parser';
import terser from '@rollup/plugin-terser'
import { babel } from '@rollup/plugin-babel'
import typescript from 'rollup-plugin-typescript2'
// =====================================================================================================================
let entries = [];
let core = {};
// =====================================================================================================================
const PROJECT_NAME = 'primevue'
const CORE_LIB_DIR = 'lib'
const OUTPUT_LIB_DIR = 'dist'
// =====================================================================================================================
const POSTCSS_PLUGIN_OPTIONS = {
  modules: true, // Обрабатывает scoped стили
  minimize: true, // Минимизирует CSS
  plugins: [
    postcssPresetEnv({
      // Плагин для добавления атрибута `data-v-XXXXXX` к селекторам
      selectorParser: postcssSelectorParser,
      selectors: true // Применять к селекторам
    })
  ],
  sourceMap: false
};
const TERSER_PLUGIN_OPTIONS = {
  compress: {
    keep_infinity: true,
    pure_getters: true,
    reduce_funcs: false
  }
};
const BABEL_PLUGIN_OPTIONS = {
  extensions: ['.js', '.vue'],
  exclude: 'node_modules/**',
  presets: ['@babel/preset-env'],
  plugins: [],
  skipPreflightCheck: true,
  babelHelpers: 'runtime',
  babelrc: false
};
const EXTERNAL = ["vue",
  "@heroicons/vue/20/solid",
  // "tailwind-merge",
  // "clsx"
];
// =====================================================================================================================
const GLOBAL_DEPENDENCIES = {
  vue: 'Vue',
};
const CORE_DEPENDENCIES = JSON.parse(`{
  "@heroicons/vue/20/solid": "Icon",
  "tailwind-merge": "tailwind-merge",
  "clsx": "clsx",
  "${PROJECT_NAME}/utils": "${PROJECT_NAME}.utils",
  "${PROJECT_NAME}/types": "${PROJECT_NAME}.types",
  "${PROJECT_NAME}/button": "${PROJECT_NAME}.button",
  "${PROJECT_NAME}/alert": "${PROJECT_NAME}.alert",
  "${PROJECT_NAME}/baseTypes": "${PROJECT_NAME}.baseTypes"
}`)
const NAMED_EXPORT_DEPENDENCIES_FILES = {
  "PrimeVue.ts": "PrimeVue.ts",
  "Alert.vue": "Alert.vue",
}
const GLOBAL_COMPONENT_DEPENDENCIES = {
  ...GLOBAL_DEPENDENCIES,
  ...CORE_DEPENDENCIES
};
// =====================================================================================================================
const PLUGINS = [
  vue(),
  typescript({ tsconfigOverride: { compilerOptions: { noImplicitAny: false } }}),
  postcss(POSTCSS_PLUGIN_OPTIONS),
  babel(BABEL_PLUGIN_OPTIONS)
];
const EXTERNAL_COMPONENT = [...EXTERNAL, ...Object.keys(CORE_DEPENDENCIES)];
// =====================================================================================================================
function addEntry(folder, inFile, outFile) {
  const exports = Object.keys(NAMED_EXPORT_DEPENDENCIES_FILES).includes(inFile) || folder === 'passthrough/tailwind' ? 'named' : 'auto';
  const useCorePlugin = Object.keys(GLOBAL_COMPONENT_DEPENDENCIES)
    .some((d) => d.replace(`${PROJECT_NAME}/`, '') === folder);
  const plugins = PLUGINS;
  const external = EXTERNAL_COMPONENT;

  const input = `${CORE_LIB_DIR}/${folder}/${inFile}`;
  const output = `./${OUTPUT_LIB_DIR}/${folder}/${outFile}`;

  const getEntry = (isMinify) => {
    return {
      input,
      plugins: [...plugins, isMinify && terser(TERSER_PLUGIN_OPTIONS), useCorePlugin && corePlugin()],
      external,
    };
  };

  const get_CJS_ESM = (isMinify) => {
    return {
      ...getEntry(isMinify),
      output: [
        {
          format: 'cjs',
          file: `${output}.cjs${isMinify ? '.min' : ''}.js`,
          exports
        },
        {
          format: 'esm',
          file: `${output}.esm${isMinify ? '.min' : ''}.js`,
          exports
        }
      ]
    };
  };

  const get_IIFE = (isMinify) => {
    return {
      ...getEntry(isMinify),
      output: [
        {
          format: 'iife',
          name: `${PROJECT_NAME}.${folder.replaceAll('/', '.')}`,
          file: `${output}${isMinify ? '.min' : ''}.js`,
          globals: GLOBAL_COMPONENT_DEPENDENCIES,
          exports
        }
      ]
    };
  };

  entries.push(get_CJS_ESM());
  entries.push(get_IIFE());

  // Minify
  entries.push(get_CJS_ESM(true));
  entries.push(get_IIFE(true));
}
// =====================================================================================================================
function corePlugin() {
  return {
    name: 'corePlugin',
    generateBundle(outputOptions, bundle) {
      const { name, format } = outputOptions;

      if (format === 'iife') {
        Object.keys(bundle).forEach((id) => {
          const chunk = bundle[id];
          const folderName = name.replace(`${PROJECT_NAME}.`, '').replaceAll('.', '/');
          const filePath = `./${OUTPUT_LIB_DIR}/core/core${id.indexOf('.min.js') > 0 ? '.min.js' : '.js'}`;

          if (core[filePath]) {
            (core[filePath][folderName] = chunk.code)
          } else {
            (core[filePath] = {[`${folderName}`]: chunk.code});
          }
        });
      }
    }
  };
}
// =====================================================================================================================
function addSFC(coreDir) {
  fs.readdirSync(fileURLToPath(new URL(coreDir, import.meta.url)), { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .forEach(({ name: folderName }) => {
      fs.readdirSync(fileURLToPath(new URL(`${coreDir}/${folderName}`, import.meta.url))).forEach((file) => {
        let name = file.split(/(.vue)$|(.js)$/)[0].toLowerCase();

        if (/\.vue$/.test(file) && name === folderName) {
          addEntry(folderName, file, name);
        }
      });
    })
}
// =====================================================================================================================
function addUtils() {
  addEntry('utils', 'Utils.ts', 'utils');
}
function addConfig() {
  addEntry('config', 'PrimeVue.ts', 'config');
}
function copyDependencies(inFolder, outFolder, subFolder) {
  fs.readdirSync(fileURLToPath(new URL(inFolder, import.meta.url)), { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .forEach(({ name: folderName }) => {
      fs.readdirSync(fileURLToPath(new URL(inFolder + folderName, import.meta.url))).forEach((file) => {
        if (file === 'package.json' || file.endsWith('.d.ts')) {
          fs.copySync(fileURLToPath(new URL(inFolder + folderName, import.meta.url)) + '/' + file, outFolder + folderName + '/' + file);
        }
      });

      if (subFolder) {
        try {
          fs.readdirSync(fileURLToPath(new URL(inFolder + folderName + subFolder, import.meta.url))).forEach((subFile) => {
            if (subFile === 'package.json' || subFile.endsWith('.d.ts')) {
              fs.copySync(fileURLToPath(new URL(inFolder + folderName + subFolder, import.meta.url)) + '/' + subFile, outFolder + folderName + subFolder + '/' + subFile);
            }
          });
        } catch {}
      }
    });
}
function addPackageJson() {
  const packageJson = fs.readJsonSync(`./${CORE_LIB_DIR}/package.json`)
  const pkg = fs.readJsonSync('./package.json')
  packageJson.version = pkg.version
  !fs.existsSync(OUTPUT_LIB_DIR) && fs.mkdirSync(OUTPUT_LIB_DIR)
  fs.writeFileSync(path.resolve(OUTPUT_LIB_DIR, 'package.json'), JSON.stringify(packageJson, null, "  "))
}
async function createDir (dir) {
  try {
    await fs.emptyDir(dir)
  } catch (err) { console.error(err) }
}
// =====================================================================================================================
async function start() {
  await createDir(OUTPUT_LIB_DIR)
  fs.copySync(fileURLToPath(new URL(`./${CORE_LIB_DIR}/baseTypes.d.ts`, import.meta.url)), `${OUTPUT_LIB_DIR}/baseTypes.d.ts`);
  fs.copySync(fileURLToPath(new URL('./README.md', import.meta.url)), `${OUTPUT_LIB_DIR}/README.md`);
  // fs.copySync(fileURLToPath(new URL('./LICENSE.md', import.meta.url)), `${OUTPUT_LIB_DIR}/LICENSE.md`);
}
// =====================================================================================================================
await start()
addUtils()
addConfig()
addSFC(`./${CORE_LIB_DIR}`)
copyDependencies(`./${CORE_LIB_DIR}/`, `${OUTPUT_LIB_DIR}/`);
addPackageJson();
// =====================================================================================================================
export default entries;
