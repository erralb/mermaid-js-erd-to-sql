import { Attribute } from "./Attribute";

export interface Entity {
    name: string;
    attributes: Attribute[];
    pkCount: number;
}

export const emptyEntity = (): Entity => ({
    name: '',
    attributes: [],
    pkCount: 0
});