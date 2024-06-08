import { Entity } from '../types/Entity';
import { Relationship } from '../types/Relationship';
import MermaidERDSQL from './SQL';

class MermaidERDPostgreSQL extends MermaidERDSQL {

    protected static dataTypes: { [key: string]: string } = {
        'string': 'VARCHAR(255)',
        'int': 'INT',
        'date': 'DATE',
        'datetime': 'DATETIME',
        'timestamp': 'TIMESTAMP',
        'float': 'FLOAT',
        'bool': 'BOOLEAN',
        'double': 'DOUBLE PRECISION',
    };

    public static toSQL(schema: string, entities: Entity[], relationships: Relationship[]): string {
        let sql = '';
        sql += `-- SQL script generated from Mermaid JS ERD to PostgreSQL\n`;
        sql += `-- Schema: ${schema}\n\n`;
        entities.forEach(entity => sql += this.entitySQL(entity));
        return sql;
    }
}

export default MermaidERDPostgreSQL;