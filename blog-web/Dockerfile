FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build -- --configuration production

FROM nginx:stable-alpine
# Copy the custom nginx configuration to handle SPA routing correctly
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/blog-web/browser /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
