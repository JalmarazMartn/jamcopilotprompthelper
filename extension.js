const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Extension "jamcopilotpromptmanager" is now active!');

    let disposablePromptView = vscode.commands.registerCommand('jamcopilotpromptmanager.createPrompt', function () {
        const createPrompt = require('./src/createPrompt.js');
        createPrompt.createPromptView(context);
    });
    context.subscriptions.push(disposablePromptView);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}