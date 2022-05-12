const vscode = require('vscode');
const Codeowners = require('codeowners');
const path = require('path');

const COMMAND_ID = 'vscode-codeowners.show-owners';
const STATUS_BAR_PRIORITY = 100;

const getOwners = () => {
    if (!vscode.window.activeTextEditor) {
        return [];
    }

    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) return null;

    const { fileName } = activeTextEditor.document;
    let folder;
    try {
        folder = new Codeowners(path.dirname(path.resolve(fileName)));
    } catch {
        // no CODEOWNERS file
        return null;
    }

    const file = path.relative(folder.codeownersDirectory, fileName)
    return folder.getOwner(file);
};

const activate = context => {
    console.log('CODEOWNERS: activated');

    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, STATUS_BAR_PRIORITY);

    statusBarItem.command = COMMAND_ID;
    context.subscriptions.push(statusBarItem);

    context.subscriptions.push(
        vscode.commands.registerCommand(COMMAND_ID, () => {
            vscode.window.showQuickPick(getOwners());
        })
    );

    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor(() => {
            const owners = getOwners();

            if (!owners) {
                statusBarItem.hide();
                return;
            }

            if (owners.length > 2) {
                statusBarItem.text = `CODEOWNERS: ${owners[0]} & ${owners.length - 1} others`;
            } else if (owners.length === 2) {
                statusBarItem.text = `CODEOWNERS: ${owners[0]} & 1 other`;
            } else if (owners.length === 1) {
                statusBarItem.text = `CODEOWNERS: ${owners[0]}`;
            } else {
                statusBarItem.text = 'CODEOWNERS: None';
            }

            statusBarItem.tooltip = 'Show CODEOWNERS';
            statusBarItem.show();
        })
    );
};

exports.activate = activate;

const deactivate = () => {};
exports.deactivate = deactivate;
