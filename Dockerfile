# Building docker image from this project

FROM node:18

WORKDIR /app

# Install app dependencies

COPY package*.json ./
RUN npm install

# Copy application source files to /app directory

COPY . /app

# Expose PORT

EXPOSE 8000

# Command below runs build script and node dist/index.js to start server 

CMD ["npm", "start"]

# Then: build image --> docker build -t typescript-crud-app-image .
# Next: build + start container --> docker run -d -p 8000:8000 --name typescript-crud-app-container typescript-crud-app-image