const instructionsfolterName = '.github/instructions';
function getWorkspaceFolder() {
  const vscode = require('vscode');
  const folders = vscode.workspace.workspaceFolders;
  if (folders && folders.length > 0) {
    return folders[0].uri.fsPath;
  }
  return null;
}
function ensureSubfolder(subfolderName) {
const fs = require('fs');
const path = require('path');

  const wsFolder = getWorkspaceFolder();
  if (!wsFolder) return false;
  const subfolderPath = path.join(wsFolder, subfolderName);
  if (!fs.existsSync(subfolderPath)) {
    fs.mkdirSync(subfolderPath, { recursive: true });
    return true;
  }
  return false;
}

async function openAndCopyFile(destinationFolder) {
  const vscode = require('vscode');
  const fs = require('fs');
  const path = require('path');

  const options = {
    canSelectMany: false,
    openLabel: 'Select markdown file',
    filters: {
      'Markdown files': ['md']
    }
  };

  const fileUri = await vscode.window.showOpenDialog(options);
  if (!fileUri || fileUri.length === 0) return false;

  const sourcePath = fileUri[0].fsPath;
  const fileName = path.basename(sourcePath);
  const destPath = path.join(destinationFolder, fileName);

  fs.copyFileSync(sourcePath, destPath);
  return true;
}
async function bringPromptToInstructions() {
    const vscode = require('vscode');
    await ensureSubfolder(instructionsfolterName);
    const wsFolder = getWorkspaceFolder();
    if (!wsFolder) {
      vscode.window.showErrorMessage('No workspace folder found.');
      return;
    }
    const instructionsPath = require('path').join(wsFolder, instructionsfolterName);
    await openAndCopyFile(instructionsPath);
}

module.exports = {
  bringPromptToInstructions: function() { bringPromptToInstructions(); }
};

