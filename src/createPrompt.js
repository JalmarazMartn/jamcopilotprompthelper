const vscode = require('vscode');
let ExecNumber = 0;
let HTMLContent = '';
module.exports = {
  createPromptView: async function (context,prompt) {
    await createPromptView(context,prompt);
  }
}
async function createPromptView(context,prompt) {
  HTMLContent = await GetHTMLContent(context);
  const WebviewSteps = vscode.window.createWebviewPanel(
    'Copilot Prompt Manager',
    'Copilot Prompt Manager',
    vscode.ViewColumn.One,
    {
      enableScripts: true
    }
  );
  WebviewSteps.webview.onDidReceiveMessage(
    async function (message) {
      let updatedHTML = '';
      let promptResponse = '';
      ExecNumber = ExecNumber + 1;
      if (message.promptData.command === 'Save') {
        // Save the promptData to a file
        const savePrompt = require('./savePromt.js');
        savePrompt.savePrompt(message.promptData);
        //WebviewSteps.dispose();
        //return;
      }
      if (message.promptData.command === 'Open') {
        // Open the promptData from a file
        const openPrompt = require('./savePromt.js');
        const promptData = await openPrompt.openPrompt();
        updatedHTML = replaceHTMLContent(HTMLContent, promptData);
        updatedHTML = replaceisOpenOperation(updatedHTML);
      }
      else {
        const execPrompt = require('./execPrompt.js');
        promptResponse = await execPrompt.execPrompt(message.promptData, message.promptData.inputTest);

        // Use replaceHTMLContent to update the HTML with the promptData
        updatedHTML = replaceHTMLContent(HTMLContent, message.promptData);
        updatedHTML = replaceResponse(updatedHTML, promptResponse);
      }
      WebviewSteps.webview.html = updatedHTML + ExecNumber.toString() + '.' + message.promptData.command + ' ' +promptResponse;
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
  let initialHTML = '';
  initialHTML = replaceHTMLContent(HTMLContent, defaultPromptData);
  if (prompt) {
    // If a prompt is provided, replace the HTML content with the prompt data
    initialHTML = replaceHTMLContent(HTMLContent, prompt);
  }

  // Use replaceHTMLContent to ensure all placeholders are properly set  
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
  // Replace content in taskExplanation textarea
  HTMLContent = HTMLContent.replace(
    /<textarea id="taskExplanation" class="multiline-text">[^<]*<\/textarea>/,
    `<textarea id="taskExplanation" class="multiline-text">${promptData.taskExplanation}</textarea>`
  );

  // Replace content in other controls if needed
  HTMLContent = HTMLContent.replace(
    /<div id="taskTitle" class="textbox" contenteditable="true">\s*[^<]*<\/div>/,
    `<div id="taskTitle" class="textbox" contenteditable="true">${promptData.taskTitle}</div>`
  );

  HTMLContent = HTMLContent.replace(
    /<textarea id="inputIndications" class="multiline-text">[^<]*<\/textarea>/,
    `<textarea id="inputIndications" class="multiline-text">${promptData.inputIndications}</textarea>`
  );

  HTMLContent = HTMLContent.replace(
    /<textarea id="inputExample" class="multiline-text">[^<]*<\/textarea>/,
    `<textarea id="inputExample" class="multiline-text">${promptData.inputExample}</textarea>`
  );

  HTMLContent = HTMLContent.replace(
    /<textarea id="outputExample" class="multiline-text">[^<]*<\/textarea>/,
    `<textarea id="outputExample" class="multiline-text">${promptData.outputExample}</textarea>`
  );

  HTMLContent = HTMLContent.replace(
    /<textarea id="inputTest" class="multiline-text small-multiline">[^<]*<\/textarea>/,
    `<textarea id="inputTest" class="multiline-text small-multiline">${promptData.inputTest}</textarea>`
  );

  return HTMLContent;
}
function replaceisOpenOperation(HTMLContent) {
  HTMLContent = HTMLContent.replace(
    /let isOpenOperation = false;/,
    `let isOpenOperation = true;`
  );
  return HTMLContent;
}
function replaceResponse(HTMLContent,Response)
{
  // Replace newlines with <br> tags to preserve line breaks
  const formattedResponse = Response.replace(/\n/g, '<br>');
  
  HTMLContent = HTMLContent.replace(
    /<div id="outputTest" class="multiline-text small-multiline" contenteditable="false">\s*[^<]*<\/div>/,
    `<div id="outputTest" class="multiline-text small-multiline" contenteditable="true">${formattedResponse}</div>`
  );
  return HTMLContent;
}