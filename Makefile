# Makefile for Budget App

.PHONY: help install dev build start test lint format clean docker-up docker-down migrate seed studio

# Default target
.DEFAULT_GOAL := help

## help: Display this help message
help:
	@echo "Available targets:"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "\033[36m%-20s\033[0m %s\n", "Target", "Description"} /^[a-zA-Z_-]+:.*?##/ { printf "\033[36m%-20s\033[0m %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

## install: Install dependencies
install:
	npm install

## dev: Start development server (watch mode)
dev:
	npm run dev

## watch: Alias for dev (watch mode)
watch: dev

## build: Build application for production
build:
	npm run build

## start: Start production server (requires build first)
start:
	docker-compose -f docker/docker-compose.yml up --build --force-recreate -d app

down:
	docker-compose -f docker/docker-compose.yml down
up:
	docker-compose -f docker/docker-compose.yml down
	docker-compose -f docker/docker-compose.yml build --no-cache
	docker-compose -f docker/docker-compose.yml up -d
## test: Run all tests
test:
	npm test

## test-watch: Run tests in watch mode
test-watch:
	npm run test:watch

## test-coverage: Run tests with coverage report
test-coverage:
	npm run test:coverage

## test-unit: Run unit tests only
test-unit:
	npm run test:unit

## test-integration: Run integration tests only
test-integration:
	npm run test:integration

## test-e2e: Run end-to-end tests
test-e2e:
	npm run test:e2e

## lint: Lint code
lint:
	npm run lint

## lint-fix: Lint and fix code
lint-fix:
	npm run lint:fix

## format: Format code with Prettier
format:
	npm run format

## format-check: Check code formatting
format-check:
	npm run format:check

## clean: Clean build artifacts
clean:
	rm -rf .next
	rm -rf node_modules
	rm -rf coverage

## docker-up: Start Docker services
docker-up:
	docker-compose -f docker/docker-compose.yml up -d

## docker-down: Stop Docker services
docker-down:
	docker-compose -f docker/docker-compose.yml down

## migrate: Run database migrations
migrate:
	npm run prisma:migrate

## seed: Seed database
seed:
	npm run prisma:seed

## studio: Open Prisma Studio
studio:
	npm run prisma:studio

## setup: Setup project (install + docker + migrate + seed)
setup: install docker-up
	@echo "Waiting for database to be ready..."
	@sleep 3
	@$(MAKE) migrate
	@$(MAKE) seed
	@echo "Setup complete! Run 'make dev' to start development server."

## full-test: Run all tests and linting
full-test: lint test

## ci: Run CI checks (lint + test + build)
ci: lint test build
