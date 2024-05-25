// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { parseMermaidERD, convertToSQL } from './convert';
import { loadavg } from 'os';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "mermaid-js-erd-to-sql" is active');

	let disposable = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDSQL', () => {

		const editor = vscode.window.activeTextEditor;

		if (editor) {
			// const document = editor.document;
			const path = vscode.window.activeTextEditor?.document.uri.fsPath;
			// console.log('path', path);
			
			const markdownContent = fs.readFileSync(path, 'utf-8');
			const { schema, entities, relationships } = parseMermaidERD(markdownContent);
			const sqlScript = convertToSQL(schema, entities, relationships);
			// console.log('sqlScript', sqlScript);
			// vscode.workspace.openTextDocument(uri).then((document) => {
			// 	let text = document.getText();
			//   });
			// fs.writeFileSync('output.sql', sqlScript);

			// console.log('SQL script generated successfully!');


			// 	const selection = editor.selection;

			// 	// // Get the document text
			// 	// const documentText = document.getText();

			// 	// Get the word within the selection
			// 	const word = document.getText(selection);
			// 	const reversed = word.split('').reverse().join('');
			// 	editor.edit(editBuilder => {
			// 		editBuilder.replace(selection, reversed);
			// 	});
		}
	});

	context.subscriptions.push(disposable);

	let disposable2 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDMySQL', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Mermaid JS ERD to MySQL!');
	});

	context.subscriptions.push(disposable2);
}

// This method is called when your extension is deactivated
export function deactivate() { }
