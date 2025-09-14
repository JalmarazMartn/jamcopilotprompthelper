
const vscode = require('vscode');

class ClipboardTool {
    async invoke(options, _token) {
        const params = options.input;
        if (params.operation === 'read') {
            // Read clipboard
            const text = await vscode.env.clipboard.readText();
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart(text)
            ]);
        } else if (params.operation === 'copy') {
            // Copy to clipboard
            if (typeof params.text !== 'string') {
                throw new Error('Missing or invalid "text" parameter for copy operation.');
            }
            await vscode.env.clipboard.writeText(params.text);
            return new vscode.LanguageModelToolResult([
                new vscode.LanguageModelTextPart('Text copied to clipboard.')
            ]);
        } else {
            throw new Error('Invalid operation. Use "read" or "copy".');
        }
    }

    async prepareInvocation(options, _token) {
        const params = options.input;
        if (params.operation === 'read') {
            return {
                invocationMessage: 'Reading clipboard content',
                confirmationMessages: {
                    title: 'Read clipboard',
                    message: new vscode.MarkdownString('Read the current clipboard content?')
                }
            };
        } else if (params.operation === 'copy') {
            return {
                invocationMessage: 'Copying text to clipboard',
                confirmationMessages: {
                    title: 'Copy to clipboard',
                    message: new vscode.MarkdownString(
                        `Copy the following text to clipboard?\n\n\`\`\`\n${params.text}\n\`\`\`\n`
                    )
                }
            };
        }
        return undefined;
    }
}

function registerClipboardTool(context) {
    context.subscriptions.push(
        vscode.lm.registerTool('clipboardTool', new ClipboardTool())
    );
}

module.exports = { registerClipboardTool };
