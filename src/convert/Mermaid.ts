import { Entity, emptyEntity } from '../types/Entity';
import { Relationship } from '../types/Relationship';

/**
 * Converts Mermaid markdown to Js objects
 * @param content Mermaid markdown content
 * @returns An object containing the schema name, the entities and the relationships
 */
const parseMermaidERD = (content: string): { schema: string, entities: Entity[]; relationships: Relationship[] } => {

    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    const entities: Entity[] = [];
    const relationships: Relationship[] = [];
    let currentEntity: Entity | null = null;
    let schema = 'mySchema';
    let previousLine = '';
    let pkCount = 0;
    let MermaidERD = false;

    for (let line of lines) {
        if (line.includes('%%') || line.includes('[comment]')) { continue; } //skip comment lines
        const parts = line.split(' ');
        if (line.startsWith('title')) { //Schema name
            schema = line.split(':')[1].trim();
        }
        else if(line.includes('erDiagram')) {
            MermaidERD = true;
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
            currentEntity = { name: entityName, attributes: [], pkCount };
        }
        else if (line.includes('}')) { //End of entity
            if (currentEntity) {
                entities.push(currentEntity);
            }
            currentEntity = null;
            pkCount = 0;
        }
        else if (currentEntity) { //Entity attributes
            const parts = line.split(' ');
            const attributeName = parts[1];
            const attributeType = parts[0];
            const pk = line.includes('PK');
            currentEntity.pkCount = pk ? currentEntity.pkCount + 1 : currentEntity.pkCount;
            const fk = line.includes('FK');
            let comment = '';
            if (line.includes('"')) { comment = parts[parts.length - 1]; }
            currentEntity.attributes.push({ name: attributeName, type: attributeType, pk, fk, comment, references: emptyEntity(), referencePk: fk, nn: pk});
        }
        if (!line || /^\s*$/.test(line)) { previousLine = line; } //assign previous line only if it's not empty
    };

    if(!MermaidERD) {
        throw new Error('This file does not appear to be a valid Mermaid JS ERD file');
    }

    //go through relationships and assign references to entity attributes
    relationships.forEach(rel => {
        const entity1 = entities.find(e => e.name === rel.entity1);
        const entity2 = entities.find(e => e.name === rel.entity2);
        if (entity1 !== undefined && entity2 !== undefined) {
            switch (rel.cardinality) {
                case '|o--||':
                case '||--o{':
                    oneToManyRelationshipSQL(entity1, entity2, false);
                    break;
                case '||--||':
                case '||--|{':
                    oneToManyRelationshipSQL(entity1, entity2);
                    break;
                //reversed case for reversed cardinality
                case '||--o|':
                case '}o--||':
                    oneToManyRelationshipSQL(entity2, entity1, false);
                    break;
                case '||--||':
                case '}|--||':
                    oneToManyRelationshipSQL(entity2, entity1);
                    break;
                case '}|--o{':
                case '}o--|{':
                case '}|--|{':
                case '}o--o{':

                    //create entity for join table
                    const entity: Entity = {
                        name: entity1.name + '_' + entity2.name + '_' + rel.name,
                        attributes: [],
                        pkCount: 0
                    };

                    //get pks from entity1 and entity2
                    const pk1 = entity1.attributes.filter(a => a.pk);
                    const pk2 = entity2.attributes.filter(a => a.pk);
                    //add pks to join entity
                    pk1.forEach(pk => {
                        entity.attributes.push({ name: pk.name, type: pk.type, pk: true, fk: true, references: entity1, referencePk: true, comment: '', nn: true });
                        entity.pkCount++;
                    });
                    pk2.forEach(pk => {
                        entity.attributes.push({ name: pk.name, type: pk.type, pk: true, fk: true, references: entity2, referencePk: true, comment: '', nn: true });
                        entity.pkCount++;
                    });

                    entities.push(entity);

                    break;
            }

        }
    });

    return { schema, entities, relationships };
};

/**
 * Manages the creation of a one-to-many relationship between two entities
 * @param entity1 
 * @param entity2 
 * @param mandatory oneToMany or zeroToMany ? 
 */
function oneToManyRelationshipSQL(entity1: Entity, entity2: Entity, mandatory: boolean = true) {
    // find all primary keys in entity1
    const pk1 = entity1.attributes.filter(a => a.pk);
    // we add a foreign key to entity2 referencing entity1
    pk1.forEach(pk => {
        //search if pk already exist as fk in entity2
        const fk = entity2.attributes.find(a => a.name === pk.name);
        // if it doesn't exist, we add it
        if (!fk) {
            const fk = structuredClone(pk); //deep clone pk to avoid changing the original object
            fk.pk = false;
            fk.fk = true;
            fk.references = entity1;
            fk.referencePk = true;
            fk.nn = mandatory;
            entity2.attributes.push(fk);
        }
        // if it exists, we update the references
        else {
            fk.references = entity1;
            fk.referencePk = true;
            fk.nn = mandatory;
        }
    });
}

export default parseMermaidERD;