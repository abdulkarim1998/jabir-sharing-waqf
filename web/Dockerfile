FROM node:16 as base
 
RUN npm i -g pnpm@8.3.1

FROM base as builder

WORKDIR /app

COPY package.json pnpm-lock* /app/

ENV NODE_ENV=production
ENV NODE_OPTIONS --max-old-space-size=8192

RUN --mount=type=secret,id=github,dst=/root/.npmrc pnpm install

COPY . /app/

RUN pnpm build

FROM nginx:1.23.0-alpine as prod

RUN rm -rf /etc/nginx/conf.d/*.conf
COPY ./nginx/custom.conf /etc/nginx/conf.d/custom.conf

COPY --from=builder /app/dist/ /usr/share/nginx/html

#This can be used in the production if we want to enable the nignx to serve the website
CMD ["nginx","-g","daemon off;"]
