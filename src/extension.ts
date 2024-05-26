// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as convert from './convert/index';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "mermaid-js-erd-to-sql" is active');

	//Convert Mermaid JS ERD to Generic SQL
	let disposable = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDSQL', () => {
		const { outputFilename, markdownContent } = getMermaidFileContent(); //get Mermaid JS Markdown content form currently opened file
		if(outputFilename === '' || markdownContent === '') {return;}
		const { schema, entities, relationships } = convert.parseMermaidERD(markdownContent); //Parse Mardown and create Entity and Relationship objects
		const sqlScript = convert.toSQL(schema, entities, relationships); //generate SQL
		writeGeneratedFile(outputFilename, sqlScript);
	});
	context.subscriptions.push(disposable);

	//Convert Mermaid JS ERD to MySQL SQL
	let disposable2 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDMySQL', () => {
		const { outputFilename, markdownContent } = getMermaidFileContent('-mysql.sql'); //get Mermaid JS Markdown content form currently opened file
		if(outputFilename === '' || markdownContent === '') {return;}
		const { schema, entities, relationships } = convert.parseMermaidERD(markdownContent); //Parse Mardown and create Entity and Relationship objects
		const sqlScript = convert.toMySQL(schema, entities, relationships); //generate SQL
		writeGeneratedFile(outputFilename, sqlScript);
	});
	context.subscriptions.push(disposable2);

	/**
	 * @todo Implement PostgreSQL SQL generation
	 */
	let disposable3 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDPostgreSQL', () => {
		vscode.window.showInformationMessage('Mermaid JS ERD to PostgreSQL not implemented yet');
	});
	context.subscriptions.push(disposable3);

	/**
	 * @todo Implement Oracle SQL generation
	 */

	/**
	 * @todo Implement SQL Server SQL generation
	 */
}

// This method is called when your extension is deactivated
export function deactivate() { }

function getMermaidFileContent(extension: string = '.sql'): { outputFilename: string, markdownContent: string } {
	const editor = vscode.window.activeTextEditor;
	const error_message = 'You must open a valid Mermaid JS ERD markdown file to convert it to SQL (.md, .mmd or .mermaid file extension)';
	if (editor) {
		const path = vscode.window.activeTextEditor?.document.uri.fsPath; //get currently opened file path
		const fileExt = path?.split('.').pop();
		if (fileExt !== 'mmd' && fileExt !== 'mermaid' && fileExt !== 'md') {
			vscode.window.showErrorMessage(error_message);
			return { outputFilename: '', markdownContent: '' };
		}
		// let date = new Date();
		// let dateTime = `-${date.getFullYear()}-${date.getMonth()}-${date.getDay()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
		let dateTime = '';
		const outputFilename = path?.substring(0, path.lastIndexOf('.')) + dateTime + extension; //path for SQL output
		const markdownContent = path?fs.readFileSync(path, 'utf-8'):''; //get Mermaid JS Markdown content form currently opened file
		return { outputFilename, markdownContent };
	}
	vscode.window.showErrorMessage(error_message);
	return { outputFilename: '', markdownContent: '' };
}

function writeGeneratedFile(outputFilename: string, content: string) {
	fs.writeFileSync(outputFilename, content); //write SQL file in currently opened file folder
	vscode.workspace.openTextDocument(outputFilename);
	vscode.window.showInformationMessage('SQL script generated successfully!');
}