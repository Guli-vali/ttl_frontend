# Этап 1: сборка
FROM node:18-alpine as build
WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап 2: продакшн-сервер
FROM node:18-alpine
WORKDIR /app

COPY --from=build /app ./
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]