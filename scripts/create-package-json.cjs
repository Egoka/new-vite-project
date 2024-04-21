const fs = require('fs');
try {
  const data = fs.readFileSync('./package.json', 'utf8');
  const packageJson = JSON.parse(data);
  console.log(packageJson);
  // Создаем содержимое для package.json
  const packageJsonContent = {
    "name": "@egorkas/vite-components",
    "publishConfig": {
      "registry": "https://npm.pkg.github.com/@egoka"
    },
    "repository": {
      "type": "git",
      "url": "https://github.com/Egoka/new-vite-project"
    },
    "type": "module",
    "main": "./vue-component-npm-example.umd.cjs",
    "module": "./vue-component-npm-example.js",
    "types": "./main.d.ts",
    "exports": {
      ".": {
        "import": "./vue-component-npm-example.js",
        "require": "./vue-component-npm-example.umd.js"
      },
      "./dist/style.css": "./style.css"
    },
  }
  if ("version" in packageJson )
    packageJsonContent.version = packageJson.version;
  if ("peerDependencies" in packageJson && "description" in packageJson) {}
    packageJsonContent.peerDependencies = {
    ...packageJson.peerDependencies,
    ...packageJson.description,
    }
  if ("devDependencies" in packageJson)
    packageJsonContent.devDependencies = packageJson.devDependencies


  // Преобразуем объект в JSON
  const packageJsonString = JSON.stringify(packageJsonContent, null, 2);

  // Путь к файлу package.json в папке dist
  const packageJsonPath = 'dist/package.json';

  // Записываем JSON-строку в файл package.json
  fs.writeFileSync(packageJsonPath, packageJsonString);

  console.log('Generated package.json in dist folder.');
} catch (err) {
  console.error(err);
}
