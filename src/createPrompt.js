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
        if (message.promptData.command === 'end') {
          WebviewSteps.dispose();
          return;
        }
        const execPrompt = require('./execPrompt.js');
        const outputTest = await execPrompt.execPrompt(message.promptData, message.promptData.inputTest);
        
        // Use replaceHTMLContent to update the HTML with the promptData
        const updatedHTML = replaceHTMLContent(HTMLContent, message.promptData);
        WebviewSteps.webview.html = updatedHTML + ExecNumber.toString() + '.' + message.promptData.command + ' ' + outputTest;
    },
      undefined,
      context.subscriptions
    );    
    ExecNumber = 0;
    
    // Initialize with default empty content
    const defaultPromptData = {
      taskTitle: 'Enter your task title here...',
      taskExplanation: 'Enter your task explanation here...',
      inputIndications: 'Enter your input indications here...',
      inputExample: 'Enter your input example here...',
      outputExample: 'Enter your output example here...',
      inputTest: 'Enter your input test here...'
    };
    
    // Use replaceHTMLContent to ensure all placeholders are properly set
    const initialHTML = replaceHTMLContent(HTMLContent, defaultPromptData);
    WebviewSteps.webview.html = initialHTML;
  }
  async function GetHTMLContent(context) {
    const path = require('path');
    const fs = require('fs');
    const filePath = context.asAbsolutePath(path.join('src', 'Html', 'taskExplanation.html'));
    let FinalTable = fs.readFileSync(filePath, 'utf8');
    return FinalTable;
  }
  function replaceHTMLContent(HTMLContent, promptData) {
    // Replace content in taskExplanation div
    HTMLContent = HTMLContent.replace(
      /<div id="taskExplanation" class="rtf-control" contenteditable="true">\s*[^<]*<\/div>/,
      `<div id="taskExplanation" class="rtf-control" contenteditable="true">${promptData.taskExplanation}</div>`
    );
    
    // Replace content in other controls if needed
    HTMLContent = HTMLContent.replace(
      /<div id="taskTitle" class="textbox" contenteditable="true">\s*[^<]*<\/div>/,
      `<div id="taskTitle" class="textbox" contenteditable="true">${promptData.taskTitle}</div>`
    );
    
    HTMLContent = HTMLContent.replace(
      /<div id="inputIndications" class="rtf-control" contenteditable="true">\s*[^<]*<\/div>/,
      `<div id="inputIndications" class="rtf-control" contenteditable="true">${promptData.inputIndications}</div>`
    );
    
    HTMLContent = HTMLContent.replace(
      /<div id="inputExample" class="rtf-control" contenteditable="true">\s*[^<]*<\/div>/,
      `<div id="inputExample" class="rtf-control" contenteditable="true">${promptData.inputExample}</div>`
    );
    
    HTMLContent = HTMLContent.replace(
      /<div id="outputExample" class="rtf-control" contenteditable="true">\s*[^<]*<\/div>/,
      `<div id="outputExample" class="rtf-control" contenteditable="true">${promptData.outputExample}</div>`
    );
    
    HTMLContent = HTMLContent.replace(
      /<div id="inputTest" class="rtf-control small-rtf" contenteditable="true">\s*[^<]*<\/div>/,
      `<div id="inputTest" class="rtf-control small-rtf" contenteditable="true">${promptData.inputTest}</div>`
    );
    
    return HTMLContent;
  }