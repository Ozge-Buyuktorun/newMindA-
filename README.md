# ✅ Employee Management API

🚀 This project is a simple Node.js application that serves an Employee Management API. The API exposes endpoints to retrieve employee data, including the list of employees, the oldest employee, and the average salary of all employees.

## 🔹 Features

- **Employee List**: Returns a list of employees without salary information.
- **Oldest Employee**: Returns the details of the oldest employee.
- **Average Salary**: Calculates and returns the average salary of all employees.

## 🔹 Installation

1. Clone the repository:
    ```bash
    git clone <repository-url>
    ```

2. Navigate into the project directory:
    ```bash
    cd <project-directory>
    ```

3. Install the necessary dependencies:
    ```bash
    npm install
    ```

4. Start the server using nodemon for automatic reloading during development:
    ```bash
    npm run dev
    ```

## 🔹 API Endpoints

1. 🔥 **GET `/employeeList`**
    - Returns a list of all employees without salary information.
    - Example:
      ```json
      [
        {
          "name": "Gamze",
          "surname": "Bilgin",
          "email": "gamze.bilgin@aitechcorp.com",
          "position": "Machine Learning Specialist",
          "start_date": "2025-01-10"
        },
        ...
      ]
      ```

2. 🔥 **GET `/oldestEmployee`**
    - Returns the details of the oldest employee.
    - Example:
      ```json
      {
        "name": "Burak",
        "surname": "Öztürk",
        "email": "burak.öztürk@aitechcorp.com",
        "position": "Software Architect",
        "start_date": "2019-02-17",
        "salary": 175000
      }
      ```

3. 🔥 **GET `/averageSalary`**
    - Returns the average salary of all employees.
    - Example:
      ```json
      {
        "averageSalary": 120000
      }
      ```

## 🔹 File Structure

/public
 - styles.css # CSS file for styling the application /pages
 - index.html # Homepage HTML
 - products.html # Products page HTML
 - contact.html # Contact page HTML /data
 - employeeList.json # JSON file containing employee data
 - server.js # Main server file for handling routes and requests


## 🔹 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔹 Acknowledgements

- Thanks to all contributors for their support and ideas.
