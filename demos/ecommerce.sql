-- SQL script generated from Mermaid JS ERD to SQL
-- Schema: eCommerce

CREATE TABLE Customer (
    customerId INT,
    name VARCHAR(255),
    email VARCHAR(255),
    address VARCHAR(255),
    phone VARCHAR(255),
    PRIMARY KEY (customerId)
);

CREATE TABLE Orders (
    orderId INT,
    orderDate DATE,
    status VARCHAR(255),
    customerId INT,
    PRIMARY KEY (orderId),
    FOREIGN KEY(customerId) REFERENCES Customer(customerId)
);

CREATE TABLE Product (
    productId INT,
    productName VARCHAR(255),
    description VARCHAR(255),
    price double,
    stock INT,
    PRIMARY KEY (productId)
);

CREATE TABLE OrderDetail (
    orderDetailId INT,
    orderId INT,
    productId INT,
    quantity INT,
    unitPrice double,
    PRIMARY KEY (orderDetailId),
    FOREIGN KEY(orderId) REFERENCES Orders(orderId),
    FOREIGN KEY(productId) REFERENCES Product(productId)
);

CREATE TABLE Category (
    categoryId INT,
    categoryName VARCHAR(255),
    PRIMARY KEY (categoryId)
);

CREATE TABLE Review (
    reviewId INT,
    customerId INT,
    productId INT,
    rating INT,
    comment VARCHAR(255),
    PRIMARY KEY (reviewId),
    FOREIGN KEY(customerId) REFERENCES Customer(customerId),
    FOREIGN KEY(productId) REFERENCES Product(productId)
);

CREATE TABLE Supplier (
    supplierId INT,
    supplierName VARCHAR(255),
    contact VARCHAR(255),
    phone VARCHAR(255),
    address VARCHAR(255),
    PRIMARY KEY (supplierId)
);

CREATE TABLE SupplierProduct (
    supplierId INT,
    productId INT,
    unitPrice double,
    PRIMARY KEY (supplierId,productId),
    FOREIGN KEY(supplierId) REFERENCES Supplier(supplierId),
    FOREIGN KEY(productId) REFERENCES Product(productId)
);

CREATE TABLE Employee (
    employeeId INT,
    name VARCHAR(255),
    surname VARCHAR(255),
    email VARCHAR(255),
    position VARCHAR(255),
    hireDate DATE,
    PRIMARY KEY (employeeId)
);

CREATE TABLE Category_Product_categorizes (
    categoryId INT,
    productId INT,
    PRIMARY KEY (categoryId,productId),
    FOREIGN KEY(categoryId) REFERENCES Category(categoryId),
    FOREIGN KEY(productId) REFERENCES Product(productId)
);

CREATE TABLE Employee_Orders_manages (
    employeeId INT,
    orderId INT,
    PRIMARY KEY (employeeId,orderId),
    FOREIGN KEY(employeeId) REFERENCES Employee(employeeId),
    FOREIGN KEY(orderId) REFERENCES Orders(orderId)
);

