import { Entity } from '../types/Entity';
import { Relationship } from '../types/Relationship';

class MermaidERDSQL {

    protected static dataTypes: { [key: string]: string } = {
        'string': 'VARCHAR(255)',
        'int': 'INT',
        'date': 'DATE',
        'datetime': 'DATETIME',
        'timestamp': 'TIMESTAMP',
        'float': 'FLOAT',
        'bool': 'BOOLEAN'
    };

    public static toSQL(schema: string, entities: Entity[], relationships: Relationship[]): string {
        let sql = '';
        sql += `-- SQL script generated from Mermaid JS ERD to SQL\n`;
        sql += `-- Schema: ${schema}\n\n`;
        entities.forEach(entity => sql += this.entitySQL(entity));
        return sql;
    }

    protected static entitySQL(entity: Entity) {
        let sql = '';
        let pks = '    PRIMARY KEY (';
        let pkCount = 0;
        let fks: { [key: string]: string[] } = {};
        sql += `CREATE TABLE ${entity.name} (\n`;
        entity.attributes.forEach(attr => {
            sql += `    ${attr.name} ${this.convertMermaidDataTypeToSQL(attr.type)},\n`;
            if (attr.pk) { pks += `${attr.name},`; pkCount++; }
            if (attr.fk) {
                if (!fks[attr.references.name]) { fks[attr.references.name] = []; }
                fks[attr.references.name].push(attr.name);
            }
        });
        if (pkCount > 0) { sql += pks.slice(0, -1) + '),\n'; }
        if (Object.keys(fks).length > 0) {
            sql += Object.keys(fks).reduce((acc, key) => {
                acc += `    FOREIGN KEY(${fks[key].join(', ')}) REFERENCES ${key}(${fks[key].join(', ')}),\n`;
                return acc;
            }, '');
        }
        sql = sql.slice(0, -2) + '\n);\n\n';
        return sql;
    }

    protected static convertMermaidDataTypeToSQL(dataType: string) {
        if (!this.dataTypes[dataType]) { return dataType; }
        return this.dataTypes[dataType];
    }
}

export default MermaidERDSQL;