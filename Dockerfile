FROM node:15.5.1-alpine3.12

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY tsconfig.json .
COPY src src
RUN npm run build

EXPOSE 9090
CMD ["node", "./dist/src/main.js"]