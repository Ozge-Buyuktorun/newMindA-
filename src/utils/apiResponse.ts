import { ServerResponse } from "http";

// utils/apiResponse.ts
export function sendJsonResponse<T>(
    res: ServerResponse,
    data: T,
    message: string,
    statusCode = 200
) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            success: true,
            message,
            data,
        })
    );
}

export function sendErrorResponse(
    res: ServerResponse,
    message = 'A error is occured in Server',
    statusCode = 500
) {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(
        JSON.stringify({
            success: false,
            message,
            data: null,
        })
    );
}
