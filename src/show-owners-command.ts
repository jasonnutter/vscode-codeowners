import vscode from "vscode"
import path from "path"

import { OwnershipEngine } from "@snyk/github-codeowners/dist/lib/ownership"
import type { CodeownersLanguageServer } from "./language-server"

export type Ownership = {
  codeowners: vscode.Uri
  /** The owning rule, or null if no rule owns the file. */
  rule: { range: vscode.Range; owners: string[] } | null
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await vscode.workspace.fs.stat(vscode.Uri.file(path))
    return true
  } catch (e: unknown) {
    // @ts-expect-error we should see this error.
    if (e.code !== "FileNotFound") {
      console.error("github-code-owners:", e)
    }
    return false
  }
}
const PathOptions = [".github/CODEOWNERS", "docs/CODEOWNERS", "CODEOWNERS"]

async function findCodeOwnersFile(
  startDirectory: string,
): Promise<string | null> {
  for (const pathOption of PathOptions) {
    const codeownersPath = path.join(startDirectory, pathOption)
    if (await fileExists(codeownersPath)) {
      return codeownersPath
    }
  }
  return null
}

/** Find the owner without the language server. */
async function getBuiltInOwnership(
  document: vscode.TextDocument,
  outputChannel: vscode.OutputChannel,
): Promise<Ownership | null> {
  const { fileName, uri } = document

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri)

  if (workspaceFolder == null) {
    outputChannel.appendLine(`Could not locate workspace for file: ${uri}`)
    return null
  }

  const {
    uri: { fsPath: workspacePath },
  } = workspaceFolder

  const codeownersFilePath = await findCodeOwnersFile(workspacePath)
  if (codeownersFilePath == null) {
    outputChannel.appendLine(
      `Could not find code owners file for workspace path: ${workspacePath}`,
    )
    return null
  }

  const file = fileName.split(`${workspacePath}${path.sep}`)[1]

  const codeOwners = OwnershipEngine.FromCodeownersFile(codeownersFilePath)
  const res = codeOwners.calcFileOwnership(file)
  const codeowners = vscode.Uri.file(codeownersFilePath)

  if (res == null) {
    outputChannel.appendLine(`No owners for file: ${file}`)
    return { codeowners, rule: null }
  }

  const codeownersDocument = await vscode.workspace.openTextDocument(codeowners)
  return {
    codeowners,
    rule: {
      range: codeownersDocument.lineAt(res.lineno).range,
      owners: res.owners,
    },
  }
}

export async function getOwnership(
  outputChannel: vscode.OutputChannel,
  server: CodeownersLanguageServer | null,
): Promise<Ownership | null> {
  const document = vscode.window.activeTextEditor?.document
  if (document == null) {
    return null
  }
  if (server == null) {
    return getBuiltInOwnership(document, outputChannel)
  }
  if (document.uri.scheme !== "file") {
    return null
  }
  try {
    return await server.owner(document.uri)
  } catch (e) {
    outputChannel.appendLine(`Could not find owners of ${document.uri}: ${e}`)
    return null
  }
}

export function showOwnersCommandHandler(
  outputChannel: vscode.OutputChannel,
  getServer: () => CodeownersLanguageServer | null,
) {
  return async () => {
    const ownership = await getOwnership(outputChannel, getServer())
    if (ownership == null) {
      return
    }
    const doc = await vscode.workspace.openTextDocument(ownership.codeowners)
    if (ownership.rule != null) {
      const { range } = ownership.rule
      const textEditor = await vscode.window.showTextDocument(doc)
      textEditor.selection = new vscode.Selection(range.start, range.end)
      textEditor.revealRange(range, vscode.TextEditorRevealType.InCenter)
    }
  }
}
