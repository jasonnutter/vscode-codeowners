# [github-code-owners](https://github.com/chdsbd/vscode-github-code-owners) [![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/chdsbd.github-code-owners.svg)](https://marketplace.visualstudio.com/items?itemName=chdsbd.github-code-owners) [![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/chdsbd.github-code-owners.svg)](https://marketplace.visualstudio.com/items?itemName=chdsbd.github-code-owners)

A VS Code extension to display the GitHub Code Owners for the current file, as defined in the [CODEOWNERS](https://help.github.com/articles/about-codeowners/) file.

## Features

### Status bar

Shows the first code owner. Click to see matching line in CODEOWNERS file.

<img src="./images/none.png" height="22px" alt="no code owners"/> <img src="./images/user.png" height="22px" alt="one user code owner"/> <img src="./images/team-and-other.png" height="22px" alt="a team code owner and other"/>

### Language support

#### Link usernames to GitHub

<img src="./images/open-in-github.png" alt="click to open username in GitHub" height="70px"/>

#### Link usernames to Slack

<img src="./images/open-in-slack.png" alt="click to open username in GitHub" height="110px"/>

> Define a Slack mapping in your VSCode settings (`github-code-owners.team-mapping.slack`) to enable this feature.

#### Auto complete

<img src="./images/autocomplete.gif" alt="auto complete of paths and usernames" width="618px" height="359px"/>

#### Syntax highlighting

<img src="./images/syntax-highlighting.png" alt="syntax highlighting" height="284px"/>

Escapes, wildcards, comments and owners are highlighted the way GitHub reads them, and patterns or owners that make GitHub skip a line are marked invalid. [`examples/CODEOWNERS`](examples/CODEOWNERS) has a rule for each case.

#### Formatting

> Enable formatting by setting `github-code-owners.format.enabled` to `true`.

<img src="./images/formatting.gif" alt="auto complete of paths and usernames" width="408px" height="185px"/>

### Command

Open matching line in CODEOWNERS file with the `GitHub Code Owners: Show owners of current file` command.

<img src="./images/command.png" alt="code owners command" height="63px"/>

## Install

### From online marketplace

Open the [online marketplace listing](https://marketplace.visualstudio.com/items?itemName=chdsbd.github-code-owners#overview) for GitHub Code Owners and click "Install". Follow the prompts to open VSCode and install GitHub Code Owners.

### From VSCode

In VSCode, type `CMD`+`P` and enter `ext install chdsbd.github-code-owners`. Or search for and install `chdsbd.github-code-owners` via the extensions tab.

### From Github release

Download the extension package from the [latest Github release](https://github.com/chdsbd/vscode-github-code-owners/releases/latest) and run `code --install-extension github-code-owners-*.vsix`

### From source

Clone [this repo](https://github.com/chdsbd/vscode-github-code-owners) and run `npm ci` and `npm run package`. Install the resulting package with `code --install-extension github-code-owners-*.vsix`

## Related extensions

- [CODEOWNERS](https://marketplace.visualstudio.com/items?itemName=jasonnutter.vscode-codeowners) by Jason Nutter
- [vs-codeowners](https://marketplace.visualstudio.com/items?itemName=dtangren.vs-codeowners) by softprops
- [CodeOwners](https://marketplace.visualstudio.com/items?itemName=HCoban.codeowners) by HCoban
- [CODEOWNERS Linter](https://marketplace.visualstudio.com/items?itemName=fmenezes.vscode-codeowners-linter) by Filipe Constantinov Menezes
- [Codeowners Extended](https://marketplace.visualstudio.com/items?itemName=noahm.codeowners-extended) by Noah Manneschmidt

## Fork

This repository is forked from [jasonnutter/vscode-codeowners](https://github.com/jasonnutter/vscode-codeowners), with UI changes and more correct CODEOWNERS compliance via [@snyk/github-codeowners](https://www.npmjs.com/package/@snyk/github-codeowners).
