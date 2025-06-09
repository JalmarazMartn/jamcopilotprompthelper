const vscode = require('vscode');
module.exports = {
    execPrompt: async function(prompt,inputText='')
    {
        return await execPrompt(prompt,inputText);
    },
    /*showPromptAsHover: function()
    {
        showPromptAsHover();
    }*/
}
async function execPrompt(prompt,inputText='') {
//Poner    const allModels = await vscode.lm.selectChatModels({});
    const models = await vscode.lm.selectChatModels({
        vendor: getModelVendorConfiguration(),
        family: getModelFamilyConfiguration()
    });

    // Check if models were found
    if (!models || models.length === 0) {
        vscode.window.showErrorMessage('No language models found. Please check your configuration.');
        return '';
    }    
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
		return(ExtConf.get('jamcopilotpromptmanager.modelFamily'));
	}
}

function getModelVendorConfiguration() {
	const ExtConf = vscode.workspace.getConfiguration('');
	if (ExtConf) {
		return(ExtConf.get('jamcopilotpromptmanager.modelVendor'));
	}
}
/*function showPromptAsHover()
{
    const suggestion = '{"command":"Save","taskTitle":"CreateReservEntryFor","taskExplanation":"Change procedure call substiting two last parameters by ReservEntry, as example. Important: Preserve original carriage returns from input. Be careful you are not returning the response with carriage  returns","inputIndications":"Convert AL procedure calling","inputExample":"        CrearReserva.CreateReservEntryFor(Database::\"Sales Line\",\n        LinVenta.\"Document Type\",\n        LinVenta.\"Document No.\",\n        newLabel,\n        0,\n        LinVenta.\"Line No.\",\n        LinVenta.\"Qty. per Unit of Measure\",\n        LinVenta.Quantity,\n        LinVenta.\"Quantity (Base)\",\n        newLabel,\n        \'ForLotNo\');\n","outputExample":"        ReservEntry.\"Lot No.\" := \'ForLotNo\';\n        CrearReserva.CreateReservEntryFor(Database::\"Sales Line\",\n        LinVenta.\"Document Type\",\n        LinVenta.\"Document No.\",\n        newLabel,\n        0,\n        LinVenta.\"Line No.\",\n        LinVenta.\"Qty. per Unit of Measure\",\n        LinVenta.Quantity,\n        LinVenta.\"Quantity (Base)\",\n        ReservEntry);","inputTest":"       CrearReserva.CreateReservEntryFor(Database::\"Sales Line\",\n        LinVenta.\"Document Type\",\n        LinVenta.\"Document No.\",\n        newLabel,\n        0,\n        LinVenta.\"Line No.\",\n        LinVenta.\"Qty. per Unit of Measure\",\n        LinVenta.Quantity,\n        LinVenta.\"Quantity (Base)\",\n        newLabel,\n        NewLotNo);\n"}'
    const decorationType = vscode.window.createTextEditorDecorationType({
        after: {
          //contentText: ` ${suggestion.substring(0, 25) + '...'}`,
          contentText: ` ${suggestion + '...'}`,
          color: 'grey'
        }
      });
    
      // get the end of the line with the specified line number
      const range = new vscode.Range(
        new vscode.Position(0, 0),
        new vscode.Position(0, 1000)
      );
    
      const decoration = { range: range, hoverMessage: suggestion };
    
      vscode.window.activeTextEditor.setDecorations(decorationType, [decoration])
}*/