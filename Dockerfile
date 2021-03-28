FROM node:10-alpine3.11

# Create app directory
WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package.json ./

ENV NODE_ENV=development \
    PORT=3000 \
    MONGODB_URI=mongodb://localhost:27017 \
    DB_NAME=auth_tutorial \
    SECRETKEY=<XXXXXXXXXXX> \
    REFRESHKEY=<XXXXXXXXXXXXXXXX>

# Bind a log folder to preserve logs in the local
VOLUME /app/log

# Install app dependencies
RUN npm install

# Bundle app source
COPY . .

EXPOSE 3000

CMD [ "node", "app.js" ]