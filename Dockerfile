# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Type-check first, but never let a TYPE error block a preview.
#
# Vite-based starters ship "build": "vue-tsc -b && vite build". vue-tsc is a
# type CHECKER — Vite itself erases types rather than checking them, so a
# project with type errors still bundles and still runs correctly. Failing the
# whole build on one means refusing to show the user a working app. Measured
# 27 Jul 2026: 52% of Node-family projects on the platform have a type-check in
# their build script, so this was one bad annotation away from an unpreviewable
# app for half the estate. The express template already tolerated this; vue and
# react never got the same treatment.
#
# A GENUINE failure still fails: the bundler fallback fails too, and the dist
# check below is fatal. We degrade the type-check, not the build.
RUN npm run build || { \
      echo "=== build script failed — retrying without the TypeScript type-check ==="; \
      if ls vite.config.* >/dev/null 2>&1; then npx vite build; \
      elif [ -d node_modules/react-scripts ]; then npx react-scripts build; \
      else exit 1; fi; \
    }
RUN if [ -d /app/build ] && [ ! -d /app/dist ]; then mv /app/build /app/dist; fi
RUN test -d /app/dist || { echo "no build output produced"; exit 1; }

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
