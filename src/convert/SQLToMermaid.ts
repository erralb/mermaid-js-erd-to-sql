import * as fs from 'fs';
import { Table, Column, ForeignKey } from '../types/SQL';

class SQLToMermaid {

    public static parseSQL = (sql: string): string => {
        // const schemaRegex = /CREATE SCHEMA (\w+);/g;
        // const databaseRegex = /CREATE DATABASE (\w+) \(([\s\S]*?)\);/g;
        const tableRegex = /CREATE TABLE (\w+) \(([\s\S]*?)\);/g;
        const columnRegex = /^\s*(\w+)\s+([\w\(\)]+),?$/gm;
        const primaryKeyRegex = /PRIMARY KEY \(([\w, ]+)\)/;
        const foreignKeyRegex = /FOREIGN KEY\(([\w, ]+)\) REFERENCES (\w+)\(([\w, ]+)\)/g;

        const tables: Table[] = [];
        let match;

        while ((match = tableRegex.exec(sql)) !== null) {

            const tableName = match[1];
            const tableBody = match[2];

            const columns: Column[] = [];
            const foreignKeys: ForeignKey[] = [];

            let columnMatch;
            while ((columnMatch = columnRegex.exec(tableBody)) !== null) {
                columns.push({
                    name: columnMatch[1],
                    type: columnMatch[2].replace(/,/, ''),
                    isPrimaryKey: false,
                    isForeignKey: false,
                });
            }

            let primaryKeyMatch = primaryKeyRegex.exec(tableBody);
            if (primaryKeyMatch) {
                const pkColumns = primaryKeyMatch[1].split(',').map(col => col.trim());
                pkColumns.forEach(pkColumn => {
                    const column = columns.find(col => col.name === pkColumn);
                    if (column) { column.isPrimaryKey = true; }
                });
            }

            let foreignKeyMatch;
            while ((foreignKeyMatch = foreignKeyRegex.exec(tableBody)) !== null) {
                foreignKeys.push({
                    columns: foreignKeyMatch[1].split(',').map((col) => col.trim()),
                    references: {
                        table: foreignKeyMatch[2],
                        columns: foreignKeyMatch[3].split(',').map((col) => col.trim()),
                    },
                });
                foreignKeyMatch[1].split(',').map((col) => col.trim()).forEach(fkColumn => {
                    const column = columns.find(col => col.name === fkColumn);
                    if (column) { column.isForeignKey = true; }
                });
            }

            tables.push({ name: tableName, columns, foreignKeys });
        }

        return SQLToMermaid.generateMermaid(tables);
    };

    protected static generateMermaid = (tables: Table[]): string => {
        let mermaid = '```mermaid\nerDiagram\n\n';

        tables.forEach((table) => {
            if (!SQLToMermaid.isJoinTable(table)) {
                mermaid += `    ${table.name} {\n`;
                table.columns.forEach((col) => {
                    const pk = col.isPrimaryKey ? ' PK' : '';
                    let fk = '';
                    // let fk = col.isForeignKey ? ' FK' : '';
                    if (col.isPrimaryKey && col.isForeignKey) { fk = ', FK'; mermaid += `        ${col.type.toLowerCase()} ${col.name}${pk}${fk}\n`; }
                    else if (!col.isForeignKey) { mermaid += `        ${col.type.toLowerCase()} ${col.name}${pk}\n`; }
                });
                mermaid += '    }\n\n';
            }
        });

        tables.forEach((table) => {

            if (!SQLToMermaid.isJoinTable(table)) {
                table.foreignKeys.forEach((fk) => {
                    mermaid += `    ${table.name} }o--|| ${fk.references.table} : "${table.name}_${fk.references.table}"\n`;
                });
            }
            else {
                const fk1 = table.foreignKeys[0];
                const fk2 = table.foreignKeys[1];
                mermaid += `    ${fk1.references.table} }o--o{ ${fk2.references.table} : "${fk1.references.table}_${fk2.references.table}"\n`;
            }
        });

        return mermaid + '```';
    };

    /**
     * @todo : test this function with complex join tables (more than 2 tables for exemple)
     * @param table 
     * @returns 
     */
    protected static isJoinTable = (table: Table): boolean => {
        return table.columns.every(col => col.isPrimaryKey || col.isForeignKey) && table.foreignKeys.length >= 2;
    };

}


export default SQLToMermaid;
