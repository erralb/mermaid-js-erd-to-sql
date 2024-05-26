CREATE TABLE Client (
    clientId INT,
    nom VARCHAR(255),
    email VARCHAR(255),
    adresse VARCHAR(255),
    telephone VARCHAR(255),
    PRIMARY KEY (clientId)
);

CREATE TABLE Commande (
    commandeId INT,
    clientId INT,
    dateCommande DATE,
    statut VARCHAR(255),
    PRIMARY KEY (commandeId)
);

CREATE TABLE DetailCommande (
    detailId INT,
    commandeId INT,
    produitId INT,
    quantite INT,
    prixUnitaire double,
    PRIMARY KEY (detailId)
);

CREATE TABLE Produit (
    produitId INT,
    nomProduit VARCHAR(255),
    description VARCHAR(255),
    prix double,
    stock INT,
    categorieId INT,
    PRIMARY KEY (produitId)
);

CREATE TABLE Categorie (
    categorieId INT,
    nomCategorie VARCHAR(255),
    PRIMARY KEY (categorieId)
);

CREATE TABLE Avis (
    avisId INT,
    clientId INT,
    produitId INT,
    note INT,
    commentaire VARCHAR(255),
    PRIMARY KEY (avisId)
);

CREATE TABLE Fournisseur (
    fournisseurId INT,
    nomFournisseur VARCHAR(255),
    contact VARCHAR(255),
    telephone VARCHAR(255),
    adresse VARCHAR(255),
    PRIMARY KEY (fournisseurId)
);

CREATE TABLE FournisseurProduit (
    fournisseurId INT,
    produitId INT,
    prixUnitaire double,
    PRIMARY KEY (fournisseurId, produitId)
);

CREATE TABLE Employe (
    employeId INT,
    nom VARCHAR(255),
    prenom VARCHAR(255),
    email VARCHAR(255),
    poste VARCHAR(255),
    dateEmbauche DATE,
    PRIMARY KEY (employeId)
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

