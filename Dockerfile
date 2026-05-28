# Stage 1: Build Vite frontend
FROM node:22-alpine AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: PHP/Laravel backend
FROM php:8.3-cli

# Install PHP extensions needed by Laravel
RUN apt-get update && apt-get install -y \
    libzip-dev \
    unzip \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml ctype fileinfo zip \
    && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/local/bin/composer /usr/local/bin/composer

WORKDIR /app/backend

# Install PHP dependencies
COPY backend/composer.json backend/composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-interaction --no-scripts

# Copy backend source
COPY backend/ .

# Copy built frontend assets into Laravel public directory
COPY --from=frontend /app/dist/ ./public/
# Restore Laravel's index.php (overwritten by Vite's index.html)
COPY backend/public/index.php ./public/index.php
# Copy Vite's index.html as the SPA blade template
COPY --from=frontend /app/dist/index.html ./resources/views/spa.blade.php
# Copy images
COPY img/ ./public/img/

# Re-run composer scripts after all files are in place
RUN composer dump-autoload --optimize

EXPOSE 8000

CMD php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT:-8000}
