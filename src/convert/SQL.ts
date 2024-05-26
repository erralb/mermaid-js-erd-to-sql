import { Entity } from '../types/Entity';
import { Relationship } from '../types/Relationship';

const toSQL = (schema: string, entities: Entity[], relationships: Relationship[]): string => {
    let sql = '';

    entities.forEach(entity => sql += entitySQL(entity));

    relationships.forEach(rel => sql += relationshipSQL(rel, entities));

    return sql;
};

export default toSQL;

function entitySQL(entity: Entity) {
    let sql = '';
    sql += `CREATE TABLE ${entity.name} (\n`;
    entity.attributes.forEach(attr => {
        sql += `    ${attr.name} ${convertMermaidDataTypeToSQL(attr.type)}`;
        if (attr.pk) { sql += ' PRIMARY KEY'; }
        if (attr.fk) { sql += ' FOREIGN KEY'; }
        sql += ',\n';
    });
    sql = sql.slice(0, -2) + '\n);\n\n';
    return sql;
}

function convertMermaidDataTypeToSQL(dataType: string) {
    const dataTypes = {
        'string': 'VARCHAR',
        'int': 'INT',
        'date': 'DATE',
        'datetime': 'DATETIME',
        'timestamp': 'TIMESTAMP',
        'float': 'FLOAT',
        'bool': 'BOOLEAN'
    };
    // @ts-ignore
    if (!dataTypes[dataType]) { return dataType; }
    // @ts-ignore
    return dataTypes[dataType];
}

/**
 * Mermaid JS ERD possible cardinalities (left / right / meaning) :
 * 
 * |o	o|	Zero or one
 * ||	||	Exactly one
 * }o	o{	Zero or more (no upper limit)
 * }|	|{	One or more (no upper limit) 
 */
function relationshipSQL(relationship: Relationship, entities: Entity[]) {
    let sql = '';
    const entity1 = entities.find(e => e.name === relationship.entity1);
    const entity2 = entities.find(e => e.name === relationship.entity2);

    if (entity1 && entity2) {
        const fromPK = entity1.attributes.find(attr => attr.pk)?.name;
        const toPK = entity2.attributes.find(attr => attr.pk)?.name;
        if (!fromPK || !toPK) { return console.error('Primary or Foreign key not found'); }
        /**
         * @todo: manage all cardinality cases
         */
        switch (relationship.cardinality) {
            case '|o--||':
            case '||--||':
            case '||--o{':
            case '||--|{':
                sql += `ALTER TABLE ${entity2.name}\n`;
                sql += `    ADD CONSTRAINT FK_${entity1.name}_${entity2.name}\n`;
                sql += `    FOREIGN KEY (${fromPK}) REFERENCES ${entity1.name}(${fromPK});\n\n`;
                break;
            //reversed case for reversed cardinality
            case '||--o|':
            case '||--||':
            case '}o--||':
            case '}|--||':
                sql += `ALTER TABLE ${entity1.name}\n`;
                sql += `    ADD CONSTRAINT FK_${entity2.name}_${entity1.name}\n`;
                sql += `    FOREIGN KEY (${toPK}) REFERENCES ${entity2.name}(${toPK});\n\n`;
                break;
            case '}|--o{':
            case '}o--|{':
            case '}|--|{':
            case '}o--o{':
                const joinTableName = `${entity1.name}_${entity2.name}`;
                sql += `CREATE TABLE ${joinTableName} (\n`;
                if (fromPK && toPK) {
                    sql += `    ${fromPK} INT,\n`;
                    sql += `    ${toPK} INT,\n`;
                    sql += `    PRIMARY KEY (${fromPK}, ${toPK}),\n`;
                    sql += `    FOREIGN KEY (${fromPK}) REFERENCES ${entity1.name}(${fromPK}),\n`;
                    sql += `    FOREIGN KEY (${toPK}) REFERENCES ${entity2.name}(${toPK})\n);\n\n`;
                }
                break;
        }
    }

    return sql;
}