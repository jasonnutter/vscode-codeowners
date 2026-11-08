import fs from "fs"
import vscode from "vscode"
import {
  LanguageClient,
  TransportKind,
  type LanguageClientOptions,
  type ServerOptions,
} from "vscode-languageclient/node"

import { getLanguageServerPath } from "./configuration"

/** The rule that owns a file, from the `gh-codeowners/owner` request. */
type OwnerResult = {
  path: string
  codeowners: string
  rule: {
    range: {
      start: { line: number; character: number }
      end: { line: number; character: number }
    }
    pattern: string
    owners: string[]
  } | null
}

export type Owner = {
  codeowners: vscode.Uri
  rule: { range: vscode.Range; owners: string[] } | null
}

/**
 * The gh-codeowners binary: the one in the settings, or the one bundled with
 * this platform's build of the extension.
 */
function serverPath(context: vscode.ExtensionContext): string | null {
  const configured = getLanguageServerPath()
  if (configured) {
    return configured
  }
  const exe = process.platform === "win32" ? ".exe" : ""
  const bundled = context.asAbsolutePath(`bin/gh-codeowners${exe}`)
  return fs.existsSync(bundled) ? bundled : null
}

export class CodeownersLanguageServer {
  private constructor(private readonly client: LanguageClient) {}

  /**
   * Start gh-codeowners' language server, or return null if there's no
   * binary for this platform.
   */
  static async start(
    context: vscode.ExtensionContext,
    outputChannel: vscode.LogOutputChannel,
  ): Promise<CodeownersLanguageServer | null> {
    const command = serverPath(context)
    if (command == null) {
      outputChannel.appendLine(
        "No gh-codeowners binary for this platform: using the built-in features",
      )
      return null
    }
    const serverOptions: ServerOptions = {
      command,
      args: ["lsp"],
      transport: TransportKind.stdio,
    }
    const clientOptions: LanguageClientOptions = {
      documentSelector: [
        { language: "codeowners", scheme: "file" },
        { language: "codeowners", scheme: "untitled" },
      ],
      outputChannel,
    }
    const client = new LanguageClient(
      "githubCodeOwners",
      "GitHub Code Owners",
      serverOptions,
      clientOptions,
    )
    try {
      await client.start()
    } catch (e) {
      outputChannel.appendLine(
        `Couldn't start ${command}: ${e}. Using the built-in features.`,
      )
      return null
    }
    context.subscriptions.push(client)
    return new CodeownersLanguageServer(client)
  }

  /** The rule that owns `uri`, or null outside a repository with CODEOWNERS. */
  async owner(uri: vscode.Uri): Promise<Owner | null> {
    const result = await this.client.sendRequest<OwnerResult | null>(
      "gh-codeowners/owner",
      { uri: this.client.code2ProtocolConverter.asUri(uri) },
    )
    if (result == null) {
      return null
    }
    const p2c = this.client.protocol2CodeConverter
    return {
      codeowners: p2c.asUri(result.codeowners),
      rule: result.rule && {
        range: p2c.asRange(result.rule.range),
        owners: result.rule.owners,
      },
    }
  }
}
