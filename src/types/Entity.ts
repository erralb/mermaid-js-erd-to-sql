import { Attribute } from "./Attribute";

/**
 * Interface for the Entity object
 */
export interface Entity {
    name: string; //entity name
    attributes: Attribute[]; //attributes of the entity
    pkCount: number; //number of pk column for composite keys
}

/**
 * Needed while creating Entity objects from the markdown file
 * @returns empty Entity object
 */
export const emptyEntity = (): Entity => ({
    name: '',
    attributes: [],
    pkCount: 0
});