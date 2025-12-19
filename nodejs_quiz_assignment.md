# Node.js Backend Development Quiz Assignment

**Total Points:** 100

---

## Prerequisites
- Express.js
- Joi validation
- MySQL2
- Crypto-js (AES encryption)
- dotenv
- MD5 for password hashing
- MySQL aggregate functions (COUNT, SUM, AVG, GROUP BY)

---

## Assignment Overview

You will build an **Expense Tracker API** where users can register, login, and manage their personal expenses. The system should handle authentication using encrypted tokens and provide spending analytics.

---

## Database Schema

Create the following tables in MySQL:

### Table 1: `users`
```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table 2: `expenses`
```sql
CREATE TABLE expenses (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    category VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Table 3: `categories`
```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    color VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_category (user_id, name)
);
```

---

## Part 1: Environment Setup (5 points)

Create a `.env` file with the following variables:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
DB_PORT=3306
PORT=3000
AES_SECRET_KEY=your-secret-key-here
```

**Requirements:**
- Use `dotenv` to load environment variables
- Create a database connection module that exports a MySQL2 connection pool

---

## Part 2: Authentication System (30 points)

### 2.1 User Registration (10 points)

**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
    "username": "john_doe",
    "email": "john@example.com",
    "password": "SecurePass123"
}
```

**Requirements:**
- Validate input using Joi:
  - Username: 3-50 characters, alphanumeric and underscore only
  - Email: valid email format
  - Password: minimum 8 characters, at least one uppercase, one lowercase, one number
- Hash password using MD5 before storing
- Check if username or email already exists
- Create default categories for new user: 'Food', 'Transportation', 'Entertainment', 'Bills', 'Other'
- Return success message with user id (don't return password)

**Response (Success):**
```json
{
    "success": true,
    "message": "User registered successfully",
    "userId": 1
}
```

### 2.2 User Login (10 points)

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "email": "john@example.com",
    "password": "SecurePass123"
}
```

**Requirements:**
- Validate input using Joi
- Hash provided password with MD5 and compare with stored hash
- If credentials are valid, create an authentication token:
  - Token format: `userId:timestamp` (e.g., "5:1702999999999")
  - Encrypt the token using AES encryption (crypto-js)
  - Return the encrypted token

**Response (Success):**
```json
{
    "success": true,
    "message": "Login successful",
    "token": "U2FsdGVkX1+encrypted_token_here",
    "user": {
        "id": 1,
        "username": "john_doe",
        "email": "john@example.com"
    }
}
```

### 2.3 Authentication Middleware (10 points)

Create a middleware function `authenticateToken` that:
- Extracts token from `Authorization` header (format: `Bearer <token>`)
- Decrypts the token using AES
- Extracts userId from decrypted token
- Verifies the user exists in database
- Attaches user information to `req.user`
- Returns 401 if token is invalid or user doesn't exist

---

## Part 3: Expense Management (35 points)

All endpoints below require authentication (use the middleware).

### 3.1 Create Expense (10 points)

**Endpoint:** `POST /api/expenses`

**Request Body:**
```json
{
    "title": "Grocery Shopping",
    "amount": 150.50,
    "category": "Food",
    "date": "2024-12-20",
    "description": "Weekly groceries"
}
```

**Requirements:**
- Validate using Joi:
  - Title: required, 1-200 characters
  - Amount: required, positive number with max 2 decimal places
  - Category: required, must exist in user's categories
  - Date: required, valid date format (YYYY-MM-DD)
  - Description: optional, max 500 characters
- Set `user_id` from authenticated user
- Verify category exists for this user

**Response (Success):**
```json
{
    "success": true,
    "message": "Expense added successfully",
    "expenseId": 1
}
```

### 3.2 Get All User Expenses (8 points)

**Endpoint:** `GET /api/expenses`

**Query Parameters (optional):**
- `category`: filter by category name
- `start_date`: filter expenses from this date (YYYY-MM-DD)
- `end_date`: filter expenses until this date (YYYY-MM-DD)

**Requirements:**
- Retrieve all expenses for the authenticated user
- Apply filters if provided
- Order by date descending

**Response (Success):**
```json
{
    "success": true,
    "expenses": [
        {
            "id": 1,
            "title": "Grocery Shopping",
            "amount": 150.50,
            "category": "Food",
            "date": "2024-12-20",
            "description": "Weekly groceries",
            "created_at": "2024-12-20T10:30:00.000Z"
        }
    ]
}
```

### 3.3 Get Single Expense (7 points)

**Endpoint:** `GET /api/expenses/:id`

**Requirements:**
- Retrieve expense by id
- Verify expense belongs to authenticated user
- Return 404 if expense not found
- Return 403 if expense belongs to another user

### 3.4 Update Expense (10 points)

**Endpoint:** `PUT /api/expenses/:id`

**Request Body:**
```json
{
    "title": "Updated Grocery Shopping",
    "amount": 175.00,
    "category": "Food"
}
```

**Requirements:**
- Validate using Joi (all fields optional)
- Verify expense belongs to authenticated user
- If category is being updated, verify it exists for this user
- Update only provided fields
- Return updated expense information

**Response (Success):**
```json
{
    "success": true,
    "message": "Expense updated successfully"
}
```

---

## Part 4: Category Management (10 points)

### 4.1 Get User Categories (5 points)

**Endpoint:** `GET /api/categories`

**Requirements:**
- Retrieve all categories for authenticated user
- Order by name

**Response (Success):**
```json
{
    "success": true,
    "categories": [
        {
            "id": 1,
            "name": "Food",
            "color": "#FF6B6B"
        },
        {
            "id": 2,
            "name": "Transportation",
            "color": "#4ECDC4"
        }
    ]
}
```

### 4.2 Create Category (5 points)

**Endpoint:** `POST /api/categories`

**Request Body:**
```json
{
    "name": "Healthcare",
    "color": "#95E1D3"
}
```

**Requirements:**
- Validate using Joi:
  - Name: required, 1-50 characters
  - Color: optional, hex color format
- Check if category name already exists for this user
- Create category for authenticated user

---

## Part 5: Analytics & Statistics (30 points)

All endpoints require authentication.

### 5.1 Get Total Spending (8 points)

**Endpoint:** `GET /api/analytics/total`

**Query Parameters (optional):**
- `start_date`: calculate from this date
- `end_date`: calculate until this date

**Requirements:**
- Calculate total sum of all expenses for authenticated user
- Apply date filters if provided
- Use SQL SUM function

**Response (Success):**
```json
{
    "success": true,
    "total_spending": 1250.75,
    "period": {
        "start_date": "2024-01-01",
        "end_date": "2024-12-20"
    }
}
```

### 5.2 Get Spending by Category (10 points)

**Endpoint:** `GET /api/analytics/by-category`

**Query Parameters (optional):**
- `start_date`: filter from this date
- `end_date`: filter until this date

**Requirements:**
- Group expenses by category
- Calculate total amount, count of expenses, and average amount per category
- Use SQL GROUP BY with SUM, COUNT, and AVG functions
- Order by total amount descending
- Apply date filters if provided

**SQL Example:**
```sql
SELECT 
    category,
    COUNT(*) as expense_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM expenses
WHERE user_id = ? 
    AND date >= ? 
    AND date <= ?
GROUP BY category
ORDER BY total_amount DESC
```

**Response (Success):**
```json
{
    "success": true,
    "spending_by_category": [
        {
            "category": "Food",
            "expense_count": 15,
            "total_amount": 450.75,
            "average_amount": 30.05
        },
        {
            "category": "Transportation",
            "expense_count": 8,
            "total_amount": 320.00,
            "average_amount": 40.00
        }
    ]
}
```

### 5.3 Get Monthly Spending Summary (12 points)

**Endpoint:** `GET /api/analytics/monthly`

**Query Parameters (optional):**
- `year`: filter by year (default: current year)

**Requirements:**
- Group expenses by month
- Calculate total amount, count, and average for each month
- Use SQL GROUP BY with date functions (MONTH, YEAR)
- Include months with zero expenses (return 0 values)
- Order by month

**SQL Hint:**
```sql
SELECT 
    MONTH(date) as month,
    YEAR(date) as year,
    COUNT(*) as expense_count,
    SUM(amount) as total_amount,
    AVG(amount) as average_amount
FROM expenses
WHERE user_id = ? AND YEAR(date) = ?
GROUP BY YEAR(date), MONTH(date)
ORDER BY month
```

**Response (Success):**
```json
{
    "success": true,
    "year": 2024,
    "monthly_summary": [
        {
            "month": 1,
            "month_name": "January",
            "expense_count": 12,
            "total_amount": 580.50,
            "average_amount": 48.38
        },
        {
            "month": 2,
            "month_name": "February",
            "expense_count": 10,
            "total_amount": 420.25,
            "average_amount": 42.03
        }
    ]
}
```

---

## Part 6: Error Handling & Validation (10 points)

**Requirements:**
- Create a global error handler middleware
- Handle common errors:
  - Validation errors (400)
  - Authentication errors (401)
  - Authorization errors (403)
  - Not found errors (404)
  - Database errors (500)
- Return consistent error response format:
```json
{
    "success": false,
    "error": "Error message here"
}
```

---

## Part 7: Delete Operations (5 points)

### 7.1 Delete Expense (5 points)

**Endpoint:** `DELETE /api/expenses/:id`

**Requirements:**
- Verify expense belongs to authenticated user
- Delete the expense
- Return success message

**Response (Success):**
```json
{
    "success": true,
    "message": "Expense deleted successfully"
}
```

---

## Submission Requirements

1. **Code Structure:**
   - Organized folder structure (routes, controllers, middleware, config)
   - Clear and readable code
   - Proper error handling

2. **Files to Submit:**
   - All source code files
   - `.env.example` file (without actual credentials)
   - SQL file with table creation queries
   - README.md with setup instructions

3. **Testing:**
   - Test all endpoints using Postman or similar tool
   - Include screenshots or Postman collection

---

## Grading Rubric

| Category | Points |
|----------|--------|
| Environment Setup & Database Connection | 5 |
| User Registration (with default categories) | 10 |
| User Login with Token Encryption | 10 |
| Authentication Middleware | 10 |
| Create Expense | 10 |
| Get All Expenses (with filters) | 8 |
| Get Single Expense | 7 |
| Update Expense | 10 |
| Get User Categories | 5 |
| Create Category | 5 |
| Total Spending Analytics | 8 |
| Spending by Category (GROUP BY) | 10 |
| Monthly Spending Summary (GROUP BY) | 12 |
| Error Handling | 10 |
| Delete Expense | 5 |
| **Total** | **100** |

---

## Bonus Challenges (+10 points each)

1. Add endpoint to get top 5 most expensive expenses
2. Implement weekly spending summary (GROUP BY WEEK)
3. Add endpoint to compare current month vs previous month spending
4. Create budget setting per category and check if over budget

---

## Tips

- Start with database setup and connection
- Test each endpoint after implementation
- Use try-catch blocks for async operations
- Pay special attention to SQL aggregate functions (COUNT, SUM, AVG)
- Test your GROUP BY queries in MySQL first before implementing
- Use meaningful variable names
- Remember to validate that amounts are positive numbers

**Good luck!** 💰📊