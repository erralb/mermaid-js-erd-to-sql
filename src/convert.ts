const fs = require('fs');

interface Entity {
    name: string;
    attributes: { name: string; type: string; pk: boolean; fk: boolean, comment: string }[];
}

interface Relationship {
    entity1: string;
    entity2: string;
    cardinality: string;
    name: string;
}

export const parseMermaidERD = (content: string): { schema: string, entities: Entity[]; relationships: Relationship[] } => {
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const entities: Entity[] = [];
    const relationships: Relationship[] = [];
    let currentEntity: Entity | null = null;
    let schema = 'database';
    let previousLine = '';

    lines.forEach(line => {
        const parts = line.split(' ');
        if (line.startsWith('title')) { //Schema name
            schema = line.split(':')[1].trim();
        }
        else if (line.includes(':') && !line.startsWith('title')) { //Relationship extraction
            const entity1 = parts[0].trim();
            const cardinality = parts[1];
            const entity2 = parts[2].trim();
            const name = parts[parts.length - 1];
            relationships.push({ entity1, entity2, cardinality, name });
        }
        else if (line.endsWith('{')) { //Entity extraction
            let entityName = line.split('{')[0].trim();
            if (entityName === '') { entityName = previousLine.trim(); }
            currentEntity = { name: entityName, attributes: [] };
        }
        else if (line.includes('}')) { //End of entity
            if (currentEntity) {
                entities.push(currentEntity);
            }
            currentEntity = null;
        }
        else if (currentEntity) { //Entity attributes
            const parts = line.split(' ');
            const attributeName = parts[1];
            const attributeType = parts[0]=== 'string' ? 'VARCHAR' : parts[0];
            const pk = line.includes('PK');
            const fk = line.includes('FK');
            let comment = '';
            if (line.includes('"')) { comment = parts[parts.length - 1]; }
            currentEntity.attributes.push({ name: attributeName, type: attributeType, pk, fk, comment });
        }
        if (!line || /^\s*$/.test(line)) { previousLine = line; }
    });

    if (currentEntity) {
        entities.push(currentEntity);
    }

    return { schema, entities, relationships };
};

export const convertToSQL = (schema: string, entities: Entity[], relationships: Relationship[]): string => {
    let sql = '';

    entities.forEach(entity => {
        sql += `CREATE TABLE ${entity.name} (\n`;
        entity.attributes.forEach(attr => {
            sql += `    ${attr.name} ${attr.type}`;
            if (attr.pk) { sql += ' PRIMARY KEY'; }
            if (attr.fk) { sql += ' FOREIGN KEY'; }
            sql += ',\n';
        });
        sql = sql.slice(0, -2) + '\n);\n\n';
    });

    relationships.forEach(rel => sql += relationshipSQL(rel, entities));

    return sql;
};

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

    console.log(sql);


    return sql;
}