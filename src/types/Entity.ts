export interface Entity {
    name: string;
    attributes: { name: string; type: string; pk: boolean; fk: boolean, comment: string }[];
}