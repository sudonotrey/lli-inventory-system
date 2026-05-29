-- Note:
-- Generate bcrypt hash:
-- Install bcryptjs first by running: npm install bcryptjs
-- Run the following command:
-- node -e "require('bcryptjs').hash('admin123',10).then(console.log)"
-- Password: admin123

INSERT INTO Users (username, password, role)
VALUES
('admin', '$2a$10$kJRFcIKkCO1pdRZN7oHkhOa7wl0VOCJhW4dGjiy9BCU2iQIN.Vc2q', 'admin');
GO