import { IncomingMessage, ServerResponse } from "http";
import type { ProductResponse } from "../types/productService";
import * as url from "url";
import axios from "axios";

export default class ProductService {
  private readonly API_URL = "https://e-commerce-m3d4.onrender.com/products";

  /**
   * @summary Main request handler that routes to appropriate method based on URL
   *
   * This controller method is triggered by an incoming HTTP GET request.
   * It parses the URL and delegates to the right handler based on the path.
   *
   * @param req - Incoming HTTP request object.
   * @param res - HTTP server response object.
   */
  public handleRequest = async (
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> => {
    /** Important note about some async function in typescript:
     * When return is used in async methods in TypeScript,
     * the function terminates there and returns Promise<void>.
     */
    try {
      // Parse the URL
      const parsedUrl = url.parse(req.url || "", true);
      const pathname = parsedUrl.pathname;

      // Route to appropriate handler based on path
      if (pathname === "/api/top100products") {
        return this.handleTop100Products(req, res);
      } else if (pathname === "/api/products") {
        return this.handleProductsByOffset(req, res,parsedUrl);
      } else {
        // Handle unknown paths
        this.sendErrorResponse(res, 404, "Not Found");
      }
    } catch (err) {
      console.error("Error handling request:", err);
      this.sendErrorResponse(res, 500, "Internal Server Error");
    }
  };

  /**
   * @summary Handles requests to the /api/top100products endpoint
   *
   * This method fetches the top 100 products by making 10 parallel requests
   * to the external API and combines the results.
   *
   * @param req - Incoming HTTP request object.
   * @param res - HTTP server response object.
   */
  private handleTop100Products = async (
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> => {
    try {
      // Always fetch all products (top 100) for this endpoint
      const allProducts = await this.fetchAllProductBatches();

      this.sendJsonResponse(res, 200, {
        success: true,
        message: "Top 100 products fetched successfully",
        count: allProducts.length,
        products: allProducts,
      });
    } catch (err) {
      console.error("Error fetching top 100 products:", err);
      this.sendErrorResponse(res, 500, "Failed to fetch top 100 products");
    }
  };

  /**
   * @summary Handles requests to the /api/products endpoint with query parameters
   *
   * This method fetches products based on the provided parameters.
   *
   * @param req - Incoming HTTP request object.
   * @param res - HTTP server response object.
   * @param parsedUrl - Parsed URL object.
   */
  private handleProductsByOffset = async (
    req: IncomingMessage,
    res: ServerResponse,
    parsedUrl: url.UrlWithParsedQuery
  ): Promise<void> => {
    try {
      // Extract all query parameterss
      const offset = (parsedUrl.query.offset as string) || "0";
      const limit = (parsedUrl.query.limit as string) || "10";
      const sort = (parsedUrl.query.sort as string) || "rating:desc";

      console.log(
        `Query parameters: offset=${offset}, limit=${limit}, sort=${sort}`
      );

      // Convert to appropriate types
      const offsetNum = parseInt(offset, 10);
      const limitNum = parseInt(limit, 10);

      // Fetch products with the specified parameters
      const products = await this.fetchProductBatch(offsetNum, limitNum, sort);

      this.sendJsonResponse(res, 200, {
        success: true,
        message: `Products fetched successfully`,
        count: products.length,
        parameters: {
          offset: offsetNum,
          limit: limitNum,
          sort,
        },
        products,
      });
    } catch (err) {
      console.error("Error fetching products by parameters:", err);
      this.sendErrorResponse(res, 500, "Failed to fetch products");
    }
  };

  /**
   * @summary Fetches a batch of products from the external API with given parameters.
   *
   * @param offset - The offset value for pagination.
   * @param limit - The number of products to fetch per request (defaults to 10).
   * @param sort - The sorting parameter (defaults to 'rating:desc').
   * @returns A promise resolving to an array of product objects.
   * @throws An error if the API call fails.
   */
  private async fetchProductBatch(
    offset: number = 0,
    limit: number = 10,
    sort: string = "rating:desc"
  ): Promise<ProductResponse[]> {
    // Build the URL with query parameters
    const url = new URL(this.API_URL);
    url.searchParams.append("sort", sort);
    url.searchParams.append("limit", limit.toString());
    url.searchParams.append("offset", offset.toString());

    console.log(`Fetching from: ${url.toString()}`);

    const response = await axios.get(url.toString());
    return response.data;
  }

  /**
   * @summary Fetches all product batches (top 100) by sending parallel requests with offsets.
   * @returns A promise resolving to an array of all fetched products.
   */
  private async fetchAllProductBatches(): Promise<ProductResponse[]> {
    const numberOfRequests = 10;
    const productsPerRequest = 10;
    const fetchPromises: Promise<ProductResponse[]>[] = [];

    console.log(
      `Doing ${numberOfRequests} parallel requests to fetch top 100 products...`
    );

    // Create 10 fetch promises with different offsets: 0, 10, 20, ..., 90
    for (let i = 0; i < numberOfRequests; i++) {
      const offset = i * productsPerRequest;
      fetchPromises.push(this.fetchProductBatch(offset));
    }

    // Wait for all promises to resolve
    const batchResults = await Promise.all(fetchPromises);
    console.log(`All ${numberOfRequests} requests completed successfully`);

    // Combine all batch results into a single array
    const allProductData: ProductResponse[] = batchResults.flat();

    return allProductData;
  }

  /**
   * @summary Sends a JSON response with the specified HTTP status code.
   *
   * @param res - HTTP server response object.
   * @param statusCode - HTTP status code.
   * @param data - Data to be sent in the JSON body.
   */
  private sendJsonResponse(
    res: ServerResponse,
    statusCode: number,
    data: any
  ): void {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  /**
   * @summary Sends a plain text error response with the specified HTTP status code.
   *
   * @param res - HTTP server response object.
   * @param statusCode - HTTP status code.
   * @param message - Error message to send.
   */
  private sendErrorResponse(
    res: ServerResponse,
    statusCode: number,
    message: string
  ): void {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        success: false,
        message,
        data: null,
      })
    );
  }
}
