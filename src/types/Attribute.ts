import { Entity } from "./Entity";

export interface Attribute {
    name: string;
    type: string;
    pk: boolean;
    fk: boolean;
    references: Entity;
    referencePk: boolean;
    comment: string;
    nn: boolean;
}