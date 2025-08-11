# build stage
FROM node:22-bookworm-slim AS build
WORKDIR /app

# consume args (optional but nice)
ARG VERSION
ARG COMMIT
ARG BUILD_DATE
LABEL org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$COMMIT \
      org.opencontainers.image.created=$BUILD_DATE

COPY package*.json ./
RUN npm ci --no-audit --no-fund --legacy-peer-deps
COPY . .
RUN npm run build

# serve stage
FROM nginx:1.27-alpine
ARG VERSION
ARG COMMIT
ARG BUILD_DATE
LABEL org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.revision=$COMMIT \
      org.opencontainers.image.created=$BUILD_DATE

COPY --from=build /app/dist /usr/share/nginx/html
# (optional) SPA routing etc.
