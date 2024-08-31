# Select a base image
FROM node:22-alpine3.19

# Create a directory  and go to the directory 
WORKDIR /usr/src/belcorp-backend

# Copy the package.json file to my current directory to install the necessary dependence  
COPY package.json .
COPY package-lock.json .

# Install the dependence
RUN npm ci

# Copy other files to my current directory
COPY . .

# Open the port for the express server
EXPOSE $NODE_DOCKER_PORT

# Run express rum in the foreground
CMD ["npm", "run", "dev:api"]
