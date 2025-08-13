# 🔍 **Postman Search API - Quick Reference**

## **🚀 Environment Setup**
```
baseUrl: http://localhost:3000
token: {{token}} (set after login)
```

---

## **📋 Search API Quick Tests**

### **1. Basic Text Search**
```
GET {{baseUrl}}/search?q=iphone
Authorization: Bearer {{token}}
```
**Use Case:** Find all products containing "iphone"

### **2. Category Search**
```
GET {{baseUrl}}/search?category=Electronics
Authorization: Bearer {{token}}
```
**Use Case:** Browse all Electronics products

### **3. Price Range Search**
```
GET {{baseUrl}}/search?minPrice=500&maxPrice=1500
Authorization: Bearer {{token}}
```
**Use Case:** Find products in specific price range

### **4. Combined Search**
```
GET {{baseUrl}}/search?q=samsung&category=Electronics&maxPrice=1000
Authorization: Bearer {{token}}
```
**Use Case:** Samsung Electronics under $1000

### **5. Sorted Search**
```
GET {{baseUrl}}/search?q=phone&sortBy=price&sortOrder=asc
Authorization: Bearer {{token}}
```
**Use Case:** Phones sorted by price (low to high)

### **6. Paginated Search**
```
GET {{baseUrl}}/search?category=Electronics&page=2&limit=5
Authorization: Bearer {{token}}
```
**Use Case:** Browse Electronics, page 2, 5 items per page

### **7. ID Search**
```
GET {{baseUrl}}/search?id=1
Authorization: Bearer {{token}}
```
**Use Case:** Get specific product by ID

### **8. Get Categories**
```
GET {{baseUrl}}/search/categories
Authorization: Bearer {{token}}
```
**Use Case:** Get list of available categories

---

## **🎯 Real-World Test Scenarios**

### **Scenario A: Customer searches "iPhone"**
```
GET {{baseUrl}}/search?q=iphone
```
**Expected:** iPhone products with relevance scores

### **Scenario B: Customer wants cheap laptops**
```
GET {{baseUrl}}/search?q=laptop&maxPrice=1500&sortBy=price&sortOrder=asc
```
**Expected:** Laptops under $1500, cheapest first

### **Scenario C: Customer browses Electronics**
```
GET {{baseUrl}}/search?category=Electronics&page=1&limit=10
```
**Expected:** First 10 Electronics products

### **Scenario D: Customer searches non-existent product**
```
GET {{baseUrl}}/search?q=xyz123
```
**Expected:** Empty results, no errors

### **Scenario E: Customer wants premium phones**
```
GET {{baseUrl}}/search?q=phone&minPrice=800&sortBy=price&sortOrder=desc
```
**Expected:** Expensive phones first

---

## **⚡ Quick Copy-Paste URLs**

```
# Basic searches
{{baseUrl}}/search?q=iphone
{{baseUrl}}/search?q=samsung
{{baseUrl}}/search?q=laptop
{{baseUrl}}/search?q=phone

# Category searches
{{baseUrl}}/search?category=Electronics
{{baseUrl}}/search?category=Computers
{{baseUrl}}/search?category=Audio

# Price searches
{{baseUrl}}/search?maxPrice=500
{{baseUrl}}/search?minPrice=1000
{{baseUrl}}/search?minPrice=500&maxPrice=1500

# Combined searches
{{baseUrl}}/search?q=apple&category=Electronics
{{baseUrl}}/search?q=samsung&maxPrice=1000
{{baseUrl}}/search?category=Electronics&minPrice=500&maxPrice=1500

# Sorted searches
{{baseUrl}}/search?q=phone&sortBy=price&sortOrder=asc
{{baseUrl}}/search?category=Electronics&sortBy=name&sortOrder=asc
{{baseUrl}}/search?q=laptop&sortBy=date&sortOrder=desc

# Paginated searches
{{baseUrl}}/search?category=Electronics&page=1&limit=5
{{baseUrl}}/search?q=samsung&page=2&limit=3

# Utility endpoints
{{baseUrl}}/search?id=1
{{baseUrl}}/search/categories
```

---

## **🔧 Parameter Combinations**

| Search Type | Parameters | Example |
|-------------|------------|---------|
| **Text Only** | `q` | `q=iphone` |
| **Category Only** | `category` | `category=Electronics` |
| **Price Only** | `minPrice`, `maxPrice` | `minPrice=500&maxPrice=1000` |
| **Text + Category** | `q`, `category` | `q=samsung&category=Electronics` |
| **Text + Price** | `q`, `minPrice`, `maxPrice` | `q=laptop&maxPrice=1500` |
| **Category + Price** | `category`, `minPrice`, `maxPrice` | `category=Electronics&minPrice=500` |
| **Full Search** | All filters | `q=apple&category=Electronics&minPrice=500&maxPrice=1500&sortBy=price&sortOrder=asc&page=1&limit=10` |

---

## **✅ Expected Response Structure**

```json
{
  "success": true,
  "query": {
    "searchTerm": "search_term_or_null",
    "id": "id_or_null",
    "filters": {
      "category": "category_or_null",
      "priceRange": {
        "min": "min_price_or_null",
        "max": "max_price_or_null"
      }
    },
    "sorting": {
      "sortBy": "relevance|price|name|date",
      "sortOrder": "asc|desc"
    }
  },
  "data": [
    {
      "id": 1,
      "name": "Product Name",
      "description": "Product Description",
      "price": 999.99,
      "category": "Category",
      "stock_quantity": 50,
      "image_url": "url_or_null",
      "created_at": "timestamp",
      "updated_at": "timestamp",
      "relevance_score": 0.95
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 89,
    "itemsPerPage": 20,
    "hasNext": true,
    "hasPrev": false
  },
  "searchStats": {
    "executionTime": "0.045s",
    "totalMatches": 89
  }
}
```

---

## **🚨 Error Testing**

### **Invalid Parameters**
```
GET {{baseUrl}}/search?limit=200
Expected: 400 - Limit must be between 1 and 100

GET {{baseUrl}}/search?minPrice=1000&maxPrice=500
Expected: 400 - Min price cannot be greater than max price

GET {{baseUrl}}/search
Expected: 400 - At least one search parameter required
```

### **Authentication Errors**
```
GET {{baseUrl}}/search?q=iphone
(No Authorization header)
Expected: 401 - Token required

GET {{baseUrl}}/search?q=iphone
Authorization: Bearer invalid_token
Expected: 403 - Invalid token
```

**Ready for comprehensive search testing! 🎯**