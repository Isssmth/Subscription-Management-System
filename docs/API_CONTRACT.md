# API Contract

Use this document to agree on endpoint paths and request/response shapes before
frontend and backend work proceeds in parallel.

## Implemented Catalog Module (`com.brightloop.catalog`)

### 1. Products (`/api/products`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products` | List products with query filters (`?query=...&active=true/false&type=SERVICE/GOODS/DIGITAL`) |
| `GET` | `/api/products/{id}` | Get product details including variants and plans |
| `POST` | `/api/products` | Create a new product |
| `PUT` | `/api/products/{id}` | Update product information |
| `PATCH` | `/api/products/{id}/status` | Toggle product active/inactive status |
| `DELETE` | `/api/products/{id}` | Delete product and its variants |

**Product Request Body:**
```json
{
  "name": "Brightloop Enterprise Suite",
  "type": "SERVICE",
  "salesPrice": 12000.00,
  "costPrice": 5000.00,
  "notes": "Full-featured subscription platform",
  "active": true
}
```

### 2. Product Variants (`/api/products/{productId}/variants`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/products/{productId}/variants` | List all variants for a product |
| `GET` | `/api/products/{productId}/variants/{variantId}` | Get single variant details |
| `POST` | `/api/products/{productId}/variants` | Create a variant for a product |
| `PUT` | `/api/products/{productId}/variants/{variantId}` | Update a variant |
| `DELETE` | `/api/products/{productId}/variants/{variantId}` | Delete a variant |
| `POST` | `/api/products/{productId}/variants/calculate-price` | Calculate product price + variant price |

**Calculate Price Request Body:**
```json
{
  "variantIds": [1, 2]
}
```

**Calculate Price Response Body:**
```json
{
  "productId": 1,
  "productName": "Brightloop Enterprise Suite",
  "baseSalesPrice": 12000.00,
  "totalVariantAddition": 560.00,
  "finalPrice": 12560.00,
  "appliedVariants": [
    {
      "id": 1,
      "name": "Odoo Brand Variant",
      "additionalPrice": 560.00
    }
  ]
}
```

### 3. Plans (`/api/plans`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/plans` | List plans (`?productId=...&active=true/false&frequency=DAILY/WEEKLY/MONTHLY/YEARLY&query=...`) |
| `GET` | `/api/plans/{id}` | Get plan details |
| `POST` | `/api/plans` | Create a new plan |
| `PUT` | `/api/plans/{id}` | Update plan details |
| `PATCH` | `/api/plans/{id}/status` | Toggle plan active/inactive status |
| `DELETE` | `/api/plans/{id}` | Delete a plan |

**Plan Request Body:**
```json
{
  "productId": 1,
  "name": "Annual Business Plan",
  "price": 9999.00,
  "billingFrequency": "YEARLY",
  "minimumQuantity": 1,
  "availabilityStartDate": "2026-01-01",
  "availabilityEndDate": "2026-12-31",
  "autoClose": false,
  "earlyClosure": false,
  "pause": true,
  "renewal": true,
  "active": true
}
```

### 4. Taxes (`/api/taxes`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/taxes` | List taxes (`?activeOnly=true`) |
| `GET` | `/api/taxes/{id}` | Get tax details |
| `POST` | `/api/taxes` | Create a tax configuration |
| `PUT` | `/api/taxes/{id}` | Update tax configuration |
| `PATCH` | `/api/taxes/{id}/status` | Toggle tax active/inactive status |
| `DELETE` | `/api/taxes/{id}` | Delete a tax configuration |

**Tax Request Body:**
```json
{
  "name": "GST 18%",
  "rate": 18.00,
  "active": true
}
```

---

## Other Module Groups (Owned by Teammates)
- `/api/auth`
- `/api/users`
- `/api/quotations`
- `/api/subscriptions`
- `/api/invoices`
- `/api/payments`
- `/api/reports`
