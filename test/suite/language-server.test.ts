import assert from "assert"
import { execFileSync } from "child_process"
import fs from "fs"
import os from "os"
import path from "path"
import vscode from "vscode"

const repoRoot = path.resolve(__dirname, "../../..")
const exe = process.platform === "win32" ? ".exe" : ""
const bundled = path.join(repoRoot, "bin", `gh-codeowners${exe}`)

async function waitFor<T>(
  get: () => T | Thenable<T>,
  done: (value: T) => boolean,
): Promise<T> {
  const deadline = Date.now() + 10000
  for (;;) {
    const value = await get()
    if (done(value) || Date.now() > deadline) {
      return value
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
}

suite("language server", function () {
  // `s/download-server <target>` puts a binary in bin/.
  if (!fs.existsSync(bundled)) {
    return
  }

  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "codeowners-test-"))
  fs.mkdirSync(path.join(dir, "src"))
  fs.writeFileSync(path.join(dir, "src", "a.ts"), "")
  fs.writeFileSync(path.join(dir, "src", "b.ts"), "")
  fs.writeFileSync(
    path.join(dir, "CODEOWNERS"),
    "/src/ @acme/web\n/docs/ @acme/docs\n/app/[id]/ @acme/web\n",
  )
  execFileSync("git", ["init", "-q"], { cwd: dir })
  execFileSync("git", ["add", "."], { cwd: dir })
  const codeowners = vscode.Uri.file(path.join(dir, "CODEOWNERS"))
  const owned = vscode.Uri.file(path.join(dir, "src", "a.ts"))

  test("marks broken and unused rules", async () => {
    const document = await vscode.workspace.openTextDocument(codeowners)
    await vscode.window.showTextDocument(document)
    const diagnostics = await waitFor(
      () => vscode.languages.getDiagnostics(codeowners),
      (d) => d.length >= 2,
    )
    const broken = diagnostics.find(
      (d) => d.severity === vscode.DiagnosticSeverity.Error,
    )
    assert.strictEqual(broken?.range.start.line, 2)
    const unused = diagnostics.find((d) =>
      d.tags?.includes(vscode.DiagnosticTag.Unnecessary),
    )
    assert.strictEqual(unused?.range.start.line, 1)
  })

  test("shows each rule's file count", async () => {
    const document = await vscode.workspace.openTextDocument(codeowners)
    const hints = await waitFor(
      () =>
        vscode.commands.executeCommand<vscode.InlayHint[]>(
          "vscode.executeInlayHintProvider",
          codeowners,
          new vscode.Range(0, 0, document.lineCount, 0),
        ),
      (h) => h.length > 0,
    )
    assert.deepStrictEqual(
      hints.map((h) => [h.position.line, h.label]),
      [
        [0, "2 files"],
        [1, "0 files"],
        [2, "0 files"],
      ],
    )
  })

  test("opens the rule that owns a file", async () => {
    await vscode.window.showTextDocument(owned)
    await vscode.commands.executeCommand("github-code-owners.show-owners")
    const editor = vscode.window.activeTextEditor
    assert.strictEqual(editor?.document.uri.fsPath, codeowners.fsPath)
    assert.deepStrictEqual(
      editor.selection,
      new vscode.Selection(0, 0, 0, "/src/".length),
    )
  })
})
