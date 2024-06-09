-- SQL script generated from Mermaid JS ERD to SQL
-- Schema: MermaidERDToSQLRelationshipsTest

CREATE TABLE Test1 (
    pk11 INT,
    pk12 INT,
    PRIMARY KEY (pk11,pk12)
);

CREATE TABLE Test2 (
    pk11 INT,
    pk12 INT,
    FOREIGN KEY(pk11, pk12) REFERENCES Test1(pk11, pk12)
);

CREATE TABLE Test3 (
    pk11 INT,
    pk12 INT,
    FOREIGN KEY(pk11, pk12) REFERENCES Test1(pk11, pk12)
);

CREATE TABLE Test4 
);

CREATE TABLE Test1 (
    pk11 INT,
    pk12 INT,
    PRIMARY KEY (pk11,pk12)
);

CREATE TABLE Test1_Test4_test14 (
    pk11 INT,
    pk12 INT,
    PRIMARY KEY (pk11,pk12),
    FOREIGN KEY(pk11, pk12) REFERENCES Test1(pk11, pk12)
);

