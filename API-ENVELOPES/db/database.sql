CREATE DATABASE IF NOT EXISTS budget_db;

USE budget_db;

-- Tabla para envelopes (sobres)
CREATE TABLE IF NOT EXISTS envelopes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    `limit` DECIMAL(10, 2) NOT NULL,  
    spent DECIMAL(10, 2) DEFAULT 0
);

-- Tabla para transactions (transacciones)
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    envelope_id INT,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (envelope_id) REFERENCES envelopes(id) ON DELETE CASCADE
);

/*
INSERT INTO envelopes (id, name, `limit`, spent) 
VALUES 
(1, 'Food', 200.00, 0.00),
(2, 'Rent', 1000.00, 0.00),
(3, 'Tools', 500.00, 0.00);
*/