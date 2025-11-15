FROM node:16 AS base
 
RUN npm i -g pnpm@8.3.1

FROM base AS builder

WORKDIR /app

COPY package.json pnpm-lock* /app/

ENV NODE_ENV=production
ENV NODE_OPTIONS --max-old-space-size=8192

RUN --mount=type=secret,id=github,dst=/root/.npmrc pnpm install

COPY . /app/

RUN pnpm build

FROM node:16-alpine AS prod

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist/ /app/dist/

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
