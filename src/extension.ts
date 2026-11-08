import vscode from "vscode"

import { GitHubUsernamesLinkProvider } from "./github-usernames-link-provider"
import { PathCompletionItemProvider } from "./path-completion-item-provider"
import { OwnerNameCompletionItemProvider } from "./owner-name-completion-item-provider"
import { showOwnersCommandHandler } from "./show-owners-command"
import { CodeownersHoverProvider } from "./codeowners-hover-provider"
import { statusBarTextEditorListener } from "./status-bar-text-editor-listener"
import { AlignOwnersFormattingProvider } from "./align-codeowners"
import { registerCodeownersDiagnostics } from "./codeowners-diagnostic-provider"
import { CodeownersLanguageServer } from "./language-server"

const COMMAND_ID = "github-code-owners.show-owners"

const STATUS_BAR_PRIORITY = 100

export async function activate(context: vscode.ExtensionContext) {
  console.log("CODEOWNERS: activated")
  const outputChannel = vscode.window.createOutputChannel(
    "Github Code Owners",
    {
      log: true,
    },
  )
  // Diagnostics, hovers, file counts and owners come from gh-codeowners'
  // language server, when this platform has it.
  const server = await CodeownersLanguageServer.start(context, outputChannel)
  const getServer = () => server

  const CODEOWNERS_SELECTOR: vscode.DocumentSelector = {
    language: "codeowners",
    scheme: "file",
  }

  const handles = {
    linkProvider: vscode.languages.registerDocumentLinkProvider(
      CODEOWNERS_SELECTOR,
      new GitHubUsernamesLinkProvider(),
    ),
  }

  vscode.languages.registerDocumentFormattingEditProvider(
    CODEOWNERS_SELECTOR,
    new AlignOwnersFormattingProvider(),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand(
      COMMAND_ID,
      showOwnersCommandHandler(outputChannel, getServer),
    ),
  )

  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      CODEOWNERS_SELECTOR,
      new OwnerNameCompletionItemProvider(),
      "@",
    ),
  )
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      CODEOWNERS_SELECTOR,
      new PathCompletionItemProvider(outputChannel),
      "/",
    ),
  )
  if (server == null) {
    context.subscriptions.push(
      vscode.languages.registerHoverProvider(
        CODEOWNERS_SELECTOR,
        new CodeownersHoverProvider(),
      ),
    )
    registerCodeownersDiagnostics(context)
  }

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    STATUS_BAR_PRIORITY,
  )
  statusBarItem.command = COMMAND_ID
  context.subscriptions.push(statusBarItem)

  const updateStatusBar = statusBarTextEditorListener(
    statusBarItem,
    outputChannel,
    getServer,
  )
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(updateStatusBar),
  )
  void updateStatusBar()

  vscode.workspace.onDidChangeConfiguration(() => {
    outputChannel.appendLine("Configuration changed: Reloading link provider")
    handles.linkProvider.dispose()
    handles.linkProvider = vscode.languages.registerDocumentLinkProvider(
      CODEOWNERS_SELECTOR,
      new GitHubUsernamesLinkProvider(),
    )
  })
}
