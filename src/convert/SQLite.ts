import { Entity } from '../types/Entity';
import { Relationship } from '../types/Relationship';
import MermaidERDSQL from './SQL';

class MermaidERDSQLite extends MermaidERDSQL {
    public static toSQL(schema: string, entities: Entity[], relationships: Relationship[]): string {
        let sql = '';
        sql += `-- SQL script generated from Mermaid JS ERD to SQLite\n`;
        sql += `-- Schema: ${schema}\n\n`;
        entities.forEach(entity => sql += this.entitySQL(entity));
        return sql;
    }
}

export default MermaidERDSQLite;
