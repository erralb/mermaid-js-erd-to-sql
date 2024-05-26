import { Entity } from '../types/Entity';
import { Relationship } from '../types/Relationship';

// // String Data Types
// CHAR(size)
// VARCHAR(size)
// BINARY(size)
// VARBINARY(size)
// TINYBLOB	
// TINYTEXT	
// TEXT(size)
// BLOB(size)
// MEDIUMTEXT 
// MEDIUMBLOB 
// LONGTEXT
// LONGBLOB 
// ENUM(val1, val2, val3, ...)
// SET(val1, val2, val3, ...)

// // Numeric Data Types
// BIT(size)
// TINYINT(size)
// BOOL
// BOOLEAN
// SMALLINT(size)
// MEDIUMINT(size)
// INT(size)
// INTEGER(size)
// BIGINT(size)
// FLOAT(p)
// DOUBLE(size, d)
// DOUBLE PRECISION(size, d)	 
// DECIMAL(size, d)
// DEC(size, d)

// // Date and Time
// DATE	Format: YYYY-MM-DD. The supported range is from '1000-01-01' to '9999-12-31'
// DATETIME(fsp)	A date and time combination. Format: YYYY-MM-DD hh:mm:ss. The supported range is from '1000-01-01 00:00:00' to '9999-12-31 23:59:59'. Adding DEFAULT == current date and time
// TIMESTAMP(fsp)	A timestamp. TIMESTAMP values are stored as the number of seconds since the Unix epoch ('1970-01-01 00:00:00' UTC). Format: YYYY-MM-DD hh:mm:ss. The supported range is from '1970-01-01 00:00:01' UTC to '2038-01-09 03:14:07' UTC. Automatic initialization and updating to the current date and time can be specified using DEFAULT CURRENT_TIMESTAMP and ON UPDATE CURRENT_TIMESTAMP in the column definition
// TIME(fsp)	A time. Format: hh:mm:ss. The supported range is from '-838:59:59' to '838:59:59'
// YEAR	A year in four-digit format. Values allowed in four-digit format: 1901 to 2155, and 0000.


const toMySQL = (schema: string, entities: Entity[], relationships: Relationship[]): string => {
    let sql = '';

    entities.forEach(entity => sql += entitySQL(entity));

    relationships.forEach(rel => sql += relationshipSQL(rel, entities));

    return sql;
};

export default toMySQL;

function entitySQL(entity: Entity) {
    let sql = '';
    let pks = '    PRIMARY KEY (';
    let pkCount = 0;
    sql += `CREATE TABLE ${entity.name} (\n`;
    entity.attributes.forEach(attr => {
        sql += `    ${attr.name} ${convertMermaidDataTypeToSQL(attr.type)}`;
        if (attr.pk) {
            pks += `${attr.name}, `;
            pkCount++;
        }
        // if (attr.fk) { sql += ' FOREIGN KEY '; }
        sql += ',\n';
    });
    if (pkCount > 0) { sql += pks.slice(0, -2) + ')\n);\n\n'; }
    else { sql += sql.slice(0, -2) + '\n);\n\n'; }
    return sql;
}

function convertMermaidDataTypeToSQL(dataType: string) {
    const dataTypes = {
        'string': 'VARCHAR(255)',
        'int': 'INT',
        'date': 'DATE',
        'datetime': 'DATETIME',
        'timestamp': 'TIMESTAMP',
        'float': 'FLOAT',
        'bool': 'BOOLEAN'
    };
    // @ts-ignore
    if (!dataTypes[dataType]) { return dataType; }
    // @ts-ignore
    return dataTypes[dataType];
}

/**
 * Mermaid JS ERD possible cardinalities (left / right / meaning) :
 * 
 * |o	o|	Zero or one
 * ||	||	Exactly one
 * }o	o{	Zero or more (no upper limit)
 * }|	|{	One or more (no upper limit) 
 */
function relationshipSQL(relationship: Relationship, entities: Entity[]) {
    let sql = '';
    const entity1 = entities.find(e => e.name === relationship.entity1);
    const entity2 = entities.find(e => e.name === relationship.entity2);

    if (entity1 && entity2) {
        const fromPK = entity1.attributes.find(attr => attr.pk)?.name;
        const toPK = entity2.attributes.find(attr => attr.pk)?.name;
        if (!fromPK || !toPK) { return console.error('Primary or Foreign key not found'); }
        /**
         * @todo: manage all cardinality cases
         */
        switch (relationship.cardinality) {
            case '|o--||':
            case '||--||':
            case '||--o{':
            case '||--|{':
                sql += `ALTER TABLE ${entity2.name}\n`;
                sql += `    ADD CONSTRAINT FK_${entity1.name}_${entity2.name}\n`;
                sql += `    FOREIGN KEY (${fromPK}) REFERENCES ${entity1.name}(${fromPK});\n\n`;
                break;
            //reversed case for reversed cardinality
            case '||--o|':
            case '||--||':
            case '}o--||':
            case '}|--||':
                sql += `ALTER TABLE ${entity1.name}\n`;
                sql += `    ADD CONSTRAINT FK_${entity2.name}_${entity1.name}\n`;
                sql += `    FOREIGN KEY (${toPK}) REFERENCES ${entity2.name}(${toPK});\n\n`;
                break;
            case '}|--o{':
            case '}o--|{':
            case '}|--|{':
            case '}o--o{':
                const joinTableName = `${entity1.name}_${entity2.name}`;
                sql += `CREATE TABLE ${joinTableName} (\n`;
                if (fromPK && toPK) {
                    sql += `    ${fromPK} INT,\n`;
                    sql += `    ${toPK} INT,\n`;
                    sql += `    PRIMARY KEY (${fromPK}, ${toPK}),\n`;
                    sql += `    FOREIGN KEY (${fromPK}) REFERENCES ${entity1.name}(${fromPK}),\n`;
                    sql += `    FOREIGN KEY (${toPK}) REFERENCES ${entity2.name}(${toPK})\n);\n\n`;
                }
                break;
        }
    }

    return sql;
}