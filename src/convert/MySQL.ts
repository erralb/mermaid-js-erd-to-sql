import { Entity } from '../types/Entity';
import { Relationship } from '../types/Relationship';
import MermaidERDSQL from './SQL';

class MermaidERDMySQL extends MermaidERDSQL {
    public static toSQL(schema: string, entities: Entity[], relationships: Relationship[]): string {
        let sql = '';
        sql += `-- SQL script generated from Mermaid JS ERD to MySQL\n`;
        sql += `-- Schema: ${schema}\n\n`;
        entities.forEach(entity => sql += this.entitySQL(entity));
        return sql;
    }
}

export default MermaidERDMySQL;

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
