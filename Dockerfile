# Build stage
FROM node:18 AS build
WORKDIR /app

COPY conference-room-booking/package.json conference-room-booking/package-lock.json ./
RUN npm install

COPY conference-room-booking ./conference-room-booking
WORKDIR /app/conference-room-booking
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/conference-room-booking/build /usr/share/nginx/html
COPY conference-room-booking/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 