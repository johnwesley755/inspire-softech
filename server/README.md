# E-Commerce Backend API

Backend server for the MERN E-Commerce Platform.

## Features

- RESTful API architecture
- JWT-based authentication
- Role-based access control (User/Admin)
- MongoDB database with Mongoose ODM
- Cloudinary integration for image storage
- Complete product management
- Shopping cart functionality
- Order processing and tracking
- Error handling and validation

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **File Upload**: Multer
- **Cloud Storage**: Cloudinary
- **Environment Variables**: dotenv

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Update `.env` with your credentials:
   - MongoDB connection string
   - JWT secret key
   - Cloudinary credentials

## Running the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)
- `POST /api/auth/logout` - Logout user (Protected)

### Products
- `GET /api/products` - Get all products (with pagination, filters)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Cart
- `GET /api/cart` - Get user cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get single order (Protected)
- `DELETE /api/orders/:id` - Cancel order (Protected)
- `GET /api/orders/admin/all` - Get all orders (Admin only)
- `PUT /api/orders/:id/status` - Update order status (Admin only)

## Environment Variables

```
PORT=5000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Database Models

- **User**: User accounts with role-based access
- **Product**: Product catalog with category references
- **Category**: Product categories
- **Cart**: User shopping carts
- **Order**: Order history and tracking

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_token>
```

## Error Handling

All errors are handled by a global error handler middleware that returns consistent JSON responses:

```json
{
  "success": false,
  "message": "Error message here"
}
```

## License

ISC
