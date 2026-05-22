const { withDangerousMod } = require("expo/config-plugins")
const path = require("path")
const fs = require("fs")

function withResRawAudio(config) {
  return withDangerousMod(config, [
    "android",
    async (config) => {
      const rawDir = path.join(
        config.modRequest.platformProjectRoot,
        "app/src/main/res/raw"
      )
      if (!fs.existsSync(rawDir)) {
        fs.mkdirSync(rawDir, { recursive: true })
      }

      const sourceDir = path.join(
        config.modRequest.projectRoot,
        "src/assets/audio"
      )
      const files = fs.readdirSync(sourceDir)
      for (const file of files) {
        const src = path.join(sourceDir, file)
        const dest = path.join(rawDir, file.replace(/-/g, "_"))
        if (fs.statSync(src).isFile()) {
          fs.copyFileSync(src, dest)
        }
      }
      return config
    },
  ])
}

module.exports = withResRawAudio
