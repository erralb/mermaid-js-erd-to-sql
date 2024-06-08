import { Entity } from "./Entity";

/**
 * Interface for the Attribute object
 */
export interface Attribute {
    name: string; //attribute name
    type: string; //data type
    pk: boolean; //is (part of) a primary key
    fk: boolean; //is (part of) a foreign key
    references: Entity; //entity referenced by this attribute
    referencePk: boolean; //is a reference to a primary key
    comment: string; //comment
    nn: boolean; //is not null
}