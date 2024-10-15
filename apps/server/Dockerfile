# Production
FROM node:20-alpine As production

# Install ffmpeg
RUN apk update && apk add ffmpeg

WORKDIR /app

# Set to production environment
ENV NODE_ENV production

# Copy only the necessary files
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Set Docker as non-root user
USER node

CMD [ "node", "dist/src/main.js" ]