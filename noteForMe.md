### Important Note For Me About This Project.
1. Package.json related notes:
    - package.json --> script.
    - description: We will wath the src folder and we will follow to '.ts, html, css,json' file. After every changes in all repo and code, this command run automatically. (ts-node src/index.ts)

        ```javascript
        "scripts": {
         "dev": "nodemon --watch src --ext ts,html,css,json --exec ts-node src/index.ts" 
        }
        ```
2. “Dockerize” → To put everything needed for the project to work in a container and remove external dependency.

3. 