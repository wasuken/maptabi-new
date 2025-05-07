.PHONY: fmt
fmt:
	docker compose exec frontend npm run format
	docker compose exec backend npm run format
