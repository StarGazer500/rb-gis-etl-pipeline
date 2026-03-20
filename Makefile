runserver:
	uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload --reload-dir src

migrate:
	python -m alembic upgrade head

makemigrations:
	python -m alembic revision --autogenerate -m "$(name)"

downgrade:
	python -m alembic downgrade -1

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

worker:
	celery -A src.worker.celery_app.celery_app worker --loglevel=info --concurrency=4