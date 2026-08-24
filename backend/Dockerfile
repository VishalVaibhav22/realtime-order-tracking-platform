FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# prisma generate only reads the schema, but prisma.config.ts still resolves
# DATABASE_URL up front for any prisma command - the real value arrives
# later from docker-compose at container start, this placeholder just gets
# the build step past that check
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder"
RUN npx prisma generate

EXPOSE 3000

HEALTHCHECK --interval=10s --timeout=5s --start-period=20s --retries=5 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

# migrate deploy runs on every container start rather than at build time,
# since the database is only reachable once the container is actually
# running - it is safe to run from both api instances, prisma locks the
# migrations table while it applies anything pending
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
