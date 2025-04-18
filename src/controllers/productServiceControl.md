# ProductService Class Documentation

## Overview

The `ProductService` class provides functionality to fetch product data from an external e-commerce API. It handles HTTP requests, processes URL parameters, and returns product information in various formats (single batch or top 100 products). The service implements pagination through offset parameters and uses parallel requests for efficient data retrieval.

## Key Features

- **Batch Retrieval**: Fetch products in batches of 10 using offset pagination
- **Bulk Data Fetching**: Ability to fetch top 100 products by making 10 parallel requests
- **Error Handling**: Robust error handling with descriptive error messages
- **URL Parsing**: Comprehensive URL parsing with debugging capabilities
- **Standardized Responses**: Consistent JSON response format for both success and error cases

## API Endpoints

The service responds to the following endpoints:

- **`/api/products?offset=X`**: Fetches a single batch of 10 products starting at the specified offset
- **`/api/top100products`**: Fetches the top 100 products (rated by descending order)

## Methods

### Public Methods

#### `fetchProducts(req, res)`

Main handler for incoming HTTP requests. It parses the URL, determines the appropriate action based on the path and parameters, and returns the requested product data.

- **Parameters**:
  - `req`: IncomingMessage - The HTTP request object
  - `res`: ServerResponse - The HTTP response object
- **Returns**: Promise<void>

### Private Methods

#### `fetchProductBatch(offset)`

Fetches a single batch of 10 products from the external API starting at the specified offset.

- **Parameters**:
  - `offset`: number - The starting index for pagination
- **Returns**: Promise<ProductResponse[]>

#### `fetchAllProductBatches()`

Fetches all product batches (top 100) by sending 10 parallel requests with different offsets.

- **Returns**: Promise<ProductResponse[]>

#### `sendJsonResponse(res, statusCode, data)`

Sends a JSON response with the specified HTTP status code.

- **Parameters**:
  - `res`: ServerResponse - The HTTP response object
  - `statusCode`: number - The HTTP status code
  - `data`: any - The data to be sent in the response body

#### `sendErrorResponse(res, statusCode, message)`

Sends a plain text error response with the specified HTTP status code.

- **Parameters**:
  - `res`: ServerResponse - The HTTP response object
  - `statusCode`: number - The HTTP status code
  - `message`: string - The error message

## Usage Example

```typescript
import http from 'http';
import ProductService from './services/ProductService';

const productService = new ProductService();
const server = http.createServer((req, res) => {
  if (req.url?.startsWith('/api/products') || req.url?.startsWith('/api/top100products')) {
    return productService.fetchProducts(req, res);
  }
  
  // Handle other routes...
});

server.listen(3000, () => {
  console.log('Server running at http://localhost:3000/');
});
```

## External Dependencies

- Native Node.js `http` module
- External API at `https://e-commerce-m3d4.onrender.com/products`

## Technical Implementation Details

1. The service uses the `URL` constructor for parsing request URLs
2. Product data is fetched using the Fetch API
3. Parallel requests are handled with `Promise.all()`
4. The service includes extensive debug logging for troubleshooting