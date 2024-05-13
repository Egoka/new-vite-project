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
const EXTERNAL = ['vue'];
// =====================================================================================================================
const GLOBAL_DEPENDENCIES = {
  vue: 'Vue',
  "@heroicons/vue": "@heroicons/vue"
};
const CORE_DEPENDENCIES = {
  "primevue/types": "primevue.types",
  "primevue/button": "primevue.button",
  "primevue/alert": "primevue.alert",
}
const GLOBAL_COMPONENT_DEPENDENCIES = {
  ...GLOBAL_DEPENDENCIES,
  ...CORE_DEPENDENCIES
};
// =====================================================================================================================
const PLUGINS = [
  vue({

  }),
  typescript({
    tsconfigOverride: { compilerOptions: { strict: false } }
    // abortOnError: false
  }),
  postcss(POSTCSS_PLUGIN_OPTIONS),
  babel(BABEL_PLUGIN_OPTIONS)
];
const EXTERNAL_COMPONENT = [...EXTERNAL, ...Object.keys(CORE_DEPENDENCIES)];
// =====================================================================================================================
function addEntry(folder, inFile, outFile) {
  const exports = inFile === 'PrimeVue.js' || folder === 'passthrough/tailwind' ? 'named' : 'auto';
  const useCorePlugin = Object.keys(GLOBAL_COMPONENT_DEPENDENCIES)
    .some((d) => d.replace('primevue/', '') === folder);
  const plugins = PLUGINS;
  const external = EXTERNAL_COMPONENT;
  const inlineDynamicImports = true;

  const input = `${CORE_LIB_DIR}/${folder}/${inFile}`;
  const output = `./${OUTPUT_LIB_DIR}/${folder}/${outFile}`;

  const getEntry = (isMinify) => {
    return {
      input,
      plugins: [...plugins, isMinify && terser(TERSER_PLUGIN_OPTIONS), useCorePlugin && corePlugin()],
      external,
      // inlineDynamicImports
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
          name: 'primevue.' + folder.replaceAll('/', '.'),
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
          const folderName = name.replace('primevue.', '').replaceAll('.', '/');
          const filePath = `./dist/core/core${id.indexOf('.min.js') > 0 ? '.min.js' : '.js'}`;

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
function copyDependencies(inFolder, outFolder, subFolder) {
  fs.readdirSync(fileURLToPath(new URL(inFolder, import.meta.url)), { withFileTypes: true })
    .filter((dir) => dir.isDirectory())
    .forEach(({ name: folderName }) => {
      fs.readdirSync(fileURLToPath(new URL(inFolder + folderName, import.meta.url))).forEach((file) => {
        if (file === 'package.json' || file.endsWith('d.ts')) {
          fs.copySync(fileURLToPath(new URL(inFolder + folderName, import.meta.url)) + '/' + file, outFolder + folderName + '/' + file);
        }
      });

      if (subFolder) {
        try {
          fs.readdirSync(fileURLToPath(new URL(inFolder + folderName + subFolder, import.meta.url))).forEach((subFile) => {
            if (subFile === 'package.json' || subFile.endsWith('d.ts') || subFile.endsWith('vue')) {
              fs.copySync(fileURLToPath(new URL(inFolder + folderName + subFolder, import.meta.url)) + '/' + subFile, outFolder + folderName + subFolder + '/' + subFile);
            }
          });
        } catch {}
      }
    });
}
function addPackageJson() {
  const pkg = fs.readJsonSync('./package.json')
  const outputDir = 'dist';
  const packageJson = `{
    "name": "primevue",
    "version": "${pkg.version}",
    "private": false,
    "author": "PrimeTek Informatics",
    "homepage": "https://primevue.org/",
    "repository": {
        "type": "git",
        "url": "https://github.com/primefaces/primevue.git"
    },
    "license": "MIT",
    "bugs": {
        "url": "https://github.com/primefaces/primevue/issues"
    },
    "keywords": [
        "primevue",
        "vue",
        "vue.js",
        "vue2",
        "vue3",
        "ui library",
        "component library",
        "material",
        "bootstrap",
        "fluent",
        "tailwind",
        "unstyled",
        "passthrough"
    ],
    "web-types": "./web-types.json",
    "vetur": {
        "tags": "./vetur-tags.json",
        "attributes": "./vetur-attributes.json"
    },
    "peerDependencies": {
        "vue": "^3.0.0"
    }
}`;

  !fs.existsSync(outputDir) && fs.mkdirSync(outputDir);
  fs.writeFileSync(path.resolve(outputDir, 'package.json'), packageJson);
}
// =====================================================================================================================
addSFC(`./${CORE_LIB_DIR}`)
copyDependencies('./lib/', 'dist/');
addPackageJson();
// =====================================================================================================================
export default entries;
