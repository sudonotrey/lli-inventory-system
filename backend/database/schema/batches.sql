CREATE TABLE Batches (
  id INT IDENTITY(1,1) PRIMARY KEY,

  product_id INT NOT NULL,

  batch_number NVARCHAR(100) NOT NULL,

  manufacture_date DATE,

  expiry_date DATE NOT NULL,

  quantity INT NOT NULL DEFAULT 0
    CHECK (quantity >= 0),

  created_at DATETIME2 DEFAULT SYSDATETIME(),

  FOREIGN KEY (product_id)
    REFERENCES Products(id)
    ON DELETE CASCADE
);
GO