.PHONY: fmt test
fmt:
	docker compose exec frontend npm run format
	docker compose exec backend npm run format

test:
	docker compose exec backend npm test
