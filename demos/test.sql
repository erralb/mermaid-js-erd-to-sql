-- SQL script generated from Mermaid JS ERD to SQL
-- Schema: MermaidERDToSQLTest

CREATE TABLE Test1 (
    pk11 INT,
    pk12 INT,
    PRIMARY KEY (pk11,pk12)
);

CREATE TABLE Test2 (
    pk21 INT,
    pk11 INT,
    pk12 INT,
    PRIMARY KEY (pk21),
    FOREIGN KEY(pk11, pk12) REFERENCES Test1(pk11, pk12)
);

CREATE TABLE Test3 (
    pk31 INT,
    pk11 INT,
    pk12 INT,
    PRIMARY KEY (pk31,pk11,pk12),
    FOREIGN KEY(pk11, pk12) REFERENCES Test1(pk11, pk12)
);

CREATE TABLE Test4 (
    pk41 INT,
    PRIMARY KEY (pk41)
);

CREATE TABLE Test1_Test4_test14 (
    pk11 INT,
    pk12 INT,
    pk41 INT,
    PRIMARY KEY (pk11,pk12,pk41),
    FOREIGN KEY(pk11, pk12) REFERENCES Test1(pk11, pk12),
    FOREIGN KEY(pk41) REFERENCES Test4(pk41)
);

