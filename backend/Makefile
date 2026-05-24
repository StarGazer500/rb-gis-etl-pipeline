runserver:
	uvicorn src.main:app --host 0.0.0.0 --port 8080 --reload --reload-dir src

migrate:
	python -m alembic upgrade head

makemigrations:
	python -m alembic revision --autogenerate -m "$(name)"

downgrade:
	python -m alembic downgrade -1



celery:
	celery -A src.core.celery.celery_app worker --loglevel=info --concurrency=4