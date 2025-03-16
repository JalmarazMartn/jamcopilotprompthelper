const vscode = require('vscode');
module.exports = {
    execPrompt: async function(prompt,inputText='')
    {
        return await execPrompt(prompt,inputText);
    }
}
async function execPrompt(prompt,inputText='') {
    const models = await vscode.lm.selectChatModels({
        vendor: getModelVendorConfiguration(),
        family: getModelFamilyConfiguration()
    });
    let chatResponse;

    const messages = [            
        vscode.LanguageModelChatMessage.User(prompt.taskExplanation),
        //Intructions: input is regex explanation and output two strings: one with only the regular expressión and other with a match example
        vscode.LanguageModelChatMessage.User('Example: when input:"' + prompt.inputExample + '", the output response must be:"' + prompt.outputExample+'"'),
        //12 digits
        //  ["\d{12}", "123456789012"]
        vscode.LanguageModelChatMessage.User(prompt.inputIndications +' ' + inputText)
        //Generate a regex for the following explanation: 
    ];
    try {
        chatResponse = await models[0].sendRequest(
            messages,
            {},
            new vscode.CancellationTokenSource().token
        );
       } catch (err) {
        if (err instanceof vscode.LanguageModelError) {
            console.log(err.message, err.code);
        } else {
            throw err;
        }
        return '';
    }

    try {
        /*const regex = chatResponse.text;
        vscode.window.showInformationMessage(`Generated Regex: ${regex}`);*/
        let totalResponse = '';
        for await (const fragment of chatResponse.text) {
            totalResponse += fragment                
        }
        //vscode.window.showInformationMessage(`reponse: ${totalResponse}`);
        return totalResponse;
    } catch (err) {
        vscode.window.showErrorMessage(`Failed : ${err.message}`);
        return '';
    }
}
function getModelFamilyConfiguration() {
	const ExtConf = vscode.workspace.getConfiguration('');
	if (ExtConf) {
		return(ExtConf.get('jamcopilotprompthelper.modelFamily'));
	}
}

function getModelVendorConfiguration() {
	const ExtConf = vscode.workspace.getConfiguration('');
	if (ExtConf) {
		return(ExtConf.get('jamcopilotprompthelper.modelVendor'));
	}
}