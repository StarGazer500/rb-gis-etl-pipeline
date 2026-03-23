from celery import Celery
from celery.schedules import crontab
from celery.signals import worker_ready
from src.core.config import settings

celery_app = Celery(
    "gis_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
    include=[
        "src.features.etl.task",
    ],
)

@worker_ready.connect
def requeue_unacked_on_startup(sender, **kwargs):
    """Immediately requeue tasks that were in-progress when the worker last died."""
    try:
        import redis as redis_client
        r = redis_client.from_url(settings.REDIS_URL, decode_responses=True)
        tags = r.hkeys("unacked")
        if not tags:
            return
        with celery_app.connection_for_write() as conn:
            ch = conn.default_channel
            for tag in tags:
                try:
                    ch.qos.restore_by_tag(tag)
                except Exception:
                    pass
        print(f"[startup] Requeued {len(tags)} unacked task(s) from previous crash")
    except Exception as e:
        print(f"[startup] Could not requeue unacked tasks: {e}")



celery_app.conf.beat_schedule = {
    "etl-pipeline-daily": {
        "task": "etl_pipeline_task",
        "schedule": crontab(hour=8, minute=0),  # daily at 08:00 GMT
    },
}



celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="UTC",
    enable_utc=True,
    # Retry failed tasks after 60s, up to 3 times
    task_acks_late=True,
    task_reject_on_worker_lost=True,
    broker_connection_retry_on_startup=True,
)