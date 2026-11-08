import vscode from "vscode"

export function getGitHubUrl(): string {
  /*
   * When using GitHub Enterprise Server, you should have a 'github-enterprise.uri'
   * configuration setting.
   *
   * This configuration option is provided by built in "GitHub Authentication" extension
   * https://github.com/microsoft/vscode/blob/ccb95fd921349023027a0df25ed291b0992b9a18/extensions/github-authentication/src/extension.ts#L10
   */
  const setting = vscode.workspace
    .getConfiguration()
    .get<string>("github-enterprise.uri")
  if (!setting) {
    return "https://github.com"
  }
  return setting
}

export function isFormatEnabled(): boolean {
  const formatEnabled = vscode.workspace
    .getConfiguration()
    .get("githubCodeOwners.format.enabled")
  if (typeof formatEnabled === "boolean") {
    return formatEnabled
  }
  const formatEnabledDeprecated = vscode.workspace
    .getConfiguration()
    .get("github-code-owners.format.enabled")
  if (typeof formatEnabledDeprecated === "boolean") {
    return formatEnabledDeprecated
  }
  return false
}

export function getAlignmentOffset(): number {
  const alignmentOffset = vscode.workspace
    .getConfiguration()
    .get("githubCodeOwners.format.alignmentOffset")
  if (typeof alignmentOffset === "number") {
    return alignmentOffset
  }
  const alignmentOffsetDeprecated = vscode.workspace
    .getConfiguration()
    .get("github-code-owners.format.alignment-offset")
  if (typeof alignmentOffsetDeprecated === "number") {
    return alignmentOffsetDeprecated
  }
  return 4
}

export type SlackMappingConfigurationItem = {
  domain: string
  channel: string
  username: string
}

export function getTeamMappingSlack(): Array<SlackMappingConfigurationItem> {
  const setting = vscode.workspace
    .getConfiguration()
    .get<Array<SlackMappingConfigurationItem>>(
      "githubCodeOwners.teamMapping.slack",
    )
  if (setting != null) {
    return setting
  }
  return (
    vscode.workspace
      .getConfiguration()
      .get<Array<SlackMappingConfigurationItem>>(
        "github-code-owners.team-mapping.slack",
      ) ?? []
  )
}

export function getLanguageServerPath(): string | null {
  const setting = vscode.workspace
    .getConfiguration()
    .get<string>("githubCodeOwners.languageServer.path")
  return setting || null
}
