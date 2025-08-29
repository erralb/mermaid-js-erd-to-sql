import * as convert from './convert/index';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import * as fs from 'fs';

const argv = yargs(hideBin(process.argv))
  .command('$0 <file>', 'Convert a Mermaid ERD to SQL', (yargs) => {
    yargs.positional('file', {
      describe: 'Path to Mermaid ERD file',
      type: 'string',
    });
  })
  .option('flavor', {
    alias: 'f',
    type: 'string',
    default: 'sql',
    describe: 'SQL flavor',
  })
  .parseSync();


const filePath = argv.file as string;
const { outputFilename, markdownContent } = getMermaidFileContent(filePath);
if (outputFilename === '' || markdownContent === '') {
  console.error("Error while reading Mermaid file content.");
  process.exit(1);
}

const { schema, entities, relationships } = convert.parseMermaidERD(markdownContent);
if (argv.flavor === 'postgres') {
  const sqlScript = convert.MermaidERDPostgreSQL.toSQL(schema, entities, relationships);
  writeGeneratedFile(outputFilename, sqlScript);
} else if (argv.flavor === 'mysql') {
  const sqlScript = convert.MermaidERDMySQL.toSQL(schema, entities, relationships);
  writeGeneratedFile(outputFilename, sqlScript);
} else if (argv.flavor === 'sqlite') {
  const sqlScript = convert.MermaidERDSQLite.toSQL(schema, entities, relationships);
  writeGeneratedFile(outputFilename, sqlScript);
} else if (argv.flavor === 'sql') {
  const sqlScript = convert.MermaidERDSQL.toSQL(schema, entities, relationships);
  writeGeneratedFile(outputFilename, sqlScript);
} else {
  console.error(`Unsupported SQL flavor: ${argv.flavor}.`);
  process.exit(1);
}

/**
 * Write the SQL script to a file
 * @param outputFilename 
 * @param content 
 */
function writeGeneratedFile(outputFilename: string, content: string) {
  fs.writeFileSync(outputFilename, content); //write SQL file in currently opened file folder
}

/**
 * Get Mermaid JS ERD Markdown content from currently opened file
 * @param extension file extension for the output file
 * @returns 
 */
function getMermaidFileContent(path: string, extension: string = '.sql'): { outputFilename: string, markdownContent: string } {
  const fileExt = path?.split('.').pop();
  if (fileExt !== 'mmd' && fileExt !== 'mermaid' && fileExt !== 'md') {
    return { outputFilename: '', markdownContent: '' };
  }
  let dateTime = '';
  const outputFilename = path?.substring(0, path.lastIndexOf('.')) + dateTime + extension;
  const markdownContent = path ? fs.readFileSync(path, 'utf-8') : '';
  return { outputFilename, markdownContent };
}
