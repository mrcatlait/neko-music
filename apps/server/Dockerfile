FROM node:24 AS base
WORKDIR /app

# Install moon binary
RUN curl -fsSL https://moonrepo.dev/install/moon.sh | bash
ENV PATH="/root/.moon/bin:/root/.proto/bin:$PATH"

FROM base AS skeleton

COPY . .
RUN moon docker scaffold server

FROM base AS build

COPY --from=skeleton /app/.moon/docker/configs .

RUN moon docker setup

COPY --from=skeleton /app/.moon/docker/sources .

RUN moon run server:build

# moon docker prune can omit the server workspace link; reinstall prod deps for npm workspaces.
RUN moon docker prune \
  && npm install --omit=dev

FROM gcr.io/distroless/nodejs24-debian13
WORKDIR /app

COPY --from=build /app .

CMD ["apps/server/dist/main.js"]
