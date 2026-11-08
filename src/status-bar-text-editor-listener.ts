import vscode from "vscode"
import { getOwnership, type Ownership } from "./show-owners-command"
import type { CodeownersLanguageServer } from "./language-server"

function formatNames(owners: string[]): string {
  if (owners.length > 2) {
    return `${owners[0]} & ${owners.length - 1} others`
  } else if (owners.length === 2) {
    return `${owners[0]} & 1 other`
  } else if (owners.length === 1) {
    return `${owners[0]}`
  } else {
    return "no owners"
  }
}

function formatToolTip({ rule }: Ownership, owners: string[]): string {
  if (rule == null || owners.length === 0) {
    return "No Owners"
  }
  const lineno = rule.range.start.line + 1

  if (owners.length <= 2) {
    return `Owned by ${owners.join(" and ")}\n(from CODEOWNERS line ${lineno})`
  }

  return `Owned by ${owners.slice(0, owners.length - 1).join(", ")} and ${
    owners[owners.length - 1]
  }\n(from CODEOWNERS line ${lineno})`
}

export function statusBarTextEditorListener(
  statusBarItem: vscode.StatusBarItem,
  outputChannel: vscode.OutputChannel,
  getServer: () => CodeownersLanguageServer | null,
) {
  return async () => {
    const res = await getOwnership(outputChannel, getServer())

    if (!res) {
      statusBarItem.hide()
      return
    }

    const owners = (res.rule?.owners ?? []).map((x) => x.replace(/^@/, ""))
    statusBarItem.text = `$(shield) ${formatNames(owners)}`

    statusBarItem.tooltip = formatToolTip(res, owners)
    statusBarItem.show()
  }
}
