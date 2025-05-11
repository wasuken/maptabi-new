.PHONY: fmt test up frontend-test backend-test lint backend-lint frontend-lint frontend-build precom
fmt:
	docker compose exec frontend npm run format
	docker compose exec backend npm run format

test:
	make frontend-test
	make backend-test

up:
	docker compose up -d

frontend-test:
	docker compose run --rm cypress

backend-test:
	docker compose exec backend npm test

lint:
	make frontend-lint
	make backend-lint

backend-lint:
	docker compose exec backend npm run lint

frontend-lint:
	docker compose exec frontend npm run lint

frontend-build:
	docker compose exec frontend npm run build

precom:
	make fmt
	make lint
	make frontend-build
	make test
