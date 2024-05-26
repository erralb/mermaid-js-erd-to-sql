import { Entity } from '../types/Entity';
import { Relationship } from '../types/Relationship';


const parseMermaidERD = (content: string): { schema: string, entities: Entity[]; relationships: Relationship[] } => {
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
            const attributeType = parts[0];
            const pk = line.includes('PK');
            const fk = line.includes('FK');
            let comment = '';
            if (line.includes('"')) { comment = parts[parts.length - 1]; }
            currentEntity.attributes.push({ name: attributeName, type: attributeType, pk, fk, comment });
        }
        if (!line || /^\s*$/.test(line)) { previousLine = line; } //assign previous line only if it's not empty
    });

    return { schema, entities, relationships };
};

export default parseMermaidERD;