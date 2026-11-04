import fs from "fs"
import os from "os"
import path from "path"

import { runTests } from "@vscode/test-electron"

async function main() {
  try {
    // The folder containing the Extension Manifest package.json
    // Passed to `--extensionDevelopmentPath`
    const extensionDevelopmentPath = path.resolve(__dirname, "../../")

    // The path to test runner
    // Passed to --extensionTestsPath
    const extensionTestsPath = path.resolve(__dirname, "./suite/index")

    // VS Code puts its IPC socket in the user data directory. The default,
    // inside the checkout, can pass the macOS limit of 103 characters.
    const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), "vscode-test-"))

    // Download VS Code, unzip it and run the integration test
    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: ["--user-data-dir", userDataDir],
    })
  } catch (err) {
    console.error("Failed to run tests", err)
    process.exit(1)
  }
}

main()
