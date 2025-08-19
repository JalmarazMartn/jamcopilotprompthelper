const vscode = require('vscode');
let prevSelection = '';
module.exports = {
    savePrompt: async function (prompt) {
        await savePrompt(prompt);
    },
    openPrompt: async function () {
        return await openPrompt();
    },
    beginAutomatePtompt: function () {
        beginAutomatePtompt();
    },
    endAutomatePtompt: async function (context) {
        await endAutomatePtompt(context);
    }

}
function savePrompt(prompt) {
    const fs = require('fs');
    //save with dialog with defalut name
    const options = {
        defaultUri: vscode.Uri.file(prompt.taskTitle + '.json'),
        filters: {
            JSON: ['json']
        }
    };
    vscode.window.showSaveDialog(options).then((uri) => {
        if (uri) {
            const json = JSON.stringify(prompt);
            fs.writeFileSync(uri.fsPath, json);
        }
    });
}
async function openPrompt() {
    const fs = require('fs');
    const options = {
        filters: {
            JSON: ['json']
        }
    };
    const uri = await vscode.window.showOpenDialog(options);
    if (uri) {
        const prompt = fs.readFileSync(uri[0].fsPath);
        const promptJson = JSON.parse(prompt.toString());
        return promptJson;
    }
}
function beginAutomatePtompt() {
    prevSelection = getEditorSelectedText();
    //save in envoriment variable
    vscode.commands.executeCommand('setContext', 'jamcopilotpromptmanager.enableEndAutomate', true);

}
function getEditorSelectedText() {
    const seleccion = vscode.window.activeTextEditor.selection;
    const selectText = vscode.window.activeTextEditor.document.getText(new vscode.Range(seleccion.start, seleccion.end));
    return selectText;
}

async function endAutomatePtompt(context) {
    await vscode.window.withProgress({
        cancellable: true,
        location: vscode.ProgressLocation.Notification,
        title: 'Generating prompt explanation...',
    }, async (progress) => {
        progress.report({ message: 'Calling Copilot for explanation with the prev selection and current selection' });
        const selectText = getEditorSelectedText();
        vscode.commands.executeCommand('setContext', 'jamcopilotpromptmanager.enableEndAutomate', false);
        let prompt = await getExplanationFromCopilot(selectText);
        const createPrompt = require('./createPrompt.js');
        await createPrompt.createPromptView(context, prompt);
        //vscode.workspace.onDidChangeTextDocument example
    });
}

async function getExplanationFromCopilot(selectText) {
    const thePromptsOfPrompts = getPromptOfPrompts();
    let prompt = {
        taskTitle: 'Automate Prompt explnation',
        taskExplanation: thePromptsOfPrompts + ' Before: ' + prevSelection + ' After: ' + selectText,
        inputIndications: '',
        inputExample: '',
        outputExample: '',
        command: 'Save'
    };
    const execPrompt = require('./execPrompt.js');
    const explanation = await execPrompt.execPrompt(prompt, selectText);
    prompt = {
        taskTitle: '',
        taskExplanation: explanation,
        inputIndications: '',
        inputExample: prevSelection,
        outputExample: selectText,
        command: ''
    };
    return prompt;
}
function getPromptOfPrompts() {
    const configuration = vscode.workspace.getConfiguration('jamcopilotpromptmanager');
    const promptOfPrompts = configuration.get('promptOfPrompts');
    let customPromptOfPrompts = '';
    if (promptOfPrompts) {
        for (let index = 0; index < promptOfPrompts.length; index++) {
            const element = promptOfPrompts[index];
            customPromptOfPrompts += element + '\n';
        }
        return customPromptOfPrompts;
    } else {
        return 'The inputs are the code with the label of before and the code with the label of after.' +
            ' Explain the changes made in the code between Before section and After section.' +
            ' The explanation must be clear and concise, focusing on the modifications made to the code.' +
            ' The explanation should be in a format that can be reused in future prompts and understandable by co-pilot to apply changes or suggestions.';
    }
}