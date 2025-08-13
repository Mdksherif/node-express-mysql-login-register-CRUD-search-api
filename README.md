# Node.js MySQL CRUD API with JWT Authentication

A RESTful API built with Node.js, Express, and MySQL that provides user authentication and CRUD operations with JWT token-based security.

## Features

- **User Registration & Login** with JWT authentication
- **Protected CRUD operations** for user management
- **Products API** with pagination and image upload for authorized users
- **Dual MySQL databases** (users + products) with connection pooling
- **Google Cloud Storage** integration with local storage fallback
- **Image upload** with secure file handling and validation
- **Enhanced Security**: Input validation, rate limiting, security headers
- **Password hashing** using bcrypt (12 rounds) for security
- **JWT token-based** stateless authentication
- **SQL injection prevention** with parameterized queries
- **Rate limiting** to prevent brute force attacks
- **Input validation** on all endpoints
- **Comprehensive error handling** with try-catch blocks
- **Production-ready** with secure error responses

## Project Structure

```
node_mysql_crud/
├── config/
│   ├── db.js              # MySQL connection pools (users + products)
│   ├── storageService.js  # Google Cloud Storage service
│   └── demo-google-cloud-key.json # Demo GCS credentials
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── userController.js  # User CRUD operations
│   └── productController.js # Product operations with pagination
├── middleware/
│   ├── auth.js           # JWT token verification
│   ├── validation.js     # Input validation middleware
│   ├── upload.js         # File upload middleware
│   └── errorHandler.js   # Global error handling
├── models/
│   ├── userModel.js      # User database queries
│   └── productModel.js   # Product database queries
├── routes/
│   ├── authRoutes.js     # Auth endpoints
│   ├── userRoutes.js     # Protected user endpoints
│   └── productRoutes.js  # Protected product endpoints
├── .env.dev              # Development environment
├── .env.stg              # Staging environment
├── app.js               # Express app setup
├── server.js            # Server entry point
├── database_setup.sql   # Database schema + sample data
├── generate-jwt-secret.js # JWT secret generator utility
└── package.json
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

**Security packages included:**
- `express-validator` - Input validation
- `helmet` - Security headers
- `express-rate-limit` - Rate limiting protection
- `multer` - Secure file upload handling
- `@google-cloud/storage` - Google Cloud Storage integration

### 2. Environment Configuration

#### For Single Environment:
Create `.env` file:
```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=node_mysql_crud
JWT_SECRET=your_generated_jwt_secret_here
PORT=3000
```

**Generate JWT Secret:**
```bash
# Generate cryptographically secure JWT secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use the included generator
node generate-jwt-secret.js
```

#### For Multiple Environments (Dev/Staging):
Create environment-specific files:

**`.env.dev` (Development):**
```env
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASS=dev_password
DB_NAME=node_mysql_crud_dev
PRODUCT_DB_NAME=productsdb
JWT_SECRET=your_dev_jwt_secret_here
PORT=3000

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_CLOUD_KEY_FILE=./config/google-cloud-key.json
STORAGE_TYPE=gcs
```

**`.env.stg` (Staging):**
```env
NODE_ENV=staging
DB_HOST=staging-server.com
DB_USER=staging_user
DB_PASS=staging_password
DB_NAME=node_mysql_crud_staging
PRODUCT_DB_NAME=productsdb_staging
JWT_SECRET=your_staging_jwt_secret_here
PORT=4000

# Google Cloud Storage
GOOGLE_CLOUD_PROJECT_ID=your-staging-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-staging-bucket-name
GOOGLE_CLOUD_KEY_FILE=./config/google-cloud-key-staging.json
STORAGE_TYPE=gcs
```

**Generate Environment-Specific JWT Secrets:**
```bash
# Generate secrets for all environments
node -e "console.log('DEV:', require('crypto').randomBytes(32).toString('hex')); console.log('STG:', require('crypto').randomBytes(32).toString('hex')); console.log('PROD:', require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Database Setup

#### Single Environment:
```sql
CREATE DATABASE node_mysql_crud;
USE node_mysql_crud;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Multiple Environments:
```sql
-- Development Databases
CREATE DATABASE node_mysql_crud_dev;
USE node_mysql_crud_dev;
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products Database (run database_setup.sql)
CREATE DATABASE productsdb;
USE productsdb;
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    stock_quantity INT DEFAULT 0,
    image_url VARCHAR(500) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Start Server

#### Single Environment:
```bash
npm start
```

#### Multiple Environments:
```bash
# Development
npm run dev
# Server runs on http://localhost:3000

# Staging
npm run staging
# Server runs on http://localhost:4000
```

## API Endpoints

### Authentication (Public)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login user |

### User Management (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | Get all users |
| GET | `/users/:id` | Get user by ID |
| POST | `/users` | Create new user (requires password) |
| PUT | `/users/:id` | Update user |
| DELETE | `/users/:id` | Delete user |

### Products (Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/products?page=1&limit=10` | Get paginated products list |
| POST | `/createProducts` | Create product with image upload |
| GET | `/search?q=samsung&category=electronics` | Search products with filters |
| GET | `/search/categories` | Get available product categories |

## Products API Response Format

### Get Products Response
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 14",
      "description": "Latest Apple smartphone",
      "price": 999.99,
      "category": "Electronics",
      "stock_quantity": 50,
      "image_url": "https://storage.googleapis.com/your-bucket/products/product-123.jpg",
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 2,
    "totalItems": 10,
    "itemsPerPage": 5
  }
}
```

### Create Product Response
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 11,
    "image_url": "https://storage.googleapis.com/your-bucket/products/product-1703123456789-123456789.jpg"
  }
}
```

## Authentication Flow

### 1. User Registration
```bash
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### 2. User Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 3. Access Protected Routes
```bash
GET /users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

GET /products?page=1&limit=10
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## How Authentication Works

### 🔐 Security Process:

1. **Registration**: Password hashed with bcrypt + salt before storage
2. **Login**: Plain password compared with hashed password
3. **Token Generation**: JWT created with user info (expires in 1 hour)
4. **Route Protection**: Middleware validates JWT on protected routes
5. **Token Verification**: Extracts user info from valid tokens

### 🛡️ Security Features:

- **Stateless Authentication**: No server-side sessions
- **Password Hashing**: bcrypt with 12 rounds (enhanced security)
- **JWT Tokens**: Signed with secret key, 1-hour expiration
- **Protected Routes**: Automatic token validation
- **SQL Injection Prevention**: Parameterized queries
- **Input Validation**: All endpoints validate user input
- **Rate Limiting**: Prevents brute force attacks (5 auth attempts/15min)
- **Security Headers**: Helmet middleware for XSS protection
- **Error Handling**: Global error handler with secure responses
- **Environment Validation**: Required variables checked at startup
- **Comprehensive Try-Catch**: All controllers have error handling
- **Password Requirements**: Minimum 6 characters for all user operations

## Usage Examples

### Register User
```javascript
fetch('/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  })
})
```

### Create User (Protected)
```javascript
fetch('/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123'
  })
})
```

### Login User
```javascript
const response = await fetch('/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'john@example.com',
    password: 'password123'
  })
})
const { token } = await response.json()
```

### Access Protected Route
```javascript
// Get users
fetch('/users', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Get products with pagination
fetch('/products?page=1&limit=5', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Create product with image
const formData = new FormData();
formData.append('name', 'iPhone 14');
formData.append('description', 'Latest smartphone');
formData.append('price', 999.99);
formData.append('category', 'Electronics');
formData.append('stock_quantity', 50);
formData.append('image', fileInput.files[0]); // File from input

fetch('/createProducts', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  body: formData
})
```

## Dependencies

### Core Dependencies
- **express**: Web framework
- **mysql2**: MySQL client with promises
- **jsonwebtoken**: JWT implementation
- **bcryptjs**: Password hashing
- **dotenv**: Environment variables

### Security Dependencies
- **express-validator**: Input validation and sanitization
- **helmet**: Security headers middleware
- **express-rate-limit**: Rate limiting for brute force protection

### File Upload Dependencies
- **multer**: Secure multipart file upload handling
- **@google-cloud/storage**: Google Cloud Storage integration

## Error Responses

- `400 Bad Request`: Invalid input data or validation errors
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Token expired or invalid
- `404 Not Found`: User not found
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error (details hidden in production)

## Security Features

### 🔒 Production-Ready Security:
- **Input Validation**: All user inputs validated and sanitized
- **Rate Limiting**: 5 auth attempts per 15 minutes, 100 general requests per 15 minutes
- **Security Headers**: XSS protection, content type sniffing prevention
- **Enhanced Password Security**: bcrypt with 12 rounds
- **Environment Validation**: Critical variables checked at startup
- **Global Error Handling**: Secure error responses without information leakage

## JWT Secret Security

### 🔐 How JWT_SECRET Works:

**JWT_SECRET** is a cryptographic key used to sign and verify JWT tokens:

1. **Token Creation**: Server signs token with JWT_SECRET
2. **Token Verification**: Server verifies token using same JWT_SECRET
3. **Security**: If secrets match, token is authentic

### 🔑 Generate Secure JWT Secrets:

```bash
# Method 1: Generate single secret (256-bit)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Method 2: Generate multiple secrets for environments
node generate-jwt-secret.js

# Method 3: Generate 512-bit secret for production
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### ⚠️ Security Best Practices:

- **Use cryptographically secure secrets** (32+ characters)
- **Different secrets for each environment** (dev/staging/prod)
- **Never commit secrets to version control**
- **Rotate secrets periodically**
- **Store in environment variables only**

## Product Search API

### Search Products
```bash
GET /search?q=samsung&category=electronics&minPrice=500&maxPrice=1500&page=1&limit=20
Authorization: Bearer <your_jwt_token>
```

### Search Parameters
- `q` - Search term (searches in name and description)
- `id` - Search by specific product ID
- `category` - Filter by product category
- `minPrice` - Minimum price filter
- `maxPrice` - Maximum price filter
- `page` - Page number (default: 1)
- `limit` - Results per page (default: 20, max: 100)
- `sortBy` - Sort by: relevance, price, name, date (default: relevance)
- `sortOrder` - Sort order: asc, desc (default: desc)

### Search Response
```json
{
  "success": true,
  "query": {
    "searchTerm": "samsung",
    "filters": {
      "category": "electronics",
      "priceRange": {"min": 500, "max": 1500}
    }
  },
  "data": [
    {
      "id": 101,
      "name": "Samsung Galaxy S23",
      "description": "Latest Samsung smartphone",
      "price": 899.99,
      "category": "Electronics",
      "stock_quantity": 50,
      "image_url": "/uploads/products/samsung-galaxy.jpg",
      "relevance_score": 0.95
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 28,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  },
  "searchStats": {
    "executionTime": "0.045s",
    "totalMatches": 28
  }
}
```

### Get Categories
```bash
GET /search/categories
Authorization: Bearer <your_jwt_token>
```

### Search Examples
```javascript
// Search by text
fetch('/search?q=samsung', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Search with filters
fetch('/search?q=laptop&category=computers&minPrice=1000&maxPrice=2000', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Search by ID
fetch('/search?id=123', {
  headers: { 'Authorization': `Bearer ${token}` }
})

// Get categories
fetch('/search/categories', {
  headers: { 'Authorization': `Bearer ${token}` }
})
```

## Image Upload API

### Create Product with Image
```bash
POST /createProducts
Authorization: Bearer <your_jwt_token>
Content-Type: multipart/form-data

FormData:
- name: "iPhone 14" (required)
- description: "Latest Apple smartphone" (optional)
- price: 999.99 (required)
- category: "Electronics" (optional)
- stock_quantity: 50 (optional)
- image: [file upload] (optional)
```

### Supported Image Formats
- **File Types**: JPEG, JPG, PNG, WebP
- **File Size**: Maximum 5MB
- **Validation**: Both file extension and MIME type checked

### Response
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 11,
    "image_url": "https://storage.googleapis.com/your-bucket/products/product-1703123456789-123456789.jpg"
  }
}
```

## Google Cloud Storage Setup

### 1. Create Google Cloud Project
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create new project
- Enable Cloud Storage API

### 2. Create Storage Bucket
- Go to Cloud Storage → Buckets
- Create bucket with unique name
- Set location and permissions

### 3. Service Account Setup
- Go to IAM & Admin → Service Accounts
- Create service account with Storage Object Admin role
- Generate JSON key file
- Save as `google-cloud-key.json` in config folder

### 4. Environment Configuration
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_BUCKET_NAME=your-bucket-name
GOOGLE_CLOUD_KEY_FILE=./config/google-cloud-key.json
STORAGE_TYPE=gcs
```

### Storage Features
- **Automatic Fallback**: Falls back to local storage if GCS fails
- **Secure Upload**: File type and size validation (JPEG, JPG, PNG, WebP, 5MB max)
- **CDN Ready**: Public URLs for fast image delivery
- **Production Ready**: Error handling and logging
- **Memory Storage**: Uses multer memory storage for cloud compatibility
- **Unique Filenames**: Timestamp + random number prevents conflicts
- **Static Serving**: Local files served via Express static middleware

## License

MIT License