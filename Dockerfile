FROM node:14
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
#RUN node node_modules/db-migrate/bin/db-migrate up
CMD npm run start