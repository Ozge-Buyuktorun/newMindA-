import { IncomingMessage, ServerResponse } from "http";
import geoip from "geoip-lite";
import axios from 'axios';
import dotenv from "dotenv";
import type { WeatherData } from "../types/weatherTypes";
import type { OpenWeatherMapResponse } from "../types/weatherTypes";
import type { WeatherResponse } from "../types/weatherTypes";

// Load configuration from .env file
dotenv.config();

// OpenWeatherMap API key and URL
const WEATHER_API_KEY = process.env.OPEN_WEATHER_API_KEY;
const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export default class WeatherService {
  /**
   * Handles incoming requests for weather information
   *
   * @param req - Incoming HTTP request
   * @param res - HTTP response object
   */
  public handleRequest = async (
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> => {
    try {
      // Check URL path
      if (
        req.url === "/api/how-is-your-weather" ||
        req.url === "/api/weather"
      ) {
        return this.handleWeatherRequest(req, res);
      } else {
        this.sendErrorResponse(res, 404, "Not Found");
      }
    } catch (err) {
      console.error("Error handling weather request:", err);
      return this.sendErrorResponse(res, 500, "Internal Server Error");
    }
  };

  /**
   * Processes weather request and returns response
   *
   * @param req - Incoming HTTP request
   * @param res - HTTP response object
   */
  private handleWeatherRequest = async (
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> => {
    try {
      // Get client IP address
      const clientIp = this.getClientIp(req);

      if (!clientIp) {
        return this.sendErrorResponse(
          res,
          400,
          "Could not determine client IP address"
        );
      }

      console.log(`Client IP: ${clientIp}`);

      // Get location information from IP address
      const geoData = geoip.lookup(clientIp);

      if (!geoData || !geoData.ll || geoData.ll.length !== 2) {
        return this.sendErrorResponse(
          res,
          404,
          "Location not found for IP address"
        );
      }

      const [latitude, longitude] = geoData.ll;
      console.log(
        `Location found: ${geoData.city}, ${geoData.country} (${latitude}, ${longitude})`
      );

      // Get weather data using location coordinates
      const weatherData = await this.fetchWeatherData(latitude, longitude);

      // Send successful response
      this.sendJsonResponse(res, 200, {
        success: true,
        data: weatherData,
      });
    } catch (err) {
      console.error("Error processing weather request:", err);
      this.sendErrorResponse(res, 500, "Failed to fetch weather data");
    }
  };

  /**
   * Determines the client's IP address
   *
   * @param req - Incoming HTTP request
   * @returns Client IP address or null
   */
  private getClientIp = (req: IncomingMessage): string | null => {
    // Check X-Forwarded-For header (if behind proxy)
    const forwardedFor = req.headers["x-forwarded-for"];
    if (forwardedFor) {
      // Get the first IP if multiple are present
      const ips = Array.isArray(forwardedFor)
        ? forwardedFor[0]
        : forwardedFor.split(",")[0].trim();
      return ips;
    }

    // Get direct connection IP address
    /**
     * If there is no X-Forwarded-For header, 
     * it gets the IP address of the direct connection using the remoteAddress value provided by Node.js.
     */
    const ip = req.socket.remoteAddress;

    //For localhost/development environment, return a real IP for testing
    if (!ip || ip === "127.0.0.1" || ip === "::1" || ip === "localhost") {
      console.log("Using default IP for localhost development");
      return "8.8.8.8"; // Google DNS IP as an example - this will resolve to a real location
    }
    return ip;
  };

  /**
   * Fetches weather data for given coordinates
   *
   * @param lat - Latitude
   * @param lon - Longitude
   * @returns Weather data
   */
  private fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData> => {

    if (!WEATHER_API_KEY) {
      throw new Error("Weather API key is not configured");
    }
    const url = `${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`;
    console.log(`Fetching weather data from: ${url}`);

    try {
      const { data } = await axios.get<OpenWeatherMapResponse>(url);

      return {
        city: data.name,
        temperature: Math.round(data.main.temp * 10) / 10,
        condition: data.weather[0].main,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        icon: data.weather[0].icon,
      }
     }catch (error) {
        console.error("Error fetching weather data:", error);
        throw new Error("Failed to fetch weather data from API");
      }
    };

  /**
   * Sends a JSON response with success status
   *
   * @param res - HTTP response object
   * @param statusCode - HTTP status code
   * @param data - Data to be sent
   */
  private sendJsonResponse(
      res: ServerResponse,
      statusCode: number,
      data: WeatherResponse
    ): void {
    res.writeHead(statusCode, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
  }

  /**
   * Sends a JSON error response
   *
   * @param res - HTTP response object
   * @param statusCode - HTTP status code
   * @param message - Error message
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
        error: message,
        data: null,
      })
    );
  }
}



/** Some notes to me.
 *    Situations                              To Do
* TypeScript + ES Modules	      import axios from 'axios' + esModuleInterop: true
* CommonJS	                          const axios = require('axios')
 */