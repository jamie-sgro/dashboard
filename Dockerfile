# Base image
FROM node:12.2.0-alpine

# Set up working directory
WORKDIR /app

# add `/app/node_modules/.bin:$PATH
ENV PATH /app/node_modules/.bin/:$PATH

# Install and app dependencies
COPY package*.json ./

RUN npm install 

# Bundle app source
COPY . .

EXPOSE 3000

# Start app
CMD [ "npm", "run", "dev" ]