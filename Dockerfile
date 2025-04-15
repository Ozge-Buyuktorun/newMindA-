#Main image
FROM node:23-slim

WORKDIR /nodejs-s1-proje
COPY package*.json ./
RUN npm install

# The other files copy. 
COPY . . 

#Port:3000 out port
EXPOSE 3000

# Since ts-node is installed for the development environment, we run it with ts-node
CMD ["npm", "run", "dev"]

# we will run for a one time. --> docker build -t my-node-app
# docker-compose up --build
# docker build -t employee-app .
# docker run -p 3000:3000 employee-app
