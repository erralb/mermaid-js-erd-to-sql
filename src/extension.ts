// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import { parseMermaidERD, convertToSQL } from './convert';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Extension "mermaid-js-erd-to-sql" is active');

	let disposable = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDSQL', () => {

		const editor = vscode.window.activeTextEditor;

		if (editor) {
			const path = vscode.window.activeTextEditor?.document.uri.fsPath; //get currently opened file path
			const output = path?.substring(0, path.lastIndexOf('.')); //path for SQL output
			
  			// @ts-ignore
			const markdownContent = fs.readFileSync(path, 'utf-8'); //get Mermaid JS Markdown content form currently opened file
			const { schema, entities, relationships } = parseMermaidERD(markdownContent); //Parse Mardown and create Entity and Relationship objects
			const sqlScript = convertToSQL(schema, entities, relationships); //generate SQL
			fs.writeFileSync(output + '.sql', sqlScript); //write SQL file in currently opened file folder
			vscode.workspace.openTextDocument(output + '.sql');
			vscode.window.showInformationMessage('SQL script generated successfully!');
		}
	});

	context.subscriptions.push(disposable);

	/**
	 * @todo
	 */
	let disposable2 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDMySQL', () => {
		vscode.window.showInformationMessage('Mermaid JS ERD to MySQL not implemented yet');
	});

	context.subscriptions.push(disposable2);

	/**
	 * @todo
	 */
	let disposable3 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDPostgreSQL', () => {
		vscode.window.showInformationMessage('Mermaid JS ERD to PostgreSQL not implemented yet');
	});

	context.subscriptions.push(disposable3);
}

// This method is called when your extension is deactivated
export function deactivate() { }
