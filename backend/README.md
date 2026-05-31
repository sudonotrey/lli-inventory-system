# lli-inventory-api
Backend of the LLI Pharmaceutical Inventory Management System

##
<table>
  <tr>
    <th colspan="4" style="text-align: center">AUTH</th>
  </tr>
  <tr>
    <th>METHOD</th>
    <th>URL</th>
    <th>DESCRIPTION</th>
    <th>STATUS</th>
  </tr>
  <tr>
    <td>POST</td>
    <td>http://localhost:5000/api/auth/login</td>
    <td>Login using username and password. Returns a JWT token and user info.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>http://localhost:5000/api/auth/logout</td>
    <td>Logout. JWT is stateless so the client simply discards the token.</td>
    <td align="center">OK</td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="4" style="text-align: center">CATEGORIES</th>
  </tr>
  <tr>
    <th>METHOD</th>
    <th>URL</th>
    <th>DESCRIPTION</th>
    <th>STATUS</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/categories</td>
    <td>Retrieve all product categories.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/categories/:id</td>
    <td>Retrieve a single category by ID.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>http://localhost:5000/api/categories</td>
    <td>Create a new category. Requires name and optional description.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>http://localhost:5000/api/categories/:id</td>
    <td>Update an existing category by ID.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>http://localhost:5000/api/categories/:id</td>
    <td>Delete a category by ID.</td>
    <td align="center">OK</td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="4" style="text-align: center">SUPPLIERS</th>
  </tr>
  <tr>
    <th>METHOD</th>
    <th>URL</th>
    <th>DESCRIPTION</th>
    <th>STATUS</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/suppliers</td>
    <td>Retrieve all suppliers.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/suppliers/:id</td>
    <td>Retrieve a single supplier by ID.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>http://localhost:5000/api/suppliers</td>
    <td>Create a new supplier. Requires name, optional contact_name, phone, email, address.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>http://localhost:5000/api/suppliers/:id</td>
    <td>Update an existing supplier by ID.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>http://localhost:5000/api/suppliers/:id</td>
    <td>Delete a supplier by ID.</td>
    <td align="center">OK</td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="4" style="text-align: center">UNITS</th>
  </tr>
  <tr>
    <th>METHOD</th>
    <th>URL</th>
    <th>DESCRIPTION</th>
    <th>STATUS</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/units</td>
    <td>Retrieve all units of measure (e.g. Tablet, Capsule, Vial).</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/units/:id</td>
    <td>Retrieve a single unit by ID.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>http://localhost:5000/api/units</td>
    <td>Create a new unit. Requires name and optional abbreviation.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>http://localhost:5000/api/units/:id</td>
    <td>Update an existing unit by ID.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>http://localhost:5000/api/units/:id</td>
    <td>Delete a unit by ID.</td>
    <td align="center">OK</td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="4" style="text-align: center">PRODUCTS</th>
  </tr>
  <tr>
    <th>METHOD</th>
    <th>URL</th>
    <th>DESCRIPTION</th>
    <th>STATUS</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/products</td>
    <td>Retrieve all pharmaceutical products with category, supplier, and unit details.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/products/:id</td>
    <td>Retrieve a single product by ID.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>POST</td>
    <td>http://localhost:5000/api/products</td>
    <td>Create a new product. Requires name, sku. Optional: generic_name, batch_number, category_id, supplier_id, unit_id, manufacturer, quantity, reorder_level, unit_price, expiry_date.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>PUT</td>
    <td>http://localhost:5000/api/products/:id</td>
    <td>Update an existing product by ID.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>DELETE</td>
    <td>http://localhost:5000/api/products/:id</td>
    <td>Delete a product by ID.</td>
    <td align="center">OK</td>
  </tr>
</table>

<br>

<table>
  <tr>
    <th colspan="4" style="text-align: center">REPORTS</th>
  </tr>
  <tr>
    <th>METHOD</th>
    <th>URL</th>
    <th>DESCRIPTION</th>
    <th>STATUS</th>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/reports/inventory-summary</td>
    <td>Returns inventory summary grouped by category including total products, total quantity, and total value.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/reports/low-stock</td>
    <td>Returns all products where current quantity is at or below their reorder level.</td>
    <td align="center">OK</td>
  </tr>
  <tr>
    <td>GET</td>
    <td>http://localhost:5000/api/reports/expiry</td>
    <td>Returns all products expiring within 90 days or already expired. Includes expiry status: Expired, Critical (≤30 days), or Near Expiry (≤90 days).</td>
    <td align="center">OK</td>
  </tr>
</table>