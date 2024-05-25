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
        else if (line.includes(':') && !line.startsWith('title')) { //relationship
            const entity1 = parts[0].trim();
            const cardinality = parts[1];
            const entity2 = parts[2].trim();
            const name = parts[parts.length - 1];
            relationships.push({ entity1, entity2, cardinality, name });
        }
        else if (line.endsWith('{')) { //Entity
            // const entityName = line.substring(0, line.length - 1).trim();
            let entityName = line.split('{')[0].trim();
            if (entityName === '') { entityName = previousLine.trim(); }
            currentEntity = { name: entityName, attributes: [] };
        }
        else if (line.includes('}')) {
            if (currentEntity) {
                entities.push(currentEntity);
            }
            currentEntity = null;
        }
        else if (currentEntity) {
            const parts = line.split(' ');
            const attributeName = parts[1];
            const attributeType = parts[0];
            const pk = line.includes('PK');
            const fk = line.includes('FK');
            let comment = '';
            if (line.includes('"')) { comment = parts[parts.length - 1]; }
            currentEntity.attributes.push({ name: attributeName, type: attributeType, pk, fk, comment });
        }
        previousLine = line;
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

    relationships.forEach(rel => {
        const fromEntity = entities.find(e => e.name === rel.entity1);
        const toEntity = entities.find(e => e.name === rel.entity2);
        if (fromEntity && toEntity) {
            //switch on cardinality1 and 2 then alter table or create join table
            switch (rel.cardinality) {
                case '||--o{':
                    const fromPK = fromEntity.attributes.find(attr => attr.pk)?.name;
                    const toPK = toEntity.attributes.find(attr => attr.pk)?.name;
                    if (fromPK && toPK) {
                        sql += `ALTER TABLE ${rel.entity2}\n`;
                        sql += `    ADD CONSTRAINT FK_${rel.entity1}_${rel.entity2}\n`;
                        sql += `    FOREIGN KEY (${fromPK}) REFERENCES ${rel.entity1}(${toPK});\n\n`;
                    }
                    break;
                case '}o--o{':
                    const joinTableName = `${rel.entity1}_${rel.entity2}`;
                    sql += `CREATE TABLE ${joinTableName} (\n`;
                    const fromPK2 = fromEntity.attributes.find(attr => attr.pk)?.name;
                    const toPK2 = toEntity.attributes.find(attr => attr.pk)?.name;
                    if (fromPK2 && toPK2) {
                        sql += `    ${fromPK2} INT,\n`;
                        sql += `    ${toPK2} INT,\n`;
                        sql += `    PRIMARY KEY (${fromPK2}, ${toPK2}),\n`;
                        sql += `    FOREIGN KEY (${fromPK2}) REFERENCES ${rel.entity1}(${fromPK2}),\n`;
                        sql += `    FOREIGN KEY (${toPK2}) REFERENCES ${rel.entity2}(${toPK2});\n\n`;
                    }
                    break;
            }
        }
    });

    return sql;
};

/**
 *
 * Value (left)	Value (right)	Meaning
 * |o	o|	Zero or one
 * ||	||	Exactly one
 * }o	o{	Zero or more (no upper limit)
 * }|	|{	One or more (no upper limit) 
 */
function relationshipSQL(cardinality: string, entity1: Entity, entity2: Entity) {
    switch (cardinality) {
        case '|o--||':
            break;
        case '||-||':
            break;
        case '||-o{':
            break;
        case '||-|{':
            break;
        case '}o--o{':
            break;
        case '}|--o{':
            break;
        case '}|--|{':
            break;
    }
}