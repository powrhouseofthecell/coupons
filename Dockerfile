FROM node:18-alpine

WORKDIR /app/coupons

COPY . .

RUN rm -rf node_modules
RUN rm -rf dist
RUN npm install

RUN npm install -g pm2
RUN apk add curl
RUN pm2 -v
RUN curl -V

RUN npx tsc -b

CMD ["pm2-runtime", "dist/bin/www.js",  "&& pm2 logs"]
