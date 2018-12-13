const vscode = require('vscode');
const Codeowners = require('codeowners');

const getOwners = () => {
    const workspace = vscode.workspace.workspaceFolders[0].uri.fsPath;
    const folder = new Codeowners(workspace);

    const file = vscode.window.activeTextEditor.document.fileName.split(
        workspace
    )[1];

    return folder.getOwner(file);
};

function activate(context) {
    console.log('codeowners extension activated');

    const commandId = 'extension.parse';

    const statusBarItem = vscode.window.createStatusBarItem(
        vscode.StatusBarAlignment.Right,
        50
    );

    statusBarItem.command = commandId;
    context.subscriptions.push(statusBarItem);

    context.subscriptions.push(
        vscode.commands.registerCommand(commandId, () => {
            vscode.window.showQuickPick(getOwners());
        })
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => {
            statusBarItem.text = getOwners.join(' ');
            statusBarItem.show();
        })
    );
}

exports.activate = activate;

function deactivate() {}
exports.deactivate = deactivate;
