-- Brightloop database starter.
-- Create the database before running this file:
CREATE DATABASE IF NOT EXISTS brightloop;
USE brightloop;

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    type ENUM('DIGITAL', 'GOODS', 'SERVICE') NOT NULL,
    sales_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    cost_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB;

-- Product Variants Table
CREATE TABLE IF NOT EXISTS product_variants (
    id BIGINT NOT NULL AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    additional_price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_variants_product FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Plans Table
CREATE TABLE IF NOT EXISTS plans (
    id BIGINT NOT NULL AUTO_INCREMENT,
    product_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    billing_frequency ENUM('DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY') NOT NULL,
    minimum_quantity INT NOT NULL DEFAULT 1,
    availability_start_date DATE NOT NULL,
    availability_end_date DATE,
    auto_close BOOLEAN NOT NULL DEFAULT FALSE,
    early_closure BOOLEAN NOT NULL DEFAULT FALSE,
    pause BOOLEAN NOT NULL DEFAULT FALSE,
    renewal BOOLEAN NOT NULL DEFAULT TRUE,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id),
    CONSTRAINT fk_plans_product FOREIGN KEY (product_id) REFERENCES products (id)
) ENGINE=InnoDB;

-- Taxes Table
CREATE TABLE IF NOT EXISTS taxes (
    id BIGINT NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    rate DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME(6),
    updated_at DATETIME(6),
    PRIMARY KEY (id)
) ENGINE=InnoDB;
