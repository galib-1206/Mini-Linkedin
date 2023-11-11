FROM nginx:alpine

WORKDIR /var/www/html

COPY ./client/build/ .

COPY ./nginx.conf /etc/nginx/conf.d/default.conf