-- ==============================================================================
-- Script de création de la Base de Données E-Commerce
-- Compatible MySQL / MariaDB / PostgreSQL
-- ==============================================================================

-- Désactivation temporaire des vérifications de clés étrangères pour le reset
-- (MySQL: SET FOREIGN_KEY_CHECKS = 0; | PostgreSQL: DROP SCHEMA public CASCADE; CREATE SCHEMA public;)

DROP TABLE IF EXISTS code_promotions;
DROP TABLE IF EXISTS promotions;
DROP TABLE IF EXISTS commandes;
DROP TABLE IF EXISTS panier_item;
DROP TABLE IF EXISTS panier;
DROP TABLE IF EXISTS variantes_prix;
DROP TABLE IF EXISTS variantes;
DROP TABLE IF EXISTS produit_categories;
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS produits;
DROP TABLE IF EXISTS marques;
DROP TABLE IF EXISTS adresses;
DROP TABLE IF EXISTS users;

-- ==============================================================================
-- 1. UTILISATEURS & ADRESSES
-- ==============================================================================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    token VARCHAR(255) NULL,
    phone_number VARCHAR(50) NULL,
    age INT NULL,
    status VARCHAR(5) DEFAULT 'A', -- 'A' = Actif, 'I' = Inactif, 'C' = Clôturé
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE adresses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    domicile VARCHAR(255) NULL,
    travail VARCHAR(255) NULL,
    autre VARCHAR(255) NULL,
    pays VARCHAR(100) DEFAULT 'France',
    defaut VARCHAR(10) DEFAULT 'D', -- 'D' = Domicile, 'T' = Travail, 'A' = Autre
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==============================================================================
-- 2. CATALOGUE : MARQUES, PRODUITS, CATÉGORIES & VARIANTES
-- ==============================================================================

CREATE TABLE marques (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NULL
);

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT NULL,
    sous_categories VARCHAR(255) NULL
);

CREATE TABLE produits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    description TEXT NULL,
    reference_commerciale VARCHAR(100) NOT NULL UNIQUE,
    marque_id INT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (marque_id) REFERENCES marques(id) ON DELETE SET NULL
);

-- Table de liaison N:N entre Produit et Catégorie
CREATE TABLE produit_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    produit_id INT NOT NULL,
    categorie_id INT NOT NULL,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE (produit_id, categorie_id)
);

CREATE TABLE variantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    taille VARCHAR(50) NULL,
    couleur VARCHAR(50) NULL,
    sku VARCHAR(100) NOT NULL UNIQUE,
    stock INT NOT NULL DEFAULT 0,
    modification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES produits(id) ON DELETE CASCADE
);

CREATE TABLE variantes_prix (
    id INT AUTO_INCREMENT PRIMARY KEY,
    variante_id INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    device VARCHAR(10) DEFAULT 'EUR', -- Devise
    date_debut DATE NULL,
    date_fin DATE NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (variante_id) REFERENCES variantes(id) ON DELETE CASCADE
);

-- ==============================================================================
-- 3. PANIER & ITEMS DE PANIER
-- ==============================================================================

CREATE TABLE panier (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL, -- NULL si visiteur non connecté (invité)
    session_token VARCHAR(255) NULL,
    variant_sku VARCHAR(100) NULL, -- Référence directe si besoin
    quantite INT NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    modification_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE panier_item (
    id INT AUTO_INCREMENT PRIMARY KEY,
    panier_id INT NOT NULL,
    variante_id INT NOT NULL,
    quantite INT NOT NULL DEFAULT 1,
    date_modification TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE CASCADE,
    FOREIGN KEY (variante_id) REFERENCES variantes(id) ON DELETE CASCADE,
    -- Empêche les doublons pour le même article dans un même panier :
    UNIQUE (panier_id, variante_id)
);

-- ==============================================================================
-- 4. PROMOTIONS & CODES PROMO
-- ==============================================================================

CREATE TABLE promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    pourcentage DECIMAL(5, 2) NOT NULL, -- Ex: 20.00 pour -20%
    type VARCHAR(50) NOT NULL, -- 'produit', 'categorie', 'commande'
    produit_id INT NULL,       -- Rempli si la promo cible un produit
    categorie_id INT NULL,     -- Rempli si la promo cible une catégorie
    start_date DATETIME NULL,
    end_date DATETIME NULL,
    FOREIGN KEY (produit_id) REFERENCES produits(id) ON DELETE CASCADE,
    FOREIGN KEY (categorie_id) REFERENCES categories(id) ON DELETE CASCADE
);

CREATE TABLE code_promotions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    promotions_id INT NOT NULL,
    nombre_usage INT DEFAULT 0,
    user_id INT NULL, -- NULL si utilisable par tout le monde, sinon ID du client
    FOREIGN KEY (promotions_id) REFERENCES promotions(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ==============================================================================
-- 5. COMMANDES
-- ==============================================================================

CREATE TABLE commandes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_commande VARCHAR(100) NOT NULL UNIQUE,
    panier_id INT NULL,
    user_id INT NULL,
    etat VARCHAR(50) DEFAULT 'en_attente', -- 'en_attente', 'payee', 'expediee', 'annulee'
    email VARCHAR(255) NULL,
    adresse TEXT NULL,
    ville VARCHAR(100) NULL,   -- ville de livraison
    pays VARCHAR(100) NULL,    -- pays de livraison
    numero_tel VARCHAR(50) NULL,
    creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (panier_id) REFERENCES panier(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);
