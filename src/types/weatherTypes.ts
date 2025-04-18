// Response types
export interface WeatherResponse {
  success: boolean;
  data?: WeatherData;
  error?: string;
}

export interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity?: number;
  windSpeed?: number;
  icon?: string;
}

// OpenWeatherMap API Type
export interface OpenWeatherMapResponse {
  name: string;
  main: {
    temp: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
  };
  cod: number;
}
