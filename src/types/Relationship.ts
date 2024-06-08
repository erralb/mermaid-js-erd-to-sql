/**
 * Interface for the Relationship object
 */
export interface Relationship {
    entity1: string; //name of the first entity
    entity2: string; //name of the second entity
    cardinality: string; //cardinality of the relationship, in the form of Mermaid syntax
    name: string; //name of the relationship
}