const vscode = require('vscode');
module.exports = {
    savePrompt: async function(prompt)
    {
        await savePrompt(prompt);
    },
    openPrompt: async function()
    {
        return await openPrompt();
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