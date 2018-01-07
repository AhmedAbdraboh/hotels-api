FROM node:9.3-alpine

RUN apk update && apk upgrade

# Create app directory
RUN mkdir -p /app
WORKDIR /app

RUN npm install pm2 -g

# Install app dependencies
COPY package.json /app/
RUN npm install

# Bundle app source
COPY . /app

CMD ["pm2-docker", "index.js"]