FROM node:18.20.7-alpine AS build
WORKDIR /app
COPY package*.json ./
EXPOSE 4200
RUN npm install -g @angular/cli
RUN npm install
COPY . .
CMD ng serve --host 0.0.0.0 --disable-host-check --port 4200
