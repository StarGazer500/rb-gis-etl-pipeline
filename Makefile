docker-build:
	docker compose build

docker-up:
	docker compose up

docker-up-build:
	docker compose up --build

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f backend

docker-worker-logs:
	docker compose logs -f worker