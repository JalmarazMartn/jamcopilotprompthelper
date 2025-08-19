const vscode = require('vscode');

class ClipboardTool {
    async invoke(options, _token) {
        const text = await vscode.env.clipboard.readText();
        return new vscode.LanguageModelToolResult([
            new vscode.LanguageModelTextPart(`El contenido actual del portapapeles es:\n${text}`)
        ]);
    }

    async prepareInvocation(options, _token) {
        return {
            invocationMessage: 'Leyendo el portapapeles',
            confirmationMessages: {
                title: 'Leer portapapeles',
                message: new vscode.MarkdownString('¿Quieres leer el contenido del portapapeles?')
            }
        };
    }
}
function registerClipboardTool(context) {
    context.subscriptions.push(
        vscode.lm.registerTool('leer-portapapeles', new ClipboardTool())
    );
}

module.exports = {
    registerClipboardTool
};
