// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as convert from './convert/index';

export function activate(context: vscode.ExtensionContext) {

	console.log('Extension "mermaid-js-erd-to-sql" is active');

	//Convert Mermaid JS ERD to SQL
	let disposable = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDSQL', () => {
		const { outputFilename, markdownContent } = getMermaidFileContent(); //get Mermaid JS Markdown content form currently opened file
		if(outputFilename === '' || markdownContent === '') {return;}
		const { schema, entities, relationships } = convert.parseMermaidERD(markdownContent); //Parse Mardown and create Entity and Relationship objects
		const sqlScript = convert.MermaidERDSQL.toSQL(schema, entities, relationships); //generate SQL
		writeGeneratedFile(outputFilename, sqlScript);
	});
	context.subscriptions.push(disposable);

	//Convert Mermaid JS ERD to MySQL SQL
	let disposable2 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDMySQL', () => {
		const { outputFilename, markdownContent } = getMermaidFileContent('-mysql.sql');
		if(outputFilename === '' || markdownContent === '') {return;}
		const { schema, entities, relationships } = convert.parseMermaidERD(markdownContent);
		const sqlScript = convert.MermaidERDMySQL.toSQL(schema, entities, relationships);
		writeGeneratedFile(outputFilename, sqlScript);
	});
	context.subscriptions.push(disposable2);

	//Convert Mermaid JS ERD to Postgres SQL
	let disposable3 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDPostgreSQL', () => {
		const { outputFilename, markdownContent } = getMermaidFileContent('-postgres.sql');
		if(outputFilename === '' || markdownContent === '') {return;}
		const { schema, entities, relationships } = convert.parseMermaidERD(markdownContent);
		const sqlScript = convert.MermaidERDPostgreSQL.toSQL(schema, entities, relationships);
		writeGeneratedFile(outputFilename, sqlScript);
	});
	context.subscriptions.push(disposable3);

	//Convert Mermaid JS ERD to SQLite SQL
	let disposable4 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.mermaidERDSQLite', () => {
		const { outputFilename, markdownContent } = getMermaidFileContent('-sqlite.sql');
		if(outputFilename === '' || markdownContent === '') {return;}
		const { schema, entities, relationships } = convert.parseMermaidERD(markdownContent);
		const sqlScript = convert.MermaidERDSQLite.toSQL(schema, entities, relationships);
		writeGeneratedFile(outputFilename, sqlScript);
	});
	context.subscriptions.push(disposable4);

	// //Convert Mermaid JS ERD to SQLite SQL
	// let disposable5 = vscode.commands.registerCommand('mermaid-js-erd-to-sql.SQLToMermaid', () => {
	// 	const { outputFilename, sqlContent } = getSQLFileContent();
	// 	if(outputFilename === '' || sqlContent === '') {return;}
	// 	const mermaidJs = convert.SQLToMermaid.parseSQL(sqlContent);
	// 	writeGeneratedFile(outputFilename, mermaidJs);
	// });
	// context.subscriptions.push(disposable5);

	/**
	 * @todo Implement Oracle SQL generation
	 */

	/**
	 * @todo Implement SQL Server SQL generation
	 */

	/**
	 * @todo Implement SQL MSAccess SQL generation
	 */
}

// This method is called when your extension is deactivated
export function deactivate() { }

/**
 * Get Mermaid JS ERD Markdown content from currently opened file
 * @param extension file extension for the output file
 * @returns 
 */
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
		let dateTime = '';
		const outputFilename = path?.substring(0, path.lastIndexOf('.')) + dateTime + extension; //path for SQL output
		const markdownContent = path?fs.readFileSync(path, 'utf-8'):''; //get Mermaid JS Markdown content form currently opened file
		return { outputFilename, markdownContent };
	}
	vscode.window.showErrorMessage(error_message);
	return { outputFilename: '', markdownContent: '' };
}

/**
 * Get SQL content from currently opened file
 * @param extension file extension for the output file
 * @returns 
 */
function getSQLFileContent(extension: string = '.mmd'): { outputFilename: string, sqlContent: string } {
	const editor = vscode.window.activeTextEditor;
	const error_message = 'You must open a valid SQL file to convert it to MermaidJS ERD markdown  (.sql file extension)';
	if (editor) {
		const path = vscode.window.activeTextEditor?.document.uri.fsPath; //get currently opened file path
		const fileExt = path?.split('.').pop();
		if (fileExt !== 'sql') {
			vscode.window.showErrorMessage(error_message);
			return { outputFilename: '', sqlContent: '' };
		}
		let dateTime = '';
		const outputFilename = path?.substring(0, path.lastIndexOf('.')) + dateTime + extension; //path for MermaidJS output
		const sqlContent = path?fs.readFileSync(path, 'utf-8'):''; //get SQL content form currently opened file
		return { outputFilename, sqlContent };
	}
	vscode.window.showErrorMessage(error_message);
	return { outputFilename: '', sqlContent: '' };
}

/**
 * Write the SQL script to a file
 * @param outputFilename 
 * @param content 
 */
function writeGeneratedFile(outputFilename: string, content: string) {
	fs.writeFileSync(outputFilename, content); //write SQL file in currently opened file folder
	vscode.workspace.openTextDocument(outputFilename);
	vscode.window.showInformationMessage('Script generated successfully!');
}