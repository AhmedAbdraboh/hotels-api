FROM node:9.3-alpine

# Update
RUN apk update && apk upgrade

# Create app directory
RUN mkdir -p /app
WORKDIR /app

# Install app dependencies
COPY package.json /app/
RUN npm install

# Bundle app source
COPY . /app
