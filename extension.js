const vscode = require('vscode');
const { registerClipboardTool } = require('./src/clipboardTool.js');
const { bringPromptToInstructions } = require('./src/bringPropmtToinstructions.js');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
    console.log('Extension "jamcopilotpromptmanager" is now active!');

    // Registrar la LM tool del portapapeles
    registerClipboardTool(context);

    let disposablePromptView = vscode.commands.registerCommand('jamcopilotpromptmanager.createPrompt', function () {
        const createPrompt = require('./src/createPrompt.js');
        createPrompt.createPromptView(context);
    });
    context.subscriptions.push(disposablePromptView);

    /*let disposableShowPromptHover = vscode.commands.registerCommand('jamcopilotpromptmanager.showPromptAsHover', function () {
        const createPrompt = require('./src/execPrompt.js');
        execPrompt.showPromptAsHover();
    });
    context.subscriptions.push(disposableShowPromptHover);*/
    // lo mismo con beginAutomatePtompt
    let disposablebeginAutomatePtompt = vscode.commands.registerCommand('jamcopilotpromptmanager.beginAutomatePtompt', function () {
        const savePrompt = require('./src/savePromt.js');
        savePrompt.beginAutomatePtompt();
    }
    );
    context.subscriptions.push(disposablebeginAutomatePtompt);

    let disposableEndAutomatePtompt = vscode.commands.registerCommand('jamcopilotpromptmanager.endAutomatePtompt', async function () {
        const savePrompt = require('./src/savePromt.js');
        await savePrompt.endAutomatePtompt(context);
    });
    context.subscriptions.push(disposableEndAutomatePtompt);

    let disposable = vscode.commands.registerCommand('jamcopilotprompthelper.bringPromptToInstructions', async function () {
        await bringPromptToInstructions();
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
}