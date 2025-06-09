# jamcopilotpromptmanager README

This extension allows you to create and save new small prompts for GitHub Copilot.

## Features

### JAM Copilot Prompt Manager

This command opens a panel where you can:
- Create new prompts for GitHub Copilot
- Save prompts for future use
- Use prompts for asking copilots directly in the interface

#### Creating a New Prompt
1. Enter a title for your prompt
2. Fill in the following fields:
   - Task Explanation: What the prompt should accomplish. Long and full description of the task
   - Input Example: Sample input to demonstrate usage
   - Output Example: Expected output for the example above
   - Input Indications: a short description of the input for user

#### Saving Prompts
1. Click the "Save" button
2. The prompt is saved as `<title>.json` in the extension directory
3. You can modify the filename if needed

#### Using Prompts
1. Expand the Ask equest control section
2. Enter your input text
3. Click "Send"
4. View the response in the Output control

#### Managing Existing Prompts
1. Click the "Open" button
2. Select a previously saved prompt
3. You can:
   - Use the prompt with new inputs
   - Modify the prompt settings
   - Save changes as a new prompt


![Prompt Manager Interface](https://github.com/JalmarazMartn/jamcopilotprompthelper/blob/master/images/DefinePrompt.gif.gif?raw=true)

#### Creating a Prompt from Scratch select

New commans `JAM Copilot Prompt Manager: Begin prompt recording` and `JAM Copilot Prompt Manager: End prompt recording` allow you to create a new prompt from scratch. Before editing or fixing codde you can select it and excute the command `JAM Copilot Prompt Manager: Begin prompt recording`. This will start a new prompt recording tajking as before reference the selected code. 

When finish select modified code and execute from command paallete `JAM Copilot Prompt Manager: End prompt recording`. Then wiat and raise a new prompo page with the explanation of the code, input and output examples. You can modify the prompt and save it as a new one.

[![Click here to watch video](https://upload.wikimedia.org/wikipedia/commons/4/40/Solid_color_YouTube_logo_%282013-2017%29.png)](https://www.youtube.com/watch?v=bOd0HSUjIws)


## Requirements

This extension requires Visual Studio Code version 1.70.0 or higher.

## Extension Settings

This extension contributes the following settings:

* `jamcopilotpromptmanager.modelFamily`: Specifies the family of language model to use. Default is `gpt-4o`.

## Known Issues

Calling out known issues can help limit users opening duplicate issues against your extension.
