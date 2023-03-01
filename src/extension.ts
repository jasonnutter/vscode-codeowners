import vscode from "vscode"
import findUp from "find-up"
import path from "path"

type CodeOwners = {
  getOwnership(
    codeownersFilePath: string,
    filePaths: string[],
  ): Promise<{ owners: string[] }[]>
}
const GitHubCodeowners: CodeOwners = require("@snyk/github-codeowners/dist/lib/ownership")

const COMMAND_ID = "github-code-owners.show-owners"

const STATUS_BAR_PRIORITY = 100

async function getOwners(): Promise<string[] | null> {
  if (!vscode.window.activeTextEditor) {
    return []
  }

  const { fileName, uri } = vscode.window.activeTextEditor.document

  const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri)

  if (workspaceFolder == null) {
    return null
  }

  const {
    uri: { fsPath: workspacePath },
  } = workspaceFolder

  const codeownersFilePath = findUp.sync("CODEOWNERS", { cwd: workspacePath })
  if (codeownersFilePath == null) {
    return null
  }
  console.log({ codeownersFilePath })

  const file = fileName.split(`${workspacePath}${path.sep}`)[1]

  try {
    const res = await GitHubCodeowners.getOwnership(codeownersFilePath, [file])
    if (res.length > 0) {
      return res[0].owners.map((x) => x.replace(/^@/, ""))
    }
    return []
  } catch (e) {
    console.error(e)
    return []
  }
}

function formatNames(owners: string[]): string {
  if (owners.length > 2) {
    return `${owners[0]} & ${owners.length - 1} others`
  } else if (owners.length === 2) {
    return `${owners[0]} & 1 other`
  } else if (owners.length === 1) {
    return `${owners[0]}`
  } else {
    return "None"
  }
}

export function activate(context: vscode.ExtensionContext) {
  console.log("CODEOWNERS: activated")

  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    STATUS_BAR_PRIORITY,
  )

  statusBarItem.command = COMMAND_ID
  context.subscriptions.push(statusBarItem)

  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_ID, async () => {
      const owners = await getOwners()
      if (owners == null) {
        return
      }
      const res = await vscode.window.showQuickPick(
        owners.map((owner) => ({
          label: owner.replace(/^@/, ""),
          description: "View in GitHub",
        })),
      )
      if (res != null) {
        const isTeamName = res.label.includes("/")
        const githubUsername = res.label

        if (isTeamName) {
          const [org, name] = githubUsername.split(/\//)
          vscode.env.openExternal(
            vscode.Uri.parse(`https://github.com/orgs/${org}/teams/${name}`),
          )
        } else {
          vscode.env.openExternal(
            vscode.Uri.parse(`https://github.com/${githubUsername}`),
          )
        }
      }
    }),
  )

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(async () => {
      const owners = await getOwners()

      if (!owners) {
        statusBarItem.hide()
        return
      }

      statusBarItem.text = `$(shield) ${formatNames(owners)}`

      statusBarItem.tooltip = owners.join(", ")
      statusBarItem.show()
    }),
  )
}
