FROM mcr.microsoft.com/playwright:v1.41.1-jammy

WORKDIR /app
COPY . .
RUN npm ci
RUN npx playwright install --with-deps
CMD [ "npx", "playwright", "test"]

