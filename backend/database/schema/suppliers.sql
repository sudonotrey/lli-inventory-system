CREATE TABLE Suppliers (
  id INT IDENTITY(1,1) PRIMARY KEY,

  name NVARCHAR(150) NOT NULL,

  contact_person NVARCHAR(150),

  phone NVARCHAR(50),

  email NVARCHAR(150),

  address NVARCHAR(255),

  created_at DATETIME2 DEFAULT SYSDATETIME()
);
GO