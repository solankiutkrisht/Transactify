# Transactify - Phase 1 Requirements and Passing Criteria
 
## Functional Requirements
 
### 1. User Authentication
- Users must be able to sign up with email and password.
- Users must be able to log in and log out securely.
- Passwords must be hashed before storage.
- JWT-based session management.
 
### 2. Product Management
- Users can create, read, update, and delete products.
- Each product must have a name, SKU, price, and quantity.
- Products must be listed in a paginated view.
 
### 3. Customer Management
- Users can create, read, update, and delete customer records.
- Each customer must have a name, email, and phone number.
- Customers must be searchable by name or email.
 
### 4. Invoice Generation
- Users can create invoices by selecting products and customers.
- Invoices must include product details, quantities, prices, and total amount.
- Invoices must be downloadable as PDF.
- Each invoice must have a unique invoice number and timestamp.
 
### 5. Dashboard
- Users must see a dashboard with basic analytics:
  - Total sales
  - Number of invoices
  - Top-selling products
 
## Non-Functional Requirements
 
### 1. Performance
- The application must respond to user actions within 2 seconds.
- Backend APIs must return responses within 1 second for standard queries.
 
### 2. Security
- All sensitive data must be encrypted.
- JWT tokens must expire and be refreshable.
- Input validation must be enforced to prevent SQL/NoSQL injection.
 
### 3. Usability
- The UI must be responsive and mobile-friendly.
- Navigation must be intuitive with clear labels and actions.
 
### 4. Maintainability
- Code must follow standard naming conventions and be modular.
- Project must include README and setup instructions.
 
### 5. Scalability
- Backend must be designed to support multiple users and concurrent sessions.
 
## Passing Criteria
 
- ✅ User authentication works with secure login/logout.
- ✅ Products can be added, edited, deleted, and listed.
- ✅ Customers can be added, edited, deleted, and searched.
- ✅ Invoices can be generated and downloaded as PDF.
- ✅ Dashboard displays correct analytics.
- ✅ All APIs pass unit and integration tests.
- ✅ Application runs without errors on local development setup.
- ✅ Code is pushed to GitHub with proper documentation.