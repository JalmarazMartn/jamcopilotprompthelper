const vscode = require('vscode');
let ExecNumber = 0;
let HTMLContent = '';
module.exports = {
    createPromptView: async function(context)
    {
        await createPromptView(context);
    }
}
async function createPromptView(context) {
    HTMLContent = await GetHTMLContent(context);
    const WebviewSteps = vscode.window.createWebviewPanel(
      'Copilot Prompt Helper',
      'Copilot Prompt Helper',
      vscode.ViewColumn.One,
      {
        enableScripts: true
      }
    );    
    
    WebviewSteps.webview.onDidReceiveMessage(
      async function (message) {
        ExecNumber = ExecNumber + 1;        
        WebviewSteps.webview.html = HTMLContent + ExecNumber.toString() + '.' + message.command;
    },
      undefined,
      context.subscriptions
    );    
    ExecNumber = 0;
    WebviewSteps.webview.html = HTMLContent;
  }
  async function GetHTMLContent(context) {
    const path = require('path');
    const fs = require('fs');
    const filePath = context.asAbsolutePath(path.join('src', 'Html', 'taskExplanation.html'));
    let FinalTable = fs.readFileSync(filePath, 'utf8');
    return FinalTable;
  }

