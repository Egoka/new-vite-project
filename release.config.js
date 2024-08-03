module.exports = {
  branches: ["main"],
  repositoryUrl: "https://github.com/Egoka/new-vite-project.git",
  plugins: [
    "@semantic-release/commit-analyzer", // Анализирует коммиты для определения версии
    "@semantic-release/release-notes-generator", // Генерирует заметки о релизе
    "@semantic-release/changelog", // Обновляет CHANGELOG.md
    "@semantic-release/npm", // Публикует в npm
    "@semantic-release/github", // Создает релизы на GitHub
    [
      "@semantic-release/git",
      {
        assets: ["package.json", "CHANGELOG.md"],
        message: "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ]
  ]
}
