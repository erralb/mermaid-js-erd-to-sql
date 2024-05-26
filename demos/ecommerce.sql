CREATE TABLE Client (
    clientId INT PRIMARY KEY,
    nom VARCHAR,
    email VARCHAR,
    adresse VARCHAR,
    telephone VARCHAR
);

CREATE TABLE Commande (
    commandeId INT PRIMARY KEY,
    clientId INT FOREIGN KEY,
    dateCommande DATE,
    statut VARCHAR
);

CREATE TABLE DetailCommande (
    detailId INT PRIMARY KEY,
    commandeId INT FOREIGN KEY,
    produitId INT FOREIGN KEY,
    quantite INT,
    prixUnitaire double
);

CREATE TABLE Produit (
    produitId INT PRIMARY KEY,
    nomProduit VARCHAR,
    description VARCHAR,
    prix double,
    stock INT,
    categorieId INT FOREIGN KEY
);

CREATE TABLE Categorie (
    categorieId INT PRIMARY KEY,
    nomCategorie VARCHAR
);

CREATE TABLE Avis (
    avisId INT PRIMARY KEY,
    clientId INT FOREIGN KEY,
    produitId INT FOREIGN KEY,
    note INT,
    commentaire VARCHAR
);

CREATE TABLE Fournisseur (
    fournisseurId INT PRIMARY KEY,
    nomFournisseur VARCHAR,
    contact VARCHAR,
    telephone VARCHAR,
    adresse VARCHAR
);

CREATE TABLE FournisseurProduit (
    fournisseurId INT PRIMARY KEY,
    produitId INT PRIMARY KEY,
    prixUnitaire double
);

CREATE TABLE Employe (
    employeId INT PRIMARY KEY,
    nom VARCHAR,
    prenom VARCHAR,
    email VARCHAR,
    poste VARCHAR,
    dateEmbauche DATE
);

ALTER TABLE Commande
    ADD CONSTRAINT FK_Client_Commande
    FOREIGN KEY (clientId) REFERENCES Client(clientId);

ALTER TABLE DetailCommande
    ADD CONSTRAINT FK_Commande_DetailCommande
    FOREIGN KEY (commandeId) REFERENCES Commande(commandeId);

ALTER TABLE DetailCommande
    ADD CONSTRAINT FK_Produit_DetailCommande
    FOREIGN KEY (produitId) REFERENCES Produit(produitId);

CREATE TABLE Categorie_Produit (
    categorieId INT,
    produitId INT,
    PRIMARY KEY (categorieId, produitId),
    FOREIGN KEY (categorieId) REFERENCES Categorie(categorieId),
    FOREIGN KEY (produitId) REFERENCES Produit(produitId)
);

ALTER TABLE FournisseurProduit
    ADD CONSTRAINT FK_Fournisseur_FournisseurProduit
    FOREIGN KEY (fournisseurId) REFERENCES Fournisseur(fournisseurId);

ALTER TABLE FournisseurProduit
    ADD CONSTRAINT FK_Produit_FournisseurProduit
    FOREIGN KEY (produitId) REFERENCES Produit(produitId);

ALTER TABLE Avis
    ADD CONSTRAINT FK_Client_Avis
    FOREIGN KEY (clientId) REFERENCES Client(clientId);

ALTER TABLE Avis
    ADD CONSTRAINT FK_Produit_Avis
    FOREIGN KEY (produitId) REFERENCES Produit(produitId);

CREATE TABLE Employe_Commande (
    employeId INT,
    commandeId INT,
    PRIMARY KEY (employeId, commandeId),
    FOREIGN KEY (employeId) REFERENCES Employe(employeId),
    FOREIGN KEY (commandeId) REFERENCES Commande(commandeId)
);

