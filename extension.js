const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Extension "jamcopilotprompthelper" is now active!');

    let disposablePromptView = vscode.commands.registerCommand('jamcopilotprompthelper.createPrompt', function () {
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