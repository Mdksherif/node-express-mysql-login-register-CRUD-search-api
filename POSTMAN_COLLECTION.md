# 📮 Postman API Testing Guide

## 🚀 Quick Setup

### Base URL
```
http://localhost:3000
```

### Environment Variables (Create in Postman)
- `baseUrl`: `http://localhost:3000`
- `token`: `{{token}}` (will be set automatically after login)

---

## 📋 API Testing Sequence

### **1. User Registration**
```
POST {{baseUrl}}/auth/register
```
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```
**Expected Response:**
```json
{
  "message": "User registered successfully",
  "id": 1
}
```

---

### **2. User Login**
```
POST {{baseUrl}}/auth/login
```
**Headers:**
```
Content-Type: application/json
```
**Body (JSON):**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
**Expected Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful"
}
```
**⚠️ IMPORTANT:** Copy the token and set it as environment variable `token`

---

### **3. Get All Users (Protected)**
```
GET {{baseUrl}}/users
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  }
]
```

---

### **4. Create New User (Protected)**
```
POST {{baseUrl}}/users
```
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body (JSON):**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "password": "password123"
}
```
**Expected Response:**
```json
{
  "message": "User created",
  "id": 2
}
```

---

### **5. Get User by ID (Protected)**
```
GET {{baseUrl}}/users/1
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com"
}
```

---

### **6. Update User (Protected)**
```
PUT {{baseUrl}}/users/1
```
**Headers:**
```
Content-Type: application/json
Authorization: Bearer {{token}}
```
**Body (JSON):**
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```
**Expected Response:**
```json
{
  "message": "User updated"
}
```

---

### **7. Get Products with Pagination (Protected)**
```
GET {{baseUrl}}/products?page=1&limit=5
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Sample Product",
      "description": "Product description",
      "price": 99.99,
      "category": "Electronics",
      "stock_quantity": 10,
      "image_url": null,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 5
  }
}
```

---

### **8. Create Product with Image (Protected)**
```
POST {{baseUrl}}/createProducts
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Body (form-data):**
```
name: iPhone 14
description: Latest Apple smartphone
price: 999.99
category: Electronics
stock_quantity: 50
image: [Select file - JPEG/PNG/WebP, max 5MB]
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 2,
    "image_url": "/uploads/products/product-1703123456789-123456789.jpg"
  }
}
```

---

### **9. Create Product without Image (Protected)**
```
POST {{baseUrl}}/createProducts
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Body (form-data):**
```
name: MacBook Pro
description: Professional laptop
price: 1999.99
category: Computers
stock_quantity: 25
```
**Expected Response:**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "id": 3,
    "image_url": null
  }
}
```

---

### **10. Search Products by Text (Protected)**
```
GET {{baseUrl}}/search?q=iphone
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "query": {
    "searchTerm": "iphone",
    "filters": {
      "category": null,
      "priceRange": {"min": null, "max": null}
    }
  },
  "data": [
    {
      "id": 1,
      "name": "iPhone 14",
      "description": "Latest Apple smartphone with advanced features",
      "price": 999.99,
      "category": "Electronics",
      "stock_quantity": 50,
      "image_url": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z",
      "relevance_score": 0.95
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 1,
    "totalItems": 1,
    "itemsPerPage": 20,
    "hasNext": false,
    "hasPrev": false
  },
  "searchStats": {
    "executionTime": "0.045s",
    "totalMatches": 1
  }
}
```

---

### **11. Search with Category Filter (Protected)**
```
GET {{baseUrl}}/search?q=samsung&category=Electronics
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "query": {
    "searchTerm": "samsung",
    "filters": {
      "category": "Electronics",
      "priceRange": {"min": null, "max": null}
    }
  },
  "data": [
    {
      "id": 2,
      "name": "Samsung Galaxy S23",
      "description": "High-performance Android smartphone",
      "price": 899.99,
      "category": "Electronics",
      "relevance_score": 0.92
    }
  ]
}
```

---

### **12. Search with Price Range (Protected)**
```
GET {{baseUrl}}/search?q=laptop&minPrice=1000&maxPrice=2000
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "query": {
    "searchTerm": "laptop",
    "filters": {
      "category": null,
      "priceRange": {"min": "1000", "max": "2000"}
    }
  },
  "data": [
    {
      "id": 4,
      "name": "Dell XPS 13",
      "description": "Compact and powerful ultrabook",
      "price": 1299.99,
      "category": "Computers",
      "relevance_score": 0.78
    }
  ]
}
```

---

### **13. Search with Sorting (Protected)**
```
GET {{baseUrl}}/search?q=phone&sortBy=price&sortOrder=asc&limit=5
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "query": {
    "searchTerm": "phone",
    "sorting": {
      "sortBy": "price",
      "sortOrder": "asc"
    }
  },
  "data": [
    {
      "id": 2,
      "name": "Samsung Galaxy S23",
      "price": 899.99,
      "relevance_score": 0.85
    },
    {
      "id": 1,
      "name": "iPhone 14",
      "price": 999.99,
      "relevance_score": 0.82
    }
  ]
}
```

---

### **14. Search by Product ID (Protected)**
```
GET {{baseUrl}}/search?id=1
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "query": {
    "searchTerm": null,
    "id": "1"
  },
  "data": [
    {
      "id": 1,
      "name": "iPhone 14",
      "description": "Latest Apple smartphone with advanced features",
      "price": 999.99,
      "category": "Electronics",
      "stock_quantity": 50,
      "image_url": null,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "totalItems": 1
  }
}
```

---

### **15. Complex Search with Multiple Filters (Protected)**
```
GET {{baseUrl}}/search?q=apple&category=Electronics&minPrice=500&maxPrice=1500&sortBy=price&sortOrder=desc&page=1&limit=10
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "query": {
    "searchTerm": "apple",
    "filters": {
      "category": "Electronics",
      "priceRange": {"min": "500", "max": "1500"}
    },
    "sorting": {
      "sortBy": "price",
      "sortOrder": "desc"
    }
  },
  "data": [
    {
      "id": 1,
      "name": "iPhone 14",
      "price": 999.99,
      "category": "Electronics",
      "relevance_score": 0.95
    }
  ]
}
```

---

### **16. Search with Pagination (Protected)**
```
GET {{baseUrl}}/search?category=Electronics&page=2&limit=3
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 2,
    "totalPages": 3,
    "totalItems": 8,
    "itemsPerPage": 3,
    "hasNext": true,
    "hasPrev": true
  }
}
```

---

### **17. Get Product Categories (Protected)**
```
GET {{baseUrl}}/search/categories
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "data": [
    "Audio",
    "Computers",
    "Electronics",
    "Footwear",
    "Photography"
  ],
  "total": 5
}
```

---

### **18. Search No Results (Protected)**
```
GET {{baseUrl}}/search?q=xyz123nonexistent
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "success": true,
  "query": {
    "searchTerm": "xyz123nonexistent"
  },
  "data": [],
  "pagination": {
    "currentPage": 1,
    "totalPages": 0,
    "totalItems": 0,
    "itemsPerPage": 20,
    "hasNext": false,
    "hasPrev": false
  },
  "searchStats": {
    "executionTime": "0.023s",
    "totalMatches": 0
  }
}
```

---

### **19. Delete User (Protected)**
```
DELETE {{baseUrl}}/users/2
```
**Headers:**
```
Authorization: Bearer {{token}}
```
**Expected Response:**
```json
{
  "message": "User deleted"
}
```

---

## 🔧 Postman Collection Setup

### **Step 1: Create Environment**
1. Click "Environments" → "Create Environment"
2. Name: `Node MySQL CRUD API`
3. Add variables:
   - `baseUrl`: `http://localhost:3000`
   - `token`: (leave empty, will be set automatically)

### **Step 2: Create Collection**
1. Click "Collections" → "Create Collection"
2. Name: `Node MySQL CRUD API`
3. Add all the above requests

### **Step 3: Auto-Set Token (Optional)**
Add this script to the **Login request** in "Tests" tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
    console.log("Token set:", response.token);
}
```

---

## 🧪 Testing Scenarios

### **Authentication Flow**
1. Register → Login → Access Protected Routes
2. Test invalid credentials
3. Test expired token (wait 1 hour)

### **User Management Flow**
1. Create user → Get user → Update user → Delete user
2. Test duplicate email registration
3. Test invalid user ID

### **Product Management Flow**
1. Create product with image → Get products
2. Create product without image → Get products
3. Test pagination (page=1&limit=2)
4. Test invalid file types (.txt, .exe)
5. Test file size limit (>5MB)

### **Search Flow**
1. **Basic Search**: Search by text → Get results with relevance scores
2. **Filtered Search**: Add category, price range filters
3. **Sorted Search**: Test sorting by price, name, date
4. **ID Search**: Direct product lookup by ID
5. **Pagination**: Test different page sizes and navigation
6. **Categories**: Get available categories for filtering
7. **Edge Cases**: Test empty results, invalid parameters
8. **Complex Search**: Combine multiple filters and sorting

### **Error Testing**
1. Missing Authorization header
2. Invalid JWT token
3. Missing required fields
4. Invalid data types
5. Rate limiting (make >100 requests in 15 minutes)

---

## 📊 Expected Status Codes

| Scenario | Status Code | Response |
|----------|-------------|----------|
| Successful registration | 201 | User created |
| Successful login | 200 | Token returned |
| Protected route access | 200 | Data returned |
| Missing token | 401 | Token required |
| Invalid token | 403 | Invalid token |
| Validation error | 400 | Validation failed |
| User not found | 404 | User not found |
| Rate limit exceeded | 429 | Too many requests |
| Server error | 500 | Internal server error |

---

## 🔍 Debugging Tips

### **Common Issues:**
1. **401 Unauthorized**: Check if token is set in Authorization header
2. **403 Forbidden**: Token might be expired or invalid
3. **400 Bad Request**: Check request body format and required fields
4. **500 Internal Server Error**: Check server logs and database connection

### **File Upload Issues:**
1. Use `form-data` body type, not JSON
2. Ensure file is JPEG/PNG/WebP format
3. Check file size is under 5MB
4. Verify `image` field name matches

### **Database Issues:**
1. Ensure MySQL is running
2. Check database exists and tables are created
3. Verify environment variables are set correctly

---

## 🎯 Quick Test Checklist

### **Basic Setup**
- [ ] Server running on port 3000
- [ ] Database connected and tables created
- [ ] Environment variables configured
- [ ] Search indexes created (run database_search_setup.sql)

### **Authentication**
- [ ] User registration works
- [ ] User login returns token
- [ ] Protected routes require authentication

### **Product Management**
- [ ] File upload works with valid images
- [ ] Product creation successful
- [ ] Product listing with pagination

### **Search Functionality**
- [ ] Basic text search works (q=iphone)
- [ ] Category filtering works
- [ ] Price range filtering works
- [ ] ID search returns exact product
- [ ] Sorting by price, name, date works
- [ ] Pagination with search results
- [ ] Categories endpoint returns list
- [ ] Empty search results handled gracefully
- [ ] Complex multi-filter search works

### **Performance & Security**
- [ ] Search response time under 1 second
- [ ] Error handling returns proper status codes
- [ ] Rate limiting prevents abuse
- [ ] Input validation prevents invalid searches

**Ready to test! 🚀**