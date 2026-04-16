# Bank System API

A RESTful banking API built with Node.js, Express, and MongoDB. It supports user registration with email OTP confirmation, JWT authentication, bank account management, and financial transactions (deposit, withdrawal, transfer).

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
  - [Auth](#auth)
  - [Transactions](#transactions)
  - [Admin](#admin)
- [Error Handling](#error-handling)
- [Rate Limiting](#rate-limiting)

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js (TypeScript)
- **Database**: MongoDB (Mongoose)
- **Auth**: JWT Bearer token via `ACCESS_SECRET_KEY`
- **Security**: Helmet, CORS, express-rate-limit, bcrypt password hashing
- **Email**: OTP confirmation email sent on signup

---

## Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/fakhrbasha/bank-system-api.git
cd bank-system-api

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env

# 4. Run the development server
npm run dev
```

---

## Environment Variables

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/bank-system
ACCESS_SECRET_KEY=your_jwt_secret_key
MAIL_USER=your_email@example.com
MAIL_PASS=your_email_password
```

---

## Project Structure

```
src/
├── config/
│   └── config.service.ts
├── common/
│   ├── enum/
│   │   └── user.enum.ts              # RoleEnum, statusAccountEnum, typeTransactionEnum
│   ├── middleware/
│   │   ├── authentication.ts
│   │   └── validation.ts
│   └── utils/
│       ├── global-error-handling.ts
│       ├── functions.ts              # generateAccountNumber
│       ├── security/
│       │   └── hash.ts               # Hash, Compare
│       ├── token/
│       │   └── jwt.ts                # generateToken
│       └── mail/
│           ├── mail.ts               # sendEmail, sendOtp
│           └── email.template.ts
├── modules/
│   ├── auth/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   └── user.validation.ts
│   ├── transactions/
│   │   ├── transactions.controller.ts
│   │   ├── transactions.service.ts
│   │   └── transactions.validation.ts
│   └── admin/
│       ├── admin.controller.ts
│       ├── admin.service.ts
│       └── admin.validation.ts
├── DB/
│   ├── models/
│   │   ├── user.model.ts
│   │   └── bankAccount.model.ts
│   │   └── transaction.model.ts
│   │   └── beneficiary.model.ts
│   ├── repository/
│   │   ├── user.repository.ts
│   │   ├── account.repository.ts
│   │   └── trancaction.repository.ts
│   └── connectionDB.ts

└── app.controller.ts
└── app.ts
```

---

## API Reference

### Base URL

```
http://localhost:3000
```

---

### Auth

#### POST /auth/signup

Register a new user. A bank account is automatically created with a generated account number and a starting balance of `0`. An OTP confirmation email is sent to the provided address.

**Request Body**

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123",
  "confirmPassword": "securepassword123"
}
```

| Field           | Type   | Required | Description              |
| --------------- | ------ | -------- | ------------------------ |
| username        | string | Yes      | Display name of the user |
| email           | string | Yes      | Must be unique           |
| password        | string | Yes      | Hashed before storage    |
| confirmPassword | string | Yes      | Must match `password`    |

**Response 200**

```json
{
  "message": "User signed up successfully",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "createdAt": "2024-01-15T10:00:00.000Z"
    },
    "bankAccount": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "accountNumber": "1234567890",
      "balance": 0,
      "status": "active",
      "createdAt": "2024-01-15T10:00:00.000Z"
    }
  }
}
```

**Error Responses**

| Status | Condition            |
| ------ | -------------------- |
| 409    | Email already exists |
| 400    | Validation error     |

---

#### POST /auth/signin

Authenticate an existing user and receive a JWT access token.

**Request Body**

```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

| Field    | Type   | Required | Description         |
| -------- | ------ | -------- | ------------------- |
| email    | string | Yes      | Registered email    |
| password | string | Yes      | Plain text password |

**Response 200**

```json
{
  "message": "User signed in successfully",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Responses**

| Status | Condition        |
| ------ | ---------------- |
| 404    | User not found   |
| 401    | Invalid password |

---

### Transactions

All transaction endpoints require a JWT access token in the `Authorization` header:

```
Authorization: Bearer <access_token>
```

---

#### GET /transaction/my-account

Retrieve the authenticated user's profile and their linked bank account.

**Response 200**

```json
{
  "message": "User account found successfully",
  "data": {
    "user": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user"
    },
    "bankAccount": {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
      "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
      "accountNumber": "1234567890",
      "balance": 1500.0,
      "status": "active"
    }
  }
}
```

**Error Responses**

| Status | Condition              |
| ------ | ---------------------- |
| 404    | User not found         |
| 404    | Bank account not found |

---

#### POST /transaction/create-transaction-deposit

Deposit an amount into the authenticated user's account. A transaction record is created with status `pending`, the balance is updated, then the transaction is marked `success`.

**Request Body**

```json
{
  "amount": 500.0
}
```

| Field  | Type   | Required | Description            |
| ------ | ------ | -------- | ---------------------- |
| amount | number | Yes      | Must be greater than 0 |

**Business Rules**

- Account must be `active`
- Amount must be greater than 0

**Response 200**

```json
{
  "message": "Transaction completed successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "accountId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "receviedAccountId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "type": "deposit",
    "amount": 500.0,
    "balanceBefore": 1000.0,
    "balanceAfter": 1500.0,
    "status": "success",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Condition                  |
| ------ | -------------------------- |
| 404    | Bank account not found     |
| 400    | Amount is 0 or negative    |
| 400    | Bank account is not active |

---

#### POST /transaction/create-transaction-withdrawal

Withdraw an amount from the authenticated user's account.

**Request Body**

```json
{
  "amount": 200.0
}
```

| Field  | Type   | Required | Description                                   |
| ------ | ------ | -------- | --------------------------------------------- |
| amount | number | Yes      | Must be greater than 0 and not exceed balance |

**Business Rules**

- Account must be `active`
- Amount must be greater than 0
- Amount must not exceed current balance

**Response 200**

```json
{
  "message": "Transaction completed successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "accountId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "receviedAccountId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "type": "withdrawal",
    "amount": 200.0,
    "balanceBefore": 1500.0,
    "balanceAfter": 1300.0,
    "status": "success",
    "createdAt": "2024-01-15T11:30:00.000Z"
  }
}
```

**Error Responses**

| Status | Condition                           |
| ------ | ----------------------------------- |
| 409    | Bank account not found              |
| 400    | Insufficient balance or amount <= 0 |
| 400    | Bank account is not active          |

---

#### POST /transaction/create-transaction-transfer

Transfer funds from the authenticated user's account to another account identified by `receviedAccountNumber`.

**Request Body**

```json
{
  "amount": 100.0,
  "receviedAccountNumber": "9876543210"
}
```

| Field                 | Type   | Required | Description                     |
| --------------------- | ------ | -------- | ------------------------------- |
| amount                | number | Yes      | Must be greater than 0          |
| receviedAccountNumber | string | Yes      | Account number of the recipient |

**Business Rules**

- Sender account must be `active`
- Recipient account must be `active`
- Amount must be greater than 0
- Amount must not exceed the sender's balance

**Response 200**

```json
{
  "message": "Transaction completed successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "accountId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "receviedAccountId": "64f1a2b3c4d5e6f7a8b9c0d9",
    "type": "transfer",
    "amount": 100.0,
    "balanceBefore": 1300.0,
    "balanceAfter": 1200.0,
    "status": "success",
    "createdAt": "2024-01-15T12:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Condition                           |
| ------ | ----------------------------------- |
| 409    | Sender account not found            |
| 409    | Recipient account not found         |
| 400    | Insufficient balance or amount <= 0 |
| 400    | Sender account is not active        |
| 400    | Recipient account is not active     |

---

#### GET /transaction/get-transactions

Get paginated transaction history for the authenticated user's account, sorted newest first.

**Query Parameters**

| Parameter | Type   | Default | Description                |
| --------- | ------ | ------- | -------------------------- |
| page      | number | 1       | Page number                |
| limit     | number | 10      | Number of results per page |

**Example Request**

```
GET /transaction/get-transactions?page=1&limit=10
```

**Response 200**

```json
{
  "message": "Transactions fetched successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
      "accountId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "receviedAccountId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "type": "deposit",
      "amount": 500.0,
      "balanceBefore": 1000.0,
      "balanceAfter": 1500.0,
      "status": "success",
      "createdAt": "2024-01-15T11:00:00.000Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

**Error Responses**

| Status | Condition              |
| ------ | ---------------------- |
| 404    | Bank account not found |

---

#### GET /transaction/get-my-summary

Returns the 10 most recent transactions for the authenticated user. Intended for dashboard summary views.

**Response 200**

```json
{
  "message": "Transactions fetched successfully",
  "data": [
    {
      "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
      "accountId": "64f1a2b3c4d5e6f7a8b9c0d2",
      "receviedAccountId": "64f1a2b3c4d5e6f7a8b9c0d9",
      "type": "transfer",
      "amount": 100.0,
      "balanceBefore": 1300.0,
      "balanceAfter": 1200.0,
      "status": "success",
      "createdAt": "2024-01-15T12:00:00.000Z"
    }
  ],
  "pagination": {
    "limit": 10,
    "total": 1,
    "pages": 1
  }
}
```

**Error Responses**

| Status | Condition              |
| ------ | ---------------------- |
| 404    | Bank account not found |

---

#### GET /transaction/get-transaction/:id

Retrieve a single transaction by its MongoDB ObjectId.

**URL Parameters**

| Parameter | Type   | Description                         |
| --------- | ------ | ----------------------------------- |
| id        | string | MongoDB ObjectId of the transaction |

**Example Request**

```
GET /transaction/get-transaction/64f1a2b3c4d5e6f7a8b9c0d3
```

**Response 200**

```json
{
  "message": "Transaction fetched successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "accountId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "receviedAccountId": "64f1a2b3c4d5e6f7a8b9c0d2",
    "type": "deposit",
    "amount": 500.0,
    "balanceBefore": 1000.0,
    "balanceAfter": 1500.0,
    "status": "success",
    "createdAt": "2024-01-15T11:00:00.000Z"
  }
}
```

**Error Responses**

| Status | Condition             |
| ------ | --------------------- |
| 404    | Transaction not found |

---

### Admin

Admin endpoints require a Bearer token from a user with `role: "admin"`. The role check is performed server-side on every request.

```
Authorization: Bearer <admin_access_token>
```

> The `:id` URL parameter on admin routes is the **account number**, not the MongoDB `_id`.

---

#### POST /admin/make-account-inactive/:id

Deactivate a bank account by its account number. An inactive account is blocked from all transactions.

**URL Parameters**

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| id        | string | Account number (not MongoDB \_id) |

**Example Request**

```
POST /admin/make-account-inactive/1234567890
```

**Response 200**

```json
{
  "message": "Account made inactive successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "accountNumber": "1234567890",
    "balance": 1500.0,
    "status": "inactive"
  }
}
```

**Error Responses**

| Status | Condition                          |
| ------ | ---------------------------------- |
| 403    | Authenticated user is not an admin |
| 404    | Account not found                  |

---

#### POST /admin/make-account-active/:id

Reactivate a deactivated bank account by its account number.

**URL Parameters**

| Parameter | Type   | Description                       |
| --------- | ------ | --------------------------------- |
| id        | string | Account number (not MongoDB \_id) |

**Example Request**

```
POST /admin/make-account-active/1234567890
```

**Response 200**

```json
{
  "message": "Account made active successfully",
  "data": {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "userId": "64f1a2b3c4d5e6f7a8b9c0d1",
    "accountNumber": "1234567890",
    "balance": 1500.0,
    "status": "active"
  }
}
```

**Error Responses**

| Status | Condition                          |
| ------ | ---------------------------------- |
| 403    | Authenticated user is not an admin |
| 404    | Account not found                  |

---

## Error Handling

All errors follow a consistent response shape powered by the global `AppError` class:

```json
{
  "message": "Descriptive error message",
  "status": 400,
  "stack": "Error stack trace (development only)"
}
```

**HTTP Status Codes**

| Status | Meaning                                                         |
| ------ | --------------------------------------------------------------- |
| 200    | Success                                                         |
| 400    | Bad Request (validation, invalid amount, inactive account)      |
| 401    | Unauthorized (invalid credentials or token)                     |
| 403    | Forbidden (non-admin accessing admin route)                     |
| 404    | Not Found (user, account, or transaction)                       |
| 409    | Conflict (email exists, or account not found in transfer flows) |
| 429    | Too Many Requests                                               |
| 500    | Internal Server Error                                           |

**404 - Undefined Route**

```json
{
  "message": "Invalid URL /unknown with method GET not found",
  "status": 404
}
```

---

## Rate Limiting

Rate limiting is applied globally across all routes:

| Setting        | Value                 |
| -------------- | --------------------- |
| Window         | 15 minutes            |
| Max requests   | 100 per IP per window |
| Legacy headers | Disabled              |

**Response when limit is exceeded (HTTP 429)**

```json
{
  "message": "Too many requests, please try again later.",
  "status": 429
}
```

---

## Transaction Status Flow

Every transaction is created as `pending` and updated to `success` once all balance changes are persisted:

```
create transaction  →  status: pending
update balance(s)
update transaction  →  status: success
```

---

## Account Status Reference

| Status   | Can Transact | Set By                     |
| -------- | ------------ | -------------------------- |
| active   | Yes          | System (on signup) / Admin |
| inactive | No           | Admin                      |

---

## License

MIT

[Postman](https://mosalaha361-6851529.postman.co/workspace/Fakhr-Basha's-Workspace~317760f7-6833-4547-8924-25e283a22349/collection/49271050-ecb6cea1-85b9-4389-81da-54db8690d59e?action=share&source=copy-link&creator=49271050)
