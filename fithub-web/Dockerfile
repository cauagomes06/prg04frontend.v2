# Etapa 1: Build do React
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine
# Copia os ficheiros gerados na pasta 'dist' para o Nginx
COPY --from=build /app/dist /usr/share/nginx/html
# Copia uma configuração básica do Nginx (vamos criar a seguir)
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]