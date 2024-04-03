const vscode = require('vscode');
const Codeowners = require('codeowners');
const path = require('path');

const COMMAND_ID = 'vscode-codeowners.show-owners';
const STATUS_BAR_PRIORITY = 100;

// Function to get the custom CODEOWNERS file name or default to "CODEOWNERS"
const getCodeownersFileName = () => {
    const config = vscode.workspace.getConfiguration('codeowners');
    return config.fileName || 'CODEOWNERS';
};

const getOwners = () => {
    if (!vscode.window.activeTextEditor) {
        return [];
    }

    const { fileName, uri } = vscode.window.activeTextEditor.document;

    const {
        uri: { fsPath: workspacePath }
    } = vscode.workspace.getWorkspaceFolder(uri);

    let folder;
    try {
        const codeownersFileName = getCodeownersFileName(); // Use the custom or default file name
        folder = new Codeowners(path.join(workspacePath, '.github'), codeownersFileName); // Assuming CODEOWNERS is in the .github folder
    } catch {
        // no CODEOWNERS file
        return null;
    }

    const file = fileName.split(`${workspacePath}${path.sep}`)[1];

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

const deactivate = () => { };
exports.deactivate = deactivate;
