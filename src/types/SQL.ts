export interface Column {
    name: string;
    type: string;
    isPrimaryKey: boolean;
    isForeignKey: boolean;
};

export interface ForeignKey {
    columns: string[];
    references: { table: string; columns: string[] };
};

export interface Table {
    name: string;
    columns: Column[];
    foreignKeys: ForeignKey[];
};