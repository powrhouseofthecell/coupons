# **E-Commerce Coupon Management API**

## **Objective**

## Build a RESTful API to manage and apply various types of discount coupons for an e-commerce platform. The system supports **cart-wise**, **product-wise**, and **Buy X Get Y Free (BxGy)** coupons.

## **Features**

1. **Coupon Management**

   - Create, update, delete, and retrieve coupons.
   - Support for multiple types of coupons:
     - **Cart-wise**: Discounts based on the total cart value.
     - **Product-wise**: Discounts for specific products or categories.
     - **Buy X Get Y Free (BxGy)**: Conditional discounts (e.g., Buy 2 Get 1 Free).

---

## **API Endpoints**

### Coupon Management

| HTTP Method | Endpoint                     | Description                                |
| ----------- | ---------------------------- | ------------------------------------------ |
| `POST`      | `/api/v1/coupons/`           | Add a new coupon.                          |
| `GET`       | `/api/v1/coupons/`           | Retrieve all coupons.                      |
| `GET`       | `/api/v1/coupons/:coupon_id` | Retrieve details of a specific coupon.     |
| `PATCH`     | `/api/v1/coupons/:coupon_id` | Update an existing coupon.                 |
| `DELETE`    | `/api/v1/coupons/:coupon_id` | Delete a coupon (soft delete recommended). |

### Coupon Filtering and Validation

| HTTP Method | Endpoint                     | Description                                                   |
| ----------- | ---------------------------- | ------------------------------------------------------------- |
| `GET`       | `/api/v1/coupons/date-range` | Retrieve coupons applicable within a specific date range.     |
| `GET`       | `/api/v1/coupons/cart`       | Retrieve coupons with minimum cart value constraints.         |
| `POST`      | `/api/v1/coupons/validate`   | Validate a coupon for a given cart or product list (PENDING). |

### Coupon Application

| HTTP Method | Endpoint                | Description                               |
| ----------- | ----------------------- | ----------------------------------------- |
| `POST`      | `/api/v1/coupons/apply` | Apply a coupon to a cart or product list. |

### Special Operations

| HTTP Method | Endpoint                            | Description                           |
| ----------- | ----------------------------------- | ------------------------------------- |
| `PATCH`     | `/api/v1/coupons/active/:coupon_id` | Toggle the active status of a coupon. |

---

## **Use Cases**

### **Implemented Use Cases**

1. **Cart-Wise Coupon**:

   - **Example**: `SUMMER10` provides a 10% discount for carts with a minimum value of $50.
   - **Scenario**: Cart value = $100. Discount = $10.

2. **Product-Wise Coupon**:

   - **Example**: `SHOES20` gives a $20 discount for specific products like shoes.
   - **Scenario**: Product A is a shoe. Price = $100. Final Price = $80.

3. **Buy X Get Y Free (BxGy)**:

   - **Example**: `BUY2GET1` gives one free item when two are purchased.
   - **Scenario**: Buy 2 shirts, get 1 shirt free.

4. **Date-Range Coupons**:
   - Coupons only valid within a specific start and end date.

---

### **Future Use Cases**

1. **User-Specific Coupons**:

   - Coupons applicable only to specific users (e.g., loyalty rewards).

2. **Category-Based Coupons**:

   - Discounts for specific categories (e.g., electronics or clothing).

---

## **Assumptions**

1. Coupons are stored in a MongoDB database.
2. Coupons have unique `code`.
3. Expired or inactive coupons cannot be applied.
4. BxGy coupons are only valid for products explicitly listed in `applicable_products`.

---

## **Limitations**

1. Does not include real-time user authentication for coupon validation.
2. No admin panel for managing coupons; this is strictly an API.

---
