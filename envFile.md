# How to Obtain an OpenWeatherMap API Key

You can follow these steps to get your OpenWeatherMap API key:

1. Visit the official OpenWeatherMap website: [https://openweathermap.org/](https://openweathermap.org/)
2. Click the **"Sign up"** button in the top right corner.
3. Fill out the registration form (email, password, username, etc.).
4. After signing up, you will receive a confirmation email. Click the link in the email to verify your account.
5. Once logged in, click your username in the top menu and select **"My API keys"** from the dropdown.
6. On this page, you will see an API key that has been automatically generated for you. You can copy this key.
7. Add the key to your project's `.env` file like this:

   ```env
   OPEN_WEATHER_API_KEY=your_api_key
