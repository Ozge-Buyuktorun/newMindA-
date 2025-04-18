import { ServerResponse } from "http";

/**
 * Sends a successful JSON response with standardized format
 * 
 * @param res - HTTP server response object
 * @param data - Data payload to be included in the response
 * @param message - Success message to include in the response
 * @param statusCode - HTTP status code (defaults to 200 OK)
 */
export function sendJsonResponse<T>(
    res: ServerResponse,
    data: T,
    message = 'Operation successful',
    statusCode = 200
): void {
    // Set proper cache control headers
    res.writeHead(statusCode, { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
    });
    
    res.end(
        JSON.stringify({
            success: true,
            message,
            data,
            timestamp: new Date().toISOString()
        })
    );
}

/**
 * Sends an error JSON response with standardized format
 * 
 * @param res - HTTP server response object
 * @param message - Error message to include in the response
 * @param statusCode - HTTP status code (defaults to 500 Internal Server Error)
 * @param errorCode - Optional custom error code for client reference
 */
export function sendErrorResponse(
    res: ServerResponse,
    message = 'An error occurred on the server',
    statusCode = 500,
    errorCode?: string
): void {
    res.writeHead(statusCode, { 
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    
    res.end(
        JSON.stringify({
            success: false,
            message,
            errorCode: errorCode || `ERR_${statusCode}`,
            timestamp: new Date().toISOString(),
            data: null
        })
    );
}