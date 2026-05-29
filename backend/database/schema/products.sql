CREATE TABLE Products (
  id INT IDENTITY(1,1) PRIMARY KEY,

  name NVARCHAR(150) NOT NULL,

  sku NVARCHAR(100) NOT NULL UNIQUE,

  category_id INT NULL,

  supplier_id INT NULL,

  description NVARCHAR(255),

  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00
    CHECK (unit_price >= 0),

  created_at DATETIME2 DEFAULT SYSDATETIME(),

  updated_at DATETIME2 DEFAULT SYSDATETIME(),

  FOREIGN KEY (category_id)
    REFERENCES Categories(id)
    ON DELETE SET NULL,

  FOREIGN KEY (supplier_id)
    REFERENCES Suppliers(id)
    ON DELETE SET NULL
);
GO