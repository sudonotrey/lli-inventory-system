CREATE DATABASE lli_inventoryDB;
GO

USE lli_inventoryDB;
GO

-- Users table
CREATE TABLE Users (
  id          INT IDENTITY(1,1) PRIMARY KEY,
  username    NVARCHAR(100) NOT NULL UNIQUE,
  password    NVARCHAR(255) NOT NULL,
  role        NVARCHAR(50)  NOT NULL DEFAULT 'user',
  created_at  DATETIME      DEFAULT GETDATE()
);
GO

-- Categories table
CREATE TABLE Categories (
  id          INT IDENTITY(1,1) PRIMARY KEY,
  name        NVARCHAR(100) NOT NULL UNIQUE,
  description NVARCHAR(255),
  created_at  DATETIME DEFAULT GETDATE()
);
GO

-- Units table
CREATE TABLE Units (
  id          INT IDENTITY(1,1) PRIMARY KEY,
  name        NVARCHAR(100) NOT NULL UNIQUE,  -- e.g. Tablet, Capsule, Vial, Bottle, Box, ml, mg
  abbreviation NVARCHAR(20),                  -- e.g. tab, cap, vl, btl, bx
  created_at  DATETIME DEFAULT GETDATE()
);
GO

-- Suppliers table
CREATE TABLE Suppliers (
  id           INT IDENTITY(1,1) PRIMARY KEY,
  name         NVARCHAR(150) NOT NULL UNIQUE,
  contact_name NVARCHAR(100),
  phone        NVARCHAR(50),
  email        NVARCHAR(100),
  address      NVARCHAR(255),
  created_at   DATETIME DEFAULT GETDATE()
);
GO

-- Products table
CREATE TABLE Products (
  id             INT IDENTITY(1,1) PRIMARY KEY,
  name           NVARCHAR(150)  NOT NULL,
  generic_name   NVARCHAR(150),                              -- generic pharmaceutical name
  sku            NVARCHAR(100)  NOT NULL UNIQUE,
  batch_number   NVARCHAR(100),                              -- batch/lot number
  category_id    INT FOREIGN KEY REFERENCES Categories(id)  ON DELETE SET NULL,
  supplier_id    INT FOREIGN KEY REFERENCES Suppliers(id)   ON DELETE SET NULL,
  unit_id        INT FOREIGN KEY REFERENCES Units(id)       ON DELETE SET NULL,
  manufacturer   NVARCHAR(150),
  quantity       INT            NOT NULL DEFAULT 0,
  reorder_level  INT            NOT NULL DEFAULT 0,          -- minimum stock threshold
  unit_price     DECIMAL(10,2)  NOT NULL DEFAULT 0.00,
  expiry_date    DATE,                                       -- critical for pharma
  created_at     DATETIME       DEFAULT GETDATE(),
  updated_at     DATETIME       DEFAULT GETDATE()
);
GO

-- =====================
-- SEED DATA
-- =====================

-- Units
INSERT INTO Units (name, abbreviation) VALUES
('Tablet',  'tab'),
('Capsule', 'cap'),
('Vial',    'vl'),
('Bottle',  'btl'),
('Box',     'bx'),
('Ampoule', 'amp'),
('Sachet',  'scht'),
('Milliliter', 'ml');
GO

-- Categories
INSERT INTO Categories (name, description) VALUES
('Antibiotics',       'Antibacterial pharmaceutical products'),
('Analgesics',        'Pain relief medications'),
('Vitamins',          'Vitamins and dietary supplements'),
('Antihypertensives', 'Blood pressure medications'),
('Antidiabetics',     'Diabetes management medications'),
('IV Fluids',         'Intravenous fluid solutions'),
('Medical Supplies',  'Non-drug medical supplies');
GO

-- Suppliers
INSERT INTO Suppliers (name, contact_name, phone, email, address) VALUES
('Unilab Inc.',          'Juan Dela Cruz',  '02-8888-0000', 'sales@unilab.com.ph',    'Mandaluyong City, Metro Manila'),
('Pfizer Philippines',   'Maria Santos',    '02-7777-0000', 'info@pfizer.com.ph',     'Makati City, Metro Manila'),
('Medilines Distributor','Pedro Reyes',     '02-6666-0000', 'orders@medilines.com.ph','Quezon City, Metro Manila'),
('Generika Drugstore',   'Ana Gonzales',    '02-5555-0000', 'supply@generika.com.ph', 'Pasig City, Metro Manila');
GO

-- Admin user (password: admin123)
-- Generate hash: node -e "require('bcryptjs').hash('admin123',10).then(console.log)"
-- Replace REPLACE_WITH_BCRYPT_HASH with the generated hash
INSERT INTO Users (username, password, role)
VALUES ('admin', '$2a$10$cfVbj94NcqWaNJGCQGC4y.8lqV.9oMD9uky.3blX3hnUbK20otnj6', 'admin');
GO

-- Sample Products
INSERT INTO Products (name, generic_name, sku, batch_number, category_id, supplier_id, unit_id, manufacturer, quantity, reorder_level, unit_price, expiry_date)
VALUES
('Amoxicillin 500mg',     'Amoxicillin',       'AMOX-500-001', 'BTC-2024-001', 1, 1, 1, 'Unilab Inc.',        200, 50,  12.50, '2026-06-30'),
('Amoxicillin 250mg',     'Amoxicillin',       'AMOX-250-001', 'BTC-2024-002', 1, 1, 1, 'Unilab Inc.',        150, 50,   8.00, '2026-08-31'),
('Biogesic 500mg',        'Paracetamol',       'PARA-500-001', 'BTC-2024-003', 2, 1, 1, 'Unilab Inc.',        500, 100,  5.75, '2027-01-31'),
('Mefenamic Acid 500mg',  'Mefenamic Acid',    'MEFE-500-001', 'BTC-2024-004', 2, 3, 1, 'Generika',           300, 80,   7.00, '2026-12-31'),
('Cetirizine 10mg',       'Cetirizine HCl',    'CETI-010-001', 'BTC-2024-005', 2, 2, 1, 'Pfizer',              8,  30,  10.00, '2025-09-30'),
('Vitamin C 500mg',       'Ascorbic Acid',     'VITC-500-001', 'BTC-2024-006', 3, 1, 1, 'Unilab Inc.',        400, 100,  4.50, '2027-06-30'),
('Losartan 50mg',         'Losartan Potassium','LOSA-050-001', 'BTC-2024-007', 4, 2, 1, 'Pfizer',             180, 60,  15.00, '2026-10-31'),
('Metformin 500mg',       'Metformin HCl',     'METF-500-001', 'BTC-2024-008', 5, 3, 1, 'Medilines',           5,  40,  12.00, '2025-08-31'),
('PNSS 1L',               'NaCl 0.9%',         'PNSS-001-001', 'BTC-2024-009', 6, 3, 4, 'Medilines',          60,  20,  85.00, '2026-03-31'),
('D5W 1L',                'Dextrose 5%',        'D5W-001-001', 'BTC-2024-010', 6, 3, 4, 'Medilines',          45,  20,  90.00, '2025-12-31');
GO